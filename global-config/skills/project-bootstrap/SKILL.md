---
name: project-bootstrap
description: One-shot scaffold that wires a repo into the docs-driven continuity system (thin CLAUDE.md router + docs/log/ + docs/adr/ + docs/conventions.md + memory pointer) so a brand-new session inherits context without chat history. Trigger on /project-bootstrap, or proactively when starting substantial multi-session work in a repo that has neither a project-root CLAUDE.md nor docs/log/. Skip for throwaway/single-session work, or if the repo already has CLAUDE.md + docs/log/ (already bootstrapped — use close-out-log instead).
---

# Project Bootstrap — ติดตั้งระบบไม่ลืมข้ามเซสชัน

> เป้าเดียว: session ใหม่ล้วนๆ (chat history หาย) ถามเรื่องที่ตัดสินใจไปก่อนหน้า ต้องตอบถูกจาก docs/memory — ไม่ใช่พึ่งความจำแชต

พอร์ต pattern จาก repo ที่ "ไม่ลืม" จริง (`leenawatling-bit/link`, และพบ pattern เดียวกันใน Sugar Daddy / Cheeky Ghost Girl: `.claude/docs/*_CONTRACT.md` + memory ต่อ worktree) — งานนี้แค่ **instantiate** ของที่มี template อยู่แล้ว ไม่ต้องออกแบบใหม่

## เช็คก่อนเริ่ม (อย่าทำซ้ำ)
- มี `CLAUDE.md` ที่ root **และ** `docs/log/` อยู่แล้ว → repo นี้ bootstrap แล้ว ข้ามไปใช้ `close-out-log` ตามปกติ
- งานที่กำลังจะทำเป็น throwaway/single-session → ข้าม ไม่คุ้มตั้งโครง

## ขั้นตอน
1. **สำรวจ repo ก่อนเติมช่อง** — stack (Python/Node/Ren'Py ฯลฯ), gate command ที่มีอยู่แล้ว (`justfile`, `package.json` scripts, `Makefile`), มี git หรือไม่
2. **คัดลอก `~/.claude/templates/project-CLAUDE.md`** → `<repo>/CLAUDE.md` เติมช่อง `<...>` ตาม stack จริง (ดู PRESET ในตัว template: Python web ใช้ PRESET A, Ren'Py ใช้ PRESET B) — ต้อง **≤45 บรรทัด**, ห้าม dump เนื้อหา conventions ลงมาซ้ำ
   - ตอน scaffold ให้ฝัง guardrail ชั้น 1 (poka-yoke) ตั้งแต่วันแรก: artifact ที่ generate ได้ → gitignore ทันที, config ที่ขาดแล้วพัง → ให้ build/hook fail ดังๆ, และทุกอย่างที่คิดจะเขียนเป็น "note อย่าลืม" ใน template → แปลงเป็น hook/check แทนถ้าทำได้
3. **คัดลอก `~/.claude/templates/conventions.md`** → `<repo>/docs/conventions.md` (หรือชื่อไฟล์ที่ repo ใช้อยู่แล้ว เช่น `docs/03-Conventions.md`) เติม gate command + negative-fixture ตาม stack จริง
4. **สร้าง `docs/log/` + entry แรก** ผ่าน skill `close-out-log` — เขียนสถานะปัจจุบันของ repo ตอนนี้ (ทำไมตอนนี้ / ตัดสินใจที่มีอยู่แล้ว / ระวัง / ยังไม่ทำ) เพื่อ seed loop "อ่าน log ก่อนเริ่ม session"
5. **สร้าง `.claude/docs/README.md`** สั้นๆ อธิบาย convention: หนึ่งหัวข้อ/ไฟล์, ตั้งชื่อ `TOPIC_CONTRACT.md` (ข้อตกลงถาวร) หรือ `TOPIC_HANDOFF_YYYY-MM-DD.md` (ส่งไม้ต่อรายวัน) — ตามที่พบใน Sugar Daddy
6. **เขียน memory pointer เดียว** (type `project`, ผ่าน memory system ปกติ) บอกว่า repo นี้ bootstrap แล้ว + docs อยู่ไหน — เป็น discovery path ให้ session อื่นเจอ
7. **เพิ่มบรรทัดตัวเองใน `~/.claude/SKILLS_INDEX.md`** ถ้ายังไม่มี (ตามฟอร์แมตไฟล์เดิม)

## เกณฑ์รับ ("behaves like a repo that doesn't forget")
1. `CLAUDE.md` ≤45 บรรทัด อยู่ที่ root, ไม่ซ้ำเนื้อหาที่อยู่ใน memory/docs อยู่แล้ว
2. `docs/log/` มี ≥1 entry, และ session ถัดไปอ่านก่อนเริ่มงานจริง (ไม่ใช่แค่มีไฟล์เฉยๆ)
3. การตัดสินใจที่มีอยู่แล้ว (ถ้ามี) ถูกแปลงเป็น `.claude/docs/` หรือ `docs/adr/` — หนึ่งเรื่อง/ไฟล์
4. `MEMORY.md` ของ session/project นั้นมี pointer ชี้ไปที่จุดเริ่มอ่าน
5. **Cold-session test:** เปิด session ใหม่ ถามเรื่องที่ตัดสินใจไปก่อน bootstrap → ตอบถูกจาก docs/memory ล้วนๆ

## หมายเหตุ
- **flexible:** จำนวน/ชื่อไฟล์ doc ปรับตาม stack — **rigid:** เพดาน 45 บรรทัดของ CLAUDE.md และ "หนึ่งเรื่องหนึ่งที่" (P1, กันซ้ำกับ close-out-log/ADR)
- ทำใน main เสมอ (เหมือน close-out-log) — งานนี้ต้องอ่าน repo จริงเพื่อเติมช่องให้ตรง ไม่ใช่งานกลไกที่ spawn ได้
- ถ้า repo มี `.claude/docs/` หรือ ADR อยู่แล้วบางส่วน → เติมเฉพาะที่ขาด อย่าสร้างทับ
