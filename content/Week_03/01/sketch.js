// Wave pattern + filled blue rings

let R = 80;
let rings = 4;
let sw = 8;
let dx, dy, step;
let pattern;

// water drops
let drops = [];
let spawnInterval = 100; // ms between spawns
let lastSpawn = 0;

function setup() {
  createCanvas(800, 800);
  noLoop(); // render pattern once into buffer

  pattern = createGraphics(width, height);
  drawPattern(pattern);

  loop(); // continuous drawing
}

function draw() {
  image(pattern, 0, 0);

  // spawn water drop circles
  if (millis() - lastSpawn > spawnInterval) {
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
      drops.push({
        x: mouseX,
        y: mouseY,
        r: R * 0.7,
        lifetime: 255
      });
      lastSpawn = millis();
    }
  }

  // draw drops (ripples)
  noFill();
  stroke(255, 200);
  strokeWeight(3);

  for (let i = drops.length - 1; i >= 0; i--) {
    let d = drops[i];
    stroke(255, d.lifetime);

    ellipse(d.x, d.y, d.r * 2, d.r * 2);

    d.lifetime -= 3;
    d.r *= 1.01;

    if (d.lifetime <= 0) {
      drops.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === 'c' || key === 'C') {
    drops = [];
  }
}

// -------- pattern drawing --------
function drawPattern(pg) {
  pg.background(255); // white background, but scallops cover it

  step = R / rings; // divide radius into equal steps
  dx = R;
  dy = R * 0.62;

  let row = 0;
  for (let y = -R; y < pg.height + R; y += dy) {
    const xOffset = (row % 2 === 0) ? 0 : dx / 2;
    for (let x = -R; x < pg.width + R; x += dx) {
      const cx = x + xOffset;

      // Draw filled semicircles from outer to inner
      for (let k = 0; k < rings; k++) {
        const radOuter = R - k * step;
        const radInner = R - (k + 1) * step;

        let c = lerpColor(color(20, 40, 120), color(180, 220, 255), k / (rings - 1));
        pg.fill(c);
        pg.noStroke();

        // full semicircle with outer radius
        pg.arc(cx, y, radOuter * 2, radOuter * 2, PI, 0, PIE);

        // cut out the inside to make a ring
        pg.fill(255); // background color for cutout
        if (radInner > 0) {
          pg.arc(cx, y, radInner * 2, radInner * 2, PI, 0, PIE);
        }
      }
    }
    row++;
  }
}
