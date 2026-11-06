// Shared (client + server) validation. Messages must match the exam spec exactly.

export const GENRES = ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Biography', 'Other'] as const
export type Genre = (typeof GENRES)[number]

export function isGenre(value: unknown): value is Genre {
  return typeof value === 'string' && (GENRES as readonly string[]).includes(value)
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---------- Auth ----------

export type AuthErrors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>

export function validateEmail(email: unknown): string | undefined {
  const value = typeof email === 'string' ? email.trim() : ''
  if (!value) return 'Email is required'
  if (!EMAIL_RE.test(value)) return 'Please enter a valid email address'
}

export function validateLogin(input: { email?: unknown; password?: unknown }): AuthErrors {
  const errors: AuthErrors = {}
  const email = validateEmail(input.email)
  if (email) errors.email = email
  if (typeof input.password !== 'string' || input.password === '') {
    errors.password = 'Password is required'
  }
  return errors
}

export function validateRegister(input: {
  email?: unknown
  password?: unknown
  confirmPassword?: unknown
}): AuthErrors {
  const errors: AuthErrors = {}
  const email = validateEmail(input.email)
  if (email) errors.email = email

  const password = typeof input.password === 'string' ? input.password : ''
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'

  const confirm = typeof input.confirmPassword === 'string' ? input.confirmPassword : ''
  if (!confirm) errors.confirmPassword = 'Confirm password is required'
  else if (confirm !== password) errors.confirmPassword = 'Passwords do not match'

  return errors
}

// ---------- Reading logs ----------

export type ReadingLogField = 'bookTitle' | 'minutesRead' | 'genre' | 'readOn'
export type ReadingLogErrors = Partial<Record<ReadingLogField, string>>

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** Today's date as YYYY-MM-DD. On the server we use Vietnam time (the exam's timezone). */
export function todayString(timeZone?: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

function isValidDateString(value: string): boolean {
  if (!DATE_RE.test(value)) return false
  const d = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

export function validateBookTitle(value: unknown): string | undefined {
  const title = typeof value === 'string' ? value.trim() : ''
  if (!title) return 'Book title is required'
  if (title.length > 80) return 'Book title must be at most 80 characters'
}

/** Accepts numbers or numeric strings. Returns the error message, if any. */
export function validateMinutes(value: unknown): string | undefined {
  if (value === null || value === undefined) return 'Minutes read is required'
  if (typeof value === 'string' && value.trim() === '') return 'Minutes read is required'
  if (typeof value !== 'number' && typeof value !== 'string') return 'Minutes read is required'
  const n = typeof value === 'number' ? value : Number(value.trim())
  if (!Number.isFinite(n)) return 'Minutes read is required'
  if (n <= 0 || !Number.isInteger(n)) return 'Minutes read must be a positive number'
}

export function validateGenre(value: unknown): string | undefined {
  if (value === null || value === undefined || value === '') return 'Please choose a genre'
  if (!isGenre(value)) return 'Invalid genre'
}

export function validateReadOn(value: unknown, today: string): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') return 'Date is required'
  const v = value.trim()
  if (!isValidDateString(v)) return 'Date is required'
  if (v > today) return 'Date cannot be in the future'
}

export function validateReadingLog(
  input: Partial<Record<ReadingLogField, unknown>>,
  today: string,
  fields: ReadingLogField[] = ['bookTitle', 'minutesRead', 'genre', 'readOn']
): ReadingLogErrors {
  const errors: ReadingLogErrors = {}
  const check: Record<ReadingLogField, () => string | undefined> = {
    bookTitle: () => validateBookTitle(input.bookTitle),
    minutesRead: () => validateMinutes(input.minutesRead),
    genre: () => validateGenre(input.genre),
    readOn: () => validateReadOn(input.readOn, today),
  }
  for (const f of fields) {
    const msg = check[f]()
    if (msg) errors[f] = msg
  }
  return errors
}

export const DUPLICATE_MESSAGE =
  'Duplicate reading session: a reading session with the same book title, minutes and date already exists'
