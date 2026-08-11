# Progressions by Genre

> **Pillar:** 1 — Music Theory · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent

## Core Concept

Certain chord progressions recur across genres because they encode a reliable emotional arc (tension → release, static → moving). Naming them with Roman numerals (see [chord-construction.md](chord-construction.md)) lets you reuse the same pattern in any key.

**The workhorse progressions:**
- **i–VI–VII** (minor rock) — e.g., Em–C–D. Static, driving, doesn't resolve to tonic within the loop — good for verses that need to feel grounded but tense.
- **I–V–vi–IV** (major pop/anthem) — the single most-used progression in mainstream pop/rock choruses. Every chord is a strong, familiar function; it's "safe" in the best sense — instantly singable.
- **12-bar blues** (I–IV–I–V–IV–I pattern) — foundational to blues/classic rock/early rock'n'roll.
- **vi–IV–I–V** — the "sensitive pop" rotation, minor-start version of I-V-vi-IV.
- **Doo-wop / 50s progression (I–vi–IV–V)** — nostalgic, warm, ballad-leaning.

## Practical Application — by genre (Arena Rock, Pop, Blues/Classic Rock, Ballad/Acoustic, Country, R&B/Soul, and Metal/Hard Rock fully worked; see Gotchas for verification status)

### Arena Rock / 80s Stadium (fully worked)
- **Verse**: i–VI–VII in the song's minor key (e.g., Em–C–D), one chord per bar, looped — static harmony lets rhythm-guitar riffing and vocal phrasing carry the momentum instead of chord movement.
- **Pre-chorus**: iv–VI–VII climbing toward the dominant (e.g., Am–C–D), ending on a Dsus4→D suspension for maximum lift into the chorus.
- **Chorus**: pivots to the relative major's I–V–vi–IV (e.g., G–D–Em–C) — see [key-relationships-and-modulation.md](key-relationships-and-modulation.md) for why this specific pivot reads as "the roof opening."
- **Full worked example**: `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)`.

### Pop / General Anthem (fully worked, researched — not yet self-verified)
- **Verse and chorus**: I–V–vi–IV throughout in a major key, no minor-verse pivot needed — e.g. in C major: C–G–Am–F. This is the "Hopscotch"/"Sensitive Female" schema and is reportedly the single most common progression in mainstream pop; it also appears rotated as vi–IV–I–V (Am–F–C–G) for a more minor-leaning "sensitive pop" verse feel before resolving to the I–V–vi–IV form in the chorus.
- **Pre-chorus**: often just a IV–V (F–G) climb into the I of the chorus, or the vi–IV–I–V rotation used as a held-tension variant of the chorus loop itself — pop rarely needs a harmonically distinct pre-chorus the way Arena Rock does, since the whole song can live in one key.
- **Bridge**: frequently drops to a single chord (often vi, e.g. Am) or strips to just root notes/pads under a stripped-back vocal, contrasting the fuller I–V–vi–IV loop everywhere else — the harmonic "breath" before the final chorus.
- **Reference**: "Let It Be" and "Don't Stop Believin'"-style I–V–vi–IV usage is well-documented in general music-theory sources (see [key-relationships-and-modulation.md](key-relationships-and-modulation.md) for how the same four-chord logic underlies verse/chorus harmonic contrast even without a key pivot).

### Blues / Classic Rock (fully worked, researched — not yet self-verified)
- **12-bar form** in the key of A: A(I) – A(I) – A(I) – A(I) – D(IV) – D(IV) – A(I) – A(I) – E(V) – D(IV) – A(I) – A(I)/E(V) turnaround. Each verse is one full pass through this 12-bar cycle.
- **Turnaround**: the last two bars (I → V, e.g. A → E) resolve back toward the top of the form rather than to a final tonic — this is what makes 12-bar blues loop indefinitely across verses instead of feeling "finished."
- **The genre-defining tension**: melody and solos are played in A minor pentatonic (A–C–D–E–G) *over* the A major chord underneath — the flatted 3rd and 7th of the scale clash productively against the major-chord harmony, the "blue note" sound that doesn't resolve the way strict major-scale melody would.
- **Dominant-7th coloring**: all three chords (I, IV, V) are typically played as dominant 7ths (A7, D7, E7) rather than plain triads — blues harmony treats the tonic itself as a "7th chord that wants to move," unlike functional classical harmony where only the V is a 7th.

### Ballad / Acoustic (fully worked, researched — not yet self-verified)
- **Verse/chorus loop**: I–vi–IV–V doo-wop rotation in a major key, e.g. in C major: C–Am–F–G, one chord per 2 bars (slower harmonic rhythm than uptempo genres lets each chord ring and support a longer vocal phrase).
- **Alternate minor-tinged verse**: some ballads open on the i–VI–VII minor-rock loop (see the workhorse list above, e.g. Em–C–D) for verse 1 before resolving into the major I–vi–IV–V for the chorus — borrowing the Arena Rock pivot mechanism (see [key-relationships-and-modulation.md](key-relationships-and-modulation.md)) but at a much slower tempo and with acoustic/sparse instrumentation instead of power chords.
- **Final-chorus modulation**: a half-step or whole-step-up key change (the "truck-driver"/"trucker's gearchange," e.g. C major → D major) immediately before the last chorus is a well-documented power-ballad convention — same mechanism described in [key-relationships-and-modulation.md](key-relationships-and-modulation.md), landing on the major version of the old tonic as the pivot/leading-tone into the new key.
- **Dynamic-swell final chorus**: even without a literal key change, ballads commonly repeat the same I–vi–IV–V loop for the final chorus but add full drums/backing vocals/layered instrumentation that were absent in verse 1 — the "arrangement modulation" substitute when a literal key change isn't used.

### Country (fully worked, researched — not yet self-verified)
- **Backbone progression**: I–IV–V is the genre's defining loop, e.g. in G major: G–C–D. Country songwriting sources describe this as "the backbone of a country song" — the resolution to I is kept strong and unornamented rather than extended or substituted.
- **Verse**: often a straightforward I–IV–I–V cycle, one or two chords per bar, leaving room for the storytelling lyric to carry momentum (the same "static harmony supports narrative" logic as the Blues 12-bar form, but without the blues-scale/major-chord friction).
- **Modern country-pop crossover chorus**: I–V–vi–IV (e.g. G–D–Em–C) or its vi–IV–I–V rotation (Em–C–G–D) — the same pop workhorse progression (see the workhorse list above) borrowed wholesale as country blends with mainstream pop production.
- **Common keys**: G, C, D, and A dominate because they use open chord shapes that ring well on acoustic guitar and sit naturally under pedal steel voicings — key choice here is as much a physical/instrumental decision as a harmonic one.
- **Bridge**: frequently a half-time or spoken-word "story turn" that can drop to a single sustained chord (often IV or vi) under the vocal before the final chorus lands back on the I–IV–V loop.

### R&B / Soul (fully worked, researched — not yet self-verified)
- **Core turnaround**: ii–V–I, borrowed directly from jazz, e.g. in C major: Dm7–G7–Cmaj7. R&B/soul rarely plays these as plain triads — 7th, 9th, 11th, and 13th extensions are the norm, e.g. Dm9–G13–Cmaj9 for the same three-chord skeleton, adding color and "sophistication" without changing the functional roots.
- **Neo-soul variant**: heavier use of 9th and sus2 voicings throughout the loop, not just on the turnaround — e.g. Cmaj9–Fmaj9–Dm9–G13 as a full verse/chorus vamp rather than a single cadential gesture.
- **Vamp/groove outro**: many R&B and soul arrangements settle onto a short one- or two-chord loop (e.g. just Fmaj7–Em7, or a static Cmaj9) for an extended "ride out" section where the vocalist ad-libs and riffs — a structural use of harmonic stasis analogous to Hip-Hop's minimal-harmony loops, but retained specifically for vocal showcase rather than beat-forward repetition.
- **I–vi–ii–V**: a common full-turnaround variant when a section needs to cycle back to the top smoothly, e.g. in C: C–Am7–Dm7–G7.

### Metal / Hard Rock (fully worked, researched — not yet self-verified)
- **Power-chord riff progression**: built from root-fifth dyads (no third, so the chord stays harmonically ambiguous major/minor and clear under distortion) rather than functional triads — e.g. in E: E5–G5–A5 (a i–III–IV shape in E minor/Aeolian), often played as a repeating palm-muted riff rather than a sustained "progression" in the pop/rock sense.
- **Phrygian-flavored riffing**: chromatic movement down to the minor 2nd is the genre's signature dark color, e.g. in E Phrygian a riff moving E5–F5–E5–G5 (the half-step E-to-F clash) reads as immediately "metal" the way the blues-scale-over-major-chord clash reads as immediately "blues."
- **Harmonic minor / Phrygian dominant leads**: neoclassical-leaning lead guitar sections use harmonic minor (e.g. E harmonic minor: E–F#–G–A–B–C–D#) or Phrygian dominant (E–F–G#–A–B–C–D) scales over the underlying power-chord riff for an "exotic," tense lead sound distinct from the rhythm section's simpler dyads.
- **Breakdown**: metalcore's structural signature — the riff drops to a slow, heavy, often single-chord or unison low-string chug (e.g. straight palm-muted low E) at half-time feel, functioning as a rhythmic/dynamic release point rather than a harmonic one; it replaces the traditional bridge's role.

## Suno Translation

Chord progressions aren't typed into Suno directly — see [chord-construction.md](chord-construction.md) Suno Translation section. This file's value is (a) picking the right verse/chorus harmonic *contrast* to describe in your planning notes before writing lyric-cue tags, and (b) judging whether a generation delivered the expected arc.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — arena rock, fully worked progression with reasoning.

## Gotchas / Open Items

- Pop, Blues/Classic Rock, Ballad/Acoustic, Country, R&B/Soul, and Metal/Hard Rock sections above are now filled in (2026-08-07) — but they are **researched and reported from web/general music-theory sources, not yet self-verified** by actually producing a song in that genre and confirming the progression reads as expected (same unverified-claim convention as [limits-and-gotchas.md](../04-suno/limits-and-gotchas.md)). Only the Arena Rock progression has been validated against an actual worked song project. **Update (2026-08-07):** that song's actual audio was measured (chroma/key-arc analysis) — see `<YOUR_SONGS_DIR>/SongA_suno_prompt.md`'s "🎧 ผลวิเคราะห์เสียงจริง" section. The late-song key-lift structure did show up, but the coarse chroma method couldn't confirm the exact chord letters (Em/G/A) claimed here — treat the *mechanism* (i-VI-VII verse, relative-major chorus, late modulation) as more solidly confirmed than the specific note names. Hip-Hop/Trap and EDM/Electronic are intentionally not covered here — both genres are typically harmonically minimal/loop-based rather than built on verse/chorus chord movement, so they don't fit this file's structure; see [genre-conventions.md](../03-songwriting/genre-conventions.md) for their (non-chord-progression) profiles instead.

## Reference Listening

- "Let It Be" — The Beatles (textbook I–V–vi–IV)
- "Stand By Me" — Ben E. King (I–vi–IV–V doo-wop rotation)
- "Johnny B. Goode" — Chuck Berry (12-bar blues form)
- "Zombie" — The Cranberries (i–VI–VII minor-rock loop)
- "Friends in Low Places" — Garth Brooks (I–IV–V country backbone)
- "Try a Little Tenderness" — Otis Redding (ii–V–I with extended jazz-derived harmony)
- "The Trooper" — Iron Maiden (power-chord riffing over a minor/Phrygian-tinged progression)
