/**
 * FARVAND — B2B Export Catalog, page content model — IMAGE-RICH REDESIGN.
 * 12 pages · A4 portrait · 2480 x 3508 px @ 300 dpi.
 *
 * Design goals for this revision (client feedback):
 *   • much more photography per page, far less empty space
 *   • richer colour: green/gold panels, origin badges, full-bleed bands
 *   • every variety shows its typical HARVEST REGION (city + province)
 *   • cover page unchanged (approved by the client)
 */
const { C, T, PAGE, T_ } = require('./theme');
const B = require('./blocks');
const { measure } = require('./lib');

const TOTAL = 12;

/* --------------------------------------------------------------- varieties */
/* `origin` = typical growing region of the cultivar (documented);
   the specific lot's origin is confirmed on every quotation. */
const VARIETIES = [
  {
    name: 'Mazafati', type: 'Soft', img: 'mazafati.jpg',
    originCity: 'Bam', originProvince: 'Kerman',
    note: 'Dark, glossy and thin-skinned — the benchmark soft date of Iran and the variety buyers reorder most.',
    use: 'Retail packs, gifting, food manufacturing',
    colour: 'Dark brown to near-black', skin: 'Thin and glossy',
  },
  {
    name: 'Medjoul', type: 'Soft', img: 'medjoul.jpg',
    originCity: 'Bam & Saravan', originProvince: 'Kerman / Sistan',
    note: 'Large, caramel-brown and very high in sugar. The premium gifting date of the range.',
    use: 'Premium gifting, retail, seasonal gift packs',
    colour: 'Amber to deep brown', skin: 'Thick and wrinkled',
  },
  {
    name: 'Zahedi', type: 'Semi-dry', img: 'zahedi.jpg',
    originCity: 'Dashtestan & Kazerun', originProvince: 'Fars',
    note: 'Golden, wrinkled and firm with a long shelf life. The safe choice for long-haul shipping.',
    use: 'Long-haul shipping, bulk, cooking and processing',
    colour: 'Light golden brown', skin: 'Dry and wrinkled',
  },
  {
    name: 'Kimri', type: 'Soft', img: 'kimri.jpg',
    originCity: 'Bam', originProvince: 'Kerman',
    note: 'Small, dark and intensely sweet. Packs densely, so carton cost per kilo stays competitive.',
    use: 'Retail pouches, value packs, high-volume orders',
    colour: 'Dark brown', skin: 'Thin and smooth',
  },
  {
    name: 'Shahani', type: 'Semi-soft', img: 'shahani.jpg',
    originCity: 'Jiroft & Kahnoj', originProvince: 'Kerman',
    note: 'Mid-size amber fruit with a delicate, tender skin and a clean, mild sweetness.',
    use: 'Retail trays, bakery and dessert supply',
    colour: 'Light amber brown', skin: 'Smooth and fine',
  },
  {
    name: 'Najafi', type: 'Soft', img: 'najafi.jpg',
    originCity: 'Saravan & Bam', originProvince: 'Sistan / Kerman',
    note: 'Round, very dark and soft. A traditional cultivar with a loyal following at home and abroad.',
    use: 'Retail, traditional food processing',
    colour: 'Dark brown to black', skin: 'Thin',
  },
  {
    name: 'Lasht', type: 'Semi-dry', img: 'lasht.jpg',
    originCity: 'Dashtestan', originProvince: 'Fars',
    note: 'Brown, wrinkled and firm — the workhorse of Iranian cooking and industrial processing.',
    use: 'Bulk shipments, industrial processing, cooking',
    colour: 'Medium brown', skin: 'Firm and wrinkled',
  },
  {
    name: 'Morki', type: 'Semi-dry', img: 'morki.jpg',
    originCity: 'Kazerun & Dashtestan', originProvince: 'Fars',
    note: 'Light brown and moderately dry, with a firm bite that holds well in a mixed gift box.',
    use: 'Gift boxes, retail, catering and hospitality',
    colour: 'Light to medium brown', skin: 'Smooth to lightly wrinkled',
  },
  {
    name: 'Deglet en-Nour', type: 'Semi-dry', img: 'assorted.jpg', crop: { sx: 0, sy: 0, sw: 768, sh: 512 },
    originCity: 'Abadan & Khorramshahr', originProvince: 'Khuzestan',
    note: 'Pale amber with a mild, honeyed flavour and a light skin that eats easily.',
    use: 'Mixed retail boxes, bakery and confectionery supply',
    colour: 'Pale golden brown', skin: 'Lightly wrinkled',
  },
  {
    name: 'Barhi', type: 'Soft', img: 'assorted.jpg', crop: { sx: 768, sy: 0, sw: 768, sh: 512 },
    originCity: 'Saravan', originProvince: 'Sistan & Baluchestan',
    note: 'Round, soft and mild, with low fibre — a straightforward snacking date.',
    use: 'Retail snacking, food manufacturing',
    colour: 'Golden brown', skin: 'Smooth',
  },
  {
    name: 'Harani', type: 'Soft', img: 'assorted.jpg', crop: { sx: 0, sy: 512, sw: 768, sh: 512 },
    originCity: 'Jahrom', originProvince: 'Fars',
    note: 'Soft, amber and very sweet. A premium soft date sold in smaller, higher-value packs.',
    use: 'Premium retail and corporate gifting',
    colour: 'Amber brown', skin: 'Thin and glossy',
  },
  {
    name: 'Piarom', type: 'Semi-dry', img: 'piarom.jpg',
    originCity: 'Hajiabad', originProvince: 'Hormozgan',
    note: 'Small, dark, dry and chewy — the date most often described as the chocolate date.',
    use: 'Snacking, premium bulk, gifting',
    colour: 'Deep brown to black', skin: 'Dry and wrinkled',
  },
];

const V = Object.fromEntries(VARIETIES.map((v) => [v.name, v]));

/* ------------------------------------------------------------------ helpers */
const col = (i, n, gap = 64, width = PAGE.contentW) => PAGE.m + (width - gap * (n - 1)) / n * i + gap * i;

/** Origin badge: green chip with gold caption + city / province. */
function originBadge(x, y, w, city, province, opts = {}) {
  const h = opts.h || 176;
  return [
    B.rect(x, y, w, h, T.green, { name: `BG · Origin badge · ${city}` }),
    B.rect(x, y, 110, 3, T.gold, { name: `LINE · Origin badge · ${city}` }),
    B.text('HARVEST REGION', x + 50, y + 34, {
      style: { ...T_.eyebrowSm, size: 18, tracking: 4.2 }, color: T.gold,
      name: `TXT · Origin label · ${city}`, role: 'meta',
    }),
    B.text(city, x + 50, y + 72, {
      style: 'h3m', color: C.cream, width: w - 100,
      name: `TXT · Origin city · ${city}`, role: 'value',
    }),
    B.text(province, x + 50, y + h - 42, {
      style: 'caption', color: T.onGreenSoft, width: w - 100,
      name: `TXT · Origin province · ${city}`, role: 'caption',
    }),
  ];
}

/** Numbered value block (story + quality pages). */
function numbered(x, y, num, title, body, opts = {}) {
  const w = opts.w || 880;
  const numShift = measure('Hxg', T_.h4).ascent - measure('Hxg', T_.num).ascent;
  return [
    B.text(num, x, y + numShift, { style: 'num', color: T.gold, name: `TXT · Numeral · ${num}`, role: 'numeral' }),
    B.text(title, x + 110, y, { style: 'h4', color: opts.onDark ? C.cream : T.greenInk, name: `TXT · Value · ${title}`, role: 'value' }),
    B.text(body, x + 110, y + 52, {
      style: 'bodySm', color: opts.onDark ? T.onGreenSoft : T.brownMid, width: w - 110,
      name: `TXT · Value body · ${title}`, role: 'value',
    }),
  ];
}

/** Photo caption in the quiet brown. */
function caption(str, x, y, opts = {}) {
  return B.text(str, x, y, {
    style: 'caption', color: opts.color || T.brownMid, width: opts.width,
    name: opts.name || 'TXT · Photo caption', role: 'caption',
  });
}

/* ================================================================== PAGES */
const PAGES = [];

