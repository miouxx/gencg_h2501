// Angular p5 clock, clearer weights, simpler center

let lastSecond = -1;
let stepRotation = 0;
const SEG = 60;
const dust = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));
  for (let i = 0; i < 120; i++) dust.push(makeDust());
}
function windowResized() { resizeCanvas(windowWidth, windowHeight); }

function draw() {
  background(7, 11, 9);
  translate(width / 2, height / 2);

  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const ms = now.getMilliseconds();
  const secFrac = s + ms / 1000;
  const hr12 = (h % 12) + m / 60;

  if (s !== lastSecond) { stepRotation -= 360 / SEG; lastSecond = s; }

  const R = min(width, height) * 0.38;

  // backdrop
  noStroke();
  for (let i = 0; i < 5; i++) {
    const r = R * (0.95 + i * 0.12);
    fill(20, 255, 150, 14 - i * 2);
    circle(0, 0, r * 2);
  }

  // dust
  blendMode(ADD);
  for (const p of dust) {
    p.a += p.va; p.r += p.vr; p.t += p.vt;
    const x = cos(p.a) * p.r;
    const y = sin(p.a) * p.r + sin(frameCount * p.t) * 2;
    noStroke(); fill(120, 255, 190, p.alpha); circle(x, y, p.size);
    if (p.r > R * 1.4 || p.r < R * 0.45) p.vr *= -1;
  }
  blendMode(BLEND);

  // cleaner overlays, fewer layers
  drawOverlays(R);

  // outer rotating 60-gon ticks
  push(); rotate(stepRotation); drawSixtyGonTicks(R, s); pop();

  // thicker minutes and hours
  drawSteppedRing(R * 0.78, 60, m + secFrac / 60, 4.5, color(100, 255, 190), color(40, 160, 110)); // was ~2.2
  drawSteppedRing(R * 0.60, 12, hr12,          6.0, color(70, 255, 170),  color(35, 140, 100));   // was ~3

  // seconds bead + sight
  drawSecondIndicator(R, secFrac);

  // simpler core, less busy
  const pulse = 1 + 0.06 * sin(frameCount * 6);
  drawAngularCore(R * 0.18 * pulse);

  drawReadout(h, m, s, R);
}

// ---------- pieces ----------

function drawSixtyGonTicks(radius, secondNow) {
  noFill();
  stroke(40, 255, 160, 12); strokeWeight(18); polygon(60, radius);
  stroke(40, 255, 160, 8);  strokeWeight(26); polygon(60, radius * 0.985);

  const step = 360 / 60;
  for (let i = 0; i < 60; i++) {
    const a = i * step - 90;
    const active = i <= secondNow;
    const major = i % 5 === 0;
    const len = active ? 22 : 12;
    const w = active ? 3 : 1.4;
    const col = active ? [110, 255, 190] : [60, 170, 120];

    push();
    rotate(a + 90);
    stroke(col[0], col[1], col[2], major ? 220 : 160);
    strokeWeight(w * (major ? 1.5 : 1));
    line(0, -radius + 8, 0, -radius + 8 + len + (major ? 8 : 0));
    noStroke(); fill(col[0], col[1], col[2], active ? 200 : 90);
    rectMode(CENTER);
    rect(0, -radius + 36, major ? 8 : 4, major ? 10 : 6);
    pop();
  }
}

