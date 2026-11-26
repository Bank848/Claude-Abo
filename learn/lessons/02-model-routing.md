---
id: 02-model-routing
title: Pick the cheapest model that can do the job
order: 2
minutes: 12
uses:
  - global-config/agents/haiku-batch.md
  - global-config/agents/sonnet-worker.md
  - global-config/agents/opus.md
  - global-config/agents/fable-medium.md
  - examples/memory/route-model-by-difficulty.md
---

# Pick the cheapest model that can do the job

## Why

Most of a session's work is routine. Running all of it on the strongest model costs several times more than it needs to, with no better result. Routing means matching each task to the cheapest model that can do it well.

## How the owner does it

The setup has four subagent files in `global-config/agents/`, each pinned to one model. Prices below are per million input and output tokens, as written in those files:

| Role | File | Price | Use it for |
|---|---|---|---|
| Batch | `haiku-batch.md` | $0.10 / $0.50 | renames, formatting, extraction, summaries |
| Worker | `sonnet-worker.md` | $2 / $10 | a clearly specified task, several files |
| Senior | `opus.md` | $4 / $20 | hard debugging, architecture, a second opinion |
| Advisor | `fable-medium.md` | $8 / $40 | high-stakes design calls only |

The ratio is the point: the advisor costs about eighty times the batch model per input token. A spawn also has a fixed context cost, so a task the main loop can finish in a few turns is cheaper done in place. Every spawn is announced in one line with the agent, the task and the reason. A reviewer returns findings only; a worker applies the fixes. The habit is written up in `examples/memory/route-model-by-difficulty.md`.

Prices change. Treat the numbers as the values in those files on the day they were written, and check the current price page before relying on them.

## Try it

List your last five tasks. For each, write which tier it belonged to (batch, worker, senior or advisor) and which model you actually used. Count how many ran on a stronger model than needed.

## Check

A task needs a rename across forty files and then a design decision about the new structure. Which parts go to which tier, and why is the spawn for the rename worth its fixed cost?
