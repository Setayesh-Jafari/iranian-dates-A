# FARVAND — B2B Export Catalog · Master Prompt for Claude

> Copy everything inside the box below and paste it into Claude (Artifacts on).
> Replace the bracketed items only where the brief says so.

---

You are a senior editorial art director and prepress designer producing a **premium B2B export catalog** for an Iranian date exporter. Design is judged on restraint, typography and grid discipline — not decoration.

# 0 · OUTPUT FORMAT (non-negotiable)

Deliver **layered, fully editable design files**, not flattened pictures:

1. **PSD files, one per page** — A4 portrait, 2480 × 3508 px @ 300 dpi, RGB.
   - Every headline, label, paragraph and number is a **live Photoshop text layer** (Type Tool, editable font/size/colour), never rasterised text.
   - Every photo is its own layer inside a `PHOTOGRAPHY` group, cropped with a layer mask where possible so the crop stays non-destructive.
   - Panels, rules, chips and frames are separate shape/rectangle layers named for what they are.
   - Layer group order per page: `01 · BACKGROUND` → `02 · PHOTOGRAPHY` → `03 · OVERLAYS` → `04 · FURNITURE` → `05 · CONTENT` → `06 · NOTES (delete before export)`.
   - Layer names follow the catalog, not the tool: `TXT · Page title`, `TXT · Table · Moisture`, `LINE · Header rule`, `IMG · Cover photograph`.
2. **One print-ready PDF** (A4 portrait, 3 mm bleed on full-bleed pages, fonts embedded) assembled from the same artwork.
3. **One editable PowerPoint** (one slide per page, same geometry, text boxes editable) so a commercial team can update numbers without opening Photoshop.
4. A **page-by-page contact sheet** (one JPG per page) for review.

If you cannot emit a binary PSD, produce a complete self-contained HTML/CSS page per catalog page at identical dimensions with semantic, editable text and swappable images, plus a README that maps each HTML block to the PSD layer name it should become — and state clearly which format you actually delivered.

# 1 · BRAND SYSTEM

- **Company:** FARVAND — exporter of premium Iranian dates (producer/packer/exporter to be confirmed).
- **Positioning line:** “Premium Iranian Dates — sourced, graded and packed for importers, wholesalers and distributors.”
- **Palette (use exactly these):**
  - `#0F3B2E` deep green — primary brand colour, section bands, dark panels
  - `#C8A25A` muted gold — accents, rules, numerals, call-to-action text
  - `#F7F3E9` warm cream — page background and reversed text
  - `#5B3A1E` date brown — body text on cream, secondary surfaces
  - Derived tints only through mixing the four above (e.g. 8–12% brown into cream for rules).
- **Typography:** one high-contrast serif for display (e.g. Playfair Display or Cormorant Garamond) + one neutral sans for text and data (e.g. Inter or Jost). Display sizes are large and calm; body is 9–10.5 pt with generous leading. Small caps/eyebrow labels are letterspaced (≈0.18em) in gold or soft brown.
- **Mood:** the BEST food-product catalogs (fine chocolate, olive oil, specialty coffee) — lush, appetising, image-dense and colourful, yet disciplined. Think abundant photography, colour panels and origin stories — NOT minimalist whitespace. Nothing rustic-clipart, nothing generic-corporate, no emoji, no bevels.
- **Density rule (critical):** pages must feel RICH. Each interior page carries 2–4 photographs or colour panels; empty gaps larger than ~40 mm are a design failure. Cover the page with content the buyer wants: photos, origin data, specs, use-cases. If space opens up, add a photo band, a colour panel, a quote or a data chip — never leave a bare cream field.

# 2 · PAGE STRUCTURE (12 pages)

P01 **Cover** — full-bleed hero photograph of Mazafati dates (dark, glossy, dramatic side light), gold hairline frame inset 6 mm, wordmark top-left, meta top-right, headline bottom-left on a quiet dark area of the photo (“Premium Iranian Dates”), one-line positioning statement, footer with `[YEAR]` and `[WEBSITE]`. No text over busy fruit.

P02 **Our Story** — “Our Story”. One large origin photograph (palm grove / harvest at golden hour) + 3 short paragraphs of company narrative, three numbered values (Traceable sourcing · Graded to order · Paperwork that clears), a 4-column `[YEAR]` milestone strip, and a full-width green band with a single honest pull-quote from `[FOUNDER]`. Story facts that are not verified stay as `[YEAR]`, `[CITY]`, `[PROVINCE]`, `[ORIGIN OF THE BUSINESS]`.

P03 **The Range** — a PHOTO WALL of all 12 export varieties in a 3 × 4 grid: **Mazafati, Medjoul, Zahedi, Kimri, Shahani, Najafi, Lasht, Morki, Deglet en-Nour, Barhi, Harani, Piarom**. Each card: a real photograph of the variety, gold rule, variety name (serif), type tag (Soft / Semi-soft / Semi-dry), **HARVEST REGION (city · province)**, and a 2-line description. Footer note: cultivar traits and regions are typical values; the quotation states the confirmed lot origin.

