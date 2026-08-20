**[English](README.md)** | ภาษาไทย

# Claude Code Clone Template

สแนปช็อตพกพาของ Claude Code setup ของคนคนหนึ่ง — global instructions, กฎการทำงาน, **สกิลคัดสรร 45 ตัว** (เขียนเอง 7 ตัว — เขียนจากศูนย์ 3 ตัว, wrapper ที่เขียนเองรอบเครื่องมือ third-party 4 ตัว — ดัดแปลงจาก upstream skill 1 ตัว ที่เหลือ adopt มาจาก upstream repo ทั้งหมด มี provenance รายสกิลอยู่ใน `sources.json`), ตัวอย่าง memory จริง, manifest แหล่งที่มาของสกิล, และ knowledge vault ข้ามโปรเจกต์ — แพ็กไว้ให้ Claude Code เครื่องใหม่ (หรือคนที่กำลังตั้งเครื่องใหม่) bootstrap นิสัยการทำงานและความสามารถชุดเดียวกันได้บนเครื่องอื่น นี่คือ **template ให้เอาไปปรับ ไม่ใช่ config ที่รันได้ทันที**: ข้อมูลระบุตัวตนถูกลบออกและแทนที่ด้วย placeholder แล้ว และหลายส่วนจะมีความหมายก็ต่อเมื่อคุณติดตั้งเครื่องมือที่มันอ้างถึงด้วย

## เริ่มต้นใช้งาน (quickstart)

**ทางลัด:** clone repo นี้ เปิดใน Claude Code แล้วรัน `/adopt` — มันจะสัมภาษณ์คุณ (อยากได้ส่วนเสริมไหนบ้าง, list plugin, path ปลายทาง) แล้วทำขั้นตอน 2-6 และ 8-9 ด้านล่างให้เอง พร้อม tick progress ลงไฟล์ journal ที่ resume ได้ระหว่างทาง ขั้นตอน 7 (ติดตั้งตัว plugin ecosystem เอง) จงใจไม่รวมอยู่ใน `/adopt` — อันนั้นต้องทำเอง ขั้นตอนด้านล่างคือสิ่งที่ `/adopt` ทำอัตโนมัติให้ และมีไว้สำหรับคนที่อยากทำมือเองหรืออยากรีวิวก่อนว่าอะไรจะเปลี่ยนบ้างก่อนรันจริง

1. **Clone repo** ไปที่ไหนก็ได้บนเครื่องปลายทาง
2. **ตัดสินใจส่วนเสริมที่เป็นทางเลือกตอนนี้เลย** — ตอบใช่/ไม่ใช่ เพราะมันกำหนดว่าขั้นตอน 5 จะลบอะไรบ้าง: Local AI (Ollama) pre-compression ดูรายละเอียดที่หัวข้อ "Optional: ___" ด้านล่าง
3. **Copy `global-config/CLAUDE.md`, `agents/*.md`, `hooks/block-dangerous-git.py`, `skills/*`, และ `tools/`** ไปที่ `~/.claude/` ของตัวเอง (จะ merge หรือแทนที่ก็แล้วแต่) พวกนี้คือสิ่งที่ทำให้กฎ routing, git safety gate, catalog สกิล, และตัวเช็ค update ทำงานได้จริง ไม่ใช่แค่ข้อความเฉยๆ **ก่อน copy `CLAUDE.md` ให้เขียนส่วน "Installed Plugins" ใหม่ให้เหลือแค่ที่คุณติดตั้งจริง** — ต้นฉบับอ้างว่ามี plugin เฉพาะเจ้าของเดิมติดตั้งอยู่ ถ้า copy ไปทั้งดุ้น Claude ของคุณจะโกหกเรื่อง tooling ที่มีจริง
4. **Merge `global-config/settings.example.json`** เข้ากับ `~/.claude/settings.json` ของตัวเอง (แทนที่ `<YOUR_HOME>` ก่อน; บน macOS/Linux ให้เปลี่ยน launcher `py` ในคำสั่ง hook เป็น `python3` ด้วย เพราะตัวที่ให้มาเจาะจงสำหรับ Windows)
5. **ลบ Ollama ถ้าตอบ "ไม่" ในขั้นตอน 2** วิธีเร็วสุด: ย่อหน้า Ollama ใน CLAUDE.md ที่ copy มา + `notes/local-ollama-models.md` + `tools/ollama/`
6. **Find-and-replace placeholder** ทุกตัวในไฟล์ที่เก็บไว้ — ดูรายการเต็มที่ขั้นตอน 8 ของหัวข้อ "วิธี adopt" ด้านล่าง
7. **ติดตั้ง plugin ecosystem ที่อ้างถึง** (superpowers, ecc ฯลฯ) — ดูหัวข้อ "สิ่งที่ต้องติดตั้งเพิ่มเอง" ด้านล่าง
8. **จะ copy `notes/`** ไปไว้ใน second-brain vault ของตัวเองก็ได้ และ **`memory-examples/`** ไปไว้ในโฟลเดอร์ auto-memory ของ Claude Code สำหรับโปรเจกต์ที่เกี่ยวข้อง
9. **เปิด session Claude Code แล้วตรวจสอบ** ว่ามันอ่าน CLAUDE.md ใหม่แล้วจริง เช่น ลองขอแผน implementation แล้วดูว่ามันเรียก `/plan-pro` ไหม หรือถามเรื่อง model routing แล้วดูว่ามัน cost ladder กลับมาไหม