/* ------------------------------------------------------------- 01 · COVER  (client-approved, unchanged) */
{
  const g = [];
  g.push({ name: '01 · Photography', blocks: [B.image('cover_hero.jpg', 0, 0, PAGE.w, PAGE.h)] });
  g.push({
    name: '02 · Overlays',
    blocks: [
      B.scrim(0, 0, PAGE.w, PAGE.h, [[0, C.green, 0.12], [0.3, C.green, 0.28], [0.58, '#0A2A20', 0.86], [1, '#06180F', 0.97]]),
      B.scrim(0, 0, PAGE.w, PAGE.h, [[0, '#000000', 0.22], [1, '#000000', 0.1]], { vertical: false, name: 'OVERLAY · Side shade' }),
    ],
  });
  g.push({
    name: '03 · Brand',
    blocks: [
      B.rect(64, 64, PAGE.w - 128, 2, T.gold, { name: 'FRAME · Top' }),
      B.rect(64, PAGE.h - 66, PAGE.w - 128, 2, T.gold, { name: 'FRAME · Bottom' }),
      B.rect(64, 64, 2, PAGE.h - 128, T.gold, { name: 'FRAME · Left' }),
      B.rect(PAGE.w - 66, 64, 2, PAGE.h - 128, T.gold, { name: 'FRAME · Right' }),
      B.image('mark.png', PAGE.m, 132, 84, 84, { name: 'LOGO · Compass mark' }),
      B.text('FARVAND', PAGE.m + 116, 140, {
        style: { ...T_.h3m, size: 44, lineHeight: 52, tracking: 9 }, color: C.cream,
        name: 'TXT · Wordmark', role: 'brand',
      }),
      B.text('Premium Iranian Dates', PAGE.m + 118, 196, {
        style: { ...T_.eyebrowSm, size: 17, tracking: 4.4 }, color: T.gold,
        name: 'TXT · Wordmark descriptor', role: 'brand',
      }),
      B.text('B2B EXPORT CATALOG', PAGE.w - PAGE.m - 900, 152, {
        style: 'eyebrowSm', color: T.onGreenSoft, align: 'right', width: 760,
        name: 'TXT · Cover meta right', role: 'meta',
      }),
      B.text('[YEAR] · EDITION 01', PAGE.w - PAGE.m - 900, 196, {
        style: 'eyebrowSm', color: T.gold, align: 'right', width: 760,
        name: 'TXT · Cover edition', role: 'meta',
      }),
    ],
  });
  g.push({
    name: '04 · Cover headline',
    blocks: [
      B.text('Iran’s date harvest, packed for world buyers', PAGE.m, 2230, {
        style: 'eyebrow', color: T.gold, name: 'TXT · Cover eyebrow', role: 'eyebrow',
      }),
      B.text('Premium Iranian\nDates', PAGE.m, 2300, {
        style: 'displayXL', color: C.cream, width: 1900,
        name: 'TXT · Cover title', role: 'title',
      }),
      B.rect(PAGE.m, 2668, 150, 3, T.gold, { name: 'LINE · Cover rule' }),
      B.text(
        'FARVAND sources, grades and packs Iran’s finest export date varieties — from soft Mazafati to dry Zahedi — for importers, wholesalers and distributors who buy by specification.',
        PAGE.m, 2740, {
          style: 'body', color: T.onGreenSoft, width: 1250,
          name: 'TXT · Cover statement', role: 'deck',
        }),
    ],
  });
  g.push({
    name: '05 · Cover footer',
    blocks: [
      B.rect(PAGE.m, 3090, PAGE.contentW, 1, T.onGreenFaint, { name: 'LINE · Cover footer rule' }),
      B.text('IMPORTERS · WHOLESALERS · DISTRIBUTORS', PAGE.m, 3130, {
        style: 'eyebrowSm', color: T.onGreenSoft, name: 'TXT · Cover footer left', role: 'meta',
      }),
      B.text('[WEBSITE]   ·   [CONTACT EMAIL]', PAGE.m, 3130, {
        style: 'eyebrowSm', color: T.gold, align: 'right', width: PAGE.contentW,
        name: 'TXT · Cover footer right', role: 'meta',
      }),
    ],
  });
  PAGES.push({ id: 'P01', file: 'FARVAND_Catalog_P01_Cover', title: 'Cover', groups: g });
}

/* ---------------------------------------------------------- 02 · OUR STORY (photo mosaic, dense) */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({
    name: '02 · Photography',
    blocks: [
      B.image('story_palm.jpg', PAGE.m, 700, 1060, 900, { name: 'IMG · Palm grove' }),
      B.image('crates.jpg', 1310, 700, 1000, 435, { name: 'IMG · Harvest crates' }),
      B.image('tea.jpg', 1310, 1165, 1000, 435, { name: 'IMG · Tea and dates' }),
    ],
  });
  g.push({ name: '03 · Furniture', blocks: B.furniture('OUR STORY', 2, TOTAL) });
  g.push({
    name: '04 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '01 — WHO WE ARE',
      title: 'Our Story',
      deck: 'FARVAND is an Iranian date exporter built around one promise: the carton that arrives should be the carton that was promised.',
      deckWidth: 1500,
    }),
  });
  g.push({
    name: '05 · Copy',
    blocks: [
      B.text(
        'FARVAND began in [YEAR] in [CITY], [PROVINCE] — inside the belt where Iranian dates are grown. What started as [ORIGIN OF THE BUSINESS] grew into a focused export operation: [PRODUCER / PACKER / EXPORTER] of Iranian dates for business buyers who buy by specification, not by photograph.',
        PAGE.m, 1660, { style: 'body', color: T.brownInk, width: 1000, name: 'TXT · Story paragraph 1', role: 'body' }),
      B.text(
        'Today we work with [GROWER PARTNERS / OWNED ORCHARDS] across Kerman, Fars, Hormozgan, Sistan and Khuzestan to bring together the varieties buyers reorder — and we pack them to the standard each market expects.',
        PAGE.m, 1932, { style: 'body', color: T.brownInk, width: 1000, name: 'TXT · Story paragraph 2', role: 'body' }),
      B.text(
        'Our own operation covers [SCOPE: SOURCING / PROCESSING / PACKING / SHIPPING]. Everything outside that — [LAB TESTING, CERTIFICATION, FREIGHT] — is handled by named partners we will name on request.',
        PAGE.m, 2140, { style: 'body', color: T.brownInk, width: 1000, name: 'TXT · Story paragraph 3', role: 'body' }),
      B.text('WHAT WE STAND FOR', 1310, 1660, { style: 'label', color: T.gold, name: 'TXT · Values label', role: 'eyebrow' }),
      ...numbered(1310, 1720, '01', 'Traceable sourcing', 'Every lot is tied to a grower, a region and a harvest window, so a claim can be checked rather than trusted.', { w: 1000 }),
      ...numbered(1310, 1920, '02', 'Graded to order', 'Size, count and moisture are agreed before packing, and the same specification is applied to every carton.', { w: 1000 }),
      ...numbered(1310, 2120, '03', 'Paperwork that clears', 'Invoices, packing lists and phytosanitary documentation are prepared with the shipment, not after it.', { w: 1000 }),
    ],
  });
  g.push({
    name: '06 · Milestones',
    blocks: [
      B.rect(PAGE.m, 2400, PAGE.contentW, 380, T.greenWash, { name: 'BG · Milestones panel' }),
      B.text('MILESTONES', PAGE.m + 50, 2450, { style: 'label', color: T.goldDeep, name: 'TXT · Milestones label', role: 'eyebrow' }),
      ...[0, 1, 2, 3].flatMap((i) => {
        const x = PAGE.m + 50 + i * 512;
        return [
          B.text('[YEAR]', x, 2510, { style: 'h3m', color: T.greenInk, name: `TXT · Milestone ${i + 1} year`, role: 'value' }),
          B.text([
            'Founded in [CITY] as [ORIGIN OF THE BUSINESS].',
            'First export shipment to [MARKET].',
            'New packing and grading facility in [CITY].',
            '[NEW MARKET, CAPACITY OR CERTIFICATION].',
          ][i], x, 2570, { style: 'bodySm', color: T.brownInk, width: 440, name: `TXT · Milestone ${i + 1}`, role: 'body' }),
        ];
      }),
    ],
  });
  g.push({
    name: '07 · Statement band',
    blocks: [
      B.rect(0, 2840, PAGE.w, PAGE.h - 2840, T.green, { name: 'BG · Statement band' }),
      B.image('market.jpg', 1640, 2840, 840, PAGE.h - 2840, { name: 'IMG · Date market' }),
      B.scrim(1640, 2840, 840, PAGE.h - 2840, [[0, C.green, 0.55], [1, C.green, 0.1]]),
      B.rect(PAGE.m, 2930, 120, 3, T.gold, { name: 'LINE · Statement rule' }),
      B.text('We would rather tell you what we do not know yet than let you find it out at the port.', PAGE.m, 2970, {
        style: 'h3m', color: C.cream, width: 1350, name: 'TXT · Statement', role: 'quote',
      }),
      B.text('— [FOUNDER / MANAGING DIRECTOR], [TITLE]', PAGE.m, 3170, {
        style: 'caption', color: T.onGreenSoft, name: 'TXT · Statement attribution', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P02', file: 'FARVAND_Catalog_P02_Our_Story', title: 'Our Story', groups: g });
}

/* ----------------------------------------------------------- 03 · THE RANGE (12 photo cards, dense) */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('THE RANGE', 3, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '02 — PRODUCT PORTFOLIO',
      title: 'The FARVAND Range',
      deck: 'Twelve export varieties from Iran’s date belt — from Bam and Kerman to Fars, Hormozgan, Sistan and Khuzestan. Each one has its own colour, texture and job on the shelf.',
      deckWidth: 1700,
    }),
  });
  g.push({
    name: '04 · Variety wall',
    blocks: VARIETIES.flatMap((v, i) => {
      const c = i % 3;
      const r = Math.floor(i / 3);
      const x = col(c, 3, 65, 2140);
      const y = 760 + r * 616;
      return [
        B.image(v.img, x, y, 670, 300, { name: `IMG · ${v.name}`, crop: v.crop }),
        B.rect(x, y + 312, 60, 2, T.gold, { name: `RULE · ${v.name}` }),
        B.text(v.name, x, y + 330, { style: 'h3m', color: T.greenInk, width: 670, name: `TXT · Card · ${v.name}`, role: 'value' }),
        B.text(v.type.toUpperCase(), x, y + 392, { style: 'label', color: T.goldDeep, name: `TXT · Card type · ${v.name}`, role: 'meta' }),
        B.text(`${v.originCity.toUpperCase()} · ${v.originProvince.toUpperCase()}`, x, y + 432, {
          style: 'label', color: T.brownSoft, width: 670, name: `TXT · Card origin · ${v.name}`, role: 'meta',
        }),
        B.text(v.note, x, y + 482, { style: 'bodySm', color: T.brownMid, width: 670, name: `TXT · Card note · ${v.name}`, role: 'body' }),
      ];
    }),
  });
  g.push({
    name: '05 · Footnote',
    blocks: [
      B.text(
        'Cultivar traits and growing regions are typical values that vary with season, irrigation and grade. Every FARVAND quotation states the confirmed origin of the lot being offered.',
        PAGE.m, 3236, { style: 'caption', color: T.brownSoft, width: 2100, name: 'TXT · Footnote', role: 'caption' }),
    ],
  });
  PAGES.push({ id: 'P03', file: 'FARVAND_Catalog_P03_The_Range', title: 'The Range', groups: g });
}

