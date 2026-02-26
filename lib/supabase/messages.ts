import { supabase } from './client'
import type { Message } from './types'

/**
 * Crée un nouveau message anonyme pour un utilisateur
 */
export async function createMessage(
  recipientUsername: string,
  content: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          recipient_username: recipientUsername.toLowerCase(),
          content: content.trim(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Erreur lors de la création du message:', error)
    throw error
  }
}

/**
 * Récupère tous les messages d'un utilisateur par son username, triés par date (plus récents en premier)
 */
export async function getMessagesByUsername(
  username: string
): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('recipient_username', username.toLowerCase())
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error)
    throw error
  }
}

/**
 * Supprime un message
 */
export async function deleteMessage(messageId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', messageId)

    if (error) throw error
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error)
    throw error
  }
}

/**
 * S'abonne aux nouveaux messages en temps réel pour un username
 */
export function subscribeToMessages(
  username: string,
  callback: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${username}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_username=eq.${username.toLowerCase()}`,
      },
      (payload) => {
        callback(payload.new as Message)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

