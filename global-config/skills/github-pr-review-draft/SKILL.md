---
name: github-pr-review-draft
description: Use when asked to review a GitHub PR or leave comments on one — always create the review as a PENDING (draft) review via the API, write it in terse native-GitHub-reviewer style, and never submit it until the user explicitly says to approve/submit/merge.
---

# GitHub PR review — always draft, never auto-submit

## Core rule

Every review created for the user is a **pending draft**, full stop, regardless of how positive it is or how minor the comments are. Never call `gh pr review` — it submits immediately with no pending mode and has no undo. The user approves/submits in their own time (or asks Claude to submit later); Claude never submits on its own initiative.

## How to create a pending review

Use the REST API directly, with no `event` field — omitting `event` is what keeps it `PENDING` (invisible to the PR author/other reviewers until submitted):

```bash
gh api repos/{owner}/{repo}/pulls/{pr}/reviews --input review.json
```

`review.json` shape:

```json
{
  "commit_id": "<head sha, from `gh pr view {pr} --json headRefOid -q .headRefOid`>",
  "body": "top-level review summary",
  "comments": [
    { "path": "relative/file/path.md", "line": 42, "side": "RIGHT", "body": "inline comment" }
  ]
}
```

Confirm `"state":"PENDING"` in the response. Tell the user it's pending and where (`html_url` from the response), and that it's only visible to them until submitted.

### Getting correct line numbers

Line numbers must be the actual line number **in the file**, not a line number from any combined/prefixed tool output. Fetch the raw diff and compute it directly:

```bash
gh pr diff {pr} --repo {owner}/{repo} > pr.diff
awk '/^diff --git/{ln=0} /^@@/{match($0,/\+([0-9]+)/,a); ln=a[1]-1; next} /^\+/{ln++; if ($0 ~ /pattern/) print "line "ln": "$0}' pr.diff
```

A wrong line number makes the API return `422 Unprocessable Entity: "Line could not be resolved"` — if that happens, recompute from the raw diff rather than guessing.

## Writing style — terse, native GitHub reviewer, not an essay

Real GitHub reviews are short. Match that:

- Top-level body: one or two sentences. Lead with the verdict (`LGTM overall`, `Mostly good, one blocker`, etc.), not a restated summary of what the PR does.
- Inline comments: prefix with the convention that matches intent — `nit:` (style/polish, not blocking), `Q:` (question, needs an answer), `blocking:` (must fix before approve), or no prefix for a plain observation. Keep each comment to 1–3 sentences.
- No em dashes, no "I'd like to note that...", no restating the diff back to the author. Say the actual point.
- It's fine to have zero inline comments and just a short approving body if the PR genuinely doesn't need line-level feedback — don't manufacture nitpicks to look thorough.

## Editing a still-pending review

A pending review's inline comments are **not** independently editable via `pulls/comments/{id}` (that endpoint 404s until the review is submitted — GitHub doesn't expose draft review comments there). To fix wording before submission:

```bash
gh api -X DELETE repos/{owner}/{repo}/pulls/{pr}/reviews/{review_id}
```

then recreate with the corrected `review.json`. The top-level review body itself *can* be edited in place with `PUT repos/{owner}/{repo}/pulls/{pr}/reviews/{review_id}` — but since comments usually need touching too, delete-and-recreate is simplest and keeps body/comments consistent.

## Submitting (only when told to)

When the user explicitly says to approve/submit/request-changes:

```bash
gh api -X POST repos/{owner}/{repo}/pulls/{pr}/reviews/{review_id}/events -f event=APPROVE
```

(`event` is one of `APPROVE`, `REQUEST_CHANGES`, `COMMENT`.) Do not do this proactively — including when the review reads entirely positive. "Pending until told otherwise" applies even to a clean approve.
