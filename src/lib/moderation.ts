// Relative imports so the CLI script (tsx) and Next.js both resolve them.
import { getDb } from "../db";
import { products, reviews } from "../db/schema";
import { and, eq, sql } from "drizzle-orm";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ModerationResult = {
  reviewId: number;
  productId: number;
  status: ReviewStatus;
  rating: number;
  reviewCount: number;
};

/**
 * Changes a review's status and rebuilds the product's rating/review_count
 * from the approved reviews, all in ONE transaction.
 *
 * Why the product row is locked first: in Postgres' default READ COMMITTED
 * mode two moderators changing reviews of the same product at the same time
 * could each compute the average from a snapshot that misses the other's
 * change, and the last write would win with a stale number. Locking the
 * product row (FOR UPDATE) makes the second transaction wait; its next
 * statements then take a fresh snapshot that already includes the first
 * transaction's change.
 *
 * Returns null when the review does not exist.
 */
export async function setReviewStatus(
  reviewId: number,
  status: ReviewStatus,
): Promise<ModerationResult | null> {
  const db = getDb();

  return db.transaction(async (tx) => {
    const [review] = await tx
      .select({ productId: reviews.productId })
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);
    if (!review) return null;

    // 1) Serialize all moderation work for this product.
    await tx
      .select({ id: products.id })
      .from(products)
      .where(eq(products.id, review.productId))
      .for("update");

    // 2) Change the status.
    await tx.update(reviews).set({ status }).where(eq(reviews.id, reviewId));

    // 3) Recompute from the table (never from a value read earlier).
    const [agg] = await tx
      .select({
        avg: sql<number>`coalesce(round(avg(${reviews.rating})::numeric, 1), 0)::float8`,
        n: sql<number>`count(*)::int`,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, review.productId), eq(reviews.status, "approved")));

    // 4) Write the result onto the product.
    await tx
      .update(products)
      .set({ rating: agg.avg, reviewCount: agg.n })
      .where(eq(products.id, review.productId));

    return {
      reviewId,
      productId: review.productId,
      status,
      rating: agg.avg,
      reviewCount: agg.n,
    };
  });
}