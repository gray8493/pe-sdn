import { BookMarked, Library, Timer } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: BookMarked,
    title: 'Log every session',
    text: 'Save the book, how many minutes you read, the genre and the date in a few seconds.',
  },
  {
    icon: Library,
    title: 'Sort by genre',
    text: 'Filter by Fiction, Non-Fiction, Sci-Fi, Biography or Other, and star your favorites.',
  },
  {
    icon: Timer,
    title: 'See minutes read',
    text: 'A live summary shows your total minutes and a breakdown by genre.',
  },
]

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1 data-testid="home-title" className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          ReadLog
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Track your own reading sessions — which book, how many minutes, what genre and when —
          mark favorites and watch your minutes add up by genre.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <CardHeader>
              <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
