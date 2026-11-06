import { NextResponse, type NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, jsonError, readJson, unauthorized } from '@/lib/auth'
import { serverToday, toDate, toDTO } from '@/lib/reading-logs'
import { DUPLICATE_MESSAGE, validateReadingLog, type ReadingLogField } from '@/lib/validation'

type Ctx = { params: Promise<{ id: string }> }

const NOT_FOUND = 'Reading log not found'

/** Finds the log only if it belongs to the user: other users' ids look like missing ids. */
function findOwned(id: string, userId: string) {
  return prisma.readingLog.findFirst({ where: { id, userId } })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const { id } = await params
  const existing = await findOwned(id, user.id)
  if (!existing) return jsonError(NOT_FOUND, 404)

  const body = await readJson(req)
  const has = (k: string) => Object.prototype.hasOwnProperty.call(body, k) && body[k] !== undefined

  const fields = (['bookTitle', 'minutesRead', 'genre', 'readOn'] as ReadingLogField[]).filter(has)
  const errors = validateReadingLog(body, serverToday(), fields)
  const first = errors.bookTitle ?? errors.minutesRead ?? errors.genre ?? errors.readOn
  if (first) return jsonError(first, 400)

  if (has('note') && body.note !== null && typeof body.note !== 'string') {
    return jsonError('Invalid note', 400)
  }
  if (has('favorite') && typeof body.favorite !== 'boolean') {
    return jsonError('Invalid favorite', 400)
  }

  // Only whitelisted fields are updated; userId/id in the body are ignored.
  const data: Prisma.ReadingLogUpdateInput = {}
  if (has('bookTitle')) data.bookTitle = String(body.bookTitle).trim()
  if (has('minutesRead')) data.minutesRead = Number(body.minutesRead)
  if (has('genre')) data.genre = String(body.genre)
  if (has('readOn')) data.readOn = toDate(String(body.readOn))
  if (has('note')) data.note = typeof body.note === 'string' ? body.note.trim() : ''
  if (has('favorite')) data.favorite = body.favorite as boolean

  if (has('bookTitle') || has('minutesRead') || has('readOn')) {
    const duplicate = await prisma.readingLog.findFirst({
      where: {
        userId: user.id,
        id: { not: existing.id },
        bookTitle: (data.bookTitle as string | undefined) ?? existing.bookTitle,
        minutesRead: (data.minutesRead as number | undefined) ?? existing.minutesRead,
        readOn: (data.readOn as Date | undefined) ?? existing.readOn,
      },
      select: { id: true },
    })
    if (duplicate) return jsonError(DUPLICATE_MESSAGE, 409)
  }

  try {
    const row = await prisma.readingLog.update({ where: { id: existing.id }, data })
    return NextResponse.json(toDTO(row), { status: 200 })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') return jsonError(DUPLICATE_MESSAGE, 409)
      if (e.code === 'P2025') return jsonError(NOT_FOUND, 404)
    }
    throw e
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = await getCurrentUser()
  if (!user) return unauthorized()

  const { id } = await params
  const { count } = await prisma.readingLog.deleteMany({ where: { id, userId: user.id } })
  if (count === 0) return jsonError(NOT_FOUND, 404)

  return NextResponse.json({ success: true }, { status: 200 })
}
