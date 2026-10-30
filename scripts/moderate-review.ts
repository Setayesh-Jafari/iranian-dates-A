import "dotenv/config";
import { desc, eq } from "drizzle-orm";
import { getDb, getPool } from "../src/db";
import { reviews } from "../src/db/schema";
import { setReviewStatus } from "../src/lib/moderation";

/**
 * Manual review moderation until an admin panel exists.
 *
 *   npm run review:moderate -- list
 *   npm run review:moderate -- approve 12
 *   npm run review:moderate -- reject 12
 */
const USAGE = "Usage: npm run review:moderate -- <list | approve ID | reject ID>";

async function main() {
  const [command, rawId] = process.argv.slice(2);

  if (command === "list") {
    const rows = await getDb()
      .select({
        id: reviews.id,
        productId: reviews.productId,
        author: reviews.author,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .where(eq(reviews.status, "pending"))
      .orderBy(desc(reviews.createdAt));

    if (rows.length === 0) {
      console.log("No pending reviews.");
      return;
    }
    for (const r of rows) {
      console.log(
        `\n#${r.id}  product ${r.productId}  ${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}  ` +
          `${r.author}  (${r.createdAt.toISOString()})`,
      );
      if (r.title) console.log(`  ${r.title}`);
      console.log(`  ${r.comment}`);
    }
    console.log(`\n${rows.length} pending.`);
    return;
  }

  if (command === "approve" || command === "reject") {
    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
      console.error(USAGE);
      process.exitCode = 1;
      return;
    }
    const result = await setReviewStatus(id, command === "approve" ? "approved" : "rejected");
    if (!result) {
      console.error(`Review #${id} not found.`);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Review #${id} is now ${result.status}. ` +
        `Product ${result.productId}: rating ${result.rating}, ${result.reviewCount} approved review(s).`,
    );
    return;
  }

  console.error(USAGE);
  process.exitCode = 1;
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await getPool().end();
    } catch {
      // DATABASE_URL missing: there is no pool to close.
    }
  });