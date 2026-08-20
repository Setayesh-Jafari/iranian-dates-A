import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

type InquiryItem = { name?: unknown; slug?: unknown; quantity?: unknown };

export async function POST(request: Request) {
  let body: {
    items?: InquiryItem[];
    customer?: Record<string, unknown>;
    locale?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, customer = {} } = body ?? {};
  const locale = body?.locale === "fa" ? "fa" : "en";

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json(
      { error: "Please select at least one product" },
      { status: 400 }
    );
  }

  const name =
    typeof customer.name === "string" ? customer.name.trim() : "";
  const email =
    typeof customer.email === "string" ? customer.email.trim() : "";
  const phone =
    typeof customer.phone === "string" ? customer.phone.trim() : "";
  const company =
    typeof customer.company === "string" ? customer.company.trim() : "";
  const country =
    typeof customer.country === "string" ? customer.country.trim() : "";
  const city =
    typeof customer.city === "string" ? customer.city.trim() : "";
  const message =
    typeof customer.message === "string" ? customer.message.trim() : "";

  if (!name || !email.includes("@") || !phone || !country) {
    return Response.json(
      { error: "Please complete all required fields" },
      { status: 400 }
    );
  }

  const cleanItems = items.map((i) => ({
    name: String(i.name ?? "Dates").slice(0, 120),
    slug: String(i.slug ?? "").slice(0, 120),
    quantity: String(i.quantity ?? "Not specified").slice(0, 60),
  }));

  const inquiryId = `INQ-${randomUUID().slice(0, 8).toUpperCase()}`;

  await db.insert(inquiries).values({
    id: inquiryId,
    name: name.slice(0, 80),
    email: email.slice(0, 120),
    phone: phone.slice(0, 24),
    company: company ? company.slice(0, 120) : null,
    country: country.slice(0, 80),
    city: city ? city.slice(0, 60) : null,
    message: [message, `locale: ${locale}`]
      .filter(Boolean)
      .join("\n")
      .slice(0, 1000),
    items: cleanItems,
    status: "new",
  });

  return Response.json(
    { inquiryId, message: "Inquiry submitted successfully" },
    { status: 201 }
  );
}
