/**
 * Iran growing-regions map — stylised, on-brand.
 * Outline from a public GeoJSON of the Iran border (assets/geo/irn.json),
 * drawn as a deep-green silhouette with gold pins for the date-growing cities.
 */
const fs = require('fs');
const path = require('path');
const { makeCanvas } = require('./lib');
const { C, T, mix } = require('./theme');

const GEO = path.join(__dirname, '..', 'assets', 'geo', 'irn.json');

/* Documented growing cities for the Iranian export date varieties.
 * Coordinates are standard decimal lon/lat. */
const PINS = [
  { lon: 58.35, lat: 29.10, city: 'Bam', province: 'Kerman', grows: 'Mazafati · Kimri · Medjoul', side: 'right', nudge: [14, 8] },
  { lon: 57.08, lat: 30.28, city: 'Kerman', province: 'Kerman', grows: 'Shahani', side: 'left' },
  { lon: 57.74, lat: 28.68, city: 'Jiroft & Kahnoj', province: 'Kerman', grows: 'Shahani · Najafi', side: 'right', nudge: [-12, 12] },
  { lon: 51.22, lat: 29.27, city: 'Dashtestan & Kazerun', province: 'Fars', grows: 'Zahedi · Lasht · Morki', side: 'left' },
  { lon: 53.56, lat: 28.50, city: 'Jahrom', province: 'Fars', grows: 'Harani', side: 'left' },
  { lon: 55.90, lat: 28.35, city: 'Hajiabad', province: 'Hormozgan', grows: 'Piarom', side: 'right' },
  { lon: 62.33, lat: 27.37, city: 'Saravan', province: 'Sistan & Baluchestan', grows: 'Medjoul · Barhi', side: 'right' },
  { lon: 48.30, lat: 30.35, city: 'Abadan & Khorramshahr', province: 'Khuzestan', grows: 'Deglet en-Nour', side: 'left' },
];

function loadOutline() {
  const raw = JSON.parse(fs.readFileSync(GEO, 'utf8'));
  const g = raw.features ? raw.features[0].geometry : (raw.geometry || raw); // bare geometry also fine
  const rings = g.type === 'MultiPolygon' ? g.coordinates.map((p) => p[0]) : [g.coordinates[0]];
  // keep the largest ring only (mainland), and drop duplicate closing point
  const main = rings.reduce((a, b) => (b.length > a.length ? b : a), rings[0]);
  return [main[0][0] === main[main.length - 1][0] && main[0][1] === main[main.length - 1][1] ? main.slice(0, -1) : main];
}

/** Project lon/lat into the box with a simple equirectangular fit. */
function makeProjector(box) {
  const lons = [], lats = [];
  for (const ring of loadOutline()) for (const [lon, lat] of ring) { lons.push(lon); lats.push(lat); }
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const midLat = (minLat + maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180); // equirect correction
  const w = (maxLon - minLon) * kx, h = maxLat - minLat;
  const s = Math.min(box.w / w, box.h / h);
  const ox = box.x + (box.w - w * s) / 2;
  const oy = box.y + (box.h - h * s) / 2;
  return (lon, lat) => ({
    x: ox + (lon - minLon) * kx * s,
    y: oy + (maxLat - lat) * s,
  });
}

/** Draw the map graphic (silhouette + pins, no text) into its own canvas. */
function renderMapGraphic(box) {
  const canvas = makeCanvas(box.w, box.h);
  const ctx = canvas.getContext('2d');
  const project = makeProjector(box);
  const outline = loadOutline();

  // sea/land wash
  ctx.fillStyle = mix(C.green, C.cream, 0.93);
  ctx.fillRect(0, 0, box.w, box.h);

  // silhouette
  for (const ring of outline) {
    ctx.beginPath();
    ring.forEach(([lon, lat], i) => {
      const p = project(lon, lat);
      const x = p.x - box.x, y = p.y - box.y;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle = mix(C.green, C.cream, 0.78);
    ctx.fill();
    ctx.strokeStyle = T.goldDeep;
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }

  // numbered pins
  PINS.forEach((pin, i) => {
    const p = project(pin.lon, pin.lat);
    const x = p.x - box.x, y = p.y - box.y;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = `${T.gold}44`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 21, 0, Math.PI * 2);
    ctx.fillStyle = T.green;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 21, 0, Math.PI * 2);
    ctx.strokeStyle = T.gold;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = C.cream;
    ctx.font = `600 22px "Inter"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i + 1).padStart(2, '0'), x, y + 1);
  });
  return canvas;
}

/** Label positions (document coords) — text layers on top of the graphic. */
function mapLabels(box, projectFn) {
  const project = projectFn || makeProjector(box);
  return PINS.map((pin) => {
    const p = project(pin.lon, pin.lat);
    const nx = pin.nudge ? pin.nudge[0] : 0;
    const ny = pin.nudge ? pin.nudge[1] : 0;
    return {
      text: pin.city.toUpperCase(),
      x: p.x + nx + (pin.side === 'right' ? 26 : -26),
      y: p.y + ny - 16,
      align: pin.side === 'right' ? 'left' : 'right',
      city: pin.city,
      province: pin.province,
      grows: pin.grows,
    };
  });
}

function legendRows() {
  return PINS.map((p) => ({ city: p.city, province: p.province, grows: p.grows }));
}

module.exports = { PINS, renderMapGraphic, mapLabels, legendRows, makeProjector, loadOutline };
