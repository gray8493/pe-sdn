import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { getCurrentUser } from '@/lib/auth'
import { AuthProvider } from '@/components/auth-provider'
import { ReadingLogsProvider } from '@/components/reading-logs/reading-logs-provider'
import { SiteHeader } from '@/components/site-header'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReadLog',
  description: 'Track your reading sessions: book, minutes, genre and date.',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden font-sans">
        <AuthProvider initialUser={user}>
          <ReadingLogsProvider>
            <SiteHeader />
            <main className="flex flex-1 flex-col">{children}</main>
          </ReadingLogsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
