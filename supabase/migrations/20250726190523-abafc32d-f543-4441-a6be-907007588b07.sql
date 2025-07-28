-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT,
  category TEXT,
  excerpt TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cosmopolitan_bulletins table
CREATE TABLE public.cosmopolitan_bulletins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_email TEXT NOT NULL,
  author_name TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosmopolitan_bulletins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for blog_posts (public can read approved posts, admins can manage all)
CREATE POLICY "Anyone can view approved blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can submit blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (true);

-- Create RLS policies for cosmopolitan_bulletins
CREATE POLICY "Anyone can view approved bulletins" 
ON public.cosmopolitan_bulletins 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "Anyone can submit bulletins" 
ON public.cosmopolitan_bulletins 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all bulletins" 
ON public.cosmopolitan_bulletins 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update bulletins" 
ON public.cosmopolitan_bulletins 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete bulletins" 
ON public.cosmopolitan_bulletins 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cosmopolitan_bulletins_updated_at
BEFORE UPDATE ON public.cosmopolitan_bulletins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();