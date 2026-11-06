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
    <div data-testid="reading-logs-page" className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Reading logs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a session, then filter and review what you have read.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <ReadingLogForm />
          <ReadingLogSummary />
        </aside>
        <section className="flex min-w-0 flex-col gap-4">
          <ReadingLogFilters />
          <ReadingLogList />
        </section>
      </div>
    </div>
  )
}
