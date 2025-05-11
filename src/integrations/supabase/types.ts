export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendees: {
        Row: {
          created_at: string
          game_id: string | null
          id: string
          published: boolean | null
          role: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id?: string | null
          id?: string
          published?: boolean | null
          role: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string | null
          id?: string
          published?: boolean | null
          role?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendees_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "classroom_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      classroom_sessions: {
        Row: {
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          location_id: string | null
          max_attendees: number | null
          room_name: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          location_id?: string | null
          max_attendees?: number | null
          room_name: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          location_id?: string | null
          max_attendees?: number | null
          room_name?: string
          title?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          court_number: number
          created_at: string
          created_by: string | null
          date: string
          description: string | null
          id: string
          location_id: string | null
          max_players: number | null
          title: string
        }
        Insert: {
          court_number: number
          created_at?: string
          created_by?: string | null
          date: string
          description?: string | null
          id?: string
          location_id?: string | null
          max_players?: number | null
          title: string
        }
        Update: {
          court_number?: number
          created_at?: string
          created_by?: string | null
          date?: string
          description?: string | null
          id?: string
          location_id?: string | null
          max_players?: number | null
          title?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          city: string
          courts: number | null
          created_at: string
          id: string
          name: string
          rooms: number | null
          state: string
          zip: string
        }
        Insert: {
          address: string
          city: string
          courts?: number | null
          created_at?: string
          id?: string
          name: string
          rooms?: number | null
          state: string
          zip: string
        }
        Update: {
          address?: string
          city?: string
          courts?: number | null
          created_at?: string
          id?: string
          name?: string
          rooms?: number | null
          state?: string
          zip?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          message: string
          status: string
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          message?: string
          status?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          message?: string
          status?: string
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          id: string
          is_admin: boolean
          is_super_admin: boolean
          name: string
          notification_preference: string | null
          phone: string | null
          photo_url: string | null
          role: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          id: string
          is_admin?: boolean
          is_super_admin?: boolean
          name: string
          notification_preference?: string | null
          phone?: string | null
          photo_url?: string | null
          role: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          is_super_admin?: boolean
          name?: string
          notification_preference?: string | null
          phone?: string | null
          photo_url?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
