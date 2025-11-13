import { supabase } from '@/integrations/supabase/client';
import { adminSupabase } from '@/integrations/supabase/adminClient';

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
  category: 'patrons' | 'faculty' | 'convenor' | 'core-team' | 'team-heads' | 'members' | 'past-contributors' | 'developers' | 'social-media-team' | 'research-editorial-team' | 'events-team' | 'mentors';
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
      const { error } = await adminSupabase
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
      'patrons': 'Patrons',
      'faculty': 'Faculty',
      'convenor': 'Convenor',
      'core-team': 'Core Team',
      'team-heads': 'Team Heads',
      'members': 'Members',
      'past-contributors': 'Past Contributors',
      'developers': 'Developers'
    };
    return displayNames[category] || category;
  }

  // Create new team member
  static async createTeamMember(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember | null> {
    try {
      const newMember = {
        ...member,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Use admin client for admin operations (bypasses RLS)
      const { data, error } = await adminSupabase
        .from('team_members')
        .insert([newMember])
        .select()
        .single();

      if (error) {
        console.error('Error creating team member:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createTeamMember:', error);
      return null;
    }
  }

  // Update existing team member
  static async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    try {
      console.log('🔧 TeamService.updateTeamMember called with:');
      console.log('  ID:', id);
      console.log('  ID:', id);
      console.log('  Updates:', updates);
      
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      console.log('  Final update data:', updateData);

      // First, try to update without returning data
      const { error: updateError } = await adminSupabase
        .from('team_members')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('❌ Supabase error updating team member:', updateError);
        console.error('  Error code:', updateError.code);
        console.error('  Error message:', updateError.message);
        console.error('  Error details:', updateError.details);
        return null;
      }

      console.log('✅ Update operation completed successfully');

      // Now fetch the updated member separately
      const { data: updatedMember, error: fetchError } = await adminSupabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('❌ Error fetching updated team member:', fetchError);
        console.error('  Error code:', fetchError.code);
        console.error('  Error message:', fetchError.message);
        return null;
      }

      console.log('✅ Team member fetched after update:', updatedMember);
      return updatedMember;
    } catch (error) {
      console.error('❌ Unexpected error in updateTeamMember:', error);
      console.error('  Error name:', error.name);
      console.error('  Error message:', error.message);
      console.error('  Error stack:', error.stack);
      return null;
    }
  }

  // Delete team member (soft delete by setting is_active to false)
  static async deleteTeamMember(id: string): Promise<boolean> {
    try {
      const { error } = await adminSupabase
        .from('team_members')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error deleting team member:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteTeamMember:', error);
      return false;
    }
  }
} 