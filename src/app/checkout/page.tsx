"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Lock,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart, cartSubtotal, FREE_SHIPPING_THRESHOLD } from "@/store/cart";
import { formatINR } from "@/lib/format";

const SHIPPING_FLAT = 99;
const GST_RATE = 0.05;

const STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

const EMPTY = {
  email: "",
  phone: "",
  name: "",
  company: "",
  gstin: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-xs font-semibold uppercase tracking-wide text-date-500">
        {label} {required && <span className="text-gold-600">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-date-900/12 bg-cream-50 px-3.5 py-2.5 text-sm text-date-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [status, setStatus] = useState<"form" | "submitting" | "confirmed">("form");
  const [order, setOrder] = useState<{
    orderId: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);

  const subtotal = cartSubtotal(items);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * GST_RATE);
  const total = subtotal + shipping + tax;

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setOrder(data);
      setStatus("confirmed");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("form");
    }
  }

  if (status === "confirmed" && order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-date-900/10 bg-white p-8 text-center sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check size={30} strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-date-900">
            Shukran — order confirmed!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-date-600">
            Your order <span className="font-semibold text-date-900">{order.orderId}</span> is
            being prepared for cold-chain dispatch from our Kolkata warehouse. A confirmation
            and GST invoice have been sent to {form.email}.
          </p>

          <div className="mt-8 space-y-2.5 rounded-2xl bg-cream-100 p-6 text-sm">
            <div className="flex justify-between text-date-600">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-date-600">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-date-600">
              <span>GST (5%)</span>
              <span>{formatINR(order.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-date-900/10 pt-2.5 font-semibold text-date-900">
              <span>Total</span>
              <span className="font-display text-lg">{formatINR(order.total)}</span>
            </div>
          </div>

          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
          >
            Continue shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream-200 text-date-400">
          <ShoppingBag size={28} strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-date-900">Your cart is empty</h1>
        <p className="mt-3 text-sm text-date-600">
          Add a few dates to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
        >
          Browse the shop <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            <Lock size={13} /> Secure checkout
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-date-900 sm:text-4xl">
            Checkout
          </h1>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-date-600 transition-colors hover:text-date-900"
        >
          <ArrowLeft size={16} /> Continue shopping
        </Link>
      </div>

      <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start">
        {/* Form */}
        <div className="space-y-8">
          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">Contact</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@company.com"
                  className={inputClass}
                />
              </Field>
              <Field label="Phone" required>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">Shipping address</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Rohit Malhotra"
                  className={inputClass}
                />
              </Field>
              <Field label="Company">
                <input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Saffron & Co."
                  className={inputClass}
                />
              </Field>
              <Field label="GSTIN" className="sm:col-span-2">
                <input
                  value={form.gstin}
                  onChange={(e) => set("gstin", e.target.value)}
                  placeholder="27ABCDE1234F1Z5 (optional)"
                  className={inputClass}
                />
              </Field>
              <Field label="Address" required className="sm:col-span-2">
                <input
                  required
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street, area, landmark"
                  className={inputClass}
                />
              </Field>
              <Field label="City" required>
                <input
                  required
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Mumbai"
                  className={inputClass}
                />
              </Field>
              <Field label="State" required>
                <select
                  required
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="PIN code" required>
                <input
                  required
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={(e) => set("pincode", e.target.value)}
                  placeholder="400001"
                  className={inputClass}
                />
              </Field>
              <Field label="Order notes" className="sm:col-span-2">
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Delivery instructions, packing preferences…"
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">Payment</h2>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-cream-100 p-5">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-gold-600" />
              <div>
                <p className="text-sm font-medium text-date-900">Pay on delivery / bank transfer</p>
                <p className="mt-1 text-xs leading-relaxed text-date-500">
                  This is a demo storefront — no payment is collected. Our team will confirm your
                  order and share a GST invoice with payment details.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-date-900/10 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-date-900">Order summary</h2>
            <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                    <Image src={i.image} alt={i.name} fill sizes="56px" className="object-cover" />
                    <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-date-900 px-1 text-[11px] font-bold text-cream-50">
                      {i.qty}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="line-clamp-1 text-sm font-medium text-date-900">{i.name}</p>
                    <p className="text-xs text-date-500">
                      {i.weight} · {i.unit}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-date-900">{formatINR(i.price * i.qty)}</p>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5 border-t border-date-900/10 pt-5 text-sm">
              <div className="flex justify-between text-date-600">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-date-600">
                <span>Shipping</span>
                <span className={shipping === 0 ? "font-medium text-emerald-700" : ""}>
                  {shipping === 0 ? "Free" : formatINR(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-date-600">
                <span>GST (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-date-900/10 pt-3 font-semibold text-date-900">
                <span>Total</span>
                <span className="font-display text-xl">{formatINR(total)}</span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Placing order…
                </>
              ) : (
                <>
                  Place order · {formatINR(total)}
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-date-400">
              <Truck size={13} /> Cold-chain dispatch within 24 hours
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
