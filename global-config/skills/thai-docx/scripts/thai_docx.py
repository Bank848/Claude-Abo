"""
thai_docx.py — ทำให้ไฟล์ Word (.docx) ที่สร้างด้วย python-docx แสดงผลภาษาไทย
ถูกต้องใน Microsoft Word โดยตั้งค่าฝั่ง "อักษรเชิงซ้อน" (complex script) ให้ครบ
และ **แยกฟอนต์ตามภาษา** (ละติน vs ไทย) ในรันเดียวกันได้

แนวคิดหลัก
----------
Word เลือกฟอนต์ของอักขระ "ทีละตัว" จากช่วง Unicode ของมัน ภายใน run เดียว:
  - w:ascii / w:hAnsi  -> อักขระละติน (A-Z, 0-9, อังกฤษ)
  - w:cs               -> อักขระเชิงซ้อน = ภาษาไทย (U+0E00–U+0E7F)
  - w:eastAsia         -> จีน/ญี่ปุ่น/เกาหลี
python-docx ตั้งให้แค่ ascii/hAnsi เท่านั้น ฝั่ง cs จึงถูกปล่อยว่าง -> ไทยเพี้ยน

เพราะ Word แยกฟอนต์ "ต่อตัวอักษร" อยู่แล้ว เราจึง **ไม่ต้องตัดข้อความเป็นหลาย run**
แค่ตั้ง w:ascii = ฟอนต์ละติน และ w:cs = ฟอนต์ไทย ใน run เดียวกัน
แล้วประโยคปนไทย-อังกฤษจะแสดงฟอนต์ถูกของแต่ละภาษาเอง

ใช้บ่อยสุด: สร้างเอกสารตามปกติ แล้วเรียก enforce_thai(doc) บรรทัดเดียวก่อน save
"""

import re
import unicodedata

from docx import Document
from docx.shared import Pt, Cm
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
from docx.enum.text import WD_ALIGN_PARAGRAPH

# default values
DEFAULT_THAI_FONT = "TH Sarabun New"
DEFAULT_SIZE_PT = 16
THAI_LANG = "th-TH"
DEFAULT_LATIN_LANG = "en-US"

# ระยะ indent มาตรฐานเอกสารไทย (ราชการ/วิชาการ) ต่อระดับหัวข้อ
# ข้อ 1 = 0 ซม., ข้อ 1.1 = 1.25 ซม., ข้อ 1.1.1 = 2.50 ซม. (ขั้นละ 1.25 ซม.)
# นี่คือ "left indent" ของย่อหน้า ไม่ใช่การพิมพ์ tab (\t) นำหน้าเลขข้อ
HEADING_INDENT_STEP_CM = 1.25
# ย่อหน้าเนื้อความ: first-line indent 1.25 ซม. (เท่ากับ 1 ขั้น indent เดียวกัน)
BODY_FIRST_LINE_INDENT_CM = 1.25

# ช่วงอักขระไทย และวรรณยุกต์/สระแบบ non-spacing (สำหรับงานล้างข้อความจาก PDF)
_THAI = r"\u0E00-\u0E7F"
_THAI_COMBINING = r"\u0E31\u0E34-\u0E3A\u0E47-\u0E4E"
_INVISIBLE = ["\u200b", "\u200c", "\u200d", "\ufeff", "\u00ad", "\u2060", "\u180e"]
_UNI_SPACES = ("\u00a0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007"
               "\u2008\u2009\u200a\u202f\u205f\u3000")

# ---------------------------------------------------------------------------
# helper ระดับ rPr (run properties element)
# ---------------------------------------------------------------------------

# ลำดับ child ของ CT_RPr ตามสคีมา OOXML — ต้อง insert ตามนี้ ไม่งั้น Word strict
# อาจ "ทิ้ง" element ที่วางผิดที่ ทำให้ cs/szCs/bCs ไม่ทำงาน
_RPR_ORDER = [
    "w:rStyle", "w:rFonts", "w:b", "w:bCs", "w:i", "w:iCs", "w:caps",
    "w:smallCaps", "w:strike", "w:dstrike", "w:outline", "w:shadow",
    "w:emboss", "w:imprint", "w:noProof", "w:snapToGrid", "w:vanish",
    "w:webHidden", "w:color", "w:spacing", "w:w", "w:kern", "w:position",
    "w:sz", "w:szCs", "w:highlight", "w:u", "w:effect", "w:bdr", "w:shd",
    "w:fitText", "w:vertAlign", "w:rtl", "w:cs", "w:em", "w:lang",
    "w:eastAsianLayout", "w:specVanish", "w:oMath",
]


def _wtag(el):
    """แปลง element.tag '{ns}local' -> 'w:local' เพื่อเทียบลำดับ"""
    return "w:" + el.tag.rsplit("}", 1)[-1]


