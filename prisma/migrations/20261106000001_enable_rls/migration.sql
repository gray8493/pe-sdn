-- Block Supabase's auto-generated Data API (anon/authenticated keys) from these tables.
-- The app connects through Prisma with a role that bypasses RLS, so it is unaffected.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReadingLog" ENABLE ROW LEVEL SECURITY;
