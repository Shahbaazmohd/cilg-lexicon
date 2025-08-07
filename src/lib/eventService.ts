import { supabase } from '@/integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  type: 'conference' | 'workshop' | 'lecture' | 'seminar' | 'webinar';
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  description: string;
  speakers: string[];
  registrationUrl?: string;
  capacity?: number;
  registered?: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'past';
  featured: boolean;
  featured_order?: number;
}

export class EventService {
  // Get all events
  static async getAllEvents(): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      return [];
    }
  }

  // Get event by ID
  static async getEventById(id: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getEventById:', error);
      return null;
    }
  }

  // Upload event image to events-images bucket
  static async uploadEventImage(file: File, eventId: string): Promise<string | null> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `event-${eventId}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('events-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('events-images')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading event image:', error);
      return null;
    }
  }

  // Update event image URL
  static async updateEventImageUrl(eventId: string, imageUrl: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .update({ image: imageUrl })
        .eq('id', eventId);

      if (error) {
        console.error('Error updating event image URL:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateEventImageUrl:', error);
      return false;
    }
  }

  // Delete event image from storage
  static async deleteEventImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error } = await supabase.storage
        .from('events-images')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting event image from storage:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteEventImage:', error);
      return false;
    }
  }

  // Get fallback image for events
  static getFallbackEventImage(): string {
    return '/src/assets/academic-building.jpg';
  }

  // Get image URL with fallback
  static getEventImageUrlWithFallback(imageUrl: string | null): string {
    return imageUrl || this.getFallbackEventImage();
  }
}