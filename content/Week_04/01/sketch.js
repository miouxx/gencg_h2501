// Gaussian Pencil — clean, always-on drawing (no button press)
// Each sample: (x', y') = (x + εx, y + εy) with εx ~ N(0, σx²), εy ~ N(0, σy²)

const STROKE_WEIGHT = 2;
let sigmaX = 5;
let sigmaY = 5;
const MIN_STEP = 0.6;   // min raw movement to add a segment

let prevRaw = null;     // previous raw mouse point
let prevNoisy = null;   // previous noisy point

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  background(255);
  stroke(20);
  strokeWeight(STROKE_WEIGHT);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
}

function windowResized() {
  const g = get();
  resizeCanvas(windowWidth, windowHeight);
  background(255);
  image(g, 0, 0);
}

function keyPressed() {
  if (key === 'S' || key === 's') saveCanvas('gaussian-pencil', 'png');
  if (key === 'C' || key === 'c') { background(255); prevRaw = null; prevNoisy = null; }
  if (keyCode === UP_ARROW)   { sigmaX = max(0, sigmaX + 0.2); sigmaY = sigmaX; }
  if (keyCode === DOWN_ARROW) { sigmaX = max(0, sigmaX - 0.2); sigmaY = sigmaX; }
}

function draw() {
  // Only draw if the pointer is inside the canvas.
  if (!pointerInCanvas()) {
    prevRaw = null;
    prevNoisy = null;
    return;
  }

  const raw = createVector(mouseX, mouseY);

  // Initialize on first contact in-bounds
  if (!prevRaw) {
    prevRaw = raw.copy();
    prevNoisy = createVector(
      raw.x + randomGaussian(0, sigmaX),
      raw.y + randomGaussian(0, sigmaY)
    );
    // Tiny seed dot so you see something immediately
    point(prevNoisy.x, prevNoisy.y);
    return;
  }

  // Only add a new segment if the mouse moved enough
  if (p5.Vector.dist(raw, prevRaw) >= MIN_STEP) {
    const noisy = createVector(
      raw.x + randomGaussian(0, sigmaX),
      raw.y + randomGaussian(0, sigmaY)
    );
    line(prevNoisy.x, prevNoisy.y, noisy.x, noisy.y);
    prevNoisy = noisy;
    prevRaw = raw;
  }

  // Optional mini HUD (comment out to go ultra-minimal)
  drawHUD();
}

function pointerInCanvas() {
  return mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height;
}

function drawHUD() {
  push();
  noStroke();
  fill(255, 220);
  rect(10, 10, 170, 46, 8);
  fill(20);
  textSize(12);
  text('Gaussian pencil', 18, 26);
  text(`σ = ${sigmaX.toFixed(1)}  (↑/↓)`, 18, 42);
  pop();
}
