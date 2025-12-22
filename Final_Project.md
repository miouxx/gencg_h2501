# Final Project

## Exploration & Iteration

This project went through a pretty clear shift, from abstract generative “orbit networks” to a more readable clock driven Earth simulation. The early versions were visually interesting, but the system was hard to read, the viewer couldn’t tell what was driving what. Once I introduced the globe, the project became more legible, but it also risked looking like a tech demo. A lot of iteration was basically me fighting that tension, clarity vs atmosphere, and using failures to decide what to remove.


Iteration 1, Multi center orbit network (too many focal points)
<video src="content\Final Project\FirstIteration.mp4" controls width="600"></video>


I started with a “city of orbits” approach: multiple centers, satellites moving around them, and lines connecting moving points so a network emerges. The result looked delicate and alive, but it had a big problem, it was hard to read as a system. There were too many focal points and the logic was hidden behind the visual noise. The failure here was not technical, it was conceptual, it looked like generative decoration rather than a coherent idea.

What it influenced next: I reduced the number of groups and pushed for a more unified composition.

Iteration 2, Single orbit web (stronger aesthetics, still unclear meaning)
<video src="content\Final Project\SecondIteration.mp4" controls width="600"></video>


Here I collapsed the complexity into one main structure. The ribbons and mesh became more coherent and “designed,” less like scattered clusters. Visually it was a big improvement, but it still didn’t communicate what the system actually was. It felt like a nice abstract shader, but it was missing an anchor, something the viewer can recognize and use as a reference for motion and time.

What it influenced next: I realized I needed a recognizable object and a claim the project can stand on, that’s where the globe direction started.

Iteration 3, First globe prototype (readable, but messy atmosphere)
<video src="content\Final Project\ThirdIteration.mp4" controls width="600"></video>


This was the first “Earth in space” prototype. It introduced a clear subject, a sphere, orbits, and a sense of scale. But it also brought new issues: the blue smoke effect made the scene feel muddy and random, the grid overlay looked like a placeholder rather than a deliberate choice, and the composition still wasn’t stable enough. Even though it looked cool, it didn’t look intentional yet.

What it influenced next: I focused on readability first, fixed camera, cleaner background, more controlled orbit visuals.

Iteration 4, Cleaner simulation (better composition, still too “demo”)
<video src="content\Final Project\FourthIteration.mp4" controls width="600"></video>


This iteration improved the core simulation feel. The camera and scale were more stable, the starfield was cleaner, the orbit rings were readable, and the system started to look like something you can actually observe. The remaining weakness was that it still looked like a generic simulation, the grid overlay kept it in a “technical visualisation” vibe, not an artistic one.

What it influenced next: I tried to add more atmosphere and personality, which immediately led to the biggest visual failure.

Iteration 5, Gaussian background experiment (failure, it destroys readability)
<video src="content\Final Project\FifthIteration.mp4" controls width="600"></video>


I tried to go “more artistic” by adding large translucent splat shapes as a kind of nebula or milky way background. This was the clearest failure in the process. The background became the main subject and completely overwhelmed the scene. It also broke scale perception, it made the Earth feel small and lost, and in some moments it even covered the system you’re supposed to watch. This experiment was important because it proved that “more visuals” is not the same as “more meaning.”

What it influenced next: I stripped the background back down and committed to negative space and clarity.

Iteration 6, Final world sim base (minimal background, controlled lighting, UI)
<video src="content\Final Project\SixthIteration.mp4" controls width="600"></video>


This is the clean version that I kept. The background stays quiet, the orbit rings and satellites are readable, and lighting is warm and directional so the Earth feels like it has a day and night side. Adding the speed slider also turned the system into something you can “play” rather than just watch. The main insight here is that the simulation looks better when the design decisions are subtractive, fewer effects, more structure.

How this connects to the final piece: Once the left side was stable and readable, I could safely add the more artistic layer elsewhere, the 2D ink drawing. The stability of the simulation is what made the abstraction credible.

## Final Version

The final project is a split screen system that shows the same motion in two visual languages. On the left, a textured Earth is rendered with a fixed camera and a warm directional light, so the day/night edge is visible and the scene stays readable. The Moon and a few satellites orbit with clean rings and minimal background noise, this side acts as the “ground truth” of the system.

On the right, the same orbital phases are translated into a black and white “atom” drawing. Instead of displaying perfect orbit curves, the moving bodies act like pencils and deposit very thin, low opacity strokes onto a persistent ink layer. Over time, repeated passes naturally darken and thicken the same paths, so the image is created through duration and repetition rather than being revealed instantly.

<iframe src="content\Final_Project\01\embed.html" width="100%" height="800" frameborder="no"></iframe>

## Influences & References

This project sits between two visual languages, scientific visualisation and symbolic diagram. The main influence was the “atom” icon / orbital diagram style (black nucleus, clean elliptical paths, minimal black and white). I used it because it communicates a system instantly, even if the viewer doesn’t understand the details. It also gave me permission to simplify and exaggerate geometry on the right side without pretending it’s fully accurate.

<img src="content\Final Project\AtomIcon.jpeg" width="30%"><img src="content\Final Project\accumulation.gif" loop=infinite width="30%"><img src="content\Final Project\NebulaRef.jpg" width="30%">

A second influence came indirectly from generative drawing approaches where the image is created through time, not revealed in one frame. The key idea I borrowed is accumulation: repeated marks with low opacity build texture and density over time. That’s what makes the 2D panel feel less like a UI graphic and more like a drawing machine. I found this cool artpiece on Pinterest:

The most important reference was actually one of my own failures: the background “nebula” / Gaussian splat experiments. It taught me that atmosphere can easily become noise, and that my strongest aesthetic move was restraint. That failure is a reference point I kept returning to when deciding what to remove.

## Algorithmic System

The whole piece is one clock driven system shown in two representations.

### Core rule

- Read the computer time

- Convert time into angular phases (Earth rotation, Moon orbit, satellite orbits)

```js
let secondsToday =
  now.getUTCHours() * 3600 +
  now.getUTCMinutes() * 60 +
  now.getUTCSeconds() +
  now.getUTCMilliseconds() / 1000;

let dayFrac = secondsToday / 86400;
let earthAngle = dayFrac * TWO_PI * speedMult;
```

### Use the same phases to drive both views:

- Left, world view: textured sphere + fixed warm directional light so you see day/night, plus orbiting bodies

- Right, drawing view: the orbiting bodies become “pencils” that leave marks on a persistent ink layer

### Clock synced, but simplified

- Earth rotation is synced to time of day, one full turn per day, scaled by the multiplier

- Moon and satellites are modeled with fixed periods and inclinations, not live astronomical or TLE data

```js
let phase = (elapsedMinutes / sat.periodMin) * TWO_PI * speedMult;
```

- The speed multiplier scales time, so at 1000x the system effectively “fast forwards” and bodies complete many orbits quickly

### Key parameters that change the visual logic

- Speed multiplier: changes orbital advance per second, and also changes the density of marks on the 2D drawing

- Ink settings: stroke weight, alpha, persistence, jitter, these decide whether the right panel reads as a clean diagram or a physical sketch

```js
let inkAlpha  = constrain(30 / sqrt(speedMult), 2, 18);
let inkWeight = max(0.6, 1.4 / pow(speedMult, 0.12));
```

- Lighting: ambient level and warm directional light direction, this decides whether the Earth reads as flat or spatial

## Reflection

See reflection here: [Reflection](/Reflection.md)