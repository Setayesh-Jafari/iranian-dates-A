import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { cp } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl || process.env.ALLOW_TEST_DB_WRITES !== "1") {
  throw new Error("Set TEST_DATABASE_URL to a disposable *_test database and ALLOW_TEST_DB_WRITES=1.");
}
const parsedDb = new URL(databaseUrl);
if (!parsedDb.pathname.endsWith("_test")) throw new Error("The test database name must end in _test.");
if (process.env.BROWSER_REQUIRED === "1" && !process.env.CHROME_PATH) throw new Error("CHROME_PATH is required for browser tests.");

async function unusedPort() {
  const server = createServer();
  await new Promise((resolve, reject) => server.once("error", reject).listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
// Exercise the same standalone server and assets used by the production image.
await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
await cp("public", ".next/standalone/public", { recursive: true });
const ports = [await unusedPort(), await unusedPort(), await unusedPort()];
const bases = ports.map((port) => `http://localhost:${port}`);
const children = [];
let logs = "";

function start(port, dbUrl) {
  const child = spawn(process.execPath, [".next/standalone/server.js"], {
    env: {
      ...process.env, NODE_ENV: "production", DATABASE_URL: dbUrl, PORT: String(port), HOSTNAME: "0.0.0.0",
      SITE_URL: bases[0], SITE_INDEXING_ENABLED: "true", RATE_LIMIT_IP_HEADER: "x-real-ip",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (data) => { logs += data; });
  child.stderr.on("data", (data) => { logs += data; });
  children.push(child);
  return child;
}
async function waitUntilListening(base, child) {
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error(`Server exited early.\n${logs}`);
    try {
      await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(1000) });
      return;
    } catch { await delay(200); }
  }
  throw new Error(`Server did not start.\n${logs}`);
}

try {
  const a = start(ports[0], databaseUrl);
  const b = start(ports[1], databaseUrl);
  // An intentionally unreachable local DB tests fail-closed behavior.
  const offline = start(ports[2], "postgresql://postgres@127.0.0.1:1/unavailable_test");
  await Promise.all([waitUntilListening(bases[0], a), waitUntilListening(bases[1], b), waitUntilListening(bases[2], offline)]);
  const test = spawn(process.execPath, ["--test", "tests/integration.test.mjs"], {
    env: { ...process.env, TEST_BASE_URL: bases[0], TEST_SECOND_BASE_URL: bases[1], TEST_OFFLINE_BASE_URL: bases[2] },
    stdio: "inherit",
  });
  const code = await new Promise((resolve) => test.on("exit", resolve));
  if (code !== 0) {
    console.error("--- application logs ---\n" + logs.slice(-12000));
    process.exitCode = Number(code) || 1;
  }
} finally {
  for (const child of children) child.kill("SIGTERM");
  await Promise.all(children.map((child) => new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once("exit", resolve);
    setTimeout(() => { child.kill("SIGKILL"); resolve(); }, 3000).unref();
  })));
}
