'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <p data-testid="reading-log-title" className="font-medium break-words">
          {log.bookTitle}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <span data-testid="reading-log-genre">{log.genre}</span>
          <span aria-hidden>·</span>
          <span>
            <span data-testid="reading-log-minutes" className="text-foreground tabular-nums">
              {log.minutesRead}
            </span>{' '}
            min
          </span>
          <span aria-hidden>·</span>
          <span data-testid="reading-log-date" className="tabular-nums">
            {log.readOn}
          </span>
        </p>
        {log.note && <p className="mt-1 text-sm break-words text-muted-foreground">{log.note}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-testid="btn-toggle-favorite"
          aria-pressed={log.favorite ? 'true' : 'false'}
          aria-label={log.favorite ? 'Remove from favorites' : 'Add to favorites'}
          title={log.favorite ? 'Remove from favorites' : 'Add to favorites'}
          disabled={busy}
          onClick={() => run(() => toggleFavorite(log))}
        >
          <Star className={cn('size-4', log.favorite ? 'fill-foreground' : 'text-muted-foreground')} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          data-testid="btn-delete-reading-log"
          className="text-muted-foreground hover:text-destructive"
          disabled={busy}
          onClick={() => run(() => deleteLog(log))}
        >
          Delete
        </Button>
      </div>
    </li>
  )
}

export function ReadingLogList() {
  const { logs, loaded, loadError } = useReadingLogs()

  return (
    <div className="rounded-lg border bg-card">
      {loadError && (
        <p role="alert" className="border-b px-4 py-2 text-sm text-destructive">
          {loadError}
        </p>
      )}
      {!loaded ? (
        <p className="px-4 py-12 text-center text-sm text-muted-foreground">Loading…</p>
      ) : logs.length === 0 ? (
        <p data-testid="reading-logs-empty" className="px-4 py-12 text-center text-sm text-muted-foreground">
          No reading sessions found
        </p>
      ) : (
        <ul data-testid="reading-log-list" className="divide-y">
          {logs.map((log) => (
            <ReadingLogItem key={log.id} log={log} />
          ))}
        </ul>
      )}
    </div>
  )
}
