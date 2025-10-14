function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(206,223,255);
  let c = color(243,250,255);
  
  fill (c);
  noStroke();
  circle(200,300,150)
  circle(200,200,100)
  circle(200,130,70)
  rect(0,350,400)
  
  let o = color(248,155,65);
  fill (o);
  noStroke();
  triangle(220,140,220,130,240,135)
  
  let b = color(0,0,0);
  fill (b);
  noStroke();
  circle(210,122,7);
  
}