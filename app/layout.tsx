import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NGL Clone - Messages Anonymes',
  description: 'Recevez des messages anonymes de vos amis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}

