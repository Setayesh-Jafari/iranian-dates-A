import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const productId = Number(body.productId);
  const rating = Number(body.rating);
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!Number.isInteger(productId) || productId <= 0) {
    return Response.json({ error: "Invalid product" }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }
  if (!author || author.length > 80) {
    return Response.json({ error: "Please enter your name" }, { status: 400 });
  }
  if (!comment || comment.length < 10 || comment.length > 2000) {
    return Response.json({ error: "Review must be between 10 and 2000 characters" }, { status: 400 });
  }

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!existing[0]) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  const [inserted] = await db
    .insert(reviews)
    .values({
      productId,
      author: author.slice(0, 80),
      location: location ? location.slice(0, 80) : null,
      rating: Math.round(rating),
      title: title ? title.slice(0, 120) : null,
      comment: comment.slice(0, 2000),
    })
    .returning();

  const rows = await db
    .select({ rating: reviews.rating })
    .from(reviews)
    .where(eq(reviews.productId, productId));

  const avg = rows.length
    ? Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10
    : Math.round(rating);

  await db
    .update(products)
    .set({ rating: avg, reviewCount: rows.length })
    .where(eq(products.id, productId));

  return Response.json(
    {
      review: { ...inserted, createdAt: inserted.createdAt.toISOString() },
      product: { rating: avg, reviewCount: rows.length },
    },
    { status: 201 }
  );
}
