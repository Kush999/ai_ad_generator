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
      'Modern': 'Create a modern, clean, minimalist advertisement with sleek design elements',
      'Vintage': 'Create a vintage-style advertisement with retro colors and classic typography',
      'Bold': 'Create a bold, eye-catching advertisement with vibrant colors and strong contrasts',
      'Elegant': 'Create an elegant, sophisticated advertisement with refined aesthetics',
      'Playful': 'Create a playful, fun advertisement with bright colors and dynamic elements',
      'Professional': 'Create a professional, corporate-style advertisement with clean lines'
    };

    const stylePrompt = stylePrompts[style as keyof typeof stylePrompts] || 'Create a stylish advertisement';
    const fullPrompt = `${stylePrompt}. ${prompt}. Make it look like a professional advertisement with the product prominently featured.`;

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
