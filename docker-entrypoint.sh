#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL });
c.connect().then(() => { console.log('✅ Database ready'); c.end(); }).catch(() => process.exit(1));
" 2>/dev/null; do
  sleep 1
done

echo "🔄 Running migrations..."
npx drizzle-kit push 2>/dev/null || echo "⚠️  Migration skipped (tables may already exist)"

echo "🌱 Seeding database..."
npx tsx src/db/seed.ts 2>/dev/null || echo "⚠️  Seed skipped (data may already exist)"

echo "🚀 Starting app..."
exec node server.js
