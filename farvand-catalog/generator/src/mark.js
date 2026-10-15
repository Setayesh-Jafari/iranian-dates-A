/**
 * FARVAND compass mark — drawn procedurally so it stays vector-crisp and
 * can be recoloured in Photoshop (it is embedded as a transparent PNG layer).
 */
const fs = require('fs');
const path = require('path');
const { makeCanvas } = require('./lib');
const { C, T } = require('./theme');

function drawMark(ctx, size, color) {
  const c = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';

  // outer ring
  ctx.lineWidth = size * 0.022;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.44, 0, Math.PI * 2);
  ctx.stroke();

  // inner ring
  ctx.lineWidth = size * 0.012;
  ctx.beginPath();
  ctx.arc(c, c, size * 0.30, 0, Math.PI * 2);
  ctx.stroke();

  // compass rays: long vertical, shorter horizontal
  const ray = (angle, len, wide) => {
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, -len);
    ctx.lineTo(wide, 0);
    ctx.lineTo(0, len * 0.16);
    ctx.lineTo(-wide, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  ray(0, size * 0.40, size * 0.052);
  ray(Math.PI, size * 0.40, size * 0.052);
  ray(Math.PI / 2, size * 0.28, size * 0.042);
  ray(-Math.PI / 2, size * 0.28, size * 0.042);

  // centre point
  ctx.beginPath();
  ctx.arc(c, c, size * 0.035, 0, Math.PI * 2);
  ctx.fill();
}

function buildMark(outPath, color = C.gold, size = 1200) {
  const canvas = makeCanvas(size, size);
  const ctx = canvas.getContext('2d');
  drawMark(ctx, size, color);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  return outPath;
}

if (require.main === module) {
  const out = path.join(__dirname, '..', 'assets', 'img', 'mark.png');
  buildMark(out, C.gold, 1200);
  console.log('wrote', out);
}

module.exports = { buildMark, drawMark };
