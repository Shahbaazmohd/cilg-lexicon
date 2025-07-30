// Image utility functions for bulletin posts and blog posts

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

// Default optimization options
const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  format: 'jpeg'
};

// Blog image utilities
export const BLOG_IMAGES = {
  // Default images from assets
  academic: '/src/assets/academic-building.jpg',
  lawBooks: '/src/assets/law-books.jpg',
  hero: '/src/assets/hero-image.jpg',
  
  // Uploaded images
  personCar: '/lovable-uploads/personcar2.jpeg',
  uploaded1: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
  uploaded2: '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png',
  
  // Category-based image mapping
  categoryImages: {
    'International Criminal Law': '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
    'Environmental Law': '/src/assets/academic-building.jpg',
    'Human Rights': '/src/assets/law-books.jpg',
    'Trade Law': '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png',
    'Transportation Law': '/lovable-uploads/personcar2.jpeg',
  }
};

// Function to get image based on category
export const getImageByCategory = (category: string): string => {
  return BLOG_IMAGES.categoryImages[category as keyof typeof BLOG_IMAGES.categoryImages] || BLOG_IMAGES.academic;
};

// Function to get image with fallback
export const getImageWithFallback = (imageUrl?: string, category?: string): string => {
  if (imageUrl) return imageUrl;
  if (category) return getImageByCategory(category);
  return BLOG_IMAGES.academic; // Default fallback
};

// Function to get random image from available images
export const getRandomImage = (): string => {
  const images = Object.values(BLOG_IMAGES).filter(img => typeof img === 'string');
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Validate image file
export const validateImageFile = (file: File): ImageValidationResult => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Please select a JPG, PNG, WebP, or GIF image'
    };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image must be smaller than 10MB'
    };
  }

  return { isValid: true };
};

// Validate image URL
export const validateImageUrl = (url: string): ImageValidationResult => {
  if (!url.trim()) {
    return {
      isValid: false,
      error: 'Please enter a valid image URL'
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }

  return { isValid: true };
};

// Optimize image using canvas
export const optimizeImage = (
  file: File, 
  options: ImageOptimizationOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height && width > opts.maxWidth!) {
          height = (height * opts.maxWidth!) / width;
          width = opts.maxWidth!;
        } else if (height > opts.maxHeight!) {
          width = (width * opts.maxHeight!) / height;
          height = opts.maxHeight!;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        }, `image/${opts.format}`, opts.quality);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = URL.createObjectURL(file);
  });
};

// Generate unique filename
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${timestamp}-${randomString}.${extension}`;
};

// Extract file path from Supabase URL
export const extractFilePathFromUrl = (url: string, bucketName: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === bucketName);
    
    if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
      return pathParts.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  } catch {
    return null;
  }
};

// Check if URL is from Supabase storage
export const isSupabaseStorageUrl = (url: string): boolean => {
  return url.includes('supabase.co') && url.includes('/storage/v1/object/public/');
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get image dimensions from file
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}; 