import test from "node:test";
import assert from "node:assert/strict";
import { FALLBACK_IMAGE, firstImage, sanitizeImages } from "../src/lib/images";
import { normalizeDigits } from "../src/lib/inquiry";
import { negotiateLocale, switchLocalePath } from "../src/i18n/config";
import { checkWriteOrigin, readJsonObject } from "../src/lib/request";

test("Persian and Arabic-Indic quantities and phone numbers normalize without rounding", () => {
  assert.equal(normalizeDigits("۰٫۰۰۴"), "0.004");
  assert.equal(normalizeDigits("+٩٨ ۱۲۳"), "+98 123");
  assert.equal(normalizeDigits("10.25"), "10.25");
});

test("image sources reject invalid and unapproved hosts and keep a local fallback", () => {
  assert.equal(firstImage(["", "javascript:alert(1)", "https://evil.example/a.jpg"]), FALLBACK_IMAGE);
  assert.equal(firstImage([" //evil.example/x ", "/images/product.png"]), "/images/product.png");
  assert.deepEqual(sanitizeImages([" https://images.pexels.com/photos/1/a.jpeg ", "bad"]), ["https://images.pexels.com/photos/1/a.jpeg"]);
  assert.deepEqual(sanitizeImages([]), [FALLBACK_IMAGE]);
});

test("locale negotiation and switching retain the search query", () => {
  assert.equal(negotiateLocale("de, fa-IR;q=0.9, en;q=0.5"), "fa");
  assert.equal(negotiateLocale("fa;q=0, en;q=0.8"), "en");
  assert.equal(switchLocalePath("/fa/products?category=dry&q=test", "en"), "/en/products?category=dry&q=test");
});

test("same-origin check rejects cross-origin and opaque browser requests", () => {
  assert.equal(checkWriteOrigin(new Request("https://shop.example/api", { headers: { origin: "https://shop.example" } })), null);
  assert.equal(checkWriteOrigin(new Request("https://shop.example/api", { headers: { origin: "https://evil.example" } }))?.status, 403);
  assert.equal(checkWriteOrigin(new Request("https://shop.example/api", { headers: { origin: "null" } }))?.status, 403);
  assert.equal(checkWriteOrigin(new Request("https://shop.example/api", { headers: { "sec-fetch-site": "cross-site" } }))?.status, 403);
});

test("JSON body limit counts bytes even for chunked non-ASCII input", async () => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"name":"'));
      controller.enqueue(new TextEncoder().encode("مضافتی"));
      controller.enqueue(new TextEncoder().encode('"}'));
      controller.close();
    },
  });
  const request = new Request("https://shop.example/api", {
    method: "POST", headers: { "content-type": "application/json" }, body: stream,
    // Node's Request requires duplex for a streaming request body.
    ...({ duplex: "half" } as object),
  });
  const result = await readJsonObject(request, 16);
  assert.equal(result.ok, false);
  if (!result.ok) assert.equal(result.response.status, 413);
});

test("JSON write guard rejects arrays, invalid types and missing JSON media type", async () => {
  const array = await readJsonObject(new Request("https://shop.example/api", {
    method: "POST", headers: { "content-type": "application/json" }, body: "[]",
  }), 100);
  assert.equal(array.ok, false);
  if (!array.ok) assert.equal(array.response.status, 400);
  const text = await readJsonObject(new Request("https://shop.example/api", { method: "POST", body: "{}" }), 100);
  assert.equal(text.ok, false);
  if (!text.ok) assert.equal(text.response.status, 415);
});
