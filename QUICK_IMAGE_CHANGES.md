# Quick Image Changes Guide

## 🚀 Most Common Image Changes

### **1. Change Hero Image (Homepage Background)**

**Quick Method (Admin Dashboard):**
1. Go to `/admin/login`
2. Navigate to Hero Image Manager
3. Upload new image or provide URL
4. Click Save

**Direct File Replacement:**
```bash
# Replace the hero image file
cp your-new-hero-image.jpg src/assets/hero-image.jpg
npm run build
```

### **2. Change Logo**

**Current Logo Location:**
- File: `public/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png`
- Used in: Navbar and Footer

**Steps:**
1. Replace the PNG file in `public/lovable-uploads/`
2. Keep the same filename or update the code
3. If changing filename, update:
   - `src/components/Navbar.tsx` (line 86)
   - `src/components/Footer.tsx` (line 12)

### **3. Change Academic Building Image**

**Used in:**
- Homepage "About Preview" section
- About page
- Research Areas section

**Steps:**
```bash
# Replace the building image
cp your-new-building.jpg src/assets/academic-building.jpg
npm run build
```

### **4. Change Law Books Image**

**Used in:**
- Research Areas section
- About page

**Steps:**
```bash
# Replace the law books image
cp your-new-law-books.jpg src/assets/law-books.jpg
npm run build
```

## 📊 Current Image Status

Run this command to check current image sizes:
```bash
node scripts/image-optimizer.js check
```

**Current Issues Found:**
- ⚠️ One oversized image: `79b917eb-f9ca-4687-b317-cab1aa5e5968.png` (969KB)

## 🛠️ Image Optimization Tools

### **Online Tools:**
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **Compressor.io**: https://compressor.io/

### **Command Line:**
```bash
# Install image optimization
npm install -g imagemin-cli

# Optimize images
imagemin src/assets/* --out-dir=src/assets/optimized/
```

## 📋 Image Requirements

### **Hero Image:**
- **Size**: 1920x1080 or larger
- **Format**: JPG
- **File size**: Under 500KB
- **Content**: Academic building, law school, or professional setting

### **Logo:**
- **Size**: 200x60px recommended
- **Format**: PNG with transparency
- **File size**: Under 100KB
- **Content**: CILG logo with clear text

### **Academic Building:**
- **Size**: 800x600 or larger
- **Format**: JPG
- **File size**: Under 200KB
- **Content**: University building, library, or academic setting

### **Law Books:**
- **Size**: 600x400 or larger
- **Format**: JPG
- **File size**: Under 200KB
- **Content**: Law books, legal documents, or legal setting

## 🔧 Troubleshooting

### **Images Not Loading:**
1. Check file paths are correct
2. Clear browser cache
3. Run `npm run build`
4. Check file permissions

### **Images Too Large:**
1. Use online compression tools
2. Reduce image dimensions
3. Convert to WebP format
4. Use appropriate compression settings

### **Build Errors:**
1. Check file extensions are correct
2. Ensure images are in the right directories
3. Verify import statements are correct
4. Check for special characters in filenames

## 🎯 Quick Commands

```bash
# Check image optimization
node scripts/image-optimizer.js check

# Generate image report
node scripts/image-optimizer.js report

# Build project after changes
npm run build

# Start development server
npm run dev
```

## 📞 Need Help?

If you encounter issues:
1. Check the full `IMAGE_MANAGEMENT_GUIDE.md` for detailed instructions
2. Run the image optimization script to identify problems
3. Ensure all file paths and permissions are correct
4. Test changes in development before deploying 