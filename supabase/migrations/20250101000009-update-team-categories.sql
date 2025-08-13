-- Update team_members table to allow new categories
-- Run this migration step by step in your Supabase SQL editor

-- STEP 1: Remove the existing constraint (run this first)
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_category_check;

-- STEP 2: Update existing team members to use new categories (run this second)
UPDATE team_members SET category = 'members' WHERE category = 'social-media-team';
UPDATE team_members SET category = 'members' WHERE category = 'research-editorial-team';
UPDATE team_members SET category = 'members' WHERE category = 'events-team';
UPDATE team_members SET category = 'faculty' WHERE category = 'mentors';
-- Keep core-team as is since it's already valid

-- STEP 3: Verify all categories are now valid (run this third)
-- SELECT DISTINCT category FROM team_members ORDER BY category;

-- STEP 4: Add new check constraint with updated categories (run this fourth)
ALTER TABLE team_members ADD CONSTRAINT team_members_category_check 
CHECK (category IN ('patrons', 'faculty', 'convenor', 'core-team', 'team-heads', 'members', 'past-contributors', 'developers'));

-- STEP 5: Add some sample data for new categories (run this last)
INSERT INTO team_members (name, role, position, department, email, bio, expertise, category) VALUES
('Dr. Elizabeth Brown', 'Patron', 'Distinguished Professor Emeritus', 'Faculty of Law', 'e.brown@university.edu', 'Dr. Brown is a distinguished patron of our center with decades of contributions to international law.', ARRAY['International Law', 'Academic Leadership', 'Institutional Development'], 'patrons'),
('Prof. Alexander Kumar', 'Convenor', 'Professor and Center Director', 'Faculty of Law', 'a.kumar@university.edu', 'Prof. Kumar convenes our center activities and provides strategic leadership.', ARRAY['Center Leadership', 'Strategic Planning', 'Academic Administration'], 'convenor'),
('Dr. Maria Garcia', 'Team Head', 'Senior Research Fellow', 'Faculty of Law', 'm.garcia@university.edu', 'Dr. Garcia leads our research initiatives and coordinates team activities.', ARRAY['Team Leadership', 'Research Coordination', 'Project Management'], 'team-heads'),
('Dr. Thomas Anderson', 'Past Contributor', 'Former Research Fellow', 'Faculty of Law', 't.anderson@university.edu', 'Dr. Anderson contributed significantly to our center in previous years.', ARRAY['Historical Research', 'Past Projects', 'Institutional Memory'], 'past-contributors'),
('Alex Chen', 'Developer', 'Software Engineer', 'IT Department', 'a.chen@university.edu', 'Alex develops and maintains our digital platforms and technical infrastructure.', ARRAY['Software Development', 'Web Technologies', 'System Administration'], 'developers')
ON CONFLICT (name, email) DO NOTHING;
