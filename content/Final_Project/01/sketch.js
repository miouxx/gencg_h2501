// Split view
// Left: 3D Earth simulation
// Right: 2D atom style with "pencil trails" that build up over repeated passes

let earthTex, moonTex;

let epoch;
const DAY_MS = 24 * 60 * 60 * 1000;

// UI
let speedSlider;
let speedLabelDiv;
let minSpeed = 1;
let maxSpeed = 1000;

// Panels
let simG;        // WEBGL left
let atomG;       // 2D right (final composited view)
let atomInkG;    // 2D right (persistent ink layer)

// Sizes computed to fit
let earthRadius;
let moonRadius;
let moonDistance;

// 2D atom scaling
let atomBaseR = 100;
let atomEarthR = 40;
const ATOM_SQUASH = 0.62;

// Warm "sun" light direction
let sunDir;

// Stars for left panel
let starfield = [];

// Satellites
let satellites = [
  { name: "ISS",    altitudeFactor: 1.6, periodMin: 92.68, inclinationDeg: 51.6, colorHue: 40  },
  { name: "GPS",    altitudeFactor: 3.2, periodMin: 720,   inclinationDeg: 55,   colorHue: 200 },
  { name: "SpySat", altitudeFactor: 2.0, periodMin: 120,   inclinationDeg: 98,   colorHue: 330 }
];

// Right side orbit "pencils" state
let orbitStates = []; // one per satellite + moon

