'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { GENRES } from '@/lib/validation'
import { useReadingLogs } from './reading-logs-provider'
import { selectClass } from './reading-log-form'

export function ReadingLogFilters() {
  const { filters, setFilters, clearFilters } = useReadingLogs()

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative min-w-0 flex-1 sm:min-w-[12rem]">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          data-testid="search-input"
          aria-label="Search by title or note"
          className="pl-9"
          placeholder="Search title or note"
          value={filters.q}
          onChange={(e) => setFilters({ q: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          data-testid="filter-genre"
          aria-label="Filter by genre"
          className={`${selectClass} w-auto min-w-[9rem] flex-1 sm:flex-none`}
          value={filters.genre}
          onChange={(e) => setFilters({ genre: e.target.value })}
        >
          <option value="">All genres</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <label className="flex h-9 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 text-sm whitespace-nowrap select-none">
          <input
            type="checkbox"
            data-testid="filter-favorite"
            className="size-3.5 accent-foreground"
            checked={filters.favorite}
            onChange={(e) => setFilters({ favorite: e.target.checked })}
          />
          Favorites
        </label>

        <Button type="button" variant="ghost" data-testid="btn-clear-filters" onClick={clearFilters}>
          Clear
        </Button>
      </div>
    </div>
  )
}
