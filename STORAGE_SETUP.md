# Setting Up Bulletin Image Storage

The image upload feature requires a storage bucket to be created in Supabase. Since we can't create it programmatically with the current permissions, please follow these steps:

## Manual Setup via Supabase Dashboard

### 1. Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: `qclktzhkhgtcspocqqhr`

### 2. Create Storage Bucket
1. Navigate to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Enter the following details:
   - **Name**: `bulletin-images`
   - **Public bucket**: ✅ Check this option
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png`
     - `image/webp`
     - `image/jpg`
     - `image/gif`
4. Click **Create bucket**

### 3. Set Up RLS Policies
After creating the bucket, you need to set up Row Level Security policies:

1. Go to **Storage** → **Policies**
2. Find the `bulletin-images` bucket
3. Click **New Policy**
4. Add the following policies:

#### Policy 1: Public Read Access
- **Policy name**: `Public Access to Bulletin Images`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `true`

#### Policy 2: Upload Access
- **Policy name**: `Anyone can upload bulletin images`
- **Allowed operation**: `INSERT`
- **Target roles**: `public`
- **Policy definition**: `true`

#### Policy 3: Update Access
- **Policy name**: `Anyone can update bulletin images`
- **Allowed operation**: `UPDATE`
- **Target roles**: `public`
- **Policy definition**: `true`

#### Policy 4: Delete Access
- **Policy name**: `Anyone can delete bulletin images`
- **Allowed operation**: `DELETE`
- **Target roles**: `public`
- **Policy definition**: `true`

### 4. Test the Setup
After setting up the bucket and policies:

1. Go to your application
2. Navigate to Admin → Cosmopolitan Bulletin
3. Try uploading an image
4. The upload should now work successfully

## Alternative: Use External URLs

If you prefer not to set up the storage bucket immediately, you can:

1. Use the **Image URL** option in the form
2. Upload images to external services like:
   - [Imgur](https://imgur.com/)
   - [Cloudinary](https://cloudinary.com/)
   - [ImageKit](https://imagekit.io/)
   - Any image hosting service
3. Copy the direct image URL and paste it in the form

## Troubleshooting

### "Storage bucket not configured" Error
This means the `bulletin-images` bucket doesn't exist. Follow the setup steps above.

### "Permission denied" Error
This means the RLS policies aren't set up correctly. Make sure all four policies are created.

### "File too large" Error
The file is larger than 10MB. Either:
- Compress the image before uploading
- Use a smaller image
- Increase the file size limit in the bucket settings

### "Invalid file type" Error
The file type isn't supported. Only JPG, PNG, WebP, and GIF files are allowed.

## Support

If you continue to have issues, please:
1. Check the browser console for detailed error messages
2. Verify the bucket exists in Supabase dashboard
3. Confirm all RLS policies are set up correctly
4. Contact the development team for assistance 

## Summary of Blog Card Dimension and Alignment Fixes

I have successfully fixed the blog card dimensions and alignment issues to ensure all cards have uniform dimensions and are properly aligned. Here are the key changes made:

### **✅ BlogCard Component Updates (`src/components/BlogCard.tsx`)**

#### **1. Flexbox Layout Structure**
- **Added**: `h-full flex flex-col` to the article container
- **Added**: `flex flex-col h-full` to the main content div
- **Result**: Cards now use flexbox for consistent height distribution

#### **2. Image Container**
- **Added**: `flex-shrink-0` to prevent image from shrinking
- **Maintained**: Fixed height of `h-48` for consistent image dimensions
- **Result**: All images have uniform height regardless of content

#### **3. Content Container**
- **Added**: `flex flex-col flex-grow` to content area
- **Added**: `flex-grow` to excerpt paragraph
- **Added**: `mt-auto` to "Read More" section
- **Result**: Content fills available space and "Read More" stays at bottom

#### **4. Text Truncation**
- **Added**: `line-clamp-2` to titles (max 2 lines)
- **Added**: `line-clamp-3` to excerpts (max 3 lines)
- **Added**: `truncate` to author names
- **Result**: Consistent text lengths across all cards

#### **5. Link Wrapper**
- **Added**: `h-full` to Link wrapper
- **Result**: Entire card is clickable and maintains height

### **✅ CSS Utilities (`src/index.css`)**

#### **6. Line Clamp Utilities**
- **Added**: `.line-clamp-1`, `.line-clamp-2`, `.line-clamp-3` classes
- **Implementation**: Uses `-webkit-line-clamp` for cross-browser text truncation
- **Result**: Consistent text overflow handling

### **✅ Grid Container Updates**

#### **7. Home Page Grid (`src/pages/Home.tsx`)**
- **Added**: `items-stretch` to grid container
- **Updated**: Loading skeleton to match new card structure
- **Result**: All cards stretch to match the tallest card in each row

#### **8. Blog Page Grid (`src/pages/Blog.tsx`)**
- **Added**: `items-stretch` to grid container
- **Result**: Consistent alignment across all blog pages

### **✅ Loading Skeleton Updates**

#### **9. Enhanced Skeleton Structure**
- **Updated**: Skeleton cards to use `h-full flex flex-col`
- **Added**: Proper content structure with `flex-grow` and `mt-auto`
- **Result**: Loading state matches final card layout

### **Technical Implementation Details**

```tsx
<code_block_to_apply_changes_from>
```

### **Visual Result**

The blog cards now have:
- **✅ Uniform dimensions** - All cards are the same height in each row
- **✅ Consistent alignment** - Cards align perfectly in grid layout
- **✅ Proper text truncation** - Titles and excerpts have consistent lengths
- **✅ Responsive design** - Works on all screen sizes
- **✅ Clean layout** - No more uneven card heights or misaligned content
- **✅ Professional appearance** - Cards look polished and organized

### **Cross-Page Consistency**

The fixes have been applied to:
- **Home page** - Featured Research section
- **Blog page** - Main blog listing
- **Loading states** - Consistent skeleton structure

All blog cards across the application now have uniform dimensions and perfect alignment, creating a professional and visually appealing layout. 