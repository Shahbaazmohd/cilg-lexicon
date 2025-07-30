-- Add featured_order field to blog_posts table for reordering functionality
ALTER TABLE public.blog_posts 
ADD COLUMN featured_order INTEGER;

-- Create an index on featured_order for better performance
CREATE INDEX idx_blog_posts_featured_order ON public.blog_posts(featured_order);

-- Update existing featured posts with order values
-- This will set featured_order based on creation date (newest first)
UPDATE public.blog_posts 
SET featured_order = subquery.row_num
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.blog_posts 
  WHERE featured = true AND status = 'approved'
) as subquery
WHERE public.blog_posts.id = subquery.id;

-- Add a constraint to ensure featured_order is unique for featured posts
-- This will be enforced at the application level for better control 