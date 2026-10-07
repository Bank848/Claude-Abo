---
name: markitdown
description: Convert files (PDF, PPTX, DOCX, XLSX, images, audio, HTML, CSV, JSON, XML, EPUB, ZIP, YouTube URLs) into clean Markdown using Microsoft MarkItDown. Use when the user wants to convert/extract/turn a document into Markdown, prep files for LLM/RAG indexing, batch-convert a folder of office docs, transcribe audio, or pull structured text out of PDFs/slides/sheets. Trigger words: "แปลงเป็น markdown" (convert to markdown), "convert to md", "extract text", "markitdown", "feed RAG", "อ่านไฟล์เป็น text" (read the file as text).
---

# MarkItDown

Microsoft's `markitdown` — converts almost any file into LLM-friendly Markdown. Already installed globally (`markitdown 0.1.6`, CLI at `...Python313\Scripts\markitdown.exe`, Python pkg `markitdown[all]`).

## When to use this vs. native Claude reading

| Situation | Use |
|---|---|
| "I want to understand / answer questions from this PDF" (single file, semantic) | Claude reads it directly (multimodal: sees images/tables/layout) |
| "Convert files to .md for indexing / feed RAG / archiving" | **MarkItDown** |
| batch of dozens to hundreds of files → text | **MarkItDown** (CLI loop) |
| .pptx .docx .xlsx .epub → text | **MarkItDown** (preserves heading/table/list structure) |
| transcribe audio (.mp3/.wav) | **MarkItDown** (`[audio-transcription]`) |
| image OCR / EXIF metadata | **MarkItDown** (`[az-doc-intel]` or LLM caption) |

MarkItDown extracts **structure** (heading, table, list), not just raw text, so it suits pipelines that feed an LLM.

## Usage

### CLI (fastest for general work)
```bash
# single file → stdout
markitdown path/to/file.pdf

# single file → output file
markitdown report.pptx -o report.md

# from stdin (a type hint is required)
cat doc.pdf | markitdown -x pdf > doc.md
```

### Batch a whole folder (PowerShell — Windows)
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
- **Installed in Python313** (not the 3.12.7 that `python` points to) — calling the `markitdown` CLI directly is safest. For the Python API, use `py -3.13` or the Python313 interpreter.
- `markitdown[all]` has all optional deps installed (pdf, pptx, docx, xlsx, audio, az-doc-intel).
- Images/tables embedded in a PDF: MarkItDown extracts them to text less well than Claude reading them directly. If the content is mostly images/diagrams, consider letting Claude read it directly.
- Output is raw Markdown. If it feeds RAG, you may want to post-process it (chunk/clean).
- Audio transcription uses `SpeechRecognition` (default Google API, needs internet). Large files or Thai speech may be less accurate.

## Repo / docs
https://github.com/microsoft/markitdown