ส่วนที่เหลือของ README นี้อธิบายแต่ละส่วนแบบละเอียด

## มีอะไรอยู่ในนี้

```
claude-clone-template/
├── README.md
├── LICENSE                                # MIT license สำหรับเนื้อหาของ repo นี้เอง
├── ATTRIBUTION.md                         # เครดิตให้ upstream repo ที่สกิล third-party ถูก adopt มา
├── .claude/commands/adopt.md              # รัน `/adopt` ใน repo นี้เพื่อสัมภาษณ์ + apply ขั้นตอนด้านล่างให้อัตโนมัติ
├── global-config/
│   ├── CLAUDE.md                          # ไฟล์ instruction หลัก (เทียบเท่า ~/.claude/CLAUDE.md)
│   ├── settings.example.json              # ~/.claude/settings.json ที่ถูก sanitize แล้ว — hooks, plugin, model default
│   ├── agents/                            # นิยาม subagent 3 ตัวที่ pin model ไว้ (opus, haiku-batch, fable-medium)
│   ├── hooks/block-dangerous-git.py       # PreToolUse gate ที่ถามก่อนรันคำสั่ง git เสี่ยงๆ
│   ├── rules/ecc-common/                  # กฎวินัยวิศวกรรม 10 ไฟล์ (จาก ecc plugin ecosystem)
│   ├── skills/                            # โฟลเดอร์สกิลคัดสรร 45 ตัว (เป็นเนื้อหา SKILL.md จริง ไม่ใช่แค่ดัชนี — ดู sources.json สำหรับ provenance)
│   ├── SKILLS_INDEX.md                    # ดัชนีส่วนตัวของสกิล/plugin ที่ติดตั้งไว้ + ใช้ตัวไหนตอนไหน
│   ├── memory-examples/                   # entry ของ auto-memory จริง 7 ตัว โชว์ format/pattern ของระบบ memory
│   ├── templates/                         # template เริ่มต้น 2 ตัวให้ copy ไปใช้ในโปรเจกต์ใหม่ (project-CLAUDE.md, conventions.md)
│   └── tools/
│       ├── skill-update-check/
│       │   ├── check.ps1                  # ตัวเช็ค update รายสัปดาห์ — อ่าน sources.json จากโฟลเดอร์เดียวกัน
│       │   └── sources.json               # manifest provenance จริง: สกิลส่วนตัว 45 + pip 3 + npm 2 + binary tool 1
│       └── ollama/ollama-digest.ps1       # ตัวช่วย pre-digest ด้วย local model แบบ on-demand (ดูหัวข้อ Ollama ด้านล่าง)
└── notes/                                 # โน้ต 3 ไฟล์: ตัวอย่างเนื้อหาจาก second-brain vault ข้ามโปรเจกต์ส่วนตัว
```

### `global-config/CLAUDE.md`
หัวใจของ setup นี้ มันเข้ารหัส:

