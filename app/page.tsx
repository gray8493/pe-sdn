import Link from 'next/link'
import { ArrowRight, BookMarked, Library, Sparkles, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'

const features = [
  {
    icon: BookMarked,
    title: 'Log every session',
    text: 'Save the book, how many minutes you read, the genre and the date in a few seconds.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Library,
    title: 'Sort by genre',
    text: 'Filter by Fiction, Non-Fiction, Sci-Fi, Biography or Other, and star your favorites.',
    color: 'from-sky-500 to-cyan-500',
  },
  {
    icon: Timer,
    title: 'See minutes read',
    text: 'A live summary shows your total minutes and a breakdown by genre.',
    color: 'from-emerald-500 to-teal-500',
  },
]

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
      <section className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/70 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
          <Sparkles className="size-3.5" />
          Your personal reading tracker
        </span>
        <h1
          data-testid="home-title"
          className="mt-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl"
        >
          ReadLog
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Track your own reading sessions — which book, how many minutes, what genre and when —
          mark favorites and watch your minutes add up by genre.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="shadow-lg shadow-primary/25">
            <Link href={user ? '/reading-logs' : '/register'}>
              {user ? 'Open my reading log' : 'Get started — it’s free'}
              <ArrowRight />
            </Link>
          </Button>
          {!user && (
            <Button asChild size="lg" variant="outline" className="bg-white/70">
              <Link href="/login">I already have an account</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-5 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text, color }) => (
          <Card
            key={title}
            className="group border-white/60 bg-white/80 backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <CardHeader>
              <span
                className={`mb-3 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md transition-transform group-hover:scale-110`}
              >
                <Icon className="size-6" />
              </span>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="leading-relaxed">{text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
