import { db } from "@/db";
import { orders } from "@/db/schema";
import { randomUUID } from "node:crypto";

export const dynamic = "force-dynamic";

const FREE_SHIPPING_THRESHOLD = 2999;
const SHIPPING_FLAT = 99;
const GST_RATE = 0.05;

type OrderItem = { name?: unknown; qty?: unknown; price?: unknown };

export async function POST(request: Request) {
  let body: { items?: OrderItem[]; customer?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { items, customer = {} } = body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Your cart is empty" }, { status: 400 });
  }

  const name = typeof customer.name === "string" ? customer.name.trim() : "";
  const email = typeof customer.email === "string" ? customer.email.trim() : "";
  const phone = typeof customer.phone === "string" ? customer.phone.trim() : "";
  const company = typeof customer.company === "string" ? customer.company.trim() : "";
  const gstin = typeof customer.gstin === "string" ? customer.gstin.trim() : "";
  const address = typeof customer.address === "string" ? customer.address.trim() : "";
  const city = typeof customer.city === "string" ? customer.city.trim() : "";
  const state = typeof customer.state === "string" ? customer.state.trim() : "";
  const pincode = typeof customer.pincode === "string" ? customer.pincode.trim() : "";
  const notes = typeof customer.notes === "string" ? customer.notes.trim() : "";

  if (!name || !email.includes("@") || !phone || !address || !city || !state || !pincode) {
    return Response.json({ error: "Please complete all required fields" }, { status: 400 });
  }

  const cleanItems = items.map((i) => ({
    name: String(i.name ?? "Dates").slice(0, 120),
    qty: Math.max(1, Math.min(Number(i.qty) || 1, 99)),
    price: Math.max(0, Math.round(Number(i.price) || 0)),
  }));

  const subtotal = cleanItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + shipping + tax;

  const orderId = `MM-${randomUUID().slice(0, 8).toUpperCase()}`;

  await db.insert(orders).values({
    id: orderId,
    name: name.slice(0, 80),
    email: email.slice(0, 120),
    phone: phone.slice(0, 24),
    company: company ? company.slice(0, 120) : null,
    gstin: gstin ? gstin.slice(0, 24) : null,
    address: address.slice(0, 200),
    city: city.slice(0, 60),
    state: state.slice(0, 60),
    pincode: pincode.slice(0, 12),
    notes: notes ? notes.slice(0, 500) : null,
    items: cleanItems,
    subtotal,
    shipping,
    tax,
    total,
    status: "confirmed",
  });

  return Response.json({ orderId, subtotal, shipping, tax, total }, { status: 201 });
}
