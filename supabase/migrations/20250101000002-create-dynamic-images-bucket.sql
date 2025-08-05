-- Create dynamic-images storage bucket for multiple home page images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dynamic-images',
  'dynamic-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Set up RLS policies for dynamic-images bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'dynamic-images');

CREATE POLICY "Authenticated users can upload dynamic images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'dynamic-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update dynamic images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'dynamic-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete dynamic images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'dynamic-images' 
    AND auth.role() = 'authenticated'
  );

-- Create table to store dynamic image configurations
CREATE TABLE IF NOT EXISTS dynamic_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  position VARCHAR(50) NOT NULL, -- 'hero', 'about', 'research-area-1', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default dynamic image configurations
INSERT INTO dynamic_images (name, display_name, description, position) VALUES
  ('hero_image', 'Hero Image', 'Main hero image displayed at the top of the homepage', 'hero'),
  ('about_image', 'About Section Image', 'Image displayed in the about section', 'about'),
  ('about_story_image', 'About Story Image', 'Image displayed in the Our Story section of the About page', 'about-story'),
  ('research_area_1', 'Research Area 1', 'Image for International Criminal Law section', 'research-area-1'),
  ('research_area_2', 'Research Area 2', 'Image for Human Rights Law section', 'research-area-2'),
  ('research_area_3', 'Research Area 3', 'Image for Conflict Resolution section', 'research-area-3');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_dynamic_images_updated_at 
    BEFORE UPDATE ON dynamic_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 