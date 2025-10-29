// Face Generator mit "Wut"-Parameter (0 = fröhlich, 1 = wütend)
// - Eckiger & kritzeliger bei Wut
// - Runder & ruhiger bei Freude

let params = {};
let btn;
let angerSlider; // 0..1

function setup() {
  createCanvas(640, 640);
  angleMode(DEGREES);
  noLoop();

  btn = createButton('Randomizer');
  btn.mousePressed(() => { randomizeParams(); applyEmotion(); redraw(); });

  createSpan('  Anger-meter: ');
  angerSlider = createSlider(0, 1, 0, 0.01);
  angerSlider.input(() => { applyEmotion(); redraw(); });

  randomizeParams();
  applyEmotion();
}

function draw() {
  background(255);
  translate(width/2, height/2);

  drawSpeckles(params.speckleCount);

  const head = drawHead(0, 40, params.headW, params.headH, params.headBump, params.headNoiseScale, params.scribblePasses, params.scribbleJitter);

  drawEars(params, head);    // klebt an der Kontur, 180° rotiert
  drawHair(params, head);    // an der Kontur verankert
  drawEyesGrouped(params);   // Ring -> Pupille -> Braue
  drawNose(params);
  drawMouth(params);
  drawCheeks(params);
}

/* ---------------- PARAMS ---------------- */
function randomizeParams() {
  params.seed = floor(random(1e6));
  noiseSeed(params.seed);
  randomSeed(params.seed);

  params.headW = random(220, 360);
  params.headH = random(260, 420);

  // werden von applyEmotion() überschrieben, hier nur Platzhalter
  params.headBump = 12;
  params.headNoiseScale = 1.0;
  params.shapePower = 2.0;
  params.scribblePasses = 1;
  params.scribbleJitter = 0;

  params.hairStyle = 0; // wir nutzen nur top-sprouts, Länge/Dichte steuert Emotion
  params.hairDensity = 0.5;
  params.hairLen = 30;

  // Augen
  params.eyeSpacing = random(80, 140);
  params.eyeTilt = 0;
  params.eyeW = 36;
  params.eyeH = 22;
  params.pupilR = random(9, 13);
  params.gazeJitter = 0.35;
  params.showLids = true;
  params.browArc = 18;
  params.browGap = 12;
  params.browWeight = 2.5;
  params.irisDot = random() < 0.25;

  // Nase/Mund
  params.noseType = floor(random(0, 4));
  params.noseLen = random(30, 60);
  params.mouthWidth = random(80, 140);
  params.mouthOpen = random(0, 8);
  params.mouthCurve = 10; // wird von Emotion gesetzt
  params.mouthY = random(78, 110);

  // Sonstiges
  params.cheekDots = random() < 0.4;
  params.cheekSize = random(6, 11);
  params.speckleCount = floor(random(10, 25));
}

function applyEmotion() {
  const A = angerSlider ? angerSlider.value() : 0; // 0 = happy, 1 = angry

  // Kopf: runder -> eckiger
  params.shapePower   = lerp(2.0, 3.6, A);      // Superellipse-Exponent
  params.headBump     = lerp(8, 28, A);         // mehr Unruhe
  params.headNoiseScale = lerp(0.8, 1.7, A);

  // Kritzel-Look
  params.scribblePasses = round(lerp(1, 4, A)); // mehr überlagerte Linien
  params.scribbleJitter = lerp(0, 2.3, A);      // Jitter pro Pass in px

  // Haare
  params.hairLen     = lerp(16, 60, A);
  params.hairDensity = lerp(0.3, 1.0, A);

  // Augenbrauen & Blick
  params.browGap     = lerp(16, 6, A);
  params.browArc     = lerp(26, 12, A);
  params.browWeight  = lerp(2, 4, A);
  params.gazeJitter  = lerp(0.45, 0.18, A); // wütend schaut fokussierter
  params.eyeTilt     = lerp(0, -8, A);      // leichter „Zornesblick“

  // Mund
  params.mouthCurve  = lerp(18, -38, A);    // runtergezogene Mundkurve
  params.mouthOpen   = lerp(4, 2, A);
}

