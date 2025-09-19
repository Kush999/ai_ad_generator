"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download, Heart, Save, Zap } from "lucide-react";
import Image from "next/image";

interface GenerateButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
  isDisabled: boolean;
  generatedImage?: string | null;
  onDownload?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export function GenerateButton({
  onGenerate,
  isGenerating,
  isDisabled,
  generatedImage,
  onDownload,
  onSave,
  isSaving = false,
  isSaved = false
}: GenerateButtonProps) {
  return (
    <Card className="p-8 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <Button
            onClick={onGenerate}
            disabled={isDisabled || isGenerating}
            size="lg"
            className="w-full h-14 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Creating Your Ad...
              </>
            ) : (
              <>
                <Zap className="mr-3 h-6 w-6" />
                Generate Advertisement
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="text-center space-y-3">
              <div className="text-sm text-muted-foreground">
                Our AI is crafting your perfect advertisement...
              </div>
              <div className="w-full bg-muted/50 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full animate-pulse w-2/3"></div>
              </div>
              <div className="text-xs text-muted-foreground">
                Usually takes 30-60 seconds
              </div>
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                <span>Advertisement Created!</span>
              </div>
            </div>
            
            <div className="border border-border/50 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={generatedImage}
                  alt="Generated advertisement"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              {onSave && (
                <Button
                  onClick={onSave}
                  disabled={isSaving || isSaved}
                  variant={isSaved ? "outline" : "default"}
                  className="flex-1 h-12 rounded-full font-medium"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <Heart className="mr-2 h-5 w-5 fill-current text-red-500" />
                      Saved to Gallery
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Ad
                    </>
                  )}
                </Button>
              )}
              
              {onDownload && (
                <Button
                  onClick={onDownload}
                  variant="outline"
                  className="flex-1 h-12 rounded-full font-medium border-2 hover:bg-accent"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
