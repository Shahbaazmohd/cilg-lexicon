-- Create notices table for link-based notices
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link_url TEXT NOT NULL,
  link_text VARCHAR(255) NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_notices_active ON public.notices (is_active, priority DESC);
CREATE INDEX IF NOT EXISTS idx_notices_featured ON public.notices (featured, created_at DESC);

-- Enable Row Level Security for notices table
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notices table
CREATE POLICY "Anyone can view active notices" 
ON public.notices 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can submit notices" 
ON public.notices 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all notices" 
ON public.notices 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update notices" 
ON public.notices 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can delete notices" 
ON public.notices 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notices_updated_at
BEFORE UPDATE ON public.notices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample notices data
INSERT INTO public.notices (title, description, link_url, link_text, category, priority, is_active, featured)
VALUES
  ('Important Academic Calendar Update', 'Updated academic calendar for the current semester with revised dates for examinations and events.', 'https://example.com/academic-calendar', 'View Academic Calendar', 'academic', 1, true, true),
  
  ('Research Grant Opportunities', 'New research grant opportunities available for faculty and students in international law and governance.', 'https://example.com/research-grants', 'Apply for Grants', 'research', 2, true, true),
  
  ('Student Registration Portal', 'Online registration portal for new and returning students. Complete your registration before the deadline.', 'https://example.com/registration', 'Register Now', 'student', 3, true, false),
  
  ('Faculty Development Workshop', 'Upcoming workshop on innovative teaching methodologies and research techniques.', 'https://example.com/faculty-workshop', 'Register for Workshop', 'faculty', 2, true, false);