/* ---------------- HEAD with Superellipse + scribble ---------------- */
// Superellipse: |x/a|^n + |y/b|^n = 1, n>2 wird „eckiger“
function drawHead(cx, cy, w, h, bump, s, passes = 1, jitter = 0) {
  const steps = 120;
  let pts = [];
  let minY =  1e9, maxY = -1e9;

  // Basis-Punkte berechnen (Weltkoordinaten)
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 360;
    const ca = cos(a), sa = sin(a);
    const n  = params.shapePower;

    // Superellipse-Profil
    const sx = Math.sign(ca) * pow(abs(ca), 2 / n);
    const sy = Math.sign(sa) * pow(abs(sa), 2 / n);

    // Grundellipse
    let x = cx + sx * (w / 2);
    let y = cy + sy * (h / 2);

    // Bump-Noise
    const nx = (ca * 0.5 + 0.5) * s;
    const ny = (sa * 0.5 + 0.5) * s;
    const nn = noise(nx, ny) - 0.5;

    x += nn * bump;        // x-Unruhe
    y += nn * bump * 0.8;  // y-Unruhe

    pts.push(createVector(x, y));
    minY = min(minY, y);
    maxY = max(maxY, y);
  }

  // Kritzel: mehrere leicht versetzte Durchläufe
  stroke(0);
  noFill();
  for (let p = 0; p < passes; p++) {
    strokeWeight(2);
    beginShape();
    for (let i = 0; i < pts.length; i++) {
      const jx = random(-jitter, jitter);
      const jy = random(-jitter, jitter);
      vertex(pts[i].x + jx, pts[i].y + jy);
    }
    endShape();
  }

  return { pts, minY, maxY, center: createVector(cx, cy), w, h };
}

/* ---------------- HAIR (anchored) ---------------- */
function drawHair(p, head) {
  const pts = head.pts, N = pts.length;
  if (N < 3) return;
  const idx = (i) => (i + N) % N;

  let roots = pts.map((pt, i) => ({pt, i})).filter(o => o.pt.y < head.minY + 28);
  const step = floor(map(p.hairDensity, 0.25, 1.0, 4, 1, true));
  roots = roots.filter((_, i) => i % step === 0);

  stroke(0); strokeWeight(3); noFill();

  for (const r of roots) {
    const i = r.i;
    const prev = pts[idx(i-1)], next = pts[idx(i+1)];
    let tx = next.x - prev.x, ty = next.y - prev.y;
    let nx = -ty, ny = tx;
    const L = sqrt(nx*nx + ny*ny) || 1; nx/=L; ny/=L;

    const vx = r.pt.x - head.center.x, vy = r.pt.y - head.center.y;
    if (vx*nx + vy*ny < 0) { nx*=-1; ny*=-1; }

    const len = random(12, p.hairLen);
    const jitter = radians(random(-18, 18));
    const c = cos(degrees(jitter)), s = sin(degrees(jitter));
    const dx = nx*c - ny*s, dy = nx*s + ny*c;

    // leichte Kritzelkopie bei hoher Wut
    const passes = max(1, round(map(p.scribblePasses, 1, 4, 1, 2)));
    for (let k = 0; k < passes; k++) {
      const jx = random(-p.scribbleJitter*0.5, p.scribbleJitter*0.5);
      const jy = random(-p.scribbleJitter*0.5, p.scribbleJitter*0.5);
      line(r.pt.x + jx, r.pt.y + jy, r.pt.x + jx + dx*len, r.pt.y + jy + dy*len);
    }
  }
}

function sampleEvery(arr, k){ if(k<=1) return arr; let out=[]; for(let i=0;i<arr.length;i+=k) out.push(arr[i]); return out; }

/* ---------------- EARS (anchored, 180°) ---------------- */
function drawEars(p, head) {
  const pts = head.pts, N = pts.length;
  const idx = (i) => (i + N) % N;

  const yMin = head.center.y - head.h * 0.05;
  const yMax = head.center.y + head.h * 0.25;
  const band = pts.map((pt,i)=>({pt,i})).filter(o=>o.pt.y>yMin && o.pt.y<yMax);
  if (band.length < 3) return;

  let left  = band.reduce((a,b)=> b.pt.x < a.pt.x ? b : a);
  let right = band.reduce((a,b)=> b.pt.x > a.pt.x ? b : a);
  drawEarAt(left);
  drawEarAt(right);

  function drawEarAt(anchor){
    const i = anchor.i;
    const prev = pts[idx(i-1)], next = pts[idx(i+1)];
    let tx = next.x - prev.x, ty = next.y - prev.y;
    const tangAng = atan2(ty, tx);
    let nx = -ty, ny = tx;
    const L = sqrt(nx*nx + ny*ny) || 1; nx/=L; ny/=L;
    const vx = anchor.pt.x - head.center.x, vy = anchor.pt.y - head.center.y;
    if (vx*nx + vy*ny < 0) { nx*=-1; ny*=-1; }

    const earW = map(head.w, 220, 360, 34, 70, true);
    const earH = map(head.h, 260, 420, 60, 110, true);
    const base = createVector(anchor.pt.x + nx*4, anchor.pt.y + ny*4);

    push();
    translate(base.x, base.y);
    rotate(tangAng + 270); // gewünschte Ausrichtung
    noFill(); stroke(0); strokeWeight(2);

    // Kritzel-Ohr
    const passes = params.scribblePasses;
    for (let p=0; p<passes; p++){
      const jx = random(-params.scribbleJitter, params.scribbleJitter);
      const jy = random(-params.scribbleJitter, params.scribbleJitter);
      push();
      translate(jx, jy);
      beginShape();
      const steps = 24;
      for (let k=0;k<=steps;k++){
        const a = map(k,0,steps,-70,70);
        const r = 1 + noise(k*0.1)*0.15;
        vertex(cos(a)*earW*0.5*r, sin(a)*earH*0.5*r);
      }
      endShape();
      arc(0, 0, earW*0.6, earH*0.5, -90, 60);
      pop();
    }
    pop();
  }
}

/* ---------------- grouped eyes ---------------- */
function drawEyesGrouped(p) {
  push();
  translate(0, -12);

  const ex = p.eyeSpacing / 2;
  const a = p.eyeW/2, b = p.eyeH/2;

  const drawEye = (x) => {
    push(); translate(x,0); rotate(p.eyeTilt);

    // Ring
    noFill(); stroke(0); strokeWeight(2);
    const passes = p.scribblePasses;
    for (let s=0; s<passes; s++){
      const jx = random(-p.scribbleJitter*0.4, p.scribbleJitter*0.4);
      const jy = random(-p.scribbleJitter*0.4, p.scribbleJitter*0.4);
      push(); translate(jx,jy); ellipse(0, 0, p.eyeW, p.eyeH); pop();
    }

    // Pupille in der Ellipse
    const maxR = p.gazeJitter;
    let dx = random(-a*maxR, a*maxR);
    let dy = random(-b*maxR, b*maxR);
    const k = (dx*dx)/(a*a) + (dy*dy)/(b*b);
    if (k > 0.9) { const sc = sqrt(0.9 / k); dx *= sc; dy *= sc; }
    noStroke(); fill(0);
    circle(dx, dy, p.pupilR*2);
    if (p.irisDot) { fill(240,240,0); circle(dx+a*0.25, dy-b*0.15, 6); }

    // Braue
    noFill(); stroke(0); strokeWeight(p.browWeight);
    const gy = -b - p.browGap;
    const span = p.eyeW * 0.9;
    arc(0, gy, span, p.browArc, 200, 340);

    // Lid optional
    if (p.showLids) { strokeWeight(2); arc(0,0,p.eyeW+14,p.eyeH+6,200,340); }
    pop();
  };

  drawEye(-ex);
  drawEye( ex);
  pop();
}

/* ---------------- Nose, Mouth, etc. ---------------- */
function drawNose(p) {
  push(); translate(0, 20); stroke(0); strokeWeight(2); noFill();
  if (p.noseType === 0) line(0, -10, 0, p.noseLen);
  else if (p.noseType === 1) { beginShape(); vertex(-6, -10); vertex(0, p.noseLen * 0.5); vertex(8, p.noseLen); endShape(); }
  else if (p.noseType === 2) arc(0, p.noseLen * 0.3, 26, p.noseLen, 250, 430);
  else ellipse(0, p.noseLen * 0.5, 12, 8);
  pop();
}

function drawMouth(p) {
  push(); translate(0, p.mouthY); stroke(0); strokeWeight(2); noFill();
  const w = p.mouthWidth, c = p.mouthCurve;
  // Kritzelkurve
  for (let s=0; s<p.scribblePasses; s++){
    const jx = random(-p.scribbleJitter, p.scribbleJitter);
    const jy = random(-p.scribbleJitter, p.scribbleJitter);
    beginShape();
    for (let i = 0; i <= 20; i++) {
      const t = map(i, 0, 20, -1, 1);
      const y = (1 - t * t) * (c / 12);
      vertex(jx + t * (w / 2), jy + y);
    }
    endShape();
  }
  if (p.mouthOpen > 2) { fill(0); noStroke(); ellipse(0, 4, constrain(p.mouthOpen, 4, 36), p.mouthOpen); }
  pop();
}

function drawCheeks(p) {
  if (!p.cheekDots) return;
  push(); noStroke(); fill(0);
  const ex = p.eyeSpacing / 2 + 14;
  circle(-ex, 40, p.cheekSize);
  circle( ex, 40, p.cheekSize);
  pop();
}

function drawSpeckles(n) {
  push(); stroke(0, 20);
  for (let i=0;i<n;i++){
    const x = random(-width/2+20, width/2-20);
    const y = random(-height/2+20, height/2-20);
    point(x,y);
  }
  pop();
}

function keyPressed(){ if(key==='r'||key==='R'){ randomizeParams(); applyEmotion(); redraw(); } }
