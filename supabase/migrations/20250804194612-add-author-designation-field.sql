-- Add author_designation column to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN author_designation TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN blog_posts.author_designation IS 'Author''s designation/title (e.g., Professor, Researcher, Student)'; 