export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ss_videos: {
        Row: {
          id: string
          title: string
          author: string
          source: string
          url: string
          category: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          source: string
          url: string
          category: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          source?: string
          url?: string
          category?: string
          tags?: string[]
          created_at?: string
        }
      }
      ss_category: {
        Row: {
          name: string
          description: string
          created_at: string
        }
        Insert: {
          name: string
          description: string
          created_at?: string
        }
        Update: {
          name?: string
          description?: string
          created_at?: string
        }
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
  }
}