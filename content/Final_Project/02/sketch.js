let video;
let pixelSize = 10;
let swirlSlider;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Slider für Swirl-Stärke (0–60 → 0.000–0.060)
  swirlSlider = createSlider(0, 60, 30, 1); // 15 ≈ alter Wert 0.015
  swirlSlider.position(10, height + 10);
}

function draw() {
  background(0);

  video.loadPixels();

  let cx = width / 2;
  let cy = height / 2;

  // Slider-Wert in einen brauchbaren swirlAmount umrechnen
  let swirlAmount = swirlSlider.value() / 1000.0;

  noStroke();

  // --- 1) Hintergrund: normale, farbige Pixel-Webcam ---
  for (let y = 0; y < video.height; y += pixelSize) {
    for (let x = 0; x < video.width; x += pixelSize) {
      let i = (x + y * video.width) * 4;

      let r = video.pixels[i + 0];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      fill(r, g, b);
      rect(x, y, pixelSize, pixelSize);
    }
  }

  // --- 2) Overlay: Spiral-Pixel mit Originalfarbe ---
  for (let y = 0; y < video.height; y += pixelSize) {
    for (let x = 0; x < video.width; x += pixelSize) {
      let i = (x + y * video.width) * 4;

      let r = video.pixels[i + 0];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      // Position relativ zum Zentrum
      let dx = x - cx;
      let dy = y - cy;
      let distFromCenter = sqrt(dx * dx + dy * dy);
      let angle = atan2(dy, dx);

      // Winkel verdrehen abhängig vom Abstand
      let twistedAngle = angle + distFromCenter * swirlAmount;

      // zurück in x/y
      let sx = cx + cos(twistedAngle) * distFromCenter;
      let sy = cy + sin(twistedAngle) * distFromCenter;

      // Bildschirmgrenzen checken
      if (sx < -pixelSize || sx > width + pixelSize ||
          sy < -pixelSize || sy > height + pixelSize) {
        continue;
      }

      // Originalfarbe, leicht transparent
      fill(r, g, b, 220);
      // statt Kreisen jetzt "Pixel" (Quadrate)
      rect(sx, sy, pixelSize, pixelSize);
    }
  }

  // HUD
  fill(255);
  noStroke();
  textSize(14);

}
