'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { filtersToQuery, matchesFilters, sortLogs, summarize } from '@/lib/reading-log-utils'
import type { Filters, ReadingLog, Summary } from '@/lib/types'

export type NewReadingLog = {
  bookTitle: string
  minutesRead: number | string
  genre: string
  note: string
  readOn: string
}

type Result = { ok: true } | { ok: false; error: string }

type ReadingLogsContextValue = {
  logs: ReadingLog[]
  summary: Summary
  filters: Filters
  loaded: boolean
  loadError: string | null
  setFilters: (patch: Partial<Filters>) => void
  clearFilters: () => void
  addLog: (input: NewReadingLog) => Promise<Result>
  toggleFavorite: (log: ReadingLog) => Promise<Result>
  deleteLog: (log: ReadingLog) => Promise<Result>
}

const EMPTY_FILTERS: Filters = { genre: '', favorite: false, q: '' }
const EMPTY_SUMMARY: Summary = { count: 0, favoriteCount: 0, totalMinutes: 0, breakdown: [] }

const ReadingLogsContext = createContext<ReadingLogsContextValue | null>(null)

async function errorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json()
    if (body && typeof body.error === 'string') return body.error
  } catch {}
  return fallback
}

/**
 * Holds the logged-in user's reading sessions. Rendered with key={user.id},
 * so logging out / switching accounts discards the previous person's data.
 */
function ReadingLogsStore({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<ReadingLog[]>([])
  const [summary, setSummary] = useState<Summary>(EMPTY_SUMMARY)
  const [filters, setFiltersState] = useState<Filters>(EMPTY_FILTERS)
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const filtersRef = useRef(filters)
  const logsRef = useRef(logs)
  const requestId = useRef(0)

  /** Replace the visible list and recompute its summary in the same render. */
  const showLogs = useCallback((next: ReadingLog[]) => {
    logsRef.current = next
    setLogs(next)
    setSummary(summarize(next))
  }, [])

  /** Fetch list + summary for the given filters; stale responses are ignored. */
  const refresh = useCallback(async (f: Filters) => {
    const id = ++requestId.current
    const qs = filtersToQuery(f)
    try {
      const [listRes, summaryRes] = await Promise.all([
        fetch(`/api/reading-logs${qs}`, { cache: 'no-store' }),
        fetch(`/api/reading-logs/summary${qs}`, { cache: 'no-store' }),
      ])
      if (id !== requestId.current) return
      if (!listRes.ok || !summaryRes.ok) {
        setLoadError(await errorMessage(listRes.ok ? summaryRes : listRes, 'Could not load reading sessions'))
        return
      }
      const [list, sum] = (await Promise.all([listRes.json(), summaryRes.json()])) as [
        ReadingLog[],
        Summary,
      ]
      if (id !== requestId.current) return
      logsRef.current = list
      setLogs(list)
      setSummary(sum)
      setLoadError(null)
    } catch {
      if (id === requestId.current) setLoadError('Could not load reading sessions')
    } finally {
      if (id === requestId.current) setLoaded(true)
    }
  }, [])

  // Load once after login (deferred so the fetch never runs inside the effect body).
  useEffect(() => {
    const t = setTimeout(() => refresh(EMPTY_FILTERS), 0)
    return () => clearTimeout(t)
  }, [refresh])

  const setFilters = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...filtersRef.current, ...patch }
      filtersRef.current = next
      setFiltersState(next)
      // Show the change immediately from memory, then confirm with the API.
      showLogs(logsRef.current.filter((l) => matchesFilters(l, next)))
      refresh(next)
    },
    [refresh, showLogs]
  )

  const clearFilters = useCallback(() => {
    filtersRef.current = EMPTY_FILTERS
    setFiltersState(EMPTY_FILTERS)
    refresh(EMPTY_FILTERS)
  }, [refresh])

  /** Apply a local change to the visible list and its summary right away. */
  const applyLocal = useCallback(
    (update: (prev: ReadingLog[]) => ReadingLog[]) => {
      showLogs(
        sortLogs(update(logsRef.current).filter((l) => matchesFilters(l, filtersRef.current)))
      )
    },
    [showLogs]
  )

  const addLog = useCallback(
    async (input: NewReadingLog): Promise<Result> => {
      try {
        const res = await fetch('/api/reading-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...input, minutesRead: Number(input.minutesRead) }),
        })
        if (!res.ok) return { ok: false, error: await errorMessage(res, 'Could not add reading session') }
        const created = (await res.json()) as ReadingLog
        requestId.current++ // drop any in-flight list that doesn't include it
        applyLocal((prev) => [...prev.filter((l) => l.id !== created.id), created])
        refresh(filtersRef.current)
        return { ok: true }
      } catch {
        return { ok: false, error: 'Could not add reading session' }
      }
    },
    [applyLocal, refresh]
  )

  const toggleFavorite = useCallback(
    async (log: ReadingLog): Promise<Result> => {
      try {
        const res = await fetch(`/api/reading-logs/${encodeURIComponent(log.id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ favorite: !log.favorite }),
        })
        if (!res.ok) return { ok: false, error: await errorMessage(res, 'Could not update reading session') }
        const updated = (await res.json()) as ReadingLog
        requestId.current++
        applyLocal((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
        refresh(filtersRef.current)
        return { ok: true }
      } catch {
        return { ok: false, error: 'Could not update reading session' }
      }
    },
    [applyLocal, refresh]
  )

  const deleteLog = useCallback(
    async (log: ReadingLog): Promise<Result> => {
      try {
        const res = await fetch(`/api/reading-logs/${encodeURIComponent(log.id)}`, {
          method: 'DELETE',
        })
        if (!res.ok && res.status !== 404) {
          return { ok: false, error: await errorMessage(res, 'Could not delete reading session') }
        }
        requestId.current++
        applyLocal((prev) => prev.filter((l) => l.id !== log.id))
        refresh(filtersRef.current)
        return { ok: true }
      } catch {
        return { ok: false, error: 'Could not delete reading session' }
      }
    },
    [applyLocal, refresh]
  )

  return (
    <ReadingLogsContext.Provider
      value={{
        logs,
        summary,
        filters,
        loaded,
        loadError,
        setFilters,
        clearFilters,
        addLog,
        toggleFavorite,
        deleteLog,
      }}
    >
      {children}
    </ReadingLogsContext.Provider>
  )
}

export function ReadingLogsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <>{children}</>
  return <ReadingLogsStore key={user.id}>{children}</ReadingLogsStore>
}

export function useReadingLogs() {
  const ctx = useContext(ReadingLogsContext)
  if (!ctx) throw new Error('useReadingLogs must be used inside a logged-in <ReadingLogsProvider>')
  return ctx
}
