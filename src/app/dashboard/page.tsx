"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { StyleSelector, ImageStyle, imageStyles } from "@/components/StyleSelector";
import { GenerateButton } from "@/components/GenerateButton";
import { SavedImages } from "@/components/SavedImages";
import { UserMenu } from "@/components/auth/UserMenu";
import { CreditsDisplay } from "@/components/CreditsDisplay";
import { PurchaseCreditsModal } from "@/components/PurchaseCreditsModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { database, storage } from "@/lib/database";
import { Logo } from "@/components/Logo";

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [activeTab, setActiveTab] = useState<'generate' | 'saved'>('generate');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [creditsRefreshKey, setCreditsRefreshKey] = useState(0);

  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Reset save state when changing inputs (but not when generating new image)
  useEffect(() => {
    setIsSaved(false);
    setSaveTitle("");
  }, [selectedImage, selectedStyle]);

  // Handle payment success/failure from Stripe
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success') {
      console.log('Payment successful! Session ID:', sessionId);
      
      // Refresh credits display (credits are added by webhook)
      setCreditsRefreshKey(prev => prev + 1);
      
      // Clean up URL parameters
      router.replace('/dashboard');
    } else if (paymentStatus === 'cancelled') {
      console.log('Payment was cancelled by user');
      
      // Show cancelled message
      alert('Payment was cancelled. You can try again anytime from the credits section.');
      
      // Clean up URL parameters
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  const handleGenerate = async () => {
    if (!selectedImage || !selectedStyle || !user) return;
    
    setIsGenerating(true);
    setIsSaved(false);
    setGeneratedImage(null);
    
    try {
      console.log("Generating image with style:", selectedStyle);
      console.log("Source image:", selectedImage.name);
      console.log("User:", user.email);
      
      // First, deduct credits before generating
      console.log("Deducting 10 credits for image generation...");
      const { data: updatedProfile, error: creditError } = await database.deductCredits(user.id, 10);
      
      if (creditError) {
        console.error("Error deducting credits:", creditError);
        if (creditError.message === 'Insufficient credits') {
          alert('❌ You don\'t have enough credits to generate an image. You need 10 credits per generation.');
          setShowPurchaseModal(true);
          return;
        } else {
          alert('Failed to process credits. Please try again.');
          return;
        }
      }
      
      console.log("Credits deducted successfully. Remaining credits:", updatedProfile?.credits);
      
      // Refresh credits display
      setCreditsRefreshKey(prev => prev + 1);
      
      // Step 1: Upload the image to fal storage
      const formData = new FormData();
      formData.append('file', selectedImage);
      
      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }
      
      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url;
      
      console.log('Image uploaded to:', imageUrl);
      
      // Step 2: Generate the image using the fal-ai API
      const generateResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Transform this product image into an attractive ${imageStyles.find(s => s.id === selectedStyle)?.name.toLowerCase() || selectedStyle} style advertisement`,
          imageUrls: [imageUrl],
          style: imageStyles.find(s => s.id === selectedStyle)?.name || selectedStyle
        }),
      });
      
      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
      
      const generateData = await generateResponse.json();
      
      console.log('Generated image:', generateData);
      
      // Step 3: Set the generated image and reset save state
      setGeneratedImage(generateData.imageUrl);
      setIsSaved(false); // Reset save state for new image
      
      // Set default save title
      const timestamp = new Date().toLocaleString();
      const styleName = imageStyles.find(s => s.id === selectedStyle)?.name || selectedStyle;
      const newTitle = `${styleName} Ad - ${timestamp}`;
      setSaveTitle(newTitle);
      
      console.log('Generated image successfully:', {
        imageUrl: generateData.imageUrl,
        newTitle: newTitle,
        style: styleName
      });
      
    } catch (error) {
      console.error("Error generating image:", error);
      
      // Refund credits if generation failed
      try {
        console.log("Refunding 10 credits due to generation failure...");
        await database.addCredits(user.id, 10);
        setCreditsRefreshKey(prev => prev + 1);
        console.log("Credits refunded successfully");
      } catch (refundError) {
        console.error("Error refunding credits:", refundError);
      }
      
      // You might want to show a toast notification or error message to the user
      alert(`Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    // Debug logging to help identify the issue
    console.log('Save validation check:', {
      generatedImage: !!generatedImage,
      selectedImage: !!selectedImage,
      selectedStyle: !!selectedStyle,
      user: !!user,
      saveTitle: saveTitle,
      saveTitleTrimmed: saveTitle.trim()
    });

    if (!generatedImage) {
      alert('No generated image to save. Please generate an image first.');
      return;
    }
    if (!selectedImage) {
      alert('Original image is missing. Please upload an image and regenerate.');
      return;
    }
    if (!selectedStyle) {
      alert('Style is missing. Please select a style and regenerate.');
      return;
    }
    if (!user) {
      alert('You must be logged in to save images.');
      return;
    }
    if (!saveTitle.trim()) {
      alert('Please enter a title for your advertisement.');
      return;
    }
    
    setIsSaving(true);
    try {
      // Upload original image to storage
      const { data: originalImageUrl, error: uploadError } = await storage.uploadOriginalImage(selectedImage, user.id);
      
      if (uploadError) {
        console.error("Error uploading original image:", uploadError);
        alert('Failed to upload original image. Please try again.');
        return;
      }

      // Save the ad to database
      const { data, error } = await database.saveAd(user.id, {
        title: saveTitle.trim(),
        original_image_url: originalImageUrl!,
        generated_image_url: generatedImage,
        style: imageStyles.find(s => s.id === selectedStyle)?.name || selectedStyle,
        prompt: `Generated ${imageStyles.find(s => s.id === selectedStyle)?.name || selectedStyle} style image`
      });

      if (error) {
        console.error("Error saving ad:", error);
        alert('Failed to save advertisement. Please try again.');
      } else {
        setIsSaved(true);
        setRefreshKey(prev => prev + 1); // Trigger refresh of saved images
        console.log("Ad saved successfully:", data);
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      alert('An unexpected error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Create a meaningful filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const styleName = imageStyles.find(s => s.id === selectedStyle)?.name || selectedStyle || 'advertisement';
      a.download = `${styleName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  const isGenerateDisabled = !selectedImage || !selectedStyle;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirecting)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-6">
            {/*<Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 hover:bg-accent rounded-full px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>*/}
            <div className="text-left">
              <div className="mb-2">
                <Logo size="lg" />
              </div>
              <p className="text-muted-foreground text-lg">
                Transform your products into high-converting advertisements
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CreditsDisplay 
              key={creditsRefreshKey}
              onPurchaseClick={() => setShowPurchaseModal(true)} 
            />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-muted/50 p-1 rounded-full border border-border/50">
            <Button
              variant={activeTab === 'generate' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('generate')}
              className="rounded-full px-6 py-2 font-medium"
            >
              Create Ads
            </Button>
            <Button
              variant={activeTab === 'saved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('saved')}
              className="rounded-full px-6 py-2 font-medium"
            >
              Ad Gallery
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'generate' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <ImageUploader
                  onImageSelect={setSelectedImage}
                  selectedImage={selectedImage}
                />
                
                <StyleSelector
                  selectedStyle={selectedStyle}
                  onStyleSelect={setSelectedStyle}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Save Title Input (shown when image is generated) */}
                {generatedImage && (
                  <div className="space-y-2">
                    <Label htmlFor="save-title" className="text-sm font-medium">Advertisement Title</Label>
                    <Input
                      id="save-title"
                      value={saveTitle}
                      onChange={(e) => setSaveTitle(e.target.value)}
                      placeholder="Enter a title for your advertisement"
                      className="w-full rounded-xl border-border/50 focus:border-primary"
                    />
                  </div>
                )}
                
                <GenerateButton
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  isDisabled={isGenerateDisabled}
                  generatedImage={generatedImage}
                  selectedStyle={selectedStyle}
                  onDownload={handleDownload}
                  onSave={generatedImage ? handleSave : undefined}
                  isSaving={isSaving}
                  isSaved={isSaved}
                />
                
                {isGenerateDisabled && (
                  <div className="text-center p-8 bg-muted/50 rounded-2xl border border-border/50">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to create your ad?</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your product image and select an ad style to get started
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedImage ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={selectedImage ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                          Product image {selectedImage ? 'uploaded' : 'required'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${selectedStyle ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className={selectedStyle ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
                          Ad style {selectedStyle ? 'selected' : 'required'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedImage && selectedStyle && !generatedImage && (
                  <div className="text-center p-6 bg-primary/5 rounded-2xl border border-primary/20">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Everything looks good!</h3>
                    <p className="text-sm text-muted-foreground">
                      Click the button above to generate your professional advertisement
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SavedImages 
              refreshTrigger={refreshKey} 
              onRefresh={() => setRefreshKey(prev => prev + 1)} 
            />
          )}
        </div>
      </div>

      {/* Purchase Credits Modal */}
      <PurchaseCreditsModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onPurchaseComplete={() => {
          setCreditsRefreshKey(prev => prev + 1);
        }}
      />
    </div>
  );
}
