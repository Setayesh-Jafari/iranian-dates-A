/**
 * PSD builder — converts the page model into a layered Photoshop document.
 *
 * Every text element becomes a REAL Photoshop type layer (Type Tool) with:
 *   • the live string, font, size, tracking, leading and colour
 *   • a matching rasterised cache so the file looks right in any viewer
 *   • a descriptive layer name (e.g. "TXT · Page title")
 *
 * Geometry notes (validated against Photoshop-authored PSD files):
 *   • font sizes in the text engine are POINTS; pixels = points × dpi / 72
 *   • tracking is in 1/1000 em
 *   • the text transform is the pen origin (x, first baseline)
 */
const fs = require('fs');
const { writePsdBuffer } = require('ag-psd');
const { makeCanvas, prepareText, renderTextLayer, drawImageCover, gradientCanvas } = require('./lib');
const { hex2rgb } = require('./theme');
const { PAGE } = require('./theme');
const { getImage } = require('./render');

const pt = (px) => (px * 72) / PAGE.dpi;

function rectLayer(block) {
  const w = Math.max(1, Math.round(block.w));
  const h = Math.max(1, Math.round(block.h));
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  if (block.color && block.color !== 'transparent') {
    ctx.fillStyle = block.color;
    ctx.fillRect(0, 0, w, h);
  }
  if (block.stroke) {
    ctx.strokeStyle = block.stroke;
    ctx.lineWidth = block.strokeWidth || 1;
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
  }
  return {
    name: block.name || 'RECT',
    left: Math.round(block.x),
    top: Math.round(block.y),
    right: Math.round(block.x + w),
    bottom: Math.round(block.y + h),
    canvas,
  };
}

async function imageLayer(block) {
  const img = await getImage(block.src);
  const w = Math.max(1, Math.round(block.w));
  const h = Math.max(1, Math.round(block.h));
  const canvas = makeCanvas(w, h);
  const ctx = canvas.getContext('2d');
  drawImageCover(ctx, img, 0, 0, w, h);
  return {
    name: block.name || `IMG · ${block.src}`,
    left: Math.round(block.x),
    top: Math.round(block.y),
    right: Math.round(block.x + w),
    bottom: Math.round(block.y + h),
    canvas,
  };
}

function scrimLayer(block) {
  const w = Math.max(1, Math.round(block.w));
  const h = Math.max(1, Math.round(block.h));
  const canvas = gradientCanvas(w, h, block.stops, block.vertical !== false);
  return {
    name: block.name || 'OVERLAY · Scrim',
    left: Math.round(block.x),
    top: Math.round(block.y),
    right: Math.round(block.x + w),
    bottom: Math.round(block.y + h),
    canvas,
  };
}

function textLayer(block) {
  const prepared = prepareText(block);
  const { canvas, left, top, right, bottom } = renderTextLayer(block, prepared);
  const style = block.style;
  const color = hex2rgb(block.color);
  return {
    name: block.name || 'TXT',
    left, top, right, bottom,
    canvas,
    text: {
      text: prepared.lines.join('\n'),
      transform: [1, 0, 0, 1, block.x, prepared.baselines[0]],
      left: 0, top: 0, right: 0, bottom: 0,
      style: {
        font: { name: style.ps, script: 0, type: 0, synthetic: 0 },
        fontSize: pt(style.size),
        fillColor: { r: color.r, g: color.g, b: color.b },
        tracking: Math.round(((style.tracking || 0) / style.size) * 1000),
        autoKerning: true,
        autoLeading: false,
        leading: pt(style.lineHeight || Math.round(style.size * 1.3)),
      },
      paragraphStyle: { justification: 'left' },
    },
  };
}

async function blockToLayer(block) {
  switch (block.type) {
    case 'rect': return rectLayer(block);
    case 'image': return imageLayer(block);
    case 'scrim': return scrimLayer(block);
    case 'text': return textLayer(block);
    default: return null;
  }
}

/** Build the ag-psd document for a page. */
async function buildPsdDocument(page) {
  const children = [];
  for (const g of page.groups) {
    const groupChildren = [];
    for (const b of g.blocks) {
      const layer = await blockToLayer(b);
      if (layer) groupChildren.push(layer);
    }
    children.push({ name: g.name, opened: true, children: groupChildren });
  }
  return {
    width: PAGE.w,
    height: PAGE.h,
    imageResources: {
      resolutionInfo: {
        horizontalResolution: PAGE.dpi,
        horizontalResolutionUnit: 'PPI',
        widthUnit: 'Centimeters',
        verticalResolution: PAGE.dpi,
        verticalResolutionUnit: 'PPI',
        heightUnit: 'Centimeters',
      },
    },
    children,
  };
}

/** Write the PSD for a page to disk. */
async function writePsd(page, outPath) {
  const psd = await buildPsdDocument(page);
  // Embed the merged composite: viewers that do not render layers (Finder,
  // Bridge, Drive preview, some PDF exporters) read this image directly.
  const { renderPage } = require('./render');
  psd.canvas = await renderPage(page);
  const buffer = writePsdBuffer(psd, {
    generateThumbnail: true,
    compress: true,          // ZIP layer compression — far smaller files
    noBackground: true,      // keep the bottom layer editable
    trimImageData: true,
  });
  fs.mkdirSync(require('path').dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
  return buffer.length;
}

module.exports = { buildPsdDocument, writePsd };
