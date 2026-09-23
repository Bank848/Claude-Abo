---
name: instruction-lint
description: "Audit auto-loaded instruction files (global CLAUDE.md, RTK.md, resident rules/ecc/common/*.md, per-repo CLAUDE.md) for byte bloat — report which rule entries should stay resident vs demote to a skill/detail-file/_retrievable-rules pointer. Read-only, persists report to a file. Trigger: /instruction-lint, 'ตรวจ CLAUDE.md บวม', 'ลด byte instruction file'."
trigger: /instruction-lint
metadata:
  type: reference
---

# /instruction-lint — ตรวจสุขภาพไฟล์ instruction ที่ auto-load

ตรวจไฟล์ที่ harness auto-load เข้า context **ทุก session แบบเต็มเนื้อหา** แล้วรายงานว่า entry ไหน
ควร resident กับ entry ไหนควร demote — **นี่คือเครื่องมือรายงานเท่านั้น** ไม่แก้ไฟล์เป้าหมายเองจนกว่า
user จะสั่ง "แก้เลย" ทีละ entry

## ขอบเขต — ไม่ตีกับ memory-lint, ไม่เดาว่าไฟล์ไหน auto-load จริง

- **instruction-lint** = audit เฉพาะไฟล์ที่ยืนยันได้ว่า auto-load เต็มไฟล์จริง:
  - `~/.claude/CLAUDE.md` (global)
  - `~/.claude/RTK.md` (auto-load ผ่าน `@RTK.md`)
  - `~/.claude/rules/ecc/common/{git-workflow,hooks,patterns,security}.md` — **เฉพาะ 4 ไฟล์นี้**
  - `<repo ปัจจุบัน>/CLAUDE.md`
- **ไฟล์ใน `rules/` ที่ "ไม่ resident" มี 2 กลไก ต้องเช็คทั้งคู่ ห้ามเดาจาก path เฉยๆ:**
  - ย้ายออกจริงแล้ว (เช่น `~/.claude/_retrievable-rules/ecc-common/*.md` — 6 ไฟล์ที่เคยอยู่
    `rules/ecc/common/`)
  - ยังอยู่ใน `rules/` แต่ถูก **gate ด้วย `paths:` frontmatter** (เช่น `rules/ecc/python/*.md` — โหลด
    เฉพาะตอนแตะไฟล์ `.py` ไม่ resident เสมอ)
  - ไฟล์ที่ยืนยันไม่ได้ว่า resident จริง (ทั้ง 2 กลไก) → ข้าม + บันทึก "ไม่ยืนยันว่า auto-load — ข้าม"
- **ไม่ใช่ `memory-lint`** (คุมแค่ `memory/*.md` + `MEMORY.md`), **ไม่แตะ `SKILL.md` ไฟล์ใดๆ**,
  **ไม่ audit `~/.claude/_retrievable-rules/**`** (retrievable โดย design แล้ว — แต่เป็นปลายทาง
  demote ที่ใช้ได้จริง)
- **read-only by default** — รายงาน + เสนอ candidate + **เซฟผลลงไฟล์เสมอ**

## เกณฑ์ตัดสิน resident vs demote (B∨C)

ต้องผ่านอย่างน้อยหนึ่งข้อถึงจะ **resident**:

- **B — มองไม่เห็นเอง (ผ่าน = resident):** Claude อ่านโค้ด/repo state ปัจจุบันแล้วจะรู้กฎนี้เองไหมโดย
  ไม่ต้องมีใครบอก — "ผ่าน B" คือ **มองไม่เห็นเอง**
- **C — พลาดแล้วแพง (ผ่าน = resident):** ถ้า Claude ไม่รู้กฎนี้ตอนเริ่ม task จะเสียหาย/ย้อนกลับไม่ได้
  ไหม

ไม่ผ่านทั้งคู่ = **demote candidate** — เสนอปลายทาง: `<trigger สั้น> → skill <name>` /
`→ [CLAUDE-detail.md]` / `→ ~/.claude/_retrievable-rules/<หมวด>/<name>.md`

