export interface Database {
  public: {
    Tables: {
      assessments: {
        Row: {
          id: string
          session_id: string
          email: string
          website: string
          overall_score: number
          overall_percentage: number
          assessment_level: string
          level_icon: string
          level_description: string
          quick_win_tip: string
          completed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          email: string
          website: string
          overall_score: number
          overall_percentage: number
          assessment_level: string
          level_icon: string
          level_description: string
          quick_win_tip: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          email?: string
          website?: string
          overall_score?: number
          overall_percentage?: number
          assessment_level?: string
          level_icon?: string
          level_description?: string
          quick_win_tip?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessment_answers: {
        Row: {
          id: string
          assessment_id: string
          question_id: string
          category: string
          value: number
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_id: string
          category: string
          value: number
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_id?: string
          category?: string
          value?: number
          created_at?: string
        }
      }
      category_scores: {
        Row: {
          id: string
          assessment_id: string
          category: string
          score: number
          max_score: number
          percentage: number
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          category: string
          score: number
          max_score: number
          percentage: number
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          category?: string
          score?: number
          max_score?: number
          percentage?: number
          created_at?: string
        }
      }
      category_recommendations: {
        Row: {
          id: string
          category_score_id: string
          recommendation: string
          priority_order: number
          created_at: string
        }
        Insert: {
          id?: string
          category_score_id: string
          recommendation: string
          priority_order: number
          created_at?: string
        }
        Update: {
          id?: string
          category_score_id?: string
          recommendation?: string
          priority_order?: number
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          assessment_id: string
          first_name: string
          last_name: string
          email: string
          company: string
          phone: string | null
          business_type: string
          annual_revenue: string | null
          team_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          first_name: string
          last_name: string
          email: string
          company: string
          phone?: string | null
          business_type: string
          annual_revenue?: string | null
          team_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          first_name?: string
          last_name?: string
          email?: string
          company?: string
          phone?: string | null
          business_type?: string
          annual_revenue?: string | null
          team_size?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lead_challenges: {
        Row: {
          id: string
          lead_id: string
          challenge: string
          created_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          challenge: string
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          challenge?: string
          created_at?: string
        }
      }
      tracking_data: {
        Row: {
          id: string
          assessment_id: string
          session_id: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          referrer: string | null
          landing_page: string | null
          user_agent: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          session_id: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          referrer?: string | null
          landing_page?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          session_id?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          referrer?: string | null
          landing_page?: string | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          assessment_id: string | null
          session_id: string
          event_name: string
          event_data: any | null
          page: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id?: string | null
          session_id: string
          event_name: string
          event_data?: any | null
          page?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string | null
          session_id?: string
          event_name?: string
          event_data?: any | null
          page?: string | null
          timestamp?: string
          created_at?: string
        }
      }
    }
  }
}
