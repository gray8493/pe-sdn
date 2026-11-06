'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useReadingLogs } from './reading-logs-provider'

function Stat({ label, testId, value }: { label: string; testId: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span data-testid={testId} className="text-xl font-semibold tabular-nums">
        {value}
      </span>
    </div>
  )
}

export function ReadingLogSummary() {
  const { summary } = useReadingLogs()

  return (
    <Card className="gap-4 py-5 shadow-none">
      <CardHeader className="px-5">
        <CardTitle className="text-sm font-medium">Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 px-5">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Sessions" testId="reading-log-count" value={summary.count} />
          <Stat label="Favorites" testId="favorite-count" value={summary.favoriteCount} />
          <Stat label="Minutes" testId="total-minutes" value={summary.totalMinutes} />
        </div>

        <div data-testid="genre-breakdown" className="flex flex-col gap-3 border-t pt-4">
          {summary.breakdown.length === 0 && (
            <p className="text-sm text-muted-foreground">No minutes by genre yet.</p>
          )}
          {summary.breakdown.map((row) => {
            const pct = summary.totalMinutes ? (row.total / summary.totalMinutes) * 100 : 0
            return (
              <div key={row.genre} data-testid="breakdown-row" className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span data-testid="breakdown-name">{row.genre}</span>
                  <span className="text-muted-foreground tabular-nums">
                    <span data-testid="breakdown-count">{row.count}</span>
                    {row.count === 1 ? ' session · ' : ' sessions · '}
                    <span data-testid="breakdown-total" className="text-foreground">
                      {row.total}
                    </span>{' '}
                    min
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-foreground/70" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
