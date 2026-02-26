'use client'

import { useState, useEffect, use } from 'react'
import { Send, MessageSquare, Copy, Check, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import { createMessage } from '@/lib/supabase/messages'
import { getProfileByUsername } from '@/lib/supabase/users'

interface PublicPageProps {
  params: Promise<{
    username: string
  }>
}

export default function PublicPage({ params }: PublicPageProps) {
  const { username } = use(params)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [profileExists, setProfileExists] = useState<boolean | null>(null)

  // Vérifier si le profil existe au chargement
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const profile = await getProfileByUsername(username)
        setProfileExists(profile !== null)
      } catch (err) {
        setProfileExists(false)
      }
    }
    checkProfile()
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Vérifier que le profil existe
      const profile = await getProfileByUsername(username)
      if (!profile) {
        setError('Ce profil n\'existe pas')
        setIsLoading(false)
        return
      }

      // Créer le message
      await createMessage(username, message)
      
      setIsLoading(false)
      setIsSent(true)
      setMessage('')
      setTimeout(() => setIsSent(false), 3000)
    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du message:', err)
      setError(err.message || 'Une erreur est survenue lors de l\'envoi du message')
      setIsLoading(false)
    }
  }

  const copyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              @{username}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Envoyez-moi un message anonyme !
            </p>
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Lien copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier le lien
                </>
              )}
            </button>
          </div>

          {/* Message Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {profileExists === false && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Ce profil n'existe pas
                </p>
              </div>
            )}

            {isSent && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✓ Message envoyé avec succès !
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                label="Votre message"
                placeholder="Écrivez votre message anonyme ici..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                required
                maxLength={1000}
                className="text-base"
              />

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{message.length} / 1000 caractères</span>
                <span className="text-gray-400 dark:text-gray-500">
                  🔒 Votre message est anonyme
                </span>
              </div>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={!message.trim() || isLoading || profileExists === false}
              >
                {isLoading ? (
                  'Envoi en cours...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
              💡 <strong>Astuce :</strong> Partagez ce lien avec vos amis pour recevoir leurs messages anonymes !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