function preload() {
  earthTex = loadImage("earthmap.jpg");
  moonTex  = loadImage("moonmap.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  epoch = new Date("2025-01-01T00:00:00Z");
  sunDir = createVector(1.0, 0.2, -0.3).normalize();

  makePanels();
  resetInk();

  speedSlider = createSlider(minSpeed, maxSpeed, 1, 1);
  speedSlider.position(20, 145);
  speedSlider.style("width", "220px");

  speedLabelDiv = createDiv("");
  speedLabelDiv.position(20, 120);
  speedLabelDiv.style("color", "white");
  speedLabelDiv.style("font-family", "monospace");
  speedLabelDiv.style("font-size", "12px");
}

function makePanels() {
  let wLeft = floor(windowWidth / 2);
  let wRight = windowWidth - wLeft;
  let h = windowHeight;

  simG = createGraphics(wLeft, h, WEBGL);
  atomG = createGraphics(wRight, h);
  atomInkG = createGraphics(wRight, h);

  simG.angleMode(RADIANS);
  simG.colorMode(HSB, 360, 100, 100, 100);
  simG.smooth();

  atomG.angleMode(RADIANS);
  atomG.colorMode(RGB, 255);
  atomG.smooth();

  atomInkG.angleMode(RADIANS);
  atomInkG.colorMode(RGB, 255);
  atomInkG.smooth();

  atomG.strokeCap(ROUND);
  atomG.strokeJoin(ROUND);
  atomInkG.strokeCap(ROUND);
  atomInkG.strokeJoin(ROUND);

  // Fit left panel so largest orbit (3.2x) fits with margin
  let minDimLeft = min(simG.width, simG.height);
  let marginLeft = minDimLeft * 0.07;
  let maxRadLeft = (minDimLeft * 0.5) - marginLeft;
  earthRadius = maxRadLeft / 3.2;

  moonRadius = earthRadius * 0.27;
  moonDistance = earthRadius * 3.2;

  // Fit right panel similarly
  let minDimRight = min(atomG.width, atomG.height);
  let marginRight = minDimRight * 0.10;
  let maxRadRight = (minDimRight * 0.5) - marginRight;
  atomBaseR = maxRadRight / 3.2;
  atomEarthR = atomBaseR * 0.55;

  initStarfield(650);
}

function resetInk() {
  atomInkG.clear(); // transparent
  orbitStates = [];

  // one per satellite
  for (let i = 0; i < satellites.length; i++) {
    orbitStates.push({
      prevPhase: null
    });
  }
  // one for moon
  orbitStates.push({
    prevPhase: null
  });
}

function initStarfield(count) {
  starfield = [];
  let r = max(simG.width, simG.height) * 2.4;

  for (let i = 0; i < count; i++) {
    let theta = random(TWO_PI);
    let phi = random(PI);
    let x = r * sin(phi) * cos(theta);
    let y = r * sin(phi) * sin(theta);
    let z = r * cos(phi);
    let size = random(1, 2.5);
    let brightness = random(40, 100);
    starfield.push({ x, y, z, size, brightness });
  }
}

function draw() {
  background(0);

  let speedMult = speedSlider.value();
  if (speedMult === minSpeed) {
    speedLabelDiv.html("Rotation speed: real Earth rotation");
  } else {
    speedLabelDiv.html("Rotation speed: " + speedMult.toFixed(0) + "x");
  }

  let now = new Date();
  let timeData = computeTimeData(now, speedMult);

  renderWorldLeft(simG, timeData);
  renderAtomRight(atomG, atomInkG, timeData);

  image(simG, 0, 0);
  image(atomG, simG.width, 0);

  stroke(255, 40);
  line(simG.width, 0, simG.width, height);

  drawHUD2D(now);
}

function computeTimeData(now, speedMult) {
  // Simulation uses UTC internally, display uses local time
  let h = now.getUTCHours();
  let m = now.getUTCMinutes();
  let s = now.getUTCSeconds();
  let ms = now.getUTCMilliseconds();

  let daySeconds = h * 3600 + m * 60 + s + ms / 1000;
  let dayFrac = daySeconds / 86400;

  let earthAngle = dayFrac * TWO_PI * speedMult;

  let elapsedMs = now.getTime() - epoch.getTime();
  let elapsedDays = elapsedMs / DAY_MS;
  let elapsedMinutes = elapsedMs / (60 * 1000);

  let moonAngle = (elapsedDays / 27.321661) * TWO_PI * speedMult;

  return {
    earthAngle,
    moonAngle,
    elapsedMinutes,
    speedMult
  };
}

/* =========================
   LEFT PANEL, 3D WORLD
   ========================= */

function renderWorldLeft(g, t) {
  g.background(0);

  let camZ = earthRadius * 6.0;
  g.camera(0, 0, camZ, 0, 0, 0, 0, 1, 0);

  drawStarfield3D(g);

  drawEarth3D(g, t);
  drawMoon3D(g, t);
  drawSatellites3D(g, t);
}

function drawStarfield3D(g) {
  g.noStroke();
  for (let s of starfield) {
    g.push();
    g.translate(s.x, s.y, s.z);
    let twinkle = 0.7 + 0.3 * sin(millis() * 0.002 + s.x * 0.001);
    let alpha = 40 + 40 * twinkle;
    g.fill(210, 5, s.brightness, alpha);
    g.sphere(s.size, 3, 3);
    g.pop();
  }
}

function applySunLight(g, ambientLvl) {
  g.ambientLight(ambientLvl);
  g.directionalLight(255, 220, 120, sunDir.x, sunDir.y, sunDir.z);
}

function drawEarth3D(g, t) {
  g.push();

  g.rotateZ(radians(23.5));
  g.rotateY(t.earthAngle);

  applySunLight(g, 6);

  g.noStroke();
  if (earthTex) g.texture(earthTex);
  g.sphere(earthRadius, 64, 64);

  // subtle atmosphere
  g.push();
  g.noLights();
  g.blendMode(ADD);
  g.noStroke();
  g.fill(200, 80, 100, 8);
  g.sphere(earthRadius * 1.03, 48, 48);
  g.blendMode(BLEND);
  g.pop();

  g.pop();
}

function drawMoon3D(g, t) {
  g.push();

  g.rotateZ(radians(5));

  g.stroke(0, 0, 80, 40);
  g.noFill();
  g.beginShape();
  for (let a = 0; a <= TWO_PI + 0.1; a += TWO_PI / 160) {
    g.vertex(cos(a) * moonDistance, 0, sin(a) * moonDistance);
  }
  g.endShape();

  let angle = t.moonAngle;
  g.translate(cos(angle) * moonDistance, 0, sin(angle) * moonDistance);

  applySunLight(g, 4);

  g.noStroke();
  if (moonTex) g.texture(moonTex);
  g.sphere(moonRadius, 32, 32);

  g.pop();
}

function drawSatellites3D(g, t) {
  let elapsedMinutes = t.elapsedMinutes;
  let speedMult = t.speedMult;

  for (let sat of satellites) {
    let phase = (elapsedMinutes / sat.periodMin) * TWO_PI * speedMult;

    g.push();
    g.rotateX(radians(sat.inclinationDeg));

    g.stroke(sat.colorHue, 40, 70, 40);
    g.noFill();
    g.beginShape();
    for (let a = 0; a <= TWO_PI + 0.1; a += TWO_PI / 160) {
      let r = earthRadius * sat.altitudeFactor;
      g.vertex(cos(a) * r, 0, sin(a) * r);
    }
    g.endShape();

    let r = earthRadius * sat.altitudeFactor;
    g.translate(cos(phase) * r, 0, sin(phase) * r);

    applySunLight(g, 4);

    g.noStroke();
    let pulse = 0.5 + 0.5 * sin(millis() * 0.005 + sat.altitudeFactor * 10);
    g.fill(sat.colorHue, 80, 100, 100);
    g.sphere(earthRadius * 0.05 * pulse, 12, 12);

    g.fill(sat.colorHue, 40, 90, 90);
    g.box(earthRadius * 0.09, earthRadius * 0.01, earthRadius * 0.02);

    g.pop();
  }
}

/* =========================
   RIGHT PANEL, 2D ATOM STYLE
   Pencil trails that build up
   ========================= */

function renderAtomRight(g, ink, t) {
  // Compose: white background + persistent ink + black nucleus and dots
  g.background(255);
  g.image(ink, 0, 0);

  let cx = g.width / 2;
  let cy = g.height / 2;

  // Compute ink strength based on speed.
  // Higher speed draws with lower alpha so it does not instantly appear fully drawn.
  let speed = max(1, t.speedMult);
  let inkAlpha = constrain(30 / sqrt(speed), 2, 18);
  let inkWeight = max(0.6, 1.4 / pow(speed, 0.12));

  // Update ink for each satellite
  for (let i = 0; i < satellites.length; i++) {
    let sat = satellites[i];

    let rx = atomBaseR * sat.altitudeFactor;
    let ry = rx * ATOM_SQUASH;
    let tilt = map(sat.inclinationDeg, 0, 120, -PI / 3, PI / 3);

    let phaseUnwrapped = (t.elapsedMinutes / sat.periodMin) * TWO_PI * t.speedMult;

    inkOrbitSegment(ink, orbitStates[i], cx, cy, rx, ry, tilt, phaseUnwrapped, inkAlpha, inkWeight);
  }

  // Moon ink
  {
    let idx = satellites.length;
    let rx = atomBaseR * 3.2;
    let ry = rx * ATOM_SQUASH;
    let tilt = radians(25);

    let phaseUnwrapped = t.moonAngle;
    inkOrbitSegment(ink, orbitStates[idx], cx, cy, rx, ry, tilt, phaseUnwrapped, inkAlpha, inkWeight);
  }

  // Draw the nucleus (Earth) on top so orbits look like they pass behind it
  g.noStroke();
  g.fill(0);
  g.circle(cx, cy, atomEarthR * 2);

  // Dots on top (the pencil tips)
  for (let i = 0; i < satellites.length; i++) {
    let sat = satellites[i];

    let rx = atomBaseR * sat.altitudeFactor;
    let ry = rx * ATOM_SQUASH;
    let tilt = map(sat.inclinationDeg, 0, 120, -PI / 3, PI / 3);

    let phaseUnwrapped = (t.elapsedMinutes / sat.periodMin) * TWO_PI * t.speedMult;
    drawDot2D(g, cx, cy, rx, ry, tilt, phaseUnwrapped, atomEarthR * 0.22);
  }

  // Moon dot
  {
    let rx = atomBaseR * 3.2;
    let ry = rx * ATOM_SQUASH;
    let tilt = radians(25);
    drawDot2D(g, cx, cy, rx, ry, tilt, t.moonAngle, atomEarthR * 0.32);
  }

  // Center dot for atom symbol vibe
  g.noStroke();
  g.fill(0);
  g.circle(cx, cy, atomEarthR * 0.22);
}

function inkOrbitSegment(ink, state, cx, cy, rx, ry, tilt, phaseUnwrapped, alpha, weight) {
  if (state.prevPhase === null) {
    state.prevPhase = phaseUnwrapped;
    return;
  }

  let prev = state.prevPhase;
  let curr = phaseUnwrapped;
  state.prevPhase = curr;

  let d = curr - prev;
  if (abs(d) < 0.00001) return;

  // Subdivide so even at high speed we draw smooth curves, not long chords
  // Cap steps for performance
  let maxSteps = 240;
  let desiredStep = 0.08; // radians
  let steps = ceil(abs(d) / desiredStep);
  steps = constrain(steps, 1, maxSteps);

  // Dynamic stroke setup
  ink.stroke(0, alpha);
  ink.strokeWeight(weight);
  ink.noFill();
  ink.strokeCap(ROUND);
  ink.strokeJoin(ROUND);

  for (let i = 1; i <= steps; i++) {
    let a1 = prev + d * ((i - 1) / steps);
    let a2 = prev + d * (i / steps);

    let p1 = orbitPointWorld(cx, cy, rx, ry, tilt, a1);
    let p2 = orbitPointWorld(cx, cy, rx, ry, tilt, a2);

    // A tiny perpendicular jitter makes repeated passes feel like real sketching
    drawInkLineWithJitter(ink, p1, p2, alpha, weight);
  }
}

function drawInkLineWithJitter(ink, p1, p2, alpha, weight) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  let len = sqrt(dx * dx + dy * dy);
  if (len < 0.0001) return;

  let nx = -dy / len;
  let ny = dx / len;

  // Center line
  ink.stroke(0, alpha);
  ink.strokeWeight(weight);
  ink.line(p1.x, p1.y, p2.x, p2.y);

  // Two super faint offset lines, creates "thickening" when it overlaps over time
  let jitterAmp = 0.9;
  for (let k = 0; k < 2; k++) {
    let off = randomGaussian(0, jitterAmp);
    ink.stroke(0, alpha * 0.65);
    ink.strokeWeight(max(0.4, weight * 0.75));
    ink.line(p1.x + nx * off, p1.y + ny * off, p2.x + nx * off, p2.y + ny * off);
  }
}

