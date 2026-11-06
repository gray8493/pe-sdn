import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createToken, jsonError, readJson, setSessionCookie } from '@/lib/auth'
import { validateLogin } from '@/lib/validation'

const INVALID = 'Invalid email or password'

export async function POST(req: Request) {
  const body = await readJson(req)
  const errors = validateLogin(body)
  const first = errors.email ?? errors.password
  if (first) return jsonError(first, 400)

  const email = String(body.email).trim().toLowerCase()
  const password = String(body.password)

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return jsonError(INVALID, 401)

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return jsonError(INVALID, 401)

  const session = { id: user.id, email: user.email }
  const res = NextResponse.json(session, { status: 200 })
  setSessionCookie(res, await createToken(session))
  return res
}
