/**
 * Shared inquiry (RFQ) constants used by both the client form and the
 * server-side API. Keeping them here means the server never has to trust
 * limits that only exist in the browser.
 *
 * IMPORTANT: the numeric limits below are TECHNICAL anti-abuse bounds
 * (payload/field size guards). They are NOT business rules and must not be
 * presented to buyers as minimum or maximum order quantities. No MOQ is
 * defined anywhere in this application.
 */

export const INQUIRY_COUNTRIES = [
  "India", "United Arab Emirates", "Saudi Arabia", "Iraq", "Pakistan",
  "Bangladesh", "Sri Lanka", "Turkey", "Russia", "Germany",
  "United Kingdom", "United States", "Canada", "Australia", "Other",
] as const;

export type InquiryUnit = "kg" | "cartons" | "metric_tons";

export const QUANTITY_UNITS: { value: InquiryUnit; label: string }[] = [
  { value: "kg", label: "kg" },
  { value: "cartons", label: "cartons" },
  { value: "metric_tons", label: "metric tons" },
];

/** Buyer-facing unit label for a stored unit value. */
export function unitLabel(unit: string | undefined): string {
  return QUANTITY_UNITS.find((u) => u.value === unit)?.label ?? "kg";
}

// ── Technical safety limits (anti-abuse; NOT MOQ / NOT business rules) ──
export const MAX_INQUIRY_ITEMS = 20;
/** 1,000,000 in the selected unit — absurd for a quote request, guards numeric abuse. */
export const MAX_QUANTITY_VALUE = 1_000_000;
export const MAX_MESSAGE_LENGTH = 4_000;
export const MAX_REQUEST_BODY_BYTES = 64 * 1024;

// Field length bounds mirrored from the DB column sizes.
export const FIELD_LIMITS = {
  name: 80,
  company: 120,
  email: 120,
  phone: 24,
  country: 80,
  city: 120,
} as const;

/** Persisted item shape stored in `inquiries.items` (jsonb). */
export type StoredInquiryItem = {
  /** Authoritative product id from the products table. */
  productId: number;
  /** Authoritative product name from the products table. */
  name: string;
  slug: string;
  /** Buyer-provided numeric quantity, validated server-side. */
  quantity: number;
  unit: InquiryUnit;
};
