import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageUrls, style } = await request.json();

    if (!prompt || !imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt and imageUrls are required' },
        { status: 400 }
      );
    }

    if (!process.env.FAL_KEY) {
      console.error('FAL_KEY is not configured');
      return NextResponse.json(
        { error: 'Image generation service is not configured' },
        { status: 500 }
      );
    }

    // Create a comprehensive prompt based on the style and user input
    const stylePrompts = {
      'Luxury': 'Generate a luxury Instagram ad of this product with dramatic spotlight lighting, glossy reflections, dark black background, and elegant serif typography.',
      'Minimalist': 'Create a minimalist ad of this product with a clean white background, soft shadows, lots of negative space, and modern sans-serif text.',
      'Bold & Vibrant': 'Design a bold ad of this product with bright neon colors, geometric patterns, and large playful typography that instantly grabs attention.',
      'Lifestyle': 'Generate a lifestyle ad showing this product being used naturally in a cozy, aspirational real-world environment, with warm lighting and authentic candid vibes.',
      'Retro / Vintage': 'Create a vintage-style ad of this product with grainy film textures, retro color grading, and nostalgic fonts reminiscent of 70s print ads.',
      'Playful / Cartoonish': 'Make a fun cartoon-inspired ad of this product with doodles, bright hand-drawn elements, and cheerful playful fonts.',
      'Eco / Natural': 'Generate a nature-inspired ad of this product with earthy tones, plants, wooden textures, and organic fonts for a sustainable eco vibe.',
      'Tech / Futuristic': 'Create a futuristic ad of this product with glowing neon edges, holographic effects, and high-tech typography on a sleek dark background.',
      'Holiday / Festive': 'Design a festive ad of this product with Christmas lights, cozy holiday decor, red and green color palette, and cheerful seasonal typography.',
      'Meme-Style': 'Place this product inside a trending meme template with bold Impact font text, humorous context, and viral social media style.',
      '3D Cinematic Render': 'Generate a hyper-realistic 3D cinematic render of this product with dramatic studio lighting, glossy reflections, and ultra-detailed textures.',
      'Magazine Editorial': 'Create a fashion-magazine style ad of this product with glossy textures, minimal high-end typography, and a sophisticated editorial layout.'
    };

    const stylePrompt = stylePrompts[style as keyof typeof stylePrompts] || 'Create a stylish advertisement of this product';
    const fullPrompt = `${stylePrompt} ${prompt}`;

    console.log('Generating image with prompt:', fullPrompt);
    console.log('Image URLs:', imageUrls);

    // Call the fal-ai nano-banana API
    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: fullPrompt,
        image_urls: imageUrls,
        num_images: 1,
        output_format: "jpeg"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log('Generation result:', result);

    if (!result.data || !result.data.images || result.data.images.length === 0) {
      return NextResponse.json(
        { error: 'No image was generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: result.data.images[0].url,
      description: result.data.description || 'Generated advertisement image',
      requestId: result.requestId
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Handle specific fal-ai errors
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your FAL_KEY configuration.' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
