"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useInquiry } from "@/store/cart";

const COUNTRIES = [
  "India", "United Arab Emirates", "Saudi Arabia", "Iraq", "Pakistan",
  "Bangladesh", "Sri Lanka", "Turkey", "Russia", "Germany",
  "United Kingdom", "United States", "Canada", "Australia", "Other",
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-date-900/12 bg-cream-50 px-3.5 py-2.5 text-sm text-date-900 placeholder:text-date-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20";

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

export default function InquiryPage() {
  const items = useInquiry((s) => s.items);
  const clear = useInquiry((s) => s.clear);
  const [status, setStatus] = useState<"form" | "submitting" | "submitted">("form");
  const [inquiryId, setInquiryId] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    country: "",
    city: "",
    message: "",
  });

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError("Please add at least one product to your inquiry list.");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.name,
            slug: i.slug,
            quantity: "TBD",
          })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setInquiryId(data.inquiryId);
      setStatus("submitted");
      clear();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setStatus("form");
    }
  }

  // Success state
  if (status === "submitted" && inquiryId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-date-900/10 bg-white p-8 text-center sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check size={30} strokeWidth={2.5} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-date-900">
            Inquiry submitted!
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-date-600">
            Your inquiry{" "}
            <span className="font-semibold text-date-900">{inquiryId}</span>{" "}
            has been received. Our export team will review your requirements and
            respond with pricing within 24 hours.
          </p>
          <p className="mt-4 text-xs text-date-500">
            A confirmation has been sent to {form.email}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
            >
              Continue browsing <ArrowRight size={16} />
            </Link>
            <a
              href={`https://wa.me/989123456789?text=${encodeURIComponent(`Hi, I just submitted inquiry ${inquiryId}. Looking forward to your quote.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-7 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <MessageCircle size={16} /> Follow up on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (items.length === 0 && status === "form") {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-cream-200 text-date-400">
          <ClipboardList size={28} strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-semibold text-date-900">
          Your inquiry list is empty
        </h1>
        <p className="mt-3 text-sm text-date-600">
          Browse our catalog and add products you&apos;re interested in. Then come
          back here to submit your inquiry for a custom quote.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
        >
          Browse products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  // Form
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            <ClipboardList size={13} /> Wholesale inquiry
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-date-900 sm:text-4xl">
            Request a Quote
          </h1>
          <p className="mt-2 text-sm text-date-500">
            Fill in your details and our export team will get back to you within
            24 hours with pricing, MOQ and shipping options.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-date-600 transition-colors hover:text-date-900"
        >
          <ArrowLeft size={16} /> Continue browsing
        </Link>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start"
      >
        {/* Form fields */}
        <div className="space-y-8">
          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              Contact details
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="John Smith"
                  className={inputClass}
                />
              </Field>
              <Field label="Company">
                <input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Your company name"
                  className={inputClass}
                />
              </Field>
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
              <Field label="Phone / WhatsApp" required>
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
            <h2 className="font-display text-lg font-semibold text-date-900">
              Shipping destination
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Country" required>
                <select
                  required
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select country
                  </option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="City">
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Mumbai"
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              Additional requirements
            </h2>
            <div className="mt-5">
              <Field label="Message">
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Required quantity, preferred packaging, delivery timeline, any special requirements..."
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              Payment & terms
            </h2>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-cream-100 p-5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-gold-600"
              />
              <div className="text-sm text-date-600 leading-relaxed">
                <p className="font-medium text-date-900">
                  Flexible payment terms for international buyers
                </p>
                <p className="mt-2">
                  We accept T/T (bank transfer), Western Union, and other
                  secure payment methods. Payment terms are discussed on a
                  per-order basis depending on order volume and relationship.
                </p>
                <p className="mt-2 text-xs text-date-500">
                  Final pricing depends on quantity, packaging requirements,
                  and destination. We&apos;ll include all details in our quote.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-date-900/10 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-date-900">
              Selected products
            </h2>
            <ul className="mt-4 space-y-3">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                    <Image
                      src={i.image}
                      alt={i.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-date-900 truncate">
                      {i.name}
                    </p>
                    <p className="text-xs text-date-500">
                      {i.weight} · {i.origin}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-date-900/10 pt-5">
              <div className="flex items-center gap-2 rounded-2xl bg-gold-50 p-4 text-sm text-gold-800">
                <Truck size={16} className="shrink-0" />
                <span>
                  Pricing will be provided based on your required quantity and
                  destination.
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-4 text-sm font-semibold text-date-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending
                  inquiry…
                </>
              ) : (
                <>
                  Submit inquiry · {items.length} product
                  {items.length !== 1 ? "s" : ""}
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-date-400">
              We respond to all inquiries within 24 hours
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
