'use client'

import { useAuth } from '@/components/auth-provider'
import { ReadingLogForm } from './reading-log-form'
import { ReadingLogFilters } from './reading-log-filters'
import { ReadingLogList } from './reading-log-list'
import { ReadingLogSummary } from './reading-log-summary'

export function ReadingLogsView() {
  const { user } = useAuth()
  // Between the server check and the client state syncing, render nothing.
  if (!user) return null

  return (
    <div data-testid="reading-logs-page" className="mx-auto w-full max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">My reading sessions</h1>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <ReadingLogForm />
          <ReadingLogSummary />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ReadingLogFilters />
          <ReadingLogList />
        </div>
      </div>
    </div>
  )
}
