[English](README.md) | **ภาษาไทย** | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=180&section=header&text=Claude%20Code%20Clone%20Template&fontSize=38&fontColor=ffffff&fontAlignY=38&desc=สแนปช็อตพกพาของ%20Claude%20Code%20setup%20ของคนคนหนึ่ง&descAlignY=58&descSize=17&descColor=ffffff&animation=fadeIn" alt="แบนเนอร์ Claude Code Clone Template" width="100%"/>

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Skills](https://img.shields.io/badge/skills-45%20curated-brightgreen)](#global-configskills)
[![Languages](https://img.shields.io/badge/languages-10-orange)](#top)
[![Template](https://img.shields.io/badge/type-adapt%2C%20not%20run%20as--is-lightgrey)](#ข้อควรรู้-นี่คือ-setup-ของคนคนเดียว)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&pause=1200&color=6C63FF&center=true&vCenter=true&width=640&lines=สกิลคัดสรร+45+ตัว+พร้อม+provenance+ครบ;จัดสรรโมเดล+Sonnet+%2F+Opus+%2F+Haiku+ตามต้นทุน;Git+safety+hooks+%2B+เวิร์กโฟลว์+%2Fplan-pro;Knowledge+vault+ข้ามโปรเจกต์" alt="สรุปฟีเจอร์เด่นแบบหมุนวน"/>

</div>

# Claude Code Clone Template

สแนปช็อตพกพาของ Claude Code setup ของคนคนหนึ่ง — global instructions, กฎการทำงาน, **สกิลคัดสรร 45 ตัว** (เขียนเอง 7 ตัว — เขียนจากศูนย์ 3 ตัว, wrapper ที่เขียนเองรอบเครื่องมือ third-party 4 ตัว — ดัดแปลงจาก upstream skill 1 ตัว ที่เหลือ adopt มาจาก upstream repo ทั้งหมด มี provenance รายสกิลอยู่ใน `sources.json`), ตัวอย่าง memory จริง, manifest แหล่งที่มาของสกิล, และ knowledge vault ข้ามโปรเจกต์ — แพ็กไว้ให้ Claude Code เครื่องใหม่ (หรือคนที่กำลังตั้งเครื่องใหม่) bootstrap นิสัยการทำงานและความสามารถชุดเดียวกันได้บนเครื่องอื่น นี่คือ **template ให้เอาไปปรับ ไม่ใช่ config ที่รันได้ทันที**: ข้อมูลระบุตัวตนถูกลบออกและแทนที่ด้วย placeholder แล้ว และหลายส่วนจะมีความหมายก็ต่อเมื่อคุณติดตั้งเครื่องมือที่มันอ้างถึงด้วย

## เริ่มต้นใช้งาน (quickstart)

**ทางลัด:** clone repo นี้ เปิดใน Claude Code แล้วรัน `/adopt` — มันจะสัมภาษณ์คุณ (อยากได้ส่วนเสริมไหนบ้าง, list plugin, path ปลายทาง) แล้วทำขั้นตอน 2-6 และ 8-9 ด้านล่างให้เอง พร้อม tick progress ลงไฟล์ journal ที่ resume ได้ระหว่างทาง ขั้นตอน 7 (ติดตั้งตัว plugin ecosystem เอง) จงใจไม่รวมอยู่ใน `/adopt` — อันนั้นต้องทำเอง ขั้นตอนด้านล่างคือสิ่งที่ `/adopt` ทำอัตโนมัติให้ และมีไว้สำหรับคนที่อยากทำมือเองหรืออยากรีวิวก่อนว่าอะไรจะเปลี่ยนบ้างก่อนรันจริง

1. **Clone repo** ไปที่ไหนก็ได้บนเครื่องปลายทาง
2. **ตัดสินใจส่วนเสริมที่เป็นทางเลือกตอนนี้เลย** — ตอบใช่/ไม่ใช่ เพราะมันกำหนดว่าขั้นตอน 5 จะลบอะไรบ้าง: Local AI (Ollama) pre-compression ดูรายละเอียดที่หัวข้อ "Optional: ___" ด้านล่าง
3. **Copy `global-config/CLAUDE.md`, `agents/*.md`, `hooks/*.py`, `skills/*`, และ `tools/`** ไปที่ `~/.claude/` ของตัวเอง (จะ merge หรือแทนที่ก็แล้วแต่) พวกนี้คือสิ่งที่ทำให้กฎ routing, git safety gate, graphify auto-sync, catalog สกิล, และตัวเช็ค update ทำงานได้จริง ไม่ใช่แค่ข้อความเฉยๆ **ก่อน copy `CLAUDE.md` ให้เขียนส่วน "Installed Plugins" ใหม่ให้เหลือแค่ที่คุณติดตั้งจริง** — ต้นฉบับอ้างว่ามี plugin เฉพาะเจ้าของเดิมติดตั้งอยู่ ถ้า copy ไปทั้งดุ้น Claude ของคุณจะโกหกเรื่อง tooling ที่มีจริง
   - **ทำงานข้าม AI coding agent หลายตัว (Codex, Cursor, Gemini CLI ฯลฯ) ด้วย?** ให้ copy `global-config/AGENTS.md` ไปวางใน project ที่ต้องการ (ที่ root ของ project ไม่ใช่ `~/.claude/`) แทนหรือคู่กับ `CLAUDE.md` ระดับ project ก็ได้ ขั้นนี้ต้องทำมือ — `/adopt` เขียนไฟล์ลง `~/.claude/` อย่างเดียว เลยไม่ได้ถามหรือ copy ให้ ดูหัวข้อ "ใช้กับเครื่องมืออื่นได้ไหม" ด้านล่างว่าสองไฟล์ทำงานร่วมกันยังไง
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
│   ├── AGENTS.md                          # ส่วนที่พกไปใช้กับ agent อื่นได้ (Codex, Cursor, Gemini CLI ฯลฯ) ตัดกลไกเฉพาะ Claude Code ออก
│   ├── settings.example.json              # ~/.claude/settings.json ที่ถูก sanitize แล้ว — hooks, plugin, model default
│   ├── agents/                            # นิยาม subagent 4 ตัวที่ pin model ไว้ (opus, sonnet-worker, haiku-batch, fable-medium)
│   ├── hooks/block-dangerous-git.py       # PreToolUse gate ที่ถามก่อนรันคำสั่ง git เสี่ยงๆ
│   ├── hooks/graphify-auto-update.py      # PostToolUse hook — sync knowledge graph ของ graphify ให้สดหลังแก้ไฟล์
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

- **Cost-aware model routing** — main loop เป็นหัวหน้างาน เลือกได้ระหว่าง Opus 5.5 (งานที่ต้องตัดสินใจเยอะ) หรือ Sonnet 5 (session routine ที่อยากประหยัด) คอยส่งงานให้ subagent Haiku/Sonnet/Opus/Fable ตามความยากของงาน พร้อมกฎว่าใครอ่านไฟล์ดิบ ใครอ่านแค่ข้อสรุป
- **Offload งานหนักออกไป session แยก** — แทนที่จะปล่อยให้ session ปัจจุบันบวม (และเสียเงิน) เพิ่ม
- **Workflow การวางแผน** — `/plan-pro` เป็น planner ค่าเริ่มต้น
- **ข้อตกลง second-brain vault** — กฎเดียว ("ผูกกับ repo เดียวไหม") ตัดสินว่าอะไรอยู่ใน vault กับอะไรอยู่ใน docs/ADR ของ repo
- **Git safety hook** — PreToolUse gate ที่ถามก่อนรันคำสั่ง git ที่ทำลายข้อมูล
- **graphify auto-sync hook** — PostToolUse hook ที่ sync knowledge graph ให้สดหลังแก้ไฟล์ทุกครั้ง โดยไม่บล็อกการแก้ไฟล์เอง
- **ทางแก้ Auto Mode classifier** — ทำยังไงเมื่อ classifier ความปลอดภัยของ Auto Mode บล็อกคำสั่งที่คุยอนุมัติไปแล้วในแชทเงียบๆ ซ้ำ รวมถึงทางแก้ถาวรด้วย `permissions.ask` สำหรับเคส "แก้ config ของ Claude Code เอง" โดยเฉพาะ
- **จุดพลาดของ shell** — กฎ heredoc syntax ของ Bash tool กับ PowerShell tool (ปัญหาเฉพาะ Windows ที่เจอมากับตัว)
- **เฝ้าดู context เอง** — ตอนไหนที่ Claude ควรเสนอ `/compact` เอง
- **กฎเขียนให้ไม่ดู AI** — ชุดกฎภาษาไทย + อังกฤษเต็มรูปแบบสำหรับทำให้ข้อความที่ร่างอ่านเหมือนคนเขียน (คำที่ควรเลี่ยง, pattern โครงสร้าง, การเลือก register) เป็นส่วนที่ใหญ่และเอาไปใช้ต่อได้กว้างที่สุดในไฟล์นี้ รายละเอียดหลังบ้านอยู่ใน `memory-examples/`
- **Draft-first เป็นค่าเริ่มต้นของ PR**, **ขอก่อนตั้ง cron/cloud agent เสมอ**, **บรรยายสั้นระหว่างรันคำสั่งยาว**, จุดพลาดเรื่อง **claude-in-chrome tab กลุ่มเดียวกันตอนรันหลาย session คู่ขนาน**, และ **เช็ค Supabase RLS เชิงรุก** สำหรับโปรเจกต์ไหนที่ใช้ Supabase

### `global-config/rules/ecc-common/`
วินัยวิศวกรรมทั่วไปจาก ecc (everything-claude-code) plugin ecosystem: workflow TDD, immutability, format commit, security checklist, ระดับความรุนแรงของ code review, การมอบหมายงานให้ agent มีประโยชน์ก็ต่อเมื่อคุณรัน ecc ด้วย (ดู "สิ่งที่ต้องติดตั้งเพิ่มเอง" ด้านล่าง)

### `global-config/skills/`
โฟลเดอร์ `SKILL.md` คัดสรร 45 ตัว (พร้อมไฟล์ script/reference/data ประกอบถ้าสกิลนั้นมี) ครอบคลุมงานเขียน/การตลาด (copywriting, copy-editing, hallmark, marketing-council, pricing...), กระบวนการวิศวกรรม (debug-mantra, poka-yoke, second-brain, dependency-audit, secrets-audit...), งานออกแบบ (design-system, ui-ux-pro-max, banner-design, mobbin-references...), และ meta-skill สำหรับบริหารจัดการ Claude Code เอง (skillify, grilling, second-brain, graphify, plan-pro, shipping-a-branch...) `poka-yoke`, `plan-pro`, และ `shipping-a-branch` เขียนขึ้นเองจากศูนย์; `graphify`, `dembrandt`, `markitdown`, และ `mobbin-references` เป็น wrapper skill ที่เขียน SKILL.md เอง แต่เครื่องมือข้างในเป็นของ third-party (เครดิตใน `ATTRIBUTION.md` และ track เวอร์ชันใน `sources.json`); `deslop-defaults` ดัดแปลงมา (เก็บเกี่ยวจาก `ibelick/ui-skills` แล้วเขียนใหม่ให้ไม่ผูกกับ stack ใด stack หนึ่ง); ที่เหลือ adopt มาจาก upstream repo — ดู `sources.json` สำหรับ provenance รายสกิล และ `ATTRIBUTION.md` สำหรับเครดิต upstream พวกนี้เป็นงาน prompt-engineering ที่เอาไปใช้ต่อได้จริง ไม่ใช่แค่คำอธิบายสกิล — copy ไปที่ `~/.claude/skills/` แล้วใช้งานได้ทันที

<details>
<summary><b>ดูสกิลทั้ง 45 ตัว แบ่งตามหมวด</b> (คลิกเพื่อขยาย)</summary>

**กระบวนการวิศวกรรม & workflow (15 ตัว)**

| สกิล | ทำอะไร |
|---|---|
| `debug-mantra` | ท่องมนตร์ 4 ขั้นก่อนดีบัก (reproduce → ไล่ fail path → falsify hypothesis → cross-reference) ก่อนเสนอ fix |
| `poka-yoke` *(เขียนเอง)* | รีวิวแบบกันพลาด — ทำให้ state ผิดเป็นไปไม่ได้/เห็นชัดตั้งแต่ต้นทาง แทนที่จะจับได้ทีหลัง |
| `post-mortem` | เขียน root-cause writeup มาตรฐาน หลังบั๊กถูกแก้และ validate แล้ว |
| `scrutinize` | รีวิวมุมคนนอกของ plan/PR/diff — เช็ค intent ก่อน แล้วค่อยไล่ code path จริง |
| `shipping-a-branch` *(เขียนเอง)* | ขับ flow commit → push → PR → review → merge ครบ confirm ทีละขั้นที่เสี่ยง |
| `plan-pro` *(เขียนเอง)* | เขียน implementation plan พร้อม review loop แบบ multi-agent และ output HTML before/after |
| `dependency-audit` | เช็ค dependency ของโปรเจกต์หา CVE ที่รู้จักและความเสี่ยง supply-chain |
| `secrets-audit` | สแกน source, git history, infra หา credential รั่วและจุดอ่อนเรื่อง secrets-management |
| `prompt-injection` | ตรวจ app/agent หาช่องโหว่ prompt-injection และขอบเขต permission ของ LLM |
| `decide` | workflow ตัดสินใจแบบมีโครง (ชุดคำถามสไตล์ 37signals) พร้อม archive เหตุผลไว้ |
| `unstuck` | คลัง lateral-thinking technique ไว้แงะทางตัน แทนที่จะสรุปว่า "ทำไม่ได้" |
| `teach` | สอนแนวคิด/สกิลใหม่ให้ user ภายใน workspace ปัจจุบัน |
| `wait-what` | จับข้อความที่สื่อไม่ถึง แล้วลอง pitch ใหม่ |
| `skillify` | สร้าง/ดัดแปลง/อัปเดต skill ของ Claude Code (จากแชท วิดีโอ dump หรือ repo ภายนอก) |
| `wizard` | generate bash wizard แบบ interactive สำหรับขั้นตอนที่ต้องให้คนทำเอง (credential, dashboard, migration) |

**ออกแบบ & UI (11 ตัว)**

| สกิล | ทำอะไร |
|---|---|
| `banner-design` | ออกแบบ banner โซเชียล/โฆษณา/เว็บ/สิ่งพิมพ์ หลาย art direction |
| `design` | สกิลออกแบบครอบคลุม — โลโก้, CIP mockup, slide, banner, icon, social photo |
| `design-system` | สถาปัตยกรรม design token 3 ชั้น (primitive → semantic → component) พร้อม generate slide |
| `deslop-defaults` *(ดัดแปลง)* | ค่า default เชิงโครงสร้างกัน UI ที่ AI generate ดูจืดๆ ไม่เสร็จ (z-index, accent, state) |
| `hallmark` | สกิลออกแบบ anti-AI-slop สำหรับหน้าใหม่, redesign, และดึง design จาก URL/screenshot |
| `ui-styling` | สร้าง UI ที่ accessible ด้วย shadcn/ui, Tailwind, และธีมรองรับ dark mode |
| `ui-ux-pro-max` | ฐานข้อมูล UI/UX ค้นหาได้ — style, palette, font pairing, UX guideline, motion preset, chart type |
| `mobbin-references` | ดึง screenshot อ้างอิงจากแอปจริง (onboarding, paywall, empty state...) ก่อนออกแบบ UI |
| `dembrandt` *(wrapper)* | ดึง design token จริงของเว็บไซต์ที่มีอยู่แล้ว (สี, typography, spacing) ผ่าน DOM/CSS |
| `image` | generate/แก้/optimize รูปภาพการตลาด (hero, social graphic, mockup, OG image) |
| `slides` | สร้าง HTML presentation เชิงกลยุทธ์ด้วย Chart.js และ design-token theming |

**การตลาด, เนื้อหา & แบรนด์ (13 ตัว)**

| สกิล | ทำอะไร |
|---|---|
| `brand` | brand voice, visual identity, messaging framework, และเช็ค consistency |
| `community-marketing` | กลยุทธ์ community-led growth (Discord/Slack/forum, ambassador program, advocacy) |
| `content-strategy` | ตัดสินใจว่าจะสร้างเนื้อหาอะไร — topic cluster, editorial calendar, content pillar |
| `copy-editing` | แก้/กระชับ/รีเฟรช copy การตลาดที่มีอยู่แล้ว |
| `copywriting` | เขียน copy การตลาดใหม่สำหรับหน้า landing/pricing/feature/about |
| `launch` | วางแผน product launch, ประกาศฟีเจอร์, หรือ checklist go-to-market |
| `management-talk` | เขียนงานสไตล์ engineer-to-engineer ใหม่ให้ leadership อ่าน ปรับตามช่องทาง (Slack/email/standup) |
| `marketing-council` | คณะที่ปรึกษาจำลองจากนักการตลาดชื่อดัง มาดีเบตคำถามเรื่อง positioning |
| `marketing-ideas` | ตัวช่วยระดมไอเดียการตลาด/growth สำหรับผลิตภัณฑ์ SaaS/ซอฟต์แวร์ |
| `marketing-psychology` | ใช้หลัก behavioral science (anchoring, social proof, framing) กับการตัดสินใจการตลาด |
| `pricing` | กลยุทธ์ pricing/packaging และ audit หน้า pricing |
| `product-marketing` | สร้างเอกสาร context เรื่องผลิตภัณฑ์/audience/positioning ที่สกิลการตลาดอื่นอ้างอิงต่อ |
| `social` | สร้าง/จัดตาราง/repurpose เนื้อหาโซเชียล และ social listening ข้ามแพลตฟอร์ม |

**วิจัย & จัดการความรู้ (6 ตัว)**

| สกิล | ทำอะไร |
|---|---|
| `deep-research` | ทำ research brief หลายแหล่ง หลายรอบ พร้อม citation, ข้อขัดแย้ง, และช่องโหว่ที่ยังไม่ได้ตอบ |
| `graphify` *(wrapper, เขียนเอง)* | แปลง input ใดๆ (โค้ด/เอกสาร/paper/รูป) เป็น knowledge graph แบบจัดกลุ่มพร้อม audit report |
| `grilling` | สัมภาษณ์ user แบบไม่ยั้งเพื่อ stress-test plan ก่อนลงมือสร้างจริง |
| `second-brain` | workflow capture/compile/query/lint/connect สำหรับ knowledge vault สไตล์ Obsidian |
| `watch-video` | ดึง transcript/visual/multimodal จากวิดีโอที่ yt-dlp รองรับ |
| `markitdown` *(wrapper)* | แปลง PDF/slide/sheet/audio/HTML ฯลฯ เป็น Markdown สะอาดสำหรับ LLM/RAG |

Provenance เต็มของแต่ละสกิล (source repo, วันที่ adopt, เขียนเอง/adopt/ดัดแปลง) อยู่ใน `global-config/tools/skill-update-check/sources.json`; เครดิต upstream อยู่ใน `ATTRIBUTION.md`

</details>

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
2. **Copy `global-config/agents/*.md`** ไปที่ `~/.claude/agents/` และ **`global-config/hooks/*.py`** ไปที่ `~/.claude/hooks/` พวกนี้คือสิ่งที่ทำให้กฎ model-routing, git safety gate, และ graphify auto-sync hook ใน CLAUDE.md ทำงานได้จริง ไม่ใช่แค่ข้อความ
3. **Copy `global-config/skills/*`** ไปที่ `~/.claude/skills/` นี่คือคุณค่าหลักส่วนใหญ่ — สกิลที่ใช้งานได้จริง 45 โฟลเดอร์ ไม่ใช่แค่คำอธิบาย
4. **Merge `global-config/settings.example.json`** เข้ากับ `~/.claude/settings.json` ของตัวเอง (แทนที่ `<YOUR_HOME>` ด้วย home path จริงก่อน) ให้ merge ไม่ใช่เขียนทับ ถ้ามี settings.json อยู่แล้ว — เอา entry `hooks.PreToolUse`/`hooks.PostToolUse`, block `permissions.ask`, และอะไรที่อยากได้จาก `enabledPlugins` ไป ตัว hook ที่ให้มาใช้ launcher `py` ของ Windows บน macOS/Linux ให้เปลี่ยนเป็น `python3` ก่อน
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

## เรื่อง plan ที่ใช้กับ tier Fable 5.1

บันได model routing ใน `CLAUDE.md` สุดท้ายมี subagent `fable-medium` เป็นด่านบนสุด — เป็น tier แพงสุดที่ตั้งใจให้ใช้น้อยๆ เฉพาะงานยากจริงๆ เจ้าของ setup ต้นฉบับใช้ **Max** plan ซึ่งเรียก model นี้ได้ ถ้าคุณใช้ **Pro** (หรือ plan ไหนก็ตามที่ไม่มีสิทธิ์เข้า Fable 5.1) การ spawn `fable-medium` จะ fail เฉยๆ

ก่อน copy `CLAUDE.md` ไปใช้ตรงๆ เช็คก่อนว่าตัวเองใช้ plan ไหน ถ้าไม่มี Fable 5.1:
- ลบย่อหน้า `fable-medium` และ bullet "สุดบันได" ออกจากส่วน model routing
- เปลี่ยนเพดานบันไดให้จบที่ `opus` แทน — ตรรกะ escalate ขึ้น Opus ตอนงานยาก/เดิมพันสูงยังใช้ได้เหมือนเดิม แค่ไม่มีด่านที่สูงกว่า Opus ให้ escalate ต่อ
- ตัด `global-config/agents/fable-medium.md` ออกจากไฟล์ที่ copy ไปที่ `~/.claude/agents/`

`/adopt` จะถามเรื่องนี้เป็นส่วนหนึ่งของการสัมภาษณ์และแก้ให้อัตโนมัติ ถ้า copy ไฟล์เองด้วยมือให้ทำขั้นตอนนี้เองด้วย จะได้ไม่ต้องเจอ Claude พยายาม spawn subagent ที่ plan ตัวเองเรียกไม่ได้

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

## ใช้กับเครื่องมืออื่นได้ไหม (Codex, Cursor, Gemini CLI ฯลฯ)

template นี้สร้างมาสำหรับ **Claude Code โดยเฉพาะ** แต่ตั้งแต่ Claude Code 2.1.277 (ก.ย. 2026) ตัว Claude Code เองก็อ่าน [`AGENTS.md`](https://agents.md) เป็น fallback ด้วยแล้ว ตอน project ไม่มี `CLAUDE.md` มันจะไปอ่านไฟล์นี้แทน — format เดียวกับที่ Codex CLI, Cursor, Gemini CLI, GitHub Copilot อ่านอยู่แล้ว เพราะแบบนี้ template ถึงมีไฟล์แยกสองไฟล์:

- **`global-config/CLAUDE.md`** — setup เต็ม: cost-aware model routing, `/plan-pro`, skill catalog, hook, subagent routing, ทุกอย่างที่มีความหมายเฉพาะใน Claude Code เท่านั้น
- **`global-config/AGENTS.md`** — ส่วนที่พกไปใช้ที่ไหนก็ได้ (coding style, git workflow, testing, code review, security checklist, pattern ที่ใช้ซ้ำได้) ตัดกลไกเฉพาะ Claude Code ออกหมดแล้ว วางใน project ไหนก็ได้ agent ตัวไหนที่อ่าน AGENTS.md จะหยิบไปใช้ต่อเอง รวม Claude Code เองด้วย

ถ้า project มีทั้งสองไฟล์พร้อมกัน Claude Code จะอ่าน `CLAUDE.md` แล้วเมิน `AGENTS.md` ไปเลย สองไฟล์ไม่ merge กัน อย่าคาดว่ากฎเฉพาะ Claude Code จะใช้ได้แค่เพราะมี AGENTS.md วางอยู่ด้วย ส่วนเครื่องมืออื่น (Codex, Cursor ฯลฯ) อ่านแค่ `AGENTS.md` เท่านั้น — ไม่รู้จัก `CLAUDE.md`, `Skill` tool, hook ใน `settings.json`, หรือ subagent definition อยู่แล้ว พวกนี้เลยยังเป็นของเฉพาะ Claude Code เหมือนเดิม

สิ่งที่ปรับมือได้เพิ่มถ้าอยากได้มากกว่าส่วนใน AGENTS.md:
- แต่ละ skill ที่ `global-config/skills/<name>/SKILL.md` เป็นแค่ไฟล์คำสั่ง markdown — เอาไปวางใน custom instruction ของเครื่องมืออื่นได้ แต่จะเสีย automatic triggering ไป และ script ที่แนบมาด้วยก็สมมติว่ามี shell ให้รันแบบที่ Claude Code รันได้
- Hook (`settings.json`) และไฟล์ subagent (`agents/*.md`) เป็นของเฉพาะ Claude Code — ไม่มีอะไรให้ port ไปที่อื่น

ถ้าใช้ Codex/Cursor/Gemini CLI เป็นหลักอยู่แล้ว `AGENTS.md` เอากฎ engineering-discipline ไปใช้ได้ทันที ส่วนที่เหลือของ repo (skill, hook, การแก้ .docx) ยังอยู่เป็นเอกสารอ้างอิงให้ copy/paste ต่อ

---

## ข้อควรรู้: นี่คือ setup ของคนคนเดียว

สแนปช็อตนี้มาจาก workflow เฉพาะ: user สองภาษาไทย-อังกฤษบนเครื่อง Windows เห็นได้ทุกที่ — ส่วนสองภาษาใน CLAUDE.md, จุดพลาดเรื่อง PowerShell-กับ-Bash

หยิบส่วนที่มีประโยชน์ไป ทิ้งส่วนที่ไม่ใช่ ไม่มีอะไรในนี้เป็น best practice ที่ต้องทำตาม — มันคือสิ่งที่ work สำหรับคนคนหนึ่ง แล้วบันทึกไว้ให้พกพาได้ คุณค่าจริงอยู่ที่ *รูปแบบ* ของระบบ (routing ตาม cost, offload งานหนัก, ความรู้แต่ละก้อนมีบ้านหนึ่งเดียว, safety gate กันคำสั่งทำลายข้อมูล) ไม่ใช่กฎแต่ละข้อเป๊ะๆ