- **Cost-aware model routing** — main loop เป็นหัวหน้างานบน Sonnet คอยส่งงานให้ subagent Haiku/Opus/Fable ตามความยากของงาน พร้อมกฎว่าใครอ่านไฟล์ดิบ ใครอ่านแค่ข้อสรุป
- **Offload งานหนักออกไป session แยก** — แทนที่จะปล่อยให้ session ปัจจุบันบวม (และเสียเงิน) เพิ่ม
- **Workflow การวางแผน** — `/plan-pro` เป็น planner ค่าเริ่มต้น
- **ข้อตกลง second-brain vault** — กฎเดียว ("ผูกกับ repo เดียวไหม") ตัดสินว่าอะไรอยู่ใน vault กับอะไรอยู่ใน docs/ADR ของ repo
- **Git safety hook** — PreToolUse gate ที่ถามก่อนรันคำสั่ง git ที่ทำลายข้อมูล
- **จุดพลาดของ shell** — กฎ heredoc syntax ของ Bash tool กับ PowerShell tool (ปัญหาเฉพาะ Windows ที่เจอมากับตัว)
- **เฝ้าดู context เอง** — ตอนไหนที่ Claude ควรเสนอ `/compact` เอง
- **กฎเขียนให้ไม่ดู AI** — ชุดกฎภาษาไทย + อังกฤษเต็มรูปแบบสำหรับทำให้ข้อความที่ร่างอ่านเหมือนคนเขียน (คำที่ควรเลี่ยง, pattern โครงสร้าง, การเลือก register) เป็นส่วนที่ใหญ่และเอาไปใช้ต่อได้กว้างที่สุดในไฟล์นี้ รายละเอียดหลังบ้านอยู่ใน `memory-examples/`
- **Draft-first เป็นค่าเริ่มต้นของ PR**, **ขอก่อนตั้ง cron/cloud agent เสมอ**, **บรรยายสั้นระหว่างรันคำสั่งยาว**, จุดพลาดเรื่อง **claude-in-chrome tab กลุ่มเดียวกันตอนรันหลาย session คู่ขนาน**, และ **เช็ค Supabase RLS เชิงรุก** สำหรับโปรเจกต์ไหนที่ใช้ Supabase

### `global-config/rules/ecc-common/`
วินัยวิศวกรรมทั่วไปจาก ecc (everything-claude-code) plugin ecosystem: workflow TDD, immutability, format commit, security checklist, ระดับความรุนแรงของ code review, การมอบหมายงานให้ agent มีประโยชน์ก็ต่อเมื่อคุณรัน ecc ด้วย (ดู "สิ่งที่ต้องติดตั้งเพิ่มเอง" ด้านล่าง)

### `global-config/skills/`
โฟลเดอร์ `SKILL.md` คัดสรร 45 ตัว (พร้อมไฟล์ script/reference/data ประกอบถ้าสกิลนั้นมี) ครอบคลุมงานเขียน/การตลาด (copywriting, copy-editing, hallmark, marketing-council, pricing...), กระบวนการวิศวกรรม (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit...), งานออกแบบ (design-system, ui-ux-pro-max, banner-design, mobbin-references...), และ meta-skill สำหรับบริหารจัดการ Claude Code เอง (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch...) `poka-yoke`, `plan-pro`, และ `shipping-a-branch` เขียนขึ้นเองจากศูนย์; `graphify`, `dembrandt`, `markitdown`, และ `mobbin-references` เป็น wrapper skill ที่เขียน SKILL.md เอง แต่เครื่องมือข้างในเป็นของ third-party (เครดิตใน `ATTRIBUTION.md` และ track เวอร์ชันใน `sources.json`); `deslop-defaults` ดัดแปลงมา (เก็บเกี่ยวจาก `ibelick/ui-skills` แล้วเขียนใหม่ให้ไม่ผูกกับ stack ใด stack หนึ่ง); ที่เหลือ adopt มาจาก upstream repo — ดู `sources.json` สำหรับ provenance รายสกิล และ `ATTRIBUTION.md` สำหรับเครดิต upstream พวกนี้เป็นงาน prompt-engineering ที่เอาไปใช้ต่อได้จริง ไม่ใช่แค่คำอธิบายสกิล — copy ไปที่ `~/.claude/skills/` แล้วใช้งานได้ทันที