def _get_or_add(parent, tag):
    """คืน child <tag> ถ้ามี ไม่มีก็สร้างแล้ว append (ใช้กับ container ที่ไม่ซีเรียสเรื่องลำดับ)"""
    el = parent.find(qn(tag))
    if el is None:
        el = OxmlElement(tag)
        parent.append(el)
    return el


def _rpr_child(rpr, tag):
    """คืน/สร้าง child ของ rPr โดย insert ให้ถูกลำดับสคีมา (ปลอดภัยกับ Word strict)"""
    el = rpr.find(qn(tag))
    if el is not None:
        return el
    el = OxmlElement(tag)
    try:
        idx = _RPR_ORDER.index(tag)
    except ValueError:
        rpr.append(el)
        return el
    anchor = None
    for child in rpr:
        wt = _wtag(child)
        if wt in _RPR_ORDER and _RPR_ORDER.index(wt) > idx:
            anchor = child
            break
    if anchor is not None:
        anchor.addprevious(el)
    else:
        rpr.append(el)
    return el


def _ensure_rpr(run_or_style_el):
    """คืน <w:rPr> ของ run/style element สร้างถ้ายังไม่มี (ใส่ไว้ต้น ๆ)"""
    rpr = run_or_style_el.find(qn("w:rPr"))
    if rpr is None:
        rpr = OxmlElement("w:rPr")
        run_or_style_el.insert(0, rpr)
    return rpr


def _apply_fonts(rpr, thai_font, latin_font, set_latin, skip_latin_fonts=None):
    """
    ตั้ง w:rFonts ให้แยกฟอนต์ตามภาษา
      - w:cs            = thai_font  (เสมอ — นี่คือหัวใจของการแก้ไทยเพี้ยน)
      - w:ascii/w:hAnsi = latin_font (เมื่อ set_latin=True)
        ถ้า latin_font เป็น None -> ใช้ thai_font เป็นฟอนต์ละตินด้วย (look เดียวกัน)
      - set_latin=False -> ไม่แตะ ascii/hAnsi (เก็บฟอนต์อังกฤษเดิมของผู้ใช้ไว้)
      - skip_latin_fonts : set[str] | None
        ถ้า w:ascii ปัจจุบันของ run ตรงกับฟอนต์ในเซตนี้ (เช่น "Consolas" ของ
        โค้ดบล็อก/ตาราง terminal output ที่ตั้งไว้ก่อนหน้าด้วย style_thai_run)
        จะ "ข้าม" ไม่ยัด latin_font ทับ — กัน enforce_thai() ตัวท้ายสคริปต์เผลอ
        ล้างฟอนต์ monospace ที่ตั้งใจไว้เฉพาะ run เงียบ ๆ (ฝั่ง cs/bidi ยังตั้งตามปกติ)
    ลบ theme hint ที่จะ override ค่าที่เราตั้ง (เช่น w:cstheme) ออกด้วย
    """
    rfonts = _rpr_child(rpr, "w:rFonts")
    # ฝั่งไทย/เชิงซ้อน — ตั้งเสมอ
    rfonts.set(qn("w:cs"), thai_font)
    # ลบ hint ที่อาจ override ฟอนต์ cs
    if rfonts.get(qn("w:cstheme")) is not None:
        del rfonts.attrib[qn("w:cstheme")]
    # ฝั่งละติน
    if set_latin:
        current_ascii = rfonts.get(qn("w:ascii"))
        if skip_latin_fonts and current_ascii in skip_latin_fonts:
            return
        latin = latin_font if latin_font else thai_font
        rfonts.set(qn("w:ascii"), latin)
        rfonts.set(qn("w:hAnsi"), latin)
        for hint in ("w:asciiTheme", "w:hAnsiTheme"):
            if rfonts.get(qn(hint)) is not None:
                del rfonts.attrib[qn(hint)]


def _half_points(size):
    """รับ Pt(...) / int / float (pt) -> string ครึ่งพอยต์ตามที่ XML ต้องการ"""
    if size is None:
        return None
    if hasattr(size, "pt"):          # docx.shared.Pt / Length
        pt = size.pt
    else:
        pt = float(size)
    return str(int(round(pt * 2)))


