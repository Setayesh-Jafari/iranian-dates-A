/**
 * Editable PowerPoint deck (one slide per catalog page, A4 portrait).
 * Every text element is a real text box, so the deck can be edited in
 * PowerPoint, Keynote or imported into Canva without touching a design file.
 */
const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const sharp = require('sharp');
const { prepareText, loadImage } = require('./lib');
const { PAGE, C, T } = require('./theme');
const { IMG_DIR } = require('./render');

const IN = 1 / PAGE.dpi;                 // document px → inches
const PAGE_W = PAGE.w * IN;              // 8.268 in (A4 portrait)
const PAGE_H = PAGE.h * IN;

const hex = (c) => (c || '#000000').replace('#', '').toUpperCase();
const cropCache = new Map();

async function croppedJpeg(src, w, h, crop) {
  const key = `${src}|${Math.round(w)}x${Math.round(h)}|${crop ? crop.sx + ',' + crop.sy + ',' + crop.sw + ',' + crop.sh : 'full'}`;
  if (!cropCache.has(key)) {
    const buf = fs.readFileSync(path.join(IMG_DIR, src));
    let img = sharp(buf);
    if (crop) img = img.extract({ left: Math.round(crop.sx), top: Math.round(crop.sy), width: Math.round(crop.sw), height: Math.round(crop.sh) });
    const out = await img
      .resize(Math.round(w), Math.round(h), { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 88 })
      .toBuffer();
    cropCache.set(key, out);
  }
  return cropCache.get(key);
}

const FONT_FACE = {
  'Playfair Display': 'Playfair Display',
  Inter: 'Inter',
};

async function buildSlide(pptx, page) {
  const slide = pptx.addSlide();
  slide.background = { color: hex(C.cream) };

  for (const g of page.groups) {
    for (const b of g.blocks) {
      switch (b.type) {
        case 'rect': {
          const opt = {
            x: b.x * IN, y: b.y * IN, w: Math.max(0.01, b.w * IN), h: Math.max(0.01, b.h * IN),
            fill: b.color && b.color !== 'transparent' ? { color: hex(b.color) } : { type: 'none' },
            line: b.stroke ? { color: hex(b.stroke), width: (b.strokeWidth || 1) * IN } : { type: 'none' },
          };
          slide.addShape(pptx.ShapeType.rect, opt);
          break;
        }
        case 'image': {
          const jpeg = await croppedJpeg(b.src, b.w, b.h, b.crop);
          slide.addImage({
            data: `image/jpeg;base64,${jpeg.toString('base64')}`,
            x: b.x * IN, y: b.y * IN, w: b.w * IN, h: b.h * IN,
          });
          break;
        }
        case 'map': {
          const { renderMapGraphic } = require('./map');
          const g = renderMapGraphic({ x: 0, y: 0, w: b.w, h: b.h });
          slide.addImage({
            data: `image/png;base64,${g.toBuffer('image/png').toString('base64')}`,
            x: b.x * IN, y: b.y * IN, w: b.w * IN, h: b.h * IN,
          });
          if (b.labels) {
            const { mapLabels } = require('./map');
            for (const lb of mapLabels({ x: b.x, y: b.y, w: b.w, h: b.h })) {
              slide.addText(lb.text, {
                x: (lb.align === 'right' ? lb.x - 400 : lb.x) * IN,
                y: (lb.y - 6) * IN,
                w: 400 * IN, h: 0.3,
                fontFace: FONT_FACE[b.labelStyle.family], fontSize: b.labelStyle.size * 72 / PAGE.dpi,
                color: hex(b.labelColor || '#0F3B2E'),
                charSpacing: (b.labelStyle.tracking || 0) * 72 / PAGE.dpi,
                align: lb.align, margin: 0, wrap: false,
              });
            }
          }
          break;
        }
        case 'scrim': {
          // gradients are approximated with a translucent rectangle
          const g = require('./lib').gradientCanvas(b.w, b.h, b.stops, b.vertical !== false);
          const png = g.toBuffer('image/png');
          slide.addImage({
            data: `image/png;base64,${png.toString('base64')}`,
            x: b.x * IN, y: b.y * IN, w: b.w * IN, h: b.h * IN,
          });
          break;
        }
        case 'text': {
          const style = b.style;
          const prepared = prepareText(b);
          const text = prepared.lines.join('\n');
          const lineH = (style.lineHeight || Math.round(style.size * 1.3)) * 72 / PAGE.dpi;
          const ascent = prepared.ascent * 72 / PAGE.dpi;
          const top = b.y * 72 / PAGE.dpi - ascent + lineH * 0.8;
          slide.addText(text, {
            x: b.x * IN,
            y: top / 72,
            w: Math.max(0.5, (b.width || 1200) * IN),
            h: Math.max(0.2, (prepared.lines.length * lineH + 6) / 72),
            fontFace: FONT_FACE[style.family] || style.family,
            fontSize: Math.round(style.size * 72 / PAGE.dpi * 100) / 100,
            color: hex(b.color),
            charSpacing: Math.round(((style.tracking || 0) * 72 / PAGE.dpi) * 100) / 100,
            lineSpacing: Math.round(lineH * 100) / 100,
            align: b.align === 'center' ? 'center' : b.align === 'right' ? 'right' : 'left',
            valign: 'top',
            margin: 0,
            wrap: true,
            bold: style.weight >= 600 && style.family === 'Inter',
            italic: !!style.italic,
            isTextBox: true,
          });
          break;
        }
        default:
          break;
      }
    }
  }
  return slide;
}

async function writePptx(pages, outPath) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'FARVAND_A4', width: PAGE_W, height: PAGE_H });
  pptx.layout = 'FARVAND_A4';
  pptx.author = 'FARVAND';
  pptx.company = 'FARVAND';
  pptx.title = 'FARVAND — Premium Iranian Dates · B2B Export Catalog';
  pptx.subject = 'Iranian date export catalog';

  for (const p of pages) await buildSlide(pptx, p);

  await pptx.writeFile({ fileName: outPath });
  return outPath;
}

module.exports = { writePptx };