P04 **Mazafati (flagship)** — large product photograph + a green **“HARVEST REGION” badge (Bam, Kerman)** + “At a glance” data block + editable specification table with a STATUS column + three buyer benefits + green quotation call-to-action + a lifestyle photograph (tea service).

P05 **Medjoul (premium)** — mirrored architecture of P04 with its own harvest-region badge (Bam & Saravan) and a gifting photograph. Every variety page shows its typical growing city/province — this is a purchase-decision fact for buyers.

P06 **Zahedi & Kimri** — two-column feature: photograph above each, data rows, compact spec tables. Zahedi = long-haul/shelf-life story; Kimri = value/volume story.

P07 **Shahani, Najafi, Lasht & Beyond** — four photo cards (one per variety, each with harvest region + description + typical use) + two feature panels (Piarom, Harani) with big photographs and origin badges + two more photo cards (Deglet en-Nour, Barhi). Every remaining cultivar gets photo + origin + description — no bare chips.

P08 **Variety Comparison & Origins** — 12-row technical table: variety · type · colour · **harvest region (city, province)** · typical use, with a green header bar and soft zebra rows. Below it a **stylised map of Iran** with numbered pins on the growing cities (Bam, Kerman, Jiroft & Kahnoj, Dashtestan & Kazerun, Jahrom, Hajiabad, Saravan, Abadan & Khorramshahr) and a numbered legend listing which varieties grow where. Footnote: values are typical and the quoted lot’s origin governs.

P09 **Quality Assurance** — six numbered checkpoints (incoming inspection → sorting → moisture control → controlled packing → lot coding & traceability → pre-shipment check), each one sentence, no invented certifications; plus a dark green “Documents we work with” panel (commercial invoice, packing list, phytosanitary certificate, certificate of origin, fumigation certificate, transport documents) and a facility photograph band.

P10 **Packaging** — retail formats (tray+film, clamshell, doypack) with editable net weight / units per carton / carton size; bulk & private-label column set (minimum run, artwork, lead time); a carton & pallet data table; a 4-step private-label process strip. All pack numbers are `[PLACEHOLDERS]`.

P11 **Export & Logistics** — 8 stat tiles (MOQ, annual capacity, lead time, Incoterms, port of loading, payment terms, container loading, sample policy) each with `To be supplied` status; port photograph; target-market chips with India highlighted; shipping & documents note; 4-step ordering process.

P12 **Contact & CTA** — deep green closing page: “Request a Quotation”, contact grid (email, WhatsApp, website, legal name, address, hours — all bracketed), “What to include” checklist panel, QR placeholder, and a closing band with wordmark and sign-off.

# 3 · GRID & LAYOUT RULES

- A4 portrait, 12 mm side margins, consistent on every page. Content width = 186 mm.
- 12-column grid, 4 mm gutters. Cards and tables snap to it; nothing floats.
- Vertical rhythm: eyebrow (letterspaced, gold) → display title (serif) → 20 mm gold rule → deck paragraph. Repeat identically on every interior page.
- Header: wordmark left, section name + `NN / 12` right, hairline rule under. Footer: hairline rule, catalogue name left, `[YEAR]` centre, page number right.
- Include **editor notes** on any page with bracketed fill-in fields: a thin gold-bordered box titled `EDITOR NOTE — REMOVE BEFORE SENDING` with one italic sentence naming the fields the client must complete. They are the last group on the page and never overlap live content.
- Export-document lists are **checkbox lists** (stroked square + label), not bullet dots.
- If a page carries a numbered map/legend, the legend numbers MUST be generated from the same data array as the map pins — never renumber them independently.
- Density over whitespace: this is a food catalog, not an art book. Fill the page with photography, origin data and useful buyer information. Cut copy only if it is fluff — never leave a large empty field when a photograph or colour panel would sell the product.
- Tables: label column 38%, value column, optional STATUS column. Hairline rules only, no fills except one green feature panel per page maximum.
- Text never sits on a busy photograph without a solid quiet area or a soft dark scrim.

# 4 · PHOTOGRAPHY

Premium, authentic, editorial. Style: natural side light, deep shadows, matte stone/linen/wood surfaces, shallow depth of field, dark green and warm gold grade.

