[English](README.md) | **ภาษาไทย** | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:a85f9d675518 -->

# Claude-Abo

สมุดบันทึก skill สำหรับ Claude Code: ทุก skill มีแหล่งที่มา license และสถานะกำกับ และ Claude เลือก skill ที่ใช่เองจากคำอธิบายหนึ่งบรรทัดของ skill โดยไม่ต้องพิมพ์คำสั่ง
บรรทัดนั้นกิน context ทุก session เหมือนกัน คำสั่งเดียวประเมินต้นทุนเป็น token (เทียบกับตัวเลขจริงจาก `/context`) และบอกว่าควรตัดอะไร ส่วน catalog มี 68 skills พร้อม license วันที่ทดสอบ และปัญหาที่รู้อยู่แล้วของแต่ละตัว
`npx github:Bank848/Claude-Abo audit`  ·  [เว็บไซต์](https://bank848.github.io/Claude-Abo/)  ·  [Catalog](https://bank848.github.io/Claude-Abo/#catalog)

[![CI](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml/badge.svg)](https://github.com/Bank848/Claude-Abo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-68%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

## Claude เลือกให้ ไม่ต้องสั่งเอง

Claude อ่าน `description` หนึ่งบรรทัดของแต่ละ skill แล้วโหลด skill ที่คำอธิบายตรงกับคำขอ เขียนบรรทัดนั้นให้เป็นตัวกระตุ้น คือบอกว่าใช้ skill เมื่อไร

- **Prompt (ตัวอย่างประกอบ):** "เขียนโพสต์เปิดตัวโปรเจกต์นี้"
- **Skill ที่เข้ากับงาน:** `english-writing-anti-ai-tell` ซึ่งมีคำอธิบายว่า "Use when drafting English-language text for the user (chat, email, essays, reports)..."
- **เหตุผล:** โพสต์เป็นข้อความภาษาอังกฤษที่เขียนให้คนอ่าน ตรงกับที่คำอธิบายระบุ

นี่เป็นตัวอย่างประกอบ ไม่ใช่ผลการวัด คำอธิบายเข้ากับงาน และความเข้ากันนี้คือสิ่งที่ Claude ใช้จับคู่ แต่ไม่ได้พิสูจน์ว่าคำอธิบายอย่างเดียวพอให้ skill ทำงาน audit จะเตือนคำอธิบายที่ยาวหรือสั้นเกินกว่าจะจับคู่ได้

## audit ตรวจอะไรบ้าง

ดูรายการตรวจและข้อจำกัดทั้งหมดใน [docs/audit-method.md](docs/audit-method.md) (ภาษาอังกฤษ)

## วิธีใช้เทมเพลต

Clone repo เปิดใน Claude Code แล้วรัน `/adopt` ถ้าอยากทำเองทีละขั้น ดู [คู่มือ](docs/guide.md) (ภาษาอังกฤษ)

## Skills

รายการ skills ทั้งหมดอยู่ที่ [catalog บนเว็บไซต์](https://bank848.github.io/Claude-Abo/#catalog)

## License และเครดิต

เนื้อหาของ repo นี้ใช้ MIT ดู [LICENSE](LICENSE) เครดิตของ skills ที่มาจากคนอื่นอยู่ใน [ATTRIBUTION.md](ATTRIBUTION.md) และ [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md)

## ข้อควรรู้: นี่คือ setup ของคนคนหนึ่ง

repo นี้มาจากงานของผู้ใช้ชาวไทยบน Windows จึงมีเรื่องภาษาไทยและ PowerShell ปนอยู่ ใช้เฉพาะส่วนที่เหมาะกับคุณ แล้วปรับให้เข้ากับงานของตัวเอง
