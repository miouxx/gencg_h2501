# Week 6 - Parametric Faces

## Exploration & Experimentation

This week’s challenge was to create a parametric face generator — a system that produces infinite face variations through adjustable parameters.
My approach focused on building a clear and flexible system that defines each facial feature algorithmically rather than drawing it directly.

The core idea: instead of redrawing faces, I define rules that shape a face through variables like head size, mouth curvature, and eye spacing.
Every click of the Randomizer button re-rolls all these parameters, producing a new, unique face.

My personal twist was adding an “Anger-meter”, a slider that controls how the emotional state affects the face’s geometry and texture.
As the slider moves from 0 → 1, the entire system transitions from calm and rounded to tense and angular.
Rather than simply changing the expression, the emotion directly influences the structure and drawing style of the character:

- Low anger (0.0) → smooth shapes, few scribble passes, round head, relaxed features
- Mid anger (≈ 0.5) → subtle corners appear, hair thickens, brow arches lower
- High anger (1.0) → harsh edges, scratchy lines, compressed mouth, spiky hair

This way, the face doesn’t just look angry — it becomes angry at a geometric level.
It’s both interactive and performative: emotion reshapes the entire system.

<iframe src="content\Week_05\01\embed.html" width="100%" height="700" frameborder="no"></iframe>

## Influences & References

My main reference for this project was Matthias Dörfelt’s “Weird Faces” (2012 – ongoing).
In this series, Dörfelt explores how algorithmic systems can produce portraits that feel emotional and human despite being entirely procedural.

A second inspiration was Sougwen Chung, who collaborates with drawing robots to study how emotion and gesture can be shared between human and machine.

<img src="content\Week_05\weirdfacesmatthiasdörfelt.png" width="48%"> <img src="content\Week_05\SougwenChungRobots.png" width="51%">

Both artists approach emotion not as a fixed output but as a dynamic, evolving process — exactly what I wanted to translate into code.

## Algorithmic Thinking

The system is built around a global object params that stores all generative variables.
Two controls — a Randomizer button and an Anger-slider — manipulate these parameters in different ways.

### Main Parameters

- headW, headH – overall proportions
- shapePower – superellipse exponent (controls squareness)
- scribblePasses, scribbleJitter – how sketchy the drawing becomes
- hairLen, hairDensity – hair intensity
- browGap, browArc, eyeTilt – emotion in the eyes
- mouthCurve – expression (smile → frown)

### Core Emotion Mapping

```js
function applyEmotion() {
  const A = angerSlider.value();
  params.shapePower   = lerp(2.0, 3.6, A);
  params.headBump     = lerp(8, 28, A);
  params.scribblePasses = round(lerp(1, 4, A));
  params.scribbleJitter = lerp(0, 2.3, A);
  params.hairLen      = lerp(16, 60, A);
  params.eyeTilt      = lerp(0, -8, A);
  params.mouthCurve   = lerp(18, -38, A);
}
```

Every increase in A (anger) propagates through the system:
the head grows more angular, lines gain jitter, and the face “tightens.”
This creates an emergent relationship between numeric intensity and visual aggression.

## Critical Reflection

This project taught me that emotion can be encoded directly into geometry.
By making anger a single numeric input that ripples through all facial features, the drawing gains a coherent behavioral logic.
The result isn’t about realism — it’s about energy.

I liked how the scribbly, over-drawn look at high anger values feels raw and expressive, as if the drawing itself were losing control.
At the same time, the calm, round forms at low values read as simple and approachable.
