import { supabase } from '@/integrations/supabase/client';
import { adminSupabase } from '@/integrations/supabase/adminClient';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'link' | 'database' | 'publication' | 'report' | 'guide' | 'dataset' | 'tool';
  category: string;
  file_url?: string;
  external_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  author?: string;
  tags: string[];
  access_level: 'free' | 'subscription' | 'restricted';
  download_count: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResourceData {
  title: string;
  description: string;
  type: Resource['type'];
  category: string;
  file_url?: string;
  external_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  author?: string;
  tags?: string[];
  access_level?: Resource['access_level'];
  is_featured?: boolean;
  is_active?: boolean;
}

export interface UpdateResourceData extends Partial<CreateResourceData> {
  id: string;
}

export class ResourceService {
  // Get all active resources (for public view)
  static async getAllActiveResources(): Promise<Resource[]> {
    const { data, error } = await (supabase as any)
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }

    return (data || []) as Resource[];
  }

  // Get all resources (for admin view)
  static async getAllResources(): Promise<Resource[]> {
    const { data, error } = await (adminSupabase as any)
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching all resources:', error);
      console.error('  Error code:', error.code);
      console.error('  Error message:', error.message);
      throw error;
    }

    return (data || []) as Resource[];
  }

  // Get resource by ID
  static async getResourceById(id: string): Promise<Resource | null> {
    const { data, error } = await (supabase as any)
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }

    return data as Resource;
  }

  // Create new resource (admin only)
  static async createResource(resourceData: CreateResourceData): Promise<Resource> {
    console.log('🔧 Creating resource:', resourceData);
    
    const { data, error } = await (adminSupabase as any)
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating resource:', error);
      console.error('  Error code:', error.code);
      console.error('  Error message:', error.message);
      throw error;
    }

    console.log('✅ Resource created successfully:', data);
    return data as Resource;
  }

  // Update resource (admin only)
  static async updateResource(resourceData: UpdateResourceData): Promise<Resource> {
    const { id, ...updateData } = resourceData;
    
    console.log('🔧 Updating resource:', { id, ...updateData });
    
    const { data, error } = await (adminSupabase as any)
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating resource:', error);
      console.error('  Error code:', error.code);
      console.error('  Error message:', error.message);
      throw error;
    }

    console.log('✅ Resource updated successfully:', data);
    return data as Resource;
  }

  static async deleteResource(id: string): Promise<boolean> {
    console.log('🔧 Deleting resource:', id);
    
    const { error } = await (adminSupabase as any)
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting resource:', error);
      console.error('  Error code:', error.code);
      console.error('  Error message:', error.message);
      throw error;
    }

    console.log('✅ Resource deleted successfully');
    return true;
  }

  // Upload file to storage (admin only)
  static async uploadResourceFile(file: File): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `resources/${fileName}`;

    console.log('🔧 Uploading file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      path: filePath
    });

    const { data, error } = await adminSupabase.storage
      .from('resources')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Error uploading file:', error);
      console.error('  Error message:', error.message);
      throw error;
    }

    console.log('✅ File uploaded successfully:', data);

    const { data: urlData } = adminSupabase.storage
      .from('resources')
      .getPublicUrl(filePath);

    console.log('🔗 Public URL generated:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  }

  // Delete file from storage (admin only)
  static async deleteResourceFile(filePath: string): Promise<boolean> {
    console.log('🔧 Deleting file from storage:', filePath);
    
    const { error } = await adminSupabase.storage
      .from('resources')
      .remove([filePath]);

    if (error) {
      console.error('❌ Error deleting file:', error);
      console.error('  Error message:', error.message);
      throw error;
    }

    console.log('✅ File deleted from storage successfully');
    return true;
  }

  // Generate download URL (ensures proper download behavior)
  static async generateDownloadUrl(fileUrl: string, fileName: string): Promise<string> {
    try {
      console.log('🔧 Generating download URL for:', fileUrl);
      
      // If it's a Supabase storage URL, try to generate a signed URL for proper download behavior
      if (fileUrl.includes('supabase.co') && fileUrl.includes('/storage/v1/object/public/')) {
        try {
          // Extract bucket and file path from the public URL
          const urlParts = fileUrl.split('/storage/v1/object/public/');
          if (urlParts.length === 2) {
            const bucketAndPath = urlParts[1];
            const [bucket, ...pathParts] = bucketAndPath.split('/');
            const filePath = pathParts.join('/');
            
            console.log('🔧 Extracted bucket:', bucket, 'filePath:', filePath);
            
            // Generate signed URL with download disposition
            const { data, error } = await supabase.storage
              .from(bucket)
              .createSignedUrl(filePath, 3600, {
                download: fileName
              });
            
            if (error) {
              console.warn('⚠️ Could not generate signed URL, using public URL:', error);
              return fileUrl;
            }
            
            console.log('✅ Generated signed URL successfully');
            return data.signedUrl;
          }
        } catch (signedUrlError) {
          console.warn('⚠️ Error generating signed URL, using public URL:', signedUrlError);
        }
      }
      
      // For non-Supabase URLs or if signed URL generation fails, return the original URL
      console.log('🔧 Using original URL for download');
      return fileUrl;
    } catch (error) {
      console.error('❌ Error in generateDownloadUrl:', error);
      // Return original URL as fallback
      return fileUrl;
    }
  }

  // Increment download count
  static async incrementDownloadCount(id: string): Promise<void> {
    try {
      // First get the current download count
      const { data: currentResource, error: fetchError } = await (adminSupabase as any)
        .from('resources')
        .select('download_count')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching current download count:', fetchError);
        throw fetchError;
      }

      // Increment the count
      const newCount = (currentResource?.download_count || 0) + 1;
      
      const { error: updateError } = await (adminSupabase as any)
        .from('resources')
        .update({ download_count: newCount })
        .eq('id', id);

      if (updateError) {
        console.error('❌ Error updating download count:', updateError);
        console.error('  Error code:', updateError.code);
        console.error('  Error message:', updateError.message);
        throw updateError;
      }
      
      console.log('✅ Download count incremented successfully for resource:', id);
    } catch (error) {
      console.error('❌ Error in incrementDownloadCount:', error);
      throw error;
    }
  }

  // Get resources by category
  static async getResourcesByCategory(category: string): Promise<Resource[]> {
    const { data, error } = await (supabase as any)
      .from('resources')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources by category:', error);
      throw error;
    }

    return (data || []) as Resource[];
  }

  // Get featured resources
  static async getFeaturedResources(): Promise<Resource[]> {
    const { data, error } = await (supabase as any)
      .from('resources')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured resources:', error);
      throw error;
    }

    return (data || []) as Resource[];
  }

  // Search resources
  static async searchResources(query: string): Promise<Resource[]> {
    const { data, error } = await (supabase as any)
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching resources:', error);
      throw error;
    }

    return (data || []) as Resource[];
  }

  // Get resource statistics
  static async getResourceStats(): Promise<{
    totalResources: number;
    activeResources: number;
    featuredResources: number;
    totalDownloads: number;
  }> {
    const { data: allResources, error: allError } = await (adminSupabase as any)
      .from('resources')
      .select('download_count, is_active, is_featured');

    if (allError) {
      console.error('❌ Error fetching resource stats:', allError);
      console.error('  Error code:', allError.code);
      console.error('  Error message:', allError.message);
      throw allError;
    }

    const totalResources = allResources?.length || 0;
    const activeResources = allResources?.filter(r => r.is_active).length || 0;
    const featuredResources = allResources?.filter(r => r.is_featured && r.is_active).length || 0;
    const totalDownloads = allResources?.reduce((sum, r) => sum + (r.download_count || 0), 0) || 0;

    return {
      totalResources,
      activeResources,
      featuredResources,
      totalDownloads
    };
  }
}
