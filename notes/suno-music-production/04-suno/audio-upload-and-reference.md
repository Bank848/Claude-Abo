# Audio Upload & Reference-Audio Workflows

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** verified against Suno v4.5+/v5.5-era UI, 2026-08 (per web research this session — NOT yet self-verified hands-on)

## Core Concept

Beyond typing a Style prompt from scratch, Suno lets you feed it **your own audio** — a hummed melody, a live instrument take, or an existing track — as a starting point. This is a distinct input channel from the Style/Lyrics text fields covered in [style-prompt-formula.md](style-prompt-formula.md), and distinct from the Cover-as-restyle case already covered in [editing-workflow.md](editing-workflow.md) (re-rendering an existing *Suno-generated* song in a new style). This file covers the case where the source material is **audio you supply**, not audio Suno already made.

## Practical Application

- The feature is called **"Upload Audio"** (also "Audio Upload," or the "Audio" tab next to the Create button / via Library → Upload Audio). Confirmed by 2+ official help.suno.com articles — this is a first-class UI element, not a hidden/beta feature.
- Two entry paths: **record live** in-app (hum, sing, play an instrument into the mic) or **upload an existing audio/video file**.
- After uploading, you choose an operating mode — most relevantly **Cover**, which analyzes the uploaded audio (melody, structure, and reportedly vocal content) and generates a new version in a different style while retaining the core melodic/structural identity. (v3.5 reportedly only offered "Extend" reshaping; v4.5 introduced Cover as a more controllable dedicated mode for this — single third-party source for the version-history detail, not officially cross-checked.)
- **Genuine audio-to-audio style transfer exists**, not just melody extraction: when an Audio Upload is used, an **Audio Influence** slider appears (alongside the standard Weirdness / Style Influence sliders — see [sliders-and-excludes.md](sliders-and-excludes.md)) that controls how strongly the source audio's actual sound character bleeds into the new generation vs. how freely the model reinterprets it. Officially confirmed to exist and be named this; the precise numeric mechanics of "influence" are not documented anywhere found.
- Related but separate: **"Voices"** — upload/record 15 seconds to 4 minutes of your own voice (best 2-minute segment auto-selected) to build a reusable vocal profile applied to future generations, with identity verification (read-aloud phrase) and 18+/geo gating. This is a different pipeline from Cover/Extend on instrumental or full-track uploads — don't confuse the two. Single official source, not independently corroborated by third parties in this research pass.
- Copyrighted audio is blocked from upload (official, no detail on detection method). Uploads containing vocals are kept private/unsearchable (official).

## Suno Translation

- **Length limits are contradictory across Suno's own help articles** — flag explicitly rather than picking one number with confidence:
  - One official article: 60 sec (free) / up to 8 minutes (Pro/Premier).
  - Another official article: 6–60 sec (free) / up to **120 seconds** (Pro/Premier) — not 8 minutes.
  - A third-party source additionally claims upload is **Pro-exclusive** (contradicting the free-tier 60-second figure above).
  - **Practical takeaway**: verify the current limit in-app before planning a project around a specific upload length — Suno's own docs disagree with each other as of this research pass, likely reflecting version drift (v3.5 → v4.5 → v5.5) that hasn't been fully reconciled in their help center.
- **No source specifies accepted upload file formats** (mp3/wav/etc.) — unconfirmed gap. Output/download side is reported as MP3 and WAV (single third-party source).
- One user report (unverified — the original forum post could not be independently confirmed, sourcing chain broke on a 403 fetch error) describes phase-alignment issues and "machine gun kick drum" artifacts on some Cover-from-upload results. Single, weak data point — not a confirmed pattern.
- **No source found comparing control/precision of upload-based generation vs. pure text-prompt generation.** If you're choosing between "hum a melody and let Cover interpret it" vs. "describe the melody/hook in the Style/Lyrics fields," this KB currently has no evidence-backed guidance on which gives tighter control — flagged as an open gap, not asserted either way.

## Worked Examples

None yet — no song project in this vault has used Upload Audio / Cover-from-upload. The first project that does should log here: what was uploaded (hummed melody vs. instrument vs. full reference track), which upload-length limit the account actually hit, the Audio Influence value used, and how closely the result tracked the source.

## Gotchas / Open Items — Unverified-Claim Log

**Status: all entries below are "reported, not yet self-verified"** unless marked officially confirmed. Sourced from Suno's own help-center articles plus third-party guides during this session, not confirmed by this project uploading actual audio and inspecting the result:

- [x] "Upload Audio" exists as a named, first-class feature with record-live and upload-file paths — **officially confirmed**, 2+ help.suno.com articles.
- [x] Audio Influence slider exists specifically for uploaded-audio workflows — **officially confirmed** to exist and be named this; not corroborated by every third-party source checked (one guide covering Weirdness/Style Influence made no mention of it at all, suggesting it's less consistently documented than the other two sliders).
- [ ] Exact mechanism distinguishing "Cover from uploaded audio" vs. "Cover of an existing Suno-generated track" — inferred from the UI (Cover is offered as an option on any track, uploaded or generated) rather than spelled out as two separate pipelines anywhere. Thin/unconfirmed at the mechanism level.
- [ ] Upload length limits — **actively contradictory across Suno's own official docs** (60s/8min vs. 6-60s/120s), plus a conflicting third-party claim that upload is Pro-exclusive. Needs an in-app check, not just more research, to resolve.
- [ ] Accepted upload file formats — not found in any source.
- [ ] Phase-alignment / "machine gun kick drum" artifact reports on Cover-from-upload — single unverified data point, sourcing chain broke on a fetch error.
- [ ] Whether upload-based generation gives tighter or looser control than text-prompt generation for capturing a specific melody/hook — no source found either way; open gap.

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
