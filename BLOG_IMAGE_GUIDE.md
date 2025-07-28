# Blog Image Management Guide

## Overview
This guide shows you how to use different images for different blog posts in your CILG Lexicon application.

## Available Images

### Static Assets (`/src/assets/`)
- `academic-building.jpg` - Academic institution imagery
- `law-books.jpg` - Legal literature and books
- `hero-image.jpg` - Hero/banner imagery

### Uploaded Images (`/public/lovable-uploads/`)
- `personcar2.jpeg` - Transportation/vehicle imagery
- `79b917eb-f9ca-4687-b317-cab1aa5e5968.png` - General legal imagery
- `a8a8f724-8489-4325-bccb-3c63dd8bd236.png` - Alternative legal imagery

## Methods to Use Different Images

### 1. Direct Assignment in Blog Data
Edit `src/data/blogData.ts` to assign specific images to each blog post:

```typescript
{
  id: '1',
  title: 'Your Blog Title',
  // ... other properties
  image: '/lovable-uploads/personcar2.jpeg', // Specific image
}
```

### 2. Category-Based Image Assignment
Images are automatically assigned based on blog post category:

- **International Criminal Law** → `79b917eb-f9ca-4687-b317-cab1aa5e5968.png`
- **Environmental Law** → `academic-building.jpg`
- **Human Rights** → `law-books.jpg`
- **Trade Law** → `a8a8f724-8489-4325-bccb-3c63dd8bd236.png`
- **Transportation Law** → `personcar2.jpeg`

### 3. Using the Image Utility Functions

#### Get Image by Category
```typescript
import { getImageByCategory } from '@/lib/imageUtils';

const image = getImageByCategory('Environmental Law');
// Returns: '/src/assets/academic-building.jpg'
```

#### Get Image with Fallback
```typescript
import { getImageWithFallback } from '@/lib/imageUtils';

const image = getImageWithFallback(uploadedImageUrl, 'Human Rights');
// Uses uploaded image if available, otherwise uses category image
```

#### Get Random Image
```typescript
import { getRandomImage } from '@/lib/imageUtils';

const image = getRandomImage();
// Returns a random image from available options
```

### 4. Using the BlogImageSelector Component
For admin interfaces, use the `BlogImageSelector` component:

```typescript
import BlogImageSelector from '@/components/BlogImageSelector';

<BlogImageSelector
  onImageSelect={(imagePath) => setSelectedImage(imagePath)}
  currentImage={currentImage}
  category={blogCategory}
/>
```

## Current Blog Post Image Assignments

### Static Blog Posts (`src/data/blogData.ts`)
1. **International Criminal Law** → `79b917eb-f9ca-4687-b317-cab1aa5e5968.png`
2. **Environmental Law** → `academic-building.jpg`
3. **Human Rights** → `law-books.jpg`
4. **Trade Law** → `a8a8f724-8489-4325-bccb-3c63dd8bd236.png`
5. **Transportation Law** → `personcar2.jpeg`

### Dynamic Blog Posts (from Supabase)
- Blog posts from the database automatically get category-based images
- If no category is specified, defaults to `academic-building.jpg`

## Adding New Images

### 1. Add to Public Folder
Place new images in `/public/lovable-uploads/` for user-uploaded content.

### 2. Add to Assets
Place new images in `/src/assets/` for static application assets.

### 3. Update Image Utilities
Add new images to `src/lib/imageUtils.ts`:

```typescript
export const BLOG_IMAGES = {
  // ... existing images
  newImage: '/path/to/new-image.jpg',
  
  categoryImages: {
    // ... existing categories
    'New Category': '/path/to/new-image.jpg',
  }
};
```

## Best Practices

1. **Use Thematically Appropriate Images**: Match images to blog post categories
2. **Optimize Image Sizes**: Keep images under 1MB for better performance
3. **Consistent Aspect Ratios**: Use similar aspect ratios for consistent card layouts
4. **Alt Text**: Always provide meaningful alt text for accessibility
5. **Fallback Images**: Always have fallback images for when primary images fail to load

## Example Usage in Components

```typescript
// In a blog post component
const BlogPost = ({ post }) => {
  const image = getImageWithFallback(post.image_url, post.category);
  
  return (
    <div>
      <img src={image} alt={post.title} />
      {/* rest of component */}
    </div>
  );
};
```

## Troubleshooting

### Image Not Loading
1. Check file path is correct
2. Ensure image file exists in specified location
3. Verify image format is supported (jpg, png, jpeg)

### Wrong Image Displaying
1. Check category mapping in `imageUtils.ts`
2. Verify fallback logic is working correctly
3. Clear browser cache if testing changes

### Performance Issues
1. Optimize image sizes
2. Consider using WebP format for better compression
3. Implement lazy loading for large image grids 