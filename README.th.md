[English](README.md) | **ภาษาไทย** | [简体中文](README.zh-Hans.md) | [日本語](README.ja.md) | [Español](README.es.md) | [한국어](README.ko.md) | [Português (Brasil)](README.pt-BR.md) | [Français](README.fr.md) | [Deutsch](README.de.md) | [Русский](README.ru.md)
<!-- abo:source-hash:8de5a318aa81 -->

# Claude-Abo

ดูว่า Claude Code setup ของคุณกินพื้นที่ context ไปเท่าไรทุก session และมี hook กัน `git push --force` หรือเปล่า
คำสั่งเดียวประเมิน context คงที่ของ setup เป็นจำนวน token (เทียบกับตัวเลขจริงจาก `/context`) และบอกว่าควรตัดอะไร ส่วน catalog มี <!-- gen:skills-count:start -->61<!-- gen:skills-count:end --> skills พร้อม license วันที่ทดสอบ และปัญหาที่รู้อยู่แล้วของแต่ละตัว
`npx github:Bank848/Claude-Abo audit`  ·  [เว็บไซต์](https://bank848.github.io/Claude-Abo/)  ·  [Catalog](https://bank848.github.io/Claude-Abo/#catalog)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
<!-- gen:skills-count-badge:start -->[![Skills](https://img.shields.io/badge/skills-61%20bundled-brightgreen)](#global-configskills)<!-- gen:skills-count-badge:end -->

<p align="center"><img src="assets/audit-demo.gif" alt="claude-abo audit" width="820"/></p>

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
