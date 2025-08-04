# Image Optimization Guide for CILG Website

## Recommended Image Size Limits

### **Blog Post Images**
- **Maximum File Size**: 3MB
- **Recommended File Size**: Under 1MB
- **Recommended Dimensions**: 1200x800px
- **Supported Formats**: JPEG, PNG, WebP
- **Best Format**: WebP (modern browsers), JPEG (universal)

### **Hero/Featured Images**
- **Maximum File Size**: 2MB
- **Recommended File Size**: Under 800KB
- **Recommended Dimensions**: 1920x1080px
- **Best Format**: JPEG with 80-85% quality

### **Thumbnail Images**
- **Maximum File Size**: 500KB
- **Recommended File Size**: Under 200KB
- **Recommended Dimensions**: 400x300px
- **Best Format**: JPEG with 70-75% quality

## Format Recommendations

### **JPEG (.jpg, .jpeg)**
- **Best for**: Photographs, complex images with many colors
- **Compression**: 70-85% quality for web
- **Pros**: Universal support, good compression
- **Cons**: Lossy compression, no transparency

### **PNG (.png)**
- **Best for**: Images with transparency, logos, text-heavy images
- **Compression**: Use PNG-8 for simple images, PNG-24 for complex
- **Pros**: Lossless, supports transparency
- **Cons**: Larger file sizes

### **WebP (.webp)**
- **Best for**: Modern web browsers, best compression
- **Compression**: 75-85% quality
- **Pros**: Excellent compression, supports transparency
- **Cons**: Limited browser support (use with JPEG fallback)

## Optimization Techniques

### **1. Resize Before Upload**
- Resize images to the intended display size
- Don't upload 4000px wide images for 800px display
- Use tools like:
  - **Online**: TinyPNG, Squoosh.app, ImageOptim
  - **Desktop**: Photoshop, GIMP, Affinity Photo
  - **Command Line**: ImageMagick, Sharp

### **2. Choose the Right Format**
```
Photographs → JPEG (70-85% quality)
Logos/Graphics → PNG or WebP
Complex Images → WebP (with JPEG fallback)
Simple Graphics → PNG-8
```

### **3. Compress Appropriately**
- **High Quality**: 85% (for hero images)
- **Medium Quality**: 75% (for blog images)
- **Low Quality**: 70% (for thumbnails)

### **4. Use Descriptive Filenames**
- ✅ `research-paper-international-law-2024.jpg`
- ❌ `IMG_20241201_143022.jpg`

## Technical Implementation

### **Current Limits in Code**
```typescript
// BlogImageService.ts
private static readonly MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
private static readonly RECOMMENDED_FILE_SIZE = 1 * 1024 * 1024; // 1MB
private static readonly MAX_DIMENSIONS = { width: 1920, height: 1080 };
private static readonly RECOMMENDED_DIMENSIONS = { width: 1200, height: 800 };
```

### **Validation Features**
- File type checking (image/*)
- File size validation
- Filename length checking
- Format-specific recommendations

## Performance Impact

### **File Size vs Load Time**
- **1MB image**: ~2-3 seconds on 3G
- **500KB image**: ~1-2 seconds on 3G
- **200KB image**: ~0.5-1 second on 3G

### **Page Load Impact**
- Large images can increase page load time by 2-5 seconds
- Multiple large images can significantly impact performance
- Mobile users are particularly affected by large images

## Tools and Resources

### **Online Compression Tools**
- [TinyPNG](https://tinypng.com/) - Simple PNG/JPEG compression
- [Squoosh.app](https://squoosh.app/) - Google's advanced image optimization
- [ImageOptim Web](https://imageoptim.com/online) - Online version of ImageOptim

### **Desktop Applications**
- **ImageOptim** (Mac) - Drag and drop optimization
- **FileOptimizer** (Windows) - Batch optimization
- **GIMP** (Cross-platform) - Full image editing with optimization

### **Command Line Tools**
```bash
# Using ImageMagick
convert input.jpg -quality 75 -resize 1200x800 output.jpg

# Using Sharp (Node.js)
sharp('input.jpg')
  .resize(1200, 800)
  .jpeg({ quality: 75 })
  .toFile('output.jpg')
```

## Best Practices Summary

1. **Resize images** to intended display size
2. **Choose appropriate format** (JPEG for photos, PNG for graphics)
3. **Compress adequately** (70-85% quality for web)
4. **Use descriptive filenames** for SEO
5. **Test on different devices** and connection speeds
6. **Consider WebP** with JPEG fallback for modern browsers
7. **Keep file sizes under 1MB** for optimal performance
8. **Use CDN** for faster delivery (already implemented with Supabase)

## Monitoring and Analytics

### **Performance Metrics to Track**
- Page load time
- Image load time
- Total page weight
- Core Web Vitals (LCP, CLS)

### **Tools for Monitoring**
- Google PageSpeed Insights
- WebPageTest
- Chrome DevTools Network tab
- Lighthouse audits

## Future Optimizations

### **Planned Features**
- Automatic image resizing on upload
- WebP conversion for supported browsers
- Lazy loading for images
- Progressive JPEG loading
- Image CDN with automatic optimization

### **Advanced Techniques**
- Responsive images with srcset
- Art direction with picture element
- AVIF format support (next-generation compression)
- Automatic quality adjustment based on connection speed 