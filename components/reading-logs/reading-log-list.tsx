'use client'

import { useState } from 'react'
import { CalendarDays, Star, Trash2 } from 'lucide-react'
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

  return (
    <li
      data-testid="reading-log-item"
      className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0 flex-1">
        <p data-testid="reading-log-title" className="font-semibold break-words">
          {log.bookTitle}
        </p>
        {log.note && <p className="mt-0.5 text-sm break-words text-muted-foreground">{log.note}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <span data-testid="reading-log-genre">{log.genre}</span>
          </span>
          <span>
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
    <Card className="py-4">
      <CardContent className="px-4">
        {loadError && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {loadError}
          </p>
        )}
        {!loaded ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : logs.length === 0 ? (
          <p data-testid="reading-logs-empty" className="py-8 text-center text-muted-foreground">
            No reading sessions found
          </p>
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
