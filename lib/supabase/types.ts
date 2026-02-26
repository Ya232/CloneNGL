// Types pour la base de données Supabase

export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Message {
  id: string
  recipient_username: string
  content: string
  created_at: string
}

