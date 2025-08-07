import { supabase } from '@/integrations/supabase/client';

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
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }

    return data || [];
  }

  // Get all resources (for admin view)
  static async getAllResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all resources:', error);
      throw error;
    }

    return data || [];
  }

  // Get resource by ID
  static async getResourceById(id: string): Promise<Resource | null> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }

    return data;
  }

  // Create new resource
  static async createResource(resourceData: CreateResourceData): Promise<Resource> {
    const { data, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (error) {
      console.error('Error creating resource:', error);
      throw error;
    }

    return data;
  }

  // Update resource
  static async updateResource(resourceData: UpdateResourceData): Promise<Resource> {
    const { id, ...updateData } = resourceData;
    
    const { data, error } = await supabase
      .from('resources')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating resource:', error);
      throw error;
    }

    return data;
  }

  // Delete resource
  static async deleteResource(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }

    return true;
  }

  // Upload file to storage
  static async uploadResourceFile(file: File): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `resources/${fileName}`;

    const { data, error } = await supabase.storage
      .from('resources')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath
    };
  }

  // Delete file from storage
  static async deleteResourceFile(filePath: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from('resources')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }

    return true;
  }

  // Increment download count
  static async incrementDownloadCount(id: string): Promise<void> {
    const { error } = await supabase
      .from('resources')
      .update({ download_count: supabase.rpc('increment') })
      .eq('id', id);

    if (error) {
      console.error('Error incrementing download count:', error);
      throw error;
    }
  }

  // Get resources by category
  static async getResourcesByCategory(category: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching resources by category:', error);
      throw error;
    }

    return data || [];
  }

  // Get featured resources
  static async getFeaturedResources(): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured resources:', error);
      throw error;
    }

    return data || [];
  }

  // Search resources
  static async searchResources(query: string): Promise<Resource[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('is_active', true)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching resources:', error);
      throw error;
    }

    return data || [];
  }

  // Get resource statistics
  static async getResourceStats(): Promise<{
    totalResources: number;
    activeResources: number;
    featuredResources: number;
    totalDownloads: number;
  }> {
    const { data: allResources, error: allError } = await supabase
      .from('resources')
      .select('download_count, is_active, is_featured');

    if (allError) {
      console.error('Error fetching resource stats:', allError);
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
