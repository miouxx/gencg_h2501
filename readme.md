# GENCG Journal by Mika Wyss

## What I learned in this module over the last semester.

### First lecture

We started by getting some inspiration by professional artists and iconic art, to get a feeling on what we can expect. Also we were already able to start our very own small little project in the p5js editor, which you can find below. I started with something simple and tried to sketch out a snowman out of some very simple shapes like circles and a triangle for the nose. It worked pretty well and I got the hang of it quickly, so the snowman was not the biggest challenge but a great little start.

<iframe src="https://editor.p5js.org/miouxx/full/Np3YNGJi8" width="100%" height="400" frameborder="no"></iframe>

The code that was used was mostly from the p5js references page where the simple shapes were described simple but effective.
This is how the snowman looks in code:

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

### Second Lecture

In this lecture, we already went further than just playing around like in the first lecture. It was about grids and patterns. This core principle of generative arts is really important and one example that was shown sparked my interest. This one:

![pattern05](https://github.com/user-attachments/assets/04003220-f4b5-4f4a-af77-3e7c5f95cb5e)

It instantly gave me an impression of depth and caught my attention. So i developed it abit and came to something with a similar pattern, the multiple circles overlayed over eachother gave me a vibe of water and waves. Also some kind of simple interactivity would be cool. I had some options in mind but went for circles spawning, imitating waterdrops dropping into water. This was my sketch for it:

![sketch-project2](https://github.com/user-attachments/assets/f055e24d-fde7-43a6-adde-17cc4de3592d)

And this is what I came up with in p5js:

<iframe src="https://editor.p5js.org/miouxx/full/lA770YFBD" width="100%" height="800" frameborder="no"></iframe>

### Third Lecture

This lecture was the coolest one so far for me. Being able to take the actual time and using it in the art is such an interesting way to have interactivity and randomness.
When time came up, I immediately thought about Dr. Strange from the Marvel universe, because this character can manipulate time and he looks cool when he is doing it. So my goal was to make a clock out of his time manipulation effects.

![Doctor-Strange_time_manip](https://github.com/user-attachments/assets/d8a04718-14ff-4e70-9a4d-ce0f47fb3a3a) ![sketch-project3](https://github.com/user-attachments/assets/796f9e03-5d7d-4b56-bcba-85180511ff4a)

Once this was figured out I went to ChatGPT and implemented every figure one after another to not confuse it too much. After multiple iterations this is what my result looks like:

<iframe src="https://editor.p5js.org/miouxx/full/8dBQ62H0V" width="100%" height="800" frameborder="no"></iframe>

