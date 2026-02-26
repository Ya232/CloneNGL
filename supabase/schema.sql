-- Schéma de base de données pour Clone NGL
-- Copiez-collez ce script dans le SQL Editor de Supabase

-- Table des profils utilisateurs
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages anonymes
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_recipient_username ON messages(recipient_username);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Politique RLS (Row Level Security) pour les profils
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Permettre la lecture publique des profils (pour vérifier si un username existe)
CREATE POLICY "Public read access for profiles" ON profiles
  FOR SELECT
  USING (true);

-- Permettre l'insertion publique pour créer des profils
CREATE POLICY "Public insert access for profiles" ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Politique RLS pour les messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Permettre l'insertion publique pour créer des messages
CREATE POLICY "Public insert access for messages" ON messages
  FOR INSERT
  WITH CHECK (true);

-- Permettre la lecture des messages par recipient_username
CREATE POLICY "Read messages by recipient" ON messages
  FOR SELECT
  USING (true);

-- Permettre la suppression des messages
CREATE POLICY "Delete own messages" ON messages
  FOR DELETE
  USING (true);
