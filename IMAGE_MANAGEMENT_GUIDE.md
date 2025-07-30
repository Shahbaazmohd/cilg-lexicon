# Website Image Management Guide

This guide explains how to change images throughout the website that will be displayed to everyone accessing the site.

## Types of Images in the Website

### 1. **Static Assets** (`src/assets/`)
These are hardcoded images used throughout the website:

- `hero-image.jpg` - Main homepage hero image
- `academic-building.jpg` - Academic building image used in multiple places
- `law-books.jpg` - Law books image used in research areas

### 2. **Dynamic Images** (`public/lovable-uploads/`)
These are uploaded images managed through the admin interface:

- Logo images (PNG format)
- User-uploaded content images
- Admin-managed images

### 3. **Database-Stored Images**
These are image URLs stored in the database:

- Hero image URL (managed through admin dashboard)
- Blog post images (stored in Supabase)
- Bulletin post images (stored in Supabase)

## How to Change Images

### **Method 1: Replace Static Assets (Recommended for Global Changes)**

#### **Step 1: Prepare Your New Image**
1. **Image Requirements:**
   - **Hero Image**: High resolution (1920x1080 or larger), JPG format
   - **Academic Building**: Medium resolution (800x600 or larger), JPG format
   - **Law Books**: Medium resolution (600x400 or larger), JPG format
   - **File size**: Keep under 1MB for optimal loading

2. **Image Optimization:**
   - Compress images for web use
   - Use appropriate formats (JPG for photos, PNG for graphics)
   - Maintain aspect ratios

#### **Step 2: Replace the Image File**
1. **Navigate to the assets folder:**
   ```bash
   cd src/assets/
   ```

2. **Replace the image file:**
   - Replace `hero-image.jpg` with your new hero image
   - Replace `academic-building.jpg` with your new building image
   - Replace `law-books.jpg` with your new law books image

3. **Keep the same filename** to avoid breaking existing code

#### **Step 3: Test the Changes**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Check the website** to ensure images display correctly

### **Method 2: Change Hero Image via Admin Dashboard**

#### **Step 1: Access Admin Dashboard**
1. Go to `/admin/login`
2. Log in with admin credentials
3. Navigate to the Hero Image Manager

#### **Step 2: Upload New Hero Image**
1. **Upload Method:**
   - Use the image upload interface
   - Or provide a direct URL to the image

2. **Image Requirements:**
   - High resolution (1920x1080 or larger)
   - JPG or PNG format
   - Under 5MB file size

#### **Step 3: Save Changes**
1. Click "Save" to update the hero image
2. The change will be immediately visible to all users

### **Method 3: Change Logo Images**

#### **Step 1: Prepare Logo Image**
1. **Requirements:**
   - PNG format with transparency
   - Appropriate size (200x60px recommended)
   - Clear visibility on both light and dark backgrounds

#### **Step 2: Replace Logo Files**
1. **Upload to public folder:**
   ```bash
   # Place your logo in public/lovable-uploads/
   # Update the filename in the code if needed
   ```

2. **Update the code** (if filename changes):
   - Edit `src/components/Navbar.tsx`
   - Edit `src/components/Footer.tsx`
   - Update the `src` attribute to point to your new logo

### **Method 4: Change Images via Database**

#### **Step 1: Access Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to the "Table Editor"
3. Select the `website_settings` table

#### **Step 2: Update Image URLs**
1. **Find the setting:**
   - Look for `hero_image_url` key
   - Update the value with your new image URL

2. **Add new settings** (if needed):
   ```sql
   INSERT INTO website_settings (key, value) 
   VALUES ('logo_url', 'your-new-logo-url');
   ```

## Image Locations and Usage

### **Homepage Images**
- **Hero Image**: `src/assets/hero-image.jpg` (or database URL)
- **Academic Building**: `src/assets/academic-building.jpg`
- **Law Books**: `src/assets/law-books.jpg`

### **Logo Images**
- **Navbar Logo**: `/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png`
- **Footer Logo**: Same as navbar logo

### **Admin-Managed Images**
- **Hero Image**: Stored in `website_settings` table
- **Blog Images**: Stored in Supabase storage
- **Bulletin Images**: Stored in Supabase storage

## Best Practices

### **Image Optimization**
1. **Compress images** before uploading
2. **Use appropriate formats:**
   - JPG for photographs
   - PNG for graphics with transparency
   - WebP for modern browsers (if supported)

3. **Optimize file sizes:**
   - Hero images: Under 500KB
   - Regular images: Under 200KB
   - Thumbnails: Under 50KB

### **Responsive Design**
1. **Provide multiple sizes** for different screen sizes
2. **Use appropriate aspect ratios**
3. **Test on mobile devices**

### **Accessibility**
1. **Add alt text** to all images
2. **Ensure sufficient contrast**
3. **Provide text alternatives** for important images

## Troubleshooting

### **Images Not Loading**
1. **Check file paths** are correct
2. **Verify file permissions** are set correctly
3. **Clear browser cache** and reload
4. **Check build process** completed successfully

### **Images Too Large/Slow**
1. **Compress images** using online tools
2. **Use WebP format** for better compression
3. **Implement lazy loading** for better performance
4. **Use CDN** for faster delivery

### **Database Images Not Updating**
1. **Check database connection**
2. **Verify admin permissions**
3. **Clear application cache**
4. **Check Supabase storage permissions**

## Quick Reference Commands

### **Build and Test**
```bash
# Build the project
npm run build

# Start development server
npm run dev

# Check for build errors
npm run build --verbose
```

### **Image Optimization Tools**
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin src/assets/* --out-dir=src/assets/optimized/
```

## Advanced: Custom Image Management

### **Adding New Image Types**
1. **Create new settings** in the database
2. **Update SettingsService** to handle new image types
3. **Add admin interface** for managing new images
4. **Update components** to use new image sources

### **Image CDN Integration**
1. **Set up CDN** (Cloudflare, AWS CloudFront, etc.)
2. **Update image URLs** to use CDN
3. **Configure caching** for optimal performance
4. **Monitor performance** and adjust as needed

## Security Considerations

### **File Upload Security**
1. **Validate file types** before upload
2. **Scan for malware** in uploaded images
3. **Limit file sizes** to prevent abuse
4. **Use secure URLs** for external images

### **Access Control**
1. **Restrict admin access** to image management
2. **Audit image changes** for security
3. **Backup original images** before changes
4. **Version control** for important images

This guide covers all the methods for changing images throughout the website. Choose the method that best fits your needs and technical expertise. 