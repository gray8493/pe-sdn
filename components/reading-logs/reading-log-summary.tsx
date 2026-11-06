'use client'

import { BarChart3, BookOpen, Clock, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GENRE_STYLE } from '@/lib/genre-style'
import { cn } from '@/lib/utils'
import { useReadingLogs } from './reading-logs-provider'

function Stat({
  label,
  testId,
  value,
  icon: Icon,
  color,
}: {
  label: string
  testId: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <div className={cn('rounded-xl bg-gradient-to-br p-3 text-white shadow-md', color)}>
      <Icon className="size-4 opacity-80" />
      <p data-testid={testId} className="mt-1 text-2xl font-bold tabular-nums">
        {value}
      </p>
      <p className="text-xs opacity-90">{label}</p>
    </div>
  )
}

export function ReadingLogSummary() {
  const { summary } = useReadingLogs()

  return (
    <Card className="border-white/60 bg-white/85 shadow-lg shadow-indigo-500/5 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-500 text-white">
            <BarChart3 className="size-4" />
          </span>
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2">
          <Stat label="Sessions" testId="reading-log-count" value={summary.count} icon={BookOpen} color="from-indigo-500 to-violet-500" />
          <Stat label="Favorites" testId="favorite-count" value={summary.favoriteCount} icon={Star} color="from-amber-400 to-orange-500" />
          <Stat label="Minutes" testId="total-minutes" value={summary.totalMinutes} icon={Clock} color="from-emerald-500 to-teal-500" />
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
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                      (GENRE_STYLE[row.genre] ?? GENRE_STYLE.Other).bar
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