def _apply_size(rpr, default_size, latin_size, force_size):
    """
    จัดการขนาด:
      - ถ้า run มี w:sz เดิม (ตั้งขนาดมาเอง) -> mirror ไป w:szCs ให้เท่ากัน
        (และถ้า latin_size ระบุ -> sz=latin_size, szCs=ขนาดเดิม)
      - ถ้า run ไม่มี w:sz และ force_size=False -> ไม่ยุ่ง (ให้ inherit จาก style)
      - force_size=True -> เขียนทับทุก run: sz=ขนาดละติน, szCs=ขนาดไทย
    """
    sz = rpr.find(qn("w:sz"))

    thai_val = _half_points(default_size)
    latin_val = _half_points(latin_size) if latin_size is not None else thai_val

    if force_size:
        _rpr_child(rpr, "w:sz").set(qn("w:val"), latin_val)
        _rpr_child(rpr, "w:szCs").set(qn("w:val"), thai_val)
        return

    if sz is not None:
        # run ตั้งขนาดเอง: ขนาดไทยตามขนาดที่ตั้ง (หรือ default ถ้า latin_size แยก)
        existing = sz.get(qn("w:val"))
        cs_target = existing
        if latin_size is not None:
            # ละตินใช้ latin_size, ไทยใช้ default_size
            sz.set(qn("w:val"), latin_val)
            cs_target = thai_val
        _rpr_child(rpr, "w:szCs").set(qn("w:val"), cs_target)
    # ไม่มี sz และไม่ force -> ปล่อยให้ขนาดมาจาก style (เราตั้ง szCs ที่ style แทน)


def _mirror_bold_italic(rpr):
    """ตัวหนา/เอียงฝั่งละตินไม่ทำให้ไทยหนา/เอียง ต้อง mirror w:b->w:bCs, w:i->w:iCs"""
    for base, cs in (("w:b", "w:bCs"), ("w:i", "w:iCs")):
        b = rpr.find(qn(base))
        if b is not None and rpr.find(qn(cs)) is None:
            el = _rpr_child(rpr, cs)
            val = b.get(qn("w:val"))
            if val is not None:
                el.set(qn("w:val"), val)


def _apply_lang_bidi(rpr):
    """ตั้ง w:lang/@w:bidi='th-TH' -> Word ใช้พจนานุกรมตัดคำไทย จัดชิดขอบไม่เพี้ยน"""
    lang = _rpr_child(rpr, "w:lang")
    lang.set(qn("w:bidi"), THAI_LANG)
    if lang.get(qn("w:val")) is None:
        lang.set(qn("w:val"), DEFAULT_LATIN_LANG)


def _enforce_on_rpr(rpr, thai_font, latin_font, set_latin,
                    default_size, latin_size, force_size, do_size=True,
                    skip_latin_fonts=None):
    _apply_fonts(rpr, thai_font, latin_font, set_latin, skip_latin_fonts)
    if do_size:
        _apply_size(rpr, default_size, latin_size, force_size)
    _mirror_bold_italic(rpr)
    _apply_lang_bidi(rpr)


# ---------------------------------------------------------------------------
# การไล่ทั่วเอกสาร
# ---------------------------------------------------------------------------

def _iter_run_elements(container_el):
    """yield ทุก <w:r> ใต้ element ที่ให้มา (รวม run ในย่อหน้า ในตารางซ้อน)"""
    for r in container_el.iter(qn("w:r")):
        yield r


def _enforce_runs(container_el, **kw):
    for r in _iter_run_elements(container_el):
        rpr = _ensure_rpr(r)
        _enforce_on_rpr(rpr, do_size=True, **kw)


def _enforce_styles(doc, **kw):
    """
    ตั้ง cs/szCs/lang ที่ระดับ style ด้วย — เพื่อให้ run ที่ไม่ระบุขนาดเอง
    (เช่น หัวข้อ) สืบทอด szCs/ฟอนต์ไทยจาก style ได้ และไม่หด
    หมายเหตุ: ที่ระดับ style เราตั้ง szCs ตาม sz ของ style เอง ถ้า style ไม่มี sz
    ก็ไม่ยัด (ปล่อย inherit ต่อ) เว้นแต่ force_size
    """
    styles_el = doc.styles.element
    for style_el in styles_el.findall(qn("w:style")):
        rpr = style_el.find(qn("w:rPr"))
        if rpr is None:
            rpr = OxmlElement("w:rPr")
            # ใส่หลัง w:name ถ้ามี ไม่งั้นต้น ๆ
            style_el.append(rpr)
        _apply_fonts(rpr, kw["thai_font"], kw["latin_font"], kw["set_latin"])
        _mirror_bold_italic(rpr)
        _apply_lang_bidi(rpr)
        # ขนาด: mirror sz ของ style ไป szCs
        sz = rpr.find(qn("w:sz"))
        if kw["force_size"]:
            _rpr_child(rpr, "w:szCs").set(
                qn("w:val"), _half_points(kw["default_size"]))
        elif sz is not None and rpr.find(qn("w:szCs")) is None:
            _rpr_child(rpr, "w:szCs").set(qn("w:val"), sz.get(qn("w:val")))


