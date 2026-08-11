<!--
  TEMPLATE — คัดลอกไปเป็น CLAUDE.md ที่ root ของโปรเจกต์ แล้วเติมช่อง <...>
  ที่มา: พอร์ตจาก CLAUDE.md ของ repo some-other-project/link (ตัวจริง ~40 บรรทัด)
  ไฟล์นี้ = "router" ชี้ทางเท่านั้น ไม่ใช่คลังเนื้อหา
  อย่าซ้ำกับ global CLAUDE.md (cost-routing / planning workflow / TDD มีระดับ global แล้ว) —
  ที่นี่เอาเฉพาะเรื่องเฉพาะโปรเจกต์นี้

  ── ตัวอย่างเติมช่องตาม stack (ดู PRESET เต็มใน docs/conventions.md) ──
  Python web:  gate = `just check` (ruff·pyright·import-linter·pytest·alembic)
               tooling = <uv pin py3.12> · schema = alembic command เดียว
  (stack อื่นที่มี custom authoring tool/MCP เป็นของตัวเอง — เขียน preset เพิ่มเองตามแนวนี้:
   gate command, negative-proof pattern, กติกาแก้ไฟล์ผ่าน tool เฉพาะแทน Edit/Write ตรง)
-->

# <PROJECT> — <หนึ่งบรรทัดว่าโปรเจกต์นี้คืออะไร>

> ไฟล์นี้ **≤45 บรรทัด** — ความรู้ใหม่ไป ADR/log/conventions, ที่นี่เพิ่มได้แค่ pointer
> (บวมเมื่อไหร่ = เริ่มซ้ำกับ docs = drift)

## เริ่มทุก session — อ่านก่อน
- `docs/log/` **ไฟล์ล่าสุด** — ค้างอะไร ระวังอะไร (log ที่ถูกอ่าน = log ที่จะถูกเขียนต่อ)
- `docs/adr/README.md` — ก่อนแตะเรื่องไหน อ่าน ADR ใบที่เกี่ยว (ทุกใบมี "ทำไม")
- `docs/conventions.md` — กติกาโค้ด/ออกแบบ + นิยาม gate

## หลักเดียวที่ครอบทุกอย่าง
> **code = อะไร · docs = ทำไม · test = ต้องเป็น — ห้ามให้สองอันบอกเรื่องเดียวกัน**

## DoD — ต้องเขียวก่อน commit
- `<gate command>` = `<format · lint · type strict · layers · test>`
- **กฎที่ไม่มี test = คำขอร้อง** · ด่านต้องเคยเห็นแดงบน bad fixture (ดู conventions)

## ก่อนปิดงานทุกครั้ง
- เขียน `docs/log/<วันนี้>.md`: **ทำไมตอนนี้ / ตัดสินใจ / ⚠️ระวัง / ยังไม่ทำ**
- ก่อนเขียน "ยังไม่ทำ" ถามเสียงดัง: **"หมกอะไรไว้ไหม?"** (surface หนี้ ห้าม over-claim)

## กติกาที่ห้ามลืม (เติมจากบั๊กจริงของโปรเจกต์นี้ — ให้แต่ละข้อผูก test)
1. <กฎ #1 ที่มาจากบั๊กจริง → test ตัวไหนบังคับ>
2. <กฎ #2 ...>
3. <...>

## หลัง review / audit
- ก่อนแก้ตาม finding: verify claim ด้วย workflow **adversarial-verify** (CONFIRMED = มี quote บรรทัดจริงเท่านั้น) → แก้ blocker ก่อน ที่เหลือลง register (ท้าย log) · CONFIRMED ที่เป็นบั๊กซ้ำได้ → เพิ่ม bad fixture (ดู conventions)

## เครื่องมือ / ข้อห้ามเฉพาะโปรเจกต์
- `<tooling: package manager, runtime pin, ฯลฯ>`
- `<ข้อห้ามเฉพาะ เช่น: git=ของจริง VPS=สำเนา ห้ามแก้บน server>`
