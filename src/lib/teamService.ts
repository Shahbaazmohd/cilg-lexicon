import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  position: string;
  department?: string;
  email?: string;
  bio?: string;
  expertise?: string[];
  education?: string[];
  publications?: number;
  awards?: string[];
  image_url?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    orcid?: string;
    googleScholar?: string;
  };
  category: 'core-team' | 'social-media-team' | 'research-editorial-team' | 'events-team' | 'mentors';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class TeamService {
  // Get all team members
  static async getAllTeamMembers(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('name');

      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllTeamMembers:', error);
      return [];
    }
  }

  // Get team members by category
  static async getTeamMembersByCategory(category: string): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching team members by category:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTeamMembersByCategory:', error);
      return [];
    }
  }

  // Upload team member image
  static async uploadTeamMemberImage(file: File, memberId: string): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `team-member-${memberId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('team-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('team-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading team member image:', error);
      return null;
    }
  }

  // Update team member image URL
  static async updateTeamMemberImageUrl(memberId: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ image_url: imageUrl })
        .eq('id', memberId);

      if (error) {
        console.error('Error updating team member image URL:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateTeamMemberImageUrl:', error);
      return false;
    }
  }

  // Get fallback image for team member
  static getFallbackImage(): string {
    return '/src/assets/academic-building.jpg';
  }

  // Get image URL with fallback
  static getImageUrlWithFallback(imageUrl?: string): string {
    return imageUrl || this.getFallbackImage();
  }

  // Get team member by ID
  static async getTeamMemberById(id: string): Promise<TeamMember | null> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching team member by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getTeamMemberById:', error);
      return null;
    }
  }

  // Get category display name
  static getCategoryDisplayName(category: string): string {
    const displayNames: Record<string, string> = {
      'core-team': 'Core Team',
      'social-media-team': 'Social Media Team',
      'research-editorial-team': 'Research & Editorial Team',
      'events-team': 'Events Team',
      'mentors': 'Mentors'
    };
    return displayNames[category] || category;
  }
} 