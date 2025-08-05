# Image Management Troubleshooting Guide

## 🔧 Fixed Issues

### ✅ Image Management Dashboard
- **Problem**: Original image management only handled dynamic images
- **Solution**: Created comprehensive `ImageManagementDashboard` component
- **Features**: 
  - Tabbed interface for Page Images and Team Photos
  - Upload functionality for both image types
  - Delete and view options
  - Loading states and error handling

## 🚀 How to Use Image Management

### Access Image Management
1. Go to `http://localhost:8084/admin/login`
2. Log in with admin credentials
3. Click **"Image Management"** in the sidebar
4. Or go directly to `http://localhost:8084/admin/images`

### Two Main Tabs

#### 1. Page Images Tab
- **Hero Image**: Main homepage banner
- **About Section**: About page images
- **Research Areas**: Images for different research sections
- **Features**:
  - Upload new images (JPG, PNG, up to 5MB)
  - View current images
  - Delete custom images
  - Automatic fallback to default images

#### 2. Team Photos Tab
- **Team Member Photos**: Individual profile pictures
- **Features**:
  - Upload profile photos for each team member
  - Square format recommended
  - View and delete options
  - Automatic fallback to placeholder

## 🔍 Common Issues & Solutions

### Issue 1: "No images found"
**Cause**: Database not set up or no data
**Solution**:
1. Run the database migrations
2. Check Supabase connection
3. Verify storage buckets exist

### Issue 2: "Upload failed"
**Cause**: Storage permissions or file size
**Solution**:
1. Check file size (max 5MB)
2. Verify file format (JPG, PNG)
3. Check Supabase storage permissions
4. Ensure authenticated user

### Issue 3: "Images not loading"
**Cause**: Missing storage bucket or permissions
**Solution**:
1. Run the storage setup script:
   ```sql
   -- Copy and paste supabase/fix-team-storage.sql
   ```
2. Check bucket permissions in Supabase dashboard
3. Verify image URLs in database

### Issue 4: "Team members not showing"
**Cause**: Team members table not created
**Solution**:
1. Run team members migration:
   ```sql
   -- Copy and paste supabase/migrations/20250101000004-create-team-members-table.sql
   ```
2. Add sample team members through admin panel

## 🛠️ Manual Database Setup

If the migrations aren't working, manually set up:

### 1. Create Team Members Table
```sql
CREATE TABLE IF NOT EXISTS team_members (
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

### 2. Create Storage Bucket
```sql
INSERT INTO storage.buckets (id, name, public) 
VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;
```

### 3. Create Storage Policies
```sql
CREATE POLICY "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can upload team member images" ON storage.objects 
FOR INSERT WITH CHECK (
    bucket_id = 'team-images' 
    AND auth.role() = 'authenticated'
);
```

## 📊 Testing the System

### Test Upload Functionality
1. Go to Image Management
2. Select "Team Photos" tab
3. Click "Choose Photo" for any team member
4. Select an image file
5. Verify upload completes successfully

### Test Page Images
1. Go to Image Management
2. Select "Page Images" tab
3. Try uploading a hero image
4. Check if it appears on the homepage

### Test Team Page
1. Visit `http://localhost:8084/team`
2. Verify team members display
3. Check if images load properly

## 🔄 Refresh Data
If images don't update immediately:
1. Click the "Refresh" button in Image Management
2. Or reload the page
3. Check browser console for errors

## 📞 Support
If issues persist:
1. Check browser console for JavaScript errors
2. Verify Supabase connection in Network tab
3. Test with different image formats
4. Ensure file sizes are under 5MB 