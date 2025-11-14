import { supabase } from '@/integrations/supabase/client';

export interface DynamicImage {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  image_url: string | null;
  position: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class DynamicImageService {
  // Get all dynamic images
  static async getAllImages(): Promise<DynamicImage[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('dynamic_images')
        .select('*')
        .order('position');

      if (error) {
        console.error('Error fetching dynamic images:', error);
        return [];
      }

      return (data || []) as DynamicImage[];
    } catch (error) {
      console.error('Error in getAllImages:', error);
      return [];
    }
  }

  // Get image by position
  static async getImageByPosition(position: string): Promise<DynamicImage | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('dynamic_images')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching image by position:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getImageByPosition:', error);
      return null;
    }
  }

  // Get image by name
  static async getImageByName(name: string): Promise<DynamicImage | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('dynamic_images')
        .select('*')
        .eq('name', name)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching image by name:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getImageByName:', error);
      return null;
    }
  }

  // Upload image to dynamic-images bucket
  static async uploadImage(file: File, position: string): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${position}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('dynamic-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dynamic-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  // Update image URL for a position
  static async updateImageUrl(position: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('dynamic_images')
        .update({ image_url: imageUrl })
        .eq('position', position);

      if (error) {
        console.error('Error updating image URL:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateImageUrl:', error);
      return false;
    }
  }

  // Update image configuration
  static async updateImage(id: string, updates: Partial<DynamicImage>): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('dynamic_images')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateImage:', error);
      return false;
    }
  }

  // Delete image from storage and update database
  static async deleteImage(position: string): Promise<boolean> {
    try {
      // Get current image
      const image = await this.getImageByPosition(position);
      if (!image || !image.image_url) {
        return true; // No image to delete
      }

      // Extract filename from URL
      const urlParts = image.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('dynamic-images')
        .remove([fileName]);

      if (storageError) {
        console.error('Error deleting from storage:', storageError);
      }

      // Update database to remove image_url
      const { error: dbError } = await (supabase as any)
        .from('dynamic_images')
        .update({ image_url: null })
        .eq('position', position);

      if (dbError) {
        console.error('Error updating database:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteImage:', error);
      return false;
    }
  }

  // Get fallback image for a position
  static getFallbackImage(position: string): string {
    const fallbackImages: Record<string, string> = {
      'hero': '/src/assets/hero-image.jpg',
      'about': '/src/assets/academic-building.jpg',
      'about-story': '/src/assets/academic-building.jpg',
      'research-area-1': '/src/assets/law-books.jpg',
      'research-area-2': '/src/assets/law-books.jpg',
      'research-area-3': '/src/assets/academic-building.jpg',
    };

    return fallbackImages[position] || '/src/assets/hero-image.jpg';
  }

  // Get image URL with fallback
  static async getImageUrlWithFallback(position: string): Promise<string> {
    try {
      const image = await this.getImageByPosition(position);
      return image?.image_url || this.getFallbackImage(position);
    } catch (error) {
      console.error('Error getting image URL with fallback:', error);
      return this.getFallbackImage(position);
    }
  }
} 