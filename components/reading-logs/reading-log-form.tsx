'use client'

import { useState } from 'react'
import { BookPlus, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GENRES, todayString, validateReadingLog, type ReadingLogErrors } from '@/lib/validation'
import { useReadingLogs, type NewReadingLog } from './reading-logs-provider'

const EMPTY: NewReadingLog = { bookTitle: '', minutesRead: '', genre: '', note: '', readOn: '' }

export const selectClass =
  'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive md:text-sm'

function FieldError({ testId, message }: { testId: string; message?: string }) {
  if (!message) return null
  return (
    <p data-testid={testId} className="text-sm text-destructive">
      {message}
    </p>
  )
}

export function ReadingLogForm() {
  const { addLog } = useReadingLogs()
  const [values, setValues] = useState<NewReadingLog>(EMPTY)
  const [errors, setErrors] = useState<ReadingLogErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const validate = (v: NewReadingLog) => validateReadingLog(v, todayString())

  function onChange(field: keyof NewReadingLog, value: string) {
    const next = { ...values, [field]: value }
    setValues(next)
    if (submitted) setErrors(validate(next))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setApiError(null)
    setSuccess(null)

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setPending(true)
    const submittedValues = values
    const result = await addLog({
      ...values,
      bookTitle: values.bookTitle.trim(),
      minutesRead: String(values.minutesRead).trim(),
      note: values.note.trim(),
    })
    setPending(false)

    if (!result.ok) {
      setApiError(result.error)
      return
    }
    // Clear the form, unless the user already started typing the next session.
    setValues((current) => (current === submittedValues ? EMPTY : current))
    setErrors({})
    setSubmitted(false)
    setSuccess('Reading session added')
  }

  return (
    <Card className="border-white/60 bg-white/85 shadow-lg shadow-indigo-500/5 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <BookPlus className="size-4" />
          </span>
          Add a reading session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          data-testid="reading-log-form"
          noValidate
          onSubmit={onSubmit}
          className="flex flex-col gap-4"
        >
          {apiError && (
            <p
              data-testid="error-reading-log"
              role="alert"
              className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {apiError}
            </p>
          )}
          {success && (
            <p
              data-testid="reading-log-success"
              role="status"
              className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            >
              {success}
            </p>
          )}

          {/* Inputs are locked while saving so typing can't be wiped by the reset. */}
          <fieldset disabled={pending} className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="input-book-title">Book title</Label>
              <Input
                id="input-book-title"
                data-testid="input-book-title"
                value={values.bookTitle}
                aria-invalid={!!errors.bookTitle}
                onChange={(e) => onChange('bookTitle', e.target.value)}
                placeholder="Atomic Habits"
              />
              <FieldError testId="error-book-title" message={errors.bookTitle} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="input-minutes">Minutes read</Label>
                <Input
                  id="input-minutes"
                  data-testid="input-minutes"
                  type="text"
                  inputMode="numeric"
                  value={values.minutesRead}
                  aria-invalid={!!errors.minutesRead}
                  onChange={(e) => onChange('minutesRead', e.target.value)}
                  placeholder="40"
                />
                <FieldError testId="error-minutes" message={errors.minutesRead} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="input-genre">Genre</Label>
                <select
                  id="input-genre"
                  data-testid="input-genre"
                  className={selectClass}
                  value={values.genre}
                  aria-invalid={!!errors.genre}
                  onChange={(e) => onChange('genre', e.target.value)}
                >
                  <option value="">Choose genre</option>
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <FieldError testId="error-genre" message={errors.genre} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="input-date">Date</Label>
              <Input
                id="input-date"
                data-testid="input-date"
                type="date"
                value={values.readOn}
                aria-invalid={!!errors.readOn}
                onChange={(e) => onChange('readOn', e.target.value)}
              />
              <FieldError testId="error-date" message={errors.readOn} />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="input-note">
                Note <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="input-note"
                data-testid="input-note"
                value={values.note}
                onChange={(e) => onChange('note', e.target.value)}
                placeholder="Chapter 3"
              />
            </div>
          </fieldset>

          <Button
            type="submit"
            data-testid="btn-add-reading-log"
            disabled={pending}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/25 hover:opacity-95"
          >
            {pending ? <Loader2 className="animate-spin" /> : <Plus />}
            Add reading session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
