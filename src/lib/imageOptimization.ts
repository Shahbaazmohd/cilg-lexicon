// Image optimization utilities for better performance

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  blur?: number;
}

export interface OptimizedImageUrls {
  original: string;
  webp?: string;
  thumbnail?: string;
  medium?: string;
  large?: string;
}

// Default optimization options
const DEFAULT_OPTIONS: ImageOptimizationOptions = {
  width: 1920,
  height: 1080,
  quality: 80,
  format: 'webp',
  blur: 0
};

// Generate optimized image URLs for different sizes
export const generateOptimizedImageUrls = (
  originalUrl: string,
  options: Partial<ImageOptimizationOptions> = {}
): OptimizedImageUrls => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // If it's a local asset, return as is
  if (originalUrl.startsWith('/src/assets/') || originalUrl.startsWith('./')) {
    return {
      original: originalUrl,
      webp: originalUrl,
      thumbnail: originalUrl,
      medium: originalUrl,
      large: originalUrl
    };
  }

  // For external URLs (like Supabase), we can't optimize them
  // In a real implementation, you'd use a CDN or image optimization service
  return {
    original: originalUrl,
    webp: originalUrl,
    thumbnail: originalUrl,
    medium: originalUrl,
    large: originalUrl
  };
};

// Preload image with optimization
export const preloadImage = (
  url: string,
  options: Partial<ImageOptimizationOptions> = {}
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set loading attributes for optimization
    img.loading = 'eager';
    img.decoding = 'async';
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    
    img.src = url;
  });
};

// Preload multiple images
export const preloadImages = async (
  urls: string[],
  options: Partial<ImageOptimizationOptions> = {}
): Promise<HTMLImageElement[]> => {
  const promises = urls.map(url => preloadImage(url, options));
  return Promise.all(promises);
};

// Generate responsive image sizes
export const getResponsiveImageSizes = (originalUrl: string) => {
  const sizes = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
    large: 2560
  };

  // For local assets, return the same URL
  if (originalUrl.startsWith('/src/assets/') || originalUrl.startsWith('./')) {
    return {
      mobile: originalUrl,
      tablet: originalUrl,
      desktop: originalUrl,
      large: originalUrl
    };
  }

  // For external URLs, return the same URL (would be optimized in production)
  return {
    mobile: originalUrl,
    tablet: originalUrl,
    desktop: originalUrl,
    large: originalUrl
  };
};

// Check if WebP is supported
export const isWebPSupported = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Get optimal image format
export const getOptimalImageFormat = (): 'webp' | 'jpeg' => {
  return isWebPSupported() ? 'webp' : 'jpeg';
};

// Optimize image URL for current device
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: Partial<ImageOptimizationOptions> = {}
): string => {
  const format = getOptimalImageFormat();
  const optimizedUrls = generateOptimizedImageUrls(originalUrl, { ...options, format });
  
  return format === 'webp' && optimizedUrls.webp 
    ? optimizedUrls.webp 
    : optimizedUrls.original;
};

// Lazy load image with intersection observer
export const createLazyImageLoader = (
  imageElement: HTMLImageElement,
  src: string,
  options: Partial<ImageOptimizationOptions> = {}
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = getOptimizedImageUrl(src, options);
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01
    }
  );

  observer.observe(imageElement);
  return observer;
};

// Hero image specific optimization
export const optimizeHeroImage = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 1920,
    height: 1080,
    quality: 85,
    format: 'webp'
  });
};

// Thumbnail optimization
export const optimizeThumbnail = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 400,
    height: 300,
    quality: 75,
    format: 'webp'
  });
};

// Medium image optimization
export const optimizeMediumImage = (url: string): string => {
  return getOptimizedImageUrl(url, {
    width: 800,
    height: 600,
    quality: 80,
    format: 'webp'
  });
}; 