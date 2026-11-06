'use client'

import Link from 'next/link'
import { BookOpen, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'

export function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/60 bg-white/70 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-indigo-500/30">
            <BookOpen className="size-4" />
          </span>
          <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            ReadLog
          </span>
        </Link>

        {user ? (
          <nav className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white uppercase sm:flex"
            >
              {user.email.charAt(0)}
            </span>
            <span
              data-testid="user-email"
              className="max-w-[7rem] truncate text-xs text-muted-foreground sm:max-w-[16rem] sm:text-sm"
              title={user.email}
            >
              {user.email}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href="/reading-logs" data-testid="link-reading-logs">
                My logs
              </Link>
            </Button>
            <Button size="sm" variant="ghost" data-testid="btn-logout" onClick={() => logout()}>
              <LogOut />
              Logout
            </Button>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login" data-testid="btn-login">
                Login
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register" data-testid="btn-register">
                Register
              </Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
