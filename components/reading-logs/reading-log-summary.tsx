'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useReadingLogs } from './reading-logs-provider'

function Stat({ label, testId, value }: { label: string; testId: string; value: number }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3 text-center">
      <p data-testid={testId} className="text-2xl font-bold tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function ReadingLogSummary() {
  const { summary } = useReadingLogs()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Sessions" testId="reading-log-count" value={summary.count} />
          <Stat label="Favorites" testId="favorite-count" value={summary.favoriteCount} />
          <Stat label="Minutes" testId="total-minutes" value={summary.totalMinutes} />
        </div>

        <div data-testid="genre-breakdown" className="flex flex-col gap-2">
          <p className="text-sm font-medium">Minutes by genre</p>
          {summary.breakdown.length === 0 && (
            <p className="text-sm text-muted-foreground">Nothing to show yet.</p>
          )}
          {summary.breakdown.map((row) => {
            const pct = summary.totalMinutes ? (row.total / summary.totalMinutes) * 100 : 0
            return (
              <div key={row.genre} data-testid="breakdown-row" className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span data-testid="breakdown-name" className="font-medium">
                    {row.genre}
                  </span>
                  <span className="text-muted-foreground">
                    <span data-testid="breakdown-count">{row.count}</span> sessions ·{' '}
                    <span data-testid="breakdown-total">{row.total}</span> min
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
