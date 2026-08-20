---
name: all-skills
description: รวมศูนย์ skill ทั้งหมดที่ลงไว้ — แต่ละตัวคืออะไร ใช้ยังไง ใช้ตอนไหน เพิ่ม/ลบเมื่อมีการลงสกิลใหม่
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4adc6dba-7324-4362-a2a5-404665f85eed
---

# All Skills Index

**Last updated:** 2026-08-09
**Locations:**
- Project skills (built-in): system
- Global user skills: `~/.claude/skills/<name>/SKILL.md`
- Plugin skills: `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/skills/`
- External cloned repos: `~/.claude/external-skills/`

**วิธีหยิบใช้:** Claude auto-trigger ตาม description ของแต่ละสกิลอยู่แล้ว แต่เรียกชื่อตรง ๆ ได้ด้วย เช่น `/scrutinize` หรือบอก "ใช้ debug-mantra"

> **โครงไฟล์นี้:** บนสุด = ⭐ Daily drivers (ของที่หยิบจริงทุกวัน อ่านแค่นี้พอ) · ล่าง = 📚 Library ทั้งหมดแบ่งตามหมวด (200+ ตัว เปิดเฉพาะตอนต้องใช้) · ปิดท้าย = cheatsheet "ตอนไหนใช้อะไร"

---

## ⭐ Daily drivers — ของที่หยิบจริง จัดตามงานที่ทำ

> 10-13 ตัวนี้คือที่ใช้ซ้ำๆ ตามงานจริง (UI / วางแผน / รีวิว / ship). ถ้าจำไม่ได้ว่ามีอะไร — อ่านแค่บล็อกนี้

| งานที่ทำบ่อย | หยิบตัวนี้ |
|---|---|
| 🔄 **แปลงไฟล์ → Markdown / feed RAG** | `markitdown` |
| 🧠 **วางแผน feature** | `superpowers:brainstorming` → `/plan-pro` (ข้าม spec.md แยกถ้างานเล็ก-กลาง) · อยากให้ AI ซักแผนสดก่อนลงมือ → `/grilling` |
| 🔍 **รีวิว/ตรวจงาน มุมคนนอก** | `/scrutinize` (plan/PR/diff) |
| 🐞 **ดีบั๊ก** | `/debug-mantra` (ท่อง 4 ขั้น) + `superpowers:systematic-debugging` |
| 🎨 **ออกแบบ/ปรับ UI** | `ui-ux-pro-max` → `ui-styling` · build เต็มหน้า/audit anti-slop: `hallmark` · polish เล็ก: `make-interfaces-feel-better` + `deslop-defaults` |
| ✅ **ก่อนเคลมว่าเสร็จ** | `superpowers:verification-before-completion` |
| 🛠️ **สร้าง/แก้ skill** | `superpowers:writing-skills` หรือ `anthropic-skills:skill-creator` |
| 🔬 **verify claim ของ review ก่อนแก้** | workflow `adversarial-verify` (`~/.claude/workflows/` — **not included in this template**, write your own or skip) — CONFIRMED ต้องมี quote file:line · feed เข้า receiving-code-review |
| 🕸️ **input → knowledge graph** | `/graphify` |
| 📚 **ติว/เรียนเรื่องใหม่ (stateful หลาย session)** | `/teach` |
| ⚙️ **แก้ settings/hook/permission** | `update-config` |
| 🪤 **กันพลาดตอนออกแบบ** | `/poka-yoke` |
| 🚀 **commit→push→PR→review→merge ครบ flow** | `shipping-a-branch` (`/ship`) — ทุก action เสี่ยง (push/PR/merge/delete branch) confirm แยกทีละครั้ง ไม่เหมาสั่งครั้งเดียวยาว |

**Cost routing (ทุกงาน):** main = Sonnet 5 orchestrator · งานกลไก→`haiku-batch` · อ่านไฟล์เยอะ→`Explore` · ยากจริง→spawn `opus` · เดิมพันสูงสุดที่ Opus ยังส่าย→spawn `fable-medium`. (กติกาเต็มใน `~/.claude/CLAUDE.md`)

---

## 📚 Library — ทั้งหมดตามหมวด (เปิดเฉพาะตอนต้องใช้)

## Built-in (Claude Code core)

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `update-config` | แก้ `settings.json` (hooks, permissions, env) — ตั้ง hook อัตโนมัติ / เพิ่ม allowlist |
| `keybindings-help` | แก้ keyboard shortcut, rebind keys, chord bindings |
| `verify` | รันแอปจริงเพื่อเช็คว่าแก้ใช้งานได้ — verify PR / fix |
| `code-review` | review diff หา bug (low/medium/high effort) — ก่อน push/PR |
| `fewer-permission-prompts` | สแกน transcript เพิ่ม allowlist — ลด prompt ถาม permission |
| `loop` | รัน prompt ซ้ำตาม interval — poll status, recurring task |
| `schedule` | สร้าง cron-based remote agent — scheduled task |
| `claude-api` | งาน Anthropic SDK + prompt caching + migration |
| `run` | launch แอปโปรเจกต์เพื่อดูผล — ขอ screenshot/run app |
| `review` | review GitHub PR |
| `security-review` | security audit — ก่อน merge ของ security-sensitive |
| `init` | init project — setup ใหม่ |

---

