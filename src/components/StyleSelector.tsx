"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const imageStyles = [
  {
    id: "luxury",
    name: "Luxury",
    description: "Dramatic spotlight lighting with glossy reflections and elegant typography",
    preview: "💎"
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean white background with soft shadows and modern typography",
    preview: "⚪"
  },
  {
    id: "bold-vibrant",
    name: "Vibrant",
    description: "Bright neon colors with geometric patterns and playful typography",
    preview: "🎨"
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Natural product usage in cozy, aspirational real-world environments",
    preview: "🏠"
  },
  {
    id: "retro-vintage",
    name: "Retro Style",
    description: "Grainy film textures with retro color grading and nostalgic fonts",
    preview: "📻"
  },
  {
    id: "playful-cartoonish",
    name: "Playful",
    description: "Fun cartoon-inspired with doodles and bright hand-drawn elements",
    preview: "🎭"
  },
  {
    id: "eco-natural",
    name: "Eco / Natural",
    description: "Earthy tones with plants, wooden textures, and organic fonts",
    preview: "🌿"
  },
  {
    id: "tech-futuristic",
    name: "Futuristic",
    description: "Glowing neon edges with holographic effects and high-tech typography",
    preview: "🚀"
  },
  {
    id: "holiday-festive",
    name: "Festive",
    description: "Christmas lights with cozy holiday decor and seasonal typography",
    preview: "🎄"
  },
  {
    id: "meme-style",
    name: "Meme-Style",
    description: "Trending meme template with bold Impact font and viral social media style",
    preview: "😂"
  },
  {
    id: "3d-cinematic",
    name: "3D Cinematic",
    description: "Hyper-realistic 3D render with dramatic studio lighting and detailed textures",
    preview: "🎬"
  },
  {
    id: "magazine-editorial",
    name: "Magazine",
    description: "Fashion-magazine style with glossy textures and sophisticated editorial layout",
    preview: "📰"
  },
  {
    id: "ugc",
    name: "UGC",
    description: "User-generated content style showing real people using the product in authentic settings",
    preview: "👤"
  }
] as const;

export type ImageStyle = typeof imageStyles[number]['id'];

interface StyleSelectorProps {
  selectedStyle: ImageStyle | null;
  onStyleSelect: (style: ImageStyle) => void;
}

export function StyleSelector({ selectedStyle, onStyleSelect }: StyleSelectorProps) {
  return (
    <Card className="p-8">
      <div className="space-y-12">
        <Label className="text-xl font-bold">
          Choose Art Style
        </Label>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {imageStyles.map((style) => (
            <div
              key={style.id}
              className="relative"
            >
              <Button
                variant={selectedStyle === style.id ? "default" : "outline"}
                className={`
                  w-full h-20 p-4 flex flex-col items-center justify-center gap-2
                  border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]
                  ${selectedStyle === style.id 
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card hover:bg-accent border-border hover:border-primary/50'
                  }
                `}
                onClick={() => onStyleSelect(style.id)}
              >
                <span className="text-3xl" role="img" aria-label={style.name}>
                  {style.preview}
                </span>
                <span className="text-xs font-semibold text-center leading-tight px-1 break-words max-w-full">
                  {style.name}
                </span>
              </Button>
              
            </div>
          ))}
        </div>
        
        {selectedStyle && (
          <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-primary font-semibold text-lg">Selected Style:</span>
              <span className="font-bold text-lg">
                {imageStyles.find(s => s.id === selectedStyle)?.name}
              </span>
            </div>
            <p className="text-base text-muted-foreground mt-3">
              {imageStyles.find(s => s.id === selectedStyle)?.description}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
