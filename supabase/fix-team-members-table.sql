-- Fix Team Members Table Setup (Run this in SQL Editor)

-- 1. Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;

-- 2. Drop existing table if it exists (this will also drop all constraints)
DROP TABLE IF EXISTS team_members CASCADE;

-- 3. Create team_members table with new categories
CREATE TABLE team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    position TEXT,
    department TEXT,
    email TEXT,
    bio TEXT,
    expertise TEXT[],
    education TEXT[],
    publications INTEGER DEFAULT 0,
    awards TEXT[],
    image_url TEXT,
    social_links JSONB,
    category TEXT NOT NULL CHECK (category IN ('core-team', 'social-media-team', 'research-editorial-team', 'events-team', 'mentors')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_team_members_category ON team_members(category);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(is_active);

-- 5. Create or replace the updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create the trigger
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON team_members 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Insert sample team members for the new categories
INSERT INTO team_members (name, role, position, department, email, bio, expertise, category) VALUES
('Dr. Sarah Johnson', 'Director', 'Professor of International Law', 'Faculty of Law', 's.johnson@university.edu', 'Dr. Johnson is a leading expert in international criminal law with over 20 years of experience in academia and practice.', ARRAY['International Criminal Law', 'Transitional Justice', 'Human Rights'], 'core-team'),
('Prof. Michael Chen', 'Associate Director', 'Associate Professor', 'Faculty of Law', 'm.chen@university.edu', 'Prof. Chen specializes in environmental law and climate governance.', ARRAY['Environmental Law', 'Climate Governance', 'Sustainable Development'], 'core-team'),
('Emma Rodriguez', 'Social Media Manager', 'Digital Communications Specialist', 'Communications', 'e.rodriguez@university.edu', 'Emma manages our social media presence and digital communications strategy.', ARRAY['Social Media Management', 'Digital Marketing', 'Content Creation'], 'social-media-team'),
('David Kim', 'Content Creator', 'Research Assistant', 'Communications', 'd.kim@university.edu', 'David creates engaging content for our social media platforms and website.', ARRAY['Content Creation', 'Graphic Design', 'Social Media'], 'social-media-team'),
('Dr. Aisha Patel', 'Senior Research Fellow', 'Research Coordinator', 'Faculty of Law', 'a.patel@university.edu', 'Dr. Patel focuses on refugee law and forced migration research.', ARRAY['Refugee Law', 'Migration Law', 'International Protection'], 'research-editorial-team'),
('James Wilson', 'Editorial Assistant', 'Ph.D. Candidate', 'Faculty of Law', 'j.wilson@university.edu', 'James assists with research publications and editorial work.', ARRAY['Research Writing', 'Academic Editing', 'Publication Management'], 'research-editorial-team'),
('Lisa Thompson', 'Events Coordinator', 'Program Manager', 'Events', 'l.thompson@university.edu', 'Lisa coordinates all our events, conferences, and workshops.', ARRAY['Event Planning', 'Conference Management', 'Logistics'], 'events-team'),
('Mark Davis', 'Events Assistant', 'Program Assistant', 'Events', 'm.davis@university.edu', 'Mark supports event planning and execution for our programs.', ARRAY['Event Support', 'Administration', 'Coordination'], 'events-team'),
('Prof. Robert Smith', 'Senior Mentor', 'Professor Emeritus', 'Faculty of Law', 'r.smith@university.edu', 'Prof. Smith provides mentorship to junior researchers and students.', ARRAY['Mentoring', 'Academic Leadership', 'Research Guidance'], 'mentors'),
('Dr. Jennifer Lee', 'Research Mentor', 'Associate Professor', 'Faculty of Law', 'j.lee@university.edu', 'Dr. Lee mentors students in research methodology and academic writing.', ARRAY['Research Mentoring', 'Academic Writing', 'Methodology'], 'mentors');

-- 8. Verify the setup
SELECT 
    'team_members table created' as status,
    COUNT(*) as member_count
FROM team_members
UNION ALL
SELECT 
    'categories available' as status,
    COUNT(DISTINCT category) as category_count
FROM team_members; 