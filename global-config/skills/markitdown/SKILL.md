---
name: markitdown
description: Convert files (PDF, PPTX, DOCX, XLSX, images, audio, HTML, CSV, JSON, XML, EPUB, ZIP, YouTube URLs) into clean Markdown using Microsoft MarkItDown. Use when the user wants to convert/extract/turn a document into Markdown, prep files for LLM/RAG indexing, batch-convert a folder of office docs, transcribe audio, or pull structured text out of PDFs/slides/sheets. Trigger words: "แปลงเป็น markdown", "convert to md", "extract text", "markitdown", "feed RAG", "อ่านไฟล์เป็น text".
---

# MarkItDown

Microsoft's `markitdown` — converts almost any file into LLM-friendly Markdown. Already installed globally (`markitdown 0.1.6`, CLI at `...Python313\Scripts\markitdown.exe`, Python pkg `markitdown[all]`).

## When to use this vs. native Claude reading

| Situation | Use |
|---|---|
| "อยากเข้าใจ/ตอบคำถามจาก PDF นี้" (single file, semantic) | Claude อ่านตรงๆ (multimodal — เห็นรูป/ตาราง/layout) |
| "แปลงไฟล์เป็น .md ไว้ index / feed RAG / เก็บ" | **MarkItDown** |
| batch หลายสิบ–ร้อยไฟล์ → text | **MarkItDown** (CLI loop) |
| .pptx .docx .xlsx .epub → text | **MarkItDown** (รักษาโครงสร้าง heading/table/list) |
| transcribe audio (.mp3/.wav) | **MarkItDown** (`[audio-transcription]`) |
| image OCR / EXIF metadata | **MarkItDown** (`[az-doc-intel]` หรือ LLM caption) |

MarkItDown สกัด **โครงสร้าง** (heading, table, list) ไม่ใช่แค่ raw text — เหมาะกับ pipeline ที่ป้อนต่อให้ LLM.

## Usage

### CLI (เร็วสุดสำหรับงานทั่วไป)
```bash
# single file → stdout
markitdown path/to/file.pdf

# single file → output file
markitdown report.pptx -o report.md

# จาก stdin (ต้องระบุ type hint)
cat doc.pdf | markitdown -x pdf > doc.md
```

### Batch ทั้งโฟลเดอร์ (PowerShell — Windows)
```powershell
Get-ChildItem -Path .\docs -Include *.pdf,*.docx,*.pptx,*.xlsx -Recurse | ForEach-Object {
  markitdown $_.FullName -o ($_.FullName + ".md")
}
```

### Python API
```python
from markitdown import MarkItDown
md = MarkItDown(enable_plugins=False)
result = md.convert("file.pdf")
print(result.text_content)   # the Markdown string

# image captioning / richer extraction via an LLM client
from openai import OpenAI
md = MarkItDown(llm_client=OpenAI(), llm_model="gpt-4o")
result = md.convert("diagram.jpg")   # LLM-generated caption
```

## Supported inputs
PDF · PowerPoint (.pptx) · Word (.docx) · Excel (.xlsx/.xls) · Images (OCR + EXIF, optional LLM caption) · Audio (.mp3/.wav, EXIF + transcription) · HTML · CSV/JSON/XML · EPUB · ZIP (iterates contents) · YouTube URLs (transcript) · plain text.

## Gotchas
- **ติดตั้งใน Python313** (ไม่ใช่ 3.12.7 ที่ `python` ชี้ไป) — เรียก CLI `markitdown` ตรงๆ ได้เลย ปลอดภัยสุด. ถ้าจะใช้ Python API ให้ใช้ `py -3.13` หรือ Python313 interpreter.
- `markitdown[all]` ลง optional deps ครบ (pdf, pptx, docx, xlsx, audio, az-doc-intel) แล้ว.
- รูป/ตาราง embedded ใน PDF: MarkItDown สกัดเป็นข้อความไม่ได้ดีเท่า Claude อ่านเอง — ถ้าเนื้อหาเป็นภาพ/ไดอะแกรมเยอะ พิจารณาให้ Claude อ่านตรงๆ.
- Output เป็น Markdown ดิบ — ถ้าจะใช้ต่อใน RAG อาจ post-process (chunk/clean) เพิ่ม.
- Audio transcription ใช้ `SpeechRecognition` (default Google API, ต้องเน็ต) — ไฟล์ใหญ่/ภาษาไทยอาจไม่แม่น.

## Repo / docs
https://github.com/microsoft/markitdown