### `global-config/memory-examples/`
entry จริง 7 ตัวจากระบบ auto-memory ของ Claude Code (ไม่ใช่ fact เฉพาะโปรเจกต์ แต่เป็นนิสัย "วิธีทำงาน" ที่เอาไปใช้ที่ไหนก็ได้): การแยกความหมายชื่อ cross-session messaging, pattern local-Ollama-เป็น-pre-compression, กฎว่า "update สมุดสกิล" หมายความว่าอะไรจริงๆ ในทางปฏิบัติ, จุดพลาดเรื่อง shell-quoting (`\b` กลายเป็น backspace byte แบบเงียบๆ), entry feedback เรื่องควร trim context bloat แรงแค่ไหน, และรายละเอียดหลังบ้านเต็มรูปแบบ (ตารางคำศัพท์ + ตัวอย่าง before-after) สำหรับกฎเขียนไม่ให้ดู AI ใน CLAUDE.md ทั้งภาษาไทยและอังกฤษ พวกนี้มีไว้โชว์ *รูปแบบ* ของ memory entry ที่ดี (กฎ + เหตุผล + วิธีใช้) พอๆ กับเนื้อหาเฉพาะของมันเอง — ดู `global-config/rules/ecc-common/` ว่า memory เข้ากับ workflow ใหญ่ยังไง และหัวข้อ "จำ/บัญญัติ" ใน CLAUDE.md สำหรับการแยก local กับ global memory ที่เจ้าของใช้

### `global-config/tools/skill-update-check/sources.json`
manifest การ adopt สกิล/เครื่องมือจริงของเจ้าของ — ข้อมูล provenance จริง (URL source repo, บันทึกการติดตั้ง, ประวัติเวอร์ชัน) สำหรับสกิลส่วนตัวทั้ง 45 ตัว (รวมตัวที่เขียนเองและดัดแปลง) บวก pip package 3 ตัว, npm package 2 ตัว, และ binary tool 1 ตัว คู่กับ `check.ps1` นี่คือสิ่งที่ทำให้คน adopt `claude-clone-template` ไปติดตาม update ของ upstream สำหรับสกิลที่ copy ไปไว้ใน `~/.claude/skills/` ได้ เหมือนที่เจ้าของเดิมทำ ค่า `last_seen_commit` ส่วนใหญ่จะเป็น `unknown`/เก่าในมุมมองของผู้รับ จนกว่าจะรัน `check.ps1 -Ack` ครั้งหนึ่งเพื่อตั้ง baseline ของตัวเอง

### `global-config/templates/`
ไฟล์เริ่มต้นเล็กๆ 2 ไฟล์ (`project-CLAUDE.md`, `conventions.md`) ให้ copy ไปใช้ในโปรเจกต์ใหม่ตอนตั้งค่าครั้งแรก — project CLAUDE.md แบบ "router" ยาวไม่เกิน 45 บรรทัด และ template conventions/green-gate แต่ละไฟล์มี comment block เป็น PRESET แบบเติมช่องว่างสำหรับ stack ที่กำลัง bootstrap (ตอนนี้มีแค่ตัวอย่าง Python-web) อยากได้ preset สำหรับ stack อื่นก็เพิ่มเองตามแบบเดียวกันได้

### `notes/`
เนื้อหาตัวอย่างจาก Obsidian second-brain vault ของเจ้าของ: รายการ local Ollama model, repo ที่ bookmark ไว้, และโน้ตอ้างอิงเบ็ดเตล็ด พวกนี้โชว์ *ประเภทของสิ่งที่ควรอยู่* ใน vault ข้ามโปรเจกต์ — ไม่ใช่ของที่ต้องมีเป๊ะๆ เก็บแนวคิดโครงสร้างไว้ แล้วค่อยๆ แทนที่เนื้อหาด้วยของตัวเองไปตามเวลา

## วิธี adopt