/* ---------------------------------------------------- 04/05 · FLAGSHIP PAGES (origin badge + big photo) */
function varietyPage({ id, file, pageNo, section, eyebrow, title, deck, img, photoRight, secondImg, originCity, originProvince, atGlance, specs, why, ctaTitle, ctaBody, photoCaption }) {
  const g = [];
  const px = photoRight ? 1400 : PAGE.m;            // main photo x
  const tx = photoRight ? PAGE.m : 1400;            // text column x
  const tw = 880;
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({
    name: '02 · Photography',
    blocks: [
      B.image(img, px, 700, 910, 1900, { name: `IMG · ${title}` }),
      B.image(secondImg, px, 2640, 910, 420, { name: 'IMG · Lifestyle' }),
    ],
  });
  g.push({ name: '03 · Furniture', blocks: B.furniture(section, pageNo, TOTAL) });
  g.push({ name: '04 · Headlines', blocks: B.titleBlock({ eyebrow, title, deck, deckWidth: 1380 }) });

  g.push({
    name: '05 · Origin and glance',
    blocks: [
      ...originBadge(tx, 700, tw, originCity, originProvince),
      B.text('AT A GLANCE', tx, 920, { style: 'label', color: T.gold, name: 'TXT · At a glance label', role: 'eyebrow' }),
      ...atGlance.flatMap((row, i) => {
        const y = 980 + i * 96;
        return [
          B.text(row[0], tx, y, { style: 'label', color: T.brownSoft, name: `TXT · ${row[0]} label`, role: 'table' }),
          B.text(row[1], tx + 300, y, { style: 'h4', color: T.greenInk, width: tw - 300, name: `TXT · ${row[0]} value`, role: 'table' }),
        ];
      }),
    ],
  });

  g.push({
    name: '06 · Specification',
    blocks: [
      B.text('SPECIFICATION', tx, 1560, { style: 'label', color: T.gold, name: 'TXT · Specification label', role: 'eyebrow' }),
      ...B.dataTable(tx, 1620, tw, specs, { status: true, rowH: 96, headStatus: 'STATUS', labelW: 300, statusW: 240 }),
    ],
  });

  g.push({
    name: '07 · Why buyers choose it',
    blocks: [
      B.text('WHY BUYERS CHOOSE IT', tx, 2160, { style: 'label', color: T.gold, name: 'TXT · Why label', role: 'eyebrow' }),
      ...why.flatMap((t, i) => [
        B.rect(tx, 2234 + i * 86, 10, 10, T.gold, { name: `BULLET · ${i + 1}` }),
        B.text(t, tx + 36, 2220 + i * 86, { style: 'bodySm', color: T.brownInk, width: tw - 36, name: `TXT · Why ${i + 1}`, role: 'body' }),
      ]),
    ],
  });

  g.push({
    name: '08 · Call to action',
    blocks: [
      B.rect(tx, 2540, tw, 420, T.green, { name: 'BG · CTA' }),
      B.rect(tx, 2540, 120, 3, T.gold, { name: 'LINE · CTA rule' }),
      B.text(ctaTitle, tx + 50, 2590, { style: 'h3m', color: C.cream, width: tw - 100, name: 'TXT · CTA title', role: 'title' }),
      B.text(ctaBody, tx + 50, 2660, { style: 'bodySm', color: T.onGreenSoft, width: tw - 100, name: 'TXT · CTA body', role: 'body' }),
      B.text('[CONTACT EMAIL]', tx + 50, 2850, { style: 'h4', color: T.gold, name: 'TXT · CTA contact', role: 'value' }),
    ],
  });
  g.push({
    name: '09 · Captions',
    blocks: [
      caption(photoCaption, tx, 3020, { width: tw, name: 'TXT · Photo caption' }),
      caption(`${title} — packed and graded for export.`, tx, 3060, { width: tw, name: 'TXT · Photo caption 2' }),
    ],
  });
  PAGES.push({ id, file, title, groups: g });
}

varietyPage({
  id: 'P04', file: 'FARVAND_Catalog_P04_Mazafati', pageNo: 4, section: 'PRODUCT · MAZAFATI',
  eyebrow: '03 — FLAGSHIP VARIETY', title: 'Mazafati',
  deck: 'The most requested Iranian date in the world. Dark, glossy, thin-skinned and naturally sweet — and the variety our buyers reorder most.',
  img: 'mazafati.jpg', photoRight: false, secondImg: 'tea.jpg',
  originCity: 'Bam', originProvince: 'Kerman — the home of Mazafati',
  photoCaption: 'Mazafati · Bam, Kerman · [SEASON] pack.',
  atGlance: [
    ['VARIETY', 'Mazafati'],
    ['TYPE', 'Soft (semi-moist)'],
    ['COLOUR', 'Dark brown to near-black'],
    ['SKIN', 'Thin and glossy'],
    ['CHARACTER', 'Naturally sweet, caramel-like'],
  ],
  specs: [
    { label: 'Grade / size', value: '[SIZE OR COUNT PER KG]', status: 'To be supplied' },
    { label: 'Moisture', value: '[MOISTURE % — ONLY IF LAB VERIFIED]', status: 'To be supplied' },
    { label: 'Packing', value: '[RETAIL PACK + BULK CARTON]', status: 'To be supplied' },
    { label: 'Shelf life', value: '[SHELF LIFE IN MONTHS]', status: 'To be supplied' },
  ],
  why: [
    'Consistent grading and count — the specification is agreed before packing, not after.',
    'The strongest repeat-demand variety in India, the Gulf and East Africa.',
    'Dense, dark fruit that keeps its retail look through the supply chain.',
  ],
  ctaTitle: 'Ready for a Mazafati quote?',
  ctaBody: 'Send us the pack format, the target quantity and the destination port. We will come back with a specification and an offer.',
});

