import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interne Analyse Coach - Hogeschool Leiden',
  description: 'AI-coach voor studenten bij het schrijven van een interne analyse volgens het 7S-model van McKinsey',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className="bg-gray-100 min-h-screen" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
} 