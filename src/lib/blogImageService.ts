import { supabase } from '@/integrations/supabase/client';

export interface BlogImageUploadResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
  recommendations?: string[];
}

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  recommendations?: string[];
}

export class BlogImageService {
  // Image size limits in bytes
  private static readonly MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
  private static readonly RECOMMENDED_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  private static readonly MAX_DIMENSIONS = { width: 1920, height: 1080 };
  private static readonly RECOMMENDED_DIMENSIONS = { width: 1200, height: 800 };

  // Validate image file
  static validateImage(file: File): ImageValidationResult {
    const recommendations: string[] = [];
    let isValid = true;
    let error: string | undefined;

    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        isValid: false,
        error: 'Invalid file type. Please select an image file (JPEG, PNG, WebP).'
      };
    }

    // Check file size - STRICT validation
    if (file.size > this.MAX_FILE_SIZE) {
      isValid = false;
      error = `Image upload failed: File size (${this.formatFileSize(file.size)}) exceeds the maximum limit of ${this.formatFileSize(this.MAX_FILE_SIZE)}. Please compress your image before uploading.`;
    } else if (file.size > this.RECOMMENDED_FILE_SIZE) {
      recommendations.push(`Consider compressing the image. Recommended size is under ${this.formatFileSize(this.RECOMMENDED_FILE_SIZE)}.`);
    }

    // Check file name
    if (file.name.length > 100) {
      recommendations.push('Consider using a shorter filename.');
    }

    // Add general recommendations
    if (file.type === 'image/png' && file.size > 500 * 1024) {
      recommendations.push('PNG files can be large. Consider converting to JPEG for better compression.');
    }

    if (file.type === 'image/jpeg') {
      recommendations.push('JPEG is a good choice for web images.');
    }

    if (file.type === 'image/webp') {
      recommendations.push('WebP provides excellent compression and quality.');
    }

    return {
      isValid,
      error,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  }

  // Format file size for display
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Upload image to blog-images bucket
  static async uploadImage(file: File): Promise<BlogImageUploadResult> {
    try {
      // Validate file - STRICT validation
      const validation = this.validateImage(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error!,
          recommendations: [
            'Use online tools like TinyPNG or Squoosh.app to compress your image',
            'Resize the image to 1200x800px or smaller',
            'Convert to JPEG format for better compression',
            'Try reducing the image quality to 70-80%'
          ]
        };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-image-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return {
          success: false,
          error: 'Failed to upload image. Please try again.',
          recommendations: validation.recommendations
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      return {
        success: true,
        imageUrl: urlData.publicUrl,
        recommendations: validation.recommendations
      };

    } catch (error) {
      console.error('Blog image upload error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  // Delete image from storage
  static async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      const { error } = await supabase.storage
        .from('blog-images')
        .remove([fileName]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Blog image delete error:', error);
      return false;
    }
  }

  // Get fallback image for blog posts
  static getFallbackImage(category?: string): string {
    const fallbackImages: Record<string, string> = {
      'International Law': '/src/assets/law-books.jpg',
      'Human Rights': '/src/assets/academic-building.jpg',
      'Trade Law': '/src/assets/law-books.jpg',
      'Environmental Law': '/src/assets/academic-building.jpg',
      'Constitutional Law': '/src/assets/law-books.jpg',
      'Corporate Law': '/src/assets/academic-building.jpg',
      'Criminal Law': '/src/assets/law-books.jpg',
      'Civil Rights': '/src/assets/academic-building.jpg'
    };

    return category && fallbackImages[category] 
      ? fallbackImages[category] 
      : '/src/assets/law-books.jpg';
  }

  // Get image URL with fallback
  static getImageUrlWithFallback(imageUrl?: string, category?: string): string {
    return imageUrl || this.getFallbackImage(category);
  }

  // Get optimization recommendations
  static getOptimizationRecommendations(): string[] {
    return [
      'Use JPEG format for photographs (better compression)',
      'Use WebP format for modern browsers (best compression)',
      'Keep file sizes under 1MB for optimal loading',
      'Recommended dimensions: 1200x800px for blog images',
      'Use descriptive filenames for better SEO',
      'Consider using image compression tools before upload'
    ];
  }
} 