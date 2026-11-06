'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionUser } from '@/lib/types'

type AuthContextValue = {
  user: SessionUser | null
  setUser: (user: SessionUser | null) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: SessionUser | null
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(initialUser)

  // Keep in sync when the server re-renders the layout (e.g. after router.refresh()).
  const initialKey = initialUser ? `${initialUser.id}:${initialUser.email}` : ''
  const [syncedKey, setSyncedKey] = useState(initialKey)
  if (syncedKey !== initialKey) {
    setSyncedKey(initialKey)
    setUser(initialUser)
  }

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
      router.push('/')
      router.refresh()
    }
  }, [router])

  return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
