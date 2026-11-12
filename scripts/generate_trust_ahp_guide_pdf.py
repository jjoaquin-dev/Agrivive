#!/usr/bin/env python3
"""Trust Points and AHP Guide (caveman style) -> Agrivive/docs/Trust Points and AHP Guide.pdf"""
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

from ahp_math import RI, ahp, fmt, points
from trust_guide_samples import samples

GREEN, LINE, CREAM = colors.HexColor("#1F4D3A"), colors.HexColor("#E5E2DA"), colors.HexColor("#F8F6F1")
OUT = os.path.join(os.path.dirname(__file__), "..", "Agrivive", "docs", "Trust Points and AHP Guide.pdf")
ss = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=ss["Heading1"], textColor=GREEN, fontSize=17, spaceBefore=10, spaceAfter=6)
H2 = ParagraphStyle("H2", parent=ss["Heading2"], textColor=GREEN, fontSize=12.5, spaceBefore=8, spaceAfter=4)
P = ParagraphStyle("P", parent=ss["BodyText"], fontSize=10, leading=14, spaceAfter=5)
CELL = ParagraphStyle("C", parent=P, fontSize=8.5, leading=10.5, spaceAfter=0)
HEAD = ParagraphStyle("Hd", parent=CELL, textColor=colors.white, fontName="Helvetica-Bold")
NOTE = ParagraphStyle("N", parent=P, fontSize=9, textColor=colors.HexColor("#6B665C"))


def table(rows, widths=None, head=True):
    data = [[Paragraph(str(c), HEAD if (head and i == 0) else CELL) for c in r] for i, r in enumerate(rows)]
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    style = [("GRID", (0, 0), (-1, -1), 0.5, LINE), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
             ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
             ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREAM])]
    if head:
        style.append(("BACKGROUND", (0, 0), (-1, 0), GREEN))
    t.setStyle(TableStyle(style))
    return t


def sample_story(s, story):
    names, m = s["names"], s["matrix"]
    n, r = len(names), ahp(s["matrix"])
    story += [Paragraph(s["title"], H1), Paragraph(s["story"], P), Paragraph("Sample data. Not real judge answers.", NOTE)]
    if "judges" in s:
        for k, jm in enumerate(s["judges"], 1):
            story += [Paragraph("Step 0. Judge %d matrix" % k, H2),
                      table([[""] + names] + [[names[i]] + [fmt(jm[i][j]) for j in range(n)] for i in range(n)])]
    story += [Paragraph("Step 1. Pair matrix" + (" (merged, geometric mean)" if "judges" in s else ""), H2),
              table([[""] + names] + [[names[i]] + [fmt(m[i][j]) for j in range(n)] for i in range(n)]
                    + [["Column sum"] + ["%.3f" % x for x in r["col"]]]),
              Paragraph("Step 2. Divide each cell by its column sum. Average each row. Row average = weight.", H2),
              table([[""] + names + ["Weight"]] + [[names[i]] + ["%.3f" % x for x in r["norm"][i]] + ["<b>%.3f</b>" % r["w"][i]]
                                                   for i in range(n)]),
              Paragraph("Step 3. Check judges did not fight themselves", H2),
              Paragraph("lambda max = %.3f. CI = (lambda max - n) / (n - 1) = %.4f. CR = CI / RI = %.4f / %.2f = <b>%.3f</b>. %s"
                        % (r["lam"], r["ci"], r["ci"], RI[n], r["cr"],
                           "Under 0.10. Keep." if r["cr"] <= 0.10 else "Over 0.10. Judges redo pairs."), P),
              Paragraph("Step 4. Make points", H2),
              table([["Violation", "Weight", "Weight / smallest weight", "Points"]]
                    + [[names[i], "%.3f" % r["w"][i], "%.2f" % (r["w"][i] / min(r["w"])), points(r["w"])[i]] for i in range(n)],
                    [2.4 * inch, 1.1 * inch, 2.1 * inch, 1.0 * inch]), PageBreak()]


def build():
    from trust_guide_text import intro, sections
    story = [Paragraph("Trust Points and AHP Guide", ParagraphStyle("T", parent=ss["Title"], textColor=GREEN)),
             Paragraph("Agrivive flagging. Simple words. Sample numbers made by script, so math is right.", NOTE)]
    story += intro(P, H1, H2, NOTE, table)
    story += sections(P, H1, H2, NOTE, table)
    for s in samples:
        sample_story(s, story)
    story += [Paragraph("Honest limits", H1)]
    from trust_guide_text import limits
    story += limits(P, table)
    doc = SimpleDocTemplate(OUT, pagesize=letter, leftMargin=0.8 * inch, rightMargin=0.8 * inch,
                            topMargin=0.8 * inch, bottomMargin=0.8 * inch, title="Trust Points and AHP Guide", author="Agrivive")
    doc.build(story)
    print("wrote", os.path.abspath(OUT))


if __name__ == "__main__":
    build()
