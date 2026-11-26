---
name: git-retro
description: 'Use when the user asks for a weekly/period retrospective of their git work, e.g. "retro", "what did I ship this week", "review my last 14 days of commits", or "compare this week with last week". Solo developer, pure `git log` analysis in one repo: commit-time distribution, work sessions, commit-type split, hotspots, focus score, streaks, shortcut debt, then a short narrative.'
---

# git-retro: period retrospective from git history

Read-only analysis of one repo for one developer. Everything comes from `git log`; nothing is invented. If a number cannot be computed, say "unavailable" instead of guessing.

## Arguments

- none: last 7 days
- `24h`, `14d`, `30d`, `2w`: that window
- `compare` or `compare 14d`: current window against the prior window of the same length

Anything else: print this list and stop.

## Window

Use midnight-aligned absolute dates for `d` and `w` windows. Today comes from the session's current date, never from a guess. With today = 2026-10-09 and 7d, the start is 2026-10-02, so use `--since "2026-10-02T00:00:00"`. The `T00:00:00` matters: a bare date means the current wall-clock time. For `h` windows use `--since "N hours ago"`. In compare mode the prior window is `--since <start - N days> --until <start - 1 second>`, so no commit is counted twice.

Show all times in local time. Do not set `TZ`.

## Step 0: Pick the branch

```
git rev-parse --is-inside-work-tree
git branch --show-current
```

Analyze the current branch unless the user names another. If the repo has `origin`, run `git fetch origin --quiet` first and carry on if it fails (say "offline run" in the narrative). If there are zero commits in the window, say so, suggest a wider window, and stop.

Below, `S` is the since value, `B` is the branch or ref. Commands are given for Git Bash first, PowerShell second where they differ.

## Step 1: Gather the raw data

Run these once and reuse the output. Use `--no-merges` for commit statistics, and count merges separately.

```
# commits with timestamps and subjects (hash | unix time | local date-time | subject)
git log B --since "S" --no-merges --format="%h|%at|%ad|%s" --date=format:"%Y-%m-%d %H:%M"

# per-commit line counts
git log B --since "S" --no-merges --numstat --format="@%h" 

# merge count
git rev-list B --since "S" --merges --count

# commits per author (sanity check for solo repos)
git shortlog B --since "S" -sn --no-merges
```

From the `--numstat` output (added, deleted, path per line; binary files show `-`, skip them):