def _enforce_doc_defaults(doc, **kw):
    """docDefaults/rPrDefault — ตาข่ายกันปัญหาชั้นสุดท้ายสำหรับ run ที่ไม่ระบุอะไรเลย"""
    styles_el = doc.styles.element
    docdef = styles_el.find(qn("w:docDefaults"))
    if docdef is None:
        docdef = OxmlElement("w:docDefaults")
        styles_el.insert(0, docdef)
    rprdef = _get_or_add(docdef, "w:rPrDefault")
    rpr = _get_or_add(rprdef, "w:rPr")
    _apply_fonts(rpr, kw["thai_font"], kw["latin_font"], kw["set_latin"])
    _apply_lang_bidi(rpr)
    if kw["force_size"]:
        _rpr_child(rpr, "w:szCs").set(qn("w:val"), _half_points(kw["default_size"]))


def _enforce_theme(doc, thai_font, latin_font, set_latin):
    """
    theme1.xml: ตั้ง <a:cs typeface="ไทย"/> ใต้ทั้ง majorFont และ minorFont
    (และ a:latin ถ้า set_latin) เผื่อ style บางตัวอ้างฟอนต์ผ่าน theme
    """
    part = None
    for p in doc.part.package.iter_parts():
        if "theme" in p.partname and str(p.partname).endswith(".xml"):
            part = p
            break
    if part is None:
        return
    from lxml import etree
    ns_a = "http://schemas.openxmlformats.org/drawingml/2006/main"
    try:
        root = etree.fromstring(part.blob)
    except Exception:
        return
    for scheme in (".//{%s}majorFont" % ns_a, ".//{%s}minorFont" % ns_a):
        node = root.find(scheme)
        if node is None:
            continue
        cs = node.find("{%s}cs" % ns_a)
        if cs is None:
            cs = etree.SubElement(node, "{%s}cs" % ns_a)
        cs.set("typeface", thai_font)
        if set_latin:
            latin = latin_font if latin_font else thai_font
            lat = node.find("{%s}latin" % ns_a)
            if lat is None:
                lat = etree.SubElement(node, "{%s}latin" % ns_a)
            lat.set("typeface", latin)
    part._blob = etree.tostring(root, xml_declaration=True,
                                encoding="UTF-8", standalone=True)


def _enforce_settings(doc):
    """settings.xml: themeFontLang/@w:bidi='th-TH' -> ภาษาเชิงซ้อนเริ่มต้นเป็นไทยทั้งเอกสาร"""
    try:
        settings_el = doc.settings.element
    except Exception:
        return
    tfl = settings_el.find(qn("w:themeFontLang"))
    if tfl is None:
        tfl = OxmlElement("w:themeFontLang")
        settings_el.append(tfl)
    tfl.set(qn("w:bidi"), THAI_LANG)
    if tfl.get(qn("w:val")) is None:
        tfl.set(qn("w:val"), DEFAULT_LATIN_LANG)


# ---------------------------------------------------------------------------
# API หลัก
# ---------------------------------------------------------------------------

