import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Interne Analyse Coach - Voor Studenten',
  description: 'Jouw AI-coach bij het schrijven van een interne analyse volgens het 7S-model van McKinsey. Geen inlog vereist.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,600,0,-25" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
} 