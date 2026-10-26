import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { neon } from '@neondatabase/serverless';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, '..', 'db', 'schema.sql'), 'utf8');

if (!process.env.DATABASE_URL) {
  console.error('Thiếu DATABASE_URL. Chạy: npm run db:init (cần file .env.local)');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

try {
  await sql`SELECT 1`;
  console.log('Kết nối Neon Postgres thành công.');
} catch (err) {
  console.error('Không kết nối được Neon:', err.message);
  process.exit(1);
}

const statements = schema
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}
console.log(`Schema đã được tạo/cập nhật (${statements.length} lệnh).`);

const columns = await sql`
  SELECT column_name, data_type FROM information_schema.columns
  WHERE table_name = 'users' ORDER BY ordinal_position
`;
console.log('Bảng users:', columns.map((c) => `${c.column_name}:${c.data_type}`).join(', '));