def enforce_thai(doc, font=DEFAULT_THAI_FONT, latin_font=None,
                 default_size=DEFAULT_SIZE_PT, latin_size=None,
                 set_latin=True, force_size=False, auto_break=True,
                 skip_latin_fonts=None):
    """
    บังคับการตั้งค่าอักษรเชิงซ้อน (ไทย) ให้ครบทั้งเอกสาร เรียกครั้งเดียวก่อน save

    Parameters
    ----------
    font : str
        ฟอนต์ฝั่งไทย (w:cs). default "TH Sarabun New"
    latin_font : str | None
        ฟอนต์ฝั่งอังกฤษ/ละติน (w:ascii/hAnsi). ถ้า None -> ใช้ค่า `font` เป็นละตินด้วย
        ใส่ค่า เช่น "Times New Roman" เพื่อ **แยกฟอนต์ภาษา** จริง:
        อังกฤษเป็น Times New Roman, ไทยเป็น TH Sarabun New ใน run เดียวกัน
    default_size : int
        ขนาดไทย (pt) สำหรับ run ที่ไม่ได้ตั้งขนาดเอง / ใช้ตอน force_size
    latin_size : int | None
        ถ้าระบุ -> ขนาดฝั่งละตินแยกจากไทย (เช่น TH Sarabun ดูใหญ่กว่า อยากให้
        อังกฤษ 14 ไทย 16 ก็ latin_size=14, default_size=16)
    set_latin : bool
        True = ตั้งฟอนต์ฝั่งละตินด้วย; False = แตะเฉพาะฝั่งไทย เก็บฟอนต์อังกฤษเดิมไว้
        (เหมาะกับการแก้ไฟล์ที่ผู้ใช้ตั้งฟอนต์อังกฤษมาแล้ว)
    force_size : bool
        True = เขียนทับขนาดทุก run เป็น default_size/latin_size (ระวังหัวข้อจะเท่าเนื้อ)
        False = ไม่แตะ run ที่ inherit ขนาดจาก style (หัวข้อไม่หด) — แนะนำ
    auto_break : bool (default True)
        ใส่จุดตัดคำไทย (ZWSP) ให้อัตโนมัติทุก run -> กัน "อักษรห่าง" ตอน thaiDistribute
        ใน Word ที่ตัดคำไทยไม่ได้ โดยไม่ต้องจำสั่ง break_thai เอง
        ถ้าไม่มี pythainlp จะ "ข้าม" พร้อมเตือน (ไม่ทำให้ทั้งฟังก์ชันพัง)
        ตั้ง False เพื่อปิด (เช่นไม่อยากให้มี ZWSP ในข้อความ)
    skip_latin_fonts : set[str] | None
        เซตชื่อฟอนต์ละตินที่ "ห้ามยัดทับ" — run ไหนตั้ง w:ascii ไว้เป็นฟอนต์ในเซตนี้แล้ว
        (เช่นตั้งด้วย style_thai_run(..., latin_font="Consolas") สำหรับบล็อกโค้ด/
        terminal output) จะถูกข้ามไม่ยุ่งฝั่งละติน แต่ยังตั้ง w:cs/bidi/mirror
        bold-italic ตามปกติ กันปัญหา "เรียก enforce_thai ท้ายสคริปต์แล้วฟอนต์
        monospace ที่ตั้งใจไว้หายเงียบ ๆ" — ดู หมายเหตุ ด้านล่างสุดของไฟล์นี้
    """
    kw = dict(thai_font=font, latin_font=latin_font, set_latin=set_latin,
              default_size=default_size, latin_size=latin_size,
              force_size=force_size)

    body = doc.element.body
    _enforce_runs(body, skip_latin_fonts=skip_latin_fonts, **kw)

    for section in doc.sections:
        for hf in (section.header, section.footer,
                   section.even_page_header, section.even_page_footer,
                   section.first_page_header, section.first_page_footer):
            try:
                _enforce_runs(hf._element, skip_latin_fonts=skip_latin_fonts, **kw)
            except Exception:
                pass

    _enforce_styles(doc, **kw)
    _enforce_doc_defaults(doc, **kw)
    _enforce_theme(doc, font, latin_font, set_latin)
    _enforce_settings(doc)

    if auto_break:
        try:
            break_thai_in_doc(doc, _graceful=True)
        except Exception:
            pass
    return doc


# ---------------------------------------------------------------------------
# API แบบคุมราย run / สร้างเอกสารใหม่
# ---------------------------------------------------------------------------

def new_thai_document(font=DEFAULT_THAI_FONT, latin_font=None, size=DEFAULT_SIZE_PT):
    """สร้าง Document ใหม่ที่ตั้ง default ฝั่งไทยไว้แล้ว (docDefaults + Normal style)"""
    doc = Document()
    normal = doc.styles["Normal"]
    normal.font.name = latin_font if latin_font else font
    normal.font.size = Pt(size)
    rpr = _ensure_rpr(normal.element)
    _apply_fonts(rpr, font, latin_font, True)
    _rpr_child(rpr, "w:szCs").set(qn("w:val"), _half_points(size))
    _apply_lang_bidi(rpr)
    _enforce_doc_defaults(doc, thai_font=font, latin_font=latin_font,
                          set_latin=True, default_size=size, latin_size=None,
                          force_size=False)
    _enforce_theme(doc, font, latin_font, True)
    _enforce_settings(doc)
    return doc


def style_thai_run(run, font=DEFAULT_THAI_FONT, latin_font=None,
                   bold=None, italic=None, size=None, latin_size=None):
    """ตั้งค่า run เดียวให้แยกฟอนต์ภาษา + cs ครบ (ใช้ตอนคุมเอง)"""
    if bold is not None:
        run.font.bold = bold
    if italic is not None:
        run.font.italic = italic
    if size is not None:
        run.font.size = Pt(size)
    rpr = _ensure_rpr(run._r)
    _apply_fonts(rpr, font, latin_font, True)
    _mirror_bold_italic(rpr)
    _apply_lang_bidi(rpr)
    if size is not None:
        _rpr_child(rpr, "w:szCs").set(qn("w:val"), _half_points(size))
        if latin_size is not None:
            _rpr_child(rpr, "w:sz").set(qn("w:val"), _half_points(latin_size))
    return run


# ---------------------------------------------------------------------------
# ล้างข้อความที่ก๊อปมาจาก PDF (แก้ปัญหา "อักษรห่าง" ตอนใช้ thaiDistribute)
# ---------------------------------------------------------------------------

