import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 ngày

export type SessionPayload = {
  sub: string
  email: string
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error('Thiếu biến môi trường AUTH_SECRET')
  }
  return new TextEncoder().encode(secret)
}

export function signSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey())
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, secretKey(), {
      algorithms: ['HS256'],
    })
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      return null
    }
    return { sub: payload.sub, email: payload.email }
  } catch {
    return null
  }
}
