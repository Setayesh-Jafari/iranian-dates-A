#!/bin/sh
set -e

# ─────────────────────────────────────────────────────────────────────────
# DATA SAFETY: default startup must never modify application data.
#   - It NEVER runs the destructive seed (src/db/seed.ts truncates tables).
#   - It does not itself truncate, reset or wipe anything; the optional schema
#     push may modify or remove data if explicitly and unsafely enabled.
#   - Schema sync (drizzle-kit push) can be destructive and is NEVER run by
#     default. In a production-mode container, it also requires an explicit
#     unsafe override and must only target a disposable development database.
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
  if [ "${NODE_ENV:-}" = "production" ] && [ "${ALLOW_UNSAFE_SCHEMA_PUSH:-0}" != "1" ]; then
    echo "FATAL: automatic schema push is disabled in production-mode containers. Use reviewed migrations." >&2
    exit 1
  fi
  echo "WARNING: drizzle-kit push can alter or delete schema/data; use only against a disposable database." >&2
  npx drizzle-kit push
fi

echo "Starting app..."
exec node server.js
