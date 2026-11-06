import type { Genre } from './validation'

export type ReadingLog = {
  id: string
  bookTitle: string
  minutesRead: number
  genre: Genre
  note: string
  favorite: boolean
  readOn: string // YYYY-MM-DD
  createdAt: string // ISO
}

export type BreakdownRow = { genre: Genre; count: number; total: number }

export type Summary = {
  count: number
  favoriteCount: number
  totalMinutes: number
  breakdown: BreakdownRow[]
}

export type SessionUser = { id: string; email: string }

export type Filters = { genre: string; favorite: boolean; q: string }
