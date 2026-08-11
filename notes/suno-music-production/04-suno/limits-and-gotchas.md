# Limits & Gotchas

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5, 2026-08 (per web research this session) — THIS FILE IS THE APPEND-ONLY CHANGELOG for version-specific findings; re-verify entries after any Suno major-version update.

## Core Concept

Suno's field limits and quirks change across versions faster than general music theory does — this file exists specifically to isolate that churn so the rest of the KB (Pillars 1-3, which are version-independent) doesn't need updating when Suno ships a new version. Only this file (and the version-stamped Pillar 4 files) need re-verification per Suno update.

## Practical Application — Known Limits (as of Suno v5.5, reported 2026-08, NOT yet self-verified)

- **Style field character limit**: ~1,000 characters on current models (v4.5/v4.5+/v5/v5.5); older-version guides quoting 200 characters are describing v4, and some sources describe v3.5 as having a 3,000-character cap — check the date and version scope on any external source, since multiple different limits are correctly reported for different Suno versions. **Second-pass corroboration**: the ~1,000-char figure for v5.5 is now independently confirmed by 2+ additional dedicated "character limit cheat sheet" sites (found this pass) beyond the original source, raising confidence this specific number is correct for the current version.
- **"Sandwich method" tip (new this pass, single-source-ish)**: some guides recommend repeating your single most important tag/term near both the start AND the end of the Style field, on the theory that it survives even if content in the true middle gets deprioritized/dropped. This is a community workaround built on top of the already-reported "front-loading" and "mid-prompt drop" behavior below, not a separately confirmed mechanism — treat as a tactic worth trying, not a proven fact about Suno's internals.
- **Effective tag count**: 8-15 tags recommended. Beyond ~15, tags are reportedly dropped from the **middle** of the prompt silently (no error, no warning) — this is a bigger risk than simple truncation from the end, since you might lose a tag you assumed was active.
- **Silent truncation**: if a prompt exceeds the character limit, it's reportedly cut with no indication to the user — the output just sounds subtly wrong with no error message to diagnose why.
- **Key tag unreliability**: explicit key names in the Style field (e.g., "E minor") are reportedly honored loosely/inconsistently — don't spend tag budget on this (see [scales-and-keys.md](../01-theory/scales-and-keys.md)).
- **Chorus length**: choruses read best at 2-4 lines for melodic weight; longer choruses reportedly spread the hook too thin.
- **Backing harmonies**: reportedly need to be requested explicitly by name ("backing harmonies on the chorus") — the model tends to default to lean verses and won't automatically add layered harmony without being told.

## Practical Application — Where to Track Version Changes

Since this file is the append-only changelog for version-specific findings, it needs a reliable ongoing source to check against. As of this research pass:

