export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          created_at: string
          content: string
          user_id: string
          user_email: string
          username: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          user_id: string
          user_email: string
          username?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          user_id?: string
          user_email?: string
          username?: string | null
          is_public?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
