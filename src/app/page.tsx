"use client";

import { useState } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { StyleSelector, ImageStyle } from "@/components/StyleSelector";
import { GenerateButton } from "@/components/GenerateButton";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ImageStyle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { user, loading } = useAuth();

  const handleGenerate = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedImage || !selectedStyle) return;
    
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2">AI Image Generator</h1>
            <p className="text-muted-foreground text-lg">
              Upload an image, choose a style, and generate amazing AI artwork
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu />
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2">
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
              
              {!user && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sign in to generate images
                  </p>
                  <Button onClick={() => setShowAuthModal(true)}>
                    Sign In
                  </Button>
                </div>
              )}
              
              {user && isGenerateDisabled && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Please upload an image and select a style to generate
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    </div>
  );
}
