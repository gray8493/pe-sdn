// Pure helpers shared by the API and the client.
import { GENRES, type Genre } from './validation'
import type { Filters, ReadingLog, Summary } from './types'

/** Most recent readOn first; ties by bookTitle alphabetically, case-insensitive. */
export function sortLogs(logs: ReadingLog[]): ReadingLog[] {
  return [...logs].sort((a, b) => {
    if (a.readOn !== b.readOn) return a.readOn < b.readOn ? 1 : -1
    const at = a.bookTitle.toLowerCase()
    const bt = b.bookTitle.toLowerCase()
    if (at !== bt) return at < bt ? -1 : 1
    return 0
  })
}

export function summarize(logs: ReadingLog[]): Summary {
  const byGenre = new Map<Genre, { count: number; total: number }>()
  let favoriteCount = 0
  let totalMinutes = 0

  for (const log of logs) {
    if (log.favorite) favoriteCount++
    totalMinutes += log.minutesRead
    const entry = byGenre.get(log.genre) ?? { count: 0, total: 0 }
    entry.count++
    entry.total += log.minutesRead
    byGenre.set(log.genre, entry)
  }

  const breakdown = [...byGenre.entries()]
    .map(([genre, v]) => ({ genre, count: v.count, total: v.total }))
    .sort((a, b) => b.total - a.total || GENRES.indexOf(a.genre) - GENRES.indexOf(b.genre))

  return { count: logs.length, favoriteCount, totalMinutes, breakdown }
}

export function matchesFilters(log: ReadingLog, filters: Filters): boolean {
  if (filters.genre && log.genre !== filters.genre) return false
  if (filters.favorite && !log.favorite) return false
  const q = filters.q.trim().toLowerCase()
  if (q && !log.bookTitle.toLowerCase().includes(q) && !log.note.toLowerCase().includes(q)) {
    return false
  }
  return true
}

export function filtersToQuery(filters: Filters): string {
  const params = new URLSearchParams()
  if (filters.genre) params.set('genre', filters.genre)
  if (filters.favorite) params.set('favorite', 'true')
  const q = filters.q.trim()
  if (q) params.set('q', q)
  const s = params.toString()
  return s ? `?${s}` : ''
}
