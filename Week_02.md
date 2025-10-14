# Week 02 – Grids, Patterns, and Repetition

## Exploration & Experimentation

This week focused on grids and patterns, which are essential in generative art. I was drawn to the illusion of depth in the example shown during the lecture (image below).

<iframe src="content\Week_02\pattern05.jpg" width="100%" height="400" frameborder="no"></iframe>  <iframe src="content\Week_02\sketch-project2.jpg" width="100%" height="400" frameborder="no"></iframe>

I experimented with overlapping circles and transparency to simulate a water-like effect. To make the pattern more alive, I added interactivity: circles appear dynamically, like raindrops disturbing water.

<iframe src="content\Week_02\01\embed.html" width="100%" height="800" frameborder="no"></iframe>

## Influences & References

The work of Bridget Riley and Vera Molnár influenced me here — both use repetition and minimal variation to create rhythm and movement. Riley’s “Blaze” especially inspired my circular motion and optical vibration.

## Algorithmic Thinking

System rules:

- For each grid cell, draw concentric circles

- Vary radius slightly per frame to simulate motion

- On mouse click, spawn new circles at cursor (raindrops)

## Pseudocode

```js
for each circle:
  if mousePressed → create new wave
  radius = base + sin(frameCount * speed)
  draw with low opacity
```

## Critical Reflection

I liked the subtle motion and how small changes in opacity created depth. However, performance dropped when too many circles spawned.
Next week, we’ll explore using time more efficiently, possibly linking motion to system time instead of interaction alone.