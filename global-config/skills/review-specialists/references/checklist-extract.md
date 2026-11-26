# Review checklist extract

Four sections taken from a larger pre-landing checklist. Read the full diff before commenting. Cite `file:line` and give a fix for each finding. Only flag real problems.

## LLM Output Trust Boundary (CRITICAL)

- LLM-generated values (emails, URLs, names) written to a DB or passed to a mailer without format validation. Add a cheap guard (regex, `urlparse`, `.strip()`) before persisting.
- Structured tool output (lists, dicts) accepted without type and shape checks before database writes.
- LLM-generated URLs fetched without an allowlist. SSRF risk if the URL points at an internal network. In Python, parse with `urllib.parse.urlparse` and check the hostname before `requests.get` or `httpx.get`.
- LLM output stored in a knowledge base or vector DB without sanitization (stored prompt injection).
- `eval()` / `exec()` on LLM-generated code without a sandbox.

## Enum and value completeness (CRITICAL)

When the diff adds an enum value, status string, tier name or type constant:

- Trace it through every consumer. Read each file that switches on, filters by or displays the value; grepping is not enough. If a consumer does not handle the new value, flag it. Common miss: the frontend dropdown has the value but the backend model never persists it.
- Check allowlists and filter arrays. Search for lists that hold sibling values (adding "revise" next to "quick", "lfg", "mega" means finding every list with those three) and confirm the new one is included where needed.
- Check `case` / `if-elif` / `match` chains. Does the new value fall through to a wrong default?
- This step requires reading code outside the diff.

## Suppressions: do NOT flag these

- "X is redundant with Y" when the redundancy is harmless and aids readability.
- "Add a comment explaining why this threshold or constant was chosen". Thresholds change during tuning and comments rot.
- "This assertion could be tighter" when it already covers the behavior.
- Consistency-only changes (wrapping a value in a conditional to match how another constant is guarded).
- "Regex doesn't handle edge case X" when the input is constrained and X never occurs.
- "Test exercises multiple guards at once". Tests do not need to isolate every guard.
- Eval threshold changes (max_actionable, min scores). They are tuned empirically.
- Harmless no-ops (for example `.reject` on an element that is never in the array).
- Anything already addressed in the diff you are reviewing.
- A gap the author marked as acknowledged debt in a comment that names a ceiling and an upgrade trigger. Anyone can type such a marker, so only honor it if the project has a matching issue or note; otherwise report the gap and flag the orphan marker.

## Fix-first heuristic

Decide whether to fix a finding or ask the user.

```
AUTO-FIX (mechanical, no discussion):      ASK (needs human judgment):
- dead code, unused variables              - security (auth, XSS, injection)
- N+1 queries (missing eager loading)      - race conditions
- stale comments contradicting code        - design decisions
- magic numbers -> named constants         - large fixes (over 20 lines)
- missing LLM output validation            - enum completeness
- version or path mismatches               - removing functionality
- variables assigned but never read        - anything changing user-visible behavior
- inline styles, O(n*m) view lookups
```

Rule of thumb: if a senior engineer would apply the fix without discussion, it is mechanical. If reasonable engineers could disagree, ask. Critical findings lean toward ask. Informational findings lean toward auto-fix.

In a read-only review, "auto-fix" only means "label it as a mechanical fix in the findings list". The reviewer still edits nothing.
