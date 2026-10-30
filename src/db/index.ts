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

  const pool = new Pool({
    connectionString: databaseUrl,
    max: 10, // upper bound of simultaneous connections from this process
    idleTimeoutMillis: 30_000, // close connections idle for 30 s
    statement_timeout: 10_000, // cap expensive queries and lock waits
    query_timeout: 12_000, // bound client-side waits as well
    connectionTimeoutMillis: 5_000, // fail fast instead of waiting forever for a connection
  });

  // pg emits "error" on the pool when an IDLE client's connection drops
  // (database restart, network blip). Without a listener Node treats it as an
  // unhandled "error" event and can crash the whole process. The pool already
  // discards the broken client and opens a new one on demand, so we only log.
  // Class + code only: never the message, which can contain host/port details.
  pool.on("error", (err: Error & { code?: string }) => {
    console.error(
      `[pg] idle client error: ${err.constructor.name}${err.code ? ` (${err.code})` : ""}`
    );
  });

  modulePool = pool;
  // Route bundles in the same Node process must share a single bounded pool
  // in production as well as during development/HMR.
  globalForDb.__arenaNextJsPostgresqlPool = pool;
  return pool;
}

/** Lazily wraps the shared pool in a Drizzle client. */
export function getDb(): NodePgDatabase {
  if (moduleDb) return moduleDb;
  moduleDb = drizzle(getPool());
  return moduleDb;
}