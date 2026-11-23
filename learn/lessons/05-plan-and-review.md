---
id: 05-plan-and-review
title: Plan, review, then build
order: 5
minutes: 15
uses:
  - global-config/skills/plan-pro/SKILL.md
  - examples/memory/check-before-reporting-a-blocker.md
---

# Plan, review, then build

## Why

A plan written before the code is cheap to change. The same mistake found after the code exists costs a rewrite. A second reader finds gaps the author cannot see, so the plan gets a review before anyone builds from it.

## How the owner does it

The `plan-pro` skill, in `global-config/skills/plan-pro/SKILL.md`, writes an implementation plan and then runs a review loop on it. Subagents look for gaps and critical issues, the plan is fixed, and it ends with a split of tasks that can run in parallel from those that cannot. The top of the plan is written for a human reader, so a person can approve it without reading every task.

Two rules keep this honest. A reviewer returns findings only and never edits the plan; a separate worker applies the fixes. And before reporting that something is blocked, check it first, as in `examples/memory/check-before-reporting-a-blocker.md`.

## Try it

Pick a small change in your own repo, such as adding one command-line flag. Ask Claude Code to write a plan for it with `plan-pro`, or by hand if you do not have the skill. Read the plan before any code is written and write down one thing it missed. Only then ask for the change.

## Check

What is the difference between a reviewer that returns findings and one that edits the plan directly, and why keep them apart?
