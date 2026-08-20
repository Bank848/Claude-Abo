---
name: poka-yoke
description: Mistake-proofing by design — make the bad state impossible or self-evident at the source instead of detecting-and-punishing it later. Use BEFORE/DURING any design or review of features, game mechanics, minigames, UI flows, anti-cheat, input handling, build pipelines, or data models — and whenever you catch yourself about to write a "remember to / don't forget" note (that itch means a guardrail is missing). Trigger on /poka-yoke and proactively when designing, reviewing, auditing, hardening, or "how do we stop users/devs from doing X".
---

# Poka-Yoke — กันพลาดตั้งแต่ออกแบบ

> **อย่าตามจับความผิดทีหลัง — ออกแบบให้ความผิด "เกิดไม่ได้" หรือ "เห็นชัดทันที" ตั้งแต่ต้นทาง**

Shigeo Shingo / Toyota. หัวใจ: เลื่อน effort จาก *detection* (จับ + ลงโทษ) ไป *prevention* (ทำให้ทำผิดไม่ได้). ใช้ได้กับโค้ด, UX, กันโกง, build, ไปจนถึงนิสัยการทำงานของ dev เอง.

## บันได 2 ชั้น — รู้ก่อนว่ากำลังจะทำชั้นไหน

| ชั้น | ชื่อ | ความหมาย | ตัวอย่าง |
|---|---|---|---|
| **1 (เป้า)** | **Prevention / Shutout** | ทำผิด **ไม่ได้เลย** เชิงโครงสร้าง | USB เสียบกลับด้านไม่เข้า · ค่าเงินเก็บเป็น append-only ledger (แก้ตัวเลขกลางอากาศแล้วไม่ตรงเอง) · enum แทน string ดิบ · ปุ่มไม่ทับ hotspot |
| **2** | **Detection / Attention** | ทำผิดได้ แต่ร้องเตือน/บล็อกทันที + กู้ได้ | validation + error · รถไม่ติดถ้าไม่เหยียบเบรก · lint gate · assertion |

**กฎทอง:** ถ้ากำลังจะเพิ่ม validator/detector/จับผิดชั้น 2 — **หยุดถามก่อน:** "ทำไม bad state นี้ถึง *เก็บได้/แสดงได้* ตั้งแต่แรก?" ถ้าตอบได้ว่าจะทำให้มัน **unrepresentable** → ทำชั้น 1 แทน ถูกกว่าระยะยาว (ไม่มี false-positive, ไม่ whack-a-mole, ไม่ต้องเขียน self-heal มากัน detector ของตัวเอง).

## 3 วิธีคลาสสิก (จับ UI/flow/input ได้ตรง)

| วิธี | หลัก | ถามตัวเอง |
|---|---|---|
| **Contact** | รูปทรง/ตำแหน่ง/type บังคับ ทำผิดไม่เข้า | hotspot ทับกันไหม? element ที่ปนกันได้แยก type/shape ยัง? |
| **Fixed-value** | นับครบ/ครั้งเดียวค่อยผ่าน | ต้องครบ N ค่อยไปต่อ? จ่ายรางวัล/ทำ side-effect "ครั้งเดียว" (idempotent guard) ยัง? |
| **Motion-step** | บังคับลำดับ + ทางออกเดียวที่ commit เสมอ | ออกจาก flow นี้มีกี่ทาง? ทุกทาง commit/cleanup ครบไหม? มี "ประตูข้าง" ที่ลืมปิดไหม? |

## Decision flow — เจอปัญหา/ช่องโหว่/พลาดซ้ำ

```
เจอ bug / ช่องโกง / dev พลาดซ้ำ / กำลังจะเขียน "อย่าลืม X"
        │
        ▼
1. "ทำไม bad state นี้ถึงเกิด/เก็บได้ตั้งแต่แรก?"
        │
        ├─ ทำให้มัน representable ไม่ได้ → ✅ ชั้น 1 (redesign data/type/layout/flow) ← เลือกก่อนเสมอ
        │
        └─ เลี่ยงไม่ได้จริง (client-side, ปัจจัยภายนอก ฯลฯ)
                 │
                 ▼
        2. detect ให้ "เห็นชัดทันที + กู้ได้ ไม่ลงโทษเกินจริง"
           (self-heal ก่อน brick · ไม่ false-positive · ไม่ latch ค้าง)
```

