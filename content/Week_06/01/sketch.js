let video;
let pixelSize = 10;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function draw() {
  background(0);

  video.loadPixels();

  for (let y = 0; y < height; y += pixelSize) {

    // Welche Zeilen glitchen
    let lineGlitched = random() < 0.12; // 12% der Zeilen

    // EXTREME Grundverschiebung
    let baseShift = lineGlitched ? int(random(-40, 40)) : 0;

    // EXTREMER Zusatzshift (manchmal)
    let extraShift = 0;
    if (lineGlitched && random() < 0.25) {
      extraShift = int(random(-150, 150)); // big glitch
    }

    let lineShift = baseShift + extraShift;

    for (let x = 0; x < width; x += pixelSize) {
      let i = (x + y * video.width) * 4;

      let r = video.pixels[i + 0];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];

      // Graustufen
      let bright = (r + g + b) / 3;

      // Ein Block glitched, wenn Zeile glitched ODER 1% random
      let blockGlitched = lineGlitched || random() < 0.01;

      noStroke();

      if (blockGlitched) {
        // RGB-Störung für glitchy pixel
        let rr = constrain(r + random(-40, 40), 0, 255);
        let gg = constrain(g + random(-40, 40), 0, 255);
        let bb = constrain(b + random(-40, 40), 0, 255);

        fill(rr, gg, bb);

        rect(x + lineShift, y, pixelSize, pixelSize);

      } else {
        // Normale Pixel in Graustufen
        fill(bright);
        rect(x, y, pixelSize, pixelSize);
      }
    }
  }

  fill(0, 255, 255);
  noStroke();
  textSize(14);
}
