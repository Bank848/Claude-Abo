# Arrangement Roles

> **Pillar:** 3 — Songwriting Craft · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent theory; Suno-translation tag examples targeted at v5.5

## Core Concept

[dynamics-and-arrangement.md](dynamics-and-arrangement.md) covers the **horizontal** axis of arrangement — how density/energy changes *over time* across a song's sections. This file covers the **vertical** axis — at any single moment, who is playing, in what register, doing what job. A section can have the "right" density for its place in the dynamic arc and still sound muddy or thin if the vertical arrangement is wrong — too many parts competing for the same register, or too few filling distinct roles.

**The five classic arrangement roles**, borrowed from real-band arranging and directly promptable:
1. **Foundation** — kick + bass, establishes the low-end pulse and harmonic root. Almost always present; a section that drops the foundation (bass/kick both out) reads as maximally stripped-back (see [dynamics-and-arrangement.md](dynamics-and-arrangement.md)).
2. **Rhythm/comping** — chordal, rhythmic, states the harmony without being the melodic focus (rhythm guitar, keys comping — see [guitar-rhythm.md](../02-instruments/guitar-rhythm.md), [keys-and-synths.md](../02-instruments/keys-and-synths.md)).
3. **Pad/sustain** — held, slow-moving harmonic texture, sits underneath everything else, rarely the listener's conscious focus.
4. **Lead/melody** — the part the ear tracks: lead vocal, guitar solo, synth lead. Only one lead-role part should be prominent at a time — two simultaneous "leads" (e.g., vocal and guitar solo both foregrounded) mask each other rather than doubling the impact.
5. **Fills/ear candy** — brief, non-continuous accents that punctuate rather than sustain (drum fills, one-off guitar licks — see [drums.md](../02-instruments/drums.md) and the ear-candy concept in [dynamics-and-arrangement.md](dynamics-and-arrangement.md)).

**The core rule**: two instruments should not occupy the **same role in the same register at the same time**. Two comping instruments both strumming full chords in the same mid-range fight for the same sonic space; a pad and a sustained synth lead in the same register mask each other. The fix is either role separation (one comps, one sustains) or register separation (one plays low-mid, one plays high) — usually both.

## Practical Application

- **Register allocation as a checklist**: bass owns the low register, comping/rhythm instruments own the low-mid to mid, pads own the mid (staying out of the vocal's way), lead/vocal owns the upper-mid to top, fills/ear-candy live in the gaps rather than a fixed register. A crowded mid-range (bass, rhythm guitar, pad, AND vocal all in a tight octave-and-a-half) is the single most common cause of a "muddy" mix complaint that isn't actually an EQ problem — it's a register-allocation problem upstream of mixing.
- **Keeping the vocal pocket clear**: the single highest-value rule here. Whatever the vocal's active register is, no other instrument's *lead-carrying* part should occupy it simultaneously — comping/pads can pass through that register as long as they're not foregrounded there. This is why so many genre conventions in [genre-conventions.md](genre-conventions.md) explicitly thin the arrangement during verses (sparse bass, minimal drums) — it's protecting the vocal pocket, not just building dynamics.
- **Counterpoint-lite — line interaction without real voice-leading theory**: Suno gives no note-level melodic control, so writing actual species counterpoint is wasted effort. What IS promptable and valuable is *role-level* line interaction: a **countermelody** (a secondary melodic line, usually instrumental, that answers or weaves around the vocal in its gaps rather than competing with it — e.g., a guitar or keys line that only plays between vocal phrases), **call-and-response between instruments** (not just vocal call-and-response, covered in [vocals.md](../02-instruments/vocals.md) — e.g. a horn stab answering a guitar riff), and **contrary motion as a texture** (bass line moving opposite the melody's direction, a cheap way to add interest without needing exact pitches specified).
- **Sparse-arrangement tagging**: naming exactly which roles are present is more reliable than a vague "stripped back" — `sparse verse: vocal, bass, and hi-hat only` tells the model precisely which roles to drop, rather than leaving "how sparse" to chance.

## Suno Translation

Style-field tags name the role and its placement, not just the instrument: `guitar countermelody answering the vocal phrases`, `horn stabs in the gaps between vocal lines`, `sparse verse arrangement: vocal, bass, and hi-hat only, full band re-enters on the chorus`, `pad sits low in the mix, staying out of the vocal's way`. This is the same "expand, don't add" principle as [style-prompt-formula.md](../04-suno/style-prompt-formula.md), applied specifically to *who's doing what and where* rather than just tone/technique.

Judging output: does the vocal ever feel buried or competing for space, especially in a section meant to be vocal-forward? Is there a moment where a secondary instrumental line is audible answering the vocal, or does everything just play continuously and simultaneously throughout? A generation where every instrument plays constantly, at the same density, throughout every section, is a signal the role/register vocabulary above wasn't specified — that's a prompt-language problem, worth a Replace Section retry with explicit role-thinning language rather than just an EQ/mix judgment.

## Worked Examples

*(none yet — this file formalizes a principle implicit in the existing SongA worked example's production notes but not previously named as its own concept; revisit once a new song's arrangement is planned using this vocabulary explicitly)*

## Gotchas / Open Items

- Whether Suno's generation process actually reasons about "roles" and register allocation the way a human arranger would, or produces plausible-sounding arrangements through pattern-matching without any such internal representation, is unknown — the tags above are "words that tend to produce the right kind of output," not a claim about Suno's internal model.
- The countermelody/call-and-response tags in particular are unverified for reliability — whether Suno reliably places a secondary instrumental line specifically *in the gaps* of a vocal line (rather than just adding a generic secondary instrument playing continuously) has not been tested against real output.
