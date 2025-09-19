-- Create the generated_ads table
CREATE TABLE IF NOT EXISTS generated_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_image_url TEXT NOT NULL,
  generated_image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  prompt TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS generated_ads_user_id_idx ON generated_ads(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS generated_ads_created_at_idx ON generated_ads(created_at DESC);

-- Create an index on favorites for filtering
CREATE INDEX IF NOT EXISTS generated_ads_favorites_idx ON generated_ads(user_id, is_favorite) WHERE is_favorite = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE generated_ads ENABLE ROW LEVEL SECURITY;

-- Create policy to ensure users can only access their own ads
CREATE POLICY "Users can only access their own ads" ON generated_ads
  FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for user images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-images', 'user-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for user images
CREATE POLICY "Users can upload their own images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'user-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generated_ads_updated_at 
  BEFORE UPDATE ON generated_ads 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
