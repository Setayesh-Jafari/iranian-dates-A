/**
 * FARVAND — design system
 * Premium Iranian Dates · B2B Export Catalog
 */

const path = require('path');
const { GlobalFonts } = require('@napi-rs/canvas');

const FONT_DIR = path.join(__dirname, '..', 'node_modules', '@expo-google-fonts');

/* ------------------------------------------------------------------ fonts */
const FONT_FILES = {
  'PlayfairDisplay-Regular': 'playfair-display/400Regular/PlayfairDisplay_400Regular.ttf',
  'PlayfairDisplay-Medium': 'playfair-display/500Medium/PlayfairDisplay_500Medium.ttf',
  'PlayfairDisplay-SemiBold': 'playfair-display/600SemiBold/PlayfairDisplay_600SemiBold.ttf',
  'PlayfairDisplay-Bold': 'playfair-display/700Bold/PlayfairDisplay_700Bold.ttf',
  'Inter-Light': 'inter/300Light/Inter_300Light.ttf',
  'Inter-Regular': 'inter/400Regular/Inter_400Regular.ttf',
  'Inter-Medium': 'inter/500Medium/Inter_500Medium.ttf',
  'Inter-SemiBold': 'inter/600SemiBold/Inter_600SemiBold.ttf',
  'PlayfairDisplay-Italic': 'playfair-display/400Regular_Italic/PlayfairDisplay_400Regular_Italic.ttf',
  'Inter-Italic': 'inter/400Regular_Italic/Inter_400Regular_Italic.ttf',
};

let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  for (const [ps, rel] of Object.entries(FONT_FILES)) {
    GlobalFonts.registerFromPath(path.join(FONT_DIR, rel), ps);
  }
  fontsRegistered = true;
}

/* ----------------------------------------------------------------- colour */
const C = {
  green: '#0F3B2E', // brand deep green
  gold: '#C8A25A', // brand muted gold
  cream: '#F7F3E9', // brand warm cream
  brown: '#5B3A1E', // brand date brown
  white: '#FFFFFF',
  ink: '#2B2118',
};

function hex2rgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function rgb2hex({ r, g, b }) {
  const p = (n) => Math.round(n).toString(16).padStart(2, '0');
  return `#${p(r)}${p(g)}${p(b)}`.toUpperCase();
}
/** mix(a, b, t) -> t=0 gives a, t=1 gives b */
function mix(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b);
  return rgb2hex({
    r: A.r + (B.r - A.r) * t,
    g: A.g + (B.g - A.g) * t,
    b: A.b + (B.b - A.b) * t,
  });
}

/** Tints used across the catalog */
const T = {
  green: C.green,
  greenInk: C.green,
  greenDeep: mix(C.green, '#000000', 0.25),
  greenSoft: mix(C.green, C.cream, 0.9),
  greenWash: mix(C.green, C.cream, 0.96),
  brownInk: C.brown,
  brownMid: mix(C.brown, C.cream, 0.35),
  brownSoft: mix(C.brown, C.cream, 0.62),
  brownFaint: mix(C.brown, C.cream, 0.84),
  rule: mix(C.brown, C.cream, 0.86),
  ruleStrong: mix(C.brown, C.cream, 0.7),
  gold: C.gold,
  goldDeep: mix(C.gold, C.brown, 0.45),
  goldSoft: mix(C.gold, C.cream, 0.45),
  goldWash: mix(C.gold, C.cream, 0.78),
  cream: C.cream,
  creamDim: mix(C.cream, C.brown, 0.1),
  onGreen: C.cream,
  onGreenSoft: mix(C.cream, C.green, 0.32),
  onGreenFaint: mix(C.cream, C.green, 0.55),
};

/* --------------------------------------------------------------- geometry */
const PAGE = {
  w: 2480, // A4 portrait @ 300 dpi
  h: 3508,
  dpi: 300,
  m: 170, // side margin
  get contentW() {
    return this.w - this.m * 2;
  },
};
PAGE.contentW = PAGE.w - PAGE.m * 2;

/* ------------------------------------------------------------ type styles */
/**
 * size / lineHeight in document pixels (300 dpi).
 * tracking = letter spacing in document pixels.
 * ps = PostScript name written into the PSD text layer.
 */
const T_ = {
  displayXL: { family: 'Playfair Display', ps: 'PlayfairDisplay-SemiBold', weight: 600, size: 148, lineHeight: 162, tracking: 0 },
  displayL: { family: 'Playfair Display', ps: 'PlayfairDisplay-SemiBold', weight: 600, size: 104, lineHeight: 118, tracking: 0 },
  h1: { family: 'Playfair Display', ps: 'PlayfairDisplay-SemiBold', weight: 600, size: 88, lineHeight: 102, tracking: 0 },
  h2: { family: 'Playfair Display', ps: 'PlayfairDisplay-SemiBold', weight: 600, size: 60, lineHeight: 72, tracking: 0 },
  h3: { family: 'Playfair Display', ps: 'PlayfairDisplay-SemiBold', weight: 600, size: 40, lineHeight: 50, tracking: 0 },
  h3m: { family: 'Playfair Display', ps: 'PlayfairDisplay-Medium', weight: 500, size: 38, lineHeight: 48, tracking: 0 },
  h4: { family: 'Inter', ps: 'Inter-SemiBold', weight: 600, size: 27, lineHeight: 36, tracking: 0 },
  eyebrow: { family: 'Inter', ps: 'Inter-Medium', weight: 500, size: 23, lineHeight: 30, tracking: 5.2, upper: true },
  eyebrowSm: { family: 'Inter', ps: 'Inter-Medium', weight: 500, size: 19, lineHeight: 26, tracking: 4.4, upper: true },
  body: { family: 'Inter', ps: 'Inter-Regular', weight: 400, size: 27, lineHeight: 42, tracking: 0 },
  bodySm: { family: 'Inter', ps: 'Inter-Regular', weight: 400, size: 24, lineHeight: 37, tracking: 0 },
  caption: { family: 'Inter', ps: 'Inter-Regular', weight: 400, size: 21, lineHeight: 31, tracking: 0 },
  label: { family: 'Inter', ps: 'Inter-Medium', weight: 500, size: 20, lineHeight: 28, tracking: 3.4, upper: true },
  cell: { family: 'Inter', ps: 'Inter-Regular', weight: 400, size: 24, lineHeight: 33, tracking: 0 },
  cellStrong: { family: 'Inter', ps: 'Inter-SemiBold', weight: 600, size: 24, lineHeight: 33, tracking: 0 },
  num: { family: 'Playfair Display', ps: 'PlayfairDisplay-Medium', weight: 500, size: 66, lineHeight: 74, tracking: 0 },
  italic: { family: 'Playfair Display', ps: 'PlayfairDisplay-Italic', weight: 400, size: 26, lineHeight: 38, tracking: 0, italic: true },
  note: { family: 'Playfair Display', ps: 'PlayfairDisplay-Italic', weight: 400, size: 23, lineHeight: 34, tracking: 0, italic: true },
};

module.exports = {
  C, T, PAGE, T_,
  mix, hex2rgb, rgb2hex,
  registerFonts, FONT_FILES, FONT_DIR,
};
