# Team Page Implementation Guide

## Overview
This implementation provides a dynamic team page with Supabase integration for managing team members and their images. The page features multiple layout options and an admin interface for managing team data.

## Features Implemented

### 1. Team Components
- **TeamSection**: Simple grid layout with circular avatars
- **TeamDemo**: Detailed layout with hover effects and member details
- **TeamMemberManager**: Admin interface for managing team members

### 2. Supabase Integration
- **TeamService**: Service layer for team member CRUD operations
- **Dynamic Image Management**: Upload and manage team member photos
- **Database Schema**: Complete team_members table with proper indexing

### 3. Database Schema
```sql
-- team_members table structure
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
    category TEXT NOT NULL CHECK (category IN ('leadership', 'faculty', 'research', 'administration')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Setup Instructions

### 1. Database Setup
Run the Supabase migrations to create the necessary tables and storage buckets:

```bash
# Apply migrations
supabase db push

# Or run individual migrations:
# - 20250101000004-create-team-members-table.sql
# - 20250101000005-create-team-images-bucket.sql
```

### 2. Storage Bucket Setup
The implementation creates a `team-images` bucket for storing team member photos with proper access policies.

### 3. Sample Data
The migration includes sample team members for testing:
- Prof. Sarah Johnson (Director)
- Dr. Michael Chen (Associate Director)
- Dr. Emma Rodriguez (Senior Research Fellow)
- Prof. David Kim (Research Professor)
- Dr. Aisha Patel (Research Fellow)
- James Wilson (Research Assistant)

## Usage

### 1. Team Page
The team page (`/team`) now displays team members in multiple layouts:
- Simple grid layout with circular avatars
- Detailed layout with hover effects
- Full card layout with detailed information

### 2. Admin Management
Use the `TeamMemberManager` component in your admin panel to:
- Add new team members
- Edit existing members
- Upload member photos
- Manage member categories and status

### 3. Image Management
Team member images are stored in the `team-images` Supabase bucket:
- Automatic fallback to placeholder images
- Support for various image formats
- Optimized loading with lazy loading

## Component Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── team.tsx          # Simple team layout
│   │   └── team-demo.tsx     # Detailed team layout
│   └── TeamMemberManager.tsx # Admin management component
├── lib/
│   └── teamService.ts        # Team service layer
└── pages/
    └── Team.tsx              # Main team page
```

## Customization

### 1. Styling
The components use the existing academic theme classes:
- `academic-heading`: For headings
- `academic-text`: For body text
- `academic-container`: For container styling

### 2. Categories
Team members are categorized into:
- Leadership
- Faculty
- Research
- Administration

### 3. Image Handling
- Images are uploaded to Supabase storage
- Fallback images are provided for missing photos
- Support for various image formats

## Integration with Existing Codebase

The implementation follows the existing patterns:
- Uses shadcn/ui components
- Integrates with existing Supabase client
- Follows the academic theme styling
- Maintains TypeScript type safety

## Next Steps

1. **Run Migrations**: Apply the database migrations
2. **Test Components**: Verify the team page displays correctly
3. **Add Admin Route**: Integrate TeamMemberManager into your admin panel
4. **Upload Images**: Add team member photos through the admin interface
5. **Customize Content**: Update team member information as needed

## Troubleshooting

### Common Issues:
1. **Images not loading**: Check Supabase storage bucket permissions
2. **Database errors**: Ensure migrations are applied correctly
3. **Styling issues**: Verify Tailwind CSS is properly configured

### Debug Steps:
1. Check browser console for errors
2. Verify Supabase connection
3. Test image upload functionality
4. Validate database schema

## Performance Considerations

- Images are lazy-loaded for better performance
- Fallback images prevent broken image links
- Database queries are optimized with proper indexing
- Component state management prevents unnecessary re-renders 