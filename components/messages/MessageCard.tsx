import { Trash2, Clock } from 'lucide-react'
import Button from '../ui/Button'

interface MessageCardProps {
  id: string
  content: string
  createdAt: string
  onDelete: (id: string) => void
}

export default function MessageCard({
  id,
  content,
  createdAt,
  onDelete,
}: MessageCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Il y a quelques secondes'
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} minutes`
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} heures`
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} jours`
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Déterminer si le message est récent (moins de 1 heure)
  const isRecent = () => {
    const date = new Date(createdAt)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    return diffInSeconds < 3600
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border-l-4 ${
      isRecent() ? 'border-purple-500' : 'border-gray-300 dark:border-gray-600'
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatDate(createdAt)}</span>
            {isRecent() && (
              <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                Nouveau
              </span>
            )}
          </div>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDelete(id)}
          className="flex-shrink-0"
          aria-label="Supprimer le message"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

