# Controllability Map

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** targeted at Suno v5.5; controllability tiers are behavioral claims sourced from other KB files' research, re-aggregated here — see each linked file for its own confidence level

## Core Concept

Every other file in this KB either teaches a musical concept or teaches a Suno mechanism. This file answers a different, meta-level question that's currently answered piecemeal, scattered as one-line asides across five files: **for any given musical parameter, is it actually worth spending a tag slot on, and if so, through which channel?** Suno's three control surfaces are not equally reliable: the **Lyrics field** (including inline cues and section tags) is close to 100% honored because it's literal text the model must reproduce; the **Style field** is a set of probabilistic pulls that shape but don't guarantee output; **sliders** ([sliders-and-excludes.md](sliders-and-excludes.md)) adjust how tightly either of the above is followed, without adding new content themselves. A tag that fights this hierarchy — trying to force a Style-field tag to do a Lyrics-field job, or vice versa — wastes budget and produces inconsistent output.

The practical failure modes this file exists to prevent: **over-specification** (spending tag budget on parameters Suno doesn't reliably control, crowding out tags that do work — see the tag-budget ceiling in [style-prompt-formula.md](style-prompt-formula.md)), **channel mismatch** (asking the Style field to do something only the Lyrics field's inline cues can do reliably, e.g. exact ad-lib timing), and **under-trusting the model** (over-specifying a parameter that Suno's genre-prior already handles well left vague — e.g. exact chord voicings within a stated genre).

## Practical Application — the map

| Parameter | Controllability | Best channel | If uncontrollable: fallback |
|---|---|---|---|
| BPM | Reliable | Style tag, stated as a number | — |
| Genre / subgenre | Reliable | Style tag, front-loaded (layer 1, [style-prompt-formula.md](style-prompt-formula.md)) | — |
| Instrumentation (which instruments present) | Reliable | Style tag | — |
| Playing technique / patch detail (palm-muted, sidechained, supersaw...) | Reliable–partial | Style tag, expanded not just added (see [style-prompt-formula.md](style-prompt-formula.md)) | Judge by ear; re-tag with more specific technique language if generic |
| Vocal character/gender/delivery | Reliable | Style tag | — |
| Backing harmonies / layered vocals | Partial — must be asked explicitly, not inferred from genre | Style tag naming it directly (`backing harmonies on the chorus`) | If absent in output, it wasn't asked for by name — see [vocals.md](../02-instruments/vocals.md) |
| Section structure (verse/chorus/bridge presence and order) | Reliable | Lyrics field section tags (`[Verse]`, `[Chorus]`...) | — |
| Inline performance cues (belted, whispered, ad-lib timing) | Reliable | Lyrics field inline cues, own line before the target line | — |
| Exact word/phrase content | Reliable (it's literal text) | Lyrics field | — |
| Explicit musical key | Unreliable in Style field | None reliable in Style field | Don't spend a Style tag; judge key by ear in output (see [scales-and-keys.md](../01-theory/scales-and-keys.md)). **Anecdotal update (2026-08-07, SongA iteration testing, unverified by controlled test)**: user reports putting key/note detail directly in the **Lyrics field** (not Style) helped — untested against a Style-field baseline, but worth trying if key drift matters |
| Exact chord voicings/progression | Unreliable in Style field | None reliable in Style field | Don't spend a Style tag; genre tag's prior already implies a plausible progression family (see [progressions-by-genre.md](../01-theory/progressions-by-genre.md)); judge by ear. **Anecdotal update (2026-08-07, SongA iteration testing, unverified by controlled test)**: user reports putting chord/instrument detail directly in the **Lyrics field** (not Style) helped — same caveat, no before/after comparison run |
| Melody (exact notes/contour) | Uncontrollable | None | Not a tag target at all — melody is the model's job; steer indirectly via hook taxonomy ([hooks-and-melody.md](../03-songwriting/hooks-and-melody.md)) and lyric phrasing/prosody instead |
| Exact loudness/LUFS | Uncontrollable in-generation | None | Post-process outside Suno if a target loudness matters (e.g. streaming-platform normalization) — Remaster is a polish pass, not a loudness target tool (see [editing-workflow.md](editing-workflow.md)) |
| Overall adherence tightness | N/A — this is what sliders do | Style Influence slider | — |
| Deviation/experimentation amount | N/A | Weirdness slider | — |
| How much a reference audio anchors a Cover/Extend | N/A | Audio Influence slider | — |
| Things to actively avoid | Reliable | Exclude field (not negated language inside Style field) | — |

**Reading the table**: "Reliable" parameters are worth spending precise, detailed language on — that's where tag-budget ROI is highest (this is the same principle behind "expand, don't add" in [style-prompt-formula.md](style-prompt-formula.md)). "Unreliable/Uncontrollable" parameters should either be dropped from the Style field entirely or moved to a channel that actually controls them (Lyrics field for anything about *timing or exact content*; sliders for anything about *adherence strength*; nothing at all for true model-owned parameters like melody).

## Suno Translation

(This file IS a Suno-translation reference in itself — a lookup table meant to be checked before finalizing any Style-field draft or lyric sheet.)

**Before finalizing a prompt, run this check**: for every tag under consideration, ask "which row of this table does this belong to, and is it in the right channel?" A tag proposing an exact chord (`Cmaj7 to Am`) belongs in no channel reliably — drop it. A tag proposing a vocal-harmony layer belongs in the Style field, stated explicitly. A tag proposing precise ad-lib placement belongs in the Lyrics field as an inline cue, not the Style field as a general descriptor.

## Worked Examples

*(none yet — this table synthesizes existing file-level claims rather than introducing new tested claims; see each linked file's own Worked Examples for the underlying evidence)*

## Gotchas / Open Items

- This table is an aggregation, not new research — its confidence per row is only as strong as the file it cites. Several rows (backing harmonies, exact chord unreliability, melody uncontrollability) trace back to claims already flagged as reported-not-self-verified elsewhere in the KB; aggregating them here doesn't raise their confidence.
- "Uncontrollable" is a claim about the *current* generation model, not a law — re-check this table whenever Suno ships a version with more granular control (e.g. any future explicit chord/melody input mechanism would obsolete several rows).
- The LUFS/loudness row assumes no in-app mastering-to-target feature exists; if Suno ships one, that row moves from "Uncontrollable in-generation" to a normal Style-field or slider row.
