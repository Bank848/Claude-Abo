---
name: english-writing-anti-ai-tell
description: Use when drafting English-language text for the user (chat, email, essays, reports) to avoid GPT-ism vocabulary, em dashes, rule-of-three lists, copula avoidance, opener/closer formulas, and other AI-writing tells. Also use when the user asks to "humanize" existing AI-written English text/file.
---

## English writing anti-AI-tell rules (บัญญัติ 2026-08-12, ขยายเพิ่ม 2026-08-13 จาก fable-medium research)
เวลาช่วย draft ข้อความภาษาอังกฤษ (แชต, อีเมล, DM, เรียงความ, รายงาน, โพสต์) ให้เลี่ยง pattern เหล่านี้ที่เป็น signature ของข้อความ AI-generated ภาษาอังกฤษ — รายละเอียดเต็ม+ vocab table + before/after examples อยู่ใน `~/.claude/projects/D--brain/memory/english-anti-ai-tell-reference.md`:
- **Em dash (กฎเดิม):** ห้ามใช้ em dash คั่นระหว่างประโยค โดยเฉพาะ pattern "X — because Y" — ใช้ comma, ขึ้นประโยคใหม่ด้วย period, หรือคำเชื่อมอย่าง "and"/"so" แทน
- **GPT-ism vocabulary:** ห้ามใช้ "delve", "tapestry", "boasts", "underscore(s)", "landscape" (เชิงเปรียบเทียบ), "realm", "crucial/pivotal/vital" เป็น default intensifier, "intricate", "multifaceted", "leverage" (กริยา), "seamless(ly)", "robust", "foster", "navigate (challenges)", "embark", "elevate", "unlock", "game-changer", "in today's fast-paced world" — คำระดับสองอีกเยอะอยู่ในไฟล์อ้างอิง ถ้าไม่แน่ใจใช้กริยา/คำง่ายๆ แทน ("use" ไม่ใช่ "utilize", "help" ไม่ใช่ "facilitate")
- **"not just X, but Y"**: ห้ามใช้เกิน 1 ครั้งต่อชิ้น และห้าม "It's not about X. It's about Y." โดยเด็ดขาด
- **Rule-of-three throttle**: ห้าม list สามข้อโครงประโยคขนานกัน ("clear, concise, and compelling") เป็น reflex — ใช้ 2 หรือ 4 ข้อ ยาวไม่เท่ากัน หรือขยายข้อเดียวให้แน่น
- **Copula avoidance**: เขียน "is/are/has" ตรงๆ ห้ามสลับเป็น "serves as", "stands as", "represents", "acts as", "functions as"
- **Opener/closer formula**: ห้ามเปิดด้วย "In today's world / digital age / ever-evolving landscape"; ห้ามปิดด้วย "In conclusion / Ultimately / At the end of the day" แล้ว restate ทุกประเด็น; ห้าม hedge-then-emphasize ("While challenges remain, X continues to...") — จบด้วย detail เฉพาะจุด/ความเห็นสั้นกว่าที่อยากจบ
- **Vague attribution**: ห้าม "experts say / studies show / many believe" ที่ไม่มีแหล่งจริงระบุได้ — ถ้าไม่มีแหล่งให้ถาม user หรือพูดเป็นความเห็นตรงๆ
- **Elegant variation**: เรียกซ้ำคำเดิมได้ตามธรรมชาติ ห้ามสลับคำพ้องความหมาย (dog → canine → four-legged friend) เพื่อเลี่ยงคำซ้ำ
- **Promotional inflation**: บริบทกลางๆ/ข้อเท็จจริงใช้ภาษากลางๆ — ห้าม "vibrant", "stunning", "rich cultural heritage", "must-see", "nestled" นอกบริบทโฆษณาจริง
- **Formatting overkill**: แชท/DM/อีเมลใช้ prose ธรรมดา ห้าม bold-term-colon list, header, emoji bullet, เส้นคั่น, ตาราง เว้นแต่ user ขอโครงสร้างจริงๆ
- **Contractions**: งานที่เป็น conversational (แชท, DM, อีเมลลำลอง, บล็อก) ต้องใช้ contraction ("don't/it's/I'll") — ศูนย์ contraction เองก็เป็น tell และต้องสลับความยาวประโยค+ย่อหน้าไม่ให้สม่ำเสมอเกินไป
- **Register ก่อนเสมอ**: ตัดสินใจ chat / professional email / essay / creative ก่อนเขียน แล้วปรับให้ตรง (รายละเอียดแยก register อยู่ในไฟล์อ้างอิง) — default เป็นโทน polished-neutral-formal ทุกครั้งคือ meta-tell ที่ใหญ่สุด
- **English-specific เพิ่มเติม (ไม่มีใน Thai rule)**: semicolon overuse ในบริบทลำลอง, title case header ในอีเมล/เอกสารที่ควรเป็นประโยคธรรมดา, ย่อหน้ายาวเท่ากันสม่ำเสมอทุกย่อหน้า, colon-subtitle habit ("X: Why Y Matters"), hedging stack ซ้อนคำเผื่อเหลือเผื่อขาดหลายคำในประโยคเดียว ("arguably", "generally speaking", "to some extent"), both-sidesism ในงานความเห็นที่ควรมีจุดยืน, answer-shaped chat reply ที่ทวนคำถามก่อนตอบ ("Great question! There are several factors...")
- **Priority order ตอนตรวจร่าง**: (1) GPT-ism vocab + em dash, (2) promotional inflation + copula avoidance, (3) "not just X but Y" + rule-of-three, (4) opener/closer formula + vague attribution, (5) contractions + register match, (6) sentence/paragraph rhythm, (7) formatting overkill
- เหตุผล: ขยายจากกฎ em dash เดิมที่จับได้แค่ระดับเครื่องหมาย — ชุดนี้มาจาก fable-medium research (2026-08-13) ครอบคลุม vocabulary + โครงสร้าง/วาทศิลป์ที่เป็น GPT-isms ที่มีเอกสารรองรับหนาแน่นในภาษาอังกฤษ
- ใช้กับทุก project ทุกครั้งที่ร่างข้อความเป็นภาษาอังกฤษ

## Draft-critique-revise workflow (บัญญัติ 2026-09-04, adapted from blader/humanizer)
เดิม skill นี้ใช้แบบ single-pass (เขียนพร้อมเช็คตาม checklist ไปด้วย) — เพิ่มขั้น critique/revise แยกเป็น **บังคับ** สำหรับงานที่ความนิ่ง/ความน่าเชื่อถือสำคัญ (เรียงความ, รายงาน, PR/issue reply, เอกสารที่จะส่ง/โพสต์ให้คนอื่นเห็น) — **ไม่ใช่ทางเลือก** สำหรับงานกลุ่มนี้ ยกเว้นเฉพาะแชตสั้นๆ/ตอบคำถามปกติที่ single-pass พอ:
1. **Draft**: เขียนโดยไม่ยึดโครงตายตัว ปล่อยให้เนื้อหา/ข้อเท็จจริงมาก่อน — แต่ **register/contractions ต้องล็อกไว้ตั้งแต่ขั้นนี้** (ตามกฎ "Register ก่อนเสมอ" ด้านบน) ค่อยเกลาแค่สำนวน/vocabulary/โครงประโยคทีหลัง
2. **Critique**: เทียบร่างกับ (a) checklist ด้านบนทีละข้อ priority order, (b) ต้นฉบับ/ข้อเท็จจริงต้นทาง (ตรวจว่าความหมาย/รายละเอียดไม่เพี้ยนไปจาก draft) แล้วจด flag เฉพาะจุดที่ชน
3. **Revise**: แก้เฉพาะจุดที่ flag ไว้ ไม่ rewrite ทั้งชิ้นใหม่ (กันเสียโทน/รายละเอียดที่ดีอยู่แล้ว)
- แชตสั้น/ตอบคำถามปกติในบทสนทนา → single-pass เดิมพอ ไม่ต้องแยกขั้น

## Humanize existing text (บัญญัติ 2026-09-04)
เมื่อ user ขอ "humanize ข้อความนี้ / แก้ให้ไม่เหมือน AI เขียน" กับ**ข้อความ/ไฟล์ที่มีอยู่แล้ว** (ไม่ใช่ตอน draft ใหม่) ให้:
1. อ่านต้นฉบับเต็ม เก็บ meaning/claims/facts ทั้งหมดไว้เป็น baseline ห้ามเปลี่ยนความหมาย
2. รันตาม draft-critique-revise workflow ด้านบน โดยขั้น critique เทียบกับต้นฉบับแทน draft ของตัวเอง
3. ถ้าเป็นไฟล์ที่มี code/data/frontmatter ปนอยู่ (เช่น .md ที่มี YAML frontmatter, code block) — **ห้ามแตะเด็ดขาด**: fenced code block, inline code, YAML frontmatter, URL/path, ตัวเลข/proper noun. **ถามก่อนแก้**: code comment, docstring, UI string ที่เป็น literal (อาจกระทบ build/test ถ้าแก้มั่ว). แก้ได้อิสระเฉพาะ prose ปกติ
4. แสดง diff หรือสรุปจุดที่แก้ให้ user เห็นก่อน ไม่ใช่แทนที่เงียบๆ
