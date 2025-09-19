# Database Setup Instructions

## Overview

This guide will help you set up the database tables and storage for your AI Ad Generator app using Supabase.

## Prerequisites

- A Supabase project set up with your environment variables configured
- Authentication already working (users can sign up/sign in)

## Database Setup

### 1. Run the Migration SQL

Copy and paste the contents of `supabase-migration.sql` into your Supabase SQL Editor and run it. This will:

- Create the `generated_ads` table to store user-generated images
- Set up proper Row Level Security (RLS) policies to ensure users only see their own data
- Create indexes for better performance
- Set up the storage bucket for user images
- Configure storage policies for user access

### 2. Storage Configuration

The migration automatically creates a storage bucket called `user-images` with the following structure:
```
user-images/
  ├── {user-id}/
  │   ├── {timestamp}-original.{ext}  # Original uploaded images
  │   └── ...
```

### 3. Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional, for admin operations
```

## Features Implemented

### ✅ User Authentication
- Users must be signed in to access the dashboard
- Each user only sees their own generated images

### ✅ Image Generation & Saving
- Upload images and select styles
- Generate AI images (placeholder implementation)
- Save generated images with custom titles
- Automatic upload of original images to storage

### ✅ Saved Images Management
- View all saved images in a grid layout
- Edit image titles inline
- Mark images as favorites
- Download saved images
- Delete saved images
- Search and filter capabilities

### ✅ Dashboard Interface
- Tabbed interface: "Generate Images" and "Saved Images"
- Responsive design
- Real-time updates when saving new images

## Database Schema

### `generated_ads` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `user_id` | UUID | Foreign key to `auth.users` |
| `title` | TEXT | User-defined title for the image |
| `original_image_url` | TEXT | URL to the uploaded original image |
| `generated_image_url` | TEXT | URL to the AI-generated image |
| `style` | TEXT | Style used for generation |
| `prompt` | TEXT | Optional prompt used (nullable) |
| `is_favorite` | BOOLEAN | Whether user marked as favorite |
| `created_at` | TIMESTAMP | When the record was created |
| `updated_at` | TIMESTAMP | When the record was last updated |

### Security Features

- **Row Level Security (RLS)**: Users can only access their own records
- **Storage Policies**: Users can only upload/access files in their own folder
- **Input Validation**: All database operations validate user permissions

## Next Steps

### 1. Integrate Real AI Image Generation
Replace the placeholder in `handleGenerate` function in `/src/app/dashboard/page.tsx` with your actual AI image generation service (OpenAI DALL-E, Midjourney, Replicate, etc.).

### 2. Implement Actual Download
Update the download functionality in `SavedImages.tsx` to properly handle image downloads.

### 3. Add More Features
- Image editing capabilities
- Batch operations
- Advanced filtering and search
- Image sharing capabilities
- Usage analytics

## Troubleshooting

### Common Issues

1. **Storage bucket not found**: Make sure to run the migration SQL to create the storage bucket
2. **Permission denied**: Check that RLS policies are properly set up
3. **Images not loading**: Verify storage bucket is set to public
4. **Auth errors**: Ensure environment variables are correctly set

### Testing the Setup

1. Sign up/sign in to your app
2. Upload an image and select a style
3. Generate an image (will show placeholder)
4. Enter a title and save the image
5. Switch to "Saved Images" tab to see your saved image
6. Test editing, favoriting, and deleting images

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Ensure all environment variables are set correctly
4. Check that the migration SQL ran successfully
