# graphify
- **graphify** (`~/.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, invoke the Skill tool with `skill: "graphify"` before doing anything else.

# Cost-aware model routing — Opus 5 / Sonnet 5 / Haiku 4.5 (global)
ให้เลือกโมเดลตามความยากจริงของงาน เพื่อไม่ให้งานง่ายไปกินค่าโมเดลแพง

**หมายเหตุ:** `fable-medium` (Fable 5 ที่ **medium reasoning** พอ ไม่ต้อง max) เปิด spawn ได้ตามปกติสำหรับงานเดิมพันสูง — ถ้าโดนแบนจะรู้เองตอน spawn fail ไม่ต้องเช็ควันที่ล่วงหน้า

**ราคา (ต่อ 1M tokens, input/output):** Opus 5 `$5/$25` (แพงสุด) · Sonnet 5 `$3/$15` (โปรเปิดตัว `$2/$10` ถึง 31 ส.ค. 2026) · Haiku 4.5 `$1/$5` (ถูกสุด). การประหยัด = "ดึงงานออกจากโมเดลแพง" ไม่ใช่ "เอาโมเดลแพงมาช่วย"

**ข้อจำกัดจริง:** main loop เปลี่ยนโมเดลเองกลางเซสชันไม่ได้ (เปลี่ยนได้แค่ `/model` แล้วพัง cache). การ "สลับโมเดลไปมา" ทำผ่าน **subagent ที่ล็อกคนละโมเดล** — main อยู่ตัวเดียว แล้วโยนงานไปคนละ agent

**โมเดลที่เลือก: main loop = Sonnet 5 เป็น "หัวหน้างาน/orchestrator" (default ตัวคุยหลัก)** (ตัดสินใจ+วางแผน+ตรวจงาน+แก้เองตอนลูกน้องเจ๊ง). Sonnet 5 คุณภาพใกล้ Opus ในงานโค้ด/agentic แล้ว + ถูกกว่า → เป็นหัวหน้าคุ้มกว่า Opus. ประหยัดได้ **เฉพาะตอนหัวหน้าไม่ลงมือทำงานหยาบเอง** — กับดักคืออ่าน 20 ไฟล์เอง/แก้ทีละบรรทัดเอง = งานที่ Haiku ทำได้

**หัวหน้า (Sonnet 5 main) ทำเอง:** วางแผน, ตัดสินใจ, อ่าน *ข้อสรุป* จากลูกน้อง, ตรวจงาน, เขียนส่วนยาก/แก้ตอนลูกน้องไม่ไหว. **กฎเหล็ก:** อ่าน conclusion ไม่ใช่ file-dump — ให้ลูกน้องย่อยมา ไม่งั้น context บวม=แพง

**escalate ขึ้น Opus เฉพาะงานยากจริง/เดิมพันสูง:** algorithm ลึก, debug ซับซ้อน, architecture, correctness สำคัญ, หรือตอน Sonnet 5 main ทำแล้วได้คำตอบผิด/สั่นคลอน → spawn `opus` subagent เอาเฉพาะจุด (แยก context) หรือ `/model` สลับเป็น Opus ชั่วคราว

**ลูกน้อง = `Agent` subagent (foreground เป็นหลัก):** สั่ง→รอ→ตรวจ→ไม่ไหวหัวหน้าทำเอง. เปิด `run_in_background` เฉพาะตอนยิงหลายตัว **ขนานกัน** (เช่นรีวิว 3 มุมพร้อมกัน). บันไดเลือก agentType:
- งานกลไก/batch (rename, format, find-replace, scaffold) → **`haiku-batch`** (Haiku 4.5)
- อ่านไฟล์เยอะแล้วคืน map/ข้อสรุป → **`Explore`** (อ่าน excerpt ไม่ dump)
- งานมาตรฐาน/ร่างแรก (coding, review รายภาษา) → **ทำใน main (Sonnet 5) เอง** หรือ spawn `Sonnet` subagent (`model: sonnet`) ถ้าอยากแยก context / ยิงขนาน
- งานยาก/เดิมพันสูง (algorithm, debug ลึก, architecture) → spawn **`opus`** subagent (claude-opus-5) หรือ `/model` สลับ Opus ชั่วคราว (Sonnet 5 main สู้ไม่ไหวค่อยขึ้น)
- **สุดบันได = `fable-medium` (Fable 5 @ medium effort, แพงสุด) — gate ก่อนเรียก:** เรียกเฉพาะเมื่อ **Opus ด่านก่อนหน้าตอบผิด/สั่นคลอนแล้ว** (ไม่ใช่ข้าม Opus มาเรียกตรง) กับงาน architecture-เดิมพันสูง / algorithm-concurrency หิน / debug หลายเงื่อนไข / correctness proof. ใช้ **medium reasoning พอ** — ไม่ต้อง max เพื่อคุมค่าใช้จ่าย. **ข้าม** ถ้า: บั๊กชัดอ่านโค้ดก็เจอ, งาน format/rename, หรือ Opus ยังไม่ได้ลอง. **บรีฟ <400 คำ**: เป้าหมาย+ข้อจำกัด+พาธไฟล์+ลองอะไรไปแล้ว+เกณฑ์รับ+คำถามที่อยากให้ตอบ (อย่ายกทั้งแชต). Fable คืน**แผน/diff เป็นข้อความ** แล้ว orchestrator ลงมือเอง (advisor-only). ติดตรงไหนใช้ SendMessage คุยต่อ agent เดิม อย่า spawn ใหม่วนไปมา

**กติกาบังคับ:**
1. **ก่อน spawn ประกาศก่อน:** `🧠 spawn <agentType> → <งาน> (เพราะ <เหตุผล>)` ผู้ใช้ค้านได้ก่อนเสียเงิน
2. subagent ต้องได้ **context สดเฉพาะโจทย์** (ไม่ลากทั้งแชต) + สั่งให้ **คืนแค่ข้อสรุป**
3. งานเล็ก/ตอบสั้น/แก้ inline เร็วๆ → ทำใน main เลย ไม่ต้อง spawn (spawn มี overhead)
4. `spawn_task` (chip) = **คนละเรื่อง** — เปิด session ใหม่ บิลแยก หัวหน้าคุมสด/ตรวจไม่ได้ → ใช้เฉพาะโยนงานหนักทิ้งไปบิลที่อื่น ไม่ใช่ "ลูกน้อง" ในโมเดลนี้

Agent ที่ pin โมเดลไว้แล้ว: `~/.claude/agents/haiku-batch.md` (Haiku 4.5), `~/.claude/agents/opus.md` (claude-opus-5), `~/.claude/agents/fable-medium.md` (claude-fable-5 @ medium reasoning — เฉพาะงานยาก/เดิมพันสูงจริงๆ เท่านั้น เพราะแพงสุด; ใช้ medium effort พอ ไม่ต้อง max)

**Local Ollama (free, ad hoc — ไม่ใช่ routing tier, ต่ำกว่า Haiku):** มี `qwen2.5:7b-instruct` บนเครื่อง (no tools, no repo context) เรียกผ่าน Bash: `Get-Content <file> | ollama run qwen2.5:7b-instruct "<instruction>"` (pipe ไฟล์ อย่ายัด prompt ยาวใน argument). ใช้เฉพาะ lossy pre-compression ของ text ก้อนใหญ่ low-stakes (log/doc ยาว) ก่อนเข้า context โมเดลเสียเงิน — **ห้ามใช้ output เป็น source of truth**: ถ้า decision ขึ้นกับเนื้อหา ให้โมเดลหลักอ่านต้นฉบับเอง.

# Offload heavy execution to a spawned session (global, cost-saving)
- เมื่อมีงาน **execute ที่หนัก/ยาว** (รันแผน implementation, refactor หลายไฟล์, batch งานใหญ่) **และ** ปล่อยเป็น session แยกได้ (มี `spawn_task` / chip → worktree+branch แยก) → ให้ **สร้าง spawn_task chip เป็น default ทันที โดยไม่ต้องถามก่อน** โดยเฉพาะเมื่อ session ปัจจุบัน cost สูงแล้ว
- เหตุผล: งานไป **บิลในเซสชันใหม่** ไม่ใช่เซสชันแพงปัจจุบัน + worktree แยกไม่กวนงานปัจจุบัน
- prompt ในชิป **ต้อง self-contained** (session ใหม่ไม่มีความจำแชต): ชี้ไฟล์แผน/พาธ + commit hash + ลำดับงาน + จุดสำคัญให้ครบ. ถ้าแผน/ไฟล์ยัง untracked ให้ **commit ก่อน** ปล่อยชิป (worktree ใหม่มองไม่เห็น untracked)
- ข้อจำกัดบอกตามจริง: ชิป **ยังต้องให้ user กด 1 ที** ถึงเปิด session ใหม่ — Claude เปิดเองอัตโนมัติไม่ได้ (ข้อจำกัด harness). แต่ "ไม่ต้องขออนุญาตก่อน *สร้าง* ชิป" ตามที่ user สั่ง
- งานเล็ก/ตอบสั้น/แก้ inline เร็ว ๆ → ทำในเซสชันนี้ตามปกติ ไม่ต้องปล่อยชิป

## เมื่อ spawn_task ลูกเสร็จ — ต้อง act จริง ห้ามรับทราบเงียบ ๆ (บัญญัติ 2026-08-10)
harness auto-notify session แม่เองอยู่แล้วเมื่อ `spawn_task` chip ที่ปล่อยไปทำงานเสร็จ (ไม่ต้องสั่ง child ให้ `send_message` กลับเพิ่ม — กลไกนี้ทำงานถูกอยู่แล้ว, child ก็ไม่รู้ session id ของแม่ด้วยซ้ำ)

**ปัญหาจริงที่เจอ:** notification มาถึงแม่แล้ว แต่แม่แค่ "รับทราบ" ในใจ ไม่ได้ทำอะไรต่อ — user ต้องมาถามเองว่าลูกเสร็จหรือยัง

**กฎ:** พอ task-notification ของ spawn_task เข้ามาในเทิร์นไหน **ต้อง surface ให้ user เห็นเป็น action จริงในเทิร์นนั้นทันที** ไม่ใช่แค่รับรู้เฉย ๆ แล้วรอ user ถาม:
1. อ่านผลลัพธ์จริงของ session ลูก (เช่นผ่าน `mcp__ccd_session_mgmt__get_session`/`list_events` หรือ session summary ที่แนบมากับ notification)
2. สรุปสั้น ๆ ให้ user: ลูกทำอะไรเสร็จ, ผลเป็นยังไง, พังตรงไหนไหม
3. ถ้ามีอะไรต้องตัดสินใจต่อ (เช่น review diff, merge branch, commit ที่ค้างอยู่ใน worktree ของ session ลูก) ให้เสนอ/ถามทันที — อย่าปล่อยให้ค้างเงียบ ๆ

# Planning: declare your default planner here (global)
- เมื่อต้องเขียน implementation plan (หลัง brainstorm/spec approve) ให้ route ไปที่ planner ตัวเดียวเป็น default เสมอ — อย่าปล่อยให้สุ่มเลือกทุก session
- เจ้าของ setup นี้ใช้ wrapper skill ส่วนตัว (ไม่ได้แถมมาในเทมเพลตนี้) ต่อยอดจาก `superpowers:writing-plans` — ถ้าลง plugin superpowers ไว้ `superpowers:writing-plans` ใช้เป็น baseline ได้เลย ถ้าจะสร้าง/adopt planner ของตัวเอง ให้มาเขียนชื่อ skill ไว้ตรงนี้แทน

# Persist glossary after grilling/brainstorm (global)
- จบ session `grilling` / `brainstorming` (หรือทุกครั้งที่คุยจนตกลงนิยามศัพท์/ข้อตกลงร่วมกัน) → ถ้ามี **ศัพท์เฉพาะหรือข้อตกลงที่ขัดกับความเข้าใจทั่วไป** (คำเดียวความหมายต่างจากที่คนนอกวงจะเดา เช่น "platform", "quest", "layer") ให้ **เซฟลง memory เป็น type `reference` (glossary) ทันที** โดยไม่ต้องรอให้ user สั่ง
- เหตุผล: ปิด gap "ศัพท์ลอยอยู่ในแชตแล้วเซสชันหน้าลืม" — ได้ glossary ถาวร + ภาษากลาง/ubiquitous language โดยใช้ระบบ memory ที่มีอยู่ ไม่สร้างไฟล์ context คู่ขนาน
- **ศัพท์ผูกกับ project เดียว** → memory (type reference) ของ project นั้นเป็นแหล่งความจริงเดียว — ห้ามแตก CONTEXT.md แยกซ้ำ. **ศัพท์ข้าม project จริงๆ** (ใช้ร่วมหลาย repo) → เก็บที่ `<YOUR_VAULT_PATH>\notes\` แทน (ดูหัวข้อ "Second brain vault" ด้านล่าง), memory ของ project ที่อ้างถึงศัพท์นั้นแค่ link กลับมา ไม่ copy เนื้อหา. 1 ศัพท์มีเจ้าของที่เดียวเท่านั้น
- 1 ศัพท์/ไฟล์ + เพิ่มบรรทัด pointer ใน MEMORY.md (กรณี project-specific) ตามปกติ
- ก่อนเซฟเช็คก่อนว่ามี glossary entry เดิมครอบคลุมอยู่แล้วไหม (ทั้งใน memory และใน `<YOUR_VAULT_PATH>\notes\`) → ถ้ามีให้ update ไฟล์เดิม ไม่สร้างซ้ำ

# คำสั่งจำ: "จำ" = local, "บัญญัติ" = global (ตกลงกัน 2026-08-09)
- **"จำ" / "จดจำ"** (default, ไม่ต้องพูดอะไรเพิ่ม) → เซฟลง **auto-memory ของ project ปัจจุบันเท่านั้น** (`~/.claude/projects/<project>/memory/`) ตาม type ที่เหมาะสม (user/feedback/project/reference) — พฤติกรรมเดิมที่ใช้อยู่แล้ว ไม่เปลี่ยน
- **"บัญญัติ"** → หมายถึงกฎ/พฤติกรรมที่ต้องใช้ **ทุกโปรเจกต์ ทุก session** → เขียนตรงลง `~/.claude/CLAUDE.md` นี้เลย (เพิ่ม section ใหม่หรือแก้ section เดิมที่เกี่ยวข้อง) ไม่ใช่แค่ auto-memory เพราะ auto-memory ผูกกับ project ปัจจุบันเสมอ ข้ามไปโปรเจกต์อื่นจะมองไม่เห็น
- เหตุผลที่แยก: auto-memory system ที่มีอยู่ผูกกับ project โดยโครงสร้าง (path มีชื่อ project อยู่ในตัว) — ไม่มีทาง "จำข้ามทุกโปรเจกต์" ผ่าน auto-memory ได้ ต้องเขียน CLAUDE.md ตรงๆ เท่านั้นถึงจะข้ามโปรเจกต์จริง
- ถ้าไม่แน่ใจว่า user หมายถึง local หรือ global (เช่นพูดคำว่า "จำ" แต่เนื้อหาฟังดูเป็นกฎข้ามโปรเจกต์ชัดๆ) → ถามให้ชัดก่อนเซฟ อย่าเดา

# Second brain vault — <YOUR_VAULT_PATH> (global)
Obsidian vault ส่วนตัว เก็บเฉพาะสิ่งที่ **ไม่ผูกกับ repo ใด repo หนึ่งเลย** — ความรู้ข้าม project (Ren'Py patterns, Python idioms ทั่วไป ฯลฯ), web clippings, และ scratch thinking ก่อนตกผลึกเป็น decision จริง

**เส้นแบ่งเดียว (ใช้ตัดสินทันที):** "ผูกกับ repo ใด repo หนึ่งไหม?"
- ผูก repo → อยู่ในระบบของ repo นั้นเสมอ: decision → `docs/adr/`, session → `docs/log/`, ทำไม → docs ของ repo, fact ที่อยากจำข้าม session → memory ของ project นั้น
- ไม่ผูก repo ไหนเลย → `<YOUR_VAULT_PATH>\`

**โครง:** `inbox/` (ทุกอย่างลงตรงนี้ก่อน) · `notes/` (คัดจาก inbox แล้ว, ถาวร) · `clippings/` (web clip) · `projects/<name>/` (scratch คิดเรื่อง project นั้นๆ **ก่อน** ตกผลึก)

**กฎบังคับ:**
1. **Promote-to-ADR**: ถ้า scratch ใน `projects/<name>/` กลายเป็น decision จริงที่กระทบโค้ด → ต้อง promote เป็น ADR/log ของ repo นั้นทันที แล้วเหลือแค่ pointer ใน vault ห้ามปล่อยค้างเป็น scratch (ไม่งั้น decision หลุด git หาไม่เจอ session หน้า)
2. ห้ามลงเรื่องที่อ้าง path/ไฟล์/decision ของ repo ใด repo หนึ่งลง vault — ต้องอยู่ใน repo นั้น
3. vault **ไม่มี** auto-lint/`just check`/auto-link — manual ล้วน อย่าคาดว่ามีระบบตรวจอัตโนมัติ
4. Integration: เขียน `.md` ตรงๆ ลง vault folder ผ่าน Read/Write/Edit ปกติ ไม่ต้องพึ่ง MCP server — มี skill `obsidian-markdown`/`obsidian-bases`/`json-canvas`/`obsidian-cli`/`defuddle` ติดตั้งไว้ที่ `<YOUR_VAULT_PATH>\.claude\skills\` แล้ว (จาก kepano/obsidian-skills) ใช้ตอนแก้ไฟล์ `.md`/`.base`/`.canvas` ในนี้

# Git safety hook — global PreToolUse gate on destructive git (บัญญัติ 2026-08-09)
ตั้งแต่ 2026-06-27 มี **global PreToolUse(Bash) hook** ใน `~/.claude/settings.json` ที่ดักคำสั่ง git เสี่ยงก่อนรัน ใน**ทุก session ทุก project**. อัปเดต 2026-07-02: เปลี่ยนจาก hard-block (exit 2) → **ถาม user ก่อน** ผ่าน PreToolUse `ask` decision (JSON `hookSpecificOutput.permissionDecision:"ask"` บน stdout, exit 0). ผู้ใช้กด Allow → คำสั่งรัน, Deny → บอก Claude ว่าไม่.

คำสั่งที่ gate: `git push` (ทุกแบบ; `--force`/`--force-with-lease` ติดป้ายชัด), `git reset --hard`, `git clean -f*`, `git branch -D`, `git checkout .`, `git restore .`.

- Hook script: `~/.claude/hooks/block-dangerous-git.py` (Python stdlib, เรียกผ่าน `py` launcher — **ไม่ใช่** jq/bash เพราะเครื่องนี้**ไม่มี jq**). parse JSON จริง + fallback raw-scan กัน silent-bypass.
- ดัดแปลงจาก git-guardrails hook ของ utarn/engineer-skills แต่ rewrite เป็น Python stdlib (ต้นฉบับเป็น .sh jq-based ใช้ไม่ได้บนเครื่องที่ไม่มี jq)
- โหลดตอน session start เท่านั้น — แก้ `settings.json` แล้วต้อง restart session ถึง active (แก้เฉพาะ .py ไม่ต้อง restart เพราะ hook อ่านไฟล์สดตอนรัน)

# Bash tool vs PowerShell tool — never mix heredoc syntax (บัญญัติ 2026-08-09)
เครื่องนี้มีสองเชลล์คนละ syntax: **Bash tool = POSIX sh**, **PowerShell tool = `@'...'@` here-string**. ห้ามใช้ PowerShell here-string `@'...'@` ใน Bash tool — Bash จะตีความ `@` แบบ literal แล้วรั่วเข้าไปใน output จริง (เคยเกิด: `git commit` subject กลายเป็น `@` + ข้อความจริง ต้อง --amend แก้).

**วิธีทำ multi-line string ให้ถูกเชลล์:**
- Bash tool → ใช้ heredoc จริง `command <<'EOF' ... EOF` หรือเขียนลงไฟล์แล้ว pass `-F file` / `--file`
- PowerShell tool → ใช้ `@'...'@` ได้ตามปกติ (ห้ามสลับข้าม)
- git commit message ที่มี multi-line/ภาษาไทย → ปลอดภัยสุดคือ `git commit -F <file>` หลังเขียนข้อความด้วย Write tool ก่อน

# "จดลงสมุดสกิล" = update sources.json (บัญญัติ 2026-08-09)
เมื่อ user พูดว่า **"จดลงสมุดสกิล"** หมายถึง**เฉพาะเจาะจง**: update `~/.claude/tools/skill-update-check/sources.json` — ไม่ใช่แค่ `~/.claude/SKILLS_INDEX.md` หรือ project ledger ไฟล์ใดๆ (เช่น `FULL-LEDGER.md`). อัปเดตแค่ index/ledger ที่มนุษย์อ่านแล้วข้าม sources.json ไม่นับว่า "จดลงสมุดสกิล" user จะแก้ให้ทำใหม่.

**ทำไม:** `sources.json` เป็น manifest ที่ `check.ps1` (ตัวเช็ค update รายสัปดาห์) อ่าน ถ้า skill/tool ที่เพิ่ง adopt ไม่ถูกบันทึกที่นี่ มันจะหลุดออกนอกระบบ tracking ตลอดไป — คือปัญหาที่ระบบนี้มีไว้ป้องกันพอดี SKILLS_INDEX.md/ledger คือให้คนอ่าน sources.json คือ source of truth ที่ automation อ่านจริง

**วิธีใช้:**
- ทุกครั้งที่ skill/pip package/tool ใหม่ถูก adopt แล้วกำลังจะ "เขียนสรุป" ให้เพิ่ม/อัปเดต entry ใน `sources.json` เป็นส่วนหนึ่งของงานนั้นเสมอ ไม่ใช่ทางเลือก
- Manifest มี categories: `personal_skills` (skill folder ใต้ `~/.claude/skills/` มี tracked subpath + baseline commit), `pip_packages` (dist name + source repo), `npm_packages`, `binary_tools` (สำหรับ standalone CLI tool ที่ไม่ใช่ Claude Code skill เช่น witr, opencode, magnitude, pi, ifixai) — เลือก category ให้ถูก อย่ายัดทุกอย่างเข้า personal_skills
- ต้อง honest ใน note field ว่า check.ps1 เช็คอัตโนมัติจริงไหม — `npm_packages`/`binary_tools` ยังไม่มี automated check.ps1 logic (มีแค่ git/pip ที่ automated) ต้องเขียนว่า "update manually" ไม่ใช่บอกเป็นนัยว่า auto-track
- ถ้ามี category ใหม่จริงๆที่ไม่เข้า personal_skills/pip_packages เพิ่ม top-level array ใหม่ได้เลย (บรรทัดฐาน: npm_packages, binary_tools)

# Cross-session "send message" vs spawn_task vs SendMessage (บัญญัติ 2026-08-09)
User เรียก `mcp__ccd_session_mgmt__send_message` สั้นๆว่า **"send message"** — แยกให้ชัดจาก 2 tool ที่ชื่อคล้ายกัน:
- **`mcp__ccd_session_mgmt__send_message`** ("send message") — ส่งข้อความไปยัง **CCD session อื่นที่มีอยู่แล้ว** (หาได้ผ่าน `mcp__ccd_session_mgmt__list_sessions`) ข้อความไปโผล่เป็น user turn ใน session ปลายทาง มีป้าย "From {ชื่อ session นี้}" ไม่สร้างอะไรใหม่ ใช้ตอน handoff context/relay finding ข้าม session. **ใช้ไม่ได้ใน unattended session** (scheduled-task runs, remote-dispatched)
- **`spawn_task`** (chip) — สร้าง **session ใหม่ทั้งหมด** สำหรับงานนอกสโคปที่เจอระหว่างทาง ต้องให้ user กด chip ถึงเปิดจริง prompt ต้อง self-contained บิลแยกจากปัจจุบัน
- **`SendMessage`** (top-level tool, ไม่มี `mcp__` prefix) — ส่งข้อความหา **subagent/teammate ที่ spawn ใน session เดียวกัน** (เช่นผ่าน Agent tool) ไม่ใช่ CCD session แยก

หมายเหตุ: นี่คือ harness-level เทียบเท่า cross-session messaging ของ Claude Code CLI (v2.1.224+, macOS/Linux หรือ WSL2 เท่านั้น) — แต่ tool ตัวนี้ทำงานบน Windows ได้โดยไม่ต้อง WSL2

# Skills Index (global reference)
ดัชนีรวมศูนย์ skill ทุกตัวที่ user ลงไว้ (built-in / superpowers / ecc / ui-ux-pro-max / pordee / lazyweb / karpathy / anthropic-skills) พร้อม "ตอนไหนใช้อะไร" cheatsheet:
- File: `~/.claude/SKILLS_INDEX.md`
- ใช้ตอน: ก่อนเริ่มงานใด ๆ ให้เปิดอ่านเช็คว่ามี skill ที่ตรงงานไหม (ประหยัด token + ได้ workflow ที่ user vetted แล้ว)
- เมื่อมีการลง/ถอด skill ใหม่ ให้ update ไฟล์นี้ด้วย


# Installed Plugins (enabled in ~/.claude/settings.json)

These plugins are installed and ENABLED — their skills/commands/agents/MCP tools are available. Do NOT tell the user they need to install them.

- **superpowers** v6.2.0 (obra/superpowers) — 14 skills: brainstorming, writing-plans, executing-plans, test-driven-development, systematic-debugging, requesting-code-review, receiving-code-review, subagent-driven-development, dispatching-parallel-agents, verification-before-completion, using-git-worktrees, finishing-a-development-branch, writing-skills, using-superpowers. Trigger via `/plan`, `/brainstorm`, etc. (updated 2026-08-08 from v5.1.0, 240 commits)
- **ecc** v2.2.0 (affaan-m/ECC — repo renamed from `everything-claude-code`, same repo) — 67 agents, 284 skills, 94 commands. Agents include: planner, architect, tdd-guide, code-reviewer, security-reviewer, build-error-resolver, refactor-cleaner, doc-updater, e2e-runner, code-explorer, code-architect, plus language reviewers (typescript, python, go, rust, java, kotlin, swift, csharp, fsharp, cpp, django, fastapi, flutter, dart). Commands: /feature-dev, /code-review, /build-fix, /checkpoint, /evolve, /hookify, etc. MCP servers (prefixed `plugin_ecc_`): context7, github, memory, playwright, sequential-thinking. (updated 2026-08-08 from v2.0.0-rc.1, 533 commits; note: `claude plugin update` ships new versions as non-git release-archive extracts, not `git pull` — the weekly `check.ps1` checker only understands `.git`-backed caches, so it will keep reporting this plugin as "behind" until the stale `2.0.0-rc.1` cache dir is manually removed — see SKILLS_INDEX.md "เครื่องมืออ้างอิง" section)
- **pordee** (kerlos/pordee), **lazyweb** (aboul3ata/lazyweb-skill), **andrej-karpathy-skills** (forrestchang/andrej-karpathy-skills) — also enabled.

Install paths: `~/.claude/plugins/cache/<marketplace>/<plugin>/<version>/`. Enabled-state manifest: `~/.claude/settings.json` -> `enabledPlugins`.

Note: ECC ships a GateGuard hook (`pre:edit-write:gateguard-fact-force`) that demands a "fact-forcing" preamble before edits to certain files. To disable for setup/repair: set `ECC_GATEGUARD=off` or add the hook name to `ECC_DISABLED_HOOKS`.


# Auto-compact awareness — เตือน/ขอ compact เองเมื่อเปลือง token (บัญญัติ 2026-08-09)
Claude ต้อง **เฝ้าดูขนาด context ของตัวเองตลอดเวลา** และเป็นฝ่ายเสนอ compact เอง ไม่ใช่รอ user สังเกตว่าแชตยาวแล้ว

**ข้อจำกัดที่ต้องพูดตรง ๆ (ห้ามแกล้งทำเหมือนทำได้):**
- Claude **รัน `/compact` เองไม่ได้** — เป็น CLI slash command ที่ user ต้องพิมพ์เอง (ไม่ใช่ tool)
- **hook ก็ trigger compact ไม่ได้** — PreToolUse/PostToolUse hook ทำได้แค่ block/ask/inject text ไม่มี hook event ไหนสั่ง compact ได้ (`SessionStart` matcher `compact` คือ hook ที่ *ทำงานหลัง* compact จบ ไม่ใช่ตัวสั่ง)
- ที่ทำได้จริงคือ **auto-compact ในตัว harness** (ทำงานเองตอนใกล้เต็ม context) + **Claude เตือน user ให้กด compact ก่อนถึงจุดนั้น**

**ทริกเกอร์ให้เสนอ compact (เช็คทุกครั้งก่อนเริ่มงานก้อนใหม่):**
1. **เพดานเด็ดขาด: context แตะ ~200k token → เตือนทันที, แตะ ~300k → เตือนแรงและยืนยันว่าควร compact ก่อนทำอะไรต่อ** (ตัวเลขนี้ user กำหนดเอง มาก่อนเกณฑ์ % เสมอ — ถึงเลขนี้ต้องเตือนแม้ window จะยังไม่ใกล้เต็ม). ถ้ารู้ % ด้วยก็ใช้ ~60% ของ window เป็นตัวเสริม → บอก user 1 บรรทัดว่า "context ~Xk แล้ว แนะนำ `/compact` ก่อนเริ่มงานถัดไป"
2. เพิ่งอ่านไฟล์ก้อนใหญ่/log ยาว/tool output มหาศาลไปหลายรอบ แล้วงานนั้น **จบแล้ว** → เสนอ compact ทันที (เนื้อดิบไม่ต้องอยู่ต่อ)
3. กำลังจะเริ่ม **งานใหม่ที่ไม่เกี่ยวกับงานเดิม** ในแชตเดิม → เสนอ compact ก่อนเริ่ม (เปลี่ยนหัวข้อ = จุดตัดที่ compact เสียหายน้อยสุด)
4. งาน execute หนัก/ยาวที่กำลังจะเริ่ม → ตามบัญญัติ "Offload heavy execution" ให้ปล่อย `spawn_task` chip แทนการทำต่อในแชตที่บวมแล้ว

**เสนอยังไง:** สั้น 1–2 บรรทัด + บอกว่าจะ compact แล้วทำอะไรต่อ อย่าถามซ้ำถ้า user เพิ่งปฏิเสธไปในเทิร์นก่อน ๆ (ถามซ้ำ = น่ารำคาญ + เปลือง token เอง)

**ป้องกันดีกว่าแก้ — ลด token ก่อนถึงจุดต้อง compact:**
- อย่า dump ไฟล์ทั้งไฟล์เข้า context ถ้าต้องการแค่ข้อสรุป → ใช้ `Explore`/subagent ย่อยมา (ตามบัญญัติ cost-aware routing)
- อย่าอ่านไฟล์เดิมซ้ำเพื่อ "เช็คว่าแก้ติดไหม" — Edit/Write มัน error เองถ้าพลาด
- log/doc ยาว low-stakes → pre-compress ด้วย ollama ก่อนเข้า context
