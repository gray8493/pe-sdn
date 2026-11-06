import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'

const features = [
  {
    title: 'Log every session',
    text: 'Write down the book, the minutes you spent, the genre and the day. It takes a few seconds.',
  },
  {
    title: 'Sort by genre',
    text: 'Filter by Fiction, Non-Fiction, Sci-Fi, Biography or Other, and star the sessions you liked.',
  },
  {
    title: 'See minutes read',
    text: 'A running summary adds up your minutes and shows where your reading time goes.',
  },
]

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <section className="border-b py-16 sm:py-24">
        <h1 data-testid="home-title" className="text-4xl font-semibold tracking-tight sm:text-5xl">
          ReadLog
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          A quiet place to keep track of what you read — which book, for how long, what genre and
          when.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={user ? '/reading-logs' : '/register'}>
              {user ? 'Go to reading logs' : 'Create an account'}
            </Link>
          </Button>
          {!user && (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-4 py-12 sm:grid-cols-3">
        {features.map(({ title, text }, i) => (
          <Card key={title} className="gap-2 py-5 shadow-none">
            <CardHeader className="gap-2 px-5">
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="leading-relaxed">{text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
