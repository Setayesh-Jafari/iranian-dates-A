import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { Pool } from "pg";
import { chromium } from "playwright-core";

const base = process.env.TEST_BASE_URL;
const second = process.env.TEST_SECOND_BASE_URL;
const offline = process.env.TEST_OFFLINE_BASE_URL;
const dbUrl = process.env.TEST_DATABASE_URL;
if (!base || !second || !offline || !dbUrl || process.env.ALLOW_TEST_DB_WRITES !== "1" || !new URL(dbUrl).pathname.endsWith("_test")) {
  throw new Error("Integration tests require isolated server URLs and a disposable *_test database.");
}

const pool = new Pool({ connectionString: dbUrl });
const suffix = randomUUID().slice(0, 8);
const slug = `qa-dates-${suffix}`;
const otherSlug = `qa-other-${suffix}`;
const hiddenSlug = `qa-hidden-${suffix}`;
const category = `qa-${suffix}`;
const subnet = `${parseInt(suffix.slice(0, 2), 16)}.${parseInt(suffix.slice(2, 4), 16)}`;
const ip = (last) => `198.${subnet}.${last}`;
const buyerEmail = `qa-${suffix}@example.com`;
const browserEmail = `browser-${suffix}@example.com`;
const inquiryIds = new Set();
const jsonHeaders = (origin, ip) => ({ "Content-Type": "application/json", Origin: origin, "X-Real-IP": ip });
const inquiry = () => ({
  items: [{ slug, quantity: 0.004, unit: "metric_tons", name: "untrusted name" }],
  customer: { name: "QA buyer", company: "QA company", email: buyerEmail, phone: "+۹۸۹۱۲۳۴۵۶۷۸۹", country: "Germany", city: "Hamburg", message: "test only" },
  _hp: "",
});
async function post(origin, path, body, ip, extra = {}) {
  return fetch(`${origin}${path}`, { method: "POST", headers: { ...jsonHeaders(origin, ip), ...extra }, body: JSON.stringify(body) });
}

