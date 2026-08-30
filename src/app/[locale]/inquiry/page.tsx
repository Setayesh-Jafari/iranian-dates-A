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
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useInquiry } from "@/store/cart";
import {
  INQUIRY_COUNTRIES,
  MAX_MESSAGE_LENGTH,
  QUANTITY_UNITS,
  type InquiryUnit,
} from "@/lib/inquiry";
import { useI18n } from "@/i18n/I18nProvider";
import { countryLabel, t, unitLabel } from "@/i18n";

const COUNTRIES = INQUIRY_COUNTRIES;

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

/** Client-side convenience check; the server validates again authoritatively. */
function isValidQuantity(value: string | undefined): boolean {
  if (!value || value.trim() === "") return false;
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

export default function InquiryPage() {
  const { dict, dir, href } = useI18n();
  const items = useInquiry((s) => s.items);
  const updateItem = useInquiry((s) => s.updateItem);
  const clear = useInquiry((s) => s.clear);
  const [status, setStatus] = useState<"form" | "submitting" | "submitted">(
    "form",
  );
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
  // Honeypot — visually hidden and never filled by real users. Bots that
  // auto-populate it get rejected server-side (no lead is stored).
  const [hp, setHp] = useState("");

  const flip = dir === "rtl" ? "rotate-180" : undefined;
  const noun =
    items.length === 1 ? dict.common.productOne : dict.common.productMany;

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status !== "form") return; // double-submission guard
    if (items.length === 0) {
      setError(dict.inquiry.errorEmptyList);
      return;
    }
    if (items.some((i) => !isValidQuantity(i.quantity))) {
      setError(dict.inquiry.errorQuantity);
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
            slug: i.slug,
            quantity: Number(i.quantity),
            unit: i.unit ?? "kg",
          })),
          customer: form,
          _hp: hp,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        inquiryId?: string;
      };
      if (!res.ok)
        throw new Error(data.error || dict.inquiry.errorGeneric);
      setInquiryId(data.inquiryId ?? "");
      setStatus("submitted");
      clear();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : dict.inquiry.errorGeneric,
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
            {dict.inquiry.successTitle}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-date-600">
            {t(dict.inquiry.successBody, { id: inquiryId })}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href={href("/products")}
              className="inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
            >
              {dict.common.continueBrowsing}
              <ArrowRight size={16} className={flip} />
            </Link>
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
        <p className="mt-3 text-sm text-date-600">{dict.inquiry.emptyText}</p>
        <Link
          href={href("/products")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-date-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-date-800"
        >
          {dict.common.browseProducts}
          <ArrowRight size={16} className={flip} />
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
            <ClipboardList size={13} /> {dict.inquiry.eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-date-900 sm:text-4xl">
            {dict.inquiry.title}
          </h1>
          <p className="mt-2 text-sm text-date-500">{dict.inquiry.subtitle}</p>
        </div>
        <Link
          href={href("/products")}
          className="inline-flex items-center gap-2 text-sm font-medium text-date-600 transition-colors hover:text-date-900"
        >
          <ArrowLeft size={16} className={flip} />
          {dict.inquiry.continueBrowsing}
        </Link>
      </div>

      <form
        onSubmit={submit}
        className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start"
      >
        {/* Anti-spam honeypot: real users never see or fill this field. */}
        <input
          type="text"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
        />
        {/* Form fields */}
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
                  placeholder={dict.inquiry.fullNamePlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={dict.inquiry.companyName} required>
                <input
                  required
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder={dict.inquiry.companyNamePlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={dict.inquiry.businessEmail} required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder={dict.inquiry.businessEmailPlaceholder}
                  className={inputClass}
                />
              </Field>
              <Field label={dict.inquiry.phone} required>
                <input
                  type="tel"
                  required
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
              {dict.inquiry.shippingDestination}
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
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {countryLabel(dict, c)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={dict.inquiry.city}>
                <input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder={dict.inquiry.cityPlaceholder}
                  maxLength={120}
                  className={inputClass}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.additionalRequirements}
            </h2>
            <div className="mt-5">
              <Field label={dict.inquiry.message}>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  maxLength={MAX_MESSAGE_LENGTH}
                  placeholder={dict.inquiry.messagePlaceholder}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-date-900/10 bg-white p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-date-900">
              {dict.inquiry.paymentTerms}
            </h2>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-cream-100 p-5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-gold-600"
              />
              <div className="text-sm leading-relaxed text-date-600">
                <p className="font-medium text-date-900">
                  {dict.inquiry.termsTitle}
                </p>
                <p className="mt-2">{dict.inquiry.termsBody1}</p>
                <p className="mt-2 text-xs text-date-500">
                  {dict.inquiry.termsBody2}
                </p>
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
            <p className="mt-1 text-xs text-date-500">
              {dict.inquiry.quantityHint}
            </p>
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
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        inputMode="decimal"
                        min="1"
                        step="any"
                        aria-label={t(dict.inquiry.quantityAria, {
                          name: i.name,
                        })}
                        placeholder={dict.inquiry.quantityPlaceholder}
                        value={i.quantity ?? ""}
                        onChange={(e) =>
                          updateItem(i.id, { quantity: e.target.value })
                        }
                        className="w-24 rounded-lg border border-date-900/12 bg-cream-50 px-2.5 py-1.5 text-sm text-date-900 placeholder:text-date-400 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                      />
                      <select
                        aria-label={t(dict.inquiry.unitAria, { name: i.name })}
                        value={i.unit ?? "kg"}
                        onChange={(e) =>
                          updateItem(i.id, {
                            unit: e.target.value as InquiryUnit,
                          })
                        }
                        className="rounded-lg border border-date-900/12 bg-cream-50 px-2 py-1.5 text-sm text-date-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
                      >
                        {QUANTITY_UNITS.map((u) => (
                          <option key={u.value} value={u.value}>
                            {unitLabel(dict, u.value)}
                          </option>
                        ))}
                      </select>
                    </div>
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
                  <Loader2 size={16} className="animate-spin" />
                  {dict.inquiry.submitting}
                </>
              ) : (
                t(dict.inquiry.submit, { count: items.length, noun })
              )}
            </button>

            <p className="mt-4 text-center text-xs text-date-400">
              {dict.inquiry.reviewNote}
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
