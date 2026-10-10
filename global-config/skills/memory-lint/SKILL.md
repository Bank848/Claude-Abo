---
name: memory-lint
description: "Health-check ระบบ memory ของโปรเจกต์ปัจจุบัน (memory/*.md + MEMORY.md) หา stale/ขัดแย้ง/orphan/ลิงก์เสีย/frontmatter พัง — read-only เสนอให้ยืนยันก่อนแก้. Trigger: /memory-lint, 'ตรวจ memory', 'memory ขัดกันไหม', 'เคลียร์ความจำเก่า'. Global ใช้ได้ทุกโปรเจกต์."
trigger: /memory-lint
metadata:
  type: reference
---

# /memory-lint — ตรวจสุขภาพระบบความจำ (global)

ดัดแปลง **lint workflow** จาก Karpathy LLM Wiki มาคุมระบบ auto-memory ที่ใช้อยู่ (`~/.claude/projects/<slug>/memory/`). จุดประสงค์: memory ที่สะสมหลายสิบไฟล์มักมี entry ที่ outdated/ทับกันเอง (เช่นงาน AC ที่แก้แล้วแก้อีก RT_409/410/411) — อันนี้ช่วยจับก่อนมันพาหลงทาง

## ขอบเขต — ไม่ตีกับสกิลอื่น
- **memory-lint** = audit เฉพาะ *store ความจำส่วนตัว* (`memory/*.md` + `MEMORY.md`) เทียบกับกติกาใน `~/.claude/CLAUDE.md` (memory section) เท่านั้น
- **ไม่ใช่ `graphify`** — graphify สร้าง knowledge graph จาก codebase/เอกสารทั่วไป. memory-lint ไม่สร้างกราฟ ไม่แตะ source code แค่ตรวจไฟล์ความจำ
- **read-only by default** — รายงานปัญหา + เสนอแก้ ไม่ลบ/ไม่แก้ไฟล์เองจนกว่าผู้ใช้ยืนยัน (memory สะท้อน "ความจริง ณ ตอนเขียน" การลบต้องคนตัดสิน)

