import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { jsonError, readJson } from '@/lib/auth'
import { validateRegister } from '@/lib/validation'

export async function POST(req: Request) {
  const body = await readJson(req)
  const errors = validateRegister(body)
  const first = errors.email ?? errors.password ?? errors.confirmPassword
  if (first) return jsonError(first, 400)

  const email = String(body.email).trim().toLowerCase()
  const password = String(body.password)

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) return jsonError('Email already registered', 409)

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return jsonError('Email already registered', 409)
    }
    throw e
  }
}