function orbitPointWorld(cx, cy, rx, ry, tilt, angle) {
  // local ellipse
  let lx = rx * cos(angle);
  let ly = ry * sin(angle);

  // rotate by tilt into world
  let ct = cos(tilt);
  let st = sin(tilt);

  let wx = cx + lx * ct - ly * st;
  let wy = cy + lx * st + ly * ct;

  return { x: wx, y: wy };
}

function drawDot2D(g, cx, cy, rx, ry, tilt, phaseUnwrapped, dotSize) {
  // Dot position uses sin/cos so unwrapped is fine
  let p = orbitPointWorld(cx, cy, rx, ry, tilt, phaseUnwrapped);

  g.noStroke();
  g.fill(0);
  g.circle(p.x, p.y, dotSize);
}

/* =========================
   HUD, LOCAL TIME
   ========================= */

function drawHUD2D(now) {
  let h = now.getHours().toString().padStart(2, "0");
  let m = now.getMinutes().toString().padStart(2, "0");
  let s = now.getSeconds().toString().padStart(2, "0");

  noStroke();
  fill(0, 160);
  rect(20, 20, 300, 110, 10);

  fill(255);
  textSize(14);
  text("Local Time", 35, 45);

  textSize(22);
  text(`${h}:${m}:${s}`, 35, 70);

  textSize(12);
  fill(220);
  text("Earth: 1 rotation / 24 h", 35, 92);
  text("Moon: ~27.3 days / orbit", 35, 108);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  makePanels();
  resetInk();

  speedSlider.position(20, 145);
  speedLabelDiv.position(20, 120);
}

// Press R to clear the ink drawing and restart
function keyPressed() {
  if (key === "r" || key === "R") resetInk();
}
