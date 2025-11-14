import { supabase } from '@/integrations/supabase/client';

export interface Notice {
  id: string;
  title: string;
  description?: string;
  link_url: string;
  link_text: string;
  category: string;
  priority: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export class NoticeService {
  // Get all active notices
  static async getActiveNotices(): Promise<Notice[]> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveNotices:', error);
      return [];
    }
  }

  // Get all notices (admin)
  static async getAllNotices(): Promise<Notice[]> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all notices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllNotices:', error);
      return [];
    }
  }

  // Get featured notices
  static async getFeaturedNotices(): Promise<Notice[]> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching featured notices:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedNotices:', error);
      return [];
    }
  }

  // Get notice by ID
  static async getNoticeById(id: string): Promise<Notice | null> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching notice by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getNoticeById:', error);
      return null;
    }
  }

  // Create new notice
  static async createNotice(noticeData: Omit<Notice, 'id' | 'created_at' | 'updated_at'>): Promise<Notice | null> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .insert([noticeData])
        .select()
        .single();

      if (error) {
        console.error('Error creating notice:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createNotice:', error);
      return null;
    }
  }

  // Update notice
  static async updateNotice(id: string, noticeData: Partial<Notice>): Promise<Notice | null> {
    try {
      const { data, error } = await supabase
        .from('notices')
        .update(noticeData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating notice:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateNotice:', error);
      return null;
    }
  }

  // Delete notice
  static async deleteNotice(id: string): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting notice:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteNotice:', error);
      return false;
    }
  }

  // Toggle notice active status
  static async toggleNoticeStatus(id: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('notices')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) {
        console.error('Error toggling notice status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in toggleNoticeStatus:', error);
      return false;
    }
  }

  // Toggle notice featured status
  static async toggleNoticeFeatured(id: string, featured: boolean): Promise<boolean> {
    try {
      const { error } = await (supabase as any)
        .from('notices')
        .update({ featured: featured })
        .eq('id', id);

      if (error) {
        console.error('Error toggling notice featured status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in toggleNoticeFeatured:', error);
      return false;
    }
  }
}
