'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, Share2, LogOut, Inbox, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import MessageCard from '@/components/messages/MessageCard'
import { getMessagesByUsername, deleteMessage, subscribeToMessages } from '@/lib/supabase/messages'
import type { Message } from '@/lib/supabase/types'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  // Charger les messages au montage et s'abonner aux nouveaux messages
  useEffect(() => {
    if (!username) {
      setIsLoading(false)
      return
    }

    const loadMessages = async () => {
      try {
        setIsLoading(true)
        const fetchedMessages = await getMessagesByUsername(username)
        setMessages(fetchedMessages)
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()

    // S'abonner aux nouveaux messages en temps réel
    const unsubscribe = subscribeToMessages(username, (newMessage) => {
      setMessages((prev) => [newMessage, ...prev])
    })

    return () => {
      unsubscribe()
    }
  }, [username])

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id)
      setMessages(messages.filter(m => m.id !== id))
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error)
      alert('Erreur lors de la suppression du message')
    }
  }

  const copyLink = () => {
    if (typeof window !== 'undefined' && username) {
      const link = `${window.location.origin}/${username}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!username) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Aucun nom d'utilisateur spécifié
          </p>
          <Link href="/create">
            <Button>Créer un profil</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Ma boîte de réception
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                @{username}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={copyLink}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {copied ? 'Lien copié !' : 'Partager mon lien'}
              </Button>
              <Link href="/">
                <Button variant="secondary" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Inbox className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {messages.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Messages reçus
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  @{username}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Votre lien
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Messages ({messages.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des messages...
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <Inbox className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                Aucun message pour le moment
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Partagez votre lien pour commencer à recevoir des messages !
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageCard
                  key={message.id}
                  id={message.id}
                  content={message.content}
                  createdAt={message.created_at}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

