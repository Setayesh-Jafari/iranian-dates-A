import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

/**
 * True when DATABASE_URL is present. The value itself is never exposed to
 * application code or logs from this module.
 */
export const isDbConfigured = Boolean(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

let modulePool: Pool | null = null;
let moduleDb: NodePgDatabase | null = null;

/**
 * Lazily creates the shared pg pool. Importing this module never throws and
 * never opens a connection, so routes that do not use the database (and the
 * health check) work even when DATABASE_URL is missing or invalid.
 */
export function getPool(): Pool {
  if (!databaseUrl) {
    // Deliberately generic: never leak the connection string.
    throw new Error("DATABASE_URL is not configured");
  }
  const cached = globalForDb.__arenaNextJsPostgresqlPool ?? modulePool;
  if (cached) return cached;

  const pool = new Pool({ connectionString: databaseUrl });
  modulePool = pool;
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }
  return pool;
}

/** Lazily wraps the shared pool in a Drizzle client. */
export function getDb(): NodePgDatabase {
  if (moduleDb) return moduleDb;
  moduleDb = drizzle(getPool());
  return moduleDb;
}
