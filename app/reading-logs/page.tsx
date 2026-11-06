import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { ReadingLogsView } from '@/components/reading-logs/reading-logs-view'

export default async function ReadingLogsPage() {
  // Decided on the server, so there is no flash of content or wrong redirect.
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  return <ReadingLogsView />
}
