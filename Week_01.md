# Week 01 - Intro

We started by getting some inspiration by professional artists and iconic art, to get a feeling on what we can expect. Also we were already able to start our very own small little project in the p5js editor, which you can find below. I started with something simple and tried to sketch out a snowman out of some very simple shapes like circles and a triangle for the nose. It worked pretty well and I got the hang of it quickly, so the snowman was not the biggest challenge but a great little start.

<iframe src="https://editor.p5js.org/miouxx/full/Np3YNGJi8" width="100%" height="400" frameborder="no"></iframe>

<iframe src="content\Week_01\01\embed.html" width="100%" height="400" frameborder="no"></iframe>


The main challenge was positioning elements precisely and managing proportions. After some trial and error with coordinates, I got a clean and balanced composition.

```js
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
```

## Influences & References

I was inspired by minimal character designs such as early vector art and children’s illustrations — simple but expressive. The idea connects to Vera Molnár’s approach of using simple geometric rules to create recognizable forms.

## Algorithmic Thinking

My system here is rule-based:

- Use only basic primitives (circle, rect, triangle)

- Stack shapes vertically

- Maintain symmetry on the x-axis

## Critical Reflection

This first experiment helped me understand coordinate logic and layering. It wasn’t challenging artistically, but it established a good workflow: sketch → code → adjust.
Next time, I want to move beyond static shapes toward pattern and repetition.