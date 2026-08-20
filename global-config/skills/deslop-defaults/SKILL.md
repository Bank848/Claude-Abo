---
name: deslop-defaults
description: Stack-agnostic "deslop" default rules that stop AI-generated UI from looking averaged-out and unfinished. Use when reviewing or generating UI and you want sane structural defaults for z-index, accent restraint, primitive consistency, and standard interaction patterns (destructive/loading/error states). Companion to make-interfaces-feel-better — that skill covers optical craft (radius, alignment, motion), this one covers structural restraint.
origin: harvested from ibelick/ui-skills (baseline-ui), rewritten stack-agnostic
---

# Deslop Defaults

The small set of structural defaults that separate "a dev wired it up" from
"someone with taste shipped it." Apply alongside
[[make-interfaces-feel-better]] — that skill handles optical craft (concentric
radius, optical alignment, image outlines, hit areas, split enter/exit motion);
this one handles structural restraint and standard interaction patterns.

**For a full greenfield page/component build or an audit of existing UI**, reach for
`hallmark` instead — it's a much deeper anti-slop system (57 numbered slop-test gates,
macrostructure diversity, mobile-responsiveness hard floor, `audit`/`redesign`/`study`
verbs) added 2026-08-09. Keep this skill for quick structural checks on an existing
surface or when you just need the short checklist, not the full system.

These rules are intentionally stack-agnostic. They describe *intent*; map them
to whatever the project uses (Tailwind tokens, CSS variables, design-system
constants, game-engine styles, native theme values).

## When to Use

- Generating or reviewing any UI surface (page, dashboard, modal, form, card).
- The interface "works" but feels generic, busy, or slightly off.
- A component needs loading, error, or confirm-destructive states and you want
  the conventional, low-surprise pattern instead of an ad-hoc one.

## Rules

### 1. Fixed z-index scale — never arbitrary values

Pick a small named scale once and reuse it. No `z-index: 9999`, no incremental
`z-50 / z-51 / z-52` whack-a-mole. A typical ladder:

```
base 0  ·  dropdown 10  ·  sticky 20  ·  overlay/backdrop 30
modal 40  ·  popover 50  ·  toast 60  ·  tooltip 70
```

Store as tokens/constants so stacking is decided by role, not by guessing a
bigger number than the thing it must sit above. If two things fight, the fix is
assigning the right tier, not bumping a number.

### 2. One accent color per view

A single view gets **one** accent doing the "look here" work (primary action,
active state, key metric). Everything else is neutral/structural. Multiple
competing accents is the #1 tell of averaged-out AI UI — hierarchy collapses
when everything shouts. Brand secondary colors are for decoration, not for
fighting the primary CTA.

### 3. Don't mix primitive systems on one surface

Within a single surface, commit to one component/primitive system (e.g. Radix
*or* React Aria *or* Base UI — not two). Mixing brings inconsistent focus
management, keyboard semantics, and portal/z-index behavior that look fine
statically and break on interaction. Anything with keyboard or focus behavior
(menu, dialog, combobox, tabs) should come from one accessible primitive
source, not be hand-rolled next to a primitive one.

### 4. Standard interaction patterns (don't reinvent)

| Situation | Default pattern |
| --- | --- |
| Destructive / irreversible action | Confirm dialog (AlertDialog-style), not a bare button. Name the consequence in the confirm label ("Delete 3 files"), not "OK". |
| Loading | Structural skeleton that matches the final layout's shape — not a centered spinner that causes a layout jump when content arrives. |
| Error | Show it **adjacent to the action/field that caused it**, not only in a global toast. Toasts are for transient success/info, not for errors the user must fix in place. |
| Empty state | A short line of guidance + the primary next action, never a blank region. |

### 5. Visual restraint by default

- **No gradients unless explicitly requested.** Flat first; gradient is a
  deliberate choice, not a default.
- **Use the system/framework default shadows**, not hand-tuned multi-layer
  shadows everywhere. Reach for custom depth only where elevation carries
  meaning (the layered-shadow guidance in [[make-interfaces-feel-better]]).
- **Square elements use one dimension token**, not separate width/height that
  can drift out of sync.

## Checklist

- [ ] z-index comes from a named scale; no arbitrary/9999 values.
- [ ] Exactly one accent does the "look here" work in this view.
- [ ] One primitive system per surface; interactive controls come from it.
- [ ] Destructive actions are behind a confirm dialog with a consequence-named label.
- [ ] Loading uses a layout-matching skeleton, not a jump-causing spinner.
- [ ] Errors render next to their trigger; toasts reserved for transient info.
- [ ] No empty blank states — guidance + next action present.
- [ ] No unrequested gradients; default shadows unless elevation is meaningful.
