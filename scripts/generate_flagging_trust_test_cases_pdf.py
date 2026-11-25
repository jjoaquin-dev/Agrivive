#!/usr/bin/env python3
"""Flagging-Trust-test-sheet.md -> Agrivive/docs/Flagging-Trust-Test-Cases.pdf (landscape)"""
import os, re
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

DOCS = os.path.join(os.path.dirname(__file__), "..", "Agrivive", "docs")
GREEN, LINE, CREAM = colors.HexColor("#1F4D3A"), colors.HexColor("#E5E2DA"), colors.HexColor("#F8F6F1")
ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Heading1"], textColor=GREEN, fontSize=16, spaceAfter=6)
P = ParagraphStyle("P", parent=ss["BodyText"], fontSize=9.5, leading=13, spaceAfter=2)
CELL = ParagraphStyle("C", parent=P, fontSize=7.5, leading=9.5, spaceAfter=0)
HEAD = ParagraphStyle("Hd", parent=CELL, textColor=colors.white, fontName="Helvetica-Bold")

def clean(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return re.sub(r"`(.+?)`", r"<font name='Courier'>\1</font>", t)

lines = open(os.path.join(DOCS, "Flagging-Trust-test-sheet.md"), encoding="utf-8").read().split("\n")
story, rows = [], []
for line in lines:
    if line.startswith("# "):
        story.append(Paragraph(clean(line[2:]), H1))
    elif line.startswith("|"):
        cells = [c.strip() for c in line.strip().strip("|").split(" | ")]
        if not set(line) <= set("|- "):
            rows.append(cells)
    elif line.strip():
        story.append(Paragraph(clean(line), P))
story.append(Spacer(1, 8))
data = [[Paragraph(clean(c), HEAD if i == 0 else CELL) for c in r] for i, r in enumerate(rows)]
t = Table(data, colWidths=[0.65 * inch, 1.9 * inch, 2.0 * inch, 3.3 * inch, 0.55 * inch, 1.1 * inch], repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), GREEN), ("GRID", (0, 0), (-1, -1), 0.5, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREAM]),
    ("TOPPADDING", (0, 0), (-1, -1), 3), ("BOTTOMPADDING", (0, 0), (-1, -1), 3)]))
story.append(t)
SimpleDocTemplate(os.path.join(DOCS, "Flagging-Trust-Test-Cases.pdf"), pagesize=landscape(letter), leftMargin=0.4 * inch,
                  rightMargin=0.4 * inch, topMargin=0.5 * inch, bottomMargin=0.5 * inch, title="Flagging and Trust Test Cases").build(story)
