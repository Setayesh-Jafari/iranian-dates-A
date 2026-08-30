/**
 * Lead-notification abstraction for new inquiries (RFQs).
 *
 * STATUS: no email/notification provider is configured in this project yet
 * (no SMTP/Resend/Nodemailer dependency exists and none was added).
 * The reliable system of record for a lead is the `inquiries` table — a
 * buyer only sees success after the row is persisted.
 *
 * This module provides a single, clearly-scoped integration point for the
 * team-notification step: set INQUIRY_WEBHOOK_URL in the deployment
 * environment (a server-side URL owned by the business, e.g. a Slack/Teams
 * connector or email-relay endpoint) and a JSON summary of each new inquiry
 * will be POSTed to it, best-effort.
 *
 * Safety rules:
 *  - Delivery NEVER blocks or fails the buyer's request: persistence has
 *    already succeeded; a webhook error is logged server-side only.
 *  - The payload deliberately contains NO direct PII (no email, phone or
 *    free-text message) — just the inquiry reference and non-sensitive
 *    counts so the team can pull the full record from the database.
 *  - When INQUIRY_WEBHOOK_URL is unset this is a no-op.
 */

export type InquiryNotification = {
  inquiryId: string;
  itemCount: number;
  country: string;
};

export function isInquiryNotifierConfigured(): boolean {
  return Boolean(process.env.INQUIRY_WEBHOOK_URL);
}

export async function notifyNewInquiry(
  notification: InquiryNotification
): Promise<void> {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(notification),
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(
        `[notify] inquiry webhook responded ${res.status} for ${notification.inquiryId}`
      );
    }
  } catch (err) {
    // Log the failure type only — never the target URL or credentials.
    console.error(
      `[notify] inquiry webhook delivery failed for ${notification.inquiryId}:`,
      err instanceof Error ? err.constructor.name : "unknown error"
    );
  }
}
