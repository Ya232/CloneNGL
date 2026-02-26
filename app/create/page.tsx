'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { createProfile } from '@/lib/supabase/users'

export default function CreatePage() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Créer le profil dans Supabase
      await createProfile(username.trim())
      
      // Rediriger vers le dashboard
      router.push(`/dashboard?username=${encodeURIComponent(username.trim())}`)
    } catch (err: any) {
      console.error('Erreur lors de la création du profil:', err)
      setError(err.message || 'Une erreur est survenue lors de la création du profil')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l'accueil
        </Link>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                Créer mon profil
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Choisissez un nom d'utilisateur unique pour votre lien
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </p>
                </div>
              )}

              <Input
                label="Nom d'utilisateur"
                type="text"
                placeholder="ex: monpseudo"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(null)
                }}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_-]+"
                title="Utilisez uniquement des lettres, chiffres, tirets et underscores"
              />

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Votre lien sera :</strong>
                  <br />
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/{username.trim() || 'monpseudo'}
                  </span>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!username.trim() || isLoading}
              >
                {isLoading ? 'Création...' : 'Créer mon lien'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