def clean_pdf_thai(text, join_thai_spaces=True, collapse_spaces=True):
    """
    ล้างข้อความไทยที่ก๊อปมาจาก PDF ก่อนนำไปวางในเอกสาร

    ทำไมต้องล้าง: ตัวแยกข้อความของ PDF มักแทรก "ช่องว่างปลอม" ระหว่างพยางค์/ตัวอักษร
    ไทย (เพราะ PDF เก็บ glyph เป็นตัว ๆ ไม่รู้จักคำไทย) และบางทีก็มีอักขระล่องหน
    (zero-width space, no-break space, soft hyphen) ปนมา พอนำไปวางในย่อหน้าที่จัด
    ชิดขอบแบบไทย (thaiDistribute) ช่องว่างปลอมทุกตัวจะกลายเป็นจุดที่ Word ดึงยืด ->
    ตัวอักษรห่างเป็นช่อง ๆ ฟังก์ชันนี้ลบช่องว่าง/อักขระล่องหนเหล่านั้นออก ให้ข้อความ
    กลับมาต่อเนื่องเหมือนพิมพ์เอง (Word จะตัดคำด้วยพจนานุกรมไทยได้ถูกต้อง)

    Parameters
    ----------
    join_thai_spaces : bool (default True)
        ลบช่องว่างเดี่ยวที่ขนาบด้วยอักษรไทยทั้งสองข้าง (เช่น "ใ น ช่ ว ง" -> "ในช่วง")
        หมายเหตุ: จะลบช่องว่างระหว่างวรรคไทยที่จงใจเว้นด้วย หากต้องการเก็บไว้ตั้ง False
        (แต่ thaiDistribute อาจยังยืดบ้าง) — สำหรับข้อความจาก PDF แนะนำ True
    collapse_spaces : bool (default True)
        ยุบช่องว่างซ้ำ 2 ตัวขึ้นไปให้เหลือตัวเดียว

    ช่องว่างที่อยู่ติดอักษรละติน/ตัวเลข/วงเล็บ จะถูก "เก็บไว้" เสมอ (ไม่พังคำอังกฤษ)
    """
    if not text:
        return text
    text = unicodedata.normalize("NFC", text)
    for ch in _INVISIBLE:
        text = text.replace(ch, "")
    text = re.sub("[" + _UNI_SPACES + "]", " ", text)
    text = text.replace("\t", " ")
    # ดึงสระ/วรรณยุกต์ non-spacing ที่ถูกตัดออกจากพยัญชนะกลับมาติด (เช่น "ช ่" -> "ช่")
    text = re.sub(r"[ ]+([" + _THAI_COMBINING + r"])", r"\1", text)
    if join_thai_spaces:
        pat = re.compile(r"([" + _THAI + r"]) (?=[" + _THAI + r"])")
        prev = None
        while prev != text:
            prev = text
            text = pat.sub(r"\1", text)
    if collapse_spaces:
        text = re.sub(r" {2,}", " ", text)
    return text.strip()


def clean_thai_in_doc(doc, join_thai_spaces=True, collapse_spaces=True):
    """
    เดินล้างข้อความใน run ทุกตัวของเอกสารที่สร้างไปแล้ว (เผื่อเผลอวางข้อความจาก PDF
    ลงไปก่อน) — ล้างเฉพาะ run ที่มีอักษรไทย คืนจำนวน run ที่ถูกแก้
    """
    changed = 0
    for r in doc.element.body.iter(qn("w:r")):
        for t in r.findall(qn("w:t")):
            if t.text and re.search("[" + _THAI + "]", t.text):
                new = clean_pdf_thai(t.text, join_thai_spaces, collapse_spaces)
                if new != t.text:
                    t.text = new
                    # ถ้าข้อความมีหัว/ท้ายเป็นช่องว่างที่ตั้งใจ ต้องคง xml:space
                    if new != new.strip() or "  " in new:
                        t.set(qn("xml:space"), "preserve")
                    changed += 1
    return changed


# ---------------------------------------------------------------------------
# ใส่จุดตัดคำไทย (ZWSP) ที่ขอบเขตคำ — แก้ "อักษรห่าง" ใน Word ที่ตัดคำไทยไม่ได้
# ---------------------------------------------------------------------------

_ZWSP = "\u200b"
_TOKENIZER = "unset"   # cache: callable | None (เคยลองแล้วไม่มี)
_WARNED_NO_PYTHAINLP = False


def _is_thai_char(ch):
    return ch and "\u0E00" <= ch <= "\u0E7F"


def _get_word_tokenize(auto_install=True):
    """
    คืนฟังก์ชัน word_tokenize ของ pythainlp; ถ้าไม่มีลอง pip install ให้ครั้งเดียว
    คืน None ถ้าหาไม่ได้จริง ๆ (ผลถูก cache ไว้ ไม่ลองซ้ำ)
    """
    global _TOKENIZER
    if _TOKENIZER != "unset":
        return _TOKENIZER
    try:
        from pythainlp.tokenize import word_tokenize
        _TOKENIZER = word_tokenize
        return _TOKENIZER
    except ImportError:
        pass
    # auto-install ถูกตัดออกโดยตั้งใจ (ไม่ pip install เงียบ ๆ ลง system Python)
    # ถ้าไม่มี pythainlp -> ปล่อยให้ caller ข้าม (enforce_thai graceful) หรือ raise
    # ติดตั้งเองครั้งเดียว: pip install pythainlp
    _ = auto_install  # คง signature เดิมไว้ ไม่ใช้แล้ว
    _TOKENIZER = None
    return None