**⚠️ ปลายทาง "→ skill `<name>`" ต้องหมายถึงย้ายเข้า SKILL.md เนื้อหาข้างใน (body) เท่านั้น** — harness
inject `name`+`description` ของทุก skill เข้า context **ทุก session อยู่แล้ว** (ดู CLAUDE.md หมวด
Skills Index) ดังนั้นย้าย byte เข้าไปอยู่ใน `description` ของ skill **ไม่ลด byte resident เลย** (บาง
กรณี description ยาวขึ้นกลับเพิ่ม byte สุทธิด้วยซ้ำ) ถ้าเสนอ "ย้ายเข้า description" ให้ถือว่า**ไม่นับเป็น
saving จริง** ในสรุปยอดรวม ต้องระบุในตารางว่า "ย้ายเข้า description — ไม่ประหยัด byte สุทธิ" แยกจาก
รายการที่ย้ายเข้า body จริง

**Usage เป็น tie-breaker เท่านั้น เฉพาะ entry ที่ B∨C ก้ำกึ่งจริงๆ:** `search_session_transcripts`
เป็น deferred MCP tool — โหลดผ่าน `ToolSearch` ก่อนเรียก ถ้าโหลดไม่ได้ในสภาพแวดล้อมที่รันอยู่ ให้ถือ
เป็น **"ไม่มี usage data"** ทันที ไม่ใช่ error — ถ้าค้นได้แต่ว่างเปล่าผิดปกติก็ติดป้ายเดียวกัน ห้ามเดาว่า
usage=0/5 — **ถ้าไม่มี entry ไหนก้ำกึ่งเลยในรอบนั้น การไม่เรียก tool นี้เลยถือว่าถูกต้อง**

**เกณฑ์เสริมเฉพาะกลุ่มนี้:**
- **Provenance/case-log inline** → **demote เสมอ** ไม่ต้องเช็ค B/C
- **Duplicate-with-detail-file** → **demote-with-trim**

**เมื่อ B∨C ก้ำกึ่งจริงๆ โดยเฉพาะกฎ safety-critical (ไม่ใช่แค่ Git/PR — รวมกฎ destructive-action gate
อื่นในหมวด C ด้วย) → เอียงไป resident ไว้ก่อนเสมอ**

**narrow-trigger vs meta-rule (เกณฑ์เสริมเมื่อ B ผ่านตามตัวอักษรแต่ยังอยากเถียงว่า demote ได้):**
entry ที่ผูกกับ tool/skill เฉพาะเจาะจงที่มีอยู่แล้ว (หรือควรมี) — trigger คำสั่งเดียวชัดเจน (เช่น
`/graphify`, `/instruction-lint` เอง) — **demote ได้แม้ผ่าน B ตามตัวอักษร** เพราะ skill description
ของมันเองที่ auto-inject ทุก session ทำหน้าที่ trigger แทนได้อยู่แล้ว ส่วน entry ที่บอกว่า "เมื่อเจอ
สถานการณ์ X **ให้ไปหยิบ skill ไหน**" (meta-rule ชี้ทาง ไม่ใช่ trigger ของ skill นั้นเอง) → **ต้อง
resident เสมอ ห้าม demote** เพราะ chicken-and-egg: skill description จะไม่ auto-fire ถ้า Claude ไม่รู้
มาก่อนว่าต้องมองหามัน (เช่น "เจอบั๊กเรียก debug-mantra ก่อน", "รีวิวแผนเรียก scrutinize")
- **เคสก้ำกึ่งที่ยังไม่ปิดจริง (contested, ต้องเขียนลง verdict column ตรงๆ ว่า "contested"):** entry ที่
  ตัวเองมีทั้งสองบทบาทพร้อมกัน (เช่น `graphify` — มีทั้ง trigger คำสั่งของตัวเอง `/graphify` **และ** มี
  meta-rule ย่อยข้างในว่า "มีกราฟอยู่แล้วให้ query ก่อนเสมอ ไม่ auto-inject ต้องพิมพ์จริง") → ห้ามตัดสิน
  ฝ่ายเดียวเงียบๆ ใน verdict column ต้องติดป้าย "contested — ทั้ง trigger ของตัวเองและ meta-rule ปนกัน"
  แล้วให้ user ตัดสินใจสุดท้าย ไม่ใช่ auto-classify เป็น demote

## Workflow