function drawSteppedRing(r, sides, value, weight, colActive, colIdle) {
  noFill(); stroke(60, 200, 150, 80); strokeWeight(1); polygon(sides, r);

  const full = floor(value);
  const frac = value - full;
  const pts = polyPoints(sides, r);

  stroke(red(colIdle), green(colIdle), blue(colIdle), 140);
  strokeWeight(weight);
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    if (i > full) line(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
  }

  stroke(red(colActive), green(colActive), blue(colActive), 235);
  for (let i = 0; i < full; i++) {
    const j = (i + 1) % sides;
    line(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
  }

  if (frac > 0) {
    const i = full % sides;
    const j = (i + 1) % sides;
    const x = lerp(pts[i].x, pts[j].x, frac);
    const y = lerp(pts[i].y, pts[j].y, frac);
    line(pts[i].x, pts[i].y, x, y);
  }
}

function drawSecondIndicator(R, secFrac) {
  // sight at top
  push(); noFill(); stroke(140, 255, 210, 180); strokeWeight(2);
  const sightR = R * 1.02;
  line(-10, -sightR, 0, -sightR - 12);
  line(10, -sightR, 0, -sightR - 12);
  pop();

  // bead on 60-gon path
  const a = map(secFrac, 0, 60, 0, 360) - 90;
  const { x, y } = pointOnPolygon(60, R, a);

  noStroke();
  for (let i = 5; i >= 1; i--) {
    fill(140, 255, 210, 24 + i * 18);
    circle(x, y, 4 + i * 2.2);
  }
  fill(230, 255, 230); circle(x, y, 6);

  push(); translate(x, y); rotate(a + 90);
  noStroke(); fill(110, 255, 190, 230);
  triangle(-6, 10, 6, 10, 0, -10);
  pop();
}

// simpler, less busy
function drawAngularCore(r) {
  noFill();
  stroke(120, 255, 190, 140); strokeWeight(3); polygon(6, r * 1.45);
  stroke(170, 255, 210, 200); strokeWeight(2); starPolygon(8, 3, r * 1.05);
  // one small triangle for heartbeat
  stroke(200, 255, 230, 220); strokeWeight(1.5); polygon(3, r * 0.78, frameCount * 1.1);
}

// overlays, trimmed down
function drawOverlays(R) {
  push(); noFill();
  stroke(90, 255, 180, 90); strokeWeight(1.6);
  polygon(4, R * 0.92, frameCount * 0.25);
  polygon(4, R * 0.84, -frameCount * 0.35);

  stroke(90, 255, 180, 100); strokeWeight(1.4);
  polygon(3, R * 0.70, frameCount * 0.5);

  // lighter web, fewer rings
  stroke(120, 255, 200, 90); strokeWeight(1.2);
  starPolygon(9, 2, R * 0.62, frameCount * 0.25);

  stroke(60, 200, 140, 60); strokeWeight(1.2);
  for (let i = 0; i < 3; i++) polygon(24, R * (0.38 + i * 0.08));
  pop();
}

// ---------- helpers ----------
function polygon(n, r, rot = 0) {
  beginShape();
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 360 / n) - 90;
    vertex(cos(a) * r, sin(a) * r);
  }
  endShape(CLOSE);
}
function polyPoints(n, r, rot = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 360 / n) - 90;
    pts.push({ x: cos(a) * r, y: sin(a) * r });
  }
  return pts;
}
function pointOnPolygon(n, r, a) {
  const step = 360 / n;
  let i = floor((((a + 90) % 360) + 360) % 360 / step);
  let a0 = i * step - 90;
  let a1 = (i + 1) * step - 90;
  const p0 = { x: cos(a0) * r, y: sin(a0) * r };
  const p1 = { x: cos(a1) * r, y: sin(a1) * r };
  const t = ((a - a0 + 360) % 360) / step;
  return { x: lerp(p0.x, p1.x, t), y: lerp(p0.y, p1.y, t) };
}
function starPolygon(n, step, r, rot = 0) {
  const pts = polyPoints(n, r, rot);
  for (let i = 0; i < n; i++) {
    const j = (i + step) % n;
    line(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
  }
}
function drawReadout(h, m, s, R) {
  push();
  translate(0, R * 0.44);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(180, 255, 220, 200);
  textSize(max(14, min(width, height) * 0.03));
  text(`${pad(h)}:${pad(m)}:${pad(s)}`, 0, 0);
  pop();
}
function pad(n) { return (n < 10 ? '0' : '') + n; }
function makeDust() {
  const baseR = min(width, height) * 0.38;
  return {
    a: random(360), va: random(-0.25, 0.5),
    r: random(baseR * 0.55, baseR * 1.2), vr: random(-0.15, 0.2),
    t: random(0.005, 0.02), vt: random(0.0003, 0.001),
    size: random(1, 3), alpha: random(30, 110)
  };
}
