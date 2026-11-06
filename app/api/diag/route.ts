// TEMPORARY: reports env var lengths only (no values). Remove after debugging.
export const dynamic = 'force-dynamic'
export async function GET() {
  const len = (k: string) => (process.env[k] ?? '').length
  return Response.json({
    DATABASE_URL: len('DATABASE_URL'),
    DIRECT_URL: len('DIRECT_URL'),
    AUTH_SECRET: len('AUTH_SECRET'),
    VERCEL_ENV: process.env.VERCEL_ENV,
    region: process.env.VERCEL_REGION,
  })
}
