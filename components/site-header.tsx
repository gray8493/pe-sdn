'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'

export function SiteHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link href="/" className="shrink-0 text-[15px] font-semibold tracking-tight">
          ReadLog
        </Link>

        {user ? (
          <nav className="flex min-w-0 items-center gap-1 sm:gap-2">
            <span
              data-testid="user-email"
              className="max-w-[7rem] truncate text-xs text-muted-foreground sm:mr-2 sm:max-w-[16rem] sm:text-sm"
              title={user.email}
            >
              {user.email}
            </span>
            <Button asChild variant="ghost" size="sm">
              <Link href="/reading-logs" data-testid="link-reading-logs">
                Reading logs
              </Link>
            </Button>
            <Button size="sm" variant="outline" data-testid="btn-logout" onClick={() => logout()}>
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