def insert_thai_word_breaks(text, engine="newmm"):
    """
    แทรก zero-width space (U+200B) ที่ "ขอบเขตคำไทย" เพื่อให้ Word มีจุดตัดบรรทัด
    ชัดเจน ไม่ตัดกลางคำ

    ทำไมต้องใช้: Word บางสภาพแวดล้อมไม่ตัดคำไทยให้เอกสารที่สร้างจาก python-docx
    (ตัดเฉพาะที่ช่องว่าง) พอเจอข้อความไทยยาวที่ไม่มีช่องว่าง + จัดชิดขอบแบบไทย
    (thaiDistribute) Word จะถูกบังคับให้ตัดกลางคำแล้วยืดทีละตัวอักษร -> อักษรห่าง
    การใส่ ZWSP ที่รอยต่อคำเองทำให้ Word ตัดตรงรอยคำ ไม่ขึ้นกับว่า Word จะรู้จัก
    การตัดคำไทยหรือไม่ (ZWSP เป็นจุดตัดมาตรฐานตาม Unicode ที่ทุกโปรแกรมรองรับ)

    ใส่ ZWSP เฉพาะระหว่างคำไทย-ไทยเท่านั้น ไม่แตะช่องว่าง/อังกฤษ/ตัวเลขละติน
    ต้องติดตั้ง pythainlp (pip install pythainlp) — ถ้าไม่มีจะ raise ImportError
    """
    wt = _get_word_tokenize()
    if wt is None:
        raise ImportError(
            "ต้องติดตั้ง pythainlp ก่อนใช้ insert_thai_word_breaks: "
            "pip install pythainlp --break-system-packages")
    if not text:
        return text
    toks = wt(text, engine=engine)
    out = []
    for tok in toks:
        if out and out[-1] and tok and _is_thai_char(out[-1][-1]) \
                and _is_thai_char(tok[0]):
            out.append(_ZWSP)
        out.append(tok)
    return "".join(out)


def break_thai_in_doc(doc, engine="newmm", _graceful=False):
    """
    เดินใส่จุดตัดคำไทย (ZWSP) ให้ run ทุกตัวที่มีอักษรไทยทั้งเอกสาร
    คืนจำนวน run ที่ถูกแก้ — เรียกหลังใส่เนื้อหาครบ ก่อน enforce_thai/ save ก็ได้
    (ควรล้างข้อความจาก PDF ด้วย clean_thai_in_doc ก่อน ไม่งั้น ZWSP เดิมจะถูกลบทีหลัง)
    _graceful=True -> ถ้าไม่มี pythainlp จะข้ามพร้อมเตือน (ไม่ raise) ใช้โดย enforce_thai
    """
    global _WARNED_NO_PYTHAINLP
    wt = _get_word_tokenize()
    if wt is None:
        if _graceful:
            if not _WARNED_NO_PYTHAINLP:
                import sys as _sys
                print("[thai-docx] เตือน: ไม่พบ pythainlp -> ข้ามการใส่จุดตัดคำไทย "
                      "(อาจเกิด 'อักษรห่าง' กับ thaiDistribute) "
                      "ติดตั้งด้วย: pip install pythainlp --break-system-packages",
                      file=_sys.stderr)
                _WARNED_NO_PYTHAINLP = True
            return 0
        raise ImportError(
            "ต้องติดตั้ง pythainlp: pip install pythainlp --break-system-packages")
    changed = 0
    for r in doc.element.body.iter(qn("w:r")):
        for t in r.findall(qn("w:t")):
            if t.text and re.search("[" + _THAI + "]", t.text) \
                    and _ZWSP not in t.text:
                new = insert_thai_word_breaks(t.text, engine)
                if new != t.text:
                    t.text = new
                    changed += 1
    return changed


# ---------------------------------------------------------------------------
# จัดชิดขอบ / สร้างย่อหน้า
# ---------------------------------------------------------------------------

_ALIGN_MAP = {
    "left": WD_ALIGN_PARAGRAPH.LEFT,
    "center": WD_ALIGN_PARAGRAPH.CENTER,
    "right": WD_ALIGN_PARAGRAPH.RIGHT,
    "justify": WD_ALIGN_PARAGRAPH.JUSTIFY,
    "both": WD_ALIGN_PARAGRAPH.JUSTIFY,
}