## Checklist 3 ด้าน

**กันมือบอน (UI / interaction / flow):**
- [ ] ไม่มี hotspot/zone ซ้อนกัน (element ที่กลืน event กันต้องแยกพื้นที่ ไม่ใช่เขียน logic แยกแยะ)
- [ ] ปุ่มที่กดไม่ได้ตอนนี้ = disable/ซ่อน ไม่ใช่กดได้แล้วเด้ง error
- [ ] กดรัว/double-click ไม่ทำให้ได้ผลซ้ำหรือข้ามสเต็ป
- [ ] **ทางออกมีทางเดียว + commit เสมอ** — ปิด "ประตูข้าง" ทุกบาน (เมนูระบบ, back, shortcut ที่ bypass flow)
- [ ] ออกกลางคันแล้ว state ไม่เพี้ยน (default ปลอดภัย)

**กันโกง / integrity:**
- [ ] ค่าสำคัญ **derive ได้** ไม่ใช่ค่าดิบที่แก้แล้วจบ (ledger > balance int · progress > bool ดิบ)
- [ ] **durability สมมาตร** — "ของที่ได้" กับ "ราคาที่จ่าย" ต้องคงทน/หายพร้อมกัน (อย่าให้ฝั่งหนึ่งถาวร อีกฝั่ง revert ได้ → ฟาร์มได้)
- [ ] side-effect ที่จ่ายเงิน/ให้รางวัล = idempotent (จ่ายครั้งเดียว guard)
- [ ] ถ้าต้อง detect: **self-heal ก่อน brick**, เซ็นเฉพาะ surface ที่จำเป็น (อย่าเซ็น transient → false-positive)

**กันตัวเอง (dev guardrail):**
- [ ] **ทุก "ต้องจำเอา / เขียน note ว่าอย่าลืม" = จุดที่ควรเป็น guardrail** — ย้ายความรู้ในหัวไป build/hook/test ที่บังคับเอง
- [ ] build/CI **fail** ถ้าเงื่อนไขไม่ครบ (ไฟล์ไม่ match, ค่าซ้ำ, ขาด config) ไม่ใช่พึ่งความจำ
- [ ] artifact ที่ stale แล้วพัง = gitignore / generate สด ห้ามค้างใน tree
- [ ] checklist ที่ **derive จาก code** (script สแกน) ไม่ใช่ list ที่ต้องอัปเดตมือ

## วิธีใช้ใน session
1. ตอนออกแบบ/รีวิว: เดินผ่าน decision flow + checklist ด้านที่ตรงงาน
2. ทุกครั้งที่จะเพิ่ม detector/validator ชั้น 2 → recite กฎทอง ("ทำไม bad state เก็บได้ตั้งแต่แรก?") ก่อน
3. ทุกครั้งที่จะเขียน memory/comment ว่า "อย่าลืม X" → ถามว่า X ทำเป็น guardrail (ชั้น 1/build) ได้ไหม
4. รายงาน finding แบบจัดชั้น (1 vs 2) + ระบุ fix ที่ยกระดับขึ้นชั้น 1 ได้ พร้อม trade-off

## หมายเหตุ
- เป็น skill **flexible** — ปรับหลักให้เข้า context ได้ ไม่ใช่ rigid checklist บังคับทุกข้อ
- เคสเฉพาะโปรเจกต์ (เช่น scorecard ของเกมที่ทำอยู่) เก็บแยกใน memory/doc ของ project นั้น แล้ว skill นี้เป็นกรอบกลาง

## Related — ตัวอย่างจริงของหลักการนี้ในสกิลอื่น
- `shipping-a-branch` = **Motion-step** ใช้จริง: บังคับลำดับ push→PR→review→merge ทุกสเต็ปเสี่ยงปิด "ประตูข้าง" ไว้ (ห้าม force-push แทนการ fix reject, ห้าม approve PR ตัวเอง) — ทุกทางออกต้อง confirm ก่อนเสมอ ไม่มีทาง bypass เงียบๆ
