---
name: docx-th-sarabun-sizing
description: Use when setting TH Sarabun New font and sizing in a .docx report — must fix the base Word style ("Normal"), not just per-run overrides, and follow the established point-size scale (title 24pt, headers 18pt, body 16pt).
---

## TH Sarabun New docx: sizing scale + ต้องแก้ base style ไม่ใช่แค่ per-run
เวลาแปลงรายงานภาษาไทยไปเป็น TH Sarabun New (ทั้งจาก pipeline HTML→Word COM→post-process หรือ python-docx ตรง) มี 2 เรื่องที่ต้องทำถูกตั้งแต่รอบแรก ไม่งั้นจะเจอ "ตัวอักษรไม่เท่ากัน/บางจุดยังเล็ก" ซ้ำแล้วซ้ำเล่า:

1. **ต้องแก้ font/size ที่ระดับ base style ("Normal", "Normal (Web)" ฯลฯ) ด้วย ไม่ใช่ไล่ตั้งแค่ระดับ run** — helper ที่ตั้ง `w:cs`/`szCs`/`bCs`/`lang` ให้ style (complex-script properties) **mirror จากค่า `sz` ที่ style นั้นมีอยู่แล้วเท่านั้น ไม่ได้เปลี่ยนตัว `sz`/ฟอนต์ ascii ของ style เอง** ดังนั้นต้องตั้งชื่อฟอนต์และขนาดของ base style เอง ถ้า base style เดิมเป็น Word default (เช่น Angsana New 14pt ที่มากับ Word COM conversion จาก HTML) ตัวอักษรไหนก็ตามที่ **ไม่มี run-level override ชัดเจน** (เช่น เซลล์ตารางที่ user พิมพ์/แก้เพิ่มเองทีหลังใน Word โดยไม่ได้ผ่านสคริปต์, ย่อหน้าว่าง, ข้อความที่เพิ่งพิมพ์ใหม่) จะ fallback ไปใช้ font/size เดิมของ style ทันที ทำให้ตัวอักษรบางจุดเล็ก/ฟอนต์ไม่ตรงทั้งที่ run อื่นถูกตั้งครบแล้ว — วิธีแก้: หลังไล่ตั้ง per-run เสร็จ ให้ตั้ง `doc.styles['Normal'].font.name` / `.font.size` (และ `Normal (Web)` ถ้ามี) ให้เป็นค่าเดียวกันด้วยเสมอ อย่าพึ่ง helper ตัวนั้นอย่างเดียว
2. **scale ที่ลงตัวสำหรับรายงาน TH Sarabun New** (สำหรับเอกสารที่แปลงมาจาก HTML ผ่าน Word COM): ชื่อเรื่อง (title, ตัวหนา กลาง) 24pt · หัวข้อเลขลำดับแบบ "N. หัวข้อ" (ตัวหนา) 18pt · สมการ/สูตรเน้น (ตัวหนา กลาง) 18pt เท่าหัวข้อ · เนื้อความ/หัวข้อย่อยระดับรอง (ปกติ ไม่หนา) 16pt · caption ตาราง ถ้าอยากให้เด่นเท่าหัวเรื่องตั้ง 24pt ตัวหนาได้ (ไม่ใช่บั๊ก เป็นทางเลือกจัดวาง) — ใช้เป็นจุดตั้งต้นครั้งหน้าแทนการเดาใหม่จากสัดส่วน Calibri เดิม (ซึ่งมักจะเล็กเกินไปเมื่อสลับเป็น TH Sarabun New เพราะฟอนต์นี้ด้วยพอยต์เท่ากันมองด้วยตาจะเล็กกว่า Calibri พอสมควร)
3. **บล็อกโค้ด/monospace (เช่น style "HTML Preformatted" ฟอนต์ Consolas) ห้ามแตะฟอนต์/ไซซ์ตามข้อ 2** — เก็บไว้ตามเดิมเสมอ เปลี่ยนฟอนต์โค้ดจะทำให้การเยื้องบรรทัด/การจัดคอลัมน์ในโค้ดเพี้ยน

- **เหตุผล:** สคริปต์ตั้งค่าระดับ run ครอบคลุมเฉพาะ run ที่มีอยู่ตอนรันสคริปต์ ไม่ครอบคลุม run ใหม่ที่เกิดทีหลัง (เช่นเซลล์หัวตารางหรือข้อความที่พิมพ์เพิ่มใน Word) หรือ run ที่ inherit จาก style ล้วนๆ ถ้า style "Normal" ยังเป็นค่าเดิมจาก Word COM (เช่น Angsana New 14pt) ตัวอักษรเหล่านั้นจะ fallback ไปใช้ค่านั้น แม้ QA scanner จะผ่านครบ
- ใช้กับทุก project ที่สร้าง/แก้เอกสาร .docx ภาษาไทยด้วย TH Sarabun New ไม่ว่าจะผ่าน python-docx, สคริปต์ helper, หรือ Word COM — เช็ค base style เสมอ ไม่ใช่แค่ run