def set_paragraph_alignment(p, align):
    """
    จัดชิดขอบย่อหน้า:
      - "thai"  = จัดชิดขอบแบบไทย (thaiDistribute) — กระจายเต็มความกว้าง "ทุกบรรทัด"
                  สไตล์เอกสารราชการ *ต้องล้างข้อความจาก PDF ก่อน* ไม่งั้นอักษรจะห่าง
      - "justify"/"both" = จัดชิดขอบปกติ — ยืดเฉพาะช่องว่างระหว่างคำ บรรทัดสุดท้ายไม่ยืด
      - "left"/"center"/"right"
    (thaiDistribute ไม่มีใน enum ของ python-docx ต้องเขียน w:jc/@w:val เอง)
    """
    if align in ("thai", "thaidistribute"):
        ppr = p._p.get_or_add_pPr()
        jc = ppr.find(qn("w:jc"))
        if jc is None:
            jc = OxmlElement("w:jc")
            ppr.append(jc)
        jc.set(qn("w:val"), "thaiDistribute")
    elif align in _ALIGN_MAP:
        p.alignment = _ALIGN_MAP[align]
    return p


def set_heading_indent(p, level):
    """
    ตั้ง left indent ของย่อหน้าหัวข้อตามระดับเลขข้อ (1 / 1.1 / 1.1.1 / ...):
      level=1 -> 0.00 ซม. (เช่น "ข้อ 1", "1.")
      level=2 -> 1.25 ซม. (เช่น "1.1")
      level=3 -> 2.50 ซม. (เช่น "1.1.1")
      level=N -> (N-1) * 1.25 ซม.
    บังคับ first-line indent = 0 เสมอ กันหัวข้อสืบทอด first-line indent 1.25 ซม.
    ของย่อหน้าเนื้อความมาโดยไม่ตั้งใจ (ตัวเลขข้อจะเยื้องเพิ่มผิดที่)
    การเยื้องนี้คือ "left indent" ของย่อหน้า ไม่ใช่การแทรกอักขระ tab (\\t) หน้าเลขข้อ
    """
    pf = p.paragraph_format
    pf.left_indent = Cm(HEADING_INDENT_STEP_CM * (level - 1))
    pf.first_line_indent = Cm(0)
    return p


def add_thai_heading(doc, text, level=1, size=None, bold=True,
                     font=DEFAULT_THAI_FONT, latin_font=None, align=None):
    """
    เพิ่มหัวข้อไทยพร้อมตั้ง indent ตามระดับให้อัตโนมัติ (ดู set_heading_indent)
    ใช้ doc.add_paragraph ธรรมดา (ไม่ใช้ doc.add_heading/style Heading N ของ Word
    เพราะ style เริ่มต้นของ Word ไม่ได้ตั้ง indent ตามสเกลนี้ให้ และเรายังต้องคุม
    ฟอนต์/ขนาดไทยเองผ่าน style_thai_run อยู่แล้ว)
    """
    p = doc.add_paragraph()
    set_heading_indent(p, level)
    if text:
        run = p.add_run(text)
        style_thai_run(run, font=font, latin_font=latin_font, bold=bold, size=size)
    if align:
        set_paragraph_alignment(p, align)
    return p


def add_thai_paragraph(doc, text, size=None, align=None, bold=False,
                       font=DEFAULT_THAI_FONT, latin_font=None, style=None,
                       from_pdf=False, break_thai=False, first_line_indent=False):
    """
    เพิ่มย่อหน้าไทยพร้อมตั้งค่า run ให้ถูก + จัดชิดขอบตามต้องการ
    from_pdf=True   -> ล้างข้อความด้วย clean_pdf_thai ก่อน (text ก๊อปมาจาก PDF)
    break_thai=True -> ใส่จุดตัดคำไทย (ZWSP) เพื่อกัน "อักษรห่าง" ตอนใช้ thaiDistribute
                       ใน Word ที่ตัดคำไทยไม่ได้ (ต้องมี pythainlp)
    first_line_indent=True -> เยื้องบรรทัดแรก 1.25 ซม. (มาตรฐานย่อหน้าเนื้อความไทย
                       ที่อยู่ใต้หัวข้อ) — ไม่ใช่ default เพราะย่อหน้าสั้น/หัวข้อเองไม่ต้องเยื้อง
    ลำดับ: ล้างก่อน แล้วค่อยใส่จุดตัดคำ
    """
    if text and from_pdf:
        text = clean_pdf_thai(text)
    if text and break_thai:
        text = insert_thai_word_breaks(text)
    p = doc.add_paragraph(style=style) if style else doc.add_paragraph()
    if text:
        run = p.add_run(text)
        style_thai_run(run, font=font, latin_font=latin_font,
                       bold=bold if bold else None, size=size)
    if align:
        set_paragraph_alignment(p, align)
    if first_line_indent:
        p.paragraph_format.first_line_indent = Cm(BODY_FIRST_LINE_INDENT_CM)
    return p
