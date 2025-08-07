-- Create resources table
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'link', 'database', 'publication', 'report', 'guide', 'dataset', 'tool')),
  category TEXT NOT NULL,
  file_url TEXT,
  external_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  access_level TEXT NOT NULL DEFAULT 'free' CHECK (access_level IN ('free', 'subscription', 'restricted')),
  download_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active resources" ON public.resources FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admins can insert resources" ON public.resources FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update resources" ON public.resources FOR UPDATE USING (true);
CREATE POLICY "Admins can delete resources" ON public.resources FOR DELETE USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create resources storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Storage policies for resources
CREATE POLICY "Anyone can view resource files" ON storage.objects FOR SELECT USING (bucket_id = 'resources');
CREATE POLICY "Admins can upload resource files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resources');
CREATE POLICY "Admins can update resource files" ON storage.objects FOR UPDATE USING (bucket_id = 'resources');
CREATE POLICY "Admins can delete resource files" ON storage.objects FOR DELETE USING (bucket_id = 'resources');

-- Insert some sample resources
INSERT INTO public.resources (title, description, type, category, external_url, author, tags, access_level) VALUES
('International Court of Justice Database', 'Comprehensive database of ICJ cases, judgments, and advisory opinions with full-text search capabilities.', 'database', 'International Courts', 'https://www.icj-cij.org/en/decisions', 'CILG Team', ARRAY['ICJ', 'Judgments', 'International Law', 'Court Decisions'], 'free'),
('Climate Change and International Law: A Comprehensive Guide', 'CILG''s latest publication examining the legal frameworks governing climate action and environmental protection.', 'publication', 'Environmental Law', NULL, 'Dr. Michael Chen, Prof. Sarah Johnson', ARRAY['Climate Law', 'Environmental Protection', 'Paris Agreement', 'Research'], 'free'),
('Global Human Rights Monitoring System', 'Interactive tool for tracking human rights developments and violations across different jurisdictions.', 'tool', 'Human Rights', 'https://example.com/human-rights-monitor', 'CILG Research Team', ARRAY['Human Rights', 'Monitoring', 'Data Visualization', 'Global'], 'subscription'),
('International Trade Agreements Database', 'Searchable collection of bilateral and multilateral trade agreements with analytical tools.', 'database', 'Trade Law', 'https://example.com/trade-agreements', 'CILG Database Team', ARRAY['Trade Agreements', 'WTO', 'Investment', 'Economics'], 'free'),
('Digital Rights Research Report 2023', 'Annual report on the state of digital rights globally, including privacy, surveillance, and internet governance.', 'report', 'Digital Rights', NULL, 'Dr. Emma Rodriguez', ARRAY['Digital Rights', 'Privacy', 'Internet Governance', 'Technology'], 'free'),
('International Criminal Law Case Law Analyzer', 'AI-powered tool for analyzing patterns and trends in international criminal law jurisprudence.', 'tool', 'International Criminal Law', 'https://example.com/icl-analyzer', 'CILG AI Research Team', ARRAY['Criminal Law', 'AI Analysis', 'Jurisprudence', 'Research Tool'], 'restricted'),
('Refugee Protection Legal Framework Guide', 'Practical guide for legal practitioners working with refugee protection and asylum cases.', 'guide', 'Refugee Law', NULL, 'Dr. Aisha Patel', ARRAY['Refugee Law', 'Legal Practice', 'Asylum', 'Protection'], 'free'),
('International Governance Indicators Dataset', 'Comprehensive dataset tracking governance indicators across international organizations and institutions.', 'dataset', 'Global Governance', NULL, 'CILG Data Team', ARRAY['Governance', 'Data', 'International Organizations', 'Indicators'], 'subscription');
