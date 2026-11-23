#!/usr/bin/env bash
# Remove git worktrees whose branch is already merged AND that have no uncommitted files.
# Dry run by default. Usage: prune-merged-worktrees.sh <repo-path> [--apply]
# "Merged" = branch tip is an ancestor of origin's default branch, or GitHub shows a MERGED PR for it
# (catches squash merges). Never uses --force, so dirty worktrees are always kept.
set -u
repo="${1:?repo path}"; apply="${2:-}"
git -C "$repo" fetch -q origin 2>/dev/null
base=$(git -C "$repo" symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##'); base="${base:-main}"
slug=$(git -C "$repo" remote get-url origin | sed -E 's#(git@github\.com:|https://github\.com/)##; s#\.git$##')
freed=0
git -C "$repo" worktree list --porcelain | awk '/^worktree /{p=substr($0,10)} /^branch /{b=substr($0,8)} /^detached/{b="DETACHED"} /^$/{print p"|"b; p="";b=""}' |
while IFS='|' read -r p b; do
  [ "$p" = "$repo" ] && continue
  br="${b#refs/heads/}"
  [ -n "$(git -C "$p" status --porcelain 2>/dev/null)" ] && { echo "KEEP (dirty)   $p"; continue; }
  merged=no
  if [ "$b" = DETACHED ]; then
    git -C "$repo" merge-base --is-ancestor "$(git -C "$p" rev-parse HEAD)" "origin/$base" 2>/dev/null && merged=yes
  else
    git -C "$repo" merge-base --is-ancestor "$br" "origin/$base" 2>/dev/null && merged=yes
    # squash merge: a MERGED PR counts only if its head commit is the branch's current tip
    # (a reused branch name with newer commits must not count as merged)
    tip=$(git -C "$repo" rev-parse "$br" 2>/dev/null)
    [ "$merged" = no ] && [ -n "$tip" ] && [ -n "$(gh pr list --repo "$slug" --head "$br" --state merged --json headRefOid --jq ".[] | select(.headRefOid==\"$tip\") | .headRefOid" 2>/dev/null)" ] && merged=yes
  fi
  if [ "$merged" = yes ]; then
    mb=$(du -sm "$p" 2>/dev/null | cut -f1)
    if [ "$apply" = "--apply" ]; then git -C "$repo" worktree remove "$p" && echo "REMOVED ${mb}MB  $p"; else echo "WOULD REMOVE ${mb}MB  $p"; fi
  else
    echo "KEEP (not merged) $p"
  fi
done
