/**
 * Print-ready PDF (A4 portrait, vector text, embedded photography).
 * The page model is rendered with the same geometry as the PSD, so the PDF,
 * the PNG previews and the PSD layers all agree.
 */
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sharp = require('sharp');
const { prepareText, loadImage } = require('./lib');
const { PAGE, C, T, FONT_FILES, FONT_DIR } = require('./theme');
const { IMG_DIR } = require('./render');

const S = 72 / PAGE.dpi; // document px → PDF points
const A4 = { width: PAGE.w * S, height: PAGE.h * S };

const fontCache = new Map();
const cropCache = new Map();

function fontPath(ps) {
  if (!fontCache.has(ps)) fontCache.set(ps, path.join(FONT_DIR, FONT_FILES[ps]));
  return fontCache.get(ps);
}

/** Crop a photo to an exact box and return a JPEG buffer (cached). */
async function croppedJpeg(src, w, h) {
  const key = `${src}|${w}x${h}`;
  if (!cropCache.has(key)) {
    const buf = fs.readFileSync(path.join(IMG_DIR, src));
    const out = await sharp(buf)
      .resize(Math.round(w), Math.round(h), { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
      .toBuffer();
    cropCache.set(key, out);
  }
  return cropCache.get(key);
}

const hex = (c) => ((c || '#000000').charAt(0) === '#' ? c : `#${c}`).toUpperCase();

/**
 * Render one page into the PDF document.
 * `artBlocks` (background + photography + overlays) are composited to a single
 * image so that gradient scrims keep their transparency; all type stays vector.
 */
async function drawPage(doc, page) {
  doc.addPage({ size: [A4.width, A4.height], margin: 0 });

  const hasScrim = page.groups.some((g) => g.blocks.some((b) => b.type === 'scrim'));
  const art = [];
  const rest = [];

  for (const g of page.groups) {
    for (const b of g.blocks) {
      if (hasScrim) {
        if (b.type === 'rect' || b.type === 'image' || b.type === 'scrim') art.push(b);
        else rest.push(b);
      } else {
        if (b.type === 'image') art.push(b);
        else rest.push(b);
      }
    }
  }

  /* ---- background / photography -------------------------------------- */
  if (hasScrim) {
    const canvas = require('./lib').makeCanvas(PAGE.w, PAGE.h);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = C.cream;
    ctx.fillRect(0, 0, PAGE.w, PAGE.h);
    for (const b of art) {
      if (b.type === 'rect') {
        if (b.color && b.color !== 'transparent') {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
        if (b.stroke) {
          ctx.strokeStyle = b.stroke;
          ctx.lineWidth = b.strokeWidth || 1;
          ctx.strokeRect(b.x + ctx.lineWidth / 2, b.y + ctx.lineWidth / 2, b.w - ctx.lineWidth, b.h - ctx.lineWidth);
        }
      } else if (b.type === 'image') {
        const img = await loadImage(path.join(IMG_DIR, b.src));
        require('./lib').drawImageCover(ctx, img, b.x, b.y, b.w, b.h);
      } else if (b.type === 'scrim') {
        const g = require('./lib').gradientCanvas(b.w, b.h, b.stops, b.vertical !== false);
        ctx.drawImage(g, b.x, b.y);
      }
    }
    const jpeg = await canvas.toBuffer('image/jpeg', 90);
    doc.image(jpeg, 0, 0, { width: A4.width, height: A4.height });
  } else {
    for (const b of art) {
      if (b.type === 'rect') {
        if (b.color && b.color !== 'transparent') {
          doc.rect(b.x * S, b.y * S, b.w * S, b.h * S).fill(hex(b.color));
        }
        if (b.stroke) {
          doc.lineWidth((b.strokeWidth || 1) * S)
            .strokeColor(hex(b.stroke))
            .rect(b.x * S, b.y * S, b.w * S, b.h * S)
            .stroke();
        }
      } else if (b.type === 'image') {
        const jpeg = await croppedJpeg(b.src, b.w, b.h);
        doc.image(jpeg, b.x * S, b.y * S, { width: b.w * S, height: b.h * S });
      }
    }
  }

  /* ---- type ------------------------------------------------------------ */
  for (const b of rest) {
    if (b.type !== 'text') {
      if (b.type === 'rect') {
        if (b.color && b.color !== 'transparent') doc.rect(b.x * S, b.y * S, b.w * S, b.h * S).fill(hex(b.color));
        if (b.stroke) {
          doc.lineWidth((b.strokeWidth || 1) * S)
            .strokeColor(hex(b.stroke))
            .rect(b.x * S, b.y * S, b.w * S, b.h * S)
            .stroke();
        }
      } else if (b.type === 'scrim') {
        const g = require('./lib').gradientCanvas(b.w, b.h, b.stops, b.vertical !== false);
        const png = g.toBuffer('image/png');
        doc.image(png, b.x * S, b.y * S, { width: b.w * S, height: b.h * S });
      }
      continue;
    }

    const style = b.style;
    const prepared = prepareText(b);
    doc.registerFont(`f_${style.ps}`, fontPath(style.ps));
    doc.font(`f_${style.ps}`).fontSize(style.size * S);
    doc.fillColor(hex(b.color));
    prepared.lines.forEach((line, i) => {
      if (!line) return;
      doc.text(line, b.x * S, prepared.baselines[i] * S, {
        lineBreak: false,
        baseline: 'alphabetic',
        characterSpacing: (style.tracking || 0) * S,
        align: 'left',
      });
    });
  }
}

async function writePdf(pages, outPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [A4.width, A4.height],
      margin: 0,
      info: {
        Title: 'FARVAND — Premium Iranian Dates · B2B Export Catalog',
        Author: 'FARVAND',
        Subject: 'Iranian date export catalog for importers, wholesalers and distributors',
        Keywords: 'Iranian dates, Mazafati, Medjoul, Zahedi, Kimri, B2B export, FARVAND',
      },
      autoFirstPage: false,
      pdfVersion: '1.7',
    });
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);
    (async () => {
      for (const p of pages) await drawPage(doc, p);
      doc.end();
    })().catch(reject);
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = { writePdf, A4, S };
