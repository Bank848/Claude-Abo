---
name: web-motion
description: Add restrained, accessible motion to web pages (entrance, stagger, scroll reveal, press/hover feedback, state transitions) using fixed duration and easing tokens, a per-view restraint budget and a pure-CSS prefers-reduced-motion gate. Use when the user says "add motion", "entrance animation", "stagger cards", "page feels static", "make it feel alive", or when a page needs subtle depth through movement. Not for video clips (huashu-art-motion, manimgx), not for scroll-driven hero pages (scroll-craft), not for WebGL.
---

# web-motion

Own distilled skill (2026-10-12). Token values and the restraint budget come from MOTION-SPEC.md of nexu-io/motion-anything (Apache-2.0), which follows Material motion, Apple HIG and Emil Kowalski's principles. The motion-anything app and recipes are NOT used (see `D:/brain/notes/motion-anything-and-gbro-collage-reference-2026-10-12.md`). Pair with ui-ux-pro-max and frontend-design-anti-ai-tell for the visual side.

## Rules
1. Every motion does one job: feedback, continuity, or directing attention. Otherwise cut it. If the user would notice it consciously, it is too slow, too big or too frequent.
2. Animate `transform` and `opacity` only. Never width, height, top, left, margin.
3. Use these durations and no others: instant 80-120 ms (press/hover), fast 140-220 (toggles, small reveals), base 220-320 (card entrance), slow 320-500 (section reveal, page change), deliberate 500-800 (one hero moment). Bigger element or distance means longer, but stay in the band.
4. Easing: default `cubic-bezier(0.16, 1, 0.3, 1)` for things entering or responding; `cubic-bezier(0.4, 0, 1, 1)` for things leaving; `cubic-bezier(0.65, 0, 0.35, 1)` for moves that start and end on screen. Linear only for spinners.
5. Restraint budget per viewport: at most 1 attention or delight moment; at most 3 entrances at once, stagger the rest by 40-80 ms and finish the whole sequence within 500 ms; at most one looping animation (none on LiNK); never auto-play celebration on load, trigger it from a user action.
6. Reduced motion is a gate, not an override: put every animation inside `@media (prefers-reduced-motion: no-preference)` so that with reduce (or no CSS support) the content is fully visible and static at t=0. Never start content at opacity 0 outside that gate. Do not leave `will-change` set permanently.
7. Unclear intent: pick the more restrained reading and ask one question.

## CSS-only pattern (no JS, no network)
```css
@media (prefers-reduced-motion: no-preference) {
  .rise { animation: rise 280ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  .rise:nth-child(2) { animation-delay: 60ms; }
  .rise:nth-child(3) { animation-delay: 120ms; }
}
@keyframes rise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
```
Scroll reveal: prefer `animation-timeline: view()` inside an `@supports (animation-timeline: view())` plus the no-preference gate, so unsupported browsers just show the content. Press feedback: `transition: transform 100ms` on `:active` only when the project's policy allows it.

## LiNK overlay (D:/Takeemall Link Server)
Policy there: transform and opacity only, no loops, no hover motion, nothing over forms, money or danger zones, no inline JS (external deferred files only), no network, LCP must not regress more than 100 ms, 375 px must work. Under this policy use entrance, stagger and section reveal only; skip hover and press motion. Check the repo's current motion ADRs and `static/motion.css` before adding anything; reuse its classes rather than adding new ones.

## Before delivering
Run the page at 1280 and 375 px, once with reduced motion emulated (everything visible, zero running animations), and look at the screenshots. Count what moves in the first viewport against the budget. Check the mid-entrance frame, not only the final one.

## Do not
Copy Animate.css recipes (Hippocratic-2.1 licence, avoid on the 18+ store), react-bits ports (no licence file), or run `motion serve` from motion-anything (local API without Origin check). Library recipes under Apache or MIT (web/, animxyz/) can be read for ideas, rewritten as CSS-only with the gate above.
