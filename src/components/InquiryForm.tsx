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
import { useInquiry } from "@/store/inquiry";
import { useI18n } from "@/i18n/I18nProvider";
import { formatNumber, t } from "@/i18n";
import { whatsappLink } from "@/lib/site";

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

/** RFQ form — the single conversion point of the B2B site. */
export function InquiryForm() {
  const { dict, href, locale, dir } = useI18n();
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
  const ForwardIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const items = useInquiry((s) => s.items);
  const setQuantity = useInquiry((s) => s.setQuantity);
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
      setError(dict.inquiry.errorEmpty);
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          items: items.map((i) => ({
            name: i.name,
            slug: i.slug,
            quantity: i.quantity?.trim() || "TBD",
          })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || dict.inquiry.errorGeneric);
      setInquiryId(data.inquiryId);
      setStatus("submitted");
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.inquiry.errorGeneric);
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
            {dict.inquiry.successTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-date-600">
            {t(dict.inquiry.successBody, { id: inquiryId })}
          </p>
          <p className="mt-4 text-xs text-date-500">
            {t(dict.inquiry.successEmail, { email: form.email })}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={href("/products")}
              className="inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
            >
              {dict.inquiry.continueBrowsing} <ForwardIcon size={16} />
            </Link>
            <a
              href={whatsappLink(
                t(dict.inquiry.successWhatsappMessage, { id: inquiryId })
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-7 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
            >
              <MessageCircle size={16} /> {dict.inquiry.successWhatsapp}
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
          {dict.inquiry.emptyTitle}
        </h1>
        <p className="mt-3 text-sm text-date-600">{dict.inquiry.emptyBody}</p>
        <Link
          href={href("/products")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
        >
          {dict.common.browseProducts} <ForwardIcon size={16} />
        </Link>
      </div>
    );
  }

  // Form
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            <ClipboardList size={13} /> {dict.inquiry.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-date-900 sm:text-4xl">
            {dict.inquiry.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-date-500">{dict.inquiry.intro}</p>
        </div>
        <Link
          href={href("/products")}
          className="inline-flex items-center gap-2 text-sm font-medium text-date-600 transition-colors hover:text-date-900"
        >
          <BackIcon size={16} /> {dict.inquiry.continueBrowsing}
        </Link>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start"
      >
        <div className="space-y-8">
          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.contactDetails}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={dict.inquiry.fullName} required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={dict.inquiry.namePlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={dict.inquiry.company}>
                <input
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder={dict.inquiry.companyPlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={dict.inquiry.email} required>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={dict.inquiry.emailPlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={dict.inquiry.phone} required>
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder={dict.inquiry.phonePlaceholder}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.destination}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={dict.inquiry.country} required>
                <select
                  required
                  value={form.country}
                  onChange={(e) => set("country", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    {dict.inquiry.selectCountry}
                  </option>
                  {dict.inquiry.countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={dict.inquiry.city}>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder={dict.inquiry.cityPlaceholder}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.requirements}
            </h2>
            <div className="mt-5">
              <Field label={dict.inquiry.message}>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder={dict.inquiry.messagePlaceholder}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.terms}
            </h2>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-cream-100 p-5">
              <ShieldCheck size={20} className="mt-0.5 shrink-0 text-gold-600" />
              <div className="text-sm leading-relaxed text-date-600">
                <p className="font-medium text-date-900">
                  {dict.inquiry.termsTitle}
                </p>
                <p className="mt-2">{dict.inquiry.termsBody}</p>
                <p className="mt-2 text-xs text-date-500">{dict.inquiry.termsNote}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary sidebar */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-date-900/10 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.selectedProducts}
            </h2>
            <ul className="mt-4 space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex items-start gap-3">
                  <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-200">
                    <Image
                      src={i.image}
                      alt={i.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-date-900">
                      {i.name}
                    </p>
                    <p className="text-xs text-date-500">
                      {i.weight} · {i.origin}
                    </p>
                    <input
                      value={i.quantity ?? ""}
                      onChange={(e) => setQuantity(i.id, e.target.value)}
                      placeholder={dict.inquiry.quantityPlaceholder}
                      aria-label={`${dict.inquiry.quantityLabel} — ${i.name}`}
                      className="mt-2 w-full rounded-lg border border-date-900/12 bg-cream-50 px-2.5 py-1.5 text-xs text-date-900 placeholder:text-date-400 focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-date-900/10 pt-5">
              <div className="flex items-center gap-2 rounded-2xl bg-gold-50 p-4 text-sm text-gold-800">
                <Truck size={16} className="shrink-0" />
                <span>{dict.inquiry.pricingNote}</span>
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
                  <Loader2 size={16} className="animate-spin" />{" "}
                  {dict.inquiry.submitting}
                </>
              ) : items.length === 1 ? (
                dict.inquiry.submitOne
              ) : (
                t(dict.inquiry.submit, { n: formatNumber(items.length, locale) })
              )}
            </button>

            <p className="mt-4 text-center text-xs text-date-400">
              {dict.common.responseTime}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
