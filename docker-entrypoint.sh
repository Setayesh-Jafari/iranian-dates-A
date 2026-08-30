#!/bin/sh
set -e

# ─────────────────────────────────────────────────────────────────────────
# DATA SAFETY: this startup script must never modify application data.
#   - It NEVER runs the destructive seed (src/db/seed.ts truncates tables).
#   - It NEVER truncates, resets or wipes anything.
#   - Schema sync (drizzle-kit push) runs ONLY if the operator explicitly
#     sets RUN_SCHEMA_PUSH=1 (schema-only; never seeds data). It is for
#     development/staging bootstrap only and fails loudly if it errors.
# A plain container restart therefore never changes or deletes existing
# database data.
# ─────────────────────────────────────────────────────────────────────────

if [ -z "${DATABASE_URL:-}" ]; then
  echo "FATAL: DATABASE_URL is not set. It must be provided by the deployment environment." >&2
  exit 1
fi

echo "Waiting for database..."
tries=0
max_tries=30
until node -e "
const { Client } = require('pg');
const c = new Client({ connectionString: process.env.DATABASE_URL });
c.connect().then(() => c.end()).catch(() => process.exit(1));
" >/dev/null 2>&1; do
  tries=$((tries+1))
  if [ "$tries" -ge "$max_tries" ]; then
    echo "FATAL: Database is not reachable after $max_tries attempts. Refusing to start." >&2
    exit 1
  fi
  sleep 1
done
echo "Database ready."

if [ "${RUN_SCHEMA_PUSH:-0}" = "1" ]; then
  echo "RUN_SCHEMA_PUSH=1 set: running 'drizzle-kit push' (schema sync only; never seeds or truncates application data)..."
  npx drizzle-kit push
fi

echo "Starting app..."
exec node server.js
