# Stems & Remix

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v5.5-era UI (Suno Studio), 2026-08 (per web research this session — NOT yet self-verified hands-on)

## Core Concept

A finished Suno generation is a mixed stereo file by default, but Suno also offers **stem separation** — splitting a track into isolated component tracks (vocals, drums, bass, individual instruments) — inside a feature called **Suno Studio**. This matters for DAW handoff: it's the mechanism for pulling a vocals-only or instrumental-only version out of a generation, or for replacing individual elements (e.g., swap in user-programmed drums) rather than accepting the full mix as-is.

## Practical Application

- Entry point: the **"..." menu on a song in your Library** (or hover → "Get Stems"), which opens stem separation inside **Suno Studio**. Officially confirmed, corroborated by 3+ third-party guides.
- Three modes, officially documented with real granularity:
  - **Auto Split** — automatic breakdown into **up to 12 stems** (vocals, backing vocals, drums, bass, guitar, keyboard, strings, brass, woodwinds, percussion, synth, FX/other — exact list varies slightly by source; Suno's own doc says "drums, bass, guitar, keyboards, woodwinds, and more").
  - **Split from Mix** — a simple 2-way split: pick one instrument/vocal, get that stem **plus its complement** ("everything else"). This is the direct route to a clean vocals-only or instrumental-only pair.
  - **Advanced Split** (Premier only) — custom selection from roughly **100 instrument types**, for fine-grained multitrack export.
- **Credit costs** (officially documented, single-source but from the dedicated help article): Auto Split = 50 credits/extraction; Split from Mix = 10 credits/stem; Advanced Split = 10 credits/stem. See [credits-and-economics.md](credits-and-economics.md) for how this fits your overall budget.
- **Remix is a separate, in-Suno feature**, not the same as exporting stems for external use: inside Suno Studio you can regenerate a single section (verse/chorus) in place, plus use a remix-intensity slider to generate variations while keeping the song's core identity. This is Suno-internal — see [editing-workflow.md](editing-workflow.md) for how it relates to Replace Section.

## Suno Translation

- **Export format/quality is thin and not officially documented.** Suno's own help docs give no bitrate/sample-rate spec. Marketing copy on suno.com's own landing pages (not the help-center docs) claims "high-quality WAVs or MP3s" and "up to 12 time-aligned WAV stems," and one third-party source (single-source) says stems typically export as WAV in a ZIP alongside the original mix. Treat exact format/quality as unconfirmed until checked in-app.
- **Tier gating is contradictory — flag explicitly rather than asserting one rule.** Suno's own help center has two pages that read inconsistently as of this research pass:
  - One official page states Suno Studio itself requires **Premier**.
  - Another official page (the dedicated stem-separation article) states Auto Split and Split from Mix are available on **Pro and Premier**, with only Advanced Split gated to Premier-only.
  - A third-party source independently agrees with the Pro/Premier split reading; a different unnamed source claimed stem export is Premier-exclusive.
  - Likely explanation: Pro gets limited Studio access for basic stem splitting, not full Studio. **Verify your own account's actual access in-app rather than trusting either doc page at face value.**
- **DAW-handoff claim ("time-aligned" stems, drop-in ready for Ableton/Logic/etc.) comes from Suno's marketing pages, not the help-center docs**, and is not independently corroborated by any third-party report of actual drift/padding/sample-rate issues (or lack thereof) found in this research pass. Absence of complaints isn't confirmation — this is unresearched territory, not a settled "no problems" finding.
- **Watermark caveat (single-source, third-party)**: exported stems reportedly carry the same watermark as the mixed master and would need artifact removal before any distribution use — worth checking before assuming stems are distribution-ready straight out of export.

## Worked Examples

None yet — no song project in this vault has exported stems or used Suno Studio's remix tools. The first project that does should log here: which tier was used, actual credit cost observed, export format/quality as actually downloaded, and whether the "time-aligned" DAW-drop-in claim held up.

## Gotchas / Open Items — Unverified-Claim Log

**Status: all entries below are "reported, not yet self-verified"** unless marked officially confirmed. Sourced from Suno's own help-center articles plus third-party guides during this session, not confirmed by this project exporting actual stems:

- [x] "Get Stems" / Suno Studio exists, with Auto Split / Split from Mix / Advanced Split as named modes — **officially confirmed**, corroborated by 3+ independent third-party sources.
- [x] Up to 12 stems (Auto Split) and ~100-instrument custom selection (Advanced Split) — **officially confirmed**.
- [x] Credit costs (50 / 10 / 10 per operation type) — officially documented in the dedicated help article, but not cross-checked against a second independent source.
- [ ] Exact export file format and audio quality (bitrate/sample rate) — thin, no official spec found; only marketing-page and single third-party-blog claims.
- [ ] Subscription-tier gating for stem export — **actively contradictory between two of Suno's own help-center pages**. This is the single item most worth a direct in-app check before relying on it for planning.
- [ ] "Time-aligned, DAW-ready" claim — marketing-page-only, not corroborated or contradicted by any independent report found.
- [ ] Stems carrying the same watermark as the mixed master, requiring removal before distribution — single third-party source, not cross-checked.

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
