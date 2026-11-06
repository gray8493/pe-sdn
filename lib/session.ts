import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type SessionPayload = {
  sub: string
  email: string
  name?: string
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !user.email) return null

    return {
      sub: user.id,
      email: user.email,
      name: (user.user_metadata?.name as string) || undefined,
    }
  } catch {
    return null
  }
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}
