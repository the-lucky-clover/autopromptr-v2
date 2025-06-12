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
      ai_optimization_settings: {
        Row: {
          auto_apply_suggestions: boolean | null
          created_at: string | null
          id: string
          optimization_level: string | null
          platform_specific_optimization: boolean | null
          preferred_ai_model: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_apply_suggestions?: boolean | null
          created_at?: string | null
          id?: string
          optimization_level?: string | null
          platform_specific_optimization?: boolean | null
          preferred_ai_model?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_apply_suggestions?: boolean | null
          created_at?: string | null
          id?: string
          optimization_level?: string | null
          platform_specific_optimization?: boolean | null
          preferred_ai_model?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_usage_tracking: {
        Row: {
          cost_estimate: number | null
          created_at: string | null
          id: string
          operation_type: string
          success: boolean | null
          tokens_consumed: number | null
          user_id: string
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string | null
          id?: string
          operation_type: string
          success?: boolean | null
          tokens_consumed?: number | null
          user_id: string
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string | null
          id?: string
          operation_type?: string
          success?: boolean | null
          tokens_consumed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      api_credentials: {
        Row: {
          api_key: string
          created_at: string | null
          endpoint: string | null
          id: string
          is_valid: boolean | null
          platform_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_key: string
          created_at?: string | null
          endpoint?: string | null
          id?: string
          is_valid?: boolean | null
          platform_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_key?: string
          created_at?: string | null
          endpoint?: string | null
          id?: string
          is_valid?: boolean | null
          platform_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_credentials_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      api_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          name: string
          scopes: string[] | null
          token_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name: string
          scopes?: string[] | null
          token_hash: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name?: string
          scopes?: string[] | null
          token_hash?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
          workspace_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "team_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_execution_state: {
        Row: {
          batch_id: string | null
          cancelled_at: string | null
          created_at: string | null
          current_step: number | null
          estimated_completion: string | null
          execution_end: string | null
          execution_mode: string | null
          execution_start: string | null
          id: string
          paused_at: string | null
          progress_percentage: number | null
          state_data: Json | null
          total_steps: number | null
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_step?: number | null
          estimated_completion?: string | null
          execution_end?: string | null
          execution_mode?: string | null
          execution_start?: string | null
          id?: string
          paused_at?: string | null
          progress_percentage?: number | null
          state_data?: Json | null
          total_steps?: number | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          current_step?: number | null
          estimated_completion?: string | null
          execution_end?: string | null
          execution_mode?: string | null
          execution_start?: string | null
          id?: string
          paused_at?: string | null
          progress_percentage?: number | null
          state_data?: Json | null
          total_steps?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_execution_state_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: true
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_schedules: {
        Row: {
          batch_id: string | null
          created_at: string | null
          cron_expression: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          max_runs: number | null
          next_run: string | null
          run_count: number | null
          schedule_type: string | null
          scheduled_time: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          cron_expression?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          max_runs?: number | null
          next_run?: string | null
          run_count?: number | null
          schedule_type?: string | null
          scheduled_time?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          cron_expression?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          max_runs?: number | null
          next_run?: string | null
          run_count?: number | null
          schedule_type?: string | null
          scheduled_time?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batch_schedules_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_history: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          invoice_url: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          status: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          invoice_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_logs: {
        Row: {
          batch_id: string | null
          created_at: string | null
          error_message: string | null
          executed_at: string | null
          id: string
          platform_response_time: number | null
          prompt_id: string | null
          result_url: string | null
          success_status: boolean | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          platform_response_time?: number | null
          prompt_id?: string | null
          result_url?: string | null
          success_status?: boolean | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          platform_response_time?: number | null
          prompt_id?: string | null
          result_url?: string | null
          success_status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "execution_logs_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_logs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_metrics: {
        Row: {
          batch_id: string | null
          cost_estimate: number | null
          created_at: string | null
          error_category: string | null
          execution_time_ms: number | null
          id: string
          platform_name: string
          prompt_id: string | null
          queue_time_ms: number | null
          retry_count: number | null
          success_rate: number | null
          tokens_consumed: number | null
        }
        Insert: {
          batch_id?: string | null
          cost_estimate?: number | null
          created_at?: string | null
          error_category?: string | null
          execution_time_ms?: number | null
          id?: string
          platform_name: string
          prompt_id?: string | null
          queue_time_ms?: number | null
          retry_count?: number | null
          success_rate?: number | null
          tokens_consumed?: number | null
        }
        Update: {
          batch_id?: string | null
          cost_estimate?: number | null
          created_at?: string | null
          error_category?: string | null
          execution_time_ms?: number | null
          id?: string
          platform_name?: string
          prompt_id?: string | null
          queue_time_ms?: number | null
          retry_count?: number | null
          success_rate?: number | null
          tokens_consumed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "execution_metrics_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_metrics_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_queue: {
        Row: {
          batch_id: string | null
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          job_type: string
          max_retries: number | null
          metadata: Json | null
          priority: number | null
          prompt_id: string | null
          retry_attempts: number | null
          scheduled_at: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          batch_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          max_retries?: number | null
          metadata?: Json | null
          priority?: number | null
          prompt_id?: string | null
          retry_attempts?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          batch_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          max_retries?: number | null
          metadata?: Json | null
          priority?: number | null
          prompt_id?: string | null
          retry_attempts?: number | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_queue_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_queue_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_template: string
          created_at: string | null
          id: string
          subject_template: string
          type: string
          updated_at: string | null
        }
        Insert: {
          body_template: string
          created_at?: string | null
          id?: string
          subject_template: string
          type: string
          updated_at?: string | null
        }
        Update: {
          body_template?: string
          created_at?: string | null
          id?: string
          subject_template?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_batch_id: string | null
          related_prompt_id: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_batch_id?: string | null
          related_prompt_id?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_batch_id?: string | null
          related_prompt_id?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_batch_id_fkey"
            columns: ["related_batch_id"]
            isOneToOne: false
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_prompt_id_fkey"
            columns: ["related_prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_templates: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          optimized_pattern: string
          original_pattern: string
          platform_target: string | null
          success_rate: number | null
          template_description: string | null
          template_name: string
          updated_at: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          optimized_pattern: string
          original_pattern: string
          platform_target?: string | null
          success_rate?: number | null
          template_description?: string | null
          template_name: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          optimized_pattern?: string
          original_pattern?: string
          platform_target?: string | null
          success_rate?: number | null
          template_description?: string | null
          template_name?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      platform_health: {
        Row: {
          circuit_breaker_open: boolean | null
          created_at: string | null
          error_count: number | null
          id: string
          last_check: string | null
          next_reset_time: string | null
          platform_name: string
          rate_limit_remaining: number | null
          response_time_ms: number | null
          status: string | null
          success_rate: number | null
        }
        Insert: {
          circuit_breaker_open?: boolean | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          last_check?: string | null
          next_reset_time?: string | null
          platform_name: string
          rate_limit_remaining?: number | null
          response_time_ms?: number | null
          status?: string | null
          success_rate?: number | null
        }
        Update: {
          circuit_breaker_open?: boolean | null
          created_at?: string | null
          error_count?: number | null
          id?: string
          last_check?: string | null
          next_reset_time?: string | null
          platform_name?: string
          rate_limit_remaining?: number | null
          response_time_ms?: number | null
          status?: string | null
          success_rate?: number | null
        }
        Relationships: []
      }
      platform_selectors: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          platform_id: string | null
          priority: number
          selector_type: string
          selector_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform_id?: string | null
          priority?: number
          selector_type: string
          selector_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          platform_id?: string | null
          priority?: number
          selector_type?: string
          selector_value?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_selectors_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          avg_response_time: number | null
          base_url: string | null
          created_at: string | null
          default_endpoint: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          rate_limit_per_hour: number | null
          requires_api_key: boolean | null
          slug: string
          success_rate: number | null
          supports_custom_endpoint: boolean | null
        }
        Insert: {
          avg_response_time?: number | null
          base_url?: string | null
          created_at?: string | null
          default_endpoint?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rate_limit_per_hour?: number | null
          requires_api_key?: boolean | null
          slug: string
          success_rate?: number | null
          supports_custom_endpoint?: boolean | null
        }
        Update: {
          avg_response_time?: number | null
          base_url?: string | null
          created_at?: string | null
          default_endpoint?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rate_limit_per_hour?: number | null
          requires_api_key?: boolean | null
          slug?: string
          success_rate?: number | null
          supports_custom_endpoint?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_features_enabled: boolean | null
          ai_usage_quota: number | null
          ai_usage_remaining: number | null
          api_usage_count: number | null
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          last_login: string | null
          preferences: Json | null
          subscription_plan: string | null
          updated_at: string | null
          usage_limits: Json | null
        }
        Insert: {
          ai_features_enabled?: boolean | null
          ai_usage_quota?: number | null
          ai_usage_remaining?: number | null
          api_usage_count?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          last_login?: string | null
          preferences?: Json | null
          subscription_plan?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
        }
        Update: {
          ai_features_enabled?: boolean | null
          ai_usage_quota?: number | null
          ai_usage_remaining?: number | null
          api_usage_count?: number | null
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          last_login?: string | null
          preferences?: Json | null
          subscription_plan?: string | null
          updated_at?: string | null
          usage_limits?: Json | null
        }
        Relationships: []
      }
      prompt_batches: {
        Row: {
          archived: boolean | null
          batch_name: string | null
          created_at: string
          description: string | null
          execution_count: number | null
          id: string
          is_template: boolean | null
          platform_targets: string[] | null
          project_url: string | null
          status: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean | null
          batch_name?: string | null
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_template?: boolean | null
          platform_targets?: string[] | null
          project_url?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean | null
          batch_name?: string | null
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_template?: boolean | null
          platform_targets?: string[] | null
          project_url?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_optimization_history: {
        Row: {
          created_at: string | null
          execution_success: boolean | null
          id: string
          optimization_type: string
          optimized_prompt: string
          original_prompt: string
          platform_target: string | null
          quality_score_after: number | null
          quality_score_before: number | null
          user_id: string
          was_applied: boolean | null
        }
        Insert: {
          created_at?: string | null
          execution_success?: boolean | null
          id?: string
          optimization_type: string
          optimized_prompt: string
          original_prompt: string
          platform_target?: string | null
          quality_score_after?: number | null
          quality_score_before?: number | null
          user_id: string
          was_applied?: boolean | null
        }
        Update: {
          created_at?: string | null
          execution_success?: boolean | null
          id?: string
          optimization_type?: string
          optimized_prompt?: string
          original_prompt?: string
          platform_target?: string | null
          quality_score_after?: number | null
          quality_score_before?: number | null
          user_id?: string
          was_applied?: boolean | null
        }
        Relationships: []
      }
      prompt_submissions: {
        Row: {
          content: string
          created_at: string | null
          error_message: string | null
          id: string
          platform_id: string | null
          processed_at: string | null
          result_url: string | null
          retry_count: number | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          platform_id?: string | null
          processed_at?: string | null
          result_url?: string | null
          retry_count?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          platform_id?: string | null
          processed_at?: string | null
          result_url?: string | null
          retry_count?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompt_submissions_platform_id_fkey"
            columns: ["platform_id"]
            isOneToOne: false
            referencedRelation: "platforms"
            referencedColumns: ["id"]
          },
        ]
      }
      prompts: {
        Row: {
          batch_id: string
          content: string
          created_at: string
          error_message: string | null
          estimated_tokens: number | null
          execution_order: number | null
          id: string
          improved_prompt: string | null
          optimization_score: number | null
          original_prompt: string
          output_data: Json | null
          platform_target: string
          position: number | null
          project_url: string | null
          retry_attempts: number
          status: string
          target_platform: string | null
          updated_at: string
        }
        Insert: {
          batch_id: string
          content: string
          created_at?: string
          error_message?: string | null
          estimated_tokens?: number | null
          execution_order?: number | null
          id?: string
          improved_prompt?: string | null
          optimization_score?: number | null
          original_prompt: string
          output_data?: Json | null
          platform_target?: string
          position?: number | null
          project_url?: string | null
          retry_attempts?: number
          status?: string
          target_platform?: string | null
          updated_at?: string
        }
        Update: {
          batch_id?: string
          content?: string
          created_at?: string
          error_message?: string | null
          estimated_tokens?: number | null
          execution_order?: number | null
          id?: string
          improved_prompt?: string | null
          optimization_score?: number | null
          original_prompt?: string
          output_data?: Json | null
          platform_target?: string
          position?: number | null
          project_url?: string | null
          retry_attempts?: number
          status?: string
          target_platform?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "prompt_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json
          id: string
          is_active: boolean | null
          limits: Json
          name: string
          price_monthly: number
          stripe_price_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          name: string
          price_monthly: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          limits?: Json
          name?: string
          price_monthly?: number
          stripe_price_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          status: string | null
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          category: string
          created_at: string
          id: string
          level: string
          message: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          level?: string
          message: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          level?: string
          message?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          invited_at: string | null
          invited_by: string | null
          joined_at: string | null
          role: string
          status: string | null
          user_id: string
          workspace_id: string
        }
        Insert: {
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          status?: string | null
          user_id: string
          workspace_id: string
        }
        Update: {
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          status?: string | null
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "team_workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      team_workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string
          settings: Json | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          settings?: Json | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          settings?: Json | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_workspaces_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          prompts_json: Json
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          prompts_json: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          prompts_json?: Json
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      usage_quotas: {
        Row: {
          created_at: string | null
          current_usage: number | null
          id: string
          limit_value: number
          quota_type: string
          reset_date: string
          subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_usage?: number | null
          id?: string
          limit_value: number
          quota_type: string
          reset_date: string
          subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_usage?: number | null
          id?: string
          limit_value?: number
          quota_type?: string
          reset_date?: string
          subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_quotas_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          notification_channels: string[] | null
          notify_on_error: boolean | null
          notify_on_success: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          notification_channels?: string[] | null
          notify_on_error?: boolean | null
          notify_on_success?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          notification_channels?: string[] | null
          notify_on_error?: boolean | null
          notify_on_success?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          api_calls: number | null
          created_at: string | null
          date: string
          executions_count: number | null
          id: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          api_calls?: number | null
          created_at?: string | null
          date?: string
          executions_count?: number | null
          id?: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          api_calls?: number | null
          created_at?: string | null
          date?: string
          executions_count?: number | null
          id?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_use_ai_features: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      check_usage_limit: {
        Args: { p_user_id: string; p_quota_type: string; p_amount?: number }
        Returns: boolean
      }
      get_next_job: {
        Args: Record<PropertyKey, never>
        Returns: {
          job_id: string
          batch_id: string
          prompt_id: string
          job_type: string
          metadata: Json
        }[]
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_subscription: {
        Args: { p_user_id: string }
        Returns: {
          plan_name: string
          status: string
          features: Json
          limits: Json
          current_period_end: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_usage: {
        Args: { p_user_id: string; p_quota_type: string; p_amount?: number }
        Returns: undefined
      }
      track_ai_usage: {
        Args: {
          p_user_id: string
          p_operation_type: string
          p_tokens_consumed?: number
          p_cost_estimate?: number
          p_success?: boolean
        }
        Returns: undefined
      }
      track_user_usage: {
        Args: {
          p_user_id: string
          p_api_calls?: number
          p_executions?: number
          p_tokens?: number
        }
        Returns: undefined
      }
      update_execution_progress: {
        Args: {
          p_batch_id: string
          p_current_step: number
          p_total_steps: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
