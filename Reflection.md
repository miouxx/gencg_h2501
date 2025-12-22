# Week 15 - Reflection

### What did you learn about your creative process this semester?

I learned that I don’t really start “creating” until something is already running. Once a sketch is functional and I can see real time feedback, I iterate fast and make clearer decisions. But I also noticed a weakness: I sometimes jump to polishing the look before I fully understand the system’s behavior, which can make the output feel nicer without actually being stronger.

Using AI for a lot of the coding was an efficiency choice. It let me spend more time on concept, composition, and iterative tuning, which is where I got the most value. The tradeoff is that I need to be more intentional about what I actually understand and can explain, instead of only knowing how to steer the results.

### How did your algorithmic thinking evolve?

Early on it was mostly “make it move”. Later it became “one set of numbers should drive multiple layers”. The final project made this very clear: the same time based data (angles, phases) could generate two different aesthetics at once, a more grounded simulation and an abstract drawing.

I also started thinking more critically about time. Not just whether something looks good in one frame, but what it becomes after 30 seconds. Accumulation, transparency, and repetition stopped being effects and became the real design tools, because they decide whether the system reveals structure or collapses into noise.

### Which experiment or failure shaped the project most?

The orbit drawing breaking at higher speed shaped the project the most. It would either complete instantly or turn into dense blobs, and that wasn’t just a bug, it was the system showing a flaw in the approach. The fix, switching to a persistent ink layer with thin, low alpha strokes, changed the logic from “draw the path” to “draw like a pencil over time”.

That solution worked, but it also taught me something: in generative work, the interesting results often come from designing around failure modes. Small parameter choices can completely change whether the output feels alive or just messy.

### How might you extend this system beyond class?

I’d extend it in a way that keeps it readable and not just more complex. Technically, I’d like to make the simulation more grounded, for example with real orbital elements or even live satellite data, but only if it still supports the visual idea. I’d also add a proper export mode so the 2D ink output can be saved as high resolution prints.

Artistically, I’d explore different “materials” for the drawing side, charcoal grain, ink bleed, engraving lines, and I’d like to run it as a daily generative diary, one saved output per day. That would be a good test of whether the system stays interesting long term, not just for a short demo.
