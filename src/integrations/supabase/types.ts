export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown
          revoked: boolean | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown
          revoked?: boolean | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown
          revoked?: boolean | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          last_sign_in: string | null
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_sign_in?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_sign_in?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_designation: string | null
          author_email: string
          author_name: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_order: number | null
          id: string
          image_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_designation?: string | null
          author_email: string
          author_name?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_order?: number | null
          id?: string
          image_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_designation?: string | null
          author_email?: string
          author_name?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_order?: number | null
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message: string
          name: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      cosmopolitan_bulletins: {
        Row: {
          author_email: string
          author_name: string | null
          content: string
          created_at: string
          featured: boolean
          id: string
          image_url: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_email: string
          author_name?: string | null
          content: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_email?: string
          author_name?: string | null
          content?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dynamic_images: {
        Row: {
          created_at: string | null
          description: string | null
          display_name: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          position: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_name: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          position: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          position?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      editors: {
        Row: {
          bio: string | null
          created_at: string | null
          designation: string
          email: string | null
          id: string
          image_url: string
          is_active: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          designation: string
          email?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          designation?: string
          email?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          date: string
          description: string
          featured: boolean
          featured_order: number | null
          id: string
          image: string | null
          is_virtual: boolean | null
          location: string
          registered: number | null
          registration_url: string | null
          speakers: string[]
          status: string
          time: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          date: string
          description: string
          featured?: boolean
          featured_order?: number | null
          id?: string
          image?: string | null
          is_virtual?: boolean | null
          location: string
          registered?: number | null
          registration_url?: string | null
          speakers: string[]
          status: string
          time: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          date?: string
          description?: string
          featured?: boolean
          featured_order?: number | null
          id?: string
          image?: string | null
          is_virtual?: boolean | null
          location?: string
          registered?: number | null
          registration_url?: string | null
          speakers?: string[]
          status?: string
          time?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notices: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          link_text: string
          link_url: string
          priority: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          link_text: string
          link_url: string
          priority?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          link_text?: string
          link_url?: string
          priority?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          access_level: string
          author: string | null
          category: string
          created_at: string
          description: string
          download_count: number | null
          external_url: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          access_level?: string
          author?: string | null
          category: string
          created_at?: string
          description: string
          download_count?: number | null
          external_url?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          author?: string | null
          category?: string
          created_at?: string
          description?: string
          download_count?: number | null
          external_url?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          awards: string[] | null
          bio: string | null
          category: string
          created_at: string | null
          department: string | null
          education: string[] | null
          email: string | null
          expertise: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          position: string | null
          publications: number | null
          role: string
          social_links: Json | null
          updated_at: string | null
        }
        Insert: {
          awards?: string[] | null
          bio?: string | null
          category: string
          created_at?: string | null
          department?: string | null
          education?: string[] | null
          email?: string | null
          expertise?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          position?: string | null
          publications?: number | null
          role: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Update: {
          awards?: string[] | null
          bio?: string | null
          category?: string
          created_at?: string | null
          department?: string | null
          education?: string[] | null
          email?: string | null
          expertise?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          position?: string | null
          publications?: number | null
          role?: string
          social_links?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      website_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_dashboard_stats: {
        Row: {
          active_notices: number | null
          active_resources: number | null
          pending_blog_posts: number | null
          total_blog_posts: number | null
          total_events: number | null
          unread_messages: number | null
        }
        Relationships: []
      }
      admin_storage_access: {
        Row: {
          bucket_id: string | null
          can_read: boolean | null
          can_write: boolean | null
          created_at: string | null
          id: string | null
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          can_read?: never
          can_write?: never
          created_at?: string | null
          id?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          can_read?: never
          can_write?: never
          created_at?: string | null
          id?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_sessions: { Args: never; Returns: undefined }
      create_admin_user: {
        Args: { admin_email: string; admin_password: string }
        Returns: string
      }
      get_user_roles: {
        Args: { user_uuid?: string }
        Returns: {
          role: string
        }[]
      }
      has_role: {
        Args: { required_role?: string; user_uuid?: string }
        Returns: boolean
      }
      is_admin: { Args: { user_uuid?: string }; Returns: boolean }
      is_admin_bucket: { Args: { bucket_name: string }; Returns: boolean }
      is_admin_user: { Args: never; Returns: boolean }
      validate_storage_access: {
        Args: { bucket_name: string; operation: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
