'use client'

import Link from 'next/link'
import { BookOpen, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'

export function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-bold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          ReadLog
        </Link>

        {user ? (
          <nav className="flex min-w-0 items-center gap-2">
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
