# Sliders & Excludes

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5-era UI, 2026-08 (per web research this session; feature naming/placement may shift with future versions — not yet independently re-tested)

## Core Concept

Beyond the Style/Lyrics text fields, Suno reportedly exposes controls that shape how tightly a generation adheres to the prompt vs. how much it improvises:

- **Style Influence** — how strongly the Style-field tags constrain the output.
- **Weirdness** — how much the model is allowed to deviate/experiment beyond the literal prompt.
- **Audio Influence** (on Cover/Extend operations, or when using an Audio Upload) — how much the new generation is anchored to the reference audio's actual sound vs. free to reinterpret.

**Second-pass corroboration**: these three sliders (grouped under an "Advanced Options"/"Creative Sliders" panel) are confirmed by Suno's own help-center article ("How to Use: Creative Sliders", help.suno.com) as well as independently by multiple third-party guide sites researched this session — this is now a **primary-source-confirmed** feature name/existence, though this project still has not driven the actual UI. Reported numeric ranges (0-100%, framed as "Safe → Chaos" for Weirdness and "Loose → Strong" for Style Influence) are corroborated across 3+ independent guide sites, not just one.

**Exclude field** — a separate text field (not part of the main Style prompt) for explicitly unwanted elements. Keeping negatives here rather than writing them as negated language inside the Style field reportedly avoids "meaningful conflicts" — the model reportedly handles a clean list of things-to-avoid better than sentences like "not too much reverb" mixed into positive descriptors.

**Vocal Gender toggle** — a binary Male/Female selector, confirmed to exist by a direct screenshot of the Suno v5.5 generate screen (2026-08-09, first-hand confirmation, not web-research-reported like the sliders above). Sits in the same settings panel as Weirdness/Style Influence. **Working model, per the user's own stated understanding (not yet independently verified against Suno docs or a real generation)**: the toggle sets the song's "lead/primary" vocal gender rather than locking the whole song to one voice — for a duet, select whichever gender sings the LEAD role (most lines, opens/closes the song) and let in-lyric `[Male Vocal]`/`[Female Vocal]`/`[Both]` tags control the secondary voice. Leaving the toggle blank was an earlier working guess in this file; the user's revised guidance is to actively select the lead gender instead, on the reasoning that this is "safer" than leaving it unset. Neither variant (blank vs. lead-selected) has been tested against real output yet. No guide research or prior KB entry covered this control at all — it was invisible to text-based research and only surfaced from an actual screenshot. **First real test of this is pending** — see the Gotchas entry below and `<YOUR_SONGS_DIR>\SongB_suno_prompt.md`'s settings section for the live test case (which will run with the toggle left blank, per this working model).

**Duration** — a Custom/Auto toggle, also confirmed via the same screenshot, also not previously documented anywhere in this KB. Auto presumably lets Suno pick a length; Custom presumably allows specifying a target duration. Not yet tested which is better for a structured multi-section song (verse/chorus/bridge count that implies a specific expected length) vs. letting Suno decide.

## Practical Application

- **For a well-trodden genre** (like arena rock, with abundant training data and strong conventions): push **Style Influence high, Weirdness low** — you want tight, convention-following execution, not novel reinterpretation, since the genre's clichés ARE what make it read as authentic.
- **For a more experimental/blended genre**: higher Weirdness may be desirable to get an interesting hybrid result — but this increases variance and requires more audition rounds (see [iteration-strategy.md](iteration-strategy.md)) to find a good take.
- **Community-reported Weirdness sweet spot**: 40-60% is repeatedly cited (multiple guide sites, second research pass) as the range that works for "90% of songs" — low enough to stay coherent, high enough to avoid bland/generic output. Values pushed meaningfully above this range are reported to risk breaking genre coherence entirely, consistent with this file's existing guidance to keep Weirdness low for convention-bound genres. Still not confirmed by this project's own generations.
- **Community-reported Style Influence low end**: 0-30% is described as "Loose" — tags are treated as hints the model can freely riff on, and the output may land adjacent to the specified genre rather than squarely in it. Useful to know as a failure mode if a generation drifts genre despite tags looking correct — check this slider isn't set low before assuming the Exclude list or Style tags themselves are the problem.
- **Building an effective Exclude list**: think about the genre's "nearest neighbors" that the model might drift toward and explicitly fence them off (e.g., for arena rock: `trap hi-hats, auto-tune, EDM drops, synth pads, orchestral strings, ballad tempo, rap verses` — anything from an adjacent-but-wrong genre).

## Suno Translation

(This file is itself the Suno-specific control-surface reference.)

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — Exclude field built specifically around genre-adjacent drift risks for arena rock.

## Gotchas / Open Items

- Existence and exact behavior of Style Influence/Weirdness/Audio Influence sliders is reported from research, not yet confirmed hands-on in this project. **Corroborated as of this second research pass** by Suno's own help-center documentation plus 3+ independent third-party guides (a stronger evidence base than the first pass had — first pass was guide-only) — still not hands-on tested, so it stays in this unverified log per the vault's rule, but confidence in the feature's existence/naming is now high.
- The specific numeric sweet-spot figures (40-60% Weirdness, 0-30% "Loose" Style Influence) are reported from community guides only, not from Suno's own documentation — treat these as looser/softer claims than the slider names themselves, and expect to calibrate them against actual output once used.
- [ ] **Vocal Gender toggle's interaction with duet/multi-voice songs is completely untested against real Suno output.** Working plan for Gen 1 of `<YOUR_SONGS_DIR>\SongB_suno_prompt.md`: select the lead voice's gender (Female, since she carries more of the song) and rely on in-lyric `[Male Vocal]` tags for the secondary voice. If the secondary (non-selected) gender comes out weak, suppressed, or absent despite explicit lyric tags, that's the toggle overriding the tags rather than coexisting with them — correct this entry and [duets-and-multiple-vocalists.md](duets-and-multiple-vocalists.md) (which doesn't currently mention this control at all) once observed.
- [ ] Duration Custom-vs-Auto behavior and which is better for a tagged multi-section song structure — untested.

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
