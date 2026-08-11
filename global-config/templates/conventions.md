<!--
  TEMPLATE — คัดลอกไปเป็น docs/conventions.md ในโปรเจกต์จริง แล้วเติมช่อง <...>
  ที่มา: พอร์ต green-gate + negative-fixture จาก repo some-other-project/link
  ของที่ซ้ำกับ skill ที่มีอยู่แล้ว (ADR = ecc:architecture-decision-records ·
  gate = ecc:quality-gate) — ไฟล์นี้เก็บเฉพาะ "ส่วนที่ยังไม่มี" + กติกาแบ่งเขต
  เพดาน: เนื้อ (นอก comment) ≤40 บรรทัด — เนื้อหาใหม่ไป ADR/log ไม่ใช่ที่นี่

  ── เลือก PRESET ตาม stack แล้วเติมลงช่อง <...> (ลบ preset อีกอันทิ้ง) ──
  PRESET A — Python web:
    gate: `just check` = ruff format --check · ruff check · pyright strict ·
          import-linter (layer) · pytest
    negative proof: fixture ผิดใน tests/fixtures/bad/ (เก็บถาวร) +
          test assert ว่า checker "ปฏิเสธ" fixture → test ผ่าน = gate เขียวถาวร
    tooling: <uv/poetry pin py version> · schema เปลี่ยน = alembic command เดียว

  (ถ้า stack เป็นอย่างอื่น เช่น game engine ที่มี custom MCP/authoring tool ของตัวเอง —
   เขียน PRESET เพิ่มเองตามแนว A ด้านบน: gate command, negative-proof pattern,
   กติกาพิเศษเรื่องแก้ไฟล์ผ่าน tool เฉพาะแทน Edit/Write ตรง)
-->

# <PROJECT> — กติกา

## หลักเดียวที่ครอบทุกอย่าง
> **โค้ดบอก "อะไร" · docs บอก "ทำไม" · test บอก "ต้องเป็นแบบนี้" — ห้ามให้สองอันบอกเรื่องเดียวกัน**
> วันที่มันขัดกัน จะไม่รู้ว่าอันไหนโกหก → เจอซ้ำ ยกขึ้นที่เดียว (single source)

## Green-gate = DoD (Definition of Done)
- **คำสั่งเดียวที่ทุก commit ต้องผ่าน:** `<gate command เช่น just check / npm run check / ./check.ps1>`
  ครอบ: `<format · lint · type-check strict · boundary/layer · test>`
- **"กฎที่ไม่มี test = คำขอร้อง"** — กฎทุกข้อที่อยากบังคับ ต้องมี test ในด่าน ไม่งั้นมันจะโดนผ่อนวันแรกที่ขี้เกียจ

## Negative-fixture — ด่านต้องเคยเห็นมัน "ปฏิเสธของผิด" ด้วยตา (P3)
กฎที่ไม่เคยเห็น test ปฏิเสธของผิด = ไม่รู้ว่ามันเงียบอยู่หรือเปล่า (green-washing) ดังนั้น:
1. แต่ละกฎ → เก็บ **fixture ที่จงใจผิด** ถาวรใน `tests/fixtures/bad/` (ไม่ลบ) + เขียน test ที่ **assert ว่า checker ปฏิเสธ fixture นั้น** — test ผ่าน = ปฏิเสธสำเร็จ → **gate เขียวถาวร** (ไม่ใช่แดงถาวร) · **(รูปแบบ fixture ขึ้นกับ stack — บาง stack ใช้ tamper→restore แทนไฟล์เสียค้าง tree ตรงๆ)**
2. **ก่อนผูก assertion นั้น** รัน checker กับ fixture ตรงๆ **เห็นมันโดนปฏิเสธด้วยตาหนึ่งครั้ง** (หรือเขียน test แบบ TDD-red ก่อน implement กฎ) — ไม่งั้นไม่รู้ว่า assertion เขียวเพราะกันได้จริง หรือเพราะไม่เคยจับอะไรเลย
3. บันทึกใน docs/log: _"เห็น checker ปฏิเสธ fixture <X> แล้ว"_
4. finding จาก review/verify ที่ CONFIRMED + เป็นบั๊กเกิดซ้ำได้ → **จบชีวิตเป็น bad fixture** (gate โตเองจากงานจริง)

## ADR — ใช้ `ecc:architecture-decision-records` แต่บังคับเพิ่ม
- ทุกใบต้องมีฟิลด์ **"ของเดิม/ทางที่ไม่เลือก พลาดตรงไหน"** — ฟิลด์นี้แหละที่ทำให้ ADR ถูกอ่านจริง (มันเก็บบทเรียน ไม่ใช่แค่คำตัดสิน)
- **ADR ห้ามแก้** · เปลี่ยนใจ = เขียนใบใหม่ `Supersedes: ADR-XXXX` (ประวัติความคิดต้องอยู่)
- index ที่ `docs/adr/README.md` **≤1 จอ** หนึ่งบรรทัด/ใบ

## เขียนอะไร ไปที่ไหน (routing — กัน P1 พัง)
| เนื้อหา | ที่อยู่ |
|---|---|
| ทำไมโค้ดตรงนี้เป็นแบบนี้ / "ห้าม" | comment/docstring ในโค้ด |
| ตัดสินระดับสถาปัตย์ | `docs/adr/` (immutable) |
| วันนี้ทำอะไร + ระวังอะไร + หนี้ค้าง | `docs/log/` |
| register หนี้/finding non-blocker | ท้าย log ล่าสุด (ถังเดียว) |
| เรื่อง user / glossary / ข้ามโปรเจกต์ | ระบบ memory global |