## หา memory dir ของโปรเจกต์ปัจจุบัน
1. ใช้ path ที่ session บอกไว้ใน memory context ถ้ามี
2. ไม่งั้น derive จาก cwd: เปลี่ยน `:` `\` `_` → `-` แล้วหา `~/.claude/projects/<slug>/memory/`
   เช่น `D:\Fork\Sugar_Daddy_Dev` → `D--Fork-Sugar-Daddy-Dev`
3. ตรวจสอบด้วย `ls ~/.claude/projects/*/memory` ถ้า slug ไม่ชัด

## Tier model (resident vs retrievable) — ต้องเข้าใจก่อนเช็ค
โปรเจกต์ที่ผ่าน memory-tier-system migration จะมี `memory/` แบบ **2 ระดับ**:
- **`MEMORY.md`** (resident, auto-load ทุก session, งบ **≤4KB**) — ถือ **pointer ระดับหมวด** เท่านั้น (เช่น "ห้อง THM 40+ ห้อง → `memory/INDEX.md` ส่วน rooms") ไม่ใช่ pointer รายไฟล์อีกต่อไป
- **`memory/INDEX.md`** (retrievable, ไม่ auto-load, ไม่จำกัดขนาด) — ถือ **pointer รายไฟล์ครบทุกไฟล์** แบบที่ MEMORY.md เคยทำ

โปรเจกต์ที่ยังไม่ migrate จะมีแค่ `MEMORY.md` แบบเดิม (pointer รายไฟล์ตรงๆ ไม่มี INDEX.md) — ทั้งสองแบบใช้ได้ เช็คให้ตรงกับที่โปรเจกต์นั้นใช้จริง อย่าฟ้องว่าไม่มี INDEX.md ถ้าโปรเจกต์ยังไม่เข้าเกณฑ์ต้อง migrate (ดูข้อ 8)

**"จำ" (คำสั่งเดิม) เขียนไฟล์ retrievable โดย default ไม่บังคับ auto-ขึ้น MEMORY.md อีกต่อไป** — ไฟล์ที่ไม่มี pointer จึงเป็นสถานะปกติ ไม่ใช่ความผิด (ดูข้อ 3 ที่แก้ไว้ด้านล่าง)

## เช็คอะไรบ้าง (อ่านทุกไฟล์ใน memory/ ก่อน)
1. **Stale / superseded** — entry ที่บอก "FIXED/DONE/committed" แต่มีอีก entry ใหม่กว่าทับเรื่องเดียวกัน; หรืออ้าง file/flag/commit ที่ควร verify ว่ายังมีจริง (ถ้าแตะ code ปัจจุบันได้ ให้เช็ค)
2. **ขัดแย้ง (contradiction)** — สอง entry พูดตรงข้ามกัน (เช่นตัวนึงบอกเปิด detector อีกตัวบอกปิด)
3. **Orphan (แก้ตาม memory-tier-system §4)** — ไฟล์ใน `memory/` ที่ไม่มีบรรทัดชี้ **ทั้งใน `MEMORY.md` และ `memory/INDEX.md` (ถ้ามี)** = orphan จริง ต้องฟ้อง ส่วนไฟล์ที่ไม่มี pointer ใน `MEMORY.md` แต่มีใน `INDEX.md` แล้ว **ไม่ใช่ orphan** — เป็นสถานะ retrievable ปกติตาม design ใหม่ (pointer รายไฟล์ย้ายไป INDEX.md แล้ว ไม่ได้อยู่ MEMORY.md อีกต่อไป)
4. **ลิงก์เสีย** — `[[slug]]` ที่ชี้ไป `name:` ที่ไม่มีไฟล์ไหน match (ยอมรับว่า dangling = TODO ได้ แต่ list ให้ดู)
5. **Frontmatter พัง** — ขาด `name`/`description`/`metadata.type`, หรือ `type` ไม่ใช่ user|feedback|project|reference
6. **ควรเป็น repo แทน memory** — entry ที่จดสิ่งที่ repo บันทึกอยู่แล้ว (โครงสร้างโค้ด/git history/CLAUDE.md) — กติกาห้ามเก็บ
7. **MEMORY.md / INDEX.md drift** — pointer ใน `MEMORY.md` หรือ `memory/INDEX.md` ที่ไฟล์ปลายทางถูกลบไปแล้ว
8. **Tier report (ใหม่)** — วัดขนาด `MEMORY.md` เทียบงบ ≤4KB (`wc -c`):
   - ถ้าเกินงบ → ระบุ **demote candidate** เป็นรายบรรทัด พร้อมเหตุผลอ้างเกณฑ์ B∨C จาก `~/.claude/CLAUDE.md` (trigger มองไม่เห็น ∨ พลาดแล้วแพง) — entry ที่ตกเกณฑ์ B∨C คือตัวที่เสนอ demote (บีบเหลือ pointer ระดับหมวดใน MEMORY.md + ย้ายรายละเอียดไป INDEX.md/ไฟล์ย่อยเดิม)
   - ใช้ `search_session_transcripts` เช็ค**usage จริง**ของหัวข้อ/entry ย้อนหลัง — threshold เริ่มต้น **5 session** (entry ที่ใช้จริง <1 ใน 5 session ล่าสุดและไม่เข้า B∨C คือ demote candidate ที่แข็งแรงกว่า) หมายเหตุ: เท่าที่ทดสอบ เครื่องมือนี้ค้นย้อนได้ลึกอย่างน้อยประมาณ 1 สัปดาห์ข้ามหลายโปรเจกต์/session — ถ้าค้นแล้วได้ผลว่างเปล่าผิดปกติ (คาดว่าต้องเจอแต่ไม่เจอ) ให้ตัดสินจากเกณฑ์ B/C อย่างเดียวแล้วติดป้าย **"ไม่มี usage data"** ในรายงาน อย่าเดา
   - Output เป็นตาราง: `<ไฟล์/entry>` — ขนาด (byte) — usage (กี่ session จาก 5 ล่าสุด หรือ "ไม่มี usage data") — เกณฑ์ B/C ผ่านไหม — verdict (resident/demote candidate)
   - **read-only เสมอ** — เสนอ candidate รอ user ยืนยันก่อนย้ายจริง เหมือน check ข้ออื่น
9. **INDEX.md coverage (ใหม่)** — ถ้าโปรเจกต์มี `memory/INDEX.md` (2-tier แล้ว) เช็คว่าครอบไฟล์ใน `memory/*.md` ครบ 100% (`ls memory/*.md | wc -l` เทียบ `grep -c '^- ' memory/INDEX.md` ไม่นับ INDEX.md/MEMORY.md เอง) — ไฟล์ไหนไม่มี pointer ทั้งใน MEMORY.md และ INDEX.md ให้ฟ้องเป็น orphan ตามข้อ 3

## Output
รายงานเป็นรายการจัดกลุ่มตามหัวข้อ 1–9 แต่ละข้อ: `<ไฟล์>` — ปัญหา — เสนอ (ลบ/รวม/อัพเดต/เพิ่ม pointer/แก้ link). จัดลำดับ stale+ขัดแย้ง ก่อน (อันตรายสุด — พาหลงทาง) แล้วค่อย orphan/link/format แล้วปิดท้ายด้วย **Tier report** (ข้อ 8-9) เป็น section แยกชัดเจน

ถ้าผู้ใช้สั่ง "แก้เลย" → ทำทีละข้อ, การลบ/รวมต้องสรุปสั้น ๆ ว่าทำไม แล้วอัพเดต MEMORY.md ให้ sync

## คู่กับสกิลที่มี
- เจอ memory ที่เป็น learning/feedback ซ้ำ → รวมตามแนว `consolidate-memory`
- ตรวจเสร็จเป็นจังหวะดีจะ run หลังปิด session ใหญ่ หรือก่อนเริ่มงานต่อในโปรเจกต์เดิม
- finding ที่โผล่ซ้ำทุกรอบ lint = สัญญาณ poka-yoke: ถามว่าทำให้ state นั้นเกิดไม่ได้ตั้งแต่ตอนเขียน memory ได้ไหม (template/naming rule/hook) แทนที่จะรอ lint จับทุกครั้ง
