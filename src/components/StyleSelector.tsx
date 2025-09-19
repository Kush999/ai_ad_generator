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
      <div className="space-y-6">
        <Label className="text-lg font-semibold">
          Choose Art Style
        </Label>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {imageStyles.map((style) => (
            <div
              key={style.id}
              className="relative"
            >
              <Button
                variant={selectedStyle === style.id ? "default" : "outline"}
                className={`
                  w-full h-20 p-3 flex flex-col items-center justify-center
                  border-2 transition-all duration-200 hover:shadow-md
                  ${selectedStyle === style.id 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                    : 'bg-card hover:bg-accent border-border hover:border-primary/50'
                  }
                `}
                onClick={() => onStyleSelect(style.id)}
              >
                <span className="text-2xl mb-1" role="img" aria-label={style.name}>
                  {style.preview}
                </span>
                <span className="text-xs font-medium text-center leading-tight">
                  {style.name}
                </span>
              </Button>
              
            </div>
          ))}
        </div>
        
        {selectedStyle && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-primary font-medium">Selected Style:</span>
              <span className="font-semibold">
                {imageStyles.find(s => s.id === selectedStyle)?.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {imageStyles.find(s => s.id === selectedStyle)?.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
