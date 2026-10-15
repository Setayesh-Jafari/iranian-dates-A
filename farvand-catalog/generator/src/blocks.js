/**
 * Block constructors for the catalog page model.
 * A page is { id, name, blocks: [...] } where blocks are grouped into
 * Photoshop groups by their `group` property.
 */
const { T_, C, T, PAGE } = require('./theme');

let uid = 0;
const nid = () => `b${(uid += 1)}`;

function rect(x, y, w, h, color, opts = {}) {
  return { type: 'rect', id: nid(), x, y, w, h, color, ...opts };
}
function line(x, y, w, color, thickness = 2, opts = {}) {
  return { type: 'rect', id: nid(), x, y, w, h: thickness, color, ...opts };
}
function image(src, x, y, w, h, opts = {}) {
  return { type: 'image', id: nid(), src, x, y, w, h, ...opts };
}
function scrim(x, y, w, h, stops, opts = {}) {
  return { type: 'scrim', id: nid(), x, y, w, h, stops, vertical: true, ...opts };
}
function text(str, x, y, opts = {}) {
  const style = opts.style || 'body';
  return {
    type: 'text',
    id: nid(),
    text: str,
    x,
    y,
    style: typeof style === 'string' ? T_[style] : style,
    color: opts.color || T.brownInk,
    width: opts.width,
    align: opts.align || 'left',
    name: opts.name,
    role: opts.role || 'text',
  };
}
function group(name, blocks, opts = {}) {
  return { type: 'group', id: nid(), name, blocks, ...opts };
}

/* ----------------------------------------------------------- page chrome */

/** Header + footer furniture shared by the interior pages. */
function furniture(section, pageNo, total, opts = {}) {
  const dark = !!opts.dark;
  const ink = dark ? T.onGreen : T.greenInk;
  const soft = dark ? T.onGreenSoft : T.brownMid;
  const ruleColor = dark ? T.onGreenFaint : T.rule;
  const g = [];

  g.push(text('FARVAND', PAGE.m, 118, {
    style: 'h3m',
    color: ink,
    name: 'TXT · Header · Wordmark',
    role: 'brand',
  }));
  // letter-spaced wordmark effect: add tracking override
  g[g.length - 1].style = { ...T_.h3m, size: 30, lineHeight: 36, tracking: 7 };

  // section label sits to the left of the page number, both hard right
  g.push(text(section, PAGE.m + PAGE.contentW - 260 - 1000, 118, {
    style: 'eyebrowSm',
    color: soft,
    align: 'right',
    width: 1000,
    name: 'TXT · Header · Section',
    role: 'meta',
  }));
  g.push(text(`${String(pageNo).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, PAGE.m + PAGE.contentW - 220, 118, {
    style: 'eyebrowSm',
    color: T.gold,
    align: 'right',
    width: 220,
    name: 'TXT · Header · Page number',
    role: 'meta',
  }));

  g.push(line(PAGE.m, 168, PAGE.contentW, ruleColor, 1, { name: 'LINE · Header rule' }));

  g.push(line(PAGE.m, 3336, PAGE.contentW, ruleColor, 1, { name: 'LINE · Footer rule' }));
  g.push(text('FARVAND · PREMIUM IRANIAN DATES', PAGE.m, 3370, {
    style: 'eyebrowSm',
    color: soft,
    name: 'TXT · Footer · Left',
    role: 'meta',
  }));
  g.push(text('B2B EXPORT CATALOG · [YEAR]', PAGE.m, 3370, {
    style: 'eyebrowSm',
    color: soft,
    align: 'center',
    width: PAGE.contentW,
    name: 'TXT · Footer · Centre',
    role: 'meta',
  }));
  g.push(text(`${String(pageNo).padStart(2, '0')}`, PAGE.m + PAGE.contentW - 200, 3370, {
    style: 'eyebrowSm',
    color: T.gold,
    align: 'right',
    width: 200,
    name: 'TXT · Footer · Page number',
    role: 'meta',
  }));
  return g;
}

/** Standard page title: eyebrow, title, gold rule, optional deck. */
function titleBlock({ eyebrow, title, deck, y = 330, titleStyle = 'h1', deckWidth = 1500, deckGap = 64 }) {
  const out = [];
  if (eyebrow) {
    out.push(text(eyebrow, PAGE.m, y, { style: 'eyebrow', color: T.gold, name: 'TXT · Eyebrow', role: 'eyebrow' }));
  }
  const ty = y + (eyebrow ? 66 : 0);
  out.push(text(title, PAGE.m, ty, { style: titleStyle, color: T.greenInk, name: 'TXT · Page title', role: 'title' }));
  const ruleY = ty + (titleStyle === 'h1' ? 132 : 120);
  out.push(line(PAGE.m, ruleY, 120, T.gold, 3, { name: 'LINE · Title rule' }));
  if (deck) {
    out.push(text(deck, PAGE.m, ruleY + deckGap, {
      style: 'body',
      color: T.brownMid,
      width: deckWidth,
      name: 'TXT · Deck',
      role: 'deck',
    }));
  }
  return out;
}

/* ------------------------------------------------------------------ table */

/**
 * Simple two-column data table with an optional status column.
 * rows: [{ label, value, status }]
 */
function dataTable(x, y, w, rows, opts = {}) {
  const out = [];
  const rowH = opts.rowH || 104;
  const statusW = opts.statusW || 300;
  const labelW = opts.labelW || Math.round(w * 0.38);
  const valueW = w - labelW - (opts.status ? statusW : 0);
  const hasHead = opts.head !== false;

  if (hasHead) {
    out.push(text(opts.headLabel || 'SPECIFICATION', x, y, { style: 'label', color: T.brownSoft, name: 'TXT · Table · Head label', role: 'table' }));
    if (opts.status) {
      out.push(text(opts.headStatus || 'STATUS', x + labelW, y, { style: 'label', color: T.brownSoft, name: 'TXT · Table · Head status', role: 'table' }));
    }
    out.push(line(x, y + 44, w, T.ruleStrong, 1, { name: 'LINE · Table head rule' }));
  }

  let cy = y + (hasHead ? 72 : 0);
  rows.forEach((row, i) => {
    out.push(text(row.label, x, cy, { style: 'cellStrong', color: T.greenInk, name: `TXT · Table · ${row.label}`, role: 'table' }));
    out.push(text(row.value, x + labelW, cy, {
      style: 'cell',
      color: row.placeholder ? T.goldDeep : T.brownInk,
      width: valueW,
      name: `TXT · Table · ${row.label} value`,
      role: 'table',
    }));
    if (opts.status) {
      const s = row.status || 'To be supplied';
      const confirmed = /confirm/i.test(s);
      out.push(text(s, x + labelW + valueW, cy, {
        style: 'label',
        color: confirmed ? T.greenInk : T.goldDeep,
        width: statusW - 20,
        name: `TXT · Table · ${row.label} status`,
        role: 'table',
      }));
    }
    cy += rowH;
    if (i < rows.length - 1) {
      out.push(line(x, cy - 26, w, T.rule, 1, { name: `LINE · Table row rule ${i + 1}` }));
    }
  });
  return out;
}

module.exports = { rect, line, image, scrim, text, group, furniture, titleBlock, dataTable };
