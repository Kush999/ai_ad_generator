import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY!
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!process.env.FAL_KEY) {
      console.error('FAL_KEY is not configured');
      return NextResponse.json(
        { error: 'Upload service is not configured' },
        { status: 500 }
      );
    }

    // Upload file to fal storage
    const url = await fal.storage.upload(file);
    
    console.log('Uploaded file to fal storage:', url);

    return NextResponse.json({
      success: true,
      url: url
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    
    return NextResponse.json(
      { error: 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