Required shots (replace with client photography later, keep same crops):
1. Cover hero — dark glossy Mazafati dates, dramatic light, vertical.
2. Origin story — date palm grove / harvest baskets at golden hour.
3. Mazafati product shot on cream linen.
4. Medjool product shot, amber-brown, premium.
5. Zahedi golden dry dates in terracotta.
6. Kimri small dark dates, minimal styling.
7. Assorted varieties overhead in separate bowls (P07).
8. Export packaging still life (unbranded kraft/green cartons).
9. Sorting/grading hands in a hygienic packing hall (no faces).
10. Port logistics — cartons and containers at dusk.
11. Tea service with dates — warm Persian afternoon mood (lifestyle).
12. Date dessert / patisserie plate — fine-dining plating.
13. Open premium gift box of assorted dates — gifting.
14. Harvest crates of dates in the orchard — origin/production.
15. Date bazaar bulk display — abundance and colour.

No text, no logos, no watermarks, no stock-photo cheese, no fake “certified” badges.

Photography budget: at least 2–3 photographs per interior page. Full-bleed photo bands with a soft dark scrim carrying a single statement line are encouraged on variety pages.

# 5 · COPY RULES

- Audience: importers, wholesalers, distributors — India and beyond. Second person is the buyer; the tone is calm, direct, specification-first.
- Short sentences. One idea per line. Cut every adjective that cannot be checked.
- Benefits are concrete: “consistent grading and count”, “documents issued with the shipment”, “traceable to a grower and a harvest window”.
- Variety descriptions cover: appearance, skin, texture, sweetness, moisture class, **typical harvest region (city and province)**, typical use, storage sensitivity (soft dates need temperature control — say so).
- Every variety card, feature panel and table row names the growing region (e.g. Mazafati → Bam, Kerman; Piarom → Hajiabad, Hormozgan). Use documented cultivar regions; state that the quotation confirms the actual lot origin.
- Never write marketing superlatives (“best in the world”, “unbeatable prices”).
- Every claim must be either (a) a general, widely known cultivar fact, or (b) a labelled placeholder.

# 6 · ACCURACY & PLACEHOLDERS (strict)

Do **not** invent: company history, founding year, certifications, laboratory results, moisture percentages, production capacity, customer references, prices, awards or export volumes.

Use bracketed editable fields exactly like this:
`[YEAR]` `[CITY]` `[PROVINCE]` `[BUSINESS TYPE]` `[GROWING REGION]` `[SIZE OR COUNT PER KG]` `[MOISTURE % — ONLY IF LAB VERIFIED]` `[SHELF LIFE]` `[NET WEIGHT]` `[UNITS]` `[L × W × H]` `[MINIMUM ORDER QUANTITY]` `[ANNUAL SUPPLY CAPACITY]` `[LEAD TIME]` `[INCOTERMS]` `[PORT OF LOADING]` `[PAYMENT TERMS]` `[EXPORT DOCUMENTS]` `[CONTACT EMAIL]` `[WHATSAPP NUMBER]` `[WEBSITE]` `[COMPANY LEGAL NAME]`

Any field that is not yet verified carries a STATUS marker next to it: **Confirmed** (green), **Confirm region** (italic gold), or **To be supplied** (gold). The catalogue must read as honest under a buyer’s scrutiny — a bracket is better than a guess.

# 7 · FINISHING TOUCHES

- Gold hairline frame on the cover only; interior pages use rules, not frames.
- Page numbers are serif, gold, `NN / 12`.
- One deliberate asymmetry per page (e.g. an image bleeding to one margin) so the grid feels designed, not templated.
- Consistency check before delivery: identical margins, identical header/footer, identical eyebrow/title/rule rhythm, identical table styling on every page.

# 8 · DELIVERY CHECKLIST

- [ ] 12 PSD files, one per page, A4 @ 300 dpi, every text layer live and named
- [ ] 1 print-ready PDF, fonts embedded
- [ ] 1 editable PPTX
- [ ] 12 JPG contact sheets
- [ ] All `[PLACEHOLDERS]` listed in a single “TO BE SUPPLIED” appendix page or README
- [ ] Fonts used listed with free-for-commercial-use links (Google Fonts)
- [ ] Nothing flattened except photography

---

## How to use this brief (فارسی)

1. این پرامپت را کامل در Claude بچسبانید (قابلیت Artifacts را روشن کنید).
2. اگر تصویر مرجع (کاور) دارید، همراه پرامپت آپلود کنید و بنویسید: «Use this cover as style reference; keep my palette in section 1 instead of the photo’s colours.»
3. اطلاعات واقعی شرکت را همان اول ندهید؛ بگذارید فایل با `[PLACEHOLDER]` ساخته شود، بعداً خودتان جایگزین می‌کنید. این کار باعث می‌شود هیچ ادعای غیرواقعی وارد کاتالوگ نشود.
4. اگر Claude فقط HTML تحویل داد، از او بخواهید همان صفحه‌ها را به PSD لایه‌باز تبدیل کند یا فایل‌های HTML را نگه دارید؛ معادل‌سازی لایه‌ها در README توضیح داده شده است.
5. نسخه نهایی چاپی را همیشه از PDF خروجی بگیرید، نه از اسکرین‌شات.