1. หา entry จากเนื้อหาที่**มีอยู่ในบริบทของ session นี้แล้ว** (ห้าม `Read` ไฟล์ในสโคปซ้ำ) — วัด byte
   ต่อ entry ด้วยคำสั่งที่เปิดไฟล์เองแล้ว print แค่ `heading<TAB>byte-count` เท่านั้น เช่น:

   ```bash
   PYTHONIOENCODING=utf-8 python -c "
   import re, sys
   sys.stdout.reconfigure(encoding='utf-8')
   text = open(r'<YOUR_HOME>\.claude\CLAUDE.md', encoding='utf-8').read()
   parts = re.split(r'(?m)^(#{1,3} .+)$', text)
   for i in range(1, len(parts), 2):
       heading = parts[i].strip()
       body = parts[i+1] if i+1 < len(parts) else ''
       print(f'{heading}\t{len(body.encode(\"utf-8\"))}')
   "
   ```

   (adjust the regex/heading depth per file; the point is the command's own stdout is just
   heading+number lines — never pipe the file's prose back into context)
   **ต้องมี `PYTHONIOENCODING=utf-8` + `sys.stdout.reconfigure(encoding='utf-8')` เสมอ** — เครื่องนี้
   stdout ที่ถูก pipe จับ default เป็น `cp874` ซึ่ง encode `→`/ไทยไม่ได้ พังกลางตารางแบบเงียบ (exit code
   ≠0 แต่ print ไปแล้วครึ่งนึงทำให้เข้าใจผิดว่าตารางสมบูรณ์)
2. ไฟล์ที่อ้างในสโคปไม่ยืนยันว่า auto-load จริง (ทั้ง 2 กลไก) หรือไม่มีอยู่จริงบนเครื่องนี้ → ข้าม +
   บันทึกเหตุผล ไม่ทำให้การสแกนทั้งหมดล้มเหลว
3. ต่อ entry: เช็ค provenance/duplicate ก่อน ไม่งั้นเช็ค B/C แล้วเสริม usage เฉพาะกรณีก้ำกึ่ง
4. จัดกลุ่ม resident vs demote candidate พร้อมเหตุผล + ปลายทางเสนอ
5. **เซฟรายงานเป็นไฟล์เสมอ** ที่ `<YOUR_VAULT_PATH>\worklog\reports\instruction-lint-<YYYY-MM-DD>.md`
   (default location — cross-project, ไม่ผูก repo ใดโดยเฉพาะ) แล้วสรุปด้วยวาจา

## Output format

```
| entry (heading/bullet) | ขนาด (byte) | usage (N/5 / "ไม่มี usage data" / "-") | B/C | verdict | ปลายทางเสนอ |
```

ปิดท้ายด้วยสรุป byte รวมก่อน/หลัง (วัดสด) และรายชื่อไฟล์ที่ข้าม ถ้ามี

## Worked dry-run examples (self-test)

- **"ห้าม force-push โดยไม่ถาม user ก่อน"** → B ผ่าน, C ผ่าน → **resident**
- **"ยืนยันใช้ได้จริง 2026-09-22 (some repo: ...)"** → provenance/case-log → **demote เสมอ**
- **"cmd เด้งจาก hook เพราะ flag ผสมกันผิด"** (เฉพาะตอนแก้ hook script นั้น) → B ไม่ผ่าน, C ไม่ผ่าน →
  **demote candidate** → ปลายทาง `CLAUDE-detail.md`
- **`search_session_transcripts` โหลดไม่ได้ หรือค้นแล้วไม่เจอ** → **"ไม่มี usage data"** เสมอ
- **กฎเดียวกันซ้ำทั้งใน CLAUDE.md เต็มๆ และใน `CLAUDE-detail.md`** → **demote-with-trim**
- **`~/.claude/rules/ecc/python/coding-style.md` มีอยู่จริง แต่มี `paths:` frontmatter gate** → ข้าม +
  บันทึก "ไม่ยืนยันว่า auto-load — ข้าม" ไม่ใช่นับเป็น resident

## คู่กับสกิล/ระบบที่มีอยู่

- แยกจาก `memory-lint` เด็ดขาด (เกณฑ์ B∨C + usage-tie-breaker ยึดตาม `memory-lint` §8 — แก้ฝั่งใด
  ควรเช็คอีกฝั่งด้วย)
- finding ที่โผล่ซ้ำทุกรอบ = สัญญาณปรึกษา `poka-yoke`
- ใช้ pointer format เดียวกับ CLAUDE.md หมวด E-H + ปลายทาง `_retrievable-rules/`
