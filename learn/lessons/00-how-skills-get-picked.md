---
id: 00-how-skills-get-picked
title: How Claude picks a skill from its description
order: 0
minutes: 10
uses:
  - catalog/skills.json
  - docs/audit-method.md
---

# How Claude picks a skill from its description

## Why

You do not call a skill by name. At the start of a session Claude sees each skill's name and one-line description, and when your request fits one of them it loads that skill. The description is the only matching surface, so a vague or very long one means the skill is missed or costs context for nothing.

## How the owner does it

A description starts with when to use the skill ("Use when drafting English-language text for the user..."), then names the situations. One observed case: asked to write a launch post, Claude loaded `english-writing-anti-ai-tell`, whose description names English text written for readers. A rule in the owner's CLAUDE.md also names that skill, so the case shows the description fits the task, not that the description alone triggers it.

Two limits matter. Claude cuts a description plus its `when_to_use` text at 1,536 characters, and the audit warns above 1,024. The audit also warns on a description under 40 characters, because a few words give Claude nothing to match.

## Try it

Pick three skills from `catalog/skills.json`. For each, write one request that should load it and one that should not. Then open the skill's description and check whether it names the situation in your first request.

## Check

A skill's description reads "Helps with writing." Which two problems will that cause, one for matching and one for you when you read the audit?
