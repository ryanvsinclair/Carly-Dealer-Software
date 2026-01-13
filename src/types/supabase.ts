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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      dealer_group_memberships: {
        Row: {
          created_at: string
          created_by: string | null
          dealer_group_id: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["dealer_group_role"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dealer_group_id: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["dealer_group_role"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dealer_group_id?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["dealer_group_role"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_group_memberships_dealer_group_id_fkey"
            columns: ["dealer_group_id"]
            isOneToOne: false
            referencedRelation: "dealer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_groups: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string | null
          slug: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string | null
          slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dealer_invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          dealership_id: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          role: Database["public"]["Enums"]["dealer_role"]
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          dealership_id: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          role: Database["public"]["Enums"]["dealer_role"]
          status?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          dealership_id?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          role?: Database["public"]["Enums"]["dealer_role"]
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_invitations_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
      }
      dealer_memberships: {
        Row: {
          created_at: string
          created_by: string | null
          dealership_id: string
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["dealer_role"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dealership_id: string
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["dealer_role"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dealership_id?: string
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["dealer_role"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dealer_memberships_dealership_id_fkey"
            columns: ["dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
        ]
      }
      dealerships: {
        Row: {
          account_status: Database["public"]["Enums"]["dealership_account_status"]
          address: string | null
          banner_url: string | null
          business_number: string | null
          city: string | null
          created_at: string
          dealer_group_id: string | null
          email: string | null
          id: string
          latitude: number | null
          legal_name: string | null
          logo_url: string | null
          longitude: number | null
          name: string
          phone_number: string | null
          postal_code: string | null
          province_code: string | null
          slug: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["dealership_verification_status"]
          website: string | null
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["dealership_account_status"]
          address?: string | null
          banner_url?: string | null
          business_number?: string | null
          city?: string | null
          created_at?: string
          dealer_group_id?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          phone_number?: string | null
          postal_code?: string | null
          province_code?: string | null
          slug: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["dealership_verification_status"]
          website?: string | null
        }
        Update: {
          account_status?: Database["public"]["Enums"]["dealership_account_status"]
          address?: string | null
          banner_url?: string | null
          business_number?: string | null
          city?: string | null
          created_at?: string
          dealer_group_id?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          legal_name?: string | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          phone_number?: string | null
          postal_code?: string | null
          province_code?: string | null
          slug?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["dealership_verification_status"]
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dealerships_dealer_group_id_fkey"
            columns: ["dealer_group_id"]
            isOneToOne: false
            referencedRelation: "dealer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          country_code: string | null
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          province_code: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          province_code?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          province_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          country_code: string | null
          created_at: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string | null
          phone_number: string | null
          postal_code: string | null
          province_code: string | null
          role: string | null
        }
        Insert: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          province_code?: string | null
          role?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          phone_number?: string | null
          postal_code?: string | null
          province_code?: string | null
          role?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          make: string | null
          mileage: number | null
          model: string | null
          owner_dealership_id: string | null
          owner_profile_id: string | null
          owner_type: Database["public"]["Enums"]["vehicle_owner_type"]
          price: number | null
          publish_status: Database["public"]["Enums"]["vehicle_publish_status"]
          sale_status: Database["public"]["Enums"]["vehicle_sale_status"]
          trim: string | null
          updated_at: string
          vin: string | null
          year: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          make?: string | null
          mileage?: number | null
          model?: string | null
          owner_dealership_id?: string | null
          owner_profile_id?: string | null
          owner_type: Database["public"]["Enums"]["vehicle_owner_type"]
          price?: number | null
          publish_status?: Database["public"]["Enums"]["vehicle_publish_status"]
          sale_status?: Database["public"]["Enums"]["vehicle_sale_status"]
          trim?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          make?: string | null
          mileage?: number | null
          model?: string | null
          owner_dealership_id?: string | null
          owner_profile_id?: string | null
          owner_type?: Database["public"]["Enums"]["vehicle_owner_type"]
          price?: number | null
          publish_status?: Database["public"]["Enums"]["vehicle_publish_status"]
          sale_status?: Database["public"]["Enums"]["vehicle_sale_status"]
          trim?: string | null
          updated_at?: string
          vin?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_dealership_id_fkey"
            columns: ["owner_dealership_id"]
            isOneToOne: false
            referencedRelation: "dealerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_dealer_invite: { Args: { invite_token: string }; Returns: string }
      create_dealer_vehicle: {
        Args: {
          p_dealership_id: string
          p_vin: string
          p_year: number
          p_make: string
          p_model: string
          p_trim: string
          p_mileage: number
          p_price: number
          p_description: string
        }
        Returns: {
          id: string
          owner_type: string
          owner_dealership_id: string | null
          owner_profile_id: string | null
          vin: string | null
          year: number
          make: string
          model: string
          trim: string | null
          mileage: number
          price: number
          description: string | null
          publish_status: string
          sale_status: string
          created_by: string
          created_at: string
          updated_at: string
        }[]
      }
      get_dealer_inventory: {
        Args: { p_dealership_id: string }
        Returns: {
          id: string
          year: number
          make: string
          model: string
          trim: string | null
          price: number
          publish_status: string
          sale_status: string
          updated_at: string
          created_at: string
        }[]
      }
      get_dealer_team: {
        Args: { p_dealership_id: string }
        Returns: {
          membership_id: string
          user_id: string
          role: Database["public"]["Enums"]["dealer_role"]
          is_active: boolean
          name: string | null
          email: string | null
          phone_number: string | null
          created_at: string
        }[]
      }
      get_my_dealer_permissions: {
        Args: { p_dealership_id: string }
        Returns: {
          permission_key: string
        }[]
      }
      get_my_dealerships: {
        Args: never
        Returns: {
          city: string
          dealership_id: string
          logo_url: string
          name: string
          province_code: string
          role: Database["public"]["Enums"]["dealer_role"]
        }[]
      }
      is_active_dealer_member: { Args: { did: string }; Returns: boolean }
      is_dealer_member: {
        Args: { _dealership_id: string; _user_id: string }
        Returns: boolean
      }
      publish_dealer_vehicle: {
        Args: { p_vehicle_id: string }
        Returns: {
          id: string
          publish_status: string
          updated_at: string
        }[]
      }
      resolve_postal_code: {
        Args: { p_postal_code: string }
        Returns: {
          city: string
          country_code: string
          latitude: number
          longitude: number
          province_code: string
        }[]
      }
      search_postal_codes: {
        Args: { p_query: string }
        Returns: {
          city: string
          country_code: string
          latitude: number
          longitude: number
          postal_code: string
          province_code: string
        }[]
      }
    }
    Enums: {
      dealer_group_role: "group_admin" | "group_manager" | "auditor"
      dealer_role:
        | "general_manager"
        | "sales_manager"
        | "finance_manager"
        | "salesperson"
      dealership_account_status: "active" | "suspended"
      dealership_verification_status: "unverified" | "verified"
      vehicle_owner_type: "consumer" | "dealer"
      vehicle_publish_status: "draft" | "published" | "archived"
      vehicle_sale_status: "available" | "pending" | "sold"
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
    Enums: {
      dealer_group_role: ["group_admin", "group_manager", "auditor"],
      dealer_role: [
        "general_manager",
        "sales_manager",
        "finance_manager",
        "salesperson",
      ],
      dealership_account_status: ["active", "suspended"],
      dealership_verification_status: ["unverified", "verified"],
      vehicle_owner_type: ["consumer", "dealer"],
      vehicle_publish_status: ["draft", "published", "archived"],
      vehicle_sale_status: ["available", "pending", "sold"],
    },
  },
} as const
