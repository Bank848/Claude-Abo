---
name: supabase-rls-safety-check
description: Use when starting work on any project that uses Supabase — proactively audit Row Level Security policies and anon-key exposure via the Supabase MCP before deploying or sharing a project link.
---

## Supabase project safety check — proactive RLS/anon-key audit (บัญญัติ 2026-08-12)
- ทุกครั้งที่เริ่มงานใหม่/สร้าง project ใหม่ที่ใช้ **Supabase** (ตรวจจาก dependency `@supabase/supabase-js`, ไฟล์ `.env` ที่มี `SUPABASE_URL`/`SUPABASE_ANON_KEY`, หรือ user บอกตรงๆ ว่าใช้ Supabase) → ให้เสนอ (ไม่ต้องรอ user ถาม) รัน security check ผ่าน Supabase MCP (`mcp__*__get_advisors` type `security` + `list_tables` verbose) เพื่อเช็ค **RLS เปิดครบทุก table ที่ expose ผ่าน PostgREST ไหม** — โดยเฉพาะก่อน deploy จริง/ก่อนแชร์ลิงก์ให้คนอื่นใช้
- เหตุผล: เจอเคสจริง 2026-08-12 — โปรเจกต์ `a personal expense-tracker app` (ของ user เอง) มี RLS ปิดอยู่ 4 table (`categories`,`transactions`,`budgets`,`members`) มีข้อมูลจริงอยู่แล้ว ถ้าไม่เช็คเชิงรุกจะไม่มีใครรู้จนกว่าจะมีคนเอา anon key จาก frontend ไปยิง PostgREST ตรงๆ. เคสนี้มาจากโพสต์เตือนภัยใน FB group ที่คนแฉว่า vibe-coded Supabase project ส่วนใหญ่พลาดเรื่องนี้ — ปัญหาไม่ใช่ anon key หลุด (ปกติ) แต่คือ table ไม่มี RLS/policy คุม
- **ขั้นตอนเช็ค:** `list_projects` (Supabase MCP) → หา project ที่เกี่ยวข้อง → `get_advisors(type:"security")` + `list_tables(verbose:true)` ดู `rls_enabled` ทุก table → ถ้าเจอ table ที่ `rls_enabled:false` และมี rows > 0 หรือ schema ที่จะเก็บข้อมูลจริง ให้ flag ทันทีเป็น critical ก่อนงานอื่น
- **อย่า auto-apply SQL แก้เอง** — เปิด RLS โดยไม่มี policy ที่ถูกจะบล็อกแอปตัวเองอ่านข้อมูลไม่ได้ทันที ต้องถามก่อนว่า project นี้มีระบบ auth/login ไหม (มี → ผูก policy กับ `auth.uid()`, ไม่มี → เสนอทางเลือก เช่น revoke anon direct grants + proxy ผ่าน Edge Function/API route แทน)
- ใช้กับทุก project ที่มี Supabase MCP ต่ออยู่ (ไม่ใช่แค่โปรเจกต์เดียว) — ถ้า project ไม่ได้ต่อ Supabase MCP ให้เตือน user ว่าควรรัน Supabase security advisor เองผ่าน dashboard หรือขอต่อ MCP ก่อน
