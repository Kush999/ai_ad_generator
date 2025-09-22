"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Download, Copy } from "lucide-react";
import { imageStyles, ImageStyle } from "@/components/StyleSelector";

interface InstagramPreviewProps {
  imageUrl: string;
  selectedStyle: ImageStyle;
  onDownload?: () => void;
}

// Generate Instagram caption with hashtags based on style
const generateCaption = (style: ImageStyle): string => {
  const styleData = imageStyles.find(s => s.id === style);
  const styleName = styleData?.name || style;

  const baseHashtags = [
    "#advertisement", "#marketing", "#branding", "#productphotography", 
    "#digitalmarketing", "#socialmediamarketing", "#branddesign", "#creative"
  ];

  const styleSpecificHashtags: { [key: string]: string[] } = {
    'luxury': ["#luxury", "#premium", "#elegance", "#sophisticated", "#highend", "#glamour"],
    'minimalist': ["#minimalist", "#clean", "#simple", "#modern", "#sleek", "#minimal"],
    'bold-vibrant': ["#bold", "#vibrant", "#colorful", "#eyecatching", "#dynamic", "#energetic"],
    'lifestyle': ["#lifestyle", "#authentic", "#reallife", "#cozy", "#aspirational", "#everyday"],
    'retro-vintage': ["#retro", "#vintage", "#nostalgic", "#throwback", "#classic", "#timeless"],
    'playful-cartoonish': ["#playful", "#fun", "#cartoon", "#creative", "#whimsical", "#cheerful"],
    'eco-natural': ["#eco", "#natural", "#sustainable", "#green", "#organic", "#ecofriendly"],
    'tech-futuristic': ["#tech", "#futuristic", "#innovation", "#digital", "#modern", "#cutting-edge"],
    'holiday-festive': ["#holiday", "#festive", "#celebration", "#seasonal", "#christmas", "#cozy"],
    'meme-style': ["#meme", "#viral", "#funny", "#trending", "#humor", "#socialmedia"],
    '3d-cinematic': ["#3d", "#cinematic", "#realistic", "#render", "#professional", "#studio"],
    'magazine-editorial': ["#editorial", "#magazine", "#fashion", "#sophisticated", "#glossy", "#highfashion"],
    'ugc': ["#ugc", "#usergenerated", "#authentic", "#reallife", "#candid", "#genuine", "#everyday", "#relatable"]
  };

  const specificTags = styleSpecificHashtags[style] || [];
  const allHashtags = [...specificTags, ...baseHashtags].slice(0, 12);

  const captions = [
    `✨ Bringing your product to life with stunning ${styleName.toLowerCase()} aesthetics! Ready to elevate your brand? 🚀`,
    `🎨 Transform your marketing game with this ${styleName.toLowerCase()} design approach. What do you think? 💭`,
    `📸 When creativity meets strategy - this ${styleName.toLowerCase()} style hits different! 🔥`,
    `💡 Your product deserves to shine! This ${styleName.toLowerCase()} aesthetic is pure magic ✨`,
    `🌟 Scroll-stopping content starts with the right visual approach. Love this ${styleName.toLowerCase()} vibe! 💫`
  ];

  const randomCaption = captions[Math.floor(Math.random() * captions.length)];
  return `${randomCaption}\n\n${allHashtags.join(' ')}`;
};

export function InstagramPreview({ imageUrl, selectedStyle, onDownload }: InstagramPreviewProps) {
  const [caption, setCaption] = useState<string>("");
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showFullCaption, setShowFullCaption] = useState<boolean>(false);
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  useEffect(() => {
    setCaption(generateCaption(selectedStyle));
    setLikes(Math.floor(Math.random() * 1000) + 100); // Random likes between 100-1100
  }, [selectedStyle]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  const displayCaption = showFullCaption ? caption : caption.substring(0, 150) + (caption.length > 150 ? "..." : "");

  return (
    <Card className="max-w-md mx-auto bg-card border border-border overflow-hidden">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
          <div>
            <p className="font-semibold text-sm">adcraft.studio</p>
            <p className="text-xs text-muted-foreground">AI-Generated Ad</p>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Image */}
      <div className="relative aspect-square">
        <img 
          src={imageUrl} 
          alt="Generated advertisement"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="hover:opacity-70 transition-opacity">
              <Heart 
                className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} 
              />
            </button>
            <MessageCircle className="h-6 w-6 text-foreground hover:opacity-70 transition-opacity cursor-pointer" />
            <Send className="h-6 w-6 text-foreground hover:opacity-70 transition-opacity cursor-pointer" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="p-1 h-auto"
            >
              <Download className="h-5 w-5" />
            </Button>
            <Bookmark className="h-6 w-6 text-foreground hover:opacity-70 transition-opacity cursor-pointer" />
          </div>
        </div>

        {/* Likes */}
        <p className="font-semibold text-sm mb-2">{likes.toLocaleString()} likes</p>

        {/* Caption */}
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-semibold">adcraft.studio</span>{" "}
            <span className="whitespace-pre-wrap">{displayCaption}</span>
            {caption.length > 150 && (
              <button 
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="text-muted-foreground ml-1 hover:opacity-70"
              >
                {showFullCaption ? "less" : "more"}
              </button>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyCaption}
            className="w-full mt-3"
          >
            <Copy className="h-4 w-4 mr-2" />
            {copiedCaption ? "Caption Copied!" : "Copy Caption"}
          </Button>
        </div>

        {/* Comments */}
        <div className="mt-3 space-y-1">
          <p className="text-sm text-muted-foreground">View all 12 comments</p>
          <div className="text-xs text-muted-foreground">2 hours ago</div>
        </div>
      </div>
    </Card>
  );
}