- **Official changelog: `suno.com/release-notes`** — actively maintained, dated entries tagged by category ("New Feature," "Improvement," "Music Model"). This is the single best URL to bookmark and skim monthly; the "Music Model" tag specifically distinguishes an actual model-version change from a UI/feature tweak. Officially confirmed by direct fetch, entries current through Jul 2026.
- **Official blog (`suno.com/blog`)** carries the longer-form narrative for major versions (e.g. `suno.com/blog/v5-5`) — check this when a "Music Model" release-notes entry appears; minor tweaks may not get a full post.
- **Suno's own model-timeline help article** (`help.suno.com/en/articles/5782721`) is official but noticeably **lags** — as of this research pass it stopped at v5/v4.5+ and hadn't been updated for v5.5 yet, despite v5.5 having shipped months earlier. Don't treat this help article as current; treat the release-notes page as the source of truth.
- **Discord and X/Twitter** (`@suno_ai_`) are official-adjacent amplification channels, not authoritative changelog sources — useful for community sentiment/early leaks, not for tracking "what changed."
- **No strong community wiki or megathread tracker was found** as of this research pass — third-party comparison/blog sites exist (SEO/marketing content, treat cautiously) but nothing rose to "canonical community-maintained tracker" status. This is a genuine gap, not just an unresearched corner — re-check periodically in case one emerges.
- **Recommended habit**: skim the release-notes page monthly; on any "Music Model" entry, read the matching blog post if one exists; before deciding whether to regenerate an older song on a newer model, cross-check 1-2 independent comparison write-ups rather than relying on the changelog alone (regeneration is a judgment call the changelog doesn't answer), and remember Remaster/regenerate reportedly doesn't overwrite the original by default (community-reported, not officially confirmed) — so testing a newer model on an old song is low-risk.

**Rough version timeline** (for sanity-checking version-specific claims elsewhere in this KB — corroborated across help.suno.com and 2+ aggregator sources through v5; v5.5 details corroborated by trade press plus Suno's own blog):

| Version | Approx. timing | Headline capability jump |
|---|---|---|
| v2 | Fall 2023 | Max generation ~1:20 |
| v3 | Spring 2024 | 2-minute generations |
| v3.5 | Summer 2024 | Better song structure, 4-min first gen |
| v4 | Nov 2024 | Improved vocal quality, + Extend/Cover/Persona |
| v4.5 | May 2025 | 8-min first gen, better prompt adherence, style mashups |
| v4.5+ | Jul 2025 | Add Vocals / Add Instrumental production tools |
| v5 | Sep 2025 | Cleaner/fuller mixes, more natural vocal realism |
| v5.5 | ~Mar 2026 | Voices (voice cloning), Custom Models, "My Taste" personalization |

The v5.5 exact date is a single-source figure from search synthesis, not independently cross-fetched from the primary blog post — worth a direct check of `suno.com/blog/v5-5` before treating it as certain.

## Suno Translation

(This file IS the Suno-specific translation layer — see [style-prompt-formula.md](style-prompt-formula.md) for how these limits shape prompt construction.)

## Worked Examples

- `<YOUR_SONGS_DIR>/SongA_suno_prompt.md (song project folder, separate from this vault)` — Style field built to stay well under the character limit while maximizing tag richness; cites the "ask for backing harmonies explicitly" finding directly.

## Gotchas / Open Items — Unverified-Claim Log

**Status: all entries below are "reported, not yet self-verified"** — sourced from external web research during this session (guides, community discussion), not confirmed by this project generating and inspecting actual Suno output. Each should be promoted to "self-verified" (with the date and what was observed) the first time a song project actually tests it:

- [ ] 1,000-character Style field limit on v5.5 — **corroborated by 3+ independent sources as of this research pass** (original source plus 2 additional dedicated character-limit guide sites found this pass, all agreeing on ~1,000 for current-generation models specifically), still not hands-on tested by generating and inspecting truncated output directly.
- [ ] ~15-tag effective limit before mid-prompt silent drop — still only single/thin-sourced as of this pass; no independent source found that specifically re-confirms the "dropped from the middle" mechanism (vs. simple end-truncation) beyond the original research. Treat this specific mechanism claim as the weakest-sourced item in this list.
- [ ] Silent truncation behavior (no user-facing warning) — reconfirmed by additional sources this pass (multiple guides independently state truncation happens without any error/warning), corroborated by 2+ independent sources, still not hands-on tested.
- [ ] Explicit key tags being unreliable — no new corroboration found this pass; still single-source-level confidence, unchanged from the first research pass.
- [ ] "Backing harmonies on the chorus" needing explicit request — no new corroboration found this pass; still single-source-level confidence, unchanged from the first research pass.
- [ ] Weirdness/Style Influence/Audio Influence sliders exist as named UI controls under an Advanced Options/Creative Sliders panel — **corroborated by Suno's own help-center article plus 3+ independent third-party guides** as of this pass (see [sliders-and-excludes.md](sliders-and-excludes.md)) — the strongest-sourced item added this pass, still not hands-on tested.
- [ ] Persona voice "drift" over repeated generations is a real, reported phenomenon — corroborated by 2 independent source types (forum discussion + guide sites) as of this pass (see [personas-and-voice-locking.md](personas-and-voice-locking.md)), severity/frequency unmeasured, not hands-on tested.
- [ ] Replace Section and Crop being Pro/Premier-tier-only features — single-source claim added this pass (see [editing-workflow.md](editing-workflow.md)), not cross-checked against a second source or Suno's own pricing page.
- [ ] No community wiki/megathread exists for tracking version differences in plain language — this is a negative finding (absence of something), added this pass; possible one exists and simply wasn't surfaced by the searches run — re-check periodically rather than treating this as permanently settled.

When a claim is tested, move it out of this checklist into the "Practical Application" section above with a confirmation note and date.
