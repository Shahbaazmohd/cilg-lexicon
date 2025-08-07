import { supabase } from '@/integrations/supabase/client';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  inquiry_type: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  inquiry_type: string;
  message: string;
}

export class ContactService {
  // Submit a new contact message
  static async submitContactMessage(data: ContactFormData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: data.name,
          email: data.email,
          subject: data.subject,
          inquiry_type: data.inquiry_type,
          message: data.message
        });

      if (error) {
        console.error('Error submitting contact message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in submitContactMessage:', error);
      return false;
    }
  }

  // Get all contact messages (admin)
  static async getAllContactMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contact messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllContactMessages:', error);
      return [];
    }
  }

  // Get unread contact messages count
  static async getUnreadCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('id')
        .eq('status', 'unread');

      if (error) {
        console.error('Error fetching unread count:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return 0;
    }
  }

  // Update message status
  static async updateMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating message status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateMessageStatus:', error);
      return false;
    }
  }

  // Add admin notes to a message
  static async addAdminNotes(id: string, notes: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ admin_notes: notes })
        .eq('id', id);

      if (error) {
        console.error('Error adding admin notes:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in addAdminNotes:', error);
      return false;
    }
  }

  // Delete a contact message
  static async deleteMessage(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteMessage:', error);
      return false;
    }
  }

  // Get recent contact messages (last 5)
  static async getRecentMessages(limit: number = 5): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentMessages:', error);
      return [];
    }
  }
}
