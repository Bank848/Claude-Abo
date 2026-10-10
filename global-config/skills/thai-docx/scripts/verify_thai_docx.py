#!/usr/bin/env python3
"""
verify_thai_docx.py — ตรวจไฟล์ .docx ว่าตั้งค่าอักษรเชิงซ้อน (ไทย) ครบหรือยัง
อย่าเชื่อ preview/LibreOffice — มันเดาภาษาไทยให้เอง แต่ Microsoft Word ไม่เดา

ใช้:
    python verify_thai_docx.py FILE.docx --font "TH Sarabun New"
    python verify_thai_docx.py FILE.docx --latin-font "Times New Roman"

exit 0 = ผ่าน, exit 1 = ยังมี run/ระดับเอกสารที่ตั้งค่าไม่ครบ
"""
import sys
import argparse
import re
from docx import Document
from docx.oxml.ns import qn

THAI_RE = re.compile(r"[\u0E00-\u0E7F]")


def run_text(r):
    return "".join(t.text or "" for t in r.findall(qn("w:t")))


def check_run(r, thai_font, latin_font):
    """คืน list ของปัญหาที่พบใน run นี้ (เฉพาะ run ที่มีตัวไทย)"""
    txt = run_text(r)
    if not THAI_RE.search(txt):
        return []
    problems = []
    rpr = r.find(qn("w:rPr"))
    rfonts = rpr.find(qn("w:rFonts")) if rpr is not None else None

    cs = rfonts.get(qn("w:cs")) if rfonts is not None else None
    if not cs:
        problems.append("ไม่มี w:cs (ฟอนต์ไทย) -> วรรณยุกต์/สระลอย หรือตัวเพี้ยน")
    elif thai_font and cs != thai_font:
        problems.append(f"w:cs = '{cs}' ไม่ตรงกับที่ต้องการ '{thai_font}'")

    if latin_font and rfonts is not None:
        asc = rfonts.get(qn("w:ascii"))
        if asc and asc != latin_font:
            problems.append(f"w:ascii = '{asc}' ไม่ตรงฟอนต์ละติน '{latin_font}'")

    # size: มี sz แต่ไม่มี szCs -> ไทยหด
    if rpr is not None and rpr.find(qn("w:sz")) is not None \
            and rpr.find(qn("w:szCs")) is None:
        problems.append("มี w:sz แต่ไม่มี w:szCs -> ตัวไทยหดเล็ก")

    # bold/italic mirror
    if rpr is not None:
        if rpr.find(qn("w:b")) is not None and rpr.find(qn("w:bCs")) is None:
            problems.append("มี w:b แต่ไม่มี w:bCs -> ตัวหนาไม่ติดตัวไทย")
        if rpr.find(qn("w:i")) is not None and rpr.find(qn("w:iCs")) is None:
            problems.append("มี w:i แต่ไม่มี w:iCs -> ตัวเอียงไม่ติดตัวไทย")

    # lang bidi
    lang = rpr.find(qn("w:lang")) if rpr is not None else None
    if lang is None or not lang.get(qn("w:bidi")):
        problems.append("ไม่มี w:lang/@w:bidi -> ตัดคำ/จัดชิดขอบไทยอาจเพี้ยน")

    return problems


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("path")
    ap.add_argument("--font", default="TH Sarabun New",
                    help="ฟอนต์ไทยที่คาดหวัง (w:cs)")
    ap.add_argument("--latin-font", default=None,
                    help="ฟอนต์ละตินที่คาดหวัง (w:ascii) — ตรวจเฉพาะถ้าระบุ")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    doc = Document(args.path)
    bad = 0
    total = 0
    for r in doc.element.body.iter(qn("w:r")):
        txt = run_text(r)
        if not THAI_RE.search(txt):
            continue
        total += 1
        problems = check_run(r, args.font, args.latin_font)
        if problems:
            bad += 1
            if not args.quiet:
                snippet = txt[:40].replace("\n", " ")
                print(f"  ✗ run: \"{snippet}\"")
                for p in problems:
                    print(f"      - {p}")

    # ระดับเอกสาร: settings themeFontLang bidi
    doc_problems = []
    try:
        st = doc.settings.element
        tfl = st.find(qn("w:themeFontLang"))
        if tfl is None or not tfl.get(qn("w:bidi")):
            doc_problems.append("settings.xml ไม่มี themeFontLang/@w:bidi=th-TH")
    except Exception:
        pass

    # ตรวจ "ช่องว่างปลอม" ระหว่างอักษรไทย (ร่องรอยข้อความก๊อปจาก PDF)
    # ช่องว่างพวกนี้จะทำให้ thaiDistribute ดึงตัวอักษรห่างเป็นช่อง ๆ
    # ตรวจความเสี่ยง "อักษรห่าง" แบบไม่ false-positive กับการเว้นวรรคไทยปกติ
    INVIS = re.compile(r"[\u200c\u200d\ufeff\u00ad\u2060\u00a0]")
    THAI_SP = re.compile(r"(?<=[\u0E00-\u0E7F]) (?=[\u0E00-\u0E7F])")
    THAI_RUN = re.compile(r"[\u0E00-\u0E7F]+")
    pdf_frag_runs = 0     # ช่องว่างถี่ผิดปกติ (ร่องรอย PDF) -> เสี่ยงห่าง
    longbreak_runs = 0    # ไทยยาวไม่มีจุดตัดคำ (ZWSP) -> เสี่ยงห่างถ้า Word ตัดคำไม่ได้
    invis_runs = 0
    for r in doc.element.body.iter(qn("w:r")):
        txt = run_text(r)
        n_thai = sum(len(m) for m in THAI_RUN.findall(txt))
        if n_thai == 0:
            continue
        n_sp = len(THAI_SP.findall(txt))
        # ช่องว่างไทย-ไทยถี่เกิน 1 ต่อ 8 ตัวอักษร = น่าจะแตกจาก PDF (ปกติเว้นวรรคห่างกว่านั้นมาก)
        if n_thai >= 20 and n_sp / n_thai > 0.125:
            pdf_frag_runs += 1
        # มีจุดตัดคำ (ZWSP) ไหม; ถ้าไม่มีและมีไทยต่อเนื่องยาว -> เสี่ยง
        longest = max((len(m) for m in THAI_RUN.findall(txt)), default=0)
        if "\u200b" not in txt and longest > 50:
            longbreak_runs += 1
        if INVIS.search(txt):
            invis_runs += 1

    print("-" * 56)
    print(f"ตรวจ run ที่มีภาษาไทย: {total} รัน | ตั้งค่าไม่ครบ: {bad} รัน")
    if pdf_frag_runs:
        print(f"  ! ช่องว่างไทยถี่ผิดปกติ {pdf_frag_runs} รัน "
              f"-> เหมือนข้อความจาก PDF ล้างด้วย clean_pdf_thai")
    if longbreak_runs:
        print(f"  ! ข้อความไทยยาวไม่มีจุดตัดคำ {longbreak_runs} รัน "
              f"-> เสี่ยงอักษรห่างใน Word ใช้ break_thai/insert_thai_word_breaks")
    if invis_runs:
        print(f"  ! พบอักขระล่องหน (no-break space/soft hyphen) {invis_runs} รัน "
              f"-> ล้างด้วย clean_pdf_thai")
    for dp in doc_problems:
        print(f"  ! {dp}")

    spacing_issue = bool(pdf_frag_runs or invis_runs)
    if bad == 0 and not doc_problems and not spacing_issue:
        if longbreak_runs:
            print("△ ตั้งค่าครบ แต่แนะนำใส่จุดตัดคำ (break_thai) ถ้าใช้ thaiDistribute")
        print("✓ ผ่าน — พร้อมส่ง")
        sys.exit(0)
    else:
        print("✗ ไม่ผ่าน — แก้ตามรายการด้านบนแล้วตรวจซ้ำ")
        sys.exit(1)


if __name__ == "__main__":
    main()
