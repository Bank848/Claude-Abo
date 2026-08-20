---
name: claude-code-frequently-used-skills
description: สรุปสกิล Claude Code ที่ใช้บ่อยจริงในงานประจำวัน แยกตามหมวด พร้อมวิธีเรียกและใช้ตอนไหน
metadata:
  type: reference
---

# สกิลที่ใช้บ่อย (Claude Code)

สรุปจาก `~/.claude/SKILLS_INDEX.md` (ดัชนีเต็ม 200+ ตัว) — ที่นี่เก็บเฉพาะ 11 ตัวที่หยิบใช้จริงตามงานที่ทำประจำ (วางแผน feature, review, UI, ship). อัปเดตทุกครั้งที่ pattern การใช้งานเปลี่ยน

---

## 🧠 วางแผน / Design ฟีเจอร์

| Skill | ใช้ทำอะไร | ใช้ยังไง |
|---|---|---|
| `superpowers:brainstorming` | สำรวจ intent + requirement + design ก่อนเริ่มงาน creative ใด ๆ — บังคับใช้ก่อนแตะโค้ด | อัตโนมัติเมื่อเริ่มงานใหม่ที่ยังไม่ตกผลึก |
| `/plan-pro` | เขียน implementation plan ต่อยอด `writing-plans`: spawn agent รีวิวหา gap ก่อนส่ง, output เป็น HTML มี before/after diagram (Mermaid) ให้อ่านง่าย, มี parallelization analysis | ใช้แทน `writing-plans` เปล่าเสมอ — ถ้า design approve แล้วในแชตและงานเล็ก-กลาง ข้ามการเขียน spec.md แยกได้เลย |
| `/grilling` | ให้ AI "ซัก" แผนแบบ relentless ก่อนลงมือ ไล่ทุกกิ่งของ design-tree ทีละคำถาม แนะคำตอบให้ด้วย | พูด "grill"/"stress-test" หรือ `/grilling` — ใช้กับงานเกม/แปล/งานทั่วไป (ไม่เขียนไฟล์ลง repo) |

---

## 🔍 Review / Debug

| Skill | ใช้ทำอะไร | ใช้ยังไง |
|---|---|---|
| `/scrutinize` | รีวิวมุมคนนอก — เช็คก่อนว่ามีทางที่เรียบกว่าไหม แล้วไล่โค้ดจริง (ไม่ใช่แค่ diff) | ใช้ตรวจ plan/PR/diff ก่อนส่งจริง |
| `/debug-mantra` + `superpowers:systematic-debugging` | บังคับท่อง 4 ขั้นก่อนเสนอ fix: reproduce → trace fail path → falsify hypothesis → cross-reference | trigger อัตโนมัติเมื่อเจอบั๊ก/error/stack trace |
| `adversarial-verify` (workflow, **not included in this template**) | verify claim ของ code review ก่อนแก้จริง — ต้อง CONFIRMED พร้อม quote file:line ถึงจะเชื่อ | feed ต่อจาก `receiving-code-review` |
| `superpowers:verification-before-completion` | บังคับรัน verify จริงก่อนเคลมว่า "เสร็จ" | ใช้ก่อนตอบว่าทำเสร็จทุกครั้ง |

---

## 🎨 UI / Design

| Skill | ใช้ทำอะไร | ใช้ยังไง |
|---|---|---|
| `ui-ux-pro-max` → `ui-styling` | ออกแบบ UI ใหม่: DB 50+ styles, 161 palettes, 57 font pairs, 99 UX guideline → implement จริงด้วย shadcn/Tailwind | เรียกตามลำดับ design ก่อน แล้วค่อย implement |
| `make-interfaces-feel-better` + `deslop-defaults` | polish UI ที่ "ทำได้แต่ไม่สวย" — อันแรก optical craft (spacing/type/shadow), อันหลัง structural restraint (z-index, accent เดียว, ห้าม AI-slop look) | ใช้คู่กันตอน review/gen UI |

---

## 🚀 Git / Ship

| Skill | ใช้ทำอะไร | ใช้ยังไง |
|---|---|---|
| `shipping-a-branch` (`/ship`) | flow เต็ม commit → push → PR → review → merge — ทุก action เสี่ยง (push/PR/merge/delete branch) confirm แยกทีละครั้ง | ใช้แทนสั่ง "commit and open a PR" ตรง ๆ ได้เลย |

---

## 🛠️ Meta / เครื่องมือส่วนตัว

| Skill | ใช้ทำอะไร | ใช้ยังไง |
|---|---|---|
| `update-config` | แก้ `settings.json` — hooks, permissions, env vars | ใช้เมื่อจะตั้ง automation หรือ allowlist |
| `/graphify` | แปลง input อะไรก็ได้ → knowledge graph (HTML/JSON + audit) | `/graphify` |

---

## 💰 Cost routing (ใช้ทุกงาน — ไม่ใช่ skill แต่เป็นกติกา)

main loop = Sonnet 5 (orchestrator, วางแผน/ตัดสินใจ/ตรวจงาน) → งานกลไก spawn `haiku-batch` → อ่านไฟล์เยอะ spawn `Explore` → งานยากจริง spawn `opus` → งานเดิมพันสูงสุดที่ opus แล้วยังส่าย spawn `fable-medium` (medium effort). กติกาเต็มอยู่ `~/.claude/CLAUDE.md`

---

## ดูเพิ่ม

- ดัชนีเต็ม 200+ skill: `~/.claude/SKILLS_INDEX.md`
- กฎ agent orchestration/git/testing: `~/.claude/rules/ecc/common/*.md`
