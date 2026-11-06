import 'server-only'
import type { Prisma, ReadingLog as ReadingLogRow } from '@prisma/client'
import { isGenre, todayString, type Genre } from './validation'
import type { ReadingLog } from './types'

export { sortLogs, summarize } from './reading-log-utils'

/** "Today" on the server is evaluated in Vietnam time, where the exam takes place. */
export const SERVER_TIMEZONE = 'Asia/Ho_Chi_Minh'
export const serverToday = () => todayString(SERVER_TIMEZONE)

export const toDate = (ymd: string) => new Date(`${ymd.trim()}T00:00:00.000Z`)

export function toDTO(row: ReadingLogRow): ReadingLog {
  return {
    id: row.id,
    bookTitle: row.bookTitle,
    minutesRead: row.minutesRead,
    genre: row.genre as Genre,
    note: row.note,
    favorite: row.favorite,
    readOn: row.readOn.toISOString().slice(0, 10),
    createdAt: row.createdAt.toISOString(),
  }
}

/**
 * Builds the Prisma `where` for the current user + optional query filters.
 * The owner always comes from the session, never from the request.
 */
export function buildWhere(
  userId: string,
  params: URLSearchParams
): { where: Prisma.ReadingLogWhereInput } | { error: string } {
  const where: Prisma.ReadingLogWhereInput = { userId }

  const genre = params.get('genre')?.trim()
  if (genre) {
    if (!isGenre(genre)) return { error: 'Invalid genre' }
    where.genre = genre
  }

  const favorite = params.get('favorite')?.trim().toLowerCase()
  if (favorite === 'true') where.favorite = true
  else if (favorite === 'false') where.favorite = false

  const q = params.get('q')?.trim()
  if (q) {
    where.OR = [
      { bookTitle: { contains: q, mode: 'insensitive' } },
      { note: { contains: q, mode: 'insensitive' } },
    ]
  }

  return { where }
}
