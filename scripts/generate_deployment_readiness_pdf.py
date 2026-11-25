#!/usr/bin/env python3
"""Deployment-Readiness-Criteria.md -> Agrivive/docs/Deployment-Readiness-Criteria.pdf (landscape, green)"""
import os, re, sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

DOCS = os.path.join(os.path.dirname(__file__), "..", "Agrivive", "docs")
GREEN, LINE, TINT = colors.HexColor("#1F4D3A"), colors.HexColor("#CFE3D6"), colors.HexColor("#EAF4EE")
ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Heading1"], textColor=GREEN, fontSize=18, spaceAfter=6)
H2 = ParagraphStyle("H2", parent=ss["Heading2"], textColor=GREEN, fontSize=13, spaceBefore=10, spaceAfter=4)
P = ParagraphStyle("P", parent=ss["BodyText"], fontSize=9.5, leading=13, spaceAfter=2)
CELL = ParagraphStyle("C", parent=P, fontSize=9, leading=11.5, spaceAfter=0)
HEAD = ParagraphStyle("Hd", parent=CELL, textColor=colors.white, fontName="Helvetica-Bold")

def clean(t):
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)

def table(rows):
    n = len(rows[0])
    w = 10.2 * inch
    widths = {5: [0.4, 1.8, 4.6, 1.0, 2.4], 7: [0.45, 1.7, 2.9, 2.6, 0.8, 0.75, 1.0]}.get(n, [w / n / inch] * n)
    data = [[Paragraph(clean(c), HEAD if i == 0 else CELL) for c in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=[x * inch for x in widths], repeatRows=1, rowHeights=None)
    t.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), GREEN), ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, TINT]),
        ("TOPPADDING", (0, 0), (-1, -1), 6), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
    return t

NAME = sys.argv[1] if len(sys.argv) > 1 else "Deployment-Readiness-Criteria"  # e.g. Seller-Task-Criteria
lines = open(os.path.join(DOCS, NAME + ".md"), encoding="utf-8").read().split("\n")
story, rows, fm = [], [], 0
for line in lines + [""]:
    if line.strip() == "---":
        fm += 1
        continue
    if fm == 1 or line.startswith("Parent:"):
        continue
    if line.startswith("|"):
        if not set(line) <= set("|- "):
            rows.append([c.strip() for c in line.strip().strip("|").split("|")])
        continue
    if rows:
        story += [table(rows), Spacer(1, 6)]
        rows = []
    if line.startswith("# "):
        story.append(Paragraph(clean(line[2:]), H1))
    elif line.startswith("## "):
        story.append(Paragraph(clean(line[3:]), H2))
    elif line.strip():
        story.append(Paragraph(clean(line), P))
SimpleDocTemplate(os.path.join(DOCS, NAME + ".pdf"), pagesize=landscape(letter), leftMargin=0.4 * inch,
                  rightMargin=0.4 * inch, topMargin=0.5 * inch, bottomMargin=0.5 * inch, title=NAME.replace("-", " ")).build(story)
