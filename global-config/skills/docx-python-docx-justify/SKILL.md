---
name: docx-python-docx-justify
description: Use when writing a .docx with python-docx that contains formulas, code, or manually line-broken text blocks — do not apply paragraph justify alignment to them, it stretches spacing unnaturally.
---

## python-docx: ห้าม justify กับสูตร/โค้ด/บล็อกที่ตัดบรรทัดเอง (บัญญัติ 2026-08-13)
เวลาสร้าง .docx ด้วย python-docx แล้วมีเนื้อหาที่เป็นสูตรคำนวณ, สมการ, หรือบล็อกข้อความที่ตัดบรรทัดเองด้วย `\n` ภายใน paragraph เดียว (ไม่ใช่ prose ปกติ) → **ห้ามตั้ง `alignment = WD_ALIGN_PARAGRAPH.JUSTIFY`** กับ paragraph นั้นเด็ดขาด ให้ปล่อยเป็น left align ปกติ (ไม่ set alignment เลย)

- **เหตุผล/เคสจริง (2026-08-13):** สร้างการบ้าน engineering economy ใส่สูตร PW แบบหลายบรรทัดในพารากราฟเดียว (คั่นด้วย `\n`) แล้วตั้ง align="justify" ทั้งพารากราฟ ผลคือ Word ยืดช่องว่างระหว่างคำ/เทอมในทุกบรรทัดยกเว้นบรรทัดสุดท้ายให้เต็มความกว้างหน้ากระดาษ (พฤติกรรมปกติของ justify กับ manual line-break หลายบรรทัด) ทำให้สูตรออกมาเป็น "PW　　　=　　　　　　　　-8,500,000" ห่างเป็นช่องๆ ดูปลอมทันทีที่เห็น — user เช็คจาก screenshot จริงใน Word แล้วบอกว่า "การจัดวางแบบนี้คงไม่มีคนทำกัน"
- **หลักการทั่วไปที่ดึงมาจากเคสนี้:** justify (`WD_ALIGN_PARAGRAPH.JUSTIFY`) เหมาะกับ **prose ความเรียงยาวที่ wrap เองตามความกว้างหน้ากระดาษ** เท่านั้น (แบบเนื้อหา โจทย์, คำอธิบาย, สรุป ในเอกสารเดียวกันที่ไม่มีปัญหา) — ไม่เหมาะกับเนื้อหาที่ **มนุษย์คุมการตัดบรรทัดเอง** ไม่ว่าจะเป็นสูตรคณิตศาสตร์, code block, ASCII table, หรือ list ที่จงใจให้แต่ละบรรทัดสั้นยาวไม่เท่ากัน — เพราะ justify จะพยายามยืดทุกบรรทัดให้เต็มความกว้างเสมอไม่สนความยาวจริงของเนื้อหา
- **วิธีเช็คก่อนส่ง:** ถ้า paragraph ไหนมี `\n` (multi-line ในรันเดียว) หรือเป็นเนื้อหาสูตร/โค้ด ให้ตรวจว่าไม่ได้ตั้ง justify ติดมาจาก default/copy-paste จากฟังก์ชัน helper ตัวอื่นในสคริปต์เดียวกัน (เคสนี้พลาดเพราะใช้ฟังก์ชัน `body()` ตัวเดียวที่มี parameter align="justify" ใช้ร่วมกันทั้งสูตรและ prose)
- ใช้กับทุก project ที่สร้างเอกสาร .docx ผ่าน python-docx (ไม่ใช่แค่ thai-docx/การบ้าน) — เช็คทุกครั้งที่มีเนื้อหาแบบสูตร/โค้ด/ตารางข้อความในเอกสาร