varietyPage({
  id: 'P05', file: 'FARVAND_Catalog_P05_Medjoul', pageNo: 5, section: 'PRODUCT · MEDJOUL',
  eyebrow: '04 — PREMIUM VARIETY', title: 'Medjoul',
  deck: 'Large, amber-brown and very high in sugar. Medjoul is the gifting date of the range — larger fruit, higher value per kilo, tighter margins.',
  img: 'medjoul.jpg', photoRight: true, secondImg: 'giftbox.jpg',
  originCity: 'Bam & Saravan', originProvince: 'Kerman / Sistan & Baluchestan',
  photoCaption: 'Medjoul · Bam & Saravan · [SEASON] pack.',
  atGlance: [
    ['VARIETY', 'Medjoul (Medjool)'],
    ['TYPE', 'Soft'],
    ['COLOUR', 'Amber to deep brown'],
    ['SKIN', 'Thick and wrinkled'],
    ['CHARACTER', 'Very sweet, caramel and fig-like'],
  ],
  specs: [
    { label: 'Grade / size', value: '[COUNT PER KG: LARGE / EXTRA LARGE]', status: 'To be supplied' },
    { label: 'Moisture', value: '[MOISTURE % — ONLY IF LAB VERIFIED]', status: 'To be supplied' },
    { label: 'Packing', value: '[TRAY / CLAMSHELL / GIFT BOX]', status: 'To be supplied' },
    { label: 'Shelf life', value: '[SHELF LIFE IN MONTHS]', status: 'To be supplied' },
  ],
  why: [
    'The highest value per kilo in the range — priced for gifting and seasonal packs.',
    'Large, uniform fruit that presents well in clamshell and gift-box formats.',
    'Sorted by count so premium retail shelves get an even grade, not a mixed one.',
  ],
  ctaTitle: 'Ready for a Medjoul quote?',
  ctaBody: 'Tell us the grade, the pack and the quantity. We will confirm what the current harvest supports and quote from there.',
});

/* ------------------------------------------------ 06 · ZAHEDI & KIMRI + full-bleed dessert band */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('PRODUCT · ZAHEDI & KIMRI', 6, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '05 — TWO MORE STAPLES', title: 'Zahedi & Kimri',
      deck: 'One dry, one soft — and both in constant demand. Zahedi travels; Kimri sells by volume. Buyers often take them in the same order.',
      deckWidth: 1500,
    }),
  });
  const two = [
    {
      x: PAGE.m, v: V['Zahedi'], img: 'zahedi.jpg',
      note: 'Golden, wrinkled and firm, with a long shelf life and a nut-like bite. Zahedi is the workhorse for long-haul shipping and industrial buyers.',
      specs: [
        { label: 'Grade / size', value: '[SIZE OR COUNT PER KG]', status: 'To be supplied' },
        { label: 'Moisture', value: '[MOISTURE % — ONLY IF LAB VERIFIED]', status: 'To be supplied' },
        { label: 'Shelf life', value: '[SHELF LIFE IN MONTHS]', status: 'To be supplied' },
      ],
    },
    {
      x: 1310, v: V['Kimri'], img: 'kimri.jpg',
      note: 'Small, dark and intensely sweet, with a thin skin and a dense, uniform size. Kimri is the value pack of the range and the easiest to grade consistently.',
      specs: [
        { label: 'Grade / size', value: '[COUNT PER KG]', status: 'To be supplied' },
        { label: 'Moisture', value: '[MOISTURE % — ONLY IF LAB VERIFIED]', status: 'To be supplied' },
        { label: 'Shelf life', value: '[SHELF LIFE IN MONTHS]', status: 'To be supplied' },
      ],
    },
  ];
  g.push({
    name: '04 · Product columns',
    blocks: two.flatMap((p) => [
      B.image(p.img, p.x, 720, 1000, 560, { name: `IMG · ${p.v.name}` }),
      B.text(p.v.name, p.x, 1310, { style: 'h2', color: T.greenInk, name: `TXT · ${p.v.name} title`, role: 'title' }),
      B.text(p.v.type.toUpperCase(), p.x, 1390, { style: 'label', color: T.goldDeep, name: `TXT · ${p.v.name} type`, role: 'meta' }),
      ...originBadge(p.x + 330, 1300, 670, p.v.originCity, p.v.originProvince, { h: 150 }),
      B.text(p.note, p.x, 1500, { style: 'body', color: T.brownInk, width: 1000, name: `TXT · ${p.v.name} note`, role: 'body' }),
      B.text('SPECIFICATION', p.x, 1720, { style: 'label', color: T.gold, name: `TXT · ${p.v.name} spec label`, role: 'eyebrow' }),
      ...B.dataTable(p.x, 1780, 1000, p.specs, { status: true, rowH: 92, head: false, labelW: 300, statusW: 240 }),
    ]),
  });
  g.push({
    name: '05 · Dessert band',
    blocks: [
      B.image('dessert.jpg', 0, 2240, PAGE.w, PAGE.h - 2240, { name: 'IMG · Date dessert' }),
      B.scrim(0, 2240, PAGE.w, PAGE.h - 2240, [[0, '#120A05', 0.18], [0.55, '#120A05', 0.62], [1, '#120A05', 0.86]]),
      B.rect(PAGE.m, 2560, 120, 3, T.gold, { name: 'LINE · Band rule' }),
      B.text('Dates are not one product. They are a range.', PAGE.m, 2610, {
        style: 'h2', color: C.cream, width: 1600, name: 'TXT · Band statement', role: 'quote',
      }),
      B.text(
        'From the snack shelf to the dessert kitchen, each variety earns its place by what it does — not by what it costs per tonne.',
        PAGE.m, 2720, { style: 'body', color: T.onGreenSoft, width: 1300, name: 'TXT · Band body', role: 'body' }),
      ...['BAKERY & DESSERT', 'GIFTING', 'RETAIL SNACKING', 'FOOD MANUFACTURING'].flatMap((t, i) => {
        const w = [430, 220, 400, 470][i];
        const x = PAGE.m + [0, 490, 780, 1250][i];
        return [
          B.rect(x, 2920, w, 60, 'transparent', { stroke: T.gold, strokeWidth: 1, name: `CHIP · ${t}` }),
          B.text(t, x, 2937, { style: { ...T_.eyebrowSm, size: 18, tracking: 3.2 }, color: T.gold, align: 'center', width: w, name: `TXT · Chip · ${t}`, role: 'chip' }),
        ];
      }),
      caption('Serving suggestion — Zahedi and Kimri in the pastry kitchen.', PAGE.m, 3100, { color: T.onGreenFaint }),
    ],
  });
  PAGES.push({ id: 'P06', file: 'FARVAND_Catalog_P06_Zahedi_Kimri', title: 'Zahedi & Kimri', groups: g });
}

/* --------------------------------------------- 07 · FURTHER VARIETIES (8 more, photo cards + features) */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('PRODUCT · FURTHER VARIETIES', 7, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '06 — FURTHER VARIETIES', title: 'Shahani, Najafi, Lasht & Beyond',
      deck: 'Eight more Iranian cultivars for the mixed retail box, the processing line and the premium gift tray — each with its own growing region.',
      deckWidth: 1700,
    }),
  });

  const rowA = [V['Shahani'], V['Najafi'], V['Lasht'], V['Morki']];
  g.push({
    name: '04 · Four compact cards',
    blocks: rowA.flatMap((v, i) => {
      const x = col(i, 4, 56);
      return [
        B.image(v.img, x, 720, 490, 360, { name: `IMG · ${v.name}`, crop: v.crop }),
        B.text(v.name, x, 1110, { style: 'h3m', color: T.greenInk, name: `TXT · ${v.name} title`, role: 'value' }),
        B.text(v.type.toUpperCase(), x, 1170, { style: 'label', color: T.goldDeep, name: `TXT · ${v.name} type`, role: 'meta' }),
        B.text(`${v.originCity.toUpperCase()} · ${v.originProvince.toUpperCase()}`, x, 1210, {
          style: 'label', color: T.brownSoft, width: 490, name: `TXT · ${v.name} origin`, role: 'meta',
        }),
        B.text(v.note, x, 1260, { style: 'bodySm', color: T.brownMid, width: 490, name: `TXT · ${v.name} note`, role: 'body' }),
        B.text(v.use, x, 1390, { style: 'caption', color: T.brownSoft, width: 490, name: `TXT · ${v.name} use`, role: 'caption' }),
      ];
    }),
  });

  const features = [
    { v: V['Piarom'], img: 'piarom.jpg', y: 1520, extra: 'Known in export markets as the chocolate date — dark, chewy and lower in moisture than the soft varieties.' },
    { v: V['Harani'], img: 'tea.jpg', y: 2080, extra: 'A softer, sweeter table date that sells best in smaller packs aimed at gifting and hospitality.' },
  ];
  g.push({
    name: '05 · Feature panels',
    blocks: features.flatMap((f) => [
      B.image(f.img, PAGE.m, f.y, 1000, 500, { name: `IMG · ${f.v.name}`, crop: f.v.crop }),
      B.rect(1220, f.y, 6, 500, T.gold, { name: `LINE · ${f.v.name} accent` }),
      B.text(f.v.name, 1280, f.y + 10, { style: 'h2', color: T.greenInk, name: `TXT · ${f.v.name} title`, role: 'title' }),
      B.text(f.v.type.toUpperCase(), 1280, f.y + 92, { style: 'label', color: T.goldDeep, name: `TXT · ${f.v.name} type`, role: 'meta' }),
      ...originBadge(1280, f.y + 140, 1030, f.v.originCity, f.v.originProvince, { h: 150 }),
      B.text(f.v.note, 1280, f.y + 320, { style: 'bodySm', color: T.brownInk, width: 1030, name: `TXT · ${f.v.name} note`, role: 'body' }),
      B.text(f.extra, 1280, f.y + 420, { style: 'bodySm', color: T.brownMid, width: 1030, name: `TXT · ${f.v.name} extra`, role: 'body' }),
    ]),
  });

  const small = [V['Deglet en-Nour'], V['Barhi']];
  g.push({
    name: '06 · Two more',
    blocks: [
      ...small.flatMap((v, i) => {
        const x = col(i, 2, 65, 2140);
        return [
          B.image(v.img, x, 2640, 1035, 300, { name: `IMG · ${v.name}`, crop: v.crop }),
          B.text(v.name, x, 2970, { style: 'h3m', color: T.greenInk, name: `TXT · ${v.name} title`, role: 'value' }),
          B.text(`${v.type.toUpperCase()} · ${v.originCity.toUpperCase()}, ${v.originProvince.toUpperCase()}`, x + 430, 2984, {
            style: 'label', color: T.goldDeep, width: 610, name: `TXT · ${v.name} meta`, role: 'meta',
          }),
          B.text(v.note, x, 3030, { style: 'bodySm', color: T.brownMid, width: 1035, name: `TXT · ${v.name} note`, role: 'body' }),
        ];
      }),
      B.text('Availability of every variety depends on the harvest window — confirm before ordering.', PAGE.m, 3220, {
        style: 'caption', color: T.brownSoft, name: 'TXT · Availability note', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P07', file: 'FARVAND_Catalog_P07_Further_Varieties', title: 'Further Varieties', groups: g });
}

/* ------------------------------------------------------ 08 · COMPARISON + ORIGIN MAP */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('TECHNICAL SUMMARY', 8, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '07 — TECHNICAL SUMMARY', title: 'Variety Comparison & Origins',
      deck: 'A quick reference for buyers comparing the range — with the growing region of each cultivar. Values are typical figures; the quotation governs.',
      deckWidth: 1700,
    }),
  });
  const cols = [
    { title: 'VARIETY', x: 170, w: 360 },
    { title: 'TYPE', x: 560, w: 250 },
    { title: 'COLOUR', x: 840, w: 360 },
    { title: 'HARVEST REGION', x: 1230, w: 460 },
    { title: 'TYPICAL USE', x: 1720, w: 590 },
  ];
  g.push({
    name: '04 · Table',
    blocks: [
      B.rect(PAGE.m, 720, PAGE.contentW, 70, T.green, { name: 'BG · Table head' }),
      ...cols.map((c) => B.text(c.title, c.x + 10, 742, {
        style: 'label', color: C.cream, name: `TXT · Table head · ${c.title}`, role: 'table',
      })),
      ...VARIETIES.flatMap((v, r) => {
        const y = 830 + r * 126;
        const cells = [v.name, v.type, v.colour, `${v.originCity}, ${v.originProvince}`, v.use];
        return [
          ...(r % 2 === 1 ? [B.rect(PAGE.m, y - 22, PAGE.contentW, 116, T.greenWash, { name: `BG · Row ${r + 1}` })] : []),
          ...cells.map((t, i) => B.text(t, cols[i].x + 10, y, {
            style: i === 0 ? 'cellStrong' : 'cell',
            color: i === 0 ? T.greenInk : T.brownInk,
            width: cols[i].w - 20,
            name: `TXT · ${v.name} · ${cols[i].title}`, role: 'table',
          })),
        ];
      }),
    ],
  });
  g.push({
    name: '05 · Origin map',
    blocks: [
      B.rect(PAGE.m, 2420, PAGE.contentW, 860, T.green, { name: 'BG · Map panel' }),
      B.text('WHERE OUR DATES GROW', PAGE.m + 50, 2470, { style: 'label', color: T.gold, name: 'TXT · Map label', role: 'eyebrow' }),
      {
        type: 'map', id: 'map-iran', x: PAGE.m + 30, y: 2530, w: 1180, h: 700,
        labels: false,
      },
      ...[
        ['01', 'Bam & Kerman', 'Mazafati · Kimri · Medjoul · Shahani · Najafi'],
        ['02', 'Dashtestan & Kazerun, Fars', 'Zahedi · Lasht · Morki · Harani'],
        ['03', 'Hajiabad, Hormozgan', 'Piarom'],
        ['04', 'Saravan, Sistan & Baluchestan', 'Medjoul · Barhi · Najafi'],
        ['05', 'Abadan & Khorramshahr, Khuzestan', 'Deglet en-Nour'],
        ['06', 'Jiroft & Kahnoj, Kerman', 'Shahani · Najafi'],
        ['07', 'Jahrom, Fars', 'Harani'],
        ['08', 'Kerman city', 'Shahani'],
      ].flatMap((row, i) => {
        const y = 2548 + i * 92;
        return [
          B.text(row[0], 1420, y, { style: { ...T_.h4, size: 21 }, color: T.gold, name: `TXT · Map pin no ${row[0]}`, role: 'numeral' }),
          B.text(row[1], 1480, y, { style: 'h4', color: C.cream, width: 830, name: `TXT · Map region ${row[0]}`, role: 'value' }),
          B.text(row[2], 1480, y + 40, { style: 'caption', color: T.onGreenSoft, width: 830, name: `TXT · Map grows ${row[0]}`, role: 'caption' }),
        ];
      }),
      B.text('Typical growing regions of each cultivar. The confirmed origin of your lot is stated in the quotation.', PAGE.m + 50, 3250, {
        style: 'caption', color: T.onGreenFaint, width: 1200, name: 'TXT · Map footnote', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P08', file: 'FARVAND_Catalog_P08_Variety_Comparison', title: 'Variety Comparison & Origins', groups: g });
}

/* ----------------------------------------------------- 09 · QUALITY ASSURANCE */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('QUALITY', 9, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '08 — HOW WE WORK', title: 'Quality Assurance',
      deck: 'Six checkpoints stand between the grove and the container. Each one is recorded, and each one can be shown to a buyer or an inspector.',
      deckWidth: 1500,
    }),
  });
  g.push({
    name: '04 · Photography',
    blocks: [
      B.image('quality.jpg', PAGE.m, 700, 1340, 480, { name: 'IMG · Sorting line' }),
      B.image('crates.jpg', 1570, 700, 740, 480, { name: 'IMG · Harvest crates' }),
    ],
  });
  const steps = [
    ['01', 'Incoming inspection', 'Every incoming lot is checked for condition, colour and foreign matter before it enters the line. Findings are recorded per lot.'],
    ['02', 'Sorting and grading', 'Fruit is sorted by size, colour and condition. The grade agreed for the order is separated and rejected fruit leaves the line.'],
    ['03', 'Moisture and condition control', 'Moisture and condition are monitored where the variety requires it. Only lab-verified figures are quoted in the specification.'],
    ['04', 'Controlled packing', 'Packing happens under controlled conditions, with pack format, net weight and count set by the purchase order.'],
    ['05', 'Lot coding and traceability', 'Each carton carries a lot code that ties it back to its region, source, packing date and inspection record.'],
    ['06', 'Pre-shipment check', 'A final check on count, weight, carton condition and labelling runs before the container is closed and sealed.'],
  ];
  const numShift = measure('Hxg', T_.h4).ascent - measure('Hxg', T_.num).ascent;
  g.push({
    name: '05 · Process steps',
    blocks: steps.flatMap((s, i) => {
      const x = col(i % 2, 2, 80, 1900);
      const y = 1260 + Math.floor(i / 2) * 400;
      return [
        B.text(s[0], x, y + numShift, { style: 'num', color: T.gold, name: `TXT · Step ${s[0]} numeral`, role: 'numeral' }),
        B.text(s[1], x + 110, y, { style: 'h4', color: T.greenInk, name: `TXT · Step ${s[0]} title`, role: 'value' }),
        B.text(s[2], x + 110, y + 58, { style: 'bodySm', color: T.brownMid, width: 880, name: `TXT · Step ${s[0]} body`, role: 'body' }),
        B.rect(x, y + 250, 940, 1, T.rule, { name: `LINE · Step ${s[0]}` }),
      ];
    }),
  });
  g.push({
    name: '06 · Documents',
    blocks: [
      B.rect(PAGE.m, 2540, PAGE.contentW, 700, T.green, { name: 'BG · Documents panel' }),
      B.rect(PAGE.m, 2540, 120, 3, T.gold, { name: 'LINE · Documents rule' }),
      B.text('DOCUMENTS WE WORK WITH', PAGE.m + 60, 2590, { style: 'label', color: T.gold, name: 'TXT · Documents label', role: 'eyebrow' }),
      B.text(
        'The exact document set depends on the destination and the incoterm. The list below is the usual export pack — confirm the current requirement for your market with us.',
        PAGE.m + 60, 2640, { style: 'bodySm', color: T.onGreenSoft, width: 1000, name: 'TXT · Documents intro', role: 'body' }),
      ...[
        'Commercial invoice',
        'Packing list',
        'Phytosanitary certificate',
        'Certificate of origin',
        'Fumigation / treatment certificate',
        'Transport documents per incoterm',
      ].flatMap((d, i) => {
        const x = PAGE.m + 60 + (i % 3) * 680;
        const y = 2820 + Math.floor(i / 3) * 90;
        return [
          B.rect(x, y + 14, 8, 8, T.gold, { name: `BULLET · ${d}` }),
          B.text(d, x + 30, y, { style: 'bodySm', color: C.cream, width: 600, name: `TXT · Document · ${d}`, role: 'body' }),
        ];
      }),
      B.text('[EXPORT DOCUMENTS CONFIRMED PER DESTINATION]', PAGE.m + 60, 3050, {
        style: 'caption', color: T.onGreenFaint, name: 'TXT · Documents placeholder', role: 'caption',
      }),
      caption('Sorting and grading at [FACILITY NAME], [CITY] — [DESCRIBE THE LINE].', PAGE.m, 3280),
    ],
  });
  PAGES.push({ id: 'P09', file: 'FARVAND_Catalog_P09_Quality_Assurance', title: 'Quality Assurance', groups: g });
}

/* -------------------------------------------------------- 10 · PACKAGING */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('PACKAGING', 10, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '09 — HOW IT ARRIVES', title: 'Packaging Options',
      deck: 'Dates are fragile and moisture-sensitive. The pack format is chosen for the destination, the shelf and the retailer’s planogram — not for the factory that filled it.',
      deckWidth: 1700,
    }),
  });
  g.push({
    name: '04 · Photography',
    blocks: [
      B.image('packaging.jpg', PAGE.m, 700, 1040, 500, { name: 'IMG · Packaging still life' }),
      B.image('giftbox.jpg', 1240, 700, 520, 500, { name: 'IMG · Gift box' }),
      B.image('morki.jpg', 1790, 700, 520, 500, { name: 'IMG · Retail pack' }),
    ],
  });
  const formats = [
    ['Retail tray + film', 'Sealed tray over-wrap, stacked and cartonised.', [['Net weight', '[NET WEIGHT]'], ['Units per carton', '[UNITS]'], ['Carton size', '[L × W × H]']]],
    ['Clamshell box', 'Clear-lidded box for premium retail and gifting.', [['Net weight', '[NET WEIGHT]'], ['Units per carton', '[UNITS]'], ['Carton size', '[L × W × H]']]],
    ['Pouch / doypack', 'Stand-up pouch for value and high-volume retail.', [['Net weight', '[NET WEIGHT]'], ['Units per carton', '[UNITS]'], ['Carton size', '[L × W × H]']]],
  ];
  g.push({
    name: '05 · Retail formats',
    blocks: [
      ...formats.flatMap((f, i) => {
        const x = col(i, 3, 65, 2140);
        return [
          B.rect(x, 1280, 670, 560, T.greenWash, { name: `BG · Format ${i + 1}` }),
          B.rect(x, 1280, 90, 3, T.gold, { name: `LINE · Format ${i + 1}` }),
          B.text(f[0], x + 40, 1330, { style: 'h3m', color: T.greenInk, width: 590, name: `TXT · Format · ${f[0]}`, role: 'value' }),
          B.text(f[1], x + 40, 1390, { style: 'bodySm', color: T.brownMid, width: 590, name: `TXT · Format note · ${f[0]}`, role: 'body' }),
          ...f[2].flatMap((r, j) => [
            B.text(r[0], x + 40, 1500 + j * 96, { style: 'label', color: T.brownSoft, name: `TXT · ${f[0]} ${r[0]} label`, role: 'table' }),
            B.text(r[1], x + 40, 1540 + j * 96, { style: 'h4', color: T.goldDeep, width: 590, name: `TXT · ${f[0]} ${r[0]} value`, role: 'table' }),
          ]),
        ];
      }),
    ],
  });
  g.push({
    name: '06 · Bulk and private label',
    blocks: [
      B.text('BULK AND PRIVATE LABEL', PAGE.m, 1920, { style: 'label', color: T.gold, name: 'TXT · Bulk label', role: 'eyebrow' }),
      B.rect(PAGE.m, 1968, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Bulk rule' }),
      ...[
        ['Bulk carton', 'Standard export carton for wholesale buyers.', ['Net weight', '[NET WEIGHT]'], ['Units per carton', '[UNITS]'], ['Carton size', '[L × W × H]']],
        ['Private label', 'Your brand, our pack house.', ['Minimum run', '[MINIMUM RUN]'], ['Label artwork', '[BUYER ARTWORK]'], ['Lead time', '[LEAD TIME]']],
        ['Pallet & container', 'How the shipment is built.', ['Pallet size', '[PALLET SIZE]'], ['Container', '[20FT / 40FT / 40HC]'], ['Load plan', '[LOAD PLAN]']],
      ].flatMap((c, i) => {
        const x = col(i, 3, 65, 2140);
        return [
          B.text(c[0], x, 2020, { style: 'h3m', color: T.greenInk, name: `TXT · ${c[0]} title`, role: 'value' }),
          B.text(c[1], x, 2080, { style: 'bodySm', color: T.brownMid, width: 640, name: `TXT · ${c[0]} note`, role: 'body' }),
          ...c.slice(2).flatMap((r, j) => [
            B.text(r[0], x, 2160 + j * 66, { style: 'caption', color: T.brownSoft, name: `TXT · ${c[0]} ${r[0]} label`, role: 'table' }),
            B.text(r[1], x + 300, 2160 + j * 66, { style: 'caption', color: T.goldDeep, width: 360, name: `TXT · ${c[0]} ${r[0]} value`, role: 'table' }),
          ]),
        ];
      }),
    ],
  });
  g.push({
    name: '07 · Carton data table',
    blocks: [
      B.text('CARTON AND PALLET DATA', PAGE.m, 2420, { style: 'label', color: T.gold, name: 'TXT · Carton data label', role: 'eyebrow' }),
      ...B.dataTable(PAGE.m, 2480, PAGE.contentW, [
        { label: 'Standard export carton', value: '[L × W × H] · [NET WEIGHT] · [UNITS PER CARTON]', status: 'To be supplied' },
        { label: 'Retail carton', value: '[L × W × H] · [UNITS PER CARTON]', status: 'To be supplied' },
        { label: 'Pallet / container load', value: '[PALLET DIMENSIONS] · [20FT / 40FT / 40HC] · [PALLETS PER CONTAINER]', status: 'To be supplied' },
      ], { status: true, rowH: 92, head: false }),
    ],
  });
  g.push({
    name: '08 · How private label works',
    blocks: [
      B.rect(PAGE.m, 2900, PAGE.contentW, 380, T.green, { name: 'BG · Process band' }),
      B.rect(PAGE.m, 2900, 120, 3, T.gold, { name: 'LINE · Process rule' }),
      B.text('HOW A PRIVATE LABEL RUN WORKS', PAGE.m + 60, 2950, { style: 'label', color: T.gold, name: 'TXT · Process label', role: 'eyebrow' }),
      ...[
        ['01', 'Send artwork', 'Print-ready label files, or we propose a format you can adapt.'],
        ['02', 'Approve the proof', 'We print a physical proof for your sign-off before production.'],
        ['03', 'Production', 'Packing to your artwork, with the agreed net weight and count.'],
        ['04', 'Documents', 'Carton marks, labels and paperwork issued with the shipment.'],
      ].flatMap((st, i) => {
        const x = PAGE.m + 60 + i * 530;
        return [
          B.text(st[0], x, 3010, { style: 'h4', color: T.gold, name: `TXT · Process ${st[0]} numeral`, role: 'numeral' }),
          B.text(st[1], x + 56, 3010, { style: 'h4', color: C.cream, name: `TXT · Process ${st[0]} title`, role: 'value' }),
          B.text(st[2], x, 3060, { style: 'caption', color: T.onGreenSoft, width: 440, name: `TXT · Process ${st[0]} body`, role: 'body' }),
        ];
      }),
    ],
  });
  PAGES.push({ id: 'P10', file: 'FARVAND_Catalog_P10_Packaging', title: 'Packaging', groups: g });
}

/* ------------------------------------------------- 11 · EXPORT & LOGISTICS */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('EXPORT & LOGISTICS', 11, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '10 — COMMERCIAL TERMS', title: 'Export & Logistics',
      deck: 'The commercial terms are the part of a date business that decides whether an order works. Everything below is agreed in writing before production.',
      deckWidth: 1700,
    }),
  });
  const stats = [
    ['MINIMUM ORDER QUANTITY', '[MOQ]'],
    ['ANNUAL SUPPLY CAPACITY', '[CAPACITY] MT'],
    ['LEAD TIME', '[LEAD TIME]'],
    ['INCOTERMS', '[EXW / FOB / CIF]'],
    ['PORT OF LOADING', '[PORT OF LOADING]'],
    ['PAYMENT TERMS', '[PAYMENT TERMS]'],
    ['CONTAINER LOADING', '[20FT / 40FT / 40HC]'],
    ['SAMPLE POLICY', '[SAMPLE POLICY]'],
  ];
  g.push({
    name: '04 · Terms',
    blocks: stats.flatMap((s, i) => {
      const x = col(i % 4, 4, 56);
      const y = 700 + Math.floor(i / 4) * 300;
      return [
        B.rect(x, y, 430, 240, T.greenWash, { name: `BG · Stat ${i + 1}` }),
        B.rect(x, y, 430, 3, T.gold, { name: `LINE · Stat ${i + 1}` }),
        B.text(s[0], x + 24, y + 30, { style: 'label', color: T.goldDeep, width: 380, name: `TXT · Stat ${i + 1} label`, role: 'meta' }),
        B.text(s[1], x + 24, y + 84, { style: 'h3m', color: T.greenInk, width: 380, name: `TXT · Stat ${i + 1} value`, role: 'value' }),
        B.text('To be supplied', x + 24, y + 160, { style: 'caption', color: T.brownSoft, name: `TXT · Stat ${i + 1} status`, role: 'caption' }),
      ];
    }),
  });
  g.push({
    name: '05 · Photography',
    blocks: [
      B.image('logistics.jpg', PAGE.m, 1360, 1040, 500, { name: 'IMG · Port logistics' }),
      B.image('crates.jpg', 1240, 1360, 520, 500, { name: 'IMG · Harvest crates' }),
      B.image('market.jpg', 1790, 1360, 520, 500, { name: 'IMG · Date market' }),
    ],
  });
  g.push({
    name: '06 · Markets',
    blocks: [
      B.text('TARGET MARKETS', PAGE.m, 1920, { style: 'label', color: T.gold, name: 'TXT · Markets label', role: 'eyebrow' }),
      ...['India', '[MARKET 2]', '[MARKET 3]', '[MARKET 4]', '[MARKET 5]'].flatMap((m, i) => {
        const w = [260, 320, 320, 320, 320][i];
        const x = PAGE.m + [0, 320, 700, 1080, 1460][i];
        return [
          B.rect(x, 1970, w, 60, i === 0 ? T.green : 'transparent', { stroke: i === 0 ? undefined : T.ruleStrong, strokeWidth: 1, name: `CHIP · ${m}` }),
          B.text(m, x, 1988, { style: { ...T_.eyebrowSm, size: 19, tracking: 3.6 }, color: i === 0 ? C.cream : T.greenInk, align: 'center', width: w, name: `TXT · Chip · ${m}`, role: 'chip' }),
        ];
      }),
      B.text(
        'India is our priority market. We work with importers, wholesale distributors and retail chains — and we quote against the specification they already sell, not ours.',
        PAGE.m, 2080, { style: 'body', color: T.brownInk, width: 1100, name: 'TXT · Markets note', role: 'body' }),
      B.rect(1420, 2060, 890, 320, T.green, { name: 'BG · Shipping note' }),
      B.rect(1420, 2060, 4, 320, T.gold, { name: 'LINE · Shipping accent' }),
      B.text('SHIPPING & DOCUMENTS', 1470, 2110, { style: 'label', color: T.gold, name: 'TXT · Shipping label', role: 'eyebrow' }),
      B.text(
        'Every shipment is accompanied by the documents your customs broker asks for, issued before the container is sealed. [ADD: SHIPPING POLICY, INSURANCE, TEMPERATURE OR CARE REQUIREMENTS FOR SOFT DATES.]',
        1470, 2160, { style: 'bodySm', color: T.onGreenSoft, width: 800, name: 'TXT · Shipping note', role: 'body' }),
    ],
  });
  g.push({
    name: '07 · Ordering process',
    blocks: [
      B.text('HOW AN ORDER RUNS', PAGE.m, 2460, { style: 'label', color: T.gold, name: 'TXT · Process label', role: 'eyebrow' }),
      B.rect(PAGE.m, 2508, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Process rule' }),
      ...[
        ['01', 'Inquiry', 'Variety, pack, quantity and destination port.'],
        ['02', 'Specification & quotation', 'Grade, count, moisture and price, in writing.'],
        ['03', 'Production & packing', 'Sourcing, sorting, packing and lot coding.'],
        ['04', 'Documents & shipment', 'Export papers issued, container sealed, vessel loaded.'],
      ].flatMap((st, i) => {
        const x = col(i, 4, 56);
        return [
          B.text(st[0], x, 2550, { style: 'h4', color: T.gold, name: `TXT · Process ${st[0]} numeral`, role: 'numeral' }),
          B.text(st[1], x + 56, 2550, { style: 'h4', color: T.greenInk, name: `TXT · Process ${st[0]} title`, role: 'value' }),
          B.text(st[2], x, 2606, { style: 'caption', color: T.brownMid, width: 430, name: `TXT · Process ${st[0]} body`, role: 'body' }),
        ];
      }),
    ],
  });
  g.push({
    name: '08 · Closing band',
    blocks: [
      B.rect(0, 2740, PAGE.w, PAGE.h - 2740, T.green, { name: 'BG · Closing band' }),
      B.image('market.jpg', 1640, 2740, 840, PAGE.h - 2740, { name: 'IMG · Market band' }),
      B.scrim(1640, 2740, 840, PAGE.h - 2740, [[0, C.green, 0.55], [1, C.green, 0.1]]),
      B.rect(PAGE.m, 2830, 120, 3, T.gold, { name: 'LINE · Band rule' }),
      B.text('Serving buyers in India and beyond.', PAGE.m, 2880, {
        style: 'h2', color: C.cream, width: 1350, name: 'TXT · Band statement', role: 'quote',
      }),
      B.text(
        'Terms shown in brackets are agreed with the buyer before order confirmation. We do not publish figures we cannot honour — the quotation is the commitment, and it is written to be kept.',
        PAGE.m, 3000, { style: 'bodySm', color: T.onGreenSoft, width: 1350, name: 'TXT · Terms note', role: 'body' }),
    ],
  });
  PAGES.push({ id: 'P11', file: 'FARVAND_Catalog_P11_Export_Logistics', title: 'Export & Logistics', groups: g });
}

