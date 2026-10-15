/**
 * FARVAND catalog builder.
 *   node build.js            → previews + PSD + PDF + PPTX
 *   node build.js --psd-only
 */
const fs = require('fs');
const path = require('path');
const { PAGES } = require('./src/pages');
const { renderPage } = require('./src/render');
const { writePsd } = require('./src/psd');
const { buildMark } = require('./src/mark');
const { PAGE } = require('./src/theme');
const sharp = require('sharp');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'out');
const PSD_DIR = path.join(OUT, 'psd');
const PREVIEW_DIR = path.join(OUT, 'preview');

function ensureDirs() {
  for (const d of [OUT, PSD_DIR, PREVIEW_DIR, path.join(OUT, 'pdf'), path.join(OUT, 'pptx')]) {
    fs.mkdirSync(d, { recursive: true });
  }
}

async function main() {
  ensureDirs();
  const t0 = Date.now();

  // 1. brand mark
  const markPath = path.join(ROOT, 'assets', 'img', 'mark.png');
  buildMark(markPath, '#C8A25A', 1200);
  console.log('• brand mark written');

  const only = process.argv.includes('--psd-only');
  const pages = PAGES;

  for (const page of pages) {
    // 2. preview (50% scale — enough to review, a quarter of the pixels)
    const canvas = await renderPage(page);
    const half = await sharp(canvas.toBuffer('image/png'))
      .resize(Math.round(PAGE.w / 2), Math.round(PAGE.h / 2), { fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(path.join(PREVIEW_DIR, `${page.file}.png`), half);

    // 3. PSD
    const size = await writePsd(page, path.join(PSD_DIR, `${page.file}.psd`));
    console.log(`• ${page.id} ${page.title.padEnd(22)} psd ${(size / 1024 / 1024).toFixed(1)} MB`);
  }

  if (!only) {
    const { writePdf } = require('./src/pdf');
    await writePdf(pages, path.join(OUT, 'pdf', 'FARVAND_Export_Dates_Catalog.pdf'));
    console.log('• PDF written');

    const { writePptx } = require('./src/pptx');
    await writePptx(pages, path.join(OUT, 'pptx', 'FARVAND_Export_Dates_Catalog.pptx'));
    console.log('• PPTX written');
  }

  console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
