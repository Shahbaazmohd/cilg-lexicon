# Dynamic Image Management System Setup Guide

This guide will help you set up and use the dynamic image management system for the CILG website homepage.

## Overview

The dynamic image system allows you to manage multiple images on the homepage through a user-friendly admin interface. Images are stored in Supabase storage buckets and can be updated without touching the code.

## Features

- **Multiple Image Positions**: Hero, About section, and Research Areas
- **Real-time Updates**: Changes are immediately visible to all visitors
- **Fallback Images**: Default images are used if custom images aren't uploaded
- **Admin Interface**: Easy-to-use management panel
- **Image Validation**: File type and size restrictions
- **Storage Management**: Automatic cleanup of old images

## Setup Instructions

### 1. Database Migration

First, run the new migration to create the dynamic images table and storage bucket:

```bash
# Apply the migration
supabase db push
```

This will create:
- `dynamic-images` storage bucket
- `dynamic_images` table with default configurations
- Proper RLS policies for security

### 2. Default Image Positions

The system is configured with the following image positions:

| Position | Display Name | Description | Default Image |
|----------|--------------|-------------|---------------|
| `hero` | Hero Image | Main hero image at the top of the homepage | `hero-image.jpg` |
| `about` | About Section Image | Image in the about section | `academic-building.jpg` |
| `research-area-1` | Research Area 1 | International Criminal Law section | `law-books.jpg` |
| `research-area-2` | Research Area 2 | Human Rights Law section | `law-books.jpg` |
| `research-area-3` | Research Area 3 | Conflict Resolution section | `academic-building.jpg` |

### 3. Accessing the Admin Interface

1. Navigate to `/admin/login`
2. Log in with your admin credentials
3. Click on "Image Management" in the sidebar
4. You'll see all available image positions with their current status

## Using the System

### Uploading New Images

1. **Navigate to Image Management**: Go to `/admin/images` in the admin panel
2. **Select an Image Position**: Choose which image you want to update
3. **Upload Image**: Click "Choose Image" and select your file
4. **Wait for Processing**: The system will upload and process your image
5. **Verify Changes**: The new image will be immediately visible on the homepage

### Image Guidelines

- **File Formats**: JPG, PNG, WebP
- **Maximum Size**: 5MB per image
- **Recommended Dimensions**:
  - Hero Image: 1920x1080 or larger
  - About Image: 800x600 or larger
  - Research Area Images: 600x400 or larger
- **Quality**: Use high-quality images with good lighting
- **Relevance**: Images should be relevant to the section content

### Managing Images

#### View Current Images
- Each image position shows a preview of the current image
- Custom images are marked with a "Custom" badge
- Default images show the fallback image

#### Delete Images
- Click the "Delete" button to remove a custom image
- This will revert to the default fallback image
- The old image file is automatically removed from storage

#### View Full Size
- Click "View" to open the full-size image in a new tab
- Useful for checking image quality and details

## Technical Details

### Storage Structure

```
dynamic-images/
├── hero-{timestamp}.{ext}
├── about-{timestamp}.{ext}
├── research-area-1-{timestamp}.{ext}
├── research-area-2-{timestamp}.{ext}
└── research-area-3-{timestamp}.{ext}
```

### Database Schema

```sql
CREATE TABLE dynamic_images (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  position VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

The system uses the following Supabase operations:

- **Storage**: Upload/delete images in the `dynamic-images` bucket
- **Database**: CRUD operations on the `dynamic_images` table
- **RLS Policies**: Secure access control for authenticated users

## Troubleshooting

### Common Issues

1. **Image Not Loading**
   - Check if the image URL is accessible
   - Verify the image file exists in storage
   - Check browser console for errors

2. **Upload Fails**
   - Ensure file size is under 5MB
   - Check file format (JPG, PNG, WebP only)
   - Verify admin authentication

3. **Changes Not Visible**
   - Clear browser cache
   - Check if the image URL was saved to database
   - Verify the image position is correct

### Debug Steps

1. **Check Storage**: Verify images exist in the `dynamic-images` bucket
2. **Check Database**: Confirm image URLs are saved in the `dynamic_images` table
3. **Check Permissions**: Ensure RLS policies allow admin access
4. **Check Network**: Verify Supabase connection and API calls

## Security Considerations

- **Authentication Required**: Only authenticated admins can upload/delete images
- **File Validation**: Server-side validation of file types and sizes
- **RLS Policies**: Row-level security prevents unauthorized access
- **Automatic Cleanup**: Old images are removed when replaced

## Performance Optimization

- **Image Compression**: Consider compressing images before upload
- **CDN**: Supabase storage provides global CDN distribution
- **Caching**: Browser caching improves load times
- **Fallbacks**: Default images ensure the site always loads

## Future Enhancements

Potential improvements for the system:

1. **Image Cropping**: Add built-in image editing tools
2. **Multiple Formats**: Support for WebP with fallbacks
3. **Bulk Operations**: Upload multiple images at once
4. **Image Analytics**: Track which images perform best
5. **A/B Testing**: Test different images for engagement
6. **Scheduled Updates**: Set images to change at specific times

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Supabase configuration
3. Ensure all migrations have been applied
4. Contact the development team with specific error details

## Migration Notes

This system replaces the previous hero image management with a more comprehensive solution. The old `hero-images` bucket and settings are still available for backward compatibility, but the new system provides better organization and more features. 