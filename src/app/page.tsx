"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Target, Zap, Star, ArrowRight, Upload, Palette, Download, Users, Award, BarChart3, Check, X } from "lucide-react";
import { ImageComparison } from "@/components/ui/image-comparison-slider";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  // No automatic redirect - allow signed-in users to view landing page

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (user) {
      // If user is signed in, go to dashboard
      router.push('/dashboard');
    } else {
      // If user is not signed in, show auth modal
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-foreground">AdCraft Studio</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Success Stories</a>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user ? (
                // Signed-in user navigation
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={handleGetStarted}
                    className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    Go to Dashboard
                  </Button>
                  <UserMenu />
                </div>
              ) : (
                // Anonymous user navigation
                <Button 
                  onClick={handleGetStarted}
                  className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Award className="h-4 w-4" />
            <span>Trusted by marketing professionals worldwide</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[0.95]">
            <span className="text-foreground">Create </span>
            <span className="text-gradient">stunning ads</span>
            <span className="text-foreground block mt-2">in seconds</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your product images into professional advertisements that convert. 
            Our AI understands what makes ads perform and delivers results that exceed expectations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {user ? "Go to Dashboard" : "Start Creating Ads"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 rounded-full border-2 hover:bg-accent transition-all duration-200"
            >
              View Success Stories
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">3x</div>
              <div className="text-muted-foreground">Higher Conversion Rates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">60%</div>
              <div className="text-muted-foreground">Faster Ad Creation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
              <div className="text-muted-foreground">Ads Generated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section 
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Used by marketing teams at leading companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center justify-items-center opacity-60">
            {['Amazon', 'Shopify', 'Nike', 'Apple', 'Tesla', 'Meta'].map((company) => (
              <div key={company} className="text-xl font-semibold text-muted-foreground">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From product photo to 
            <span className="text-gradient block">converting ad</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI understands marketing psychology and creates ads that actually convert
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center border-0 shadow-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-4">1. Upload Product Image</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Upload your product photo and our AI analyzes the best angles, lighting, and composition for maximum impact
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center border-0 shadow-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-4">2. Choose Campaign Style</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Select from proven ad styles: e-commerce, luxury, lifestyle, or minimal - each optimized for different markets
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center border-0 shadow-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-4">3. Launch & Convert</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Download your professional ad ready for any platform - proven to increase click-through rates by 300%
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Before & After Showcase */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              See the 
              <span className="text-gradient"> transformation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Drag the slider to see how our AI transforms ordinary product photos into high-converting advertisements
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* E-commerce Product */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-center mb-6">E-commerce Product</h3>
              <ImageComparison
                beforeImage="/placeholder-before-1.jpg"
                afterImage="/placeholder-after-1.jpg"
                altBefore="Plain product photo on white background"
                altAfter="Enhanced product photo with professional lighting and styling"
              />
              <p className="text-sm text-muted-foreground text-center">
                From basic product shot to conversion-optimized ad
              </p>
            </div>

            {/* Lifestyle Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-center mb-6">Lifestyle Brand</h3>
              <ImageComparison
                beforeImage="/placeholder-before-2.jpg"
                afterImage="/placeholder-after-2.jpg"
                altBefore="Casual lifestyle photo"
                altAfter="Professional lifestyle ad with enhanced colors and composition"
              />
              <p className="text-sm text-muted-foreground text-center">
                Casual lifestyle shot transformed into compelling brand ad
              </p>
            </div>

            {/* Luxury Product */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-center mb-6">Luxury Product</h3>
              <ImageComparison
                beforeImage="/placeholder-before-3.jpg"
                afterImage="/placeholder-after-3.jpg"
                altBefore="Standard luxury product photo"
                altAfter="Premium luxury ad with sophisticated styling and lighting"
              />
              <p className="text-sm text-muted-foreground text-center">
                Standard luxury shot elevated to premium advertisement
              </p>
            </div>

            {/* Minimalist Design */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-center mb-6">Minimalist Design</h3>
              <ImageComparison
                beforeImage="/placeholder-before-4.jpg"
                afterImage="/placeholder-after-4.jpg"
                altBefore="Simple minimalist product photo"
                altAfter="Clean minimalist ad with perfect composition and subtle enhancements"
              />
              <p className="text-sm text-muted-foreground text-center">
                Clean minimal design optimized for maximum impact
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-muted-foreground mb-6">
              Every image is automatically optimized for maximum conversion potential
            </p>
            <Button 
              onClick={handleGetStarted}
              className="text-lg px-8 py-4 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Try It Yourself <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for 
              <span className="text-gradient"> marketing teams</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every feature designed to help you create ads that convert better and faster
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Lightning Fast Generation</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Create professional ads in under 30 seconds. No more waiting days for design teams or expensive agencies.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Conversion Optimized</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Our AI is trained on millions of high-converting ads to understand what makes people click and buy.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Brand Consistency</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Maintain your brand identity across all campaigns with customizable styles that match your aesthetic.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Team Collaboration</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Share, review, and iterate on ad creatives with your team. Perfect for agencies and marketing teams.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">Multi-Platform Ready</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Generate ads optimized for Facebook, Instagram, Google Ads, and any other platform you're advertising on.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Download className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl mb-3">High-Res Downloads</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Download your ads in any format and resolution you need. From social media to billboards, we've got you covered.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose your 
            <span className="text-gradient"> perfect plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start creating stunning ads for free, then upgrade when you're ready to scale your marketing
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-border/50 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-2xl mb-2">Free Starter</CardTitle>
              <CardDescription className="text-base">Perfect for trying out AdCraft Studio</CardDescription>
              <div className="mt-6">
                <div className="text-4xl font-bold mb-2">$0</div>
                <div className="text-muted-foreground">Forever free</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">50 free credits (5 generations)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">Download images in high resolution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">All professional ad styles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-base text-muted-foreground">Save ads to gallery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="text-base text-muted-foreground">Team collaboration</span>
                </div>
              </div>
              <Button 
                onClick={handleGetStarted}
                className="w-full h-12 rounded-full font-semibold bg-muted hover:bg-muted/80 text-foreground border-2 border-border"
                variant="outline"
              >
                {user ? "Go to Dashboard" : "Start Free"}
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-2 border-primary shadow-xl bg-card/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            </div>
            <CardHeader className="text-center pb-8 pt-12">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">Pro Creator</CardTitle>
              <CardDescription className="text-base">For serious marketers and businesses</CardDescription>
              <div className="mt-6">
                <div className="text-4xl font-bold mb-2">$10</div>
                <div className="text-muted-foreground">One-time payment</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base font-medium">1,000 credits (100 generations)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base font-medium">Save ads to your gallery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">Download in any format & resolution</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">All professional ad styles</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">Edit & organize your ads</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-base">Priority generation speed</span>
                </div>
              </div>
              <Button 
                onClick={handleGetStarted}
                className="w-full h-12 rounded-full font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              >
                {user ? "Go to Dashboard" : "Upgrade to Pro"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional features note */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include access to our AI-powered ad generation, professional templates, and regular updates
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            AdCraft Studio is made 
            <span className="text-gradient block">for you</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center mb-16">
          {[
            'E-commerce Teams',
            'Marketing Agencies', 
            'Social Media Managers',
            'Brand Managers',
            'Growth Marketers'
          ].map((role) => (
            <div key={role} className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium text-center">
              {role}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
            "AdCraft Studio transformed our entire creative workflow. What used to take our team days now takes minutes. 
            Our conversion rates increased by 285% after switching to AI-generated ads."
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Sarah Chen</div>
              <div className="text-muted-foreground">Marketing Director, TechFlow</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to create ads that 
              <span className="text-gradient"> convert?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of marketing professionals who are already using AdCraft Studio 
              to create better ads faster.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-10 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {user ? "Go to Dashboard" : "Start Creating Ads for Free"} <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              50 free credits to start • $10 for 1,000 credits
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary/10 p-2 rounded-full">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold">AdCraft Studio</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm mb-2">
                © 2025 AdCraft Studio. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Professional AI-powered ad generation for modern marketing teams
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal - only show for non-authenticated users */}
      {!user && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}