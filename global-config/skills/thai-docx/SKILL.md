---
name: thai-docx
description: ใช้ทุกครั้งที่ต้องสร้างหรือแก้ไฟล์ Word (.docx) ที่มีภาษาไทย เพื่อแก้ปัญหาการแสดงผลภาษาไทยใน Microsoft Word — ฟอนต์เพี้ยน วรรณยุกต์/สระลอยหรือซ้อนผิด ตัวอักษรเล็กผิดขนาด ตัวหนา/เอียงไม่ติด และการตัดคำ/เว้นวรรค/จัดชิดขอบเพี้ยน รวมถึงการ "แยกฟอนต์ตามภาษา" (อังกฤษใช้ฟอนต์ละติน ไทยใช้ฟอนต์ไทย ในรันเดียวกัน) ครอบคลุมการตั้งค่า "อักษรเชิงซ้อน" (complex script: w:cs, w:szCs, w:bCs, w:lang bidi) ที่ python-docx ไม่ได้ตั้งให้โดยอัตโนมัติ เรียกใช้เมื่อผู้ใช้บอกว่า "ทำ Word ภาษาไทยแล้วฟอนต์เพี้ยน", "ตัวหนังสือไทยเล็ก", "วรรณยุกต์ลอย", "ตัดคำผิด", "TH Sarabun New ไม่ขึ้น", "อยากแยกฟอนต์อังกฤษกับไทย", หรือทุกครั้งที่สร้าง .docx ภาษาไทยจาก python-docx ใช้ร่วมกับ skill อื่นที่ส่งออกเอกสารไทย ทุกตัวที่ส่งออกเอกสารไทยเป็น Word. Use this whenever generating or editing Thai-language Word documents to fix Thai font, tone-mark/vowel positioning, font-size, bold, line-breaking, and per-language font separation (Latin vs Thai).
---

# thai-docx — ทำไฟล์ Word ภาษาไทยให้แสดงผลถูกต้อง + แยกฟอนต์ตามภาษา

Skill นี้แก้ปัญหา "ภาษาไทยใน Word เพี้ยน" ที่เกิดประจำเวลาสร้าง .docx ด้วย python-docx
โดยตั้งค่าฝั่ง **อักษรเชิงซ้อน (complex script)** ให้ครบ ซึ่ง python-docx ไม่ได้ตั้งให้เอง
และรองรับการ **แยกฟอนต์ตามภาษา** — อังกฤษใช้ฟอนต์ละติน ไทยใช้ฟอนต์ไทย ในรันเดียวกัน

ใช้คู่กับ skill อื่นที่ส่งออกเอกสารภาษาไทย — **ทุกครั้งที่จะ `doc.save()` ไฟล์ที่มี
ภาษาไทย ให้เรียก `enforce_thai(doc)` ก่อน**

> 🔴 **ค่า default ต้องเป็นฟอนต์เดียว (TH Sarabun New) ทั้งเอกสารเสมอ**
> อย่าใส่ `latin_font="Times New Roman"` (หรือฟอนต์ละตินอื่น) **เอง** โดยที่ user ไม่ได้
> ขอ "แยกฟอนต์อังกฤษ-ไทย" ชัดเจน — เรียก `enforce_thai(doc)` หรือ `new_thai_document(...)`
> เฉย ๆ โดยไม่ส่ง `latin_font` ก็พอ (ฟังก์ชันจะใช้ `font` เป็นฟอนต์ละตินให้เองอัตโนมัติ)
> ตัวอย่างในไฟล์นี้หลายจุดโชว์ `latin_font="Times New Roman"` เพราะกำลังสาธิต "ฟีเจอร์
> แยกฟอนต์" — **อย่าก็อปแพทเทิร์นนั้นไปใช้เป็น default เอง** ถ้า user ไม่ได้ขอ

ไฟล์ในสกิล:
- `scripts/thai_docx.py` — helper หลัก (enforce_thai + builder API)
- `scripts/verify_thai_docx.py` — QA scanner ตรวจก่อนส่ง
- `references/thai-rendering-problems.md` — เจาะลึกต้นตอปัญหา + โมเดลแยกฟอนต์

---

## ต้นตอของปัญหา (อ่านสั้น ๆ)

Word เลือกฟอนต์ **ทีละตัวอักษร** จากช่วง Unicode ไม่ใช่ทีละ run ภายใน run เดียวมี
"ช่องฟอนต์" หลายช่อง ภาษาไทยอยู่ช่อง "อักษรเชิงซ้อน" (`w:cs`) แต่ python-docx ตั้งให้
เฉพาะฝั่งละติน (`w:ascii`) → ฝั่งไทยถูกปล่อยว่าง:

| ตั้งให้ (ละติน) | ไม่ได้ตั้ง (ไทย) | อาการใน Microsoft Word |
|---|---|---|
| `w:rFonts/@w:ascii` | `w:rFonts/@w:cs` | ฟอนต์ไทย fallback → **วรรณยุกต์/สระลอย หรือตัวเพี้ยน** |
| `w:sz` | `w:szCs` | **ตัวไทยหดเหลือ ~10pt** ทั้งที่ตั้ง 16pt |
| `w:b` | `w:bCs` | **ตัวหนาไม่ติด**ตัวไทย |
| `w:i` | `w:iCs` | ตัวเอียงไม่ติดตัวไทย |
| — | `w:lang/@w:bidi="th-TH"` | **ตัดคำ/เว้นวรรค/จัดชิดขอบเพี้ยน** |

> ปัญหานี้มัก**ไม่โผล่ใน LibreOffice หรือ preview** เพราะมันเดาภาษาไทยจาก Unicode ให้เอง
> แต่จะโผล่ชัดใน **Microsoft Word** (โปรแกรมที่ผู้รับเอกสารใช้จริง) อย่าตัดสินจาก preview —
> ให้รัน `verify_thai_docx.py` แทน

เพราะ Word แยกฟอนต์ "ต่อตัวอักษร" อยู่แล้ว เราจึง**แยกฟอนต์ภาษาได้โดยไม่ต้องตัดข้อความ
เป็นหลาย run** — แค่ตั้ง `w:ascii` = ฟอนต์ละติน และ `w:cs` = ฟอนต์ไทย ในรันเดียวกัน

รายละเอียดเชิงลึกอยู่ใน `references/thai-rendering-problems.md`

---

## วิธีใช้

helper อยู่ที่ `scripts/thai_docx.py` — copy ไปไว้ข้าง script ที่สร้างเอกสาร หรือ
`sys.path.insert(0, ".../thai-docx/scripts")` แล้ว import

### แบบที่ 1 — บังคับทั้งเอกสารทีเดียว (ใช้บ่อยสุด แนะนำ)

สร้างเอกสารด้วย python-docx ตามปกติ แล้ว **เรียก `enforce_thai(doc)` บรรทัดเดียวก่อน save**:

```python
from docx import Document
from thai_docx import enforce_thai

doc = Document()
doc.add_heading("รายงานสรุปผลการขาย", level=1)
doc.add_paragraph("จัดทำที่กรุงเทพมหานคร เมื่อวันที่ ๑ มิถุนายน พุทธศักราช ๒๕๖๙")
# ... เพิ่มเนื้อหา ตาราง ฯลฯ ...

enforce_thai(doc)            # ตั้ง cs/szCs/bCs/lang ให้ทุก run + style + theme + settings
doc.save("./output/report.docx")
```

`enforce_thai` ไล่จัดการให้ครบ: ทุก run ในเนื้อ ในตาราง (ซ้อนได้) ใน header/footer,
ทุก style (รวมหัวข้อ), theme (`a:cs`), docDefaults และ settings (ตัดคำไทยทั้งเอกสาร)
โดย **ไม่ทำให้หัวข้อหด** — run ที่ไม่ระบุขนาดเองจะสืบทอดขนาดจาก style ตามเดิม

### แยกฟอนต์ตามภาษา (อังกฤษ vs ไทย) — ตัวเลือกเสริม เรียกเฉพาะตอน user ขอเท่านั้น

⚠️ ส่วนนี้เป็น**ฟีเจอร์เสริม ไม่ใช่ default** — เรียกเฉพาะตอน user พูดชัดเจนว่า
"อยากแยกฟอนต์อังกฤษกับไทย" เท่านั้น ถ้า user ไม่ได้พูดอะไร ให้ใช้ฟอนต์เดียว (ข้าม
ส่วนนี้ไปเลย ไม่ต้องส่ง `latin_font`)

ส่ง `latin_font` เพื่อให้อังกฤษกับไทยใช้คนละฟอนต์ใน run เดียวกัน:

```python
# อังกฤษ = Times New Roman, ไทย = TH Sarabun New (ในประโยคปนกันก็แยกเอง)
enforce_thai(doc, font="TH Sarabun New", latin_font="Times New Roman", default_size=16)
```

- `font` → ฟอนต์ฝั่งไทย (`w:cs`)
- `latin_font` → ฟอนต์ฝั่งอังกฤษ (`w:ascii`/`w:hAnsi`); ถ้าไม่ส่ง → ใช้ `font` เป็นละตินด้วย
- `latin_size` → ขนาดอังกฤษแยกจากไทยได้ เช่น `default_size=16, latin_size=14`
  (TH Sarabun ดูเล็กกว่าฟอนต์ละตินที่พอยต์เท่ากัน อยากบาลานซ์ก็ปรับตรงนี้)

พารามิเตอร์ `enforce_thai` ทั้งหมด:
- `font="TH Sarabun New"` — ฟอนต์ไทย (default)
- `latin_font=None` — ฟอนต์ละติน (None = ใช้ `font` เป็นละตินด้วย)
- `default_size=16` — ขนาดไทยสำหรับ run ที่ไม่ระบุขนาดเอง
- `latin_size=None` — ขนาดละตินแยก (None = เท่าไทย)
- `set_latin=True` — ตั้งฟอนต์ละตินด้วย; `False` = แตะเฉพาะฝั่งไทย เก็บฟอนต์อังกฤษเดิม
- `force_size=False` — `True` = เขียนทับขนาดทุก run (ระวังหัวข้อจะเท่าเนื้อ)
- `skip_latin_fonts=None` — เซตชื่อฟอนต์ละตินที่ห้าม `enforce_thai` ยัดทับ (ดูกับดักด้านล่าง)

> ⚠️ **กับดัก: บล็อกโค้ด/monospace หายเงียบถ้าเรียก `enforce_thai` ทีหลัง**
> ถ้าสคริปต์ตั้ง `latin_font` แยกเฉพาะบาง run ไว้ก่อน (เช่น `style_thai_run(run,
> latin_font="Consolas")` สำหรับตาราง terminal output/โค้ด C) แล้วค่อยเรียก
> `enforce_thai(doc, latin_font="Times New Roman")` ท้ายสคริปต์ตามแพทเทิร์นปกติ —
> `enforce_thai` จะ**เขียนทับ `w:ascii` ของทุก run แบบไม่มีคำเตือน** รวมถึง run
> Consolas ด้วย ทำให้ฟอนต์ monospace ที่ตั้งใจไว้หายไปเงียบ ๆ (คอลัมน์ตาราง/โค้ดเยื้องผิด)
> แก้ด้วยการส่ง `skip_latin_fonts={"Consolas"}` เข้า `enforce_thai()` — run ที่ `w:ascii`
> ตรงกับชื่อในเซตนี้อยู่แล้วจะถูกข้ามฝั่งละติน (ฝั่ง `w:cs`/bidi/bold-mirror ยังตั้งตามปกติ):
> ```python
> style_thai_run(code_run, font="TH Sarabun New", latin_font="Consolas")
> ...
> enforce_thai(doc, font="TH Sarabun New", latin_font="Times New Roman",
>              skip_latin_fonts={"Consolas"})
> ```
> อีกทางคือเรียง `enforce_thai(doc)` **ก่อน** เพิ่ม run โค้ด แล้วค่อย `style_thai_run`
> ทับทีหลัง — แต่ต้องระวังไม่ให้มีการเพิ่มเนื้อหาไทยอื่นหลังจากนั้นอีก (ไม่งั้นพลาด
> enforce ซ้ำ) วิธี `skip_latin_fonts` ปลอดภัยกว่าเพราะเรียก `enforce_thai` ครั้งเดียว
> ท้ายสุดตามแพทเทิร์นเดิมได้เลย

### แบบที่ 2 — คุมราย run ตอนสร้าง

```python
from thai_docx import new_thai_document, add_thai_paragraph, style_thai_run, set_paragraph_alignment

# ฟอนต์เดียว (TH Sarabun New) ทั้งเอกสาร — default ที่ถูกต้องถ้า user ไม่ได้ขอแยกฟอนต์
doc = new_thai_document(font="TH Sarabun New", size=16)

# ย่อหน้าจัดชิดขอบแบบไทย (thaiDistribute — เหมาะกับเนื้อหารายงาน)
add_thai_paragraph(doc, "ข้อ ๑  ผู้เขียนสรุปผลการขายของ Sales Team...", size=16, align="thai")

# คุม run เอง
p = add_thai_paragraph(doc, "")
style_thai_run(p.add_run("ข้อความตัวหนา Bold"), bold=True, size=16)
style_thai_run(p.add_run(" ปกติ"), size=16)

doc.save("./output/report.docx")
```

(ถ้า user ขอแยกฟอนต์อังกฤษ-ไทยจริง ๆ ค่อยเติม `latin_font="Times New Roman"` ทั้งใน
`new_thai_document(...)` และทุก `style_thai_run(...)` ที่มีข้อความอังกฤษ)

ตัวเลือก `align`: `"left" | "center" | "right" | "justify" | "thai"`
(`"thai"` = จัดชิดขอบแบบไทย/thaiDistribute เว้นช่องไฟสม่ำเสมอตามแบบเอกสารราชการ)

### แก้ไฟล์เดิมที่ได้รับมา

```python
from docx import Document
from thai_docx import enforce_thai
doc = Document("./input/draft.docx")
# ... แก้เนื้อหา ...
enforce_thai(doc, set_latin=False)   # ไม่ไปเปลี่ยนฟอนต์อังกฤษที่ผู้ใช้ตั้งใจใช้ แก้แค่ฝั่งไทย
doc.save("./output/draft_revised.docx")
```

---

## Indent ระดับหัวข้อ (ข้อ 1 / 1.1 / 1.1.1) — ไม่ใช่การกด tab

คำถามที่เจอบ่อย: "ข้อ 1" กับหัวข้อย่อย "1.1" ควรเยื้องห่างกัน 1 tab ไหม —
**คำตอบคือไม่ใช่ tab character แต่เป็น left indent ของย่อหน้า** ขั้นละ **1.25 ซม.**
(เท่ากับ default tab stop 1 ช่องพอดี หน้าตาจึงดูเหมือนกดแท็บ แต่โครงสร้างจริงต้องเป็น
paragraph indent ไม่ใช่อักขระ `\t` นำหน้าเลขข้อ — ใส่ `\t` จริงจะพังตอน wrap บรรทัดยาว
เพราะบรรทัดที่ตัดจะไม่เยื้องตามเลขข้อ)

สเกลมาตรฐาน (อ้างอิงรูปแบบเอกสารวิชาการ/ราชการไทย):

| ระดับ | ตัวอย่างเลขข้อ | Left indent | First-line indent |
|---|---|---|---|
| หัวข้อระดับ 1 | `1.` / "ข้อ 1" | 0.00 ซม. | 0.00 ซม. |
| หัวข้อระดับ 2 | `1.1` | 1.25 ซม. | 0.00 ซม. |
| หัวข้อระดับ 3 | `1.1.1` | 2.50 ซม. | 0.00 ซม. |
| ย่อหน้าเนื้อความ | — | 0.00 ซม. | 1.25 ซม. |

กฎสำคัญ: **หัวข้อทุกระดับ first-line indent ต้องเป็น 0 เสมอ** — ห้ามปล่อยให้หัวข้อ
สืบทอด first-line indent 1.25 ซม. ของย่อหน้าเนื้อความมา ไม่งั้นตัวเลขข้อจะเยื้องเพิ่ม
ผิดที่ซ้อนกับ left indent ที่ตั้งไว้แล้ว

ใช้ผ่าน helper:

```python
from thai_docx import add_thai_heading, add_thai_paragraph

add_thai_heading(doc, "ข้อ 1  บททั่วไป", level=1, size=18)
add_thai_heading(doc, "1.1  คำนิยาม", level=2, size=16)
add_thai_heading(doc, "1.1.1  คำนิยามเฉพาะ", level=3, size=16)

# ย่อหน้าเนื้อความใต้หัวข้อ — เยื้องบรรทัดแรก 1.25 ซม. ให้เข้าชุดกัน
add_thai_paragraph(doc, "เนื้อหาย่อหน้า...", size=16, align="thai", first_line_indent=True)
```

`add_thai_heading` ใช้ `doc.add_paragraph()` ธรรมดา ไม่ใช้ `doc.add_heading()`/style
`Heading N` ของ Word เอง — เพราะ style เริ่มต้นของ Word ไม่ได้ตั้ง indent ตามสเกลนี้ให้
และยังต้องคุมฟอนต์/ขนาดไทยเองผ่าน `style_thai_run` อยู่แล้ว จะ`enforce_thai(doc)`
ทับทีหลังตามปกติได้ (ไม่กระทบ indent เพราะ `enforce_thai` แตะแค่ฟอนต์/ขนาด/lang)

ถ้าต้องการ multilevel list numbering จริงของ Word (เลขข้อ auto-renumber) แทนการพิมพ์
เลขเอง — ยังต้องตั้ง left indent ตามสเกลนี้เหมือนกัน แค่ผูกกับ `w:numPr`/`w:abstractNum`
แทน (ซับซ้อนกว่า พิมพ์เลขเองตรงไปตรงมากว่าสำหรับเอกสารที่ไม่ต้อง renumber อัตโนมัติ)

---

## "อักษรห่าง" ใน Microsoft Word จริง (thaiDistribute ตัดกลางคำ)

อาการ: เปิดไฟล์ใน Word จริงแล้วย่อหน้า thaiDistribute มีตัวอักษรห่างเป็นช่อง ๆ
ทั้งที่ข้อความสะอาด (ไม่มีช่องว่างปลอม) — สังเกตว่าคำถูกตัด "กลางคำ" เช่น ธนาคารแ/บบ

สาเหตุ: Word บางสภาพแวดล้อม **ไม่ตัดคำไทย** ให้เอกสารที่สร้างจาก python-docx (ตัด
เฉพาะที่ช่องว่าง) พอเจอข้อความไทยยาวที่ไม่มีช่องว่าง + thaiDistribute Word ถูกบังคับ
ให้ตัดกลางคำแล้วยืดทีละตัวอักษรให้เต็มบรรทัด → อักษรห่าง (ข้อความที่พิมพ์เองใน Word
ไม่เป็น เพราะ Word ตัดคำให้ตอนพิมพ์)

วิธีแก้ที่ชัวร์และไม่ขึ้นกับว่า Word ตัดคำไทยเป็นไหม: **ใส่จุดตัดคำเอง** — แทรก
zero-width space (U+200B) ที่ขอบเขตคำไทย (ZWSP เป็นจุดตัดบรรทัดมาตรฐานตาม Unicode
ที่ทุกโปรแกรมรองรับ) Word จะตัดบรรทัดตรงรอยคำที่เราใส่ ไม่ตัดกลางคำอีก

**ตั้งแต่เวอร์ชันนี้ `enforce_thai` ใส่จุดตัดคำให้อัตโนมัติแล้ว** (auto_break=True) จึง
ไม่ต้องจำสั่งเอง — แค่เรียก `enforce_thai(doc, ...)` ก่อน save ก็กันอักษรห่างให้เลย
และถ้าเครื่องไม่มี pythainlp จะ "ข้ามพร้อมเตือน" ไม่ทำให้พัง (แต่ควรติดตั้งให้มี)

ต้องมี **pythainlp** (`pip install pythainlp --break-system-packages`) เป็นตัวตัดคำ
ถ้า import ไม่เจอ `enforce_thai` จะลอง pip install ให้อัตโนมัติครั้งเดียว

```python
from thai_docx import enforce_thai
# เรียกครั้งเดียว: ตั้งฟอนต์เชิงซ้อน + ใส่จุดตัดคำ ครบในตัว (ฟอนต์เดียวทั้งเอกสาร)
enforce_thai(doc, font="TH Sarabun New")
doc.save(...)
```

ถ้าอยากคุมเอง: `add_thai_paragraph(..., break_thai=True)` หรือ `break_thai_in_doc(doc)`
หรือปิดการตัดคำอัตโนมัติด้วย `enforce_thai(doc, auto_break=False)`

ใช้ร่วมกับการล้าง PDF ได้: ล้างก่อน (`from_pdf=True`/`clean_thai_in_doc`) แล้วค่อยให้
`enforce_thai` ใส่จุดตัดคำ — ลำดับนี้ถูกต้องเสมอ

> แนะนำให้ใช้ `break_thai` ทุกครั้งที่ใช้ thaiDistribute กับข้อความไทยยาว ๆ เพื่อกัน
> อาการอักษรห่างในทุกสภาพแวดล้อม (ZWSP มองไม่เห็น ไม่กระทบการอ่าน/การพิมพ์ต่อ)

---

## ข้อความที่ก๊อปจาก PDF (ช่องว่างปลอมทำให้อักษรห่าง)

อาการ: เวลาก๊อปข้อความไทยจาก PDF มาวาง แล้วจัดชิดขอบแบบไทย (thaiDistribute)
ตัวอักษรห่างเป็นช่อง ๆ เต็มบรรทัด — ทั้งที่พิมพ์เองไม่เป็น

สาเหตุ: ตัวแยกข้อความของ PDF แทรก **ช่องว่างปลอม** ระหว่างพยางค์/ตัวอักษรไทย (PDF เก็บ
glyph เป็นตัว ๆ ไม่รู้จักคำไทย) และมักมีอักขระล่องหน (zero-width space, no-break space,
soft hyphen) ปนมา พอวางในย่อหน้า thaiDistribute → ช่องว่างปลอมทุกตัวกลายเป็นจุดที่ Word
ดึงยืด → ห่างเป็นช่อง ๆ (พิมพ์เองไม่มีช่องว่างปลอม Word จึงตัดคำด้วยพจนานุกรมเอง ไม่ห่าง)

> นี่ไม่ใช่ปัญหาของ thaiDistribute — thaiDistribute ใช้ได้ตามปกติ ปัญหาอยู่ที่ "ข้อความ
> สกปรกจาก PDF" ต้องล้างก่อนวาง

วิธีแก้ — ล้างข้อความก่อนนำไปวางเสมอ:

```python
from thai_docx import clean_pdf_thai, add_thai_paragraph, enforce_thai

raw = "ใน ช่ ว ง ทศวรรษ ที่ ผ่าน มา ..."   # ข้อความที่ก๊อปจาก PDF
add_thai_paragraph(doc, raw, size=16, align="thai", from_pdf=True)  # ล้างให้อัตโนมัติ
# หรือล้างเองก่อน: clean = clean_pdf_thai(raw)
enforce_thai(doc, font="TH Sarabun New")
```

`clean_pdf_thai(text)` ทำ: normalize NFC, ลบอักขระล่องหน, แปลง unicode space เป็น space
ปกติ, ดึงสระ/วรรณยุกต์ที่หลุดกลับมาติดพยัญชนะ, และลบช่องว่างเดี่ยวที่ขนาบด้วยอักษรไทย
ทั้งสองข้าง (เก็บช่องว่างรอบอังกฤษ/ตัวเลข/วงเล็บไว้เสมอ — ไม่พังคำอังกฤษ)

- เผลอวางลงเอกสารไปแล้ว: `clean_thai_in_doc(doc)` ล้าง run ทั้งเอกสารทีเดียว
- อยากเก็บช่องว่างเว้นวรรคไทยที่จงใจ: `clean_pdf_thai(text, join_thai_spaces=False)`
  (แต่ thaiDistribute อาจยังยืดที่ช่องว่างเหล่านั้นบ้าง)

`verify_thai_docx.py` จะเตือนถ้าพบช่องว่างไทย-ไทยหรืออักขระล่องหนหลงเหลือ

---

## ตรวจผลด้วย QA scanner

หลัง save ทุกครั้ง ให้รัน QA scanner เพื่อยืนยันว่าตั้งค่าครบ (อย่าเชื่อ preview):

```bash
python scripts/verify_thai_docx.py ./output/report.docx --font "TH Sarabun New"
# ถ้าแยกฟอนต์ ตรวจฝั่งละตินด้วย:
python scripts/verify_thai_docx.py ./output/report.docx --font "TH Sarabun New" --latin-font "Times New Roman"
```

- exit 0 = ผ่าน พร้อมส่ง
- exit 1 = ยังมี run/ระดับเอกสารที่ตั้งค่าไม่ครบ → กลับไปเรียก `enforce_thai` แล้วตรวจซ้ำ

script รายงานเป็นราย run ว่าตรงไหนขาด `w:cs` / `w:szCs` / `w:bidi` พร้อมอาการที่จะเกิด
และตรวจ `settings.xml` ว่าตั้ง `themeFontLang bidi` แล้วหรือยัง

---

## python-docx vs Claude in Word (Office.js) — คนละเส้นทาง

ปัญหาฟอนต์ไทยเพี้ยนนี้เกิดเฉพาะเส้นทาง **python-docx** เพราะเราเขียน XML ดิบเอง

เวลาใช้ **Claude in Word** (add-in) พิมพ์ไทยมักไม่เพี้ยน เพราะข้อความแทรกผ่าน object
model ของ Word เอง Word จะใส่ฟอนต์ฝั่งเชิงซ้อนและ detect ไทยให้อัตโนมัติ — แต่เส้นทาง
add-in มีปัญหาคนละเรื่องคือ thaiDistribute ไม่ติดกับย่อหน้าที่พิมพ์ใหม่

สรุป: ปัญหาฟอนต์ไทย/ขนาด/หนา/ตัดคำเพี้ยน + การแยกฟอนต์ เกิดกับ python-docx ที่สร้าง .docx ให้ใช้ skill **thai-docx** (นี่) ส่วนเส้นทาง add-in อยู่นอกขอบเขต

---

## ค่า default

- ฟอนต์: **TH Sarabun New** ขนาด **16pt** (เนื้อความ)
- กระดาษ A4 ขอบ 2.54 ซม. ทุกด้าน
- เนื้อหารายงาน: จัดชิดขอบแบบไทย (`align="thai"`)
- output ไปที่ `./output/`

ค่าพวกนี้เป็น default ของ `enforce_thai` / `new_thai_document` อยู่แล้ว ปรับได้ผ่าน
พารามิเตอร์ `font` / `latin_font` / `default_size`

---

## เรื่องการติดตั้งฟอนต์ (สำคัญ)

- การ **สร้างไฟล์** ไม่ต้องมี TH Sarabun New ในเครื่องที่รัน — python-docx เขียนแค่
  "ชื่อฟอนต์" ลง XML การแสดงผลเกิดตอนเปิดใน Word บนเครื่องที่ **มีฟอนต์นั้น**
- TH Sarabun New เป็นฟอนต์มาตรฐานราชการไทย (1 ใน 13 ฟอนต์แห่งชาติ) มักติดตั้งบน
  เครื่องคนไทยอยู่แล้ว
- ถ้าต้องส่งให้คนนอกที่อาจไม่มีฟอนต์ → แนะนำ **แปลงเป็น PDF ก่อนส่ง** (ปลอดภัยสุด)
  หรือเปิดใน Word แล้ว File ▸ Options ▸ Save ▸ ติ๊ก "Embed fonts in the file"
  (python-docx embed ฟอนต์เองไม่ได้)

---

## Checklist ก่อนปล่อยงาน

1. เรียก `enforce_thai(doc)` ก่อน `doc.save()` ทุกไฟล์ที่มีภาษาไทย ✔
2. **default = ฟอนต์เดียวทั้งเอกสาร (ไม่ส่ง `latin_font`)** — ส่ง `latin_font=...` เฉพาะ
   ตอน user ขอแยกฟอนต์อังกฤษ-ไทยชัดเจนเท่านั้น อย่าใส่เองเป็นค่าเริ่มต้น ✔
3. ถ้าข้อความก๊อปมาจาก PDF → ล้างด้วย `clean_pdf_thai()` / `from_pdf=True` ก่อน (กันช่องว่างปลอม) ✔
4. ถ้าใช้ thaiDistribute กับข้อความไทยยาว → ใส่จุดตัดคำ `break_thai=True` / `break_thai_in_doc()` (กันอักษรห่างใน Word) ✔
5. รัน `verify_thai_docx.py` ได้ exit 0 (ไม่มีคำเตือนช่องว่างปลอม) ✔
6. ฟอนต์/ขนาดตรงค่า default (TH Sarabun New 16pt) ✔
7. ถ้ามีลำดับหัวข้อ (ข้อ 1 / 1.1 / 1.1.1) → ใช้ `add_thai_heading(level=...)` ให้ indent
   ขั้นละ 1.25 ซม. ตรงสเกล ไม่ใช่พิมพ์ `\t` เอง ✔
8. ถ้าจะส่งคนนอก พิจารณาแปลง PDF ✔
