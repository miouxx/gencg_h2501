# Week 3 – Time as a Creative System

## Exploration & Experimentation

This lecture introduced time as a parameter. I immediately thought of Doctor Strange and how he manipulates time visually. I wanted to translate that glowing circular motion into a clock system.

<img src="content\Week_03\Doctor-Strange_time_manip.gif" width="48%"> <img src="content\Week_03\sketch-project3.jpg" width="48%">

Once this was figured out I went to ChatGPT and implemented every figure one after another to not confuse it too much. After multiple iterations this is what my result looks like:

<iframe src="content\Week_03\01\sketch.js" width="100%" height="800" frameborder="no"></iframe>

## Influences & References

I looked at Refik Anadol’s data sculptures and Manfred Mohr’s algorithmic geometry. Both artists use systems of movement that feel organic yet rule-driven.
The Doctor Strange visuals became my aesthetic reference — glowing, circular, and dynamic — but I tried to anchor it in a structured clock system.

## Algorithmic Thinking

System logic:

- Use current time (hour, minute, second)

- Map these values to rotation angles

- Draw circular arcs for each unit of time

- Overlay glowing rings to mimic energy flow

## Pseudocode

```js
angleSec = map(second(), 0, 60, 0, TWO_PI)
angleMin = map(minute(), 0, 60, 0, TWO_PI)
angleHr = map(hour(), 0, 24, 0, TWO_PI)
drawArc(center, radius, angle)
```

## Critical Reflection

This project was my favorite so far. I struggled with color blending and making the animation smooth, but learned a lot about how time functions can generate rhythm and structure.