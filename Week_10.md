# Week 10 - Pixels

## Exploration & Experimentation

This week’s exploration revolved around transforming live webcam input through generative pixel manipulation.
My initial goal was to create an expressive, visually reactive system using the webcam not simply as an image source, but as a dynamic field for real-time graphical distortion.

### Project 1 — Glitch Cam 

The first experiment focused on building a glitch-driven aesthetic: a live webcam feed reconstructed through a 5-pixel grid, with randomly shifting scanlines, RGB tears, and controlled noise.
Instead of manipulating single pixels, I treated each block of 10×10 pixels as a “cell” of information that could be displaced, recolored, or corrupted.

The system introduced:
- horizontal scanline shifts
- rare but intense RGB noise bursts
- black-and-white base image for clarity
- colored glitch events as visual contrast

Each frame re-interprets the webcam through controlled randomness.

But in the end, I wasn’t satisfied with the glitch project alone.
It felt expressive, but not purposeful enough. The randomness dominated the structure, and the aesthetic wasn’t as visually legible as I wanted.

<iframe src="content\Week_06\01\embed.html" width="80%" height="400" frameborder="no"></iframe>

### Project 2 — Spiral Pixel Warp (Parametric Distortion Field)

From that dissatisfaction, I shifted toward a more structured experiment based on polar transformation.
The idea: keep the webcam recognizable, but distort it in a controlled spiral — similar to halftone spirals seen in graphic design.

My approach:
- sample the webcam at 5-pixel resolution
- convert each sample point into polar coordinates
-rotate its angle by a distance-dependent amount
- map it back into Cartesian space
- overlay this spiral layer on top of a normal pixelated webcam background

Unlike the glitch system, this transformation is parametric and stable.
To enhance control, I added a slider that adjusts the swirl intensity in real time, allowing smooth transitions from almost pristine to heavily warped.

The resulting system feels more deliberate and sculptural.
Instead of chaotic interference, the webcam image moves like a liquid geometry field — bending into a spiral while keeping its colors and recognizability.

<iframe src="content\Week_06\02\embed.html" width="80%" height="450" frameborder="no"></iframe>

## Influences & References

My references for these projects are rooted in two visual worlds:

Glitch Art & Signal Interference
Inspired by digital decay aesthetics, corrupted VHS signals, and RGB tears — the kind of visual language where technology becomes expressive by breaking.

<img src="content\Week_06\tvscreen.jpg" width="48%"> <img src="content\Week_06\cyberpunk.gif" width="48%">

Generative Graphic Systems (Halftone & Polar Transformations)
Spiral halftone patterns and geometric distortions found in graphic design were a direct inspiration for the second project.
These references helped me transition from chaotic randomness to structured manipulation.

Both approaches treat the webcam not as a “camera” but as a dynamic dataset for transformation.

<img src="content\Week_06\spiral.png" width="50%">

## Algorithmic Thinking

Both systems operate on a grid of 5x5 pixel sample blocks, but their logic diverges significantly.

### Glitch System — Core Parameters

- pixelSize – resolution of the pixel grid
- lineGlitched – whether a row is distorted
- baseShift, extraShift – determine X-axis displacement
- RGB jitter – small per-pixel color corruption
- grayscale base + colored glitch events

The glitch behavior emerges from stochastic rules that determine how each scanline is displaced and how colors fracture.

### Spiral System — Core Parameters

- pixelSize – block sampling resolution
- swirlAmount – twist intensity (controlled by slider)
- polar conversion (angle + distance from center)
- color preservation from sampled webcam pixels
- overlay logic (background = unchanged pixel grid, foreground = warped grid)

## Core Transformation Mapping

```js
// compute polar coordinates
let dx = x - cx;
let dy = y - cy;
let dist = sqrt(dx*dx + dy*dy);
let angle = atan2(dy, dx);

// swirl depending on distance
let twisted = angle + dist * swirlAmount;

// convert back
let sx = cx + cos(twisted) * dist;
let sy = cy + sin(twisted) * dist;
```

This mapping produces a continuous geometric warp that feels coherent and fluid.

## Critical Reflection

Working on these two webcam-based systems highlighted two sides of generative distortion:

- Chaos vs. structure
- Randomness vs. geometry
- Energy vs. readability

The glitch system taught me how controlled noise can create a sense of digital instability.
Its intensity and unpredictability had personality — but at the cost of clarity.

The spiral warp emerged as a reaction to that: a desire for transformation without losing legibility.
Here, a single parameter (swirlAmount) reshapes the entire experience, creating an elegant relationship between geometry and live video.

Together, these projects show two different ways of treating the webcam as generative material — one based on signal breakdown, the other on spatial transformation.