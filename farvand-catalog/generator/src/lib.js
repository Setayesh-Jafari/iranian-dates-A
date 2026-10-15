/**
 * Canvas / typography utilities shared by the PSD, PDF and PPTX renderers.
 * All geometry is in document pixels (A4 @ 300 dpi = 2480 x 3508).
 */
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { registerFonts } = require('./theme');

registerFonts();

// ag-psd expects node-canvas; point it at @napi-rs/canvas instead.
try {
  const helpers = require('ag-psd/dist/helpers');
  helpers.createCanvas = (w, h) => createCanvas(w, h);
} catch (e) {
  /* ag-psd not loaded yet */
}

const _measureCanvas = createCanvas(10, 10);
const _measureCtx = _measureCanvas.getContext('2d');

function makeCanvas(w, h) {
  return createCanvas(Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

function fontString(style) {
  const italic = style.italic ? 'italic ' : '';
  return `${italic}${style.weight} ${style.size}px "${style.family}"`;
}

/** Measure a single line of text with a style (tracking in px). */
function measure(text, style) {
  const ctx = _measureCtx;
  ctx.font = fontString(style);
  ctx.letterSpacing = `${style.tracking || 0}px`;
  const m = ctx.measureText(text);
  return {
    width: m.width,
    ascent: m.fontBoundingBoxAscent,
    descent: m.fontBoundingBoxDescent,
    left: m.actualBoundingBoxLeft,
    right: m.actualBoundingBoxRight,
    inkAscent: m.actualBoundingBoxAscent,
    inkDescent: m.actualBoundingBoxDescent,
  };
}

/** Greedy word wrap. Returns an array of lines. */
function wrap(text, style, maxWidth) {
  if (!maxWidth) return String(text).split('\n');
  const out = [];
  for (const para of String(text).split('\n')) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) {
      out.push('');
      continue;
    }
    let line = words[0];
    for (let i = 1; i < words.length; i++) {
      const candidate = `${line} ${words[i]}`;
      if (measure(candidate, style).width <= maxWidth) line = candidate;
      else {
        out.push(line);
        line = words[i];
      }
    }
    out.push(line);
  }
  return out;
}

/**
 * Resolve a text block into concrete draw instructions.
 * Returns { lines, baselines, ink, ascent, width }.
 */
function prepareText(block) {
  const style = block.style;
  const text = block.upper ? String(block.text).toUpperCase() : String(block.text);
  const lines = wrap(text, style, block.width);
  const ascent = measure('Hxg', style).ascent;
  const descent = measure('Hxg', style).descent;
  const lh = style.lineHeight || Math.round(style.size * 1.3);

  let inkLeft = Infinity, inkTop = Infinity, inkRight = -Infinity, inkBottom = -Infinity;
  let maxWidth = 0;
  const baselines = [];
  lines.forEach((line, i) => {
    const base = block.y + ascent + i * lh;
    baselines.push(base);
    const m = measure(line, style);
    maxWidth = Math.max(maxWidth, m.width);
    if (line.length) {
      inkLeft = Math.min(inkLeft, block.x + m.left);
      inkRight = Math.max(inkRight, block.x + m.right);
      inkTop = Math.min(inkTop, base - m.inkAscent);
      inkBottom = Math.max(inkBottom, base + m.inkDescent);
    }
  });
  if (!isFinite(inkLeft)) {
    inkLeft = block.x; inkRight = block.x; inkTop = block.y; inkBottom = block.y;
  }
  return { lines, baselines, ascent, descent, maxWidth, ink: { left: inkLeft, top: inkTop, right: inkRight, bottom: inkBottom } };
}

/** Draw a prepared text block onto a context (origin = document coords). */
function drawText(ctx, block, prepared) {
  const style = block.style;
  ctx.save();
  ctx.font = fontString(style);
  ctx.letterSpacing = `${style.tracking || 0}px`;
  ctx.fillStyle = block.color;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  prepared.lines.forEach((line, i) => {
    let x = block.x;
    if (block.align === 'center') x = block.x + (block.width ? (block.width - measure(line, style).width) / 2 : 0);
    else if (block.align === 'right') x = block.x + (block.width ? block.width - measure(line, style).width : 0);
    ctx.fillText(line, x, prepared.baselines[i]);
  });
  ctx.restore();
}

/** Render a text block to its own transparent canvas, tightly cropped to the ink. */
function renderTextLayer(block, prepared) {
  const ink = prepared.ink;
  const pad = 2;
  const left = Math.floor(ink.left - pad);
  const top = Math.floor(ink.top - pad);
  const right = Math.ceil(ink.right + pad);
  const bottom = Math.ceil(ink.bottom + pad);
  const w = Math.max(1, right - left);
  const h = Math.max(1, bottom - top);
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.translate(-left, -top);
  drawText(ctx, block, prepared);
  return { canvas, left, top, right, bottom };
}

/** object-fit: cover drawing. `crop` = {sx, sy, sw, sh} selects a source rect first.
 *  Always clips to the target box so overlapping layouts stay pixel-consistent. */
function drawImageCover(ctx, img, x, y, w, h, crop) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  if (crop) {
    const scale = Math.max(w / crop.sw, h / crop.sh);
    const dw = crop.sw * scale, dh = crop.sh * scale;
    ctx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
    return;
  }
  const ir = img.width / img.height;
  const tr = w / h;
  let sw, sh, sx, sy;
  if (ir > tr) {
    sh = img.height; sw = sh * tr; sx = (img.width - sw) / 2; sy = 0;
  } else {
    sw = img.width; sh = sw / tr; sx = 0; sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

/** object-fit: contain drawing (letterboxed, transparent) */
function drawImageContain(ctx, img, x, y, w, h) {
  const ir = img.width / img.height;
  const tr = w / h;
  let dw, dh;
  if (ir > tr) { dw = w; dh = w / ir; } else { dh = h; dw = h * ir; }
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/** Crop a source image to the target box (cover) and return a standalone canvas. */
function cropImage(img, w, h) {
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  drawImageCover(ctx, img, 0, 0, w, h);
  return canvas;
}

/** Linear gradient scrim as a transparent canvas. */
function gradientCanvas(w, h, stops, vertical = true) {
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  const g = vertical ? ctx.createLinearGradient(0, 0, 0, h) : ctx.createLinearGradient(0, 0, w, 0);
  for (const [pos, color, alpha] of stops) {
    g.addColorStop(pos, color.replace('#', (m, o) => m) + '');
    // alpha applied via rgba conversion below
  }
  // rebuild with rgba
  const g2 = vertical ? ctx.createLinearGradient(0, 0, 0, h) : ctx.createLinearGradient(0, 0, w, 0);
  for (const [pos, color, alpha] of stops) {
    g2.addColorStop(pos, rgba(color, alpha));
  }
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, w, h);
  return canvas;
}

function rgba(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

module.exports = {
  makeCanvas, fontString, measure, wrap, prepareText, drawText, renderTextLayer,
  drawImageCover, drawImageContain, cropImage, gradientCanvas, rgba, loadImage,
};
