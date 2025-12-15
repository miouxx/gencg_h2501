# Week 04 - Drawing Machines

## Exploration & Experimentation

This week, I experimented with Gaussian variation to influence line structure and visual expression.
I wanted to see how mathematical noise could distort and reshape a figure — not to make it look natural, but to see what happens when precision collapses into abstraction.

I built a small drawing system that offsets every point using a Gaussian distribution. The spread (σ) determines how far points can drift from their original position.
To explore the effect, I drew the same face three times with different Gaussian multipliers:

- σ = 1.6 – controlled but already restless, lines start to fray and overlap
- σ = 5 – structure dissolves; the face becomes more emotional and sketch-like
- σ = 10 – chaos; shapes break apart into energetic fragments

<img src="content\Week_04\week4-sketch1.6.png" width="31%"> <img src="content\Week_04\week4-sketch5.png" width="31%"> <img src="content\Week_04\week4-sketch10.png" width="31%">

Try it out yourself! This is with σ = 5 and you can already feel how hard it is to control the pencil.

<iframe src="content\Week_04\01\embed.html" width="100%" height="400" frameborder="no"></iframe>

## Influences & References

This piece draws from Vera Molnár’s exploration of rule-based disruption (left image) and Georg Nees’ early algorithmic drawings, where systems intentionally break order.
I was also inspired by Anders Hoff (Inconvergent), who often uses Gaussian functions to build complexity from minimal rules (right image).
The project connects to a broader idea: how mathematics can generate unexpected emotion when precision is deliberately destabilized.

<img src="content\Week_04\week4-veramolnar.png" width="48%"> <img src="content\Week_04\week4-anders.png" width="48%">

## Algorithmic Thinking

System logic:

- Define a Gaussian distribution centered at μ = 0.
- For each vertex, offset its x and y positions by randomGaussian(0, σ).
- Connect the points sequentially to form a drawing.
- Adjust σ to control how much the form dissolves or coheres.

```js
for (let p of points) {
  let xOffset = randomGaussian(0, sigma);
  let yOffset = randomGaussian(0, sigma);
  vertex(p.x + xOffset, p.y + yOffset);
}
```

The only variable I changed between the three portraits was σ — 1.6, 5, 10 — yet the outcome transformed completely.

## Critical Reflection

Instead of chasing realism, this experiment embraced distortion as its own form of expression.
At σ = 1.6, the structure still holds — it feels introspective and tentative.
At σ = 5, confidence appears through fluid chaos.
At σ = 10, the system loses all restraint, but gains raw energy.

This process reminded me that generative art thrives on imbalance — where structure and noise continuously fight for dominance.
Next, I want to extend this by animating σ over time, letting the drawing pulse between coherence and disintegration.