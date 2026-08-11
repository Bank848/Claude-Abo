# Mobile App vs. Web

> **Pillar:** 4 — Suno Mastery · **Last updated:** 2026-08-07
> **Suno version notes:** as of 2026-08, official iOS app (launched Jul 2024) and Android app (launched Dec 2024) — per web research this session, NOT yet self-verified hands-on

## Core Concept

Suno ships official iOS and Android apps alongside the web app, with account/credits/library synced across all three. For most casual use they're interchangeable, but the detailed prompt-crafting workflow this KB is built around (careful Style-field tag budgeting, Exclude lists, Persona management, Studio-level editing) is weighted toward the web/desktop experience — some of that tooling is confirmed desktop-only, and several other pieces are simply unresearched for mobile parity. This file exists so a workflow recommendation ("do X in Suno") can specify which surface to actually use.

## Practical Application

- **Both apps are real and full-featured for core generation**, not stripped-down companions: text-prompt generation, humming/tapped-beat/audio-recording input, lyrics generation, community feed browsing, in-app subscription purchase are all confirmed via the official App Store listing and Suno's own mobile-launch blog post.
- **Account sync is solid**: same credits, library, playlists, and subscription across mobile and web — a subscription bought in-app also works on web and vice versa. Confirmed by 2+ independent sources, no sync-bug reports surfaced in this research pass (though absence of complaints isn't proof of none).
- **Confirmed desktop/web-only**: **Suno Studio** (the Premier-tier multitrack DAW — stem generation, EQ/faders/pan/solo/mute, MIDI export; see [stems-and-remix.md](stems-and-remix.md)) is browser-based and not available on mobile — corroborated by 2 independent sources plus Suno's own stated system requirements (minimum 768px screen, desktop/tablet Chrome).
- **Confirmed desktop-only, officially, with active porting in progress**: **Crop Songs and "Edit Details"** workflows are explicitly stated by Suno's own help docs as desktop-only, with Suno stating they're "working to port these to tablet-web and mobile-web." This is the clearest, most authoritative gap found — check current status before assuming it's still true, since Suno flagged this as actively changing.
- **Unresolved/unresearched gaps** (don't assume either way):
  - Whether Persona/Voices management is full-featured on mobile — no source discusses platform restriction one way or the other (only age/region gating is documented).
  - Whether the Style/Exclude field is fully usable on mobile — the feature itself is documented, but no source discusses its mobile availability specifically.
  - Whether stem export is available on mobile at all — one comparison table marks mobile Studio editing as only "Partial" vs. web's "Full," but this isn't directly confirmed by Suno's own docs.
  - Whether Extend / Replace Section editing (see [editing-workflow.md](editing-workflow.md)) is available on mobile — not found in any source checked.

## Suno Translation

- **For detailed prompt-crafting work** (the kind this KB's Pillar 4 files assume — tag budgeting against the character limit, building an Exclude list, dialing sliders precisely), **use web/desktop**. This isn't strongly evidence-based on ergonomics specifically (no source directly tested Style-field editing on a phone keyboard), but it follows from the confirmed gaps above: Studio and Crop/Edit-Details are desktop-only, and Suno's own 768px-minimum-screen requirement for Studio signals that Suno itself treats small screens as unsuited to detailed editing.
- **For quick generation, listening, and casual iteration** (e.g. auditioning a batch of takes on the go, per [iteration-strategy.md](iteration-strategy.md)'s audition-round protocol), mobile is a reasonable surface — core generation and lyrics are fully there, and library sync means you can pick up detailed editing on desktop later without losing anything.
- **Recommended split**: draft/audit on whichever surface is convenient, but do Persona locking, Replace Section punch-ins, stem export, and final Style/Exclude tuning on web until mobile parity for those specific tools is confirmed.

## Worked Examples

None yet — no song project in this vault has documented which surface (mobile vs. web) was used for which step. The first project that does should log here: which steps were done on mobile vs. web, and whether any mobile limitation (missing feature, editing friction) was actually hit.

## Gotchas / Open Items — Unverified-Claim Log

**Status: all entries below are "reported, not yet self-verified"** unless marked officially confirmed. Sourced from Suno's own help-center articles, official blog, and third-party reviews/comparisons during this session, not confirmed by this project actually using the mobile app:

- [x] iOS and Android apps exist, launched Jul 2024 / Dec 2024, with core generation features present — **officially confirmed** (Suno's own mobile-launch blog post, App Store listing).
- [x] Account sync (credits/library/subscription) across mobile and web — confirmed by 2+ independent third-party sources, no official statement found stating it explicitly but no contradicting report either.
- [x] Suno Studio is desktop/tablet-web only, not on mobile — corroborated by 2 independent sources plus Suno's stated system requirements.
- [x] Crop Songs / Edit Details are officially desktop-only with mobile-web porting "in progress" — **officially confirmed**, single source but it's Suno's own help docs.
- [ ] 2026-era mobile additions (vocal gender control, "Memory," CarPlay/Android Auto, Notes/Voice Memos sharing) — single-source (one aggregator page), not independently confirmed against an official release-notes entry.
- [ ] Persona/Voices mobile parity — unresearched, no source either way.
- [ ] Style/Exclude field mobile availability — unresearched, no source either way.
- [ ] Stem export mobile availability — thin, one comparison table suggests "partial" but not confirmed against Suno's own docs.
- [ ] Extend / Replace Section mobile availability — unresearched, not found in any source.
- [ ] Mobile-specific bugs/gotchas (e.g. reported "Android audio upload quirks") — very thin, single weak signal; targeted Reddit searches for this didn't surface usable results in this research pass.

When a claim is tested, move it out of this checklist into the relevant section above with a confirmation note and date.
