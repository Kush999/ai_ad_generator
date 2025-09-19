"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { StyleSelector, ImageStyle } from "@/components/StyleSelector";
import { GenerateButton } from "@/components/GenerateButton";
import { SavedImages } from "@/components/SavedImages";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tabs } from "lucide-react";
import { database, storage } from "@/lib/database";

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

  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Reset save state when generating new image or changing inputs
  useEffect(() => {
    setIsSaved(false);
    setSaveTitle("");
  }, [selectedImage, selectedStyle, generatedImage]);

  const handleGenerate = async () => {
    if (!selectedImage || !selectedStyle || !user) return;
    
    setIsGenerating(true);
    setIsSaved(false);
    
    try {
      // TODO: Implement actual image generation API call
      // This is a placeholder - you'll need to integrate with your image generation service
      console.log("Generating image with style:", selectedStyle);
      console.log("Source image:", selectedImage.name);
      console.log("User:", user.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, set a placeholder generated image
      setGeneratedImage("https://via.placeholder.com/512x512?text=Generated+Image");
      
      // Set default save title
      const timestamp = new Date().toLocaleString();
      setSaveTitle(`${selectedStyle.name} - ${timestamp}`);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedImage || !selectedImage || !selectedStyle || !user || !saveTitle.trim()) return;
    
    setIsSaving(true);
    try {
      // Upload original image to storage
      const { data: originalImageUrl, error: uploadError } = await storage.uploadOriginalImage(selectedImage, user.id);
      
      if (uploadError) {
        console.error("Error uploading original image:", uploadError);
        return;
      }

      // Save the ad to database
      const { data, error } = await database.saveAd(user.id, {
        title: saveTitle.trim(),
        original_image_url: originalImageUrl!,
        generated_image_url: generatedImage,
        style: selectedStyle.name,
        prompt: `Generated ${selectedStyle.name} style image`
      });

      if (error) {
        console.error("Error saving ad:", error);
      } else {
        setIsSaved(true);
        setRefreshKey(prev => prev + 1); // Trigger refresh of saved images
        console.log("Ad saved successfully:", data);
      }
    } catch (error) {
      console.error("Error saving ad:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      // TODO: Implement actual download functionality
      console.log("Downloading image:", generatedImage);
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
              <p className="text-muted-foreground text-lg">
                Upload an image, choose a style, and generate amazing AI artwork
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'generate' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('generate')}
              className="rounded-md"
            >
              Generate Images
            </Button>
            <Button
              variant={activeTab === 'saved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('saved')}
              className="rounded-md"
            >
              Saved Images
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
                    <Label htmlFor="save-title">Save Title</Label>
                    <Input
                      id="save-title"
                      value={saveTitle}
                      onChange={(e) => setSaveTitle(e.target.value)}
                      placeholder="Enter a title for your generated image"
                      className="w-full"
                    />
                  </div>
                )}
                
                <GenerateButton
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  isDisabled={isGenerateDisabled}
                  generatedImage={generatedImage}
                  onDownload={handleDownload}
                  onSave={generatedImage ? handleSave : undefined}
                  isSaving={isSaving}
                  isSaved={isSaved}
                />
                
                {isGenerateDisabled && (
                  <div className="text-center p-6 bg-muted rounded-lg border-2 border-dashed">
                    <p className="text-muted-foreground mb-4">
                      Please upload an image and select a style to generate your AI artwork
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedImage ? 'bg-green-500' : 'bg-gray-300'}`} />
                        Image {selectedImage ? 'uploaded' : 'required'}
                      </div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${selectedStyle ? 'bg-green-500' : 'bg-gray-300'}`} />
                        Style {selectedStyle ? 'selected' : 'required'}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedImage && selectedStyle && !generatedImage && (
                  <div className="text-center p-6 bg-primary/5 rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-2">
                      Ready to generate! Click the button above to create your AI artwork.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SavedImages key={refreshKey} onRefresh={() => setRefreshKey(prev => prev + 1)} />
          )}
        </div>
      </div>
    </div>
  );
}
