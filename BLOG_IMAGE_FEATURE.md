# Blog Image Upload Feature

## Overview

The blog image upload feature allows users to upload featured images when submitting blog posts through the "Submit a Manuscript" page. These images are dynamically displayed throughout the website.

## Features

### ✅ **User Features**
- **Image Upload**: Users can upload featured images (JPG, PNG, WebP) up to 5MB
- **Image Preview**: Real-time preview of uploaded images before submission
- **Image Removal**: Users can remove uploaded images before submitting
- **Optional Feature**: Image upload is completely optional

### ✅ **Display Features**
- **Blog Cards**: Images appear on blog cards in homepage and blog listing
- **Blog Post Pages**: Featured images displayed prominently on individual blog posts
- **Admin Interface**: Admins can view uploaded images in submission reviews
- **Fallback System**: Category-based fallback images when no custom image is uploaded

### ✅ **Technical Features**
- **Storage Bucket**: Dedicated `blog-images` bucket in Supabase Storage
- **Database Field**: `image_url` column added to `blog_posts` table
- **Public Access**: Images are publicly accessible for display
- **Validation**: File type and size validation

## Database Changes

### New Migration: `20250101000003-add-blog-images-support.sql`

```sql
-- Add image_url column to blog_posts table
ALTER TABLE public.blog_posts
ADD COLUMN image_url TEXT;

-- Create blog-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Set up RLS policies for public access
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Anyone can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images');
```

## New Files Created

### 1. **`src/lib/blogImageService.ts`**
- Service for handling blog image uploads
- Image validation and error handling
- Fallback image system based on categories
- Public URL generation

### 2. **`supabase/migrations/20250101000003-add-blog-images-support.sql`**
- Database migration for image support
- Storage bucket creation
- RLS policies setup

## Updated Files

### 1. **`src/pages/SubmitBlog.tsx`**
- Added image upload UI with drag-and-drop
- Image preview functionality
- Image removal capability
- Integration with BlogImageService

### 2. **`src/pages/Home.tsx`**
- Updated to use BlogImageService for fallback images
- Dynamic image loading for featured posts

### 3. **`src/pages/Blog.tsx`**
- Updated to use BlogImageService for fallback images
- Dynamic image loading for blog listings

### 4. **`src/pages/BlogPost.tsx`**
- Added featured image display on blog post pages
- Updated interface to include image_url field

### 5. **`src/pages/AdminSubmissions.tsx`**
- Added image display in submission review dialog
- Updated interface to include image_url field

## Usage

### For Users

1. **Navigate to Submit Blog**: Go to `/submit-blog`
2. **Upload Image**: Click "Choose Image" in the Featured Image section
3. **Preview**: See a preview of your uploaded image
4. **Remove if needed**: Click the X button to remove the image
5. **Submit**: Complete the form and submit - image will be uploaded automatically

### For Admins

1. **Review Submissions**: Go to `/admin/submissions`
2. **View Images**: Click "View Full" to see the uploaded image
3. **Approve/Reject**: Images are automatically included in the review process

### For Developers

1. **Apply Migration**: Run the database migration
2. **Test Upload**: Test image upload functionality
3. **Verify Display**: Check that images appear on blog cards and posts

## Image Specifications

- **Formats**: JPG, PNG, WebP
- **Size Limit**: 5MB maximum
- **Recommended**: 1920x1080 pixels or larger
- **Quality**: High-quality, relevant to article content

## Fallback System

When no custom image is uploaded, the system uses category-based fallback images:

- **International Law**: Law books image
- **Human Rights**: Academic building image
- **Trade Law**: Law books image
- **Environmental Law**: Academic building image
- **Constitutional Law**: Law books image
- **Corporate Law**: Academic building image
- **Criminal Law**: Law books image
- **Civil Rights**: Academic building image

## Security

- **Public Read Access**: Images are publicly accessible for display
- **Upload Validation**: File type and size validation
- **Unique Filenames**: Generated to prevent conflicts
- **RLS Policies**: Proper access control on storage bucket

## Future Enhancements

- **Image Cropping**: Add image cropping functionality
- **Multiple Images**: Support for multiple images per post
- **Image Optimization**: Automatic image optimization
- **CDN Integration**: CDN for faster image delivery
- **Image Gallery**: Gallery view for multiple images

## Troubleshooting

### Common Issues

1. **Image Not Uploading**
   - Check file size (must be under 5MB)
   - Verify file format (JPG, PNG, WebP)
   - Check network connection

2. **Image Not Displaying**
   - Verify migration was applied
   - Check storage bucket permissions
   - Clear browser cache

3. **Fallback Images Not Working**
   - Verify asset files exist
   - Check file paths in BlogImageService

### Migration Issues

If the migration fails:
1. Check Supabase dashboard for errors
2. Verify storage bucket doesn't already exist
3. Check RLS policies are properly set

## Testing

1. **Upload Test**: Upload various image types and sizes
2. **Display Test**: Verify images appear on all pages
3. **Fallback Test**: Submit without image to test fallbacks
4. **Admin Test**: Verify admins can see images in submissions 