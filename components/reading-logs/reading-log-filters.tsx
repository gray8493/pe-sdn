'use client'

import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GENRES } from '@/lib/validation'
import { useReadingLogs } from './reading-logs-provider'
import { selectClass } from './reading-log-form'

export function ReadingLogFilters() {
  const { filters, setFilters, clearFilters } = useReadingLogs()

  return (
    <Card className="py-4">
      <CardContent className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-[1fr_auto_auto] sm:items-end md:grid-cols-[minmax(0,1fr)_10rem_auto_auto]">
        <div className="flex flex-col gap-2 sm:col-span-3 md:col-span-1">
          <Label htmlFor="search-input">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-input"
              data-testid="search-input"
              className="pl-9"
              placeholder="Book title or note"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="filter-genre">Genre</Label>
          <select
            id="filter-genre"
            data-testid="filter-genre"
            className={selectClass}
            value={filters.genre}
            onChange={(e) => setFilters({ genre: e.target.value })}
          >
            <option value="">All</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <label className="flex h-9 cursor-pointer items-center gap-2 text-sm font-medium select-none">
          <input
            type="checkbox"
            data-testid="filter-favorite"
            className="size-4 accent-[var(--primary)]"
            checked={filters.favorite}
            onChange={(e) => setFilters({ favorite: e.target.checked })}
          />
          Favorites only
        </label>

        <Button
          type="button"
          variant="outline"
          data-testid="btn-clear-filters"
          onClick={clearFilters}
        >
          <X />
          Clear
        </Button>
      </CardContent>
    </Card>
  )
}
