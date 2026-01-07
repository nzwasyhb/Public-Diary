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
        }
        Insert: {
          id?: string
          created_at?: string
          content: string
          user_id: string
          user_email: string
        }
        Update: {
          id?: string
          created_at?: string
          content?: string
          user_id?: string
          user_email?: string
        }
      }
    }
  }
}
