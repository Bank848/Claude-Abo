# Genre Blending

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent theory; tag examples targeted at Suno v5.5

## Core Concept

A genre isn't one indivisible thing — it's a bundle of separable components: **groove foundation** (BPM + rhythmic feel — four-on-the-floor, shuffle, half-time trap...), **harmonic language** (functional I-IV-V vs. jazz-extended ii-V-I vs. minimal one-chord vamp), **instrumentation palette** (which instruments carry which roles), **vocal style** (delivery, processing, phrasing), and **production era** (the sonic reference point — 80s gated reverb, 2010s glossy pop, lo-fi bedroom). A genre profile in [genre-conventions.md](genre-conventions.md) is really just one specific, historically-attested combination of these five. **Blending genres means picking components from different profiles and recombining them** — the groove from one, the instrumentation from another, the vocal from a third — rather than trying to average two genres into a vague middle.

This is arguably the highest-leverage Suno-specific skill in this KB: Suno's training data contains enormous numbers of hybrid tracks, its Style field is a flat list of tags with no enforced internal consistency, and "genre X meets genre Y" is a natural-language pattern it has almost certainly seen many times. A well-built hybrid prompt exploits exactly the kind of combinatorial generation an AI model is good at — output that would take real musicians a rehearsal to reproduce.

**The anchor rule**: one component must be the stable foundation the others attach to, and it is almost always the **groove/BPM foundation**. Two components can clash in tone and still cohere (a trap hi-hat pattern under a country vocal is a genre in itself — see Worked Archetypes below), but two *incompatible grooves fighting for the same beat* is the single most common way a blend prompt produces mush. Pick one groove, one BPM lane, and let every other component sit on top of it.

## Practical Application

**Compatibility check before writing the prompt** — run each candidate pairing through three questions:

1. **BPM-range overlap.** Do the two genres' BPM ranges (see [rhythm-and-meter.md](../01-theory/rhythm-and-meter.md) and each profile in [genre-conventions.md](genre-conventions.md)) share usable territory? Trap (130-170 felt half-time, ~65-85) and dubstep (138-142, also felt half-time) overlap comfortably. Trap and traditional bluegrass (160-200+ straight) do not — pick which BPM feel wins and let the other genre's *instrumentation*, not its tempo, carry across.
2. **Straight vs. swung feel.** A shuffle/swing feel (blues, country, some R&B) and a rigidly quantized, straight feel (EDM, trap, most pop) are the two dominant rhythmic "textures" in Suno's likely training data. Blending across this line (e.g., a swung country vocal cadence over a straight trap beat) is a deliberate, nameable effect — do it on purpose, with a tag that names the friction (`country vocal phrasing over a straight trap beat`), not by accident.
3. **Harmonic density match.** A genre built on a single held vamp (trap, most EDM drops) can absorb a genre with dense chord movement (R&B, jazz-inflected soul) laid on top without a train wreck — the vamp *is* the harmonic bed. Two chord-dense genres blended together (funk + soul, e.g.) usually work because they share a harmonic vocabulary already. The failure mode is forcing a chord-dense genre's harmony onto a vamp-based genre's structure and expecting both identities to survive intact — usually one has to yield.

**Which component to keep vs. swap**: default to keeping groove + BPM from the "base" genre, swapping instrumentation and production-era reference from the "flavor" genre, and treating vocal style as the biggest creative-choice lever (a genre-typical vocal on an atypical beat is often the single most legible signal of "this is a hybrid" to a listener).

**Slider interaction** (see [sliders-and-excludes.md](../04-suno/sliders-and-excludes.md)): a hybrid Style-field prompt is inherently already "unusual" relative to a single clean genre tag, so **Weirdness should generally sit lower than instinct suggests** for a blend — Weirdness pushes toward the unexpected, and a hybrid genre tag is already asking for something unexpected; stacking both risks incoherent output. Style Influence, conversely, is worth nudging *up* on a well-attested hybrid (something with real precedent, like country-trap) since a stronger pull toward the named styles helps Suno commit to both halves rather than blurring into neither.

## Suno Translation

Structure a hybrid Style-field prompt the same 5 layers as [style-prompt-formula.md](../04-suno/style-prompt-formula.md), but layer 1 (genre/subgenre) becomes a compound: `<base genre> with <flavor genre> <component>`, naming which specific component is being borrowed rather than just mashing genre names together — `country-trap` is vaguer and less reliable than `country vocal and pedal steel over a trap 808 and hi-hat pattern`.

**Worked archetypes** (tag-string starting points, not final prompts):

- **Country-trap**: `country vocal phrasing and pedal steel licks, trap 808 sub-bass and rapid hi-hat rolls, half-time 140bpm feel, storytelling lyric voice, modern Nashville-meets-Atlanta production` — anchor = trap groove/BPM; flavor = country vocal + pedal steel color instrument (see [genre-conventions.md](genre-conventions.md)'s Country and Hip-Hop/Trap rows).
- **EDM-pop**: `polished pop vocal with a big anthemic chorus, four-on-the-floor kick, sidechained pumping synth bass, euphoric build-drop structure, 126bpm, festival-ready production` — anchor = EDM build/drop structure and groove; flavor = pop vocal polish and hook-first chorus writing.
- **Funk-rock**: `syncopated funk bassline and chicken-scratch rhythm guitar, distorted rock power-chord chorus, tight pocket drums with ghost notes, 110bpm` — anchor = funk groove/bass role; flavor = rock's harmonic/dynamic payoff in the chorus.
- **City-pop-meets-R&B**: `lush major-7th and 9th chord progression, smooth syncopated bassline, Rhodes electric piano comping, breathy layered R&B vocal harmonies, 100bpm, glossy late-70s Japanese city-pop production` — anchor = shared jazz-extended harmonic vocabulary (both genres already speak this language, see R&B/Soul row in [genre-conventions.md](genre-conventions.md)), so this pairing needs the least forcing of any archetype here.

## Worked Examples

*(none yet — no self-verified hybrid generation exists in this KB; the archetypes above are compatibility-theory hypotheses, not tested prompts)*

## Gotchas / Open Items

- Everything in this file is theory-derived from the individual genre profiles' verified/unverified status in [genre-conventions.md](genre-conventions.md) — a blend inherits the weaker verification status of its two source genres. None of the worked archetypes above have been generated and judged against real Suno output yet.
- Whether Suno actually maintains two distinct genre "identities" simultaneously or quietly collapses a hybrid tag toward whichever genre is statistically dominant in its training data is unknown — first self-test should specifically listen for whether *both* named components are audible, not just whichever one is more common.
- The Weirdness/Style Influence guidance above is a reasoned prediction from how those sliders are documented to behave (per [sliders-and-excludes.md](../04-suno/sliders-and-excludes.md)), not yet empirically confirmed on a hybrid prompt specifically.
