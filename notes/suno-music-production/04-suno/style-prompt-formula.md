# Style Prompt Formula

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5, 2026-08 (per web research this session; not yet independently re-tested)

## Core Concept

Suno's Style field is a comma-separated list of descriptor tags. Research (2026) indicates a **5-layer structure** tests best, in this priority order — Suno appears to weight earlier tags more heavily:

1. **Genre/subgenre** — the broadest descriptor, sets the whole feel.
2. **Instruments + playing style** — not just "guitar" but how it's played (see [guitar-rhythm.md](../02-instruments/guitar-rhythm.md), [guitar-lead.md](../02-instruments/guitar-lead.md)).
3. **Tempo/key** — BPM (reliable), key (unreliable — see [scales-and-keys.md](../01-theory/scales-and-keys.md)).
4. **Mood/emotion** — the emotional target.
5. **Production/era reference** — a cultural anchor (e.g., "80s stadium rock").

**Tag budget**: reported field limit is ~1,000 characters on v5.5 (up from a 200-character limit on older versions many guides still quote — check the date on any external guide). This ~1,000-char figure is now corroborated by 3+ independent sources as of a second research pass (see [limits-and-gotchas.md](limits-and-gotchas.md) for the full corroboration note). The *effective* limit is tighter: **8-15 tags**. Beyond ~15, Suno reportedly starts dropping tags from the **middle** of the prompt silently — not a graceful truncation from the end, and you get no warning; this specific "dropped from the middle" mechanism remains thin/single-sourced even after a second pass. Most users under-use the character budget (100-200 chars typical) and get generic output; a well-structured 500-800 character prompt with rich, specific tags outperforms a short generic one. **Front-loading tip (corroborated across multiple sources)**: because Suno weighs earlier tags more heavily and truncates silently with no warning, put your most important genre/mood/vocal descriptors first — some guides go further and recommend repeating the single most critical term near the end too (a "sandwich" placement), as a hedge against mid-prompt de-prioritization, though that specific workaround is less rigorously sourced than the front-loading principle itself.

## Practical Application

**Expand tags, don't just add more of them.** "distorted guitars" (2 words) is weaker than "distorted crunchy power chord guitars with palm-muted verse riffs and a simple pentatonic solo hook" (still ONE tag slot, far more information) — see [guitar-rhythm.md](../02-instruments/guitar-rhythm.md) for where this level of detail comes from.

**Where to spend tag budget**: BPM, instrumentation, and vocal type are reliably honored — worth precise language. Explicit key is not reliably honored — don't waste a tag slot on it (judge key by ear in the output instead, per [scales-and-keys.md](../01-theory/scales-and-keys.md)).

**Cross-check against real working examples** before trusting a from-scratch prompt — a genre this well-trodden (e.g., arena rock) has publicly shared prompts that work; matching their general shape (genre → mood → vocal → instruments → BPM) while adding your own specificity is safer than inventing structure from theory alone.

## Suno Translation

(This file IS the Suno translation layer for the whole KB — it's where Pillars 1-3 knowledge gets compressed into tag language.)

Worked formula, generalized from a validated arena-rock example: `<genre/era>, <instrument+technique tags with detail>, <drum character>, <bass character>, <vocal character+production>, <mood tags>, <reverb/room character>, <era reference>, <BPM>`.

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — Style field built and iterated using this formula, including a side-by-side comparison against a real community-shared working prompt for the same genre.

## Gotchas / Open Items

- The exact character limit (1,000 on v5.5) and the "~15 tags, mid-prompt silent drop" behavior are **reported from external research this session, not yet empirically self-verified** by generating and inspecting truncated output directly. Re-verify on the next song if Suno's version has changed. **As of a second research pass**: the 1,000-character figure is now corroborated by 3+ independent sources (raises confidence in the number itself); the "~15 tags, dropped specifically from the middle" mechanism remains thin/single-sourced (no independent re-confirmation of the middle-drop mechanism specifically found) — these two related claims now sit at different confidence levels even though they were bundled together in the first pass. Full detail in [limits-and-gotchas.md](limits-and-gotchas.md).