- Insertions, deletions, net = sum of columns 1 and 2.
- Per-commit size = added + deleted for that commit. Buckets: small under 100, medium 100 to 500, large 500 to 1500, xl 1500 and up.
- Test LOC = added lines in paths matching `test`, `tests`, `spec`, or names containing `.test.` or `.spec.`. Test ratio = test LOC / insertions. Skip the ratio when there are no test files in the repo (many Ren'Py projects have none) and say so.
- Skip generated files in sums: lockfiles, `*.rpyc`, `*.min.js`, `graphify-out/`, `node_modules/`, big binary assets. Name what you excluded.

If the repo is a notes vault, most files are `.md`. Report them as docs volume, not code volume.

## Step 2: Summary table

| Metric | Value |
|---|---|
| Commits (non-merge) | N |
| Merge commits | N |
| Insertions / deletions / net | +N / -N / N |
| Test LOC ratio | N% or n/a |
| Active days | distinct local dates with a commit |
| Sessions, active time | from Step 4 |
| Fix ratio | from Step 5 |

Lead with what shipped (feature-type commit subjects, grouped), then the numbers. Raw line counts are context, not impact.

## Step 3: Commit time distribution

Hourly histogram in local time.

Git Bash:
```
git log B --since "S" --no-merges --format="%ad" --date=format:"%H" | sort | uniq -c
```
PowerShell:
```
git log B --since "S" --no-merges --format="%ad" --date=format:"%H" | Group-Object | Sort-Object Name | ForEach-Object { "{0}:00  {1,3}  {2}" -f $_.Name, $_.Count, ("#" * $_.Count) }
```

Render as bars. Call out: peak hours, dead zones, whether the pattern is morning/evening or continuous, and late-night clusters (after 22:00). For a student, also note commits on class-heavy weekdays versus weekends if the pattern is clear.

## Step 4: Work session detection

Sort commit timestamps (`%at`) ascending. A new session starts when the gap to the previous commit is more than 45 minutes. A session's length is last commit minus first commit; a single-commit session is a micro session.

- deep: 50 minutes or more
- medium: 20 to 50 minutes
- micro: under 20 minutes

Save this as `sessions.py` in a temp folder (not in the repo) and pipe the timestamps into it. It works the same in Git Bash and PowerShell:

```
import sys
t = sorted(int(x) for x in sys.stdin.read().split())
s = []
for x in t:
    if s and x - s[-1][-1] <= 2700:
        s[-1].append(x)
    else:
        s.append([x])
L = [(c[-1] - c[0]) / 60 for c in s]
print("sessions", len(s), "deep", sum(l >= 50 for l in L),
      "medium", sum(20 <= l < 50 for l in L), "micro", sum(l < 20 for l in L),
      "minutes", round(sum(L)), "avg", round(sum(L) / max(len(L), 1)))
```

```
git log B --since "S" --no-merges --format=%at | python -I sessions.py
```

If Python is unavailable, do the gap walk by hand on the timestamp list. Report session count, the deep/medium/micro split, total active minutes, and average length. Commit gaps understate real work time (a long edit before the first commit is invisible), so say "at least" for active time.

## Step 5: Commit type breakdown

Take the subjects from Step 1. Classify by conventional-commit prefix: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `perf`, `ci`, plus `other` for the rest. Show counts, percentages, and a bar:

```
feat:     20  (40%)  ####################
fix:      27  (54%)  ###########################
```

Flag a fix ratio above 50% as a ship-fast-fix-fast pattern. Also look for fix chains: three or more fix commits in a row on the same area. Name the area.

If most subjects have no prefix, classify by verb (add, fix, update, remove) and say the split is approximate.

## Step 6: Hotspots

Git Bash:
```
git log B --since "S" --no-merges --name-only --format= | grep . | sort | uniq -c | sort -rn | head -10
```
PowerShell:
```
git log B --since "S" --no-merges --name-only --format= | Where-Object { $_ } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 Count, Name
```

Flag files changed 5 or more times (churn). Say whether the hotspots are code, tests, docs, or config. A script or `.rpy` file edited 8 times in a week usually means an unsettled design; say that.

## Step 7: Focus score and ship of the week

Focus score: from the same file list as Step 6, take the top-level directory of every changed file (root files count as `.`). Score = changes in the busiest directory / total changes. Report "Focus score: 62% (scripts/)". High means deep work on one area; low means scattered context switching, which is normal if the repo is a vault.

Ship of the week: the non-merge commit with the largest added + deleted. State its hash, subject, size, and why it matters, inferred from the subject and the files it touched. Do not pick a commit that is only a generated file or asset import unless nothing else is there.

## Step 8: Streaks

Streak = consecutive local dates with at least one commit, counted back from the newest commit date over full history:

```
git log B --no-merges --format="%ad" --date=format:"%Y-%m-%d" | sort -u
```
(PowerShell: pipe to `Sort-Object -Unique`, then reverse.)

Walk back from the newest date while each previous date is exactly one day earlier. If the newest commit is today or yesterday, the streak is live; otherwise it is broken: report 0 and name the last shipping day. Also report the longest gap inside the window.

## Step 9: Shortcut debt ledger

This collects deliberate shortcuts, the `# ponytail: <reason>` markers left when a simpler option was taken on purpose. Zero hits is the healthy case.

```
git grep -n "ponytail:" -- . ":(exclude)*.md" ":(exclude)graphify-out"
```

If the user's repo uses another marker (`SHORTCUT:`, `HACK:`), search for that too. Ignore hits that only document the convention. For each real hit write one row:

`file:line, what was simplified. ceiling: <limit where it stops working>. upgrade: <trigger to replace it>.`

Tag a marker `no-trigger` if it names no condition for replacing it; those are the ones that rot. End with `N markers, M with no trigger.` If none: `No shortcut debt. Clean ledger.` Also note markers added in this window: `git log B --since "S" -G"ponytail:" --format="%h %s"`.

## Step 10: Compare mode

If `compare` was requested, run Steps 1 to 7 a second time for the prior window and show a table for commits, net lines, test ratio, sessions, and fix ratio, with absolute change and percent change (ratios in percentage points). If a prior value is zero, show N/A for percent. Streaks and the shortcut ledger are current-only. Name the biggest improvement and biggest regression in the narrative.

Without `compare`, add a "vs last retro" line only if a previous retro entry exists in `docs/log/` (see Step 12) and uses the same window.

## Step 11: Narrative

Open with one summary line:

`Week of Oct 2: 47 commits, +3.2k/-0.8k, 38% tests, 14 sessions, peak 22:00 | streak 12d`

Then these sections, cutting any that has nothing to say:

1. **Summary table** (Step 2)
2. **Time and session patterns** (Steps 3, 4): when the work happens, whether sessions are getting longer, sustainable pace.
3. **Shipping velocity** (Steps 5, 7): commit mix, size buckets, fix chains, ship of the week.
4. **Code quality signals** (Step 6 and test ratio): churn, tests versus production.
5. **Streaks and shortcut debt** (Steps 8, 9)
6. **What went well**: 2 or 3 items, each tied to a named commit.
7. **Where to level up**: 1 or 2 items, each tied to data, framed as an investment ("worth time because ...").
8. **3 habits for next week**: each adoptable in under 5 minutes.

Tone: candid and specific. No generic praise. Every claim cites a commit hash, a file, or a number. Skip team sections: this is a solo retro. If `git shortlog` shows several authors, mention it in one line and analyze only the user's own commits (filter with `--author`).

## Step 12: Save

Do not create new history stores. If the repo has a `docs/log/` folder, append a short entry (the summary line, the table, and the 3 habits) to today's file `docs/log/YYYY-MM-DD.md` under a heading `## Retro (window)`. If that file does not exist, create it only if other dated files already exist there. If there is no `docs/log/`, print the retro and write nothing.

## Rules

- Read-only on the repo apart from the optional log append. No commits, no pushes.
- Never invent a value. Missing input means "unavailable".
- Exclude generated and vendored paths from line counts and say which.
- Only the user's commits count unless told otherwise.
- Round per-hour rates to the nearest 50.

---

Derived from garrytan/gstack (MIT, Copyright (c) 2026 Garry Tan), commit 9a1dc81, adapted standalone.
