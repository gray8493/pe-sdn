import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, jsonError, unauthorized } from '@/lib/auth'
import { buildWhere, summarize, toDTO } from '@/lib/reading-logs'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const built = buildWhere(user.id, req.nextUrl.searchParams)
  if ('error' in built) return jsonError(built.error, 400)

  const rows = await prisma.readingLog.findMany({ where: built.where })
  return NextResponse.json(summarize(rows.map(toDTO)))
}
