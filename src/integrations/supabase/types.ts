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
      companies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_members: {
        Row: {
          company_id: string
          id: string
          invited_by: string | null
          is_active: boolean | null
          joined_at: string | null
          permissions: Json | null
          role: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          permissions?: Json | null
          role?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean | null
          joined_at?: string | null
          permissions?: Json | null
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          company_id: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          location: string
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          location: string
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          location?: string
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          application_date: string | null
          created_at: string | null
          id: string
          job_id: string | null
          notes: string | null
          promoter_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_date?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          promoter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_date?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          notes?: string | null
          promoter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string | null
          description: string | null
          event_id: string | null
          hourly_rate: number | null
          id: string
          positions_available: number
          positions_filled: number | null
          requirements: string | null
          shift_end: string | null
          shift_start: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          hourly_rate?: number | null
          id?: string
          positions_available?: number
          positions_filled?: number | null
          requirements?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          hourly_rate?: number | null
          id?: string
          positions_available?: number
          positions_filled?: number | null
          requirements?: string | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          job_id: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          job_id?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          job_id?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          payment_method: string | null
          promoter_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          payment_method?: string | null
          promoter_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          payment_method?: string | null
          promoter_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_requests: {
        Row: {
          amount: number
          bank_details: Json | null
          id: string
          notes: string | null
          processed_at: string | null
          promoter_id: string | null
          requested_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          promoter_id?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          promoter_id?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payout_requests_promoter_id_fkey"
            columns: ["promoter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: Database["public"]["Enums"]["permission_type"]
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: Database["public"]["Enums"]["permission_type"]
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: Database["public"]["Enums"]["permission_type"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_type?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          job_id: string | null
          rated_id: string | null
          rater_id: string | null
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          rated_id?: string | null
          rater_id?: string | null
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          rated_id?: string | null
          rater_id?: string | null
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rated_id_fkey"
            columns: ["rated_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_rater_id_fkey"
            columns: ["rater_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission: Database["public"]["Enums"]["permission_type"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          permission: Database["public"]["Enums"]["permission_type"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          permission?: Database["public"]["Enums"]["permission_type"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission: Database["public"]["Enums"]["permission_type"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission?: Database["public"]["Enums"]["permission_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          job_id: string | null
          payment_id: string | null
          status: string | null
          type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          payment_id?: string | null
          status?: string | null
          type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          payment_id?: string | null
          status?: string | null
          type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          pending_balance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          pending_balance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          pending_balance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      calculate_promoter_earnings: {
        Args: { promoter_uuid: string }
        Returns: {
          total_earned: number
          pending_earnings: number
          available_for_payout: number
        }[]
      }
      get_user_roles: {
        Args: { user_uuid: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_permission: {
        Args: {
          user_uuid: string
          check_permission: Database["public"]["Enums"]["permission_type"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          user_uuid: string
          check_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "company_owner"
        | "company_manager"
        | "supervisor"
        | "promoter"
        | "event_coordinator"
      permission_type:
        | "create_events"
        | "edit_events"
        | "delete_events"
        | "view_events"
        | "create_jobs"
        | "edit_jobs"
        | "delete_jobs"
        | "view_jobs"
        | "manage_applications"
        | "view_applications"
        | "approve_applications"
        | "manage_payments"
        | "view_payments"
        | "process_payouts"
        | "manage_users"
        | "view_users"
        | "delete_users"
        | "manage_companies"
        | "view_companies"
        | "send_messages"
        | "view_messages"
        | "manage_ratings"
        | "view_ratings"
        | "admin_panel"
        | "view_analytics"
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
    Enums: {
      app_role: [
        "admin",
        "company_owner",
        "company_manager",
        "supervisor",
        "promoter",
        "event_coordinator",
      ],
      permission_type: [
        "create_events",
        "edit_events",
        "delete_events",
        "view_events",
        "create_jobs",
        "edit_jobs",
        "delete_jobs",
        "view_jobs",
        "manage_applications",
        "view_applications",
        "approve_applications",
        "manage_payments",
        "view_payments",
        "process_payouts",
        "manage_users",
        "view_users",
        "delete_users",
        "manage_companies",
        "view_companies",
        "send_messages",
        "view_messages",
        "manage_ratings",
        "view_ratings",
        "admin_panel",
        "view_analytics",
      ],
    },
  },
} as const