1. **Copy `global-config/CLAUDE.md`** ไปที่ `~/.claude/CLAUDE.md` ของตัวเอง จะ merge กับของเดิมหรือแทนที่เลยก็แล้วแต่ อ่านก่อน แล้วลบส่วนที่ไม่เกี่ยวกับคุณทิ้ง **เขียนส่วน "Installed Plugins" ใหม่ก่อนทำอย่างอื่นกับไฟล์นี้** — ตอนนี้มันอ้างว่ามี plugin เฉพาะ (superpowers, ecc, pordee, lazyweb, andrej-karpathy-skills) ติดตั้งและเปิดใช้อยู่ และบอก Claude ไม่ให้พูดเรื่องติดตั้งพวกนี้ นั่นจริงสำหรับเจ้าของเดิม ไม่ใช่สำหรับคุณ แทนที่ด้วย list plugin จริงของคุณ หรือลบทิ้งจนกว่าจะติดตั้งอะไรสักอย่าง
2. **Copy `global-config/agents/*.md`** ไปที่ `~/.claude/agents/` และ **`global-config/hooks/block-dangerous-git.py`** ไปที่ `~/.claude/hooks/` พวกนี้คือสิ่งที่ทำให้กฎ model-routing และ git safety gate ใน CLAUDE.md ทำงานได้จริง ไม่ใช่แค่ข้อความ
3. **Copy `global-config/skills/*`** ไปที่ `~/.claude/skills/` นี่คือคุณค่าหลักส่วนใหญ่ — สกิลที่ใช้งานได้จริง 45 โฟลเดอร์ ไม่ใช่แค่คำอธิบาย
4. **Merge `global-config/settings.example.json`** เข้ากับ `~/.claude/settings.json` ของตัวเอง (แทนที่ `<YOUR_HOME>` ด้วย home path จริงก่อน) ให้ merge ไม่ใช่เขียนทับ ถ้ามี settings.json อยู่แล้ว — เอา entry `hooks.PreToolUse` กับอะไรที่อยากได้จาก `enabledPlugins` ไป ตัว hook ที่ให้มาใช้ launcher `py` ของ Windows บน macOS/Linux ให้เปลี่ยนเป็น `python3` ก่อน
5. **Copy `global-config/rules/ecc-common/`** ไปที่ `~/.claude/rules/` **เฉพาะกรณี** ที่ติดตั้ง ecc plugin ถ้าไม่ ข้ามได้เลย
6. **Copy `global-config/memory-examples/*.md`** ไปที่โฟลเดอร์ auto-memory ของโปรเจกต์ที่อยากให้มันใช้ (Claude Code auto-memory ผูกกับแต่ละโปรเจกต์ ที่ `~/.claude/projects/<project>/memory/`) หรือจะอ่านเป็นตัวอย่างแล้วเขียนของตัวเองใหม่ก็ได้
7. **Copy `notes/`** ไปไว้ใน second-brain vault ของตัวเอง (โฟลเดอร์ไหนก็ได้ที่ Obsidian หรือ markdown tool ทั่วไปมองเห็น) หรือข้ามไปเลยถ้าไม่อยากมี vault
8. **Find-and-replace placeholder ทุกตัว** — นี่คือขั้นตอนที่สำคัญที่สุด:
   - `<YOUR_USERNAME>`, `<YOUR_HOME>` → username และ home path ของระบบ Windows/อื่นๆ ของคุณจริงๆ
   - `<YOUR_VAULT_PATH>` → ที่ที่คุณเก็บ (หรือวางแผนจะเก็บ) second-brain vault
9. **Copy `global-config/tools/`** (ทั้ง `skill-update-check/` และ `ollama/` ถ้าเก็บ Ollama ไว้) ไปที่ `~/.claude/tools/` แล้ว **ตั้ง baseline ของตัวเองใน `sources.json`**: รัน `check.ps1 -Ack` หนึ่งครั้งหลัง copy สกิลไปแล้ว เพื่อให้ `last_seen_commit` สะท้อนจุดเริ่มต้นที่คุณคุมเอง ไม่ใช่ประวัติของเจ้าของเดิม

## สิ่งที่ต้องติดตั้งเพิ่มเอง

Repo นี้มีแค่ **การอ้างอิงถึงและกฎสำหรับ** skill ecosystem ต่างๆ — ไม่ใช่ตัว ecosystem เอง กฎใน CLAUDE.md จะมีความหมายก็ต่อเมื่อคุณติดตั้ง:

- **superpowers** (obra/superpowers) — สกิล brainstorming, writing-plans, TDD, debugging
- **ecc / everything-claude-code** (affaan-m/ECC) — agent, สกิล, คำสั่ง, MCP server
- plugin อื่นที่ระบุใน `SKILLS_INDEX.md` ที่คุณตัดสินใจว่าอยากได้

ติดตั้งผ่านระบบ plugin ของ Claude Code บนเครื่องใหม่ แล้ว reconcile `SKILLS_INDEX.md` ให้ตรงกับที่ติดตั้งจริง

---

## Optional: Local AI (Ollama) pre-compression