## Custom global skills

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `graphify` | any input → knowledge graph + HTML/JSON + audit report — `/graphify`. Engine = pip `graphifyy` (source: [safishamsi/graphify](https://github.com/safishamsi/graphify) — confirmed via `pip show graphifyy` Home-page, 2026-08-08; unrelated to `Graphify-Labs/graphify` seen on trendshift.io, different repo) |
| `poka-yoke` | กันพลาดตั้งแต่ออกแบบ (mistake-proofing): ทำให้ bad state เกิดไม่ได้/เห็นชัด แทนจับผิดทีหลัง. ชั้น1 prevent > ชั้น2 detect + checklist กันมือบอน/กันโกง/dev-guardrail. ใช้ตอนออกแบบ-รีวิว feature/มินิเกม/UI/anticheat/build หรือจะเขียน "อย่าลืม X" — `/poka-yoke` |
| `plan-pro` | ต่อยอด `superpowers:writing-plans`: (1) spawn 1-2 reviewer agent หา gap+critical แล้ว fix+รายงาน (2) plan เป็น **HTML** section บน = side-by-side before/after diagram (Mermaid) สำหรับคนอ่าน, ล่าง = plan ปกติ (3) parallelization analysis → parallel execute + ปิดท้าย `/code-review`+`/simplify` ขนาน — `/plan-pro` |
| `markitdown` | แปลงไฟล์ (PDF/PPTX/DOCX/XLSX/image/audio/HTML/CSV/JSON/EPUB/ZIP/YouTube) → Markdown ด้วย Microsoft MarkItDown. ใช้ตอนต้องการ convert doc เป็น .md, prep ไฟล์ feed RAG/LLM, batch แปลงทั้งโฟลเดอร์, transcribe audio. CLI `markitdown` (ลงแล้วใน Python313). ใช้คู่กับ Claude อ่าน PDF ตรงๆ: งาน semantic/รูปเยอะ → Claude, งาน convert/batch/index → MarkItDown |
| `deslop-defaults` | กฎ "deslop" แบบ stack-agnostic กัน AI UI ดูเฉลี่ย/ไม่เสร็จ: z-index scale, accent เดียวต่อ view, ไม่ปน primitive system, pattern มาตรฐาน destructive/loading/error/empty, visual restraint. **companion ของ `make-interfaces-feel-better`** (อันนั้น = optical craft, อันนี้ = structural restraint). harvested จาก ibelick/ui-skills baseline-ui. ใช้ตอน quick check/แก้เล็ก — งาน build เต็มหน้า/audit ใช้ `hallmark` แทน (ดูล่าง) |
| `hallmark` | **Anti-AI-slop design system เต็มรูปแบบ** (Together AI, source: [Nutlope/hallmark](https://github.com/Nutlope/hallmark), ลง 2026-08-09 จาก trendshift.io candidate evaluation — ดู `projects/claude-skills-trendshift-2026-08/CANDIDATE-EVALUATION.md`). 57 numbered slop-test gates + macrostructure diversity engine (21 themes, กันซ้ำ theme ข้าม session ผ่าน `.hallmark/log.json`) + mobile-responsiveness hard floor (320/375/414/768px) + 4 verb: default(build)/`audit`(read-only score, ไม่แก้โค้ด)/`redesign`/`study`(ดึง DNA จาก screenshot/URL). จับได้มากกว่า `deslop-defaults`: fake metrics/testimonial, re-drawn fake browser chrome, italic header (AI tell), token discipline, 8-state component checklist. **ใช้เป็นตัวหลักตอน build หน้าใหม่เต็มหน้า/audit UI ที่มีอยู่** — `deslop-defaults` เก็บไว้เป็น quick-check เบา ๆ คนละ scope กัน ไม่ทับซ้ำ. เทียบแล้วไม่ลง `Leonxlnx/taste-skill` (74k★ เหมือนชื่อจะแข่ง แต่เนื้อจริงเป็น style generator เฉพาะทาง 2 ตัว — brutalist theme + brand-kit image — ไม่ใช่ deslop checklist) |
| `grilling` | **ซักแผนแบบ relentless ก่อนลงมือ** (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills) — เพิ่ง track ใน `sources.json` 2026-08-08, ก่อนหน้านี้ไม่มี baseline). ยิงคำถามทีละข้อ เดินไล่ทุกกิ่งของ design-tree แก้ dependency ทีละจุด แต่ละข้อแนะคำตอบให้ด้วย — ถ้าตอบได้จาก codebase มันไปอ่านเองแทนถาม. **auto-trigger** ได้ (พูด "grill"/stress-test) หรือ `/grilling`. **สำหรับงานเกม/แปล/งานทั่วไป → ใช้ตัวนี้ (engine เปล่า)** ไม่เขียนไฟล์อะไรลง repo. เติมช่อง "ให้ AI ซักเราสดๆ" ที่ brainstorm/plan-pro/scrutinize ไม่มี |
| `teach` | ครูส่วนตัวแบบ **stateful หลาย session** (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills) — เพิ่ง track ใน `sources.json` 2026-08-08, ก่อนหน้านี้ไม่มี baseline). ใช้ current dir เป็น teaching workspace: `MISSION.md` (ทำไมอยากเรียน) + `./lessons/*.html` (บทเรียนสวยๆ ทีละเรื่องเล็ก) + `./learning-records/*.md` (จำว่าเรียนอะไรไปแล้ว→คำนวณ zone of proximal development) + `RESOURCES.md` + glossary. เน้น storage strength (retrieval/spacing/interleaving) ไม่ใช่ illusory fluency. `disable-model-invocation` → เรียก `/teach <หัวข้อ>` เอง. **ใหม่ — ไม่ทับของเดิม** |
| `wait-what` | **stop-and-re-pitch prompt** (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills), ลง 2026-08-09). แค่ template คำเดียว — บอกให้ user re-explain สิ่งที่เพิ่งพูดแบบสั้น ใช้ ASD-STE100 Simplified Technical English + ubiquitous language จาก `CONTEXT.md`. `disable-model-invocation` → ไม่ auto-trigger, เรียกเองเมื่ออยากให้ AI (หรือตัวเอง) หยุดแล้วอธิบายใหม่ให้ชัดก่อนไปต่อ |
| `wizard` | **สร้าง interactive bash wizard** สำหรับ manual procedure ที่ agent ทำเองไม่ได้ (Matt Pocock, source: [mattpocock/skills](https://github.com/mattpocock/skills), ลง 2026-08-09). ใช้ตอน provision infra / ตั้งค่า credential-CI secret / เดิน third-party dashboard ที่ไม่คุ้น / migration ครั้งเดียว. มี `template.sh` เป็น library สำเร็จรูป (stage progress, `open_url` cross-platform รวม WSL, `ask`/`ask_secret`, `write_env` idempotent, `set_secret`/`set_var` ผ่าน `gh`, closing summary) — งานของ skill คือ scope ขั้นตอน + author stage เท่านั้น ห้ามแก้ library ส่วนบน `STAGES` marker เอง. **ไม่ใช้กับ step ที่ agent ทำเองได้อยู่แล้ว** |
| `shipping-a-branch` | **end-to-end git ship flow** (วางแผนโดย fable-medium, ลง 2026-08-02). commit → confirm push → reuse-or-create PR (เช็ค `gh pr list --head` กันซ้ำ) → เลือก review mode (human/self/both) → loop แก้ feedback → confirm merge (method) → ask cleanup branch. ทุก checkpoint เสี่ยง (push/PR/merge/delete) **confirm แยกทุกครั้ง** ไม่ใช้ "ตกลงตอนแรก" มาครอบคลุมทีหลัง (ตาม instruction-priority ของ system). ใช้แทน `ecc:pr`/`ecc:review-pr` เมื่อต้องการ flow เต็ม ไม่ใช่แค่ phase เดียว. ใช้ทุก project (repo-agnostic ผ่าน `git`/`gh` ล้วน ไม่ hardcode ชื่อ branch/repo) — เรียกด้วย `/ship` หรือพูด "ship this"/"commit and open a PR" |

---

## superpowers (obra/superpowers) — process discipline

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `brainstorming` | สำรวจ intent + requirement + design — **ก่อนงาน creative ใด ๆ** |
| `writing-plans` | เขียน plan สำหรับ multi-step task — มี spec ยังไม่แตะโค้ด |
| `executing-plans` | execute plan ที่เขียน มี checkpoint |
| `subagent-driven-development` | execute plan ด้วย subagent — งาน independent |
| `dispatching-parallel-agents` | spawn agent ขนาน 2+ ตัว |
| `test-driven-development` | TDD เคร่งครัด (RED→GREEN→IMPROVE) |
| `systematic-debugging` | debug แบบมีระบบ — **เจอ bug/test fail** |
| `verification-before-completion` | ต้องรัน verify ก่อนเคลม "เสร็จ" |
| `requesting-code-review` | verify ว่างานเสร็จตาม requirement |
| `receiving-code-review` | รับ feedback อย่างมีวิจารณญาณ |
| `finishing-a-development-branch` | จบ branch (merge/PR/cleanup) |
| `using-git-worktrees` | จัดการ git worktree — งานหลาย branch พร้อมกัน |
| `writing-skills` | สร้าง/แก้ skill |
| `using-superpowers` | meta: วิธีใช้ superpowers |

---

## Custom global skills — engineering discipline *(เดิม plugin 9arm-skills; ถอดปลั๊กอินแล้ว ตอนนี้เป็น personal skill เรียกด้วยชื่อเปล่า)*

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `debug-mantra` | บังคับท่อง 4 ขั้น: reproduce → trace → falsify → cross-ref ก่อนเสนอ fix |
| `post-mortem` | เขียน RCA สำหรับ engineer (root cause, mechanism, fix, validation, slip-through) |
| `scrutinize` | review มุมคนนอก + trace code จริง ไม่ใช่แค่ diff |
| `management-talk` | แปล tech → VP/PM/director ตาม channel (JIRA/Slack/email/standup) |

---

## Custom global skills — design intelligence *(เดิม plugin ui-ux-pro-max/ckm; ถอดปลั๊กอินแล้ว ตอนนี้เป็น personal skill เรียกด้วยชื่อเปล่า)*

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `ui-ux-pro-max` | DB 50+ styles, 161 palettes, 57 font pairs, 99 UX, 25 charts, 10 stacks |
| `design` | logo + CIP + mockup + slides + banner + icon + social photo |
| `design-system` | design tokens 3 ชั้น + CSS vars — รวม **Minimum Semantic Set (6 slots)**: bg/ink/accent/surface/line/muted, ห้าม hardcode hex ใน component (เพิ่ม 2026-08-03) |
| `ui-styling` | shadcn/ui + Tailwind + canvas — implement UI จริง |
| `banner-design` | banner social/ad/web/print 22 styles |
| `brand` | brand voice + messaging + asset mgmt |
| `slides` | HTML presentation + Chart.js + design tokens |
| `mobbin-references` | **ใหม่ (2026-08-03).** ใช้ Mobbin MCP (`https://api.mobbin.com/mcp`, paid) ดึง screenshot แอปจริง 600k+ หน้าเป็น layout reference ก่อนออกแบบ UI — ถ้าไม่ connect fallback ไป `lazyweb-design-research` เอง ไม่บล็อก ไม่เตือนซ้ำ |
| `dembrandt` | **ใหม่ (2026-08-08, วางแผนโดย fable-medium).** ดึง design token จริงของเว็บที่ระบุ (สี/ฟอนต์/spacing/component) จาก DOM/CSS ผ่าน `npx dembrandt <url> --design-md --save-output` (ไม่ต้องลง, Node 18+). ใช้ตอน audit/benchmark/migrate เว็บเดิม — **ไม่ใช่** clone เว็บตรง ๆ และไม่ครบ 100% ถ้าเว็บเป็น Canvas หนัก/login wall/anti-bot/render ซับซ้อน. คนละบทบาทกับ `mobbin-references`/`lazyweb-design-research` (นั่น=inspiration หลายแอป, นี่=token จากเว็บเดียวที่ระบุ). Known Failure Modes มี cross-ref ไปยัง [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) (เพิ่ม 2026-08-08) เป็น fallback สำหรับเว็บ Canvas-heavy/anti-bot — ไม่ได้ลงเป็น skill แยก |
| *(reference source, ไม่ใช่ skill)* [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) | **ใหม่ (2026-08-09).** คลัง `DESIGN.md` สำเร็จรูป 73 แบรนด์ดัง (Stripe, Linear, Notion, Vercel, Apple, Figma, Supabase ฯลฯ) — ไฟล์ text ล้วน ไม่มีโค้ดรัน ไม่มีความเสี่ยง. ใช้ตอนอยากให้ UI ที่สร้างมี "กลิ่น" ตรงกับแบรนด์ที่มีอยู่แล้วจริง ๆ (ไม่ใช่แค่ inspiration แบบ `mobbin-references`/`lazyweb-design-research`) — ดึงไฟล์เดี่ยวได้จาก `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/<slug>/DESIGN.md` (ดู slug list ในลิงก์ repo) แล้ว drop ลง project root ให้ agent อ่านตรง ๆ ก่อนสั่งสร้าง UI ไม่ต้อง clone ทั้ง repo (คลังอัปเดตเรื่อย ๆ, fetch สดกันข้อมูลเก่า) |

---

## pordee (kerlos/pordee) — Thai compression

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `pordee:pordee` | โหมดสั้นไทย+อังกฤษ ลด token 60-75% — `/pordee` |
| `pordee:pordee-stats` | สถิติ token ของ session — `/pordee-stats` |

---

## lazyweb (aboul3ata/lazyweb-skill) — design research

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `lazyweb-design-research` | research design + ดาวน์โหลด screenshot reference |
| `lazyweb-quick-references` | หา app screenshot/UI reference เร็ว ๆ |
| `lazyweb-design-improve` | screenshot งานเรา + หาเทียบ → ไอเดียปรับ |
| `lazyweb-design-brainstorm` | brainstorm cross-domain (ออกนอก category) |
| `lazyweb-add-inspo-source` | connect Mobbin/Savee/Dribbble/Behance |
| `lazyweb-remove-inspo-source` | ถอด source ที่ connect |

---

## andrej-karpathy-skills

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `karpathy-guidelines` | guideline ลด LLM coding mistakes (surgical, surface assumptions) |

---

## anthropic-skills (official) — productivity

| Skill | ทำอะไร / ใช้ตอน |
|---|---|
| `internal-comms` | status report, leadership update, FAQ, incident report |
| `brand-guidelines` | apply Anthropic brand color/typography |
| `consolidate-memory` | reflective pass over memory files (merge/prune) |
| `doc-coauthoring` | structured workflow เขียน doc/spec/proposal |
| `algorithmic-art` | p5.js generative art |
| `canvas-design` | visual art .png/.pdf |
| `docx` | Word — สร้าง/อ่าน/แก้ |
| `pdf` | PDF — read/merge/split/OCR/form |
| `xlsx` | Excel — สร้าง/แก้/clean data |
| `pptx` | PowerPoint deck |
| `slack-gif-creator` | animated GIF สำหรับ Slack |
| `mcp-builder` | สร้าง MCP server (FastMCP / TS SDK) |
| `web-artifacts-builder` | claude.ai HTML artifact (React+Tailwind+shadcn) |
| `theme-factory` | apply theme (10 presets) artifact |
| `skill-creator` | สร้าง/แก้ skill + eval + benchmark |
| `setup-cowork` | guided Cowork setup |

---

## ECC (affaan-m/everything-claude-code) — 284 skills (per CLAUDE.md's "Installed Plugins" section; this list below covers a subset, not all of them)

### Agentic / agent systems

| Skill | ใช้ตอน |
|---|---|
| `agent-architecture-audit` | Full-stack diagnostic for agent + LLM apps. Audits 12-layer stack for wrapper regression, memory pollution, tool failures, repair loops, rendering corruption |
| `agent-eval` | Head-to-head comparison of coding agents (Claude Code, Aider, Codex) — pass rate, cost, time, consistency |
| `agent-harness-construction` | Design + optimize AI agent action spaces, tool definitions, observation formatting |
| `agent-introspection-debugging` | Structured self-debugging for agent failures (capture, diagnosis, contained recovery, reports) |
| `agent-payment-x402` | Add x402 payment to agents — per-task budgets, non-custodial wallets (Base, X Layer) |
| `agent-sort` | Sort ECC skills/commands/rules/hooks into DAILY vs LIBRARY for a specific repo |
| `agentic-engineering` | Operate as agentic engineer — eval-first execution, decomposition, cost-aware routing |
| `agentic-os` | Build persistent multi-agent OS on Claude Code (kernel, specialists, slash commands, file memory) |
| `ai-first-engineering` | Engineering operating model for teams where AI generates most output |
| `autonomous-agent-harness` | Transform Claude Code into autonomous agent — persistent memory, scheduled ops, computer use, queues |
| `autonomous-loops` | Patterns for autonomous Claude Code loops (sequential pipelines → RFC-driven multi-agent DAG) |
| `claude-devfleet` | Orchestrate multi-agent coding via Claude DevFleet — parallel agents in isolated worktrees |
| `continuous-agent-loop` | Continuous autonomous loops with quality gates, evals, recovery |
| `continuous-learning-v2` | Instinct-based learning — observes sessions via hooks, scores confidence, evolves into skills (project-scoped) |
| `continuous-learning` | [DEPRECATED] v1 stop-hook extractor — use v2 |
| `dmux-workflows` | Multi-agent orchestration via dmux (tmux pane manager) — parallel sessions |
| `enterprise-agent-ops` | Long-lived agent workloads — observability, security boundaries, lifecycle |
| `eval-harness` | Formal eval framework for Claude Code (EDD principles) |
| `gan-style-harness` | Generator-Evaluator agent harness (Anthropic Mar 2026 paper) |
| `nanoclaw-repl` | Operate + extend NanoClaw v2 (zero-dependency session-aware REPL) |
| `plan-orchestrate` | Read plan → decompose → design agent chain → emit `/orchestrate` prompts |
| `ralphinho-rfc-pipeline` | RFC-driven multi-agent DAG with quality gates + merge queues |
| `santa-method` | Adversarial multi-agent verification — 2 reviewers must both pass |
| `team-builder` | Interactive picker for composing parallel agent teams |
| `iterative-retrieval` | Pattern for progressively refining context retrieval (subagent context problem) |

### LLM cost / model routing / context

| Skill | ใช้ตอน |
|---|---|
| `cost-aware-llm-pipeline` | Cost optimization — model routing by complexity, budget tracking, retry, prompt caching |
| `cost-tracking` | Track Claude Code token usage / spending / budgets from local DB |
| `context-budget` | Audit Claude Code context window — bloat, redundancy, token-savings recs |
| `strategic-compact` | Manual context compaction at logical intervals (vs auto-compact) |
| `token-budget-advisor` | Token budget guidance |

### Coding standards / patterns (cross-cutting)

| Skill | ใช้ตอน |
|---|---|
| `coding-standards` | Baseline cross-project conventions (naming, readability, immutability, code-quality) |
| `error-handling` | Robust error handling — TypeScript/Python/Go; typed errors, boundaries, retries, circuit breakers |
| `architecture-decision-records` | Capture decisions as structured ADRs auto-detected |
| `hexagonal-architecture` | Ports & Adapters — domain boundaries, dependency inversion (TS/Java/Kotlin/Go) |
| `api-design` | REST patterns — resource naming, codes, pagination, filtering, errors, versioning, rate limit |
| `api-connector-builder` | Build new API connector matching repo's existing integration pattern |
| `content-hash-cache-pattern` | Cache expensive file results via SHA-256 — path-independent, auto-invalidate |

### Languages — Python

| Skill | ใช้ตอน |
|---|---|
| `python-patterns` | Pythonic idioms, PEP 8, type hints |
| `python-testing` | pytest, TDD, fixtures, mocking, coverage |

### Languages — Go

| Skill | ใช้ตอน |
|---|---|
| `golang-patterns` | Idiomatic Go conventions |
| `golang-testing` | Table-driven, subtest, benchmark, fuzz, coverage |

### Languages — Rust

| Skill | ใช้ตอน |
|---|---|
| `rust-patterns` | Ownership, error handling, traits, concurrency |
| `rust-testing` | Unit, integration, async, property-based, mocking, coverage |

### Languages — Java / Kotlin

| Skill | ใช้ตอน |
|---|---|
| `java-coding-standards` | Spring Boot + Quarkus conventions (immutability, Optional, streams, CDI, reactive) |
| `springboot-patterns` | Spring Boot — REST, layered services, data access, caching, async |
| `springboot-tdd` | JUnit 5, Mockito, MockMvc, Testcontainers, JaCoCo |
| `springboot-security` | authn/authz, validation, CSRF, headers, rate limit |
| `springboot-verification` | build + analysis + tests + security + diff review |
| `quarkus-patterns` | Quarkus 3.x LTS with Camel — messaging, REST, CDI, Panache |
| `quarkus-tdd` | JUnit 5, Mockito, REST Assured, Camel testing, JaCoCo |
| `quarkus-security` | JWT/OIDC, RBAC, validation, secrets |
| `quarkus-verification` | build + analysis + tests + security + native + diff |
| `jpa-patterns` | Spring Boot JPA/Hibernate — entity design, queries, transactions, auditing |
| `kotlin-patterns` | Idiomatic Kotlin — coroutines, null safety, DSL builders |
| `kotlin-testing` | Kotest, MockK, coroutine test, property-based, Kover |
| `kotlin-coroutines-flows` | Structured concurrency, Flow operators, StateFlow |
| `kotlin-ktor-patterns` | Routing DSL, plugins, auth, Koin DI, kotlinx.serialization, WebSockets |
| `kotlin-exposed-patterns` | Exposed ORM — DSL queries, DAO, transactions, HikariCP, Flyway |
| `android-clean-architecture` | Android + KMP clean arch — modules, UseCases, Repositories |
| `compose-multiplatform-patterns` | Compose Multiplatform + Jetpack Compose — state, nav, theme, platform UI |

### Languages — Swift / Apple

| Skill | ใช้ตอน |
|---|---|
| `swiftui-patterns` | SwiftUI — @Observable state, view composition, nav, performance |
| `swift-concurrency-6-2` | Swift 6.2 Approachable Concurrency — single-threaded default, @concurrent, isolated conformances |
| `swift-actor-persistence` | Actor-based thread-safe persistence (in-memory + file) |
| `swift-protocol-di-testing` | Protocol-based DI — mock FS/network/APIs, Swift Testing |
| `foundation-models-on-device` | Apple FoundationModels — on-device LLM, @Generable, tool calling (iOS 26+) |
| `liquid-glass-design` | iOS 26 Liquid Glass material — blur, reflection, morphing |
| `ios-icon-gen` | iOS app icons from SF Symbols (5000+) or Iconify (275k+) |

### Languages — C / C++ / C# / F# / .NET / Perl

| Skill | ใช้ตอน |
|---|---|
| `cpp-coding-standards` | C++ Core Guidelines — modern, safe, idiomatic |
| `cpp-testing` | GoogleTest/CTest, sanitizers, coverage |
| `csharp-testing` | xUnit, FluentAssertions, mocking, integration |
| `fsharp-testing` | xUnit, FsUnit, Unquote, FsCheck property-based |
| `dotnet-patterns` | Idiomatic C#/.NET — DI, async/await |
| `perl-patterns` | Modern Perl 5.36+ idioms |
| `perl-testing` | Test2::V0, Test::More, Devel::Cover, TDD |
| `perl-security` | Taint mode, validation, safe exec, DBI, web security |

### Web — frontend frameworks

| Skill | ใช้ตอน |
|---|---|
| `frontend-patterns` | React, Next.js, state mgmt, perf, UI |
| `frontend-design-direction` | Set ECC-specific frontend design direction for production UI |
| `frontend-slides` | Animation-rich HTML presentations, convert PPT to web |
| `nextjs-turbopack` | Next.js 16+ Turbopack — bundling, caching, dev speed |
| `nuxt4-patterns` | Nuxt 4 — hydration safety, perf, route rules, SSR-safe fetch |
| `angular-developer` | Angular code + arch guidance — signals, forms, DI, routing, SSR, a11y |
| `vite-patterns` | Vite — config, plugins, HMR, env, SSR, library mode |
| `ui-to-vue` | Convert UI screenshots → Vue 3 (Vant, Element Plus, Ant Design Vue) |
| `motion-foundations` | Motion tokens + spring presets + perf rules + a11y + SSR safety (React/Next) |
| `motion-patterns` | Production animations — button/modal/toast/stagger/page transitions |
| `motion-advanced` | Drag & drop, gestures, text anim, SVG paths, custom hooks, useAnimate |
| `motion-ui` | Production-ready UI motion system for React/Next |

### Web — backend frameworks

| Skill | ใช้ตอน |
|---|---|
| `backend-patterns` | Backend arch — API, DB optimization, server-side (Node/Express/Next API) |
| `nestjs-patterns` | NestJS — modules, controllers, providers, DTO, guards, interceptors |
| `fastapi-patterns` | Async APIs, DI, Pydantic, OpenAPI, tests, security |
| `django-patterns` | Django + DRF — REST API, ORM, caching, signals, middleware |
| `django-tdd` | pytest-django, factory_boy, mocking, DRF tests |
| `django-security` | authn/authz, CSRF, SQLi, XSS, secure deploy |
| `django-celery` | Async tasks — config, beat, retries, canvas workflows |
| `django-verification` | Migrations + lint + tests + security + deploy ready |
| `laravel-patterns` | Routing/controllers, Eloquent, services, queues, events, caching |
| `laravel-tdd` | PHPUnit + Pest, factories, DB testing, fakes, coverage |
| `laravel-security` | authn/authz, validation, CSRF, mass assignment, uploads |
| `laravel-verification` | env + lint + analysis + tests + security + deploy |
| `laravel-plugin-discovery` | Find Laravel packages via LaraPlugins.io MCP |
| `tinystruct-patterns` | tinystruct Java framework — Application, @Action routes, HTTP/CLI dual, SSE |

### Web — runtime / build / deploy

| Skill | ใช้ตอน |
|---|---|
| `bun-runtime` | Bun as runtime/PM/bundler/test — when vs Node, Vercel support |
| `flox-environments` | Reproducible cross-platform dev environments via Flox (Nix-based) |
| `docker-patterns` | Docker + Compose — local dev, security, networking, volumes, orchestration |
| `deployment-patterns` | CI/CD pipelines, Docker, health checks, rollback, prod readiness |
| `git-workflow` | Branching, commits, merge vs rebase, conflict resolution |
| `database-migrations` | Schema changes, data migrations, rollbacks, zero-downtime (PG/MySQL/ORMs) |

### Mobile — Flutter / Dart

| Skill | ใช้ตอน |
|---|---|
| `dart-flutter-patterns` | Null safety, immutable state, async, widget arch, BLoC/Riverpod/Provider, GoRouter, Dio, Freezed |
| `flutter-dart-code-review` | Code review checklist — widget, state mgmt, Dart idioms, perf, a11y, security |

### Databases

| Skill | ใช้ตอน |
|---|---|
| `postgres-patterns` | Query opt, schema design, indexing, security (Supabase best practices) |
| `mysql-patterns` | MySQL/MariaDB schema, query, indexing, transactions, replication |
| `clickhouse-io` | ClickHouse — query opt, analytics for high-perf analytical workloads |
| `prisma-patterns` | Prisma TypeScript — schema, query opt, transactions, pagination, traps |
| `redis-patterns` | Data structures, caching, distributed locks, rate limit, pub/sub |

### AI / ML / RecSys

| Skill | ใช้ตอน |
|---|---|
| `mle-workflow` | Production ML — data contracts, reproducible training, eval, deploy, monitor, rollback |
| `pytorch-patterns` | PyTorch — training pipelines, model arch, data loading |
| `recsys-pipeline-architect` | Recommendation/ranking/feed pipelines — Source→Hydrator→Filter→Scorer→Selector→SideEffect |
| `mcp-server-patterns` | Build MCP servers with Node/TS SDK — tools, resources, prompts, Zod |
| `llm-trading-agent-security` | Autonomous trading agents — prompt injection, spend limits, simulation, circuit breakers, MEV |
| `safety-guard` | Prevent destructive ops on prod / autonomous agents |
| `gateguard` | Fact-forcing gate blocks Edit/Write/Bash until investigation (+2.25 quality) |
| `ai-regression-testing` | Sandbox API testing, automated bug-check, catch AI blind spots |

### Testing / QA / verification

| Skill | ใช้ตอน |
|---|---|
| `tdd-workflow` | Test-driven dev, 80%+ coverage (unit + integration + E2E) |
| `e2e-testing` | Playwright — POM, config, CI/CD, artifacts, flaky strategies |
| `browser-qa` | Automated visual + UI interaction verification after deploy |
| `windows-desktop-e2e` | Windows desktop apps (WPF/WinForms/Win32/Qt) via pywinauto |
| `ui-demo` | Polished UI demo videos via Playwright |
| `verification-loop` | Comprehensive verification system for Claude Code sessions |
| `canary-watch` | Monitor deployed URL after release — HTTP/SSE/assets/console/perf |
| `click-path-audit` | Trace every button's full state-change sequence to find UI bugs |
| `production-audit` | Local-evidence prod readiness audit (no external service) |
| `repo-scan` | Cross-stack source audit — classify files, detect embedded libs, 4-level verdicts |
| `benchmark` | Measure perf baselines, detect regressions, compare stacks |
| `accessibility` | WCAG 2.2 Level AA — inclusive design for Web + native |
| `security-review` | Security checklist for authn / input / secrets / API / payments |
| `security-scan` | Scan `.claude/` for vulnerabilities (AgentShield) |
| `security-bounty-hunter` | Hunt exploitable bounty-worthy issues — remotely reachable vulns |

### Network / homelab / infra

| Skill | ใช้ตอน |
|---|---|
| `cisco-ios-patterns` | Cisco IOS/IOS-XE — show commands, config hierarchy, ACL, change-window verify |
| `netmiko-ssh-automation` | Python Netmiko — read-only collection, batch SSH, TextFSM, guarded changes |
| `network-bgp-diagnostics` | BGP troubleshooting — neighbor state, route exchange, prefix policy |
| `network-config-validation` | Pre-deploy checks — dangerous commands, dup addresses, subnet overlaps |
| `network-interface-health` | Interface errors, drops, CRCs, duplex, flapping, speed negotiation |
| `homelab-network-readiness` | Checklist before VLAN/DNS/WG changes |
| `homelab-network-setup` | Gateways, switches, APs, IP, DHCP, DNS, cabling |
| `homelab-vlan-segmentation` | VLANs for IoT/guest/trusted/server (UniFi/pfSense/MikroTik) |
| `homelab-pihole-dns` | Pi-hole install, blocklists, DoH, DHCP, local DNS |
| `homelab-wireguard-vpn` | WireGuard server, peer config, split vs full tunnel |

### Healthcare

| Skill | ใช้ตอน |
|---|---|
| `healthcare-cdss-patterns` | CDSS — drug interactions, dose validation, NEWS2/qSOFA, alert severity |
| `healthcare-emr-patterns` | EMR/EHR — clinical safety, encounters, prescriptions, a11y-first UI |
| `healthcare-phi-compliance` | PHI/PII — classification, access control, audit, encryption, leak vectors |
| `healthcare-eval-harness` | Patient safety eval — CDSS accuracy, PHI exposure, workflow integrity |
| `hipaa-compliance` | HIPAA / PHI / BAA / breach posture / US healthcare compliance |

### Scientific

| Skill | ใช้ตอน |
|---|---|
| `scientific-thinking-literature-review` | Lit review — search planning, screening, synthesis, citations |
| `scientific-thinking-scholar-evaluation` | Evaluate papers/proposals/reviews/methods/evidence |
| `scientific-db-pubmed-database` | PubMed + NCBI E-utilities — MeSH, PMID, citations |
| `scientific-db-uspto-database` | USPTO patent/trademark — PatentSearch, TSDR, assignment |
| `scientific-pkg-gget` | gget CLI — genomic queries, sequence, BLAST, enrichment |

### DeFi / blockchain

| Skill | ใช้ตอน |
|---|---|
| `defi-amm-security` | Solidity AMM audit — reentrancy, CEI, donation, oracle, slippage, integer math |
| `evm-token-decimals` | Prevent decimal mismatch across EVM chains |
| `nodejs-keccak256` | Prevent Node sha3-256 vs Ethereum Keccak-256 mixup (selectors/signatures/storage) |
| `agent-payment-x402` | (ดูด้านบน Agentic) |

### Business / ops / sales / marketing

| Skill | ใช้ตอน |
|---|---|
| `customer-billing-ops` | Stripe — subscriptions, refunds, churn triage, billing portal |
| `customs-trade-compliance` | (TH/CH desc) Customs docs, HS classification, Incoterms, FTA, penalty mitigation |
| `carrier-relationship-management` | Carrier portfolio, RFP, scorecards, freight allocation |
| `energy-procurement` | Electricity + gas procurement, tariff opt, demand charges, PPA eval |
| `inventory-demand-planning` | (similar ops domain) |
| `production-scheduling` | Production scheduling expertise |
| `quality-nonconformance` | QA non-conformance handling |
| `returns-reverse-logistics` | Returns / reverse logistics |
| `logistics-exception-management` | Logistics exception handling |
| `finance-billing-ops` | Revenue, pricing, refunds, team billing, billing-model truth |
| `ecc-tools-cost-audit` | ECC Tools burn + billing audit — quota bypass, premium leakage |
| `investor-materials` | Pitch decks, one-pagers, memos, accelerator apps, financial models |
| `investor-outreach` | Cold email, warm intro, follow-up, update email |
| `market-research` | Market sizing, competitor comparison, fund/tech scans |
| `lead-intelligence` | AI-native lead intel — signal scoring, mutual ranking, warm path, outreach |
| `content-engine` | Platform-native content — X/LinkedIn/TikTok/YouTube/newsletter |
| `crosspost` | Multi-platform distribution — X/LinkedIn/Threads/Bluesky |
| `brand-voice` | Source-derived writing style profile for voice consistency |
| `article-writing` | Long-form content with distinctive voice |
| `seo` | Technical SEO, on-page, schema, Core Web Vitals, content strategy |
| `social-graph-ranker` | Weighted graph ranking — warm intro, bridge scoring, gap analysis |
| `connections-optimizer` | Reorganize X + LinkedIn network — pruning, recommendations, warm outreach |
| `x-api` | X/Twitter API — post, threads, timeline, search, analytics |

### Productivity / ops surfaces

| Skill | ใช้ตอน |
|---|---|
| `email-ops` | Mailbox triage, draft, send verify, sent-mail follow-up |
| `messages-ops` | Live messaging — read texts/DMs, recover OTP, inspect thread |
| `unified-notifications-ops` | Notifications across GitHub/Linear/desktop/hooks |
| `google-workspace-ops` | Drive + Docs + Sheets + Slides as one surface |
| `github-ops` | gh CLI — issues, PRs, CI, releases, security |
| `terminal-ops` | Repo execution — run command, check repo, debug CI, narrow fix |
| `knowledge-ops` | Knowledge base mgmt — ingest, sync, dedupe, search across stores |
| `research-ops` | Evidence-first current-state research |
| `automation-audit-ops` | Inventory + overlap audit — jobs/hooks/connectors/MCP/wrappers |
| `project-flow-ops` | GitHub + Linear — backlog, PR triage, GitHub↔Linear coordination |
| `dashboard-builder` | Grafana/SigNoz dashboards that answer real operator questions |

### Media / content tools

| Skill | ใช้ตอน |
|---|---|
| `fal-ai-media` | fal.ai — text-to-image (Nano Banana), video (Seedance/Kling/Veo 3), TTS, video-to-audio |
| `manim-video` | Manim explainers for technical concepts, diagrams, walkthroughs |
| `remotion-video-creation` | Remotion in React — 3D, anim, audio, captions, charts, transitions |
| `video-editing` | Video pipeline — FFmpeg, Remotion, ElevenLabs, fal.ai, Descript, CapCut |
| `videodb` | See/Understand/Act on video + audio — indexes, search, transcode, edits |
| `visa-doc-translate` | Translate visa docs → bilingual PDF |
| `nutrient-document-processing` | Convert/OCR/extract/redact/sign/fill docs via Nutrient DWS |

### Search / research / docs

| Skill | ใช้ตอน |
|---|---|
| `search-first` | Search existing tools/libs/patterns before writing custom (researcher agent) |
| `documentation-lookup` | Up-to-date library docs via Context7 MCP (not training data) |
| `exa-search` | Neural search via Exa MCP — web/code/company/people |
| `deep-research` | Multi-source via firecrawl + exa — cited reports |
| `codebase-onboarding` | Analyze codebase → onboarding guide + arch map + CLAUDE.md |
| `code-tour` | CodeTour `.tour` files — persona-targeted walkthroughs |

### ECC self-management / meta

| Skill | ใช้ตอน |
|---|---|
| `configure-ecc` | Interactive installer for ECC — select + install skills/rules |
| `ecc-guide` | Guide ECC's agents/skills/commands/hooks from live repo |
| `everything-claude-code` | Conventions for everything-claude-code repo itself |
| `ck` | Persistent per-project memory for Claude Code — auto-load context |
| `workspace-surface-audit` | Audit repo + MCP + plugins + connectors → recommend skills/hooks/agents |
| `skill-scout` | Search existing local/marketplace/GitHub/web skill sources |
| `skill-stocktake` | Audit Claude skills + commands for quality (Quick / Full) |
| `skill-comply` | Visualize if skills/rules are followed — 3 strictness levels, full timeline |
| `rules-distill` | Scan skills, extract cross-cutting principles, distill into rules |
| `hookify-rules` | Create hookify rule, write hook rule, hookify syntax guidance |
| `hermes-imports` | Convert Hermes operator workflows → sanitized ECC skills |
| `opensource-pipeline` | Fork + sanitize + package private projects for public release |

### Product / planning

| Skill | ใช้ตอน |
|---|---|
| `product-capability` | PRD → implementation-ready capability plan (constraints, invariants, interfaces) |
| `product-lens` | Validate "why" before building, product diagnostics, pressure-test direction |
| `blueprint` | One-line goal → multi-session multi-agent build plan with adversarial gates |
| `data-scraper-agent` | Automated AI data collection — scrape on schedule, enrich, store, learn |

### Design (ECC)

| Skill | ใช้ตอน |
|---|---|
| `design-system` (ecc) | Generate/audit design systems, visual consistency, review styling PRs |
| `make-interfaces-feel-better` | Polish details — spacing, type, borders, shadows, motion, hit areas |

### Decision / collaboration

| Skill | ใช้ตอน |
|---|---|
| `council` | Convene 4-voice council for ambiguous decisions, tradeoffs, go/no-go |
| `plankton-code-quality` | Write-time enforcement — auto-format + lint + Claude fixes on edit |

### Other

| Skill | ใช้ตอน |
|---|---|
| `jira-integration` | Jira ticket retrieval/analysis/update via MCP or REST |
| `regex-vs-llm-structured-text` | Decision framework — regex vs LLM for structured text parsing |

---

## Quick "ตอนไหนใช้อะไร" cheatsheet

| สถานการณ์ | Skill หลัก + เสริม |
|---|---|
| เริ่มงานใหม่ creative | `superpowers:brainstorming` |
| มี requirement → plan | `superpowers:writing-plans` หรือ `ecc:plan` |
| Plan แล้ว → execute | `superpowers:executing-plans` หรือ `ecc:prp-implement` |
| Feature ใหม่ (TDD) | `superpowers:test-driven-development` + `ecc:<lang>-test` |
| เจอบั๊ก | `superpowers:systematic-debugging` + `debug-mantra` |
| Fix แล้ว ปิด ticket | `post-mortem` (→ `management-talk` ถ้าส่งบน) |
| Review PR/plan | `scrutinize` + `ecc:code-review` |
| ก่อน commit | `superpowers:verification-before-completion` + `ecc:checkpoint` |
| Build fail | `ecc:build-fix` หรือ `ecc:<lang>-build` |
| Design UI ใหม่ | `ui-ux-pro-max` → `ui-styling` |
| Build หน้าใหม่เต็มหน้า / audit AI-slop | `hallmark` (57 gate anti-slop system, มี `audit` mode read-only) |
| Polish/deslop UI (ทำได้แต่ไม่สวย) | `make-interfaces-feel-better` (optical craft) + `deslop-defaults` (structural restraint) |
| Research design | `lazyweb:lazyweb-design-research` |
| สร้าง slide | `slides` หรือ `anthropic-skills:pptx` |
| งาน doc/spec | `anthropic-skills:doc-coauthoring` |
| แปลงไฟล์ (PDF/office/audio) → Markdown / feed RAG / batch | `markitdown` |
| ลด token | `pordee:pordee` |
| สร้าง skill ใหม่ | `superpowers:writing-skills` หรือ `anthropic-skills:skill-creator` |
| Audit context bloat | `ecc:context-budget` + `ecc:strategic-compact` |
| Production audit | `ecc:production-audit` + `ecc:canary-watch` |
| UI bug หลัง refactor | `ecc:click-path-audit` |

---

## ECC Commands (slash) — ใช้ตรง

`/plan`, `/plan-prd`, `/feature-dev`, `/code-review`, `/review-pr`, `/checkpoint`, `/build-fix`, `/quality-gate`, `/pr`, `/prp-plan`, `/prp-implement`, `/prp-prd`, `/prp-pr`, `/prp-commit`, `/test-coverage`, `/refactor-clean`, `/hookify`, `/hookify-list`, `/hookify-configure`, `/hookify-help`, `/learn`, `/learn-eval`, `/instinct-import`, `/instinct-export`, `/instinct-status`, `/promote`, `/prune`, `/projects`, `/save-session`, `/resume-session`, `/sessions`, `/loop-start`, `/loop-status`, `/multi-plan`, `/multi-execute`, `/multi-frontend`, `/multi-backend`, `/multi-workflow`, `/gan-build`, `/gan-design`, `/santa-loop`, `/cost-report`, `/model-route`, `/harness-audit`, `/agent-architecture-audit`, `/security-scan`, `/security-review`, `/update-codemaps`, `/update-docs`, `/project-init`, `/configure-ecc`, `/ecc-guide`, `/jira`, `/skill-create`, `/skill-health`, `/skill-comply`, `/skill-scout`, `/skill-stocktake`

Per-language build/review/test commands: `/cpp-build`, `/cpp-review`, `/cpp-test`, `/go-build`, `/go-review`, `/go-test`, `/rust-build`, `/rust-review`, `/rust-test`, `/kotlin-build`, `/kotlin-review`, `/kotlin-test`, `/flutter-build`, `/flutter-review`, `/flutter-test`, `/python-review`, `/fastapi-review`, `/gradle-build`, `/pm2`

---

## เครื่องมืออ้างอิง (ไม่ใช่ skill)

| ใช้ตอน | เครื่องมือ |
|--------|-----------|
| เช็คว่าสกิล/ปลั๊กอินมีอัปเดตใหม่ไหม (รายสัปดาห์ อัตโนมัติ, deterministic 0-token, รายงานอย่างเดียว ไม่อัปเดตเอง) | `~/.claude/tools/skill-update-check/check.ps1` (manifest: `sources.json`, รายงาน: `~/.claude/skill-update-report.md`) |

- เช็ค git plugins (ecc/superpowers) ด้วย `git fetch`+`rev-list`, pip (graphifyy/markitdown/ifixai) ด้วย `pip list --outdated`, personal skills ด้วย `git ls-remote` เทียบ baseline ใน `sources.json`.
- รัน Task Scheduler ทุกวันอาทิตย์ 10:00 (`schtasks /Query /TN ClaudeSkillUpdateCheck`). รันมือ: `powershell -NoProfile -ExecutionPolicy Bypass -File ~/.claude/tools/skill-update-check/check.ps1`
- **review-before-apply:** อ่านรายงานแล้วอัปเดตเองทีละตัว → หลังอัปแล้วรัน `check.ps1 -Ack` เพื่อรีเซ็ต baseline.
- **⚠️ ข้อจำกัดที่รู้แล้ว (2026-08-08):** `claude plugin update` ไม่ได้ทำ `git pull` ในโฟลเดอร์เดิม — มันแตก version dir ใหม่ (เช่น `ecc/2.2.0`) ที่ไม่มี `.git` เลย (extract จาก release archive) แล้วทิ้ง dir เวอร์ชันเก่าที่ยังมี `.git` ค้างไว้. `check.ps1` สแกนหา `.git` เจอแต่ dir เก่า เลยรายงาน ecc/superpowers ว่า "ตามหลังหลายร้อย commit" ตลอดไป **ทั้งที่จริงอัปเดตแล้ว** (เช็คจริงด้วย `claude plugin list`). แก้ถาวร: ลบ dir เวอร์ชันเก่าทิ้ง (เช่น `~/.claude/plugins/cache/ecc/ecc/2.0.0-rc.1`, `.../superpowers/superpowers/5.1.0`) — ยังไม่ได้ลบ (session นี้ถูก permission classifier บล็อกไว้ตอนลอง `rm -rf`), รอผู้ใช้ลบเองหรืออนุญาตครั้งหน้า. ไม่กระทบ `-Ack`/`sources.json` เพราะ `git_plugins` ไม่มี baseline ให้พัง.

---

## Standalone CLI tools/agents ที่ลงไว้ (ไม่ใช่ Claude Code skill — โปรแกรมแยกในเครื่อง, 2026-08-09)

| Tool | ทำอะไร / ใช้ตอน | ติดตั้งยังไง |
|---|---|---|
| [`witr`](https://github.com/pranshuparmar/witr) | "Why is this running?" — trace process/port/container/file กลับไปหา chain ที่สั่งมัน (`witr nginx`, `witr --port 5432`, `witr --tree`) ใช้ตอน debug ว่าทำไม process นี้ยังรันอยู่ | binary release verify SHA256 แล้วจริง วางไว้ที่ `~/bin/witr.exe` (อยู่ใน PATH แล้ว) — เรียก `witr` ได้ทุกที่ |
| [`ifixai-ai/iFixAi`](https://github.com/ifixai-ai/iFixAi) | audit/ให้คะแนน AI agent หรือ LLM endpoint ตาม provider+judge+suite ที่เลือก (`ifixai setup` → `ifixai run`) — ใช้ตอนอยากให้ตรวจ output ของ agent ตัวอื่นแบบมีมาตรฐาน | `pip install "ifixai[anthropic]"` — **ทดสอบแล้ว 2026-08-09**: `ifixai run --provider mock --strategic` รันได้จริง แต่แม้ mock ก็ยังต้องมี key จริงให้ judge model — ไม่มี `ANTHROPIC_API_KEY` (มีแค่ `ANTHROPIC_BASE_URL`) เลยรันเต็มไม่ได้ ยังไม่ใช่ของพัง แค่ขาด key |
| [`earendil-works/pi`](https://github.com/earendil-works/pi) | agent-building toolkit (unified multi-provider LLM API + agent runtime + TUI + coding CLI) | `npm` package `@earendil-works/pi-coding-agent` — **ทดสอบแล้ว 2026-08-09: ใช้งานได้จริง** shim เดิมหายไป (จาก npm operation ที่เคยถูกขัดจังหวะ) ติดตั้งใหม่ pin ไว้ที่ v0.74.2 (`@latest`/0.84.1 ต้องการ Node ≥22.19.0 แต่เครื่องมี v22.12.0) — `pi --version`, `pi --help`, `pi -p "..."` ทำงานถูกต้องหมด (error file-not-found ถูกต้อง, ตรวจ missing API key แล้วบอก `/login` ถูกต้อง) เหลือแค่ต้องมี provider key หรือ OAuth login ถึงจะใช้งานจริงได้ |

**ถอนการติดตั้ง หลังทดสอบแล้วใช้ไม่ได้จริง (2026-08-09):**
- **`anomalyco/opencode`** (`opencode-ai`) — ลองติดตั้งซ้ำ 3+ รอบ, postinstall โหลด platform binary ไม่สำเร็จ (`EIDLETIMEOUT` ทุกครั้ง กับ registry.npmjs.org) `opencode --version` ใช้ไม่ได้ → uninstall แล้ว
- **`magnitudedev/magnitude`** (`@magnitudedev/cli`) — ยืนยันพังจริงบน Windows: alpha version 0.0.1-alpha.37 ไม่มี Windows CLI binary ให้เลย (`release has 0 matching cli artifacts`) → uninstall แล้ว

**ปฏิเสธไม่ติดตั้งแม้ผู้ใช้ขอตรงๆ (2026-08-09):**
- **`ultraworkers/claw-code`** — ตรวจ engagement stats เจอสัญญาณ star-farming ชัด: 195,013★ แต่ fork ถึง 109,249 (56%, ปกติ 5-15%), watcher แค่ 1,952 คน (~1%), repo อายุ 4 เดือน + framing "ไม่มี human ควบคุมเลย" = supply-chain risk ตรงๆ
- **`PrimeIntellect-ai/prime-agent`** — ไม่มี npm/pip package มีแต่ `curl \| sh` installer ที่ติดตั้ง Node/npm ระบบให้อัตโนมัติได้ถ้าไม่มี ซับซ้อนเกินจะ audit ได้มั่นใจ — ขัดกฎ "ห้ามรันไฟล์จากแหล่งยังไม่ผ่านตรวจสอบ" แม้ผู้ใช้จะอนุญาตก็ตาม

ที่มาเต็ม + งานวิจัยทั้งหมด (73 repo จาก trendshift.io): `<YOUR_VAULT_PATH>\projects\claude-skills-trendshift-2026-08\FULL-LEDGER.md`

---

## makerskills / cybersecurity-skills / marketingskills — adopted 2026-08-09

จาก 3 repo ของ Corey Haines / briiirussell ที่ผู้ใช้ขอเพิ่ม (คัด subset เท่านั้น ไม่ใช่ทั้งชุด — ดู `sources.json` personal_skills สำหรับ commit baseline ของแต่ละตัว):

- **makerskills** (`coreyhaines31/makerskills`, คัดเอง 6/19): `second-brain`, `decide`, `unstuck`, `skillify`, `deep-research`, `watch-video` — เลือกเพราะตรงกับ workflow `<YOUR_VAULT_PATH>` vault + นิสัยคัดสกิลของผู้ใช้เอง
- **cybersecurity-skills** (`briiirussell/cybersecurity-skills`, ผ่าน fable-medium review 3/29): `prompt-injection`, `secrets-audit`, `dependency-audit` — ข้าม `threat-modeling` (borderline, ไม่ได้ลง) และอีก 25 ตัวที่สมมติว่ามีทีม/compliance obligation ที่ผู้ใช้ไม่มี
- **marketingskills** (`coreyhaines31/marketingskills`, ผ่าน fable-medium review 12/46): `product-marketing`, `launch`, `copywriting`, `copy-editing`, `social`, `community-marketing`, `content-strategy`, `image`, `marketing-ideas`, `marketing-psychology`, `pricing`, `marketing-council` — คัดสำหรับ indie game dev ที่ยังไม่มี live SaaS/ad budget (ข้าม 34 ตัวที่สมมติ funnel/paid-ads/B2B sales infra)

---

## Identification notes (ไม่ใช่ skill, ระบุตัวตนเทียบ trendshift.io 2026-08-08)

- **`NousResearch/hermes-agent`** (227k★) — น่าจะเป็นตัว `hermes.exe` CLI ที่ `jarvis_hermes_unified.py`
  (ใน `C:\Users\<YOUR_USERNAME>\Downloads\EP.6 - Hermes Integrations\`) เรียกใช้งาน. Reference เท่านั้น ไม่ได้ลง.
- **`openclaw/openclaw`** (385k★) — ตรงกับ "OpenClaw" infra ที่พูดถึงในเอกสารคอร์สเดียวกัน. Reference เท่านั้น ไม่ได้ลง.
- **`affaan-m/ECC`** vs `affaan-m/everything-claude-code`** — **repo เดียวกัน**, GitHub เปลี่ยนชื่อ (`gh repo view`
  ทั้งสองชื่อ resolve ไปที่ owner ID/URL/description เดียวกัน). `sources.json`'s `git_plugins.ecc` ยังชี้
  `everything-claude-code.git` (ใช้ได้ผ่าน redirect) — ไม่จำเป็นต้องแก้ แต่ชื่อปัจจุบันคือ `ECC`.

---

## วิธีลงสกิลเพิ่ม

1. **Plugin marketplace** (มี marketplace.json): `/plugin marketplace add <owner/repo>` + `/plugin install <plugin>@<marketplace>`
2. **Single-plugin repo** (มี plugin.json): clone ไป `~/.claude/external-skills/<name>/` แล้ว copy folder skill ไป `~/.claude/skills/`
3. **Standalone SKILL.md**: วาง `~/.claude/skills/<name>/SKILL.md` ตรง ๆ

**หลังลง:** Claude Code โหลด skill อัตโนมัติ ไม่ต้อง restart — แล้วเพิ่ม entry ในไฟล์นี้
