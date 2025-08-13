# Team Categories Migration Guide

## Problem
The team members table has a database constraint that only allows old categories, which is preventing updates from working.

## Solution
We need to run a migration to update the database schema and existing data.

## Steps to Fix

### 1. Go to Supabase Dashboard
- Open your Supabase project dashboard
- Go to the SQL Editor

### 2. Run Migration Step by Step

#### STEP 1: Remove the constraint
```sql
ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_category_check;
```

#### STEP 2: Update existing categories
```sql
UPDATE team_members SET category = 'members' WHERE category = 'social-media-team';
UPDATE team_members SET category = 'members' WHERE category = 'research-editorial-team';
UPDATE team_members SET category = 'members' WHERE category = 'events-team';
UPDATE team_members SET category = 'faculty' WHERE category = 'mentors';
```

#### STEP 3: Verify the changes
```sql
SELECT DISTINCT category FROM team_members ORDER BY category;
```

#### STEP 4: Add new constraint
```sql
ALTER TABLE team_members ADD CONSTRAINT team_members_category_check 
CHECK (category IN ('patrons', 'faculty', 'convenor', 'core-team', 'team-heads', 'members', 'past-contributors', 'developers'));
```

#### STEP 5: Add sample data (optional)
```sql
INSERT INTO team_members (name, role, position, department, email, bio, expertise, category) VALUES
('Dr. Elizabeth Brown', 'Patron', 'Distinguished Professor Emeritus', 'Faculty of Law', 'e.brown@university.edu', 'Dr. Brown is a distinguished patron of our center with decades of contributions to international law.', ARRAY['International Law', 'Academic Leadership', 'Institutional Development'], 'patrons'),
('Prof. Alexander Kumar', 'Convenor', 'Professor and Center Director', 'Faculty of Law', 'a.kumar@university.edu', 'Prof. Kumar convenes our center activities and provides strategic leadership.', ARRAY['Center Leadership', 'Strategic Planning', 'Academic Administration'], 'convenor'),
('Dr. Maria Garcia', 'Team Head', 'Senior Research Fellow', 'Faculty of Law', 'm.garcia@university.edu', 'Dr. Garcia leads our research initiatives and coordinates team activities.', ARRAY['Team Leadership', 'Research Coordination', 'Project Management'], 'team-heads'),
('Dr. Thomas Anderson', 'Past Contributor', 'Former Research Fellow', 'Faculty of Law', 't.anderson@university.edu', 'Dr. Anderson contributed significantly to our center in previous years.', ARRAY['Historical Research', 'Past Projects', 'Institutional Memory'], 'past-contributors'),
('Alex Chen', 'Developer', 'Software Engineer', 'IT Department', 'a.chen@university.edu', 'Alex develops and maintains our digital platforms and technical infrastructure.', ARRAY['Software Development', 'Web Technologies', 'System Administration'], 'developers')
ON CONFLICT (name, email) DO NOTHING;
```

## What This Will Do

1. **Remove old constraint** - Allows us to update existing data
2. **Update categories** - Maps old categories to new ones:
   - `social-media-team` → `members`
   - `research-editorial-team` → `members`
   - `events-team` → `members`
   - `mentors` → `faculty`
   - `core-team` → `core-team` (unchanged)
3. **Add new constraint** - Ensures only new categories are allowed
4. **Add sample data** - Provides examples for new categories

## After Migration

Once you've run this migration:
- Team member updates should work properly
- You can assign members to new categories
- The admin dashboard will be fully functional
- Changes will appear on the public team page

## Troubleshooting

If you get any errors:
1. Make sure you're running the steps in order
2. Check that each step completes successfully before moving to the next
3. If you get a constraint violation, make sure you've updated all the data before adding the new constraint
