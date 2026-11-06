'use client'

import { useState } from 'react'
import { BookOpen, CalendarDays, Clock, Star, Trash2 } from 'lucide-react'
import { GENRE_STYLE } from '@/lib/genre-style'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ReadingLog } from '@/lib/types'
import { useReadingLogs } from './reading-logs-provider'

function ReadingLogItem({ log }: { log: ReadingLog }) {
  const { toggleFavorite, deleteLog } = useReadingLogs()
  const [busy, setBusy] = useState(false)

  async function run(action: () => Promise<unknown>) {
    setBusy(true)
    try {
      await action()
    } finally {
      setBusy(false)
    }
  }

  const style = GENRE_STYLE[log.genre] ?? GENRE_STYLE.Other

  return (
    <li
      data-testid="reading-log-item"
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-l-4 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:flex-row sm:items-center sm:justify-between',
        style.border
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-start gap-2 font-semibold">
          <span aria-hidden>{style.emoji}</span>
          <span data-testid="reading-log-title" className="break-words">
            {log.bookTitle}
          </span>
        </p>
        {log.note && <p className="mt-0.5 text-sm break-words text-muted-foreground">{log.note}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1', style.badge)}>
            <span data-testid="reading-log-genre">{log.genre}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            <span data-testid="reading-log-minutes" className="font-medium text-foreground">
              {log.minutesRead}
            </span>{' '}
            min
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" />
            <span data-testid="reading-log-date">{log.readOn}</span>
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="btn-toggle-favorite"
          aria-pressed={log.favorite ? 'true' : 'false'}
          aria-label={log.favorite ? 'Remove from favorites' : 'Add to favorites'}
          className={cn(log.favorite && 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100')}
          disabled={busy}
          onClick={() => run(() => toggleFavorite(log))}
        >
          <Star className={cn(log.favorite && 'fill-amber-400 text-amber-500')} />
          {log.favorite ? 'Favorite' : 'Star'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="btn-delete-reading-log"
          className="text-destructive hover:text-destructive"
          disabled={busy}
          onClick={() => run(() => deleteLog(log))}
        >
          <Trash2 />
          Delete
        </Button>
      </div>
    </li>
  )
}

export function ReadingLogList() {
  const { logs, loaded, loadError } = useReadingLogs()

  return (
    <Card className="border-white/60 bg-white/70 py-4 shadow-sm backdrop-blur">
      <CardContent className="px-4">
        {loadError && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {loadError}
          </p>
        )}
        {!loaded ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-fuchsia-100 text-indigo-500">
              <BookOpen className="size-7" />
            </span>
            <p data-testid="reading-logs-empty" className="font-medium text-muted-foreground">
              No reading sessions found
            </p>
          </div>
        ) : (
          <ul data-testid="reading-log-list" className="flex flex-col gap-3">
            {logs.map((log) => (
              <ReadingLogItem key={log.id} log={log} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
