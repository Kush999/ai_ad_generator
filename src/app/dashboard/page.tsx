"use client";

import { useState, useEffect } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { StyleSelector, ImageStyle } from "@/components/StyleSelector";
import { GenerateButton } from "@/components/GenerateButton";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Dashboard() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect unauthenticated users to landing page
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGenerate = async () => {
    if (!selectedImage || !selectedStyle || !user) return;
    
    setIsGenerating(true);
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
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGenerating(false);
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

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
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
              <GenerateButton
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                isDisabled={isGenerateDisabled}
                generatedImage={generatedImage}
                onDownload={handleDownload}
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
        </div>
      </div>
    </div>
  );
}