await test("production API, SEO, multi-instance safeguards and real browser", async (t) => {
  let productId, otherId, hiddenId;
  try {
    const migration = await readFile(new URL("../migrations/001_production_safety.sql", import.meta.url), "utf8");
    await pool.query(migration);
    await pool.query(migration); // additive migration must be re-runnable
    const inserted = await pool.query(`INSERT INTO products
      (slug, name, tagline, description, price, category, origin, weight, unit, rating, images, highlights, featured, published)
      VALUES ($1, 'QA Mazafati', 'QA tagline', 'QA product description', 0, $2, 'Iran', '1 kg', 'per kg', 4.5,
      '["/product-placeholder.svg", "/product-placeholder.svg"]'::jsonb, '["QA detail"]'::jsonb, true, true)
      RETURNING id`, [slug, category]);
    productId = inserted.rows[0].id;
    const insertedOther = await pool.query(`INSERT INTO products
      (slug, name, description, price, category, origin, weight, unit, rating, images, published)
      VALUES ($1, 'QA Other', 'Other description', 123, $2, 'Iran', '1 kg', 'per kg', 2,
      '["/product-placeholder.svg"]'::jsonb, true) RETURNING id`, [otherSlug, category]);
    otherId = insertedOther.rows[0].id;
    const hidden = await pool.query(`INSERT INTO products
      (slug, name, description, price, category, origin, weight, unit)
      VALUES ($1, 'Private draft', 'Not for publication', 0, $2, 'Iran', '1 kg', 'per kg') RETURNING id`, [hiddenSlug, category]);
    hiddenId = hidden.rows[0].id;
    await pool.query(`INSERT INTO product_translations (product_id, locale, name, tagline, description, origin, weight, unit, highlights)
      VALUES ($1, 'fa', 'خرمای آزمایشی', 'توضیح آزمایشی', 'شرح محصول آزمایشی', 'ایران', '۱ کیلوگرم', 'هر کیلوگرم', '["جزئیات آزمایشی"]'::jsonb)`, [productId]);

    await t.test("health, products, filters, sorting, translation and price privacy", async () => {
      assert.equal((await fetch(`${base}/api/health`)).status, 200);
      const res = await fetch(`${base}/api/products?category=${category}&sort=rating&locale=fa`);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.products.length, 2);
      assert.equal(data.products[0].slug, slug);
      assert.equal(data.products[0].name, "خرمای آزمایشی");
      assert.equal(data.products[0].contentLocale, "fa");
      assert.equal(data.products[1].contentLocale, "en");
      assert.ok(!Object.hasOwn(data.products[0], "price"));
      assert.ok(!Object.hasOwn(data.products[0], "compareAtPrice"));
      assert.ok(!Object.hasOwn(data.products[0], "stock"));
      const search = await (await fetch(`${base}/api/products?locale=fa&q=${encodeURIComponent("آزمایشی")}`)).json();
      assert.ok(search.products.some((p) => p.slug === slug));
      const detail = await (await fetch(`${base}/api/products/${slug}?locale=fa`)).json();
      assert.equal(detail.product.name, "خرمای آزمایشی");
      assert.equal(new Set(detail.related.map((p) => p.id)).size, detail.related.length);
      assert.equal((await fetch(`${base}/api/products?sort=price-low`)).status, 400);
      assert.equal((await fetch(`${base}/api/products?rating=bogus`)).status, 400);
      assert.equal((await fetch(`${base}/api/products?locale=ar`)).status, 400);
      assert.equal((await fetch(`${base}/api/products/nonexistent-qa`)).status, 404);
      assert.equal((await fetch(`${base}/api/products/${hiddenSlug}`)).status, 404);
    });

    await t.test("canonical, hreflang, dynamic sitemap, preview noindex, redirects and headers", async () => {
      const response = await fetch(`${base}/fa/products/${slug}`, { headers: { "User-Agent": "Googlebot" } });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-frame-options"), "DENY");
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      assert.match(response.headers.get("content-security-policy"), /frame-ancestors 'none'/);
      assert.ok(response.headers.get("strict-transport-security"));
      const html = await response.text();
      assert.match(html, /<html[^>]*lang="fa-IR"[^>]*dir="rtl"/);
      assert.ok(html.includes(`rel="canonical" href="${base}/fa/products/${slug}"`));
      assert.ok(html.includes(`hrefLang="en" href="${base}/en/products/${slug}"`));
      assert.ok(html.includes('name="twitter:card"'));
      const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
      assert.ok(sitemap.includes(`${base}/en/products/${slug}`));
      assert.ok(sitemap.includes(`${base}/fa/products/${slug}`));
      assert.ok(!sitemap.includes("/inquiry"));
      assert.ok(!sitemap.includes("/api/"));
      assert.ok(!sitemap.includes(hiddenSlug));
      const robots = await (await fetch(`${base}/robots.txt`)).text();
      assert.ok(robots.includes("Disallow: /api/"));
      assert.ok(!robots.includes("Disallow: /en/inquiry"));
      const inq = await (await fetch(`${base}/en/inquiry`, { headers: { "User-Agent": "Googlebot" } })).text();
      assert.ok(inq.includes('name="robots" content="noindex, follow"'));
      const preview = await (await fetch(`${second}/en`, { headers: { "User-Agent": "Googlebot" } })).text();
      assert.ok(preview.includes('name="robots" content="noindex, follow"'));
      const missing = await fetch(`${base}/fa/not-a-real-page`, { headers: { "User-Agent": "Googlebot" } });
      assert.equal(missing.status, 404);
      assert.match(await missing.text(), /name="robots" content="noindex/);
      const checkout = await fetch(`${base}/fa/checkout`, { redirect: "manual" });
      assert.equal(checkout.status, 307);
      assert.ok(checkout.headers.get("location").endsWith("/fa/inquiry"));
    });

    await t.test("RFQ validation, cross-origin defense and durable idempotency across two servers", async () => {
      assert.equal((await post(base, "/api/inquiry", inquiry(), ip(10), { Origin: "https://attacker.example", "Idempotency-Key": randomUUID() })).status, 403);
      assert.equal((await fetch(`${base}/api/inquiry`, { method: "POST", headers: { "X-Real-IP": ip(11) }, body: "{}" })).status, 415);
      assert.equal((await post(base, "/api/inquiry", { ...inquiry(), customer: null }, ip(12), { "Idempotency-Key": randomUUID() })).status, 400);
      assert.equal((await post(base, "/api/inquiry", { ...inquiry(), items: [{ slug, quantity: 3, unit: "invalid" }] }, ip(13), { "Idempotency-Key": randomUUID() })).status, 400);
      assert.equal((await post(base, "/api/inquiry", { ...inquiry(), items: [{ slug, quantity: 3, unit: "kg" }, { slug, quantity: 5, unit: "kg" }] }, ip(14), { "Idempotency-Key": randomUUID() })).status, 400);
      assert.equal((await post(base, "/api/inquiry", { ...inquiry(), _hp: "spam" }, ip(15), { "Idempotency-Key": randomUUID() })).status, 400);
      const badPhone = inquiry(); badPhone.customer.phone = "-----";
      assert.equal((await post(base, "/api/inquiry", badPhone, ip(17), { "Idempotency-Key": randomUUID() })).status, 400);
      assert.equal((await post(base, "/api/inquiry", inquiry(), ip(16))).status, 400);
      const hiddenInquiry = inquiry(); hiddenInquiry.items[0].slug = hiddenSlug;
      assert.equal((await post(base, "/api/inquiry", hiddenInquiry, ip(18), { "Idempotency-Key": randomUUID() })).status, 400);
      const key = randomUUID();
      const results = await Promise.all(Array.from({ length: 8 }, (_, i) => {
        const origin = i % 2 ? second : base;
        return post(origin, "/api/inquiry", inquiry(), ip(20), { "Idempotency-Key": key });
      }));
      assert.equal(results.filter((r) => r.status === 201).length, 1);
      assert.equal(results.filter((r) => r.status === 200).length, 7);
      const references = await Promise.all(results.map((r) => r.json()));
      assert.equal(new Set(references.map((r) => r.inquiryId)).size, 1);
      const id = references[0].inquiryId;
      inquiryIds.add(id);
      const saved = await pool.query("SELECT phone, items FROM inquiries WHERE id = $1", [id]);
      assert.equal(saved.rowCount, 1);
      assert.equal(saved.rows[0].phone, "+989123456789");
      assert.equal(saved.rows[0].items[0].quantity, 0.004);
      assert.equal(saved.rows[0].items[0].name, "QA Mazafati");
      assert.equal(saved.rows[0].items[0].unit, "metric_tons");
      const changed = inquiry(); changed.customer.message = "changed";
      assert.equal((await post(base, "/api/inquiry", changed, ip(20), { "Idempotency-Key": key })).status, 409);
      const count = await pool.query("SELECT count(*)::int AS count FROM inquiries WHERE id = $1", [id]);
      assert.equal(count.rows[0].count, 1);
    });

    await t.test("review moderation and atomic shared rate limits", async () => {
      const body = { productId, rating: 5, author: "QA reviewer", comment: "A sufficiently long test review.", _hp: "" };
      assert.equal((await post(base, "/api/reviews", { ...body, rating: "5" }, ip(30))).status, 400);
      assert.equal((await post(base, "/api/reviews", { ...body, productId: hiddenId }, ip(34))).status, 404);
      assert.equal((await post(base, "/api/reviews", { ...body, _hp: "spam" }, ip(31))).status, 400);
      assert.equal((await post(base, "/api/reviews", body, ip(32), { Origin: "https://attacker.example" })).status, 403);
      const results = await Promise.all(Array.from({ length: 6 }, (_, i) => post(i % 2 ? second : base, "/api/reviews", body, ip(33))));
      assert.equal(results.filter((r) => r.status === 202).length, 5);
      const denied = results.find((r) => r.status === 429);
      assert.ok(denied);
      assert.ok(Number(denied.headers.get("retry-after")) > 0);
      const pending = await pool.query("SELECT id FROM reviews WHERE product_id = $1 AND status = 'pending'", [productId]);
      assert.equal(pending.rowCount, 5);
      const before = await (await fetch(`${base}/api/products/${slug}`)).json();
      assert.equal(before.reviews.length, 0);
      const moderate = spawnSync("npm", ["run", "review:moderate", "--", "approve", String(pending.rows[0].id)], {
        env: { ...process.env, DATABASE_URL: dbUrl }, encoding: "utf8", timeout: 20000,
      });
      assert.equal(moderate.status, 0, moderate.stderr);
      const after = await (await fetch(`${base}/api/products/${slug}`)).json();
      assert.equal(after.reviews.length, 1);
      assert.equal(after.product.rating, 5);
      assert.equal(after.product.reviewCount, 1);
    });

    await t.test("database or trusted IP header outage fails closed", async () => {
      assert.equal((await fetch(`${offline}/api/health`)).status, 503);
      const r = await post(offline, "/api/inquiry", inquiry(), ip(40), { "Idempotency-Key": randomUUID() });
      assert.equal(r.status, 503);
      assert.ok(!(await r.json()).inquiryId);
      const noHeader = await fetch(`${base}/api/reviews`, {
        method: "POST", headers: { "Content-Type": "application/json", Origin: base }, body: "{}",
      });
      assert.equal(noHeader.status, 503);
      const untrustedList = await post(base, "/api/reviews", {}, `${ip(1)}, ${ip(2)}`);
      assert.equal(untrustedList.status, 503);
    });

    await t.test("desktop/mobile browser: home, RTL, filters, gallery, drawer, RFQ retry and reviews", {
      skip: !process.env.CHROME_PATH && "CHROME_PATH is not available",
      timeout: 90000,
    }, async () => {
      const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, extraHTTPHeaders: { "X-Real-IP": ip(170) } });
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      const pageErrors = [];
      const consoleErrors = [];
      const networkErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error" && !message.location().url.includes("/api/inquiry")) consoleErrors.push(message.text());
      });
      page.on("requestfailed", (request) => {
        const failure = request.failure()?.errorText || "";
        if (!failure.includes("ERR_ABORTED")) networkErrors.push(`${request.url()}: ${failure}`);
      });
      // Sandbox cannot reach the external stock-photo host. Mock ONLY image
      // optimization responses; API, navigation and forms remain real.
      const placeholder = await readFile(new URL("../public/product-placeholder.svg", import.meta.url));
      await context.route("**/_next/image?**", async (route) => {
        const imageUrl = new URL(route.request().url()).searchParams.get("url") || "";
        if (imageUrl.startsWith("https://images.pexels.com/")) {
          await route.fulfill({ status: 200, contentType: "image/svg+xml", body: placeholder });
        } else await route.continue();
      });
      try {
        await page.goto(`${base}/fa`, { waitUntil: "domcontentloaded" });
        assert.match(await page.locator("h1").innerText(), /خرمای ایرانی/);
        assert.equal(await page.locator("html").getAttribute("dir"), "rtl");
        const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        assert.ok(width.scroll <= width.client + 1, `mobile overflow: ${JSON.stringify(width)}`);
        await page.goto(`${base}/fa/products?category=${category}`, { waitUntil: "domcontentloaded" });
        await page.getByRole("button", { name: /فیلترها/ }).click();
        assert.equal(await page.getByRole("dialog").count(), 1);
        await page.keyboard.press("Escape");
        await page.waitForTimeout(500);
        const english = page.getByRole("link", { name: "English", exact: true }).first();
        assert.ok((await english.getAttribute("href")).includes(`category=${category}`));
        await english.click();
        await page.waitForURL(`**/en/products?category=${category}`);
        assert.equal(await page.locator("html").getAttribute("dir"), "ltr");
        await page.getByRole("combobox", { name: "Sort products by" }).selectOption("rating");
        await page.waitForURL(`**/en/products?category=${category}&sort=rating`);
        assert.ok((await page.locator("article").first().innerText()).includes("QA Mazafati"));
        const searchInput = page.getByRole("textbox", { name: "Search dates…" }).last();
        await searchInput.fill("Mazafati");
        await page.waitForURL(/q=Mazafati/);
        await page.getByRole("button", { name: "Filters" }).click();
        await page.getByRole("button", { name: "Clear all filters" }).click();
        await page.waitForURL(`**/en/products`);
        assert.equal(await page.getByRole("textbox", { name: "Search dates…" }).last().inputValue(), "");
        await page.goto(`${base}/fa/products/${slug}`, { waitUntil: "domcontentloaded" });
        assert.equal(await page.locator("h1").innerText(), "خرمای آزمایشی");
        const thumbnails = page.locator('button[aria-label^="مشاهده تصویر"]');
        assert.equal(await thumbnails.count(), 2);
        await thumbnails.nth(1).click();
        assert.equal(await thumbnails.nth(1).getAttribute("aria-pressed"), "true");
        await page.getByRole("button", { name: "افزودن به فهرست استعلام" }).click();
        await page.getByRole("button", { name: "نمایش فهرست استعلام" }).click();
        await page.getByRole("dialog").waitFor();
        assert.ok((await page.getByRole("dialog").innerText()).includes("خرمای آزمایشی"));
        await page.keyboard.press("Escape");
        await page.waitForTimeout(500);
        await page.goto(`${base}/fa/inquiry`, { waitUntil: "domcontentloaded" });
        await page.getByLabel("نام کامل").fill("خریدار آزمایشی");
        await page.getByLabel("نام شرکت").fill("شرکت آزمایشی");
        await page.getByLabel("ایمیل کاری").fill(browserEmail);
        await page.getByLabel("تلفن / واتس‌اپ").fill("+۹۸۹۱۲۳۴۵۶۷۸۹");
        await page.locator("form select").first().selectOption("Germany");
        await page.locator('input[inputmode="decimal"]').fill("۰٫۵");
        assert.equal(await page.locator('input[inputmode="decimal"]').inputValue(), "0.5");
        let firstKey;
        const intercept = async (route) => {
          firstKey = route.request().headers()["idempotency-key"];
          await route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"offline"}' });
        };
        await page.route("**/api/inquiry", intercept);
        await page.getByRole("button", { name: /ارسال استعلام ·/ }).click();
        await page.getByRole("alert").filter({ hasText: "ثبت درخواست تأیید نشد" }).waitFor();
        assert.equal(await page.locator('input[inputmode="decimal"]').inputValue(), "0.5");
        await page.unroute("**/api/inquiry", intercept);
        const requestPromise = page.waitForRequest((r) => r.url().endsWith("/api/inquiry") && r.method() === "POST");
        await page.getByRole("button", { name: /ارسال استعلام ·/ }).click();
        const sent = await requestPromise;
        assert.equal(sent.headers()["idempotency-key"], firstKey);
        await page.getByRole("heading", { name: "استعلام شما ثبت شد!" }).waitFor();
        const saved = await pool.query("SELECT id FROM inquiries WHERE email = $1", [browserEmail]);
        assert.equal(saved.rowCount, 1);
        inquiryIds.add(saved.rows[0].id);
        await page.goto(`${base}/fa/products/${slug}`, { waitUntil: "domcontentloaded" });
        await page.getByLabel("نام *").fill("آزمایش");
        await page.locator("textarea").last().fill("این یک نظر آزمایشی برای بررسی فرم است.");
        await page.getByRole("button", { name: "ارسال نظر" }).click();
        await page.getByText("سپاسگزاریم! نظر شما پس از بررسی منتشر می‌شود.").waitFor();
        await page.setViewportSize({ width: 1440, height: 900 });
        const desktopWidth = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
        assert.ok(desktopWidth.scroll <= desktopWidth.client + 1, `desktop overflow: ${JSON.stringify(desktopWidth)}`);
        assert.deepEqual(pageErrors, []);
        assert.deepEqual(consoleErrors, []);
        assert.deepEqual(networkErrors, []);
      } finally {
        await context.close();
        await browser.close();
      }
    });
  } finally {
    // Unique test-only addresses also clean up a committed lead when an
    // assertion fails before its response/reference was observed.
    await pool.query("DELETE FROM inquiries WHERE email = ANY($1::text[])", [[buyerEmail, browserEmail]]);
    if (productId || otherId || hiddenId) await pool.query("DELETE FROM products WHERE id = ANY($1::int[])", [[productId, otherId, hiddenId].filter(Boolean)]);
    await pool.end();
  }
});
