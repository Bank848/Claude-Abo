# Drums

> **Pillar:** 2 — Instrument Technique · **Last updated:** 2026-08-06
> **Suno version notes:** version-independent technique; Suno-translation section verified against Suno v5.5, 2026-08

## Core Concept

**Kit vocabulary**: kick (bass drum, low thump, usually on strong beats), snare (sharp crack, usually the backbeat — see [rhythm-and-meter.md](../01-theory/rhythm-and-meter.md)), hi-hats (cymbal pair, closed = tight "tss" on every subdivision, open = washier/louder), toms (deeper drums used for fills, often rack-to-floor descending pitch), crash (loud accent cymbal marking a section boundary), ride (sustained cymbal pattern, alternative to hats for a more open feel).

**The backbeat**: snare hitting on beats 2 and 4 of a 4/4 bar — the default rock/pop groove skeleton. Genre-default variations layer the kick differently around that fixed snare pattern.

**Fills**: a short burst of extra drum activity (usually toms) that signals "something is about to change" — placed at section boundaries, not randomly. A fill's job is to *announce* the next section, not to be impressive on its own.

**Ghost notes**: very quiet snare hits played between the main backbeat hits, adding groove complexity. Arena rock deliberately **avoids** these — the genre wants drums simple enough to be followed (and physically stomped along to) by an audience with no musical training. "Big and open" beats beat busy, detailed ones for this genre.

## Practical Application

- **Verse**: kick on 1 & 3 (or four-on-the-floor for more drive), closed hats, snare backbeat on 2 & 4 — steady and predictable.
- **Pre-chorus build**: kick doubles to eighth notes, hats may open slightly, snare shifts from occasional hits to a crescendo (eighth notes accelerating to sixteenths) across the final bar — a rhythmic ramp mirroring the harmonic ramp in [key-relationships-and-modulation.md](../01-theory/key-relationships-and-modulation.md).
- **Fill placement**: tom fills land on beats 3-4 of the *last* bar before a chorus, descending rack-to-floor, ending with a crash + kick hit exactly on the chorus downbeat — this is the standard "here it comes" signal in the genre.
- **Chorus**: open hats or ride, crash accents on beat 1 of each 2-bar phrase for continued lift.
- **Stomp-clap sections**: strip everything down to just kick on 1 & 3 and hand-claps on 2 & 4 (the "We Will Rock You" pattern) — maximal audience-participation simplicity, used for intros/breakdowns/outros.
- **Room character**: "roomy/dry" describes how much natural room ambience/reverb is on the kit — roomy reads as live/big, dry reads as tight/modern.

## Suno Translation

Style-field tags: `stomp-clap stadium drums`, `punchy drums`, `tom builds into chorus`, `no ghost notes` (as an Exclude-field entry if the model tends to add unwanted complexity), `gated plate reverb` (an 80s-specific room-character tag). Section-level dynamics can be cued inline: `(building intensity)` before a pre-chorus, `[Breakdown]` + `(stripped back)` for a stomp-clap-only section.

Judging output: verify the backbeat is audible and simple, that fills land at section boundaries (not mid-phrase), and that the stomp-clap sections (if requested) actually strip down rather than keeping full drums.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — full drum-pattern breakdown by section, including exact fill placement and the stomp-clap breakdown pattern.

## Gotchas / Open Items

- "No ghost notes" as an explicit Exclude-field entry is a KB recommendation, not yet empirically tested for effect.

## Reference Listening

- "We Will Rock You" — Queen (the stomp-clap pattern this file names directly)
- "When the Levee Breaks" — Led Zeppelin (huge, simple, roomy Bonham groove)
- "In the Air Tonight" — Phil Collins (tom fill announcing a section change)
