"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sparkles, Image, Zap, Star, ArrowRight, Upload, Palette, Download } from "lucide-react";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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

  // Don't render anything if user is authenticated (redirecting)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">AI Image Generator</span>
          </div>
          <Button onClick={() => setShowAuthModal(true)}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transform Your Images with AI Magic
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upload any image and transform it into stunning artwork with our advanced AI technology. 
            Choose from various artistic styles and watch your creativity come to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowAuthModal(true)}
              className="text-lg px-8 py-6"
            >
              Start Creating <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
            >
              View Examples
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>1. Upload Your Image</CardTitle>
              <CardDescription>
                Upload any image from your device to get started
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>2. Choose a Style</CardTitle>
              <CardDescription>
                Select from various artistic styles and effects
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>3. Download & Share</CardTitle>
              <CardDescription>
                Get your AI-generated artwork and share with the world
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our AI Generator?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Generate stunning images in seconds with our optimized AI models
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Image className="h-8 w-8 text-primary mb-2" />
              <CardTitle>High Quality</CardTitle>
              <CardDescription>
                Get professional-grade results with crisp, detailed artwork
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Palette className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multiple Styles</CardTitle>
              <CardDescription>
                Choose from dozens of artistic styles and effects
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Star className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Easy to Use</CardTitle>
              <CardDescription>
                Simple interface that anyone can master in minutes
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Sparkles className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI Powered</CardTitle>
              <CardDescription>
                Latest AI technology for the best possible results
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Download className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Free Downloads</CardTitle>
              <CardDescription>
                Download your creations in high resolution for free
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Art?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators who are already using our AI image generator 
            to bring their ideas to life.
          </p>
          <Button 
            size="lg" 
            onClick={() => setShowAuthModal(true)}
            className="text-lg px-8 py-6"
          >
            Get Started for Free <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">AI Image Generator</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 AI Image Generator. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}