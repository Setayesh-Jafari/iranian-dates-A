/**
 * Canvas renderer — draws a page model onto a 2D context.
 * The same routine backs the PNG previews, the PDF and the rasterised
 * cache of every PSD text layer, so all three stay pixel-consistent.
 */
const path = require('path');
const { makeCanvas, drawText, prepareText, drawImageCover, gradientCanvas, loadImage } = require('./lib');
const { PAGE, C, T } = require('./theme');

const IMG_DIR = path.join(__dirname, '..', 'assets', 'img');

const imageCache = new Map();
async function getImage(src) {
  if (!imageCache.has(src)) {
    imageCache.set(src, await loadImage(path.join(IMG_DIR, src)));
  }
  return imageCache.get(src);
}

/** Draw a single block. `assets` resolves images. */
async function drawBlock(ctx, block, assets) {
  switch (block.type) {
    case 'rect': {
      const w = Math.round(block.w);
      const h = Math.round(block.h);
      if (block.color && block.color !== 'transparent') {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, w, h);
      }
      if (block.stroke) {
        ctx.strokeStyle = block.stroke;
        ctx.lineWidth = block.strokeWidth || 1;
        ctx.strokeRect(block.x + ctx.lineWidth / 2, block.y + ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
      }
      break;
    }
    case 'image': {
      const img = await assets(block.src);
      if (block.opacity !== undefined) {
        ctx.save();
        ctx.globalAlpha = block.opacity;
        drawImageCover(ctx, img, block.x, block.y, block.w, block.h);
        ctx.restore();
      } else {
        drawImageCover(ctx, img, block.x, block.y, block.w, block.h);
      }
      break;
    }
    case 'scrim': {
      const g = gradientCanvas(block.w, block.h, block.stops, block.vertical !== false);
      ctx.drawImage(g, block.x, block.y);
      break;
    }
    case 'text': {
      const prepared = block.prepared || prepareText(block);
      drawText(ctx, block, prepared);
      break;
    }
    default:
      throw new Error(`Unknown block type: ${block.type}`);
  }
}

/** Render a full page to a canvas. */
async function renderPage(page) {
  const canvas = makeCanvas(PAGE.w, PAGE.h);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, PAGE.w, PAGE.h);
  const assets = getImage;
  for (const g of page.groups) {
    for (const b of g.blocks) await drawBlock(ctx, b, assets);
  }
  return canvas;
}

module.exports = { renderPage, drawBlock, getImage, IMG_DIR };
