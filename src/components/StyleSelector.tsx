"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const imageStyles = [
  {
    id: "photorealistic",
    name: "Photorealistic",
    description: "High-quality, realistic photo style",
    preview: "📸"
  },
  {
    id: "artistic",
    name: "Artistic",
    description: "Creative and artistic interpretation",
    preview: "🎨"
  },
  {
    id: "cartoon",
    name: "Cartoon",
    description: "Fun cartoon-style illustration",
    preview: "🎭"
  },
  {
    id: "watercolor",
    name: "Watercolor",
    description: "Soft watercolor painting style",
    preview: "🖌️"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean and simple design",
    preview: "⚪"
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Retro and nostalgic feel",
    preview: "📻"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic neon aesthetic",
    preview: "🌆"
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    description: "Classical oil painting style",
    preview: "🖼️"
  }
] as const;

export type ImageStyle = typeof imageStyles[number]['id'];

interface StyleSelectorProps {
  selectedStyle: ImageStyle | null;
  onStyleSelect: (style: ImageStyle) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Label className="text-base font-medium">
          Choose Art Style
        </Label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {imageStyles.map((style) => (
            <Button
              key={style.id}
              variant={selectedStyle === style.id ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center gap-2 text-center"
              onClick={() => onStyleSelect(style.id)}
            >
              <span className="text-2xl" role="img" aria-label={style.name}>
                {style.preview}
              </span>
              <div className="space-y-1">
                <div className="font-medium text-sm">{style.name}</div>
                <div className="text-xs opacity-70 leading-tight">
                  {style.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        {selectedStyle && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <span className="font-medium">Selected:</span>{" "}
              {imageStyles.find(s => s.id === selectedStyle)?.name}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
