-- Create settings table for global website configuration
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default hero image setting
INSERT INTO public.website_settings (key, value) 
VALUES ('hero_image_url', '/src/assets/hero-image.jpg')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to settings
CREATE POLICY "Public read access to settings" ON public.website_settings
    FOR SELECT USING (true);

-- Allow authenticated users to update settings
CREATE POLICY "Authenticated users can update settings" ON public.website_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert settings
CREATE POLICY "Authenticated users can insert settings" ON public.website_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_website_settings_updated_at 
    BEFORE UPDATE ON public.website_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 