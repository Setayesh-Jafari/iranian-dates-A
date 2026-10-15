/**
 * FARVAND — B2B Export Catalog, page content model.
 * 12 pages · A4 portrait · 2480 x 3508 px @ 300 dpi.
 *
 * Content rule: cultivar traits are general, publicly known characteristics
 * and are labelled as typical. Everything specific to FARVAND is an explicit
 * [PLACEHOLDER] so the buyer can fill it with verified information.
 */
const { C, T, PAGE, T_ } = require('./theme');
const B = require('./blocks');
const { measure } = require('./lib');

const TOTAL = 12;

/* --------------------------------------------------------------- varieties */
const VARIETIES = [
  {
    name: 'Mazafati', type: 'Soft', img: 'mazafati.jpg',
    note: 'Dark, glossy and thin-skinned — the benchmark soft date of Iran and the variety buyers reorder most.',
    colour: 'Dark brown to near-black', skin: 'Thin and glossy',
    use: 'Retail packs, gifting, food manufacturing',
  },
  {
    name: 'Medjoul', type: 'Soft', img: 'medjoul.jpg',
    note: 'Large, caramel-brown and very high in sugar. The premium gifting date of the range.',
    colour: 'Amber to deep brown', skin: 'Thick and wrinkled',
    use: 'Premium gifting, retail, seasonal gift packs',
  },
  {
    name: 'Zahedi', type: 'Semi-dry', img: 'zahedi.jpg',
    note: 'Golden, wrinkled and firm with a long shelf life. The safe choice for long-haul shipping.',
    colour: 'Light golden brown', skin: 'Dry and wrinkled',
    use: 'Long-haul shipping, bulk, cooking and processing',
  },
  {
    name: 'Kimri', type: 'Soft', img: 'kimri.jpg',
    note: 'Small, dark and intensely sweet. Packs densely, so carton cost per kilo stays competitive.',
    colour: 'Dark brown', skin: 'Thin and smooth',
    use: 'Retail pouches, value packs, high-volume orders',
  },
  {
    name: 'Shahani', type: 'Semi-soft', img: null,
    note: 'Mid-size amber fruit with a delicate, tender skin and a clean, mild sweetness.',
    colour: 'Light amber brown', skin: 'Smooth and fine',
    use: 'Retail trays, bakery and dessert supply',
  },
  {
    name: 'Najafi', type: 'Soft', img: null,
    note: 'Round, very dark and soft. A traditional Najaf cultivar with a loyal regional following.',
    colour: 'Dark brown to black', skin: 'Thin',
    use: 'Retail, traditional food processing',
  },
  {
    name: 'Lasht', type: 'Semi-dry', img: null,
    note: 'Brown, wrinkled and firm — the workhorse of Iranian cooking and industrial processing.',
    colour: 'Medium brown', skin: 'Firm and wrinkled',
    use: 'Bulk shipments, industrial processing, cooking',
  },
  {
    name: 'Morki', type: 'Semi-dry', img: null,
    note: 'Light brown and moderately dry, with a firm bite that holds well in a mixed gift box.',
    colour: 'Light to medium brown', skin: 'Smooth to lightly wrinkled',
    use: 'Gift boxes, retail, catering and hospitality',
  },
  {
    name: 'Deglet en-Nour', type: 'Semi-dry', img: null,
    note: 'Pale amber with a mild, honeyed flavour and a light skin that eats easily.',
    colour: 'Pale golden brown', skin: 'Lightly wrinkled',
    use: 'Mixed retail boxes, bakery and confectionery supply',
  },
  {
    name: 'Barhi', type: 'Soft', img: null,
    note: 'Round, soft and mild, with low fibre — a straightforward snacking date.',
    colour: 'Golden brown', skin: 'Smooth',
    use: 'Retail snacking, food manufacturing',
  },
  {
    name: 'Harani (Sukkari)', type: 'Soft', img: null,
    note: 'Soft, amber and very sweet. A premium soft date sold in smaller, higher-value packs.',
    colour: 'Amber brown', skin: 'Thin and glossy',
    use: 'Premium retail and corporate gifting',
  },
  {
    name: 'Piarom', type: 'Semi-dry', img: null,
    note: 'Small, dark, dry and chewy — the date most often described as the chocolate date.',
    colour: 'Deep brown to black', skin: 'Dry and wrinkled',
    use: 'Snacking, premium bulk, gifting',
  },
];

/* ------------------------------------------------------------------ helpers */
const col = (i, n, gap = 64, width = PAGE.contentW) => PAGE.m + (width - gap * (n - 1)) / n * i + gap * i;

/** Small gold-outlined chip with a label. */
function chip(x, y, label, w) {
  const h = 56;
  return [
    B.rect(x, y, w, h, 'transparent', { stroke: T.gold, strokeWidth: 1, name: `CHIP · ${label}` }),
    B.text(label, x, y + 15, {
      style: { ...T_.eyebrowSm, size: 18, tracking: 3.2 }, color: T.goldDeep, align: 'center', width: w,
      name: `TXT · Chip · ${label}`, role: 'chip',
    }),
  ];
}

/** Numbered value block (used on the story and quality pages). */
function numbered(x, y, num, title, body, opts = {}) {
  const w = opts.w || 880;
  // align the big numeral's baseline with the title's baseline
  const numShift = measure('Hxg', T_.h4).ascent - measure('Hxg', T_.num).ascent;
  return [
    B.text(num, x, y + numShift, { style: 'num', color: T.gold, name: `TXT · Numeral · ${num}`, role: 'numeral' }),
    B.text(title, x + 110, y, { style: 'h4', color: T.greenInk, name: `TXT · Value · ${title}`, role: 'value' }),
    B.text(body, x + 110, y + 52, {
      style: 'bodySm', color: T.brownMid, width: w - 110,
      name: `TXT · Value body · ${title}`, role: 'value',
    }),
  ];
}

/* ================================================================== PAGES */
const PAGES = [];

/* ------------------------------------------------------------- 01 · COVER */
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

/* ---------------------------------------------------------- 02 · OUR STORY */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Photography', blocks: [B.image('story_palm.jpg', PAGE.m, 760, 1060, 1420)] });
  g.push({
    name: '03 · Furniture',
    blocks: B.furniture('OUR STORY', 2, TOTAL),
  });
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
        1330, 760, { style: 'body', color: T.brownInk, width: 980, name: 'TXT · Story paragraph 1', role: 'body' }),
      B.text(
        'Today we work with [GROWER PARTNERS / OWNED ORCHARDS] across [REGIONS] to bring together the varieties buyers reorder — soft Mazafati and Medjoul for retail, drier Zahedi and Lasht for long-haul shipping — and we pack them to the standard each market expects.',
        1330, 1030, { style: 'body', color: T.brownInk, width: 980, name: 'TXT · Story paragraph 2', role: 'body' }),
      B.text(
        'Our own operation covers [SCOPE: SOURCING / PROCESSING / PACKING / SHIPPING]. Everything outside that — [LAB TESTING, CERTIFICATION, FREIGHT] — is handled by named partners we will name on request.',
        1330, 1290, { style: 'body', color: T.brownInk, width: 980, name: 'TXT · Story paragraph 3', role: 'body' }),
      B.text('WHAT WE STAND FOR', 1330, 1530, { style: 'label', color: T.gold, name: 'TXT · Values label', role: 'eyebrow' }),
      ...numbered(1330, 1600, '01', 'Traceable sourcing', 'Every lot is tied to a grower and a harvest window, so a claim can be checked rather than trusted.', { w: 980 }),
      ...numbered(1330, 1800, '02', 'Graded to order', 'Size, count and moisture are agreed before packing, and the same specification is applied to every carton in the order.', { w: 980 }),
      ...numbered(1330, 2000, '03', 'Paperwork that clears', 'Invoices, packing lists and phytosanitary documentation are prepared with the shipment, not after it.', { w: 980 }),
      B.text('Date palms in [GROWING REGION], [PROVINCE] — [HARVEST SEASON].', PAGE.m, 2230, {
        style: 'caption', color: T.brownMid, name: 'TXT · Photo caption', role: 'caption',
      }),
    ],
  });
  g.push({
    name: '06 · Milestones',
    blocks: [
      B.text('MILESTONES', PAGE.m, 2450, { style: 'label', color: T.gold, name: 'TXT · Milestones label', role: 'eyebrow' }),
      B.rect(PAGE.m, 2498, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Milestones rule' }),
      ...[0, 1, 2, 3].flatMap((i) => {
        const x = col(i, 4, 56);
        return [
          B.text('[YEAR]', x, 2540, { style: 'h3m', color: T.goldDeep, name: `TXT · Milestone ${i + 1} year`, role: 'value' }),
          B.text([
            'Founded in [CITY] as [ORIGIN OF THE BUSINESS].',
            'First export shipment to [MARKET].',
            'New packing and grading facility in [CITY].',
            '[NEW MARKET, CAPACITY OR CERTIFICATION].',
          ][i], x, 2600, { style: 'bodySm', color: T.brownMid, width: 440, name: `TXT · Milestone ${i + 1}`, role: 'body' }),
        ];
      }),
    ],
  });
  g.push({
    name: '07 · Statement band',
    blocks: [
      B.rect(0, 2960, PAGE.w, 330, T.green, { name: 'BG · Statement band' }),
      B.rect(PAGE.m, 3020, 120, 3, T.gold, { name: 'LINE · Statement rule' }),
      B.text('We would rather tell you what we do not know yet than let you find it out at the port.', PAGE.m, 3060, {
        style: 'h3m', color: C.cream, width: 1750, name: 'TXT · Statement', role: 'quote',
      }),
      B.text('— [FOUNDER / MANAGING DIRECTOR], [TITLE]', PAGE.m, 3190, {
        style: 'caption', color: T.onGreenSoft, name: 'TXT · Statement attribution', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P02', file: 'FARVAND_Catalog_P02_Our_Story', title: 'Our Story', groups: g });
}

/* ----------------------------------------------------------- 03 · THE RANGE */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('THE RANGE', 3, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '02 — PRODUCT PORTFOLIO',
      title: 'The FARVAND Range',
      deck: 'Iran is the world’s largest producer of dates, and the varieties are not interchangeable: they differ in moisture, colour, size and the way they behave in a carton. These are the varieties we source and export.',
      deckWidth: 1560,
    }),
  });
  g.push({
    name: '04 · Variety cards',
    blocks: VARIETIES.flatMap((v, i) => {
      const c = i % 3;
      const r = Math.floor(i / 3);
      const x = col(c, 3, 64);
      const y = 800 + r * 372;
      return [
        B.rect(x, y, 64, 2, T.gold, { name: `RULE · ${v.name}` }),
        B.text(v.name, x, y + 34, { style: 'h3m', color: T.greenInk, width: 600, name: `TXT · Card · ${v.name}`, role: 'value' }),
        B.text(v.type, x, y + 100, { style: 'label', color: T.goldDeep, name: `TXT · Card type · ${v.name}`, role: 'meta' }),
        B.text(v.note, x, y + 148, { style: 'bodySm', color: T.brownMid, width: 600, name: `TXT · Card note · ${v.name}`, role: 'body' }),
        B.text(v.use, x, y + 272, { style: 'caption', color: T.brownSoft, width: 600, name: `TXT · Card use · ${v.name}`, role: 'caption' }),
      ];
    }),
  });
  g.push({
    name: '05 · Advice panel',
    blocks: [
      B.rect(PAGE.m, 2340, PAGE.contentW, 300, T.green, { name: 'BG · Advice panel' }),
      B.text('Not sure which variety fits your market?', PAGE.m + 60, 2390, {
        style: 'h3m', color: C.cream, name: 'TXT · Advice title', role: 'title',
      }),
      B.text(
        'Tell us the variety, the pack and the destination port. We will confirm what we can source this season, what we cannot, and what the specification would be — before you ask for a price.',
        PAGE.m + 60, 2460, { style: 'bodySm', color: T.onGreenSoft, width: 1180, name: 'TXT · Advice body', role: 'body' }),
      B.text('[CONTACT EMAIL]', PAGE.m + PAGE.contentW - 760, 2400, {
        style: 'h3m', color: T.gold, align: 'right', width: 700, name: 'TXT · Advice contact', role: 'value',
      }),
      B.text('We reply within [RESPONSE TIME] on working days.', PAGE.m + PAGE.contentW - 760, 2470, {
        style: 'caption', color: T.onGreenSoft, align: 'right', width: 700, name: 'TXT · Advice contact note', role: 'caption',
      }),
    ],
  });
  g.push({
    name: '06 · Footnote',
    blocks: [
      B.text(
        'Cultivar traits shown are typical industry values and vary with growing season, region and grade. Confirm the current-season specification with FARVAND before ordering. Availability of each variety depends on the harvest window.',
        PAGE.m, 2720, { style: 'caption', color: T.brownSoft, width: 1800, name: 'TXT · Footnote', role: 'caption' }),
    ],
  });
  PAGES.push({ id: 'P03', file: 'FARVAND_Catalog_P03_The_Range', title: 'The Range', groups: g });
}

/* ---------------------------------------------------- 04/05 · FLAGSHIP PAGES */
function varietyPage({ id, file, pageNo, section, eyebrow, title, deck, img, caption, atGlance, specs, why, ctaTitle, ctaBody }) {
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Photography', blocks: [B.image(img, PAGE.m, 780, 1120, 1620)] });
  g.push({ name: '03 · Furniture', blocks: B.furniture(section, pageNo, TOTAL) });
  g.push({ name: '04 · Headlines', blocks: B.titleBlock({ eyebrow, title, deck, deckWidth: 1380 }) });

  g.push({
    name: '05 · At a glance',
    blocks: [
      B.text('AT A GLANCE', 1400, 780, { style: 'label', color: T.gold, name: 'TXT · At a glance label', role: 'eyebrow' }),
      ...atGlance.flatMap((row, i) => {
        const y = 840 + i * 116;
        return [
          B.text(row[0], 1400, y, { style: 'label', color: T.brownSoft, name: `TXT · ${row[0]} label`, role: 'table' }),
          B.text(row[1], 1400, y + 38, { style: 'h4', color: T.greenInk, width: 880, name: `TXT · ${row[0]} value`, role: 'table' }),
        ];
      }),
    ],
  });

  g.push({
    name: '06 · Specification',
    blocks: [
      B.text('SPECIFICATION', 1400, 1580, { style: 'label', color: T.gold, name: 'TXT · Specification label', role: 'eyebrow' }),
      ...B.dataTable(1400, 1620, 880, specs, { status: true, rowH: 96, headStatus: 'STATUS', labelW: 290, statusW: 240 }),
    ],
  });

  g.push({
    name: '07 · Why buyers choose it',
    blocks: [
      B.text('WHY BUYERS CHOOSE IT', PAGE.m, 2520, { style: 'label', color: T.gold, name: 'TXT · Why label', role: 'eyebrow' }),
      ...why.flatMap((t, i) => [
        B.rect(PAGE.m, 2594 + i * 92, 10, 10, T.gold, { name: `BULLET · ${i + 1}` }),
        B.text(t, PAGE.m + 36, 2580 + i * 92, { style: 'bodySm', color: T.brownInk, width: 1060, name: `TXT · Why ${i + 1}`, role: 'body' }),
      ]),
      B.text(caption, PAGE.m, 2430, { style: 'caption', color: T.brownMid, name: 'TXT · Photo caption', role: 'caption' }),
    ],
  });

  g.push({
    name: '08 · Call to action',
    blocks: [
      B.rect(1400, 2060, 880, 350, T.green, { name: 'BG · CTA' }),
      B.rect(1400, 2060, 120, 3, T.gold, { name: 'LINE · CTA rule' }),
      B.text(ctaTitle, 1460, 2110, { style: 'h3m', color: C.cream, width: 760, name: 'TXT · CTA title', role: 'title' }),
      B.text(ctaBody, 1460, 2180, { style: 'bodySm', color: T.onGreenSoft, width: 760, name: 'TXT · CTA body', role: 'body' }),
      B.text('[CONTACT EMAIL]', 1460, 2318, { style: 'h4', color: T.gold, name: 'TXT · CTA contact', role: 'value' }),
      B.text('PACKING SNAPSHOT', 1400, 2500, { style: 'label', color: T.gold, name: 'TXT · Packing snapshot label', role: 'eyebrow' }),
      ...B.dataTable(1400, 2560, 880, [
        { label: 'Retail pack', value: '[PACK TYPE] · [NET WEIGHT]', status: 'To be supplied' },
        { label: 'Bulk carton', value: '[NET WEIGHT] · [UNITS]', status: 'To be supplied' },
        { label: 'Carton size', value: '[L × W × H]', status: 'To be supplied' },
      ], { status: true, rowH: 96, head: false, labelW: 290, statusW: 240 }),
    ],
  });
  PAGES.push({ id, file, title, groups: g });
}

varietyPage({
  id: 'P04', file: 'FARVAND_Catalog_P04_Mazafati', pageNo: 4, section: 'PRODUCT · MAZAFATI',
  eyebrow: '03 — FLAGSHIP VARIETY', title: 'Mazafati',
  deck: 'The most requested Iranian date in the world. Dark, glossy, thin-skinned and naturally sweet — and the variety our buyers reorder most.',
  img: 'mazafati.jpg',
  caption: 'Mazafati · [GROWING REGION], Iran · [SEASON] pack.',
  atGlance: [
    ['VARIETY', 'Mazafati'],
    ['TYPE', 'Soft (semi-moist)'],
    ['ORIGIN', '[GROWING REGION], Iran'],
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
  img: 'medjoul.jpg',
  caption: 'Medjoul · [GROWING REGION], Iran · [SEASON] pack.',
  atGlance: [
    ['VARIETY', 'Medjoul (Medjool)'],
    ['TYPE', 'Soft'],
    ['ORIGIN', '[GROWING REGION], Iran'],
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

/* ------------------------------------------------ 06 · ZAHEDI & KIMRI */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Photography', blocks: [B.image('zahedi.jpg', PAGE.m, 780, 1000, 900), B.image('kimri.jpg', 1310, 780, 1000, 900)] });
  g.push({ name: '03 · Furniture', blocks: B.furniture('PRODUCT · ZAHEDI & KIMRI', 6, TOTAL) });
  g.push({
    name: '04 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '05 — TWO MORE STAPLES', title: 'Zahedi & Kimri',
      deck: 'One dry, one soft — and both in constant demand. Zahedi travels; Kimri sells by volume. Buyers often take them in the same order.',
      deckWidth: 1500,
    }),
  });
  const two = [
    {
      x: PAGE.m, name: 'Zahedi', img: 'zahedi.jpg', type: 'Semi-dry',
      note: 'Golden, wrinkled and firm, with a long shelf life and a nut-like bite. Zahedi is the workhorse for long-haul shipping and industrial buyers.',
      rows: [['TYPE', 'Semi-dry'], ['COLOUR', 'Light golden brown'], ['SKIN', 'Dry and wrinkled'], ['CHARACTER', 'Mildly sweet, firm, nutty']],
      specs: [
        { label: 'Grade / size', value: '[SIZE OR COUNT PER KG]', status: 'To be supplied' },
        { label: 'Moisture', value: '[MOISTURE % — ONLY IF LAB VERIFIED]', status: 'To be supplied' },
        { label: 'Packing', value: '[RETAIL PACK + BULK CARTON]', status: 'To be supplied' },
        { label: 'Shelf life', value: '[SHELF LIFE IN MONTHS]', status: 'To be supplied' },
      ],
      caption: 'Zahedi · [GROWING REGION], Iran · [SEASON] pack.',
    },
    {
      x: 1310, name: 'Kimri', img: 'kimri.jpg', type: 'Soft',
      note: 'Small, dark and intensely sweet, with a thin skin and a dense, uniform size. Kimri is the value pack of the range and the easiest to grade consistently.',
      rows: [['TYPE', 'Soft'], ['COLOUR', 'Dark brown'], ['SKIN', 'Thin and smooth'], ['CHARACTER', 'Very sweet, dense, chewy']],
      specs: [
        { label: 'Grade / size', value: '[COUNT PER KG]', status: 'To be supplied' },
        { label: 'Moisture', value: '[MOISTURE % — ONLY IF LAB VERIFIED]', status: 'To be supplied' },
        { label: 'Packing', value: '[POUCH / TRAY + BULK CARTON]', status: 'To be supplied' },
        { label: 'Shelf life', value: '[SHELF LIFE IN MONTHS]', status: 'To be supplied' },
      ],
      caption: 'Kimri · [GROWING REGION], Iran · [SEASON] pack.',
    },
  ];
  g.push({
    name: '05 · Product columns',
    blocks: two.flatMap((p) => [
      B.text(p.name, p.x, 1760, { style: 'h2', color: T.greenInk, name: `TXT · ${p.name} title`, role: 'title' }),
      B.text(p.type, p.x, 1840, { style: 'label', color: T.goldDeep, name: `TXT · ${p.name} type`, role: 'meta' }),
      B.text(p.note, p.x, 1900, { style: 'body', color: T.brownInk, width: 1000, name: `TXT · ${p.name} note`, role: 'body' }),
      ...p.rows.flatMap((row, i) => {
        const y = 2140 + i * 92;
        return [
          B.text(row[0], p.x, y, { style: 'label', color: T.brownSoft, name: `TXT · ${p.name} ${row[0]} label`, role: 'table' }),
          B.text(row[1], p.x + 230, y, { style: 'cellStrong', color: T.greenInk, width: 700, name: `TXT · ${p.name} ${row[0]} value`, role: 'table' }),
        ];
      }),
      B.text('SPECIFICATION', p.x, 2560, { style: 'label', color: T.gold, name: `TXT · ${p.name} spec label`, role: 'eyebrow' }),
      ...B.dataTable(p.x, 2620, 1000, p.specs, { status: true, rowH: 92, head: false, labelW: 300, statusW: 240 }),
      B.text(p.caption, p.x, 3060, { style: 'caption', color: T.brownMid, name: `TXT · ${p.name} caption`, role: 'caption' }),
    ]),
  });
  PAGES.push({ id: 'P06', file: 'FARVAND_Catalog_P06_Zahedi_Kimri', title: 'Zahedi & Kimri', groups: g });
}

/* --------------------------------------------- 07 · SHAHANI, NAJAFI, LASHT, MORKI */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Photography', blocks: [B.image('assorted.jpg', PAGE.m, 1650, PAGE.contentW, 900)] });
  g.push({ name: '03 · Furniture', blocks: B.furniture('PRODUCT · FURTHER VARIETIES', 7, TOTAL) });
  g.push({
    name: '04 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '06 — FURTHER VARIETIES', title: 'Shahani, Najafi, Lasht & Morki',
      deck: 'Four more varieties that travel in the same shipment as the headline products — useful for buyers who want a mixed retail box rather than a single-variety pallet.',
      deckWidth: 1500,
    }),
  });
  const four = VARIETIES.slice(4, 8);
  g.push({
    name: '05 · Variety cards',
    blocks: four.flatMap((v, i) => {
      const x = col(i, 4, 56);
      return [
        B.rect(x, 800, 60, 2, T.gold, { name: `RULE · ${v.name}` }),
        B.text(v.name, x, 832, { style: 'h3m', color: T.greenInk, width: 430, name: `TXT · Card · ${v.name}`, role: 'value' }),
        B.text(v.type, x, 940, { style: 'label', color: T.goldDeep, name: `TXT · Card type · ${v.name}`, role: 'meta' }),
        B.text(v.note, x, 990, { style: 'bodySm', color: T.brownMid, width: 430, name: `TXT · Card note · ${v.name}`, role: 'body' }),
        B.rect(x, 1250, 430, 1, T.rule, { name: `LINE · ${v.name}` }),
        B.text('TYPICALLY USED FOR', x, 1276, { style: 'label', color: T.brownSoft, name: `TXT · ${v.name} use label`, role: 'meta' }),
        B.text(v.use, x, 1320, { style: 'caption', color: T.brownInk, width: 430, name: `TXT · ${v.name} use`, role: 'caption' }),
      ];
    }),
  });
  g.push({
    name: '06 · Also available',
    blocks: [
      B.text('ALSO AVAILABLE ON REQUEST', PAGE.m, 2680, { style: 'label', color: T.gold, name: 'TXT · Also available label', role: 'eyebrow' }),
      ...['Deglet en-Nour', 'Barhi', 'Harani (Sukkari)', 'Piarom'].flatMap((v, i) => {
        const w = [430, 300, 470, 280][i];
        const x = PAGE.m + [0, 500, 870, 1410][i];
        return [
          B.rect(x, 2730, w, 56, 'transparent', { stroke: T.ruleStrong, strokeWidth: 1, name: `CHIP · ${v}` }),
          B.text(v, x, 2745, { style: { ...T_.eyebrowSm, size: 18, tracking: 3.2 }, color: T.greenInk, align: 'center', width: w, name: `TXT · Chip · ${v}`, role: 'chip' }),
        ];
      }),
      B.text('Availability depends on the harvest window — confirm before ordering.', PAGE.m, 2830, {
        style: 'caption', color: T.brownSoft, name: 'TXT · Availability note', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P07', file: 'FARVAND_Catalog_P07_Further_Varieties', title: 'Further Varieties', groups: g });
}

/* ------------------------------------------------------ 08 · COMPARISON TABLE */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Furniture', blocks: B.furniture('TECHNICAL SUMMARY', 8, TOTAL) });
  g.push({
    name: '03 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '07 — TECHNICAL SUMMARY', title: 'Variety Comparison',
      deck: 'A quick reference for buyers comparing the varieties in this catalog. Values are typical industry figures and vary with season, region and grade — confirm before ordering.',
      deckWidth: 1560,
    }),
  });
  const cols = [
    { title: 'VARIETY', x: 170, w: 400 },
    { title: 'TYPE', x: 610, w: 280 },
    { title: 'COLOUR', x: 930, w: 400 },
    { title: 'SKIN', x: 1370, w: 360 },
    { title: 'TYPICAL USE', x: 1770, w: 540 },
  ];
  g.push({
    name: '04 · Table',
    blocks: [
      ...cols.map((c) => B.text(c.title, c.x, 820, {
        style: 'label', color: T.brownSoft, name: `TXT · Table head · ${c.title}`, role: 'table',
      })),
      B.rect(PAGE.m, 864, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Table head rule' }),
      ...VARIETIES.flatMap((v, r) => {
        const y = 900 + r * 138;
        const cells = [v.name, v.type, v.colour, v.skin, v.use];
        return [
          ...cells.map((t, i) => B.text(t, cols[i].x, y, {
            style: i === 0 ? 'cellStrong' : 'cell',
            color: i === 0 ? T.greenInk : T.brownInk,
            width: cols[i].w - 30,
            name: `TXT · ${v.name} · ${cols[i].title}`, role: 'table',
          })),
          ...(r < VARIETIES.length - 1 ? [B.rect(PAGE.m, y + 92, PAGE.contentW, 1, T.rule, { name: `LINE · Row rule ${r + 1}` })] : []),
        ];
      }),
    ],
  });
  g.push({
    name: '05 · Footnote',
    blocks: [
      B.text(
        'Variety characteristics vary with growing region, season, irrigation and grade. Figures above are typical values used for buyer orientation. FARVAND confirms the specification of the lot being offered in the quotation, and any lab-verified figure is stated on the certificate that accompanies the lot.',
        PAGE.m, 2640, { style: 'caption', color: T.brownSoft, width: 1900, name: 'TXT · Table footnote', role: 'caption' }),
      B.rect(PAGE.m, 2760, PAGE.contentW, 220, T.greenWash, { name: 'BG · Note panel' }),
      B.rect(PAGE.m, 2760, 4, 220, T.gold, { name: 'LINE · Note accent' }),
      B.text(
        'Not sure which variety fits a shelf, a price point or a container plan? Send us the brief and we will recommend a mix — and tell you plainly what is not available this season.',
        PAGE.m + 50, 2820, { style: 'bodySm', color: T.brownInk, width: 1500, name: 'TXT · Note', role: 'body' }),
    ],
  });
  PAGES.push({ id: 'P08', file: 'FARVAND_Catalog_P08_Variety_Comparison', title: 'Variety Comparison', groups: g });
}

/* ----------------------------------------------------- 09 · QUALITY ASSURANCE */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Photography', blocks: [B.image('quality.jpg', PAGE.m, 2880, PAGE.contentW, 320)] });
  g.push({ name: '03 · Furniture', blocks: B.furniture('QUALITY', 9, TOTAL) });
  g.push({
    name: '04 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '08 — HOW WE WORK', title: 'Quality Assurance',
      deck: 'Six checkpoints stand between the grove and the container. Each one is recorded, and each one can be shown to a buyer or an inspector.',
      deckWidth: 1500,
    }),
  });
  const steps = [
    ['01', 'Incoming inspection', 'Every incoming lot is checked for condition, colour and foreign matter before it enters the line. Findings are recorded per lot.'],
    ['02', 'Sorting and grading', 'Fruit is sorted by size, colour and condition. The grade agreed for the order is separated and rejected fruit leaves the line.'],
    ['03', 'Moisture and condition control', 'Moisture and condition are monitored where the variety requires it. Only lab-verified figures are quoted in the specification.'],
    ['04', 'Controlled packing', 'Packing happens under controlled conditions, with pack format, net weight and count set by the purchase order.'],
    ['05', 'Lot coding and traceability', 'Each carton carries a lot code that ties it back to its source, packing date and inspection record.'],
    ['06', 'Pre-shipment check', 'A final check on count, weight, carton condition and labelling runs before the container is closed and sealed.'],
  ];
  const numShift = measure('Hxg', T_.h4).ascent - measure('Hxg', T_.num).ascent;
  g.push({
    name: '05 · Process steps',
    blocks: steps.flatMap((s, i) => {
      const x = col(i % 2, 2, 80, 1900) + (i % 2 === 0 ? 0 : 0);
      const y = 800 + Math.floor(i / 2) * 420;
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
      B.rect(PAGE.m, 2140, PAGE.contentW, 620, T.green, { name: 'BG · Documents panel' }),
      B.rect(PAGE.m, 2140, 120, 3, T.gold, { name: 'LINE · Documents rule' }),
      B.text('DOCUMENTS WE WORK WITH', PAGE.m + 60, 2200, { style: 'label', color: T.gold, name: 'TXT · Documents label', role: 'eyebrow' }),
      B.text(
        'The exact document set depends on the destination and the incoterm. The list below is the usual export pack — confirm the current requirement for your market with us.',
        PAGE.m + 60, 2250, { style: 'bodySm', color: T.onGreenSoft, width: 1000, name: 'TXT · Documents intro', role: 'body' }),
      ...[
        'Commercial invoice',
        'Packing list',
        'Phytosanitary certificate',
        'Certificate of origin',
        'Fumigation / treatment certificate',
        'Transport documents per incoterm',
      ].flatMap((d, i) => {
        const x = PAGE.m + 60 + (i % 3) * 680;
        const y = 2380 + Math.floor(i / 3) * 90;
        return [
          B.rect(x, y + 14, 8, 8, T.gold, { name: `BULLET · ${d}` }),
          B.text(d, x + 30, y, { style: 'bodySm', color: C.cream, width: 600, name: `TXT · Document · ${d}`, role: 'body' }),
        ];
      }),
      B.text('[EXPORT DOCUMENTS CONFIRMED PER DESTINATION]', PAGE.m + 60, 2600, {
        style: 'caption', color: T.onGreenFaint, name: 'TXT · Documents placeholder', role: 'caption',
      }),
    ],
  });
  g.push({
    name: '07 · Photo caption',
    blocks: [
      B.text('Sorting and grading at [FACILITY NAME], [CITY] — [DESCRIBE THE LINE].', PAGE.m, 3230, {
        style: 'caption', color: T.brownSoft, name: 'TXT · Photo caption', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P09', file: 'FARVAND_Catalog_P09_Quality_Assurance', title: 'Quality Assurance', groups: g });
}

/* -------------------------------------------------------- 10 · PACKAGING */
{
  const g = [];
  g.push({ name: '01 · Background', blocks: [B.rect(0, 0, PAGE.w, PAGE.h, C.cream, { name: 'BG · Page' })] });
  g.push({ name: '02 · Photography', blocks: [B.image('packaging.jpg', PAGE.m, 780, 980, 1100)] });
  g.push({ name: '03 · Furniture', blocks: B.furniture('PACKAGING', 10, TOTAL) });
  g.push({
    name: '04 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '09 — HOW IT ARRIVES', title: 'Packaging Options',
      deck: 'Dates are fragile and moisture-sensitive. The pack format is chosen for the destination, the shelf and the retailer’s planogram — not for the factory that filled it.',
      deckWidth: 1500,
    }),
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
        const y = 780 + i * 300;
        return [
          B.text(f[0], 1260, y, { style: 'h3m', color: T.greenInk, name: `TXT · Format · ${f[0]}`, role: 'value' }),
          B.text(f[1], 1260, y + 54, { style: 'bodySm', color: T.brownMid, width: 1000, name: `TXT · Format note · ${f[0]}`, role: 'body' }),
          ...f[2].flatMap((r, j) => [
            B.text(r[0], 1260, y + 120 + j * 46, { style: 'caption', color: T.brownSoft, name: `TXT · ${f[0]} ${r[0]} label`, role: 'table' }),
            B.text(r[1], 1580, y + 120 + j * 46, { style: 'caption', color: T.goldDeep, width: 680, name: `TXT · ${f[0]} ${r[0]} value`, role: 'table' }),
          ]),
        ];
      }),
      B.text('All retail formats above are examples. Confirm the formats available for each variety, and the film, label and carton material, before ordering.', 1260, 1740, {
        style: 'caption', color: T.brownSoft, width: 1000, name: 'TXT · Formats note', role: 'caption',
      }),
      B.text('Export packing, sorting and grading at [FACILITY NAME], [CITY].', PAGE.m, 1920, {
        style: 'caption', color: T.brownSoft, name: 'TXT · Photo caption', role: 'caption',
      }),
    ],
  });
  g.push({
    name: '06 · Bulk and private label',
    blocks: [
      B.text('BULK AND PRIVATE LABEL', PAGE.m, 2080, { style: 'label', color: T.gold, name: 'TXT · Bulk label', role: 'eyebrow' }),
      B.rect(PAGE.m, 2128, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Bulk rule' }),
      ...[
        ['Bulk carton', 'Standard export carton for wholesale buyers.', ['Net weight', '[NET WEIGHT]'], ['Units per carton', '[UNITS]'], ['Carton size', '[L × W × H]']],
        ['Private label', 'Your brand, our pack house.', ['Minimum run', '[MINIMUM RUN]'], ['Label artwork', '[BUYER ARTWORK]'], ['Lead time', '[LEAD TIME]']],
        ['Pallet & container', 'How the shipment is built.', ['Pallet size', '[PALLET SIZE]'], ['Container', '[20FT / 40FT / 40HC]'], ['Load plan', '[LOAD PLAN]']],
      ].flatMap((c, i) => {
        const x = col(i, 3, 64);
        return [
          B.text(c[0], x, 2180, { style: 'h3m', color: T.greenInk, name: `TXT · ${c[0]} title`, role: 'value' }),
          B.text(c[1], x, 2236, { style: 'bodySm', color: T.brownMid, width: 600, name: `TXT · ${c[0]} note`, role: 'body' }),
          ...c.slice(2).flatMap((r, j) => [
            B.text(r[0], x, 2340 + j * 66, { style: 'caption', color: T.brownSoft, name: `TXT · ${c[0]} ${r[0]} label`, role: 'table' }),
            B.text(r[1], x + 300, 2340 + j * 66, { style: 'caption', color: T.goldDeep, width: 360, name: `TXT · ${c[0]} ${r[0]} value`, role: 'table' }),
          ]),
        ];
      }),
    ],
  });
  g.push({
    name: '07 · Carton data table',
    blocks: [
      B.text('CARTON AND PALLET DATA', PAGE.m, 2620, { style: 'label', color: T.gold, name: 'TXT · Carton data label', role: 'eyebrow' }),
      ...B.dataTable(PAGE.m, 2680, PAGE.contentW, [
        { label: 'Standard export carton', value: '[L × W × H] · [NET WEIGHT] · [UNITS PER CARTON]', status: 'To be supplied' },
        { label: 'Retail carton', value: '[L × W × H] · [UNITS PER CARTON]', status: 'To be supplied' },
        { label: 'Pallet', value: '[PALLET DIMENSIONS] · [CARTONS PER PALLET]', status: 'To be supplied' },
        { label: 'Container load', value: '[20FT / 40FT / 40HC] · [PALLETS PER CONTAINER]', status: 'To be supplied' },
        { label: 'Shipping marks & labels', value: '[SHIPPING MARK FORMAT] · [LABEL LANGUAGE]', status: 'To be supplied' },
      ], { status: true, rowH: 92, head: false }),
    ],
  });
  g.push({
    name: '08 · How private label works',
    blocks: [
      B.rect(PAGE.m, 3010, PAGE.contentW, 250, T.green, { name: 'BG · Process band' }),
      B.rect(PAGE.m, 3010, 120, 3, T.gold, { name: 'LINE · Process rule' }),
      B.text('HOW A PRIVATE LABEL RUN WORKS', PAGE.m + 60, 3050, { style: 'label', color: T.gold, name: 'TXT · Process label', role: 'eyebrow' }),
      ...[
        ['01', 'Send artwork', 'Print-ready label files, or we propose a format you can adapt.'],
        ['02', 'Approve the proof', 'We print a physical proof for your sign-off before production.'],
        ['03', 'Production', 'Packing to your artwork, with the agreed net weight and count.'],
        ['04', 'Documents', 'Carton marks, labels and paperwork issued with the shipment.'],
      ].flatMap((st, i) => {
        const x = PAGE.m + 60 + i * 530;
        return [
          B.text(st[0], x, 3100, { style: 'h4', color: T.gold, name: `TXT · Process ${st[0]} numeral`, role: 'numeral' }),
          B.text(st[1], x + 56, 3100, { style: 'h4', color: C.cream, name: `TXT · Process ${st[0]} title`, role: 'value' }),
          B.text(st[2], x, 3150, { style: 'caption', color: T.onGreenSoft, width: 440, name: `TXT · Process ${st[0]} body`, role: 'body' }),
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
  g.push({ name: '02 · Photography', blocks: [B.image('logistics.jpg', PAGE.m, 1500, PAGE.contentW, 620)] });
  g.push({ name: '03 · Furniture', blocks: B.furniture('EXPORT & LOGISTICS', 11, TOTAL) });
  g.push({
    name: '04 · Headlines',
    blocks: B.titleBlock({
      eyebrow: '10 — COMMERCIAL TERMS', title: 'Export & Logistics',
      deck: 'The commercial terms are the part of a date business that decides whether an order works. Everything below is agreed in writing before production.',
      deckWidth: 1500,
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
    name: '05 · Terms',
    blocks: stats.flatMap((s, i) => {
      const x = col(i % 4, 4, 56);
      const y = 800 + Math.floor(i / 4) * 320;
      return [
        B.rect(x, y, 430, 1, T.rule, { name: `LINE · Stat ${i + 1}` }),
        B.text(s[0], x, y + 30, { style: 'label', color: T.goldDeep, width: 430, name: `TXT · Stat ${i + 1} label`, role: 'meta' }),
        B.text(s[1], x, y + 80, { style: 'h3m', color: T.greenInk, width: 430, name: `TXT · Stat ${i + 1} value`, role: 'value' }),
        B.text('To be supplied', x, y + 140, { style: 'caption', color: T.brownSoft, name: `TXT · Stat ${i + 1} status`, role: 'caption' }),
      ];
    }),
  });
  g.push({
    name: '06 · Markets',
    blocks: [
      B.text('TARGET MARKETS', PAGE.m, 2240, { style: 'label', color: T.gold, name: 'TXT · Markets label', role: 'eyebrow' }),
      B.rect(PAGE.m, 2288, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Markets rule' }),
      ...['India', '[MARKET 2]', '[MARKET 3]', '[MARKET 4]', '[MARKET 5]'].flatMap((m, i) => {
        const w = [260, 320, 320, 320, 320][i];
        const x = PAGE.m + [0, 320, 700, 1080, 1460][i];
        return [
          B.rect(x, 2340, w, 60, i === 0 ? T.green : 'transparent', { stroke: i === 0 ? undefined : T.ruleStrong, strokeWidth: 1, name: `CHIP · ${m}` }),
          B.text(m, x, 2358, { style: { ...T_.eyebrowSm, size: 19, tracking: 3.6 }, color: i === 0 ? C.cream : T.greenInk, align: 'center', width: w, name: `TXT · Chip · ${m}`, role: 'chip' }),
        ];
      }),
      B.text(
        'India is our priority market. We work with importers, wholesale distributors and retail chains — and we quote against the specification they already sell, not ours.',
        PAGE.m, 2480, { style: 'body', color: T.brownInk, width: 1100, name: 'TXT · Markets note', role: 'body' }),
      B.rect(1420, 2450, 890, 300, T.greenWash, { name: 'BG · Shipping note' }),
      B.rect(1420, 2450, 4, 300, T.gold, { name: 'LINE · Shipping accent' }),
      B.text('SHIPPING & DOCUMENTS', 1470, 2500, { style: 'label', color: T.goldDeep, name: 'TXT · Shipping label', role: 'eyebrow' }),
      B.text(
        'Every shipment is accompanied by the documents your customs broker asks for, issued before the container is sealed. [ADD: SHIPPING POLICY, INSURANCE, TEMPERATURE OR CARE REQUIREMENTS FOR SOFT DATES.]',
        1470, 2550, { style: 'bodySm', color: T.brownInk, width: 800, name: 'TXT · Shipping note', role: 'body' }),
      B.text('Port-side logistics and container photographs at [PORT OF LOADING].', PAGE.m, 2180, {
        style: 'caption', color: T.brownSoft, name: 'TXT · Photo caption', role: 'caption',
      }),
    ],
  });
  g.push({
    name: '07 · Terms note',
    blocks: [
      B.text(
        'Terms shown in brackets are agreed with the buyer before order confirmation. We do not publish figures we cannot honour — the quotation is the commitment, and it is written to be kept.',
        PAGE.m, 2860, { style: 'caption', color: T.brownSoft, width: 1900, name: 'TXT · Terms note', role: 'caption' }),
    ],
  });
  g.push({
    name: '08 · Ordering process',
    blocks: [
      B.text('HOW AN ORDER RUNS', PAGE.m, 2950, { style: 'label', color: T.gold, name: 'TXT · Process label', role: 'eyebrow' }),
      B.rect(PAGE.m, 2998, PAGE.contentW, 1, T.ruleStrong, { name: 'LINE · Process rule' }),
      ...[
        ['01', 'Inquiry', 'Variety, pack, quantity and destination port.'],
        ['02', 'Specification & quotation', 'Grade, count, moisture and price, in writing.'],
        ['03', 'Production & packing', 'Sourcing, sorting, packing and lot coding.'],
        ['04', 'Documents & shipment', 'Export papers issued, container sealed, vessel loaded.'],
      ].flatMap((st, i) => {
        const x = col(i, 4, 56);
        return [
          B.text(st[0], x, 3040, { style: 'h4', color: T.gold, name: `TXT · Process ${st[0]} numeral`, role: 'numeral' }),
          B.text(st[1], x + 56, 3040, { style: 'h4', color: T.greenInk, name: `TXT · Process ${st[0]} title`, role: 'value' }),
          B.text(st[2], x, 3096, { style: 'caption', color: T.brownMid, width: 430, name: `TXT · Process ${st[0]} body`, role: 'body' }),
        ];
      }),
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
      B.text('11 — NEXT STEP', PAGE.m, 600, { style: 'eyebrow', color: T.gold, name: 'TXT · Eyebrow', role: 'eyebrow' }),
      B.text('Request a Quotation', PAGE.m, 670, { style: 'displayL', color: C.cream, width: 1800, name: 'TXT · Page title', role: 'title' }),
      B.rect(PAGE.m, 840, 120, 3, T.gold, { name: 'LINE · Title rule' }),
      B.text(
        'Tell us the variety, the pack format, the quantity and the destination port. We will reply with a specification and an offer — and with anything we cannot do this season stated plainly.',
        PAGE.m, 910, { style: 'body', color: T.onGreenSoft, width: 1150, name: 'TXT · Deck', role: 'deck' }),
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
        const y = 1210 + Math.floor(i / 3) * 230;
        return [
          B.rect(x, y, 600, 1, T.onGreenFaint, { name: `LINE · Contact ${i + 1}` }),
          B.text(r[0], x, y + 28, { style: 'label', color: T.gold, name: `TXT · Contact ${i + 1} label`, role: 'meta' }),
          B.text(r[1], x, y + 76, { style: 'h4', color: C.cream, width: 620, name: `TXT · Contact ${i + 1} value`, role: 'value' }),
        ];
      }),
    ],
  });
  g.push({
    name: '05 · Checklist',
    blocks: [
      B.rect(PAGE.m, 1720, 1080, 660, T.greenDeep, { name: 'BG · Checklist panel' }),
      B.rect(PAGE.m, 1720, 120, 3, T.gold, { name: 'LINE · Checklist rule' }),
      B.text('WHAT TO INCLUDE', PAGE.m + 60, 1780, { style: 'label', color: T.gold, name: 'TXT · Checklist label', role: 'eyebrow' }),
      ...[
        'Variety and grade, or the shelf you are filling',
        'Pack format and net weight',
        'Quantity, in cartons or tonnes',
        'Destination port and incoterm',
        'Target delivery date',
      ].flatMap((t, i) => [
        B.rect(PAGE.m + 60, 1868 + i * 96 + 14, 8, 8, T.gold, { name: `BULLET · Checklist ${i + 1}` }),
        B.text(t, PAGE.m + 96, 1868 + i * 96, { style: 'bodySm', color: C.cream, width: 900, name: `TXT · Checklist ${i + 1}`, role: 'body' }),
      ]),
    ],
  });
  g.push({
    name: '06 · QR and closing',
    blocks: [
      B.rect(1420, 1720, 890, 660, 'transparent', { stroke: T.gold, strokeWidth: 1, name: 'FRAME · QR placeholder' }),
      B.text('SCAN FOR THE FULL RANGE', 1420, 1820, { style: 'label', color: T.gold, align: 'center', width: 890, name: 'TXT · QR label', role: 'meta' }),
      B.rect(1605, 1890, 320, 320, 'transparent', { stroke: T.onGreenFaint, strokeWidth: 1, name: 'FRAME · QR code area' }),
      B.text('[QR CODE]', 1605, 2030, { style: 'label', color: T.onGreenSoft, align: 'center', width: 320, name: 'TXT · QR placeholder', role: 'caption' }),
      B.text('[WEBSITE]', 1420, 2268, { style: 'h4', color: C.cream, align: 'center', width: 890, name: 'TXT · QR website', role: 'value' }),
      B.text('Thank you for considering FARVAND.', PAGE.m, 2520, { style: 'h2', color: C.cream, width: 1900, name: 'TXT · Closing', role: 'title' }),
      B.rect(PAGE.m, 2640, PAGE.contentW, 1, T.onGreenFaint, { name: 'LINE · Closing rule' }),
      B.text('FARVAND · PREMIUM IRANIAN DATES · B2B EXPORT CATALOG · [YEAR]', PAGE.m, 2680, {
        style: 'eyebrowSm', color: T.onGreenSoft, name: 'TXT · Closing meta', role: 'meta',
      }),
      B.text('12 / 12', PAGE.m + PAGE.contentW - 200, 2680, {
        style: 'eyebrowSm', color: T.gold, align: 'right', width: 200, name: 'TXT · Closing page number', role: 'meta',
      }),
      B.rect(0, 2820, PAGE.w, PAGE.h - 2820, T.greenDeep, { name: 'BG · Closing band' }),
      B.rect(PAGE.m, 2900, 120, 3, T.gold, { name: 'LINE · Closing band rule' }),
      B.text('FARVAND', PAGE.m, 2950, {
        style: { ...T_.h2, size: 72, lineHeight: 84, tracking: 12 }, color: C.cream,
        name: 'TXT · Closing wordmark', role: 'brand',
      }),
      B.text('Premium Iranian Dates · Export catalogue · [YEAR]', PAGE.m, 3070, {
        style: 'eyebrowSm', color: T.gold, name: 'TXT · Closing band descriptor', role: 'brand',
      }),
      B.text('[CONTACT EMAIL]   ·   [WHATSAPP NUMBER]   ·   [WEBSITE]', PAGE.m + PAGE.contentW - 1300, 2960, {
        style: 'h4', color: C.cream, align: 'right', width: 1300, name: 'TXT · Closing band contact', role: 'value',
      }),
      B.text('Kind regards, the FARVAND team — [CITY], [COUNTRY]', PAGE.m + PAGE.contentW - 1300, 3020, {
        style: 'caption', color: T.onGreenSoft, align: 'right', width: 1300, name: 'TXT · Closing band sign-off', role: 'caption',
      }),
    ],
  });
  PAGES.push({ id: 'P12', file: 'FARVAND_Catalog_P12_Contact', title: 'Contact', groups: g });
}

module.exports = { PAGES, VARIETIES, TOTAL };