Setup ต้นฉบับใช้ local Ollama model เป็น **tier pre-compression แบบ lossy ที่ฟรี** — pipe ข้อความยาว low-stakes (log, doc ยาว) ผ่าน local model ให้ย่อยก่อน *ก่อนที่* จะเข้า context ของ paid model มันอยู่ **ต่ำกว่า Haiku** ในบันได cost ไม่ใช่ routing tier: ไม่มี tool access, ไม่มี repo context, รับข้อความเข้า-ออกเท่านั้น มันช่วยประหยัดเงิน แต่ไม่เพิ่ม capability อะไร ไม่มีส่วนอื่นใน repo นี้ที่พึ่งพามัน

**คำถามที่ต้องตอบเอง: อยากตั้ง local Ollama model สำหรับเรื่องนี้ไหม?**

### ถ้าไม่
ข้ามหัวข้อนี้ทั้งหมด ลบย่อหน้า Ollama ออกจาก `CLAUDE.md` ที่ copy มา และทิ้ง `notes/local-ollama-models.md` ที่เหลือทำงานได้ปกติโดยไม่มีมัน

### ถ้าเอา
1. **ติดตั้ง Ollama** จาก [ollama.com](https://ollama.com)
2. **ตัดสินใจว่า model store จะอยู่ที่ไหน** Model มีขนาดใหญ่ (model 27B กินหลายสิบ GB) และตำแหน่ง default อยู่บน system drive (`%USERPROFILE%\.ollama` บน Windows) ถ้า system drive พื้นที่ตึง ให้ย้าย store ไปไดรฟ์ที่ใหญ่กว่า — setup ต้นฉบับใช้ `D:\ollama` ด้วยเหตุผลนี้เอง บน Windows ตั้ง environment variable `OLLAMA_MODELS` ไปที่ path ที่เลือกก่อน pull model แพลตฟอร์มอื่นมีวิธีเทียบเท่าผ่าน env-var หรือ symlink
3. **Pull instruct model general-purpose อย่างน้อย 1 ตัว** (เช่น `ollama pull qwen2.5:7b-instruct` หรือ instruct model ขนาดใกล้เคียง ~7-9B — เล็กพอให้รันเร็ว ดีพอให้สรุปได้) รายการต้นฉบับใน `notes/local-ollama-models.md` โชว์สเปรดหนึ่งแบบที่เป็นไปได้: model 27B ตัวหนักสำหรับคุณภาพดีสุด, model 7-9B ขนาดกลางสำหรับความเร็ว/reasoning/code, และ model รองรับภาพ 1 ตัว (`llava:7b`) — ใช้เป็นแรงบันดาลใจ ไม่ใช่ shopping list
4. **เรียนรู้ pattern การใช้งาน:** pipe ไฟล์เข้าไป ได้ digest ออกมา —
   ```powershell
   Get-Content <file> | ollama run <model> "<instruction>"
   ```
   (pipe ไฟล์ อย่ายัด prompt ยาวๆ ลงใน argument)
5. **จำกฎเหล็กข้อเดียว:** output จาก local model **ไม่ใช่ ground truth** เด็ดขาด มันคือ lossy compression สำหรับข้อความ low-stakes ถ้า decision ขึ้นอยู่กับเนื้อหา paid model ต้องอ่านต้นฉบับเสมอ

ส่วนนี้ optional 100% ข้ามได้เลยถ้าไม่อยากได้ มีไว้แค่ช่วยลด token cost ของข้อความก้อนใหญ่

---

## ข้อควรรู้: นี่คือ setup ของคนคนเดียว

สแนปช็อตนี้มาจาก workflow เฉพาะ: user สองภาษาไทย-อังกฤษบนเครื่อง Windows เห็นได้ทุกที่ — ส่วนสองภาษาใน CLAUDE.md, จุดพลาดเรื่อง PowerShell-กับ-Bash

หยิบส่วนที่มีประโยชน์ไป ทิ้งส่วนที่ไม่ใช่ ไม่มีอะไรในนี้เป็น best practice ที่ต้องทำตาม — มันคือสิ่งที่ work สำหรับคนคนหนึ่ง แล้วบันทึกไว้ให้พกพาได้ คุณค่าจริงอยู่ที่ *รูปแบบ* ของระบบ (routing ตาม cost, offload งานหนัก, ความรู้แต่ละก้อนมีบ้านหนึ่งเดียว, safety gate กันคำสั่งทำลายข้อมูล) ไม่ใช่กฎแต่ละข้อเป๊ะๆ
