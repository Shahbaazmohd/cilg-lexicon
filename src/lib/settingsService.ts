import { supabase } from '@/integrations/supabase/client';

export interface WebsiteSetting {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}

export class SettingsService {
  // Get a setting value by key
  static async getSetting(key: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('value')
        .eq('key', key)
        .single();

      if (error) {
        console.error('Error fetching setting:', error);
        return null;
      }

      return data?.value || null;
    } catch (error) {
      console.error('Error in getSetting:', error);
      return null;
    }
  }

  // Set a setting value by key
  static async setSetting(key: string, value: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('website_settings')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) {
        console.error('Error setting value:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in setSetting:', error);
      return false;
    }
  }

  // Get hero image URL
  static async getHeroImageUrl(): Promise<string> {
    const heroImageUrl = await this.getSetting('hero_image_url');
    return heroImageUrl || '/src/assets/hero-image.jpg'; // Default fallback
  }

  // Set hero image URL
  static async setHeroImageUrl(url: string): Promise<boolean> {
    return await this.setSetting('hero_image_url', url);
  }

  // Get site logo URL (used in hero and other sections)
  static async getLogoUrl(): Promise<string> {
    const defaultLogo = '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png';
    const logoUrl = await this.getSetting('site_logo_url');
    return logoUrl || defaultLogo;
  }

  // Set site logo URL
  static async setLogoUrl(url: string): Promise<boolean> {
    return await this.setSetting('site_logo_url', url);
  }

  // Get all settings
  static async getAllSettings(): Promise<WebsiteSetting[]> {
    try {
      const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .order('key');

      if (error) {
        console.error('Error fetching settings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllSettings:', error);
      return [];
    }
  }
} 