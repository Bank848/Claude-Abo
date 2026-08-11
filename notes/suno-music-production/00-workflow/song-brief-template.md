# Song Brief Template

> **Pillar:** 0 — Workflow · **Last updated:** 2026-08-07
> **Suno version notes:** version-independent

## Purpose

A per-song worksheet: fill in the blanks before opening any KB pillar file, then use the answers to generate a reading-order checklist tailored to this specific song. INDEX.md's "Start-here reading order" is a generic default for a new song in general; this file produces an *adapted* order — skipping files that don't apply, adding files the generic list doesn't mention (e.g. a specific language file), and flagging when a genre needs research before Suno translation can start.

Copy this file into the song's own project folder (e.g. `<YOUR_SONGS_DIR>\<song-name>\brief.md`) and fill it in per song — don't edit this template in place.

## Worksheet

### 1. Purpose / use-case
- [ ] Personal listening
- [ ] Gift (who for?): ______
- [ ] Background/functional music (context: work, party, workout, etc.): ______
- [ ] Specific event (wedding, birthday, anniversary...): ______
- [ ] Other: ______

### 2. Genre
- Genre/subgenre: ______
- Check [genre-conventions.md](../03-songwriting/genre-conventions.md): is there a worked profile for this genre already, or is it a stub you'll need to research first?
  - [ ] Worked profile exists — genre: ______
  - [ ] Stub only — research needed before drafting the Style prompt
  - [ ] Not listed at all — treat as a new stub, fill in the table after this song

### 3. Mood / emotional target
- Primary mood/emotion: ______
- Secondary/contrast mood (if the song has a dynamic arc): ______
- One-sentence "how should the listener feel by the end": ______

### 4. Key lyrical themes
- Core theme/story: ______
- Specific images, phrases, or details to include: ______
- Anything to explicitly avoid: ______

### 5. Language
- Lyric language: ______
- [ ] English — no extra file needed
- [ ] Thai — read [../04-suno/thai-language-lyrics.md](../04-suno/thai-language-lyrics.md) before writing lyrics
- [ ] Other non-English — check whether a language-specific file exists in `04-suno/`; if not, treat pronunciation/prosody risk as an open item for this song

### 6. Reference songs/artists
- Song(s)/artist(s) the vibe should resemble: ______
- What specifically to borrow (production era, vocal style, instrumentation, structure): ______
- What to deliberately avoid copying (to keep the result distinct): ______

## Reading-Order Checklist (adaptive)

Build the reading order for this song by running through these rules in order. Check off each file as you read it.

**Step 1 — Genre (always first).**
- [ ] [03-songwriting/genre-conventions.md](../03-songwriting/genre-conventions.md)
- If genre is a **stub** (from Q2): before going further, research the genre externally (tempo, key tendency, instrumentation, vocal style, structural quirks, production era — same categories as the worked Arena Rock profile) and draft a new table row. Then continue.
- If genre is **worked**: note its BPM range, key tendency, and structure template — you'll carry these into Steps 3-5.

**Step 2 — Style prompt formula (always second).**
- [ ] [04-suno/style-prompt-formula.md](../04-suno/style-prompt-formula.md) — the 5-layer tag structure you'll fill using Steps 1, 3-6.

**Step 3 — Theory files, conditional on what the genre profile specifies.**
- [ ] [01-theory/scales-and-keys.md](../01-theory/scales-and-keys.md) — always, to pick a key (remember: unreliable in the Suno Style field, but still needed for writing the actual chords/melody).
- [ ] [01-theory/chord-construction.md](../01-theory/chord-construction.md) — if you're specifying chords by name rather than just genre-level vibe.
- [ ] [01-theory/progressions-by-genre.md](../01-theory/progressions-by-genre.md) — if the genre profile references a specific progression (e.g. i-VI-VII, I-V-vi-IV, 12-bar blues) or if the genre is a stub and you need a starting progression.
- [ ] [01-theory/key-relationships-and-modulation.md](../01-theory/key-relationships-and-modulation.md) — only if the song plans a key change (e.g. final-chorus modulation, minor-verse/relative-major-chorus pivot).
- [ ] [01-theory/rhythm-and-meter.md](../01-theory/rhythm-and-meter.md) — always, to set BPM and feel (straight/swung, syncopation level).

**Step 4 — Instrument files, conditional on the arrangement.**
Read only the files for instruments actually in the arrangement:
- [ ] [02-instruments/guitar-rhythm.md](../02-instruments/guitar-rhythm.md) — if guitar carries the rhythm part.
- [ ] [02-instruments/guitar-lead.md](../02-instruments/guitar-lead.md) — if there's a lead line or solo.
- [ ] [02-instruments/bass.md](../02-instruments/bass.md) — nearly always relevant.
- [ ] [02-instruments/drums.md](../02-instruments/drums.md) — nearly always relevant.
- [ ] [02-instruments/vocals.md](../02-instruments/vocals.md) — always, for register/grit/dynamic-arc language in the Style prompt and performance cues.

**Step 5 — Songwriting craft.**
- [ ] [03-songwriting/song-structure.md](../03-songwriting/song-structure.md) — always; use the genre profile's structure template as the starting skeleton if one exists (Step 1), otherwise pick from the general templates here.
- [ ] [03-songwriting/hooks-and-melody.md](../03-songwriting/hooks-and-melody.md) — always, before writing the chorus/hook line.
- [ ] [03-songwriting/dynamics-and-arrangement.md](../03-songwriting/dynamics-and-arrangement.md) — if Q3's mood worksheet calls for a quiet/huge contrast or a build.
- [ ] [03-songwriting/lyric-craft.md](../03-songwriting/lyric-craft.md) — always, before finalizing lyric lines from Q4.

**Step 6 — Suno translation and language.**
- [ ] [../04-suno/thai-language-lyrics.md](../04-suno/thai-language-lyrics.md) — only if Q5 flagged Thai (or check for an equivalent file if another non-English language was flagged).
- [ ] [04-suno/metatags-and-lyric-markup.md](../04-suno/metatags-and-lyric-markup.md) — always, to write the tagged lyric sheet.
- [ ] [04-suno/personas-and-voice-locking.md](../04-suno/personas-and-voice-locking.md) — only if this song is part of a multi-song project needing a consistent vocalist.

**Step 7 — Generation loop (once in Suno).**
- [ ] [04-suno/iteration-strategy.md](../04-suno/iteration-strategy.md)
- [ ] [04-suno/editing-workflow.md](../04-suno/editing-workflow.md)
- [ ] [04-suno/sliders-and-excludes.md](../04-suno/sliders-and-excludes.md) — when tuning Style Influence/Weirdness/Audio Influence or building an Exclude list.
- [ ] [04-suno/limits-and-gotchas.md](../04-suno/limits-and-gotchas.md) — check before finalizing prompt length/tag count, and for any version-specific caveats.

**Step 8 — Close the loop.**
- If Step 1 required filling in a stub genre profile, promote the finished profile back into [genre-conventions.md](../03-songwriting/genre-conventions.md) (and [progressions-by-genre.md](../01-theory/progressions-by-genre.md) if a new progression was worked out) so the next song in this genre starts from a known-good baseline instead of stub guessing — per the KB's growth model (see [../INDEX.md](../INDEX.md)).
- Re-read this file ([00-workflow/song-brief-template.md](song-brief-template.md)) at the start of the *next* song rather than relying on memory of this pass.

## Gotchas / Open Items

- This template assumes one song per brief. For a multi-song project (album/EP), fill one brief per song, but track persona/voice consistency decisions ([04-suno/personas-and-voice-locking.md](../04-suno/personas-and-voice-locking.md)) at the project level, not per-brief, to avoid drift.
- The adaptive checklist above is only as good as the genre profile in [genre-conventions.md](../03-songwriting/genre-conventions.md) — if that file gains new worked genres or new stub categories, re-check whether Step 1's stub/worked branching still matches its current contents.
- Filling in a stub genre profile (Step 1) is real research work, not a checkbox — don't skip Step 8's promotion step, or the next song in that genre repeats the research from scratch.
