"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles, Download, Heart, Save } from "lucide-react";
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
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <Button
            onClick={onGenerate}
            disabled={isDisabled || isGenerating}
            size="lg"
            className="w-full h-12 text-base font-medium"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Image
              </>
            )}
          </Button>
          
          {isGenerating && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">
                This may take 30-60 seconds...
              </div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse w-1/3"></div>
              </div>
            </div>
          )}
        </div>

        {generatedImage && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="relative aspect-square max-w-md mx-auto">
                <Image
                  src={generatedImage}
                  alt="Generated image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {onSave && (
                <Button
                  onClick={onSave}
                  disabled={isSaving || isSaved}
                  variant={isSaved ? "outline" : "default"}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <Heart className="mr-2 h-4 w-4 fill-current text-red-500" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Image
                    </>
                  )}
                </Button>
              )}
              
              {onDownload && (
                <Button
                  onClick={onDownload}
                  variant="secondary"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
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