/* --------------------------------------------------------- 12 · CONTACT */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, T.green, { name: 'BG · Page' })] });
  g.push({
    name: '02 · Brand',
    blocks: [
      B.image('mark.png', PAGE.m, 150, 92, 92, { name: 'LOGO · Compass mark' }),
      B.text('FARVAND', PAGE.m + 124, 158, {
        style: { ...T_.h3m, size: 46, lineHeight: 54, tracking: 9 }, color: C.cream,
        name: 'TXT · Wordmark', role: 'brand',
      }),
      B.text('Premium Iranian Dates', PAGE.m + 126, 218, {
        style: { ...T_.eyebrowSm, size: 17, tracking: 4.4 }, color: T.gold,
        name: 'TXT · Wordmark descriptor', role: 'brand',
      }),
    ],
  });
  g.push({
    name: '03 · Headline',
    blocks: [
      B.text('11 — NEXT STEP', PAGE.m, 560, { style: 'eyebrow', color: T.gold, name: 'TXT · Eyebrow', role: 'eyebrow' }),
      B.text('Request a Quotation', PAGE.m, 630, { style: 'displayL', color: C.cream, width: 1800, name: 'TXT · Page title', role: 'title' }),
      B.rect(PAGE.m, 800, 120, 3, T.gold, { name: 'LINE · Title rule' }),
      B.text(
        'Tell us the variety, the pack format, the quantity and the destination port. We will reply with a specification and an offer — and with anything we cannot do this season stated plainly.',
        PAGE.m, 870, { style: 'body', color: T.onGreenSoft, width: 1150, name: 'TXT · Deck', role: 'deck' }),
    ],
  });
  g.push({
    name: '04 · Contact details',
    blocks: [
      ...[
        ['EMAIL', '[CONTACT EMAIL]'],
        ['WHATSAPP', '[WHATSAPP NUMBER]'],
        ['WEBSITE', '[WEBSITE]'],
        ['OFFICE', '[COMPANY LEGAL NAME]'],
        ['ADDRESS', '[STREET, CITY, POSTAL CODE, COUNTRY]'],
        ['HOURS', '[WORKING HOURS · TIME ZONE]'],
      ].flatMap((r, i) => {
        const x = col(i % 3, 3, 64);
        const y = 1180 + Math.floor(i / 3) * 210;
        return [
          B.rect(x, y, 600, 1, T.onGreenFaint, { name: `LINE · Contact ${i + 1}` }),
          B.text(r[0], x, y + 26, { style: 'label', color: T.gold, name: `TXT · Contact ${i + 1} label`, role: 'meta' }),
          B.text(r[1], x, y + 72, { style: 'h4', color: C.cream, width: 620, name: `TXT · Contact ${i + 1} value`, role: 'value' }),
        ];
      }),
    ],
  });
  g.push({
    name: '05 · Checklist and QR',
    blocks: [
      B.rect(PAGE.m, 1640, 1080, 700, T.greenDeep, { name: 'BG · Checklist panel' }),
      B.rect(PAGE.m, 1640, 120, 3, T.gold, { name: 'LINE · Checklist rule' }),
      B.text('WHAT TO INCLUDE', PAGE.m + 60, 1690, { style: 'label', color: T.gold, name: 'TXT · Checklist label', role: 'eyebrow' }),
      ...[
        'Variety and grade, or the shelf you are filling',
        'Pack format and net weight',
        'Quantity, in cartons or tonnes',
        'Destination port and incoterm',
        'Target delivery date',
      ].flatMap((t, i) => [
        B.rect(PAGE.m + 60, 1778 + i * 96 + 14, 8, 8, T.gold, { name: `BULLET · Checklist ${i + 1}` }),
        B.text(t, PAGE.m + 96, 1778 + i * 96, { style: 'bodySm', color: C.cream, width: 900, name: `TXT · Checklist ${i + 1}`, role: 'body' }),
      ]),
      B.rect(1420, 1640, 890, 700, 'transparent', { stroke: T.gold, strokeWidth: 1, name: 'FRAME · QR placeholder' }),
      B.text('SCAN FOR THE FULL RANGE', 1420, 1740, { style: 'label', color: T.gold, align: 'center', width: 890, name: 'TXT · QR label', role: 'meta' }),
      B.rect(1605, 1810, 320, 320, 'transparent', { stroke: T.onGreenFaint, strokeWidth: 1, name: 'FRAME · QR code area' }),
      B.text('[QR CODE]', 1605, 1950, { style: 'label', color: T.onGreenSoft, align: 'center', width: 320, name: 'TXT · QR placeholder', role: 'caption' }),
      B.text('[WEBSITE]', 1420, 2180, { style: 'h4', color: C.cream, align: 'center', width: 890, name: 'TXT · QR website', role: 'value' }),
    ],
  });
  g.push({
    name: '06 · Photo strip',
    blocks: [
      B.image('tea.jpg', PAGE.m, 2420, 660, 380, { name: 'IMG · Tea and dates' }),
      B.image('dessert.jpg', 910, 2420, 660, 380, { name: 'IMG · Dessert' }),
      B.image('giftbox.jpg', 1650, 2420, 660, 380, { name: 'IMG · Gift box' }),
    ],
  });
  g.push({
    name: '07 · QR and closing',
    blocks: [
      B.rect(0, 2880, PAGE.w, PAGE.h - 2880, T.greenDeep, { name: 'BG · Closing band' }),
      B.rect(PAGE.m, 2950, 120, 3, T.gold, { name: 'LINE · Closing band rule' }),
      B.text('FARVAND', PAGE.m, 3000, {
        style: { ...T_.h2, size: 72, lineHeight: 84, tracking: 12 }, color: C.cream,
        name: 'TXT · Closing wordmark', role: 'brand',
      }),
      B.text('Premium Iranian Dates · Export catalogue · [YEAR]', PAGE.m, 3120, {
        style: 'eyebrowSm', color: T.gold, name: 'TXT · Closing band descriptor', role: 'brand',
      }),
      B.text('Thank you for considering FARVAND.', PAGE.m + PAGE.contentW - 1300, 3000, {
        style: 'h3m', color: C.cream, align: 'right', width: 1300, name: 'TXT · Closing thanks', role: 'title',
      }),
      B.text('[CONTACT EMAIL]   ·   [WHATSAPP NUMBER]   ·   [WEBSITE]', PAGE.m + PAGE.contentW - 1300, 3070, {
        style: 'h4', color: T.gold, align: 'right', width: 1300, name: 'TXT · Closing band contact', role: 'value',
      }),
      B.text('Kind regards, the FARVAND team — [CITY], [COUNTRY]', PAGE.m + PAGE.contentW - 1300, 3130, {
        style: 'caption', color: T.onGreenSoft, align: 'right', width: 1300, name: 'TXT · Closing band sign-off', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P12', file: 'FARVAND_Catalog_P12_Contact', title: 'Contact', groups: g });
}

module.exports = { PAGES, VARIETIES, TOTAL };
