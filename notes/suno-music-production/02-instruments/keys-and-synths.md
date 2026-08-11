# Keys & Synths

> **Pillar:** 2 — Instrument Technique · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent patch/role vocabulary; Suno-translation tag examples targeted at v5.5

## Core Concept

Guitar has two dedicated files in this KB ([guitar-rhythm.md](guitar-rhythm.md), [guitar-lead.md](guitar-lead.md)) because "how it's played" matters as much as "what instrument." Keyboards and synths need the same treatment — five of the nine worked genre profiles in [genre-conventions.md](../03-songwriting/genre-conventions.md) (Pop, EDM/Electronic, Hip-Hop/Trap, R&B/Soul, and partly Ballad/Acoustic) are keyboard/synth-centric, but the only vocabulary this KB has offered for them is the bare word "synth" or "piano" — a generic tag that under-uses the Style field's expand-don't-add principle ([style-prompt-formula.md](../04-suno/style-prompt-formula.md)).

**The role/patch split**: unlike guitar, "keys" covers acoustic/electric pianos (played, expressive, human-touch instruments) and synthesizers (programmed, patch-selected, texture-first instruments) — two different mental models under one instrument family. A patch name (`pluck`, `pad`, `supersaw`) is itself a Style-field-ready tag in a way "distorted guitar" needs technique words added to become one — synth vocabulary is already compact.

**Core patch taxonomy** (the promptable words):
- **Pad** — sustained, slow-attack, texture/atmosphere, sits underneath other parts rather than being heard as a distinct line.
- **Pluck** — short, percussive, plucked-string-like decay; carries rhythmic melodic lines without competing with vocals for sustain.
- **Stab** — very short, punchy, chordal hit (a whole chord, not a single note) used as a rhythmic accent, not a melody.
- **Arp(eggio)** — a chord's notes played in rapid sequence by a programmed arpeggiator rather than a human performance; a defining EDM/trance texture.
- **Lead** (synth lead) — the melodic-hook-carrying patch, analogous to a guitar solo's role; sub-flavors worth naming explicitly: supersaw (thick, detuned, festival-EDM), acid (squelchy, filter-modulated, 303-style), FM lead (glassy, metallic, 80s-digital).
- **Bass patches**: sub bass (pure low sine, felt more than heard), Reese bass (detuned, growling, dubstep/DnB signature), 808 (pitch-slid trap sub, doubles as both bass and rhythmic kick element — see the Hip-Hop/Trap row in [genre-conventions.md](../03-songwriting/genre-conventions.md)).
- **Piano/electric-piano family**: acoustic piano (played, dynamic, genre-flexible from ballad to pop), Rhodes/Wurlitzer (warm, slightly overdriven electric piano, the R&B/neo-soul and city-pop signature sound), organ (sustained, drawbar/Hammond-style, gospel and classic-rock contexts).

## Practical Application

- **Role, not just patch**: state what the patch is *doing*, matching the arrangement-role vocabulary — a pad **holds** harmony, a pluck or arp **carries** a rhythmic line, a stab **accents**, a lead **carries the hook**. Two patches in the same role and register fight each other (a pad and a sustained lead both filling the same mid-range will mask each other).
- **Comping vs. sustaining vs. arpeggiating** as the three keyboard-part textures: comping (rhythmic, chordal, syncopated — funk/R&B chicken-scratch-adjacent on keys), sustained pad (held chords, minimal rhythmic information, texture-first), arpeggio (mechanical note-by-note movement, rhythmic *and* harmonic at once — EDM's default way of stating harmony under a build).
- **Filter sweep / sidechain pump as texture words, not just mixing terms**: a filter sweep (a synth's brightness rising or falling over a phrase, used on pads/leads to build or release tension) and sidechain pump (bass/pads ducking rhythmically against the kick — see the EDM/Electronic row in [genre-conventions.md](../03-songwriting/genre-conventions.md)) are both promptable as Style-field descriptors, not just DAW-level production choices.
- **Per-genre defaults** (starting points, not rules): Pop → pluck/lead for the hook, sub or synth-bass doubling the kick; EDM → supersaw or acid lead in the drop, arp under the build, heavy sidechain pump throughout; Hip-Hop/Trap → 808 as the bass, occasional stab/pluck for the melodic loop; R&B/Soul → Rhodes for comping/harmonic bed, sub bass for the modern variant vs. a played bass for the classic-soul variant; Ballad/Acoustic → acoustic piano as the primary harmonic bed, replacing (or alongside) acoustic guitar.

## Suno Translation

Style-field tags built the same "expand, don't add" way as guitar tags: `warm Rhodes electric piano comping` beats "piano"; `supersaw synth lead in the drop, arpeggiated pluck synth in the build-up, sidechained pumping sub bass` beats "synths." Naming the **patch + its role + where in the structure it appears** in one tag slot is the highest-density use of the budget, mirroring the guitar-rhythm mute→open naming pattern.

Judging output: does a stated pad actually sit *underneath* other parts, or is it competing for the same register as the lead/vocal? Does an arp read as a distinct rhythmic-harmonic element, or did it get rendered as a generic sustained chord? A muddy, undifferentiated keyboard bed is a signal to add role language (`sparse comping, leaving space for the vocal`) rather than removing the instrument tag.

## Worked Examples

*(none yet — no song in this KB's project history has centered a keys/synth arrangement; this file is researched theory, not self-verified against a generation)*

## Gotchas / Open Items

- All patch-name-to-output-fidelity claims (does "Reese bass" actually produce a Reese-style growl, does "supersaw" reliably produce the thick detuned texture) are unverified — this file is more speculative than the guitar files, which had a real worked song to check against.
- Whether Suno differentiates "pad" from "sustained synth" or "pluck" from "short synth stab" as distinct trained categories, vs. treating them as near-synonyms, is unknown until tested with a controlled A/B generation.
- 808 specifically straddles two roles (bass instrument AND rhythmic/kick element) — this dual identity may need its own inline handling if a generation renders it as only one or the other; flag for the first real trap/hip-hop generation test.
