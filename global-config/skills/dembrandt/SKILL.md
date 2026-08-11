---
name: dembrandt
description: Extract a specific live website's design system as structured tokens (colors, typography, spacing, borders, shadows, components) by reading its DOM/CSS via the dembrandt CLI (npx dembrandt <url>). Use when the user names a concrete existing site to study, audit, migrate from, or benchmark against — "what design tokens does site X use", competitor design-system analysis, old-site audits before redesign. NOT for general design inspiration or mockup references (use mobbin-references / lazyweb-design-research for those), and NOT for cloning sites pixel-exact.
license: MIT
---

# Dembrandt

Extracts a named website's actual design tokens (colors, type, spacing, components) from its live DOM/CSS. Source: https://github.com/dembrandt/dembrandt/, https://dembrandt.com/

## When to Use

- User names a concrete, existing site and wants its design tokens, palette, spacing scale, or component inventory
- Competitor design-system analysis or benchmarking
- Auditing / preparing to migrate off an old site's design before a redesign
- Feeding real tokens into `design-system` for a rebuild

## When NOT to Use

- General design inspiration / "show me examples of X pattern" across many apps → `mobbin-references`, `lazyweb-design-research`, `lazyweb-quick-references`
- Pixel-exact cloning of another site's UI — that's out of scope for this tool and for what it should be used for
- Sites that are Canvas/WebGL-heavy, behind a login wall, protected by anti-bot, or render everything client-side after complex JS — expect incomplete or failed extraction (see Known Failure Modes)

**Boundary vs mobbin/lazyweb:** Dembrandt extracts structured tokens from *one specific named URL's* DOM/CSS. Mobbin/lazyweb gather *visual/layout inspiration* across many apps. They chain: lazyweb finds candidate sites → dembrandt extracts their tokens → `design-system` consumes the tokens.

## How to Run

No install needed — invoke via npx (Node 18+ required):

```bash
npx dembrandt <url>
```

Verified via `npx dembrandt --help` (2026-08-08). Full usage:

```
dembrandt [options] <url> [paths...]
```

`paths` = extra same-domain paths to extract and merge, e.g. `/pricing /docs`.

Useful flags:
- `--save-output` — save JSON to `output/<domain>/` folder
- `--json-only` — print raw JSON instead of the default human summary
- `--dtcg` — export in W3C Design Tokens (DTCG) format
- `--design-md` — export a DESIGN.md file (best for feeding into an agent workflow)
- `--brand-guide` — export a brand guide PDF
- `--html [path]` — self-contained HTML report
- `--screenshot <path>` — viewport screenshot (not full-page)
- `--raw-colors` — include pre-filter raw colors in JSON
- `--dark-mode` — extract dark-mode colors
- `--mobile` — extract from mobile viewport
- `--slow` — 3x longer timeouts, for slow-loading/JS-heavy sites
- `--crawl [n]` — auto-discover + extract up to N pages via DOM links (default 5)
- `--sitemap` — discover pages from sitemap.xml instead of DOM links (combine with `--crawl` to cap page count)
- `--browser <chromium|firefox>` — set `BROWSER_CDP_ENDPOINT` env var to attach to an existing Chromium via CDP instead
- `--wcag` — WCAG contrast analysis between palette colors
- `--compare <baseline>` — drift-compare against a local JSON file or a Dembrandt App baseline id; **exits 1 on drift** (useful in CI/audits)
- `--approve` — with `--compare <file>`: accept current extraction as the new baseline (overwrites the file) instead of failing
- `--cookie` / `--header` / `--user-agent` / `--locale` / `--timezone` / `--accept-language` / `--screen-size` — auth + fingerprint controls for pages that need them
- `--stealth` — anti-detection (navigator spoofing, human mouse sim, randomized fingerprint) — **use only when authorized** to scrape the target
- `--no-sandbox` — disable browser sandbox (Docker/CI only)
- `--ai` — experimental ML brand-primary-color prediction
- `--key <string>` — Dembrandt API key to sync extraction to your account (or set `DEMBRANDT_KEY` env var)

Recommended default: `npx dembrandt <url> --design-md --save-output`, run from the project directory or the scratchpad, then read the generated files.

## Relationship to `hallmark`

`hallmark study <URL>` also extracts design DNA from a live site, but it's a fundamentally lighter-weight tool: URL mode reads HTML/CSS via WebFetch (not a real browser), can name exact fonts/colors but explicitly "can't judge rhythm," and falls back to asking for a screenshot on JS-only SPAs or auth-walled pages — with none of dembrandt's escape hatches (`--slow`, `--stealth`, `--browser firefox`, `--cookie`/`--header` for authenticated pages) for actually getting past those cases.

They chain rather than compete: run `npx dembrandt <url> --design-md --save-output` for the rigorous extraction (especially on hard sites, or when you need DTCG/WCAG/`--compare` drift-checking/multi-page `--crawl`), then hand the resulting `DESIGN.md` to hallmark's default/`redesign` build flow — hallmark already looks for an existing `design.md`/`tokens.css` before improvising its own tokens. Use hallmark's own `study` verb instead when you just want a fast single-shot "what's this site's vibe" read and are about to build with hallmark anyway — not worth reaching for a separate CLI for that.

## Known Failure Modes

Extraction is DOM/CSS-based, not visual — it can't see what the browser renders if the site doesn't expose it as markup/styles:
- Canvas/WebGL-heavy sites → likely empty or partial results
- Login-walled pages → can't extract past the wall
- Anti-bot protection → request may be blocked entirely
- Heavy client-side rendering / hydration → try `--slow` first; if still incomplete, fall back to manual inspection with browser devtools

Always tell the user up front that coverage isn't guaranteed to be 100%, and treat output as a strong starting point, not ground truth.

If a site fails here specifically due to Canvas/WebGL rendering or anti-bot protection, `D4Vinci/Scrapling` (adaptive scraping framework with stealth fetchers) is a plausible fallback reference — not installed as a skill, just worth knowing about for that failure mode.
