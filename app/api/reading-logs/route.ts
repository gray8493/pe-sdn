import { NextResponse, type NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, jsonError, readJson, unauthorized } from '@/lib/auth'
import { buildWhere, serverToday, sortLogs, toDate, toDTO } from '@/lib/reading-logs'
import { DUPLICATE_MESSAGE, validateReadingLog } from '@/lib/validation'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const built = buildWhere(user.id, req.nextUrl.searchParams)
  if ('error' in built) return jsonError(built.error, 400)

  const rows = await prisma.readingLog.findMany({ where: built.where })
  return NextResponse.json(sortLogs(rows.map(toDTO)))
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const body = await readJson(req)
  const errors = validateReadingLog(body, serverToday())
  const first = errors.bookTitle ?? errors.minutesRead ?? errors.genre ?? errors.readOn
  if (first) return jsonError(first, 400)

  if (body.note !== undefined && body.note !== null && typeof body.note !== 'string') {
    return jsonError('Invalid note', 400)
  }

  const data = {
    bookTitle: String(body.bookTitle).trim(),
    minutesRead: Number(body.minutesRead),
    genre: String(body.genre),
    note: typeof body.note === 'string' ? body.note.trim() : '',
    readOn: toDate(String(body.readOn)),
  }

  const duplicate = await prisma.readingLog.findFirst({
    where: {
      userId: user.id,
      bookTitle: data.bookTitle,
      minutesRead: data.minutesRead,
      readOn: data.readOn,
    },
    select: { id: true },
  })
  if (duplicate) return jsonError(DUPLICATE_MESSAGE, 409)

  try {
    // userId is taken from the session only; any userId in the body is ignored.
    const row = await prisma.readingLog.create({ data: { ...data, userId: user.id } })
    return NextResponse.json(toDTO(row), { status: 201 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return jsonError(DUPLICATE_MESSAGE, 409)
    }
    throw e
  }
}
