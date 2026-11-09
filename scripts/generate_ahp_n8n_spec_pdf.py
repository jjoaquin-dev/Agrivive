#!/usr/bin/env python3
"""
Agrivive Technical Specification Generator:
AHP-TOPSIS Multi-Criteria Decision Engine and n8n Automated Social Promotion Pipeline.
Includes:
- High-resolution visual pipeline diagrams (IPO framework and n8n seller workflow)
- Typeset mathematical notation (Greek letters, summations, fractions, roots, subscripts/superscripts)
- Step-by-step tables with exact mathematical derivation and detailed explanatory context.
"""

import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, ListFlowable, ListItem, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

# Register TrueType Fonts for Crisp Mathematical Typesetting
FONT_BOLD_PATH = "/usr/share/fonts/google-carlito-fonts/Carlito-Bold.ttf"
FONT_REG_PATH = "/usr/share/fonts/google-carlito-fonts/Carlito-Regular.ttf"

pdfmetrics.registerFont(TTFont("Ubuntu", FONT_REG_PATH))
pdfmetrics.registerFont(TTFont("Ubuntu-Bold", FONT_BOLD_PATH))
pdfmetrics.registerFont(TTFont("Carlito", FONT_REG_PATH))
pdfmetrics.registerFont(TTFont("Carlito-Bold", FONT_BOLD_PATH))

# Palette constants adhering to Agrivive UI/UX Guidelines
GREEN_DARK = colors.HexColor("#1F4D3A")    # Forest Green Brand Primary
GREEN_LIGHT = colors.HexColor("#457D00")   # Accent Agrivive Green
LIME = colors.HexColor("#CBE842")          # Lime highlight bar
DARK = colors.HexColor("#14231A")          # Body copy text
MUTED = colors.HexColor("#5F7367")         # Subtitles & secondary labels
BG_SOFT = colors.HexColor("#F8F9F5")       # Warm Cream / Soft tint
BG_CARD = colors.HexColor("#FFFFFF")       # Pure White container
LINE_COLOR = colors.HexColor("#D9E3CC")    # Crisp 1px border
AMBER_BG = colors.HexColor("#FFFBEB")      # Formula callout background
AMBER_BORDER = colors.HexColor("#F59E0B")  # Formula callout border
AMBER_TEXT = colors.HexColor("#92400E")    # Formula callout text
CODE_BG = colors.HexColor("#F1F5F9")       # Code snippet background

PRINT_WIDTH = 178 * mm  # A4 width (210mm) - 2 * 16mm margin

# Dynamic Two-Pass Canvas for Precise Page Numbering
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        # Suppress headers on Cover Page (Page 1)
        if self._pageNumber > 1:
            # Running Header
            self.setFont("Ubuntu-Bold", 8)
            self.setFillColor(GREEN_DARK)
            self.drawString(16 * mm, A4[1] - 12 * mm, "AGRIVIVE TECHNICAL SPECIFICATION")
            self.setFont("Ubuntu", 8)
            self.setFillColor(MUTED)
            self.drawRightString(A4[0] - 16 * mm, A4[1] - 12 * mm, "AHP-TOPSIS & n8n Boost Engine")
            self.setStrokeColor(LINE_COLOR)
            self.setLineWidth(0.6)
            self.line(16 * mm, A4[1] - 14 * mm, A4[0] - 16 * mm, A4[1] - 14 * mm)

            # Running Footer
            self.line(16 * mm, 14 * mm, A4[0] - 16 * mm, 14 * mm)
            self.setFont("Ubuntu", 8)
            self.setFillColor(MUTED)
            self.drawString(16 * mm, 9.5 * mm, "Agrivive · Davao City Surplus Vegetable Marketplace")
            self.drawRightString(A4[0] - 16 * mm, 9.5 * mm, f"Page {self._pageNumber} of {total_pages}")
        else:
            # Elegant Cover Page Footer
            self.setFont("Ubuntu", 8.5)
            self.setFillColor(MUTED)
            self.drawCentredString(A4[0] / 2.0, 12 * mm, "Confidential & Proprietary · Agrivive System Documentation · 2026")
        self.restoreState()


# Typography Styles using TrueType Fonts
def create_style(name, **kwargs):
    base = dict(fontName="Ubuntu", fontSize=9.5, leading=13.5, textColor=DARK, alignment=TA_LEFT)
    base.update(kwargs)
    return ParagraphStyle(name, **base)

st_body = create_style("BodyText")
st_body_bold = create_style("BodyTextBold", fontName="Ubuntu-Bold")
st_body_justify = create_style("BodyJustify", alignment=TA_JUSTIFY)
st_small = create_style("SmallText", fontSize=8.5, leading=11.5, textColor=MUTED)
st_code = create_style("CodeText", fontName="Courier", fontSize=8.0, leading=10.5, textColor=DARK)

st_cover_title = create_style("CoverTitle", fontName="Ubuntu-Bold", fontSize=21, leading=25, textColor=colors.white)
st_cover_sub = create_style("CoverSub", fontName="Ubuntu", fontSize=11, leading=15, textColor=LIME)
st_cover_meta = create_style("CoverMeta", fontName="Ubuntu", fontSize=9, leading=13, textColor=colors.white)

st_h1 = create_style("Heading1", fontName="Ubuntu-Bold", fontSize=14.5, leading=18, textColor=GREEN_DARK, spaceBefore=14, spaceAfter=6, keepWithNext=True)
st_h2 = create_style("Heading2", fontName="Ubuntu-Bold", fontSize=11.5, leading=15, textColor=GREEN_LIGHT, spaceBefore=10, spaceAfter=4, keepWithNext=True)
st_h3 = create_style("Heading3", fontName="Ubuntu-Bold", fontSize=10, leading=13, textColor=DARK, spaceBefore=7, spaceAfter=3, keepWithNext=True)

st_tbl_header = create_style("TableHeader", fontName="Ubuntu-Bold", fontSize=8.5, leading=11, textColor=colors.white, alignment=TA_CENTER)
st_tbl_cell = create_style("TableCell", fontSize=8.5, leading=11, textColor=DARK, alignment=TA_LEFT)
st_tbl_cell_center = create_style("TableCellCenter", fontSize=8.5, leading=11, textColor=DARK, alignment=TA_CENTER)
st_tbl_cell_bold = create_style("TableCellBold", fontName="Ubuntu-Bold", fontSize=8.5, leading=11, textColor=DARK, alignment=TA_LEFT)
st_tbl_cell_bold_center = create_style("TableCellBoldCenter", fontName="Ubuntu-Bold", fontSize=8.5, leading=11, textColor=DARK, alignment=TA_CENTER)

st_formula_title = create_style("FormulaTitle", fontName="Ubuntu-Bold", fontSize=8.5, leading=11, textColor=AMBER_TEXT)
st_formula_math = create_style("FormulaMath", fontName="Ubuntu-Bold", fontSize=9.5, leading=13.5, textColor=DARK)
st_desc_text = create_style("DescText", fontSize=8.8, leading=12.2, textColor=DARK, alignment=TA_JUSTIFY)

def P(text, style=st_body):
    return Paragraph(str(text), style)

def callout_box(content_flowables, bg=BG_SOFT, border=LINE_COLOR, width=PRINT_WIDTH):
    t = Table([[content_flowables]], colWidths=[width])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("BOX", (0, 0), (-1, -1), 0.8, border),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t

def formula_box(formula_markup, title_str="MATHEMATICAL EXPRESSION &amp; FORMULATION:"):
    elements = [
        P(title_str, st_formula_title),
        Spacer(1, 2),
        P(formula_markup, st_formula_math)
    ]
    return callout_box(elements, bg=AMBER_BG, border=AMBER_BORDER)

def styled_table(data_matrix, col_widths, is_header=True, custom_alignments=None):
    formatted = []
    for row_idx, row in enumerate(data_matrix):
        formatted_row = []
        for col_idx, cell_value in enumerate(row):
            if isinstance(cell_value, Paragraph):
                formatted_row.append(cell_value)
            else:
                if row_idx == 0 and is_header:
                    formatted_row.append(P(str(cell_value), st_tbl_header))
                else:
                    align = custom_alignments[col_idx] if custom_alignments and col_idx < len(custom_alignments) else "L"
                    if align == "C":
                        style = st_tbl_cell_center
                    elif align == "BC":
                        style = st_tbl_cell_bold_center
                    elif align == "B":
                        style = st_tbl_cell_bold
                    else:
                        style = st_tbl_cell
                    formatted_row.append(P(str(cell_value), style))
        formatted.append(formatted_row)

    t = Table(formatted, colWidths=col_widths, repeatRows=1 if is_header else 0)
    t_style = [
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE_COLOR),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    if is_header:
        t_style.append(("BACKGROUND", (0, 0), (-1, 0), GREEN_DARK))
        for r in range(1, len(data_matrix)):
            if r % 2 == 0:
                t_style.append(("BACKGROUND", (0, r), (-1, r), BG_SOFT))
    else:
        for r in range(0, len(data_matrix)):
            if r % 2 == 1:
                t_style.append(("BACKGROUND", (0, r), (-1, r), BG_SOFT))

    t.setStyle(TableStyle(t_style))
    return t

def table_card(tbl_num, tbl_title, table_obj, formula_text=None, explanation_text=None):
    parts = []
    title_p = P(f"<b>Table {tbl_num}: {tbl_title}</b>", st_h3)
    parts.append(title_p)
    parts.append(Spacer(1, 2))
    
    if formula_text:
        parts.append(formula_box(formula_text))
        parts.append(Spacer(1, 4))
        
    parts.append(table_obj)
    
    if explanation_text:
        parts.append(Spacer(1, 3))
        parts.append(P(f"<b>Explanation &amp; Interpretation:</b> {explanation_text}", st_desc_text))
        
    parts.append(Spacer(1, 8))
    return KeepTogether(parts)


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
    )

    story = []

    # =========================================================================
    # COVER PAGE / TITLE BLOCK
    # =========================================================================
    cover_elements = [
        P("AGRIVIVE TECHNICAL SPECIFICATION", create_style("PreTitle", fontName="Ubuntu-Bold", fontSize=10, leading=12, textColor=LIME)),
        Spacer(1, 3),
        P("AHP-TOPSIS Ranking Engine &amp;<br/>n8n Marketing Boost Automation", st_cover_title),
        Spacer(1, 4),
        P("Mathematical Formulations, Multi-Criteria Synthesis, and Headless Social Promotion Architecture", st_cover_sub),
        Spacer(1, 8),
        P("<b>Project:</b> Agrivive Surplus Vegetable Marketplace &nbsp;|&nbsp; <b>Location:</b> Davao City, Philippines<br/>"
          "<b>Authors:</b> Bartiquien, Jara, Marundan &nbsp;|&nbsp; <b>Date:</b> November 8, 2026 &nbsp;|&nbsp; <b>Version:</b> 2.5.0", st_cover_meta)
    ]
    
    cover_table = Table([[cover_elements]], colWidths=[PRINT_WIDTH])
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GREEN_DARK),
        ("BOX", (0, 0), (-1, -1), 1.5, GREEN_LIGHT),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
    ]))
    story.append(cover_table)
    story.append(Spacer(1, 8))

    # Executive Summary Card
    exec_summary = [
        P("<b>EXECUTIVE SUMMARY &amp; SPECIFICATION SCOPE</b>", st_h3),
        Spacer(1, 3),
        P("This specification presents the complete algorithmic and architectural blueprints for Agrivive's core visibility and marketing systems: "
          "<b>(1) The AHP-TOPSIS Multi-Criteria Decision Visibility Engine</b>, which ranks surplus vegetable listings dynamically and fairly without pay-to-win mechanics, "
          "paired with the <b>6-Hour Boost Rotation Rule</b> to guarantee equitable exposure; and "
          "<b>(2) The n8n Marketing Boost and Dynamic Price-Drop Engine</b>, a decoupled webhook-driven automation system utilizing Groq AI copywriting and Meta Graph API syndication "
          "to convert aging stall surplus into viral community sales before end of day.", st_desc_text),
        Spacer(1, 4),
        P("<b>Document Pipeline Structure:</b> In accordance with system specifications, each core component is presented following a strict progression: "
          "<i>Visual Pipeline Diagram</i> &rarr; <i>System Description &amp; Grounding</i> &rarr; <i>Step-by-Step Mathematical/Payload Calculations</i>. "
          "Every calculation is isolated into a numbered table containing raw or transformed data, formal mathematical expressions, and exhaustive explanatory context.", st_desc_text)
    ]
    story.append(callout_box(exec_summary, bg=BG_SOFT, border=LINE_COLOR))
    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 1: AHP-TOPSIS VISIBILITY RANKING PIPELINE
    # =========================================================================
    story.append(P("PART 1: AHP-TOPSIS VISIBILITY RANKING PIPELINE", st_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GREEN_DARK, spaceBefore=2, spaceAfter=8))

    # Section 1.1: Visual Pipeline Diagram
    story.append(P("1.1 Pipeline Architecture &amp; Execution Flow", st_h2))
    story.append(P("The AHP-TOPSIS visibility engine operates on four raw produce attributes extracted directly from PostgreSQL. "
                   "The pipeline synthesizes subjective multi-stakeholder priorities via Thomas Saaty's Analytic Hierarchy Process (AHP) "
                   "and executes multi-dimensional geometric distance optimization via Hwang &amp; Yoon's Technique for Order Preference "
                   "by Similarity to Ideal Solution (TOPSIS). The terminal stage applies Agrivive's 6-Hour Lock Rule to determine automated boost eligibility.", st_desc_text))
    story.append(Spacer(1, 4))

    # Embed High-Resolution IPO Diagram Image
    img_ahp_path = "/home/jarajoaquinjara/projects/Agrivive/Agrivive/docs/ahp_topsis_ipo_pipeline.png"
    if os.path.exists(img_ahp_path):
        story.append(Image(img_ahp_path, width=PRINT_WIDTH, height=111.25 * mm))
        story.append(Spacer(1, 2))
        story.append(P("<b>Figure 1:</b> AHP-TOPSIS Input-Process-Output (IPO) Architecture with 6-Hour Lock Rotation Framework.", st_small))
        story.append(Spacer(1, 6))

    # Section 1.2: System Description
    story.append(P("1.2 System Description &amp; Theoretical Grounding", st_h2))
    story.append(P("Agricultural surplus marketplaces face unique inventory dynamics: perishable fresh produce loses nutritional and market value rapidly over hours. "
                   "Traditional e-commerce algorithms favor paid placements or historical cumulative sales, which systematically penalize smallholder farmers and newly listed fresh surplus. "
                   "Agrivive eliminates 'pay-to-win' bias through multi-criteria decision modeling (MCDM):", st_desc_text))
    story.append(Spacer(1, 3))
    
    crit_bullets = [
        "<b>C₁: Posting Age (Freshness Urgency):</b> Elapsed hours since listing cycle publication. Older surplus must be highlighted before spoilage, maximizing waste diversion.",
        "<b>C₂: Price Drop (Discount Magnitude):</b> Price per unit reduced from the seller's original baseline (Base Price − Current Price). Directly incentivizes dynamic discounts.",
        "<b>C₃: Stock Level (Surplus Volume):</b> Remaining unsold inventory in kilograms. Higher volume listings require greater visibility to clear stall tables before dusk.",
        "<b>C₄: Seller Reliability (Service Trust):</b> Average service star rating (1.0 to 5.0) from verified completed orders. Protects buyers from unfulfilled reservations."
    ]
    story.append(ListFlowable([ListItem(P(b, st_desc_text), leftIndent=12, bulletColor=GREEN_LIGHT) for b in crit_bullets], bulletType="bullet", start="•"))
    story.append(Spacer(1, 4))
    story.append(P("<b>Removal of Tiers in Favor of Pure Ordinal Ranking:</b> In early iterations, produce was categorized into static tiers ('Priority Boost', 'Standard Exposure', 'Basic'). "
                   "This caused boundary clipping issues where listings clustered near score thresholds (e.g. 0.59 vs 0.60) experienced jarring visibility drops. "
                   "Agrivive now utilizes pure <b>Ordinal Ranking (Rank 1, Rank 2, Rank 3, ... Rank N)</b>. Boost rotation is governed objectively by the <b>6-Hour Lock Rule</b>: "
                   "once boosted, a vegetable enters a 6-hour cooldown lock, allowing the next-ranked unlocked produce to receive automated promotion.", st_desc_text))
    story.append(Spacer(1, 8))

    # Section 1.3: Step-by-Step Calculations (Tables 1 to 13)
    story.append(P("1.3 Step-by-Step Mathematical Calculations", st_h2))
    story.append(P("The following tables demonstrate the complete end-to-end execution of the AHP-TOPSIS engine using real candidate produce data from Agrivive's test harness "
                   "(squash [Kalabasa], carrots [Karot], and winged beans [Sigarilyas]).", st_desc_text))
    story.append(Spacer(1, 6))

    # TABLE 1: RAW DATA
    tbl1_data = [
        ["Alternative Produce", "Posting Age (x₁)", "Base Price", "Current Price", "Price Drop (x₂)", "Stock Level (x₃)", "Seller Reliability (x₄)"],
        ["A₁: Kalabasa (Squash)", "5.0 hours", "₱50.00 / kg", "₱45.00 / kg", "₱5.00 / kg", "20.0 kg", "4.50 / 5.0 (verified)"],
        ["A₂: Karot (Carrot)", "2.0 hours", "₱60.00 / kg", "₱60.00 / kg", "₱0.00 / kg", "50.0 kg", "4.50 / 5.0 (verified)"],
        ["A₃: Sigarilyas (Winged Bean)", "9.0 hours", "₱80.00 / kg", "₱60.00 / kg", "₱20.00 / kg", "5.0 kg", "4.50 / 5.0 (verified)"]
    ]
    t1 = styled_table(tbl1_data, [40 * mm, 23 * mm, 23 * mm, 23 * mm, 23 * mm, 23 * mm, 23 * mm], custom_alignments=["B", "C", "C", "C", "C", "C", "C"])
    story.append(table_card(
        1, "Candidate Produce Raw Evaluation Matrix (X_raw)",
        t1,
        formula_text="Price Drop:  <i>x</i><sub>2</sub> = max( 0,  Price<sub>base</sub> − Price<sub>current</sub> )<br/>"
                     "Posting Age:  <i>x</i><sub>1</sub> = max( 0,  (<i>t</i><sub>now</sub> − <i>t</i><sub>published</sub>) / 3600 )",
        explanation_text="Captures the initial unscaled state of active candidate vegetables at a Davao City market stall. "
                         "Sigarilyas has been on display the longest (9h) and features the largest price reduction (₱20/kg) but lowest remaining stock (5kg). "
                         "Karot is fresh (2h) with large inventory (50kg) but zero price reduction. Kalabasa displays moderate age and discount. "
                         "All three alternatives currently share an identical high seller reliability rating (4.50 stars)."
    ))

    # TABLE 2: AHP PAIRWISE MATRIX
    tbl2_data = [
        ["Criteria", "C₁: Posting Age", "C₂: Price Drop", "C₃: Stock Level", "C₄: Reliability"],
        ["C₁: Posting Age (Freshness)", "1.0000", "1.0000", "2.0000", "3.0000"],
        ["C₂: Price Drop (Discount)", "1.0000", "1.0000", "2.0000", "3.0000"],
        ["C₃: Stock Level (Volume)", "0.5000 (1/2)", "0.5000 (1/2)", "1.0000", "2.0000"],
        ["C₄: Seller Reliability", "0.3333 (1/3)", "0.3333 (1/3)", "0.5000 (1/2)", "1.0000"]
    ]
    t2 = styled_table(tbl2_data, [50 * mm, 32 * mm, 32 * mm, 32 * mm, 32 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        2, "AHP Pairwise Comparison Matrix (A)",
        t2,
        formula_text="<b>A</b> = [ <i>a<sub>ij</sub></i> ]<sub>4×4</sub>  such that  <i>a<sub>ij</sub></i> ∈ {1, 2, ..., 9},  <i>a<sub>ji</sub></i> = 1 / <i>a<sub>ij</sub></i>,  <i>a<sub>ii</sub></i> = 1.0",
        explanation_text="Establishes relative decision weights based on domain requirements for surplus recovery. "
                         "Posting age (C₁) and price discount (C₂) are judged equally critical (1.0). Each is twice as important as stock volume (2.0) "
                         "and three times as important as seller reliability (3.0) because surplus perishability and price sensitivity drive rapid pickup."
    ))

    # TABLE 3: AHP COLUMN SUMS
    tbl3_data = [
        ["Row Vector Component", "C₁: Posting Age", "C₂: Price Drop", "C₃: Stock Level", "C₄: Reliability"],
        ["Sum of Column Values: S_j", "2.8333 (17/6)", "2.8333 (17/6)", "5.5000 (11/2)", "9.0000 (9/1)"]
    ]
    t3 = styled_table(tbl3_data, [50 * mm, 32 * mm, 32 * mm, 32 * mm, 32 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        3, "AHP Column Summation Vector (S_col)",
        t3,
        formula_text="<i>S<sub>j</sub></i> = ∑<sub><i>k</i>=1</sub><sup><i>n</i></sup> <i>a<sub>kj</sub></i>   for each criterion column <i>j</i> ∈ {1, 2, 3, 4}",
        explanation_text="Computes the aggregate magnitude of each column in matrix A. These sums serve as normalization denominators "
                         "in the next step to transform pairwise ratios into proportional fractions totaling 1.0 per column."
    ))

    # TABLE 4: NORMALIZED AHP MATRIX
    tbl4_data = [
        ["Criteria", "C₁: Age", "C₂: Drop", "C₃: Stock", "C₄: Reliability"],
        ["C₁: Posting Age", "0.3529", "0.3529", "0.3636", "0.3333"],
        ["C₂: Price Drop", "0.3529", "0.3529", "0.3636", "0.3333"],
        ["C₃: Stock Level", "0.1765", "0.1765", "0.1818", "0.2222"],
        ["C₄: Seller Reliability", "0.1176", "0.1176", "0.0909", "0.1111"]
    ]
    t4 = styled_table(tbl4_data, [50 * mm, 32 * mm, 32 * mm, 32 * mm, 32 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        4, "Normalized AHP Comparison Matrix (A_norm)",
        t4,
        formula_text="<i>ā<sub>ij</sub></i> = <i>a<sub>ij</sub></i> / <i>S<sub>j</sub></i> = <i>a<sub>ij</sub></i> / ( ∑<sub><i>k</i>=1</sub><sup><i>n</i></sup> <i>a<sub>kj</sub></i> )",
        explanation_text="Divides each matrix entry by its corresponding column sum. Each column now sums exactly to 1.0000, "
                         "enabling unbiased averaging across rows to extract criteria weights."
    ))

    # TABLE 5: CRITERIA WEIGHTS
    tbl5_data = [
        ["Criterion Identifier", "Criterion Description", "Priority Weight (w_i)", "Weight Percentage (%)"],
        ["w₁ (Posting Age)", "Urgency of fresh harvest clearance", "0.3507", "35.07%"],
        ["w₂ (Price Drop)", "Consumer economic discount incentive", "0.3507", "35.07%"],
        ["w₃ (Stock Level)", "Surplus inventory clearance priority", "0.1892", "18.92%"],
        ["w₄ (Seller Reliability)", "Historical pickup and fulfillment trust", "0.1093", "10.93%"],
        ["Sum / Validation", "Total criteria weight budget", "1.0000", "100.00%"]
    ]
    t5 = styled_table(tbl5_data, [45 * mm, 65 * mm, 34 * mm, 34 * mm], custom_alignments=["B", "L", "C", "C"])
    story.append(table_card(
        5, "AHP Criteria Priority Weight Vector (w)",
        t5,
        formula_text="<i>w<sub>i</sub></i> = ( 1 / <i>n</i> ) ∑<sub><i>j</i>=1</sub><sup><i>n</i></sup> <i>ā<sub>ij</sub></i>,   where <i>n</i> = 4 criteria and ∑<sub><i>i</i>=1</sub><sup><i>n</i></sup> <i>w<sub>i</sub></i> = 1.0000",
        explanation_text="Calculated as the arithmetic mean of each row in A_norm. The resulting distribution establishes that "
                         "posting age (35.07%) and price discounts (35.07%) govern over 70% of marketplace placement, "
                         "with inventory volume (18.92%) and seller service trust (10.93%) forming the remainder."
    ))

    # TABLE 6: AHP CONSISTENCY
    tbl6_data = [
        ["Metric Name", "Mathematical Expression", "Calculated Value", "Threshold & Decision"],
        ["Weighted Sum Vector (WSV)", "WSV = A · w", "[1.4079, 1.4079, 0.7587, 0.4377]", "Intermediate Vector"],
        ["Consistency Vector (CV)", "CV_i = WSV_i / w_i", "[4.0143, 4.0143, 4.0091, 4.0036]", "Approaches n = 4"],
        ["Max Eigenvalue (λ_max)", "λ_max = (1/n) ∑ CV_i", "4.0104", "λ_max ≥ n (4.0)"],
        ["Consistency Index (CI)", "CI = (λ_max − n) / (n − 1)", "0.00346", "Low dispersion"],
        ["Random Index (RI)", "Empirical RI for n = 4", "0.9000", "Saaty reference table"],
        ["Consistency Ratio (CR)", "CR = CI / RI", "0.00384 (0.38%)", "PASSED (CR ≤ 0.10)"]
    ]
    t6 = styled_table(tbl6_data, [45 * mm, 55 * mm, 44 * mm, 34 * mm], custom_alignments=["B", "L", "C", "C"])
    story.append(table_card(
        6, "AHP Mathematical Consistency Verification",
        t6,
        formula_text="<i>CI</i> = ( <i>λ</i><sub>max</sub> − <i>n</i> ) / ( <i>n</i> − 1 ) = 0.00346<br/>"
                     "<i>CR</i> = <i>CI</i> / <i>RI</i><sub>4</sub> = 0.00346 / 0.90 = <b>0.00384 ≤ 0.10</b>  (Statistically Consistent)",
        explanation_text="AHP requires verifying that human judgment transitivities do not contain severe contradictions. "
                         "The calculated Consistency Ratio of 0.00384 (0.38%) is vastly below the maximum allowable threshold of 0.10 (10.0%), "
                         "proving that the extracted weights are logically consistent and formally approved for TOPSIS ranking."
    ))

    # TABLE 7: TOPSIS DENOMINATORS
    tbl7_data = [
        ["Vector Parameter", "C₁: Age (hours)", "C₂: Drop (PHP)", "C₃: Stock (kg)", "C₄: Reliability (Score)"],
        ["Sum of Squared Values: ∑ x_ij²", "5²+2²+9² = 110.00", "5²+0²+20² = 425.00", "20²+50²+5² = 2925.00", "4.5²×3 = 60.75"],
        ["Euclidean Norm: √(∑ x_ij²)", "10.4881", "20.6155", "54.0833", "7.7942"]
    ]
    t7 = styled_table(tbl7_data, [46 * mm, 33 * mm, 33 * mm, 33 * mm, 33 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        7, "TOPSIS Euclidean Vector Normalization Denominators",
        t7,
        formula_text="||<b>x</b><sub>*<i>j</i></sub>|| = √( ∑<sub><i>i</i>=1</sub><sup><i>m</i></sup> <i>x<sub>ij</sub></i><sup>2</sup> )   for each criterion column <i>j</i> across <i>m</i> = 3 alternatives",
        explanation_text="Calculates the quadratic root sum of squares for each column in the decision matrix X. "
                         "These divisors normalize disparate physical units (hours, pesos, kilograms, star ratings) into standardized scale lengths."
    ))

    # TABLE 8: NORMALIZED TOPSIS MATRIX
    tbl8_data = [
        ["Alternative", "C₁: Age (r_i1)", "C₂: Drop (r_i2)", "C₃: Stock (r_i3)", "C₄: Reliability (r_i4)"],
        ["A₁: Kalabasa", "5 / 10.4881 = 0.4767", "5 / 20.6155 = 0.2425", "20 / 54.0833 = 0.3698", "4.5 / 7.7942 = 0.5774"],
        ["A₂: Karot", "2 / 10.4881 = 0.1907", "0 / 20.6155 = 0.0000", "50 / 54.0833 = 0.9245", "4.5 / 7.7942 = 0.5774"],
        ["A₃: Sigarilyas", "9 / 10.4881 = 0.8581", "20 / 20.6155 = 0.9701", "5 / 54.0833 = 0.0925", "4.5 / 7.7942 = 0.5774"]
    ]
    t8 = styled_table(tbl8_data, [42 * mm, 34 * mm, 34 * mm, 34 * mm, 34 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        8, "TOPSIS Normalized Decision Matrix (R)",
        t8,
        formula_text="<i>r<sub>ij</sub></i> = <i>x<sub>ij</sub></i> / √( ∑<sub><i>k</i>=1</sub><sup><i>m</i></sup> <i>x<sub>kj</sub></i><sup>2</sup> )",
        explanation_text="Matrix R converts all raw measurements into dimensionless values bounded between 0 and 1. "
                         "Sigarilyas dominates the normalized posting age (0.8581) and price drop (0.9701) columns, "
                         "while Karot dominates inventory volume (0.9245)."
    ))

    # TABLE 9: WEIGHTED NORMALIZED TOPSIS MATRIX
    tbl9_data = [
        ["Alternative", "C₁: Age (v_i1)", "C₂: Drop (v_i2)", "C₃: Stock (v_i3)", "C₄: Reliability (v_i4)"],
        ["Applied Weight w_j", "w₁ = 0.3507", "w₂ = 0.3507", "w₃ = 0.1892", "w₄ = 0.1093"],
        ["A₁: Kalabasa", "0.1672", "0.0851", "0.0700", "0.0631"],
        ["A₂: Karot", "0.0669", "0.0000", "0.1750", "0.0631"],
        ["A₃: Sigarilyas", "0.3010", "0.3402", "0.0175", "0.0631"]
    ]
    t9 = styled_table(tbl9_data, [42 * mm, 34 * mm, 34 * mm, 34 * mm, 34 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        9, "TOPSIS Weighted Normalized Decision Matrix (V)",
        t9,
        formula_text="<i>v<sub>ij</sub></i> = <i>w<sub>j</sub></i> · <i>r<sub>ij</sub></i>   where <i>w<sub>j</sub></i> is the derived AHP weight vector",
        explanation_text="Applies the AHP criteria priorities to the normalized matrix. This weights the geometric hyperspace, "
                         "ensuring that high scores in Age and Price Drop carry 3.2 times the coordinate distance impact of Seller Reliability."
    ))

    # TABLE 10: IDEAL SOLUTIONS
    tbl10_data = [
        ["Reference Boundary Vector", "C₁: Age (v_1)", "C₂: Drop (v_2)", "C₃: Stock (v_3)", "C₄: Reliability (v_4)"],
        ["Positive Ideal Solution (A⁺)", "max = 0.3010", "max = 0.3402", "max = 0.1750", "max = 0.0631"],
        ["Negative Ideal Solution (A⁻)", "min = 0.0669", "min = 0.0000", "min = 0.0175", "min = 0.0631"]
    ]
    t10 = styled_table(tbl10_data, [50 * mm, 32 * mm, 32 * mm, 32 * mm, 32 * mm], custom_alignments=["B", "C", "C", "C", "C"])
    story.append(table_card(
        10, "Positive Ideal (A⁺) and Negative Ideal (A⁻) Solutions",
        t10,
        formula_text="<b>A⁺</b> = [ max<sub><i>i</i></sub>(<i>v<sub>ij</sub></i>) ] = [ 0.3010, 0.3402, 0.1750, 0.0631 ]<br/>"
                     "<b>A⁻</b> = [ min<sub><i>i</i></sub>(<i>v<sub>ij</sub></i>) ] = [ 0.0669, 0.0000, 0.0175, 0.0631 ]",
        explanation_text="Identifies the theoretical best and worst composite listings across the active marketplace cohort. "
                         "Because all four criteria are treated as benefit attributes ('higher is better for clearance and trust'), "
                         "A⁺ selects column maximums and A⁻ selects column minimums."
    ))

    # TABLE 11: EUCLIDEAN SEPARATION DISTANCES
    tbl11_data = [
        ["Alternative Produce", "Distance to Best (S_i⁺)", "Distance to Worst (S_i⁻)", "Sum of Distances (S⁺ + S⁻)"],
        ["A₁: Kalabasa", "0.3066", "0.1416", "0.4483"],
        ["A₂: Karot", "0.4130", "0.1575", "0.5704"],
        ["A₃: Sigarilyas", "0.1575", "0.4130", "0.5704"]
    ]
    t11 = styled_table(tbl11_data, [48 * mm, 43 * mm, 43 * mm, 44 * mm], custom_alignments=["B", "C", "C", "C"])
    story.append(table_card(
        11, "TOPSIS Euclidean Distance Separation Vectors",
        t11,
        formula_text="<i>S<sub>i</sub><sup>+</sup></i> = √( ∑<sub><i>j</i>=1</sub><sup><i>n</i></sup> (<i>v<sub>ij</sub></i> − <i>v<sub>j</sub></i><sup>+</sup>)<sup>2</sup> )<br/>"
                     "<i>S<sub>i</sub><sup>−</sup></i> = √( ∑<sub><i>j</i>=1</sub><sup><i>n</i></sup> (<i>v<sub>ij</sub></i> − <i>v<sub>j</sub></i><sup>−</sup>)<sup>2</sup> )",
        explanation_text="Calculates multi-dimensional Euclidean geometric distances. Sigarilyas is extremely close to the ideal best (S⁺ = 0.1575) "
                         "and far from the worst (S⁻ = 0.4130). In contrast, Karot is farthest from the ideal best (S⁺ = 0.4130)."
    ))

    # TABLE 12: RELATIVE CLOSENESS & RANKING
    tbl12_data = [
        ["Alternative Produce", "Closeness Ratio Expression", "Relative Closeness (C_i)", "Ordinal Rank", "Placement Effect"],
        ["A₃: Sigarilyas", "0.4130 / (0.1575 + 0.4130)", "0.7240", "Rank 1", "Top of Marketplace Feed"],
        ["A₁: Kalabasa", "0.1416 / (0.3066 + 0.1416)", "0.3159", "Rank 2", "Middle of Marketplace Feed"],
        ["A₂: Karot", "0.1575 / (0.4130 + 0.1575)", "0.2760", "Rank 3", "Lower Section of Feed"]
    ]
    t12 = styled_table(tbl12_data, [40 * mm, 45 * mm, 33 * mm, 25 * mm, 35 * mm], custom_alignments=["B", "C", "C", "BC", "L"])
    story.append(table_card(
        12, "Final Relative Closeness Coefficient & Ordinal Ranking",
        t12,
        formula_text="<i>C<sub>i</sub></i> = <i>S<sub>i</sub><sup>−</sup></i> / ( <i>S<sub>i</sub><sup>+</sup></i> + <i>S<sub>i</sub><sup>−</sup></i> )   where 0 ≤ <i>C<sub>i</sub></i> ≤ 1<br/>"
                     "Ordinal Rank = argsort( <i>C<sub>i</sub></i>,  descending = True )",
        explanation_text="Computes the final TOPSIS score C_i. Higher values indicate greater proximity to A⁺ and separation from A⁻. "
                         "Sigarilyas achieves Rank 1 (0.7240), Kalabasa achieves Rank 2 (0.3159), and Karot achieves Rank 3 (0.2760). "
                         "The engine outputs clean ordinal ranks for consumer display ('Buyers see higher ranks first')."
    ))

    # TABLE 13: 6-HOUR LOCK RULE & BOOST DECISION
    tbl13_data = [
        ["Produce", "Rank", "Last Boosted Timestamp", "Elapsed Time", "Cooldown Status", "Boost Decision & Action"],
        ["A₃: Sigarilyas", "Rank 1", "2.0 hours ago", "2.0 h < 6.0 h", "LOCKED (until +4.0h)", "SKIPPED (Active lock cooldown)"],
        ["A₁: Kalabasa", "Rank 2", "8.5 hours ago", "8.5 h ≥ 6.0 h", "UNLOCKED (Eligible)", "SELECTED FOR BOOST (n8n Webhook Sent)"],
        ["A₂: Karot", "Rank 3", "Never boosted", "N/A", "UNLOCKED (Eligible)", "STANDBY (Lower rank than Kalabasa)"]
    ]
    t13 = styled_table(tbl13_data, [35 * mm, 20 * mm, 32 * mm, 27 * mm, 32 * mm, 32 * mm], custom_alignments=["B", "C", "C", "C", "C", "L"])
    story.append(table_card(
        13, "Agrivive 6-Hour Lock Rule & Automated Boost Selection",
        t13,
        formula_text="<i>t</i><sub>locked_until</sub> = <i>t</i><sub>last_boost</sub> + 6 hours<br/>"
                     "is_locked = ( <i>t</i><sub>now</sub> &lt; <i>t</i><sub>locked_until</sub> )<br/>"
                     "Boost Target = argmin<sub>rank</sub>( Candidate  |  is_locked = False )",
        explanation_text="Demonstrates Agrivive's anti-monopoly boost rotation. Even though Sigarilyas ranks #1, it was boosted 2 hours ago "
                         "and remains locked. The background worker traverses down the ordinal ranks to Rank 2 (Kalabasa), which has exceeded "
                         "the 6-hour lock threshold. Kalabasa is selected, and its webhook payload is dispatched to n8n."
    ))

    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 2: N8N MARKETING BOOST & SOCIAL AUTOMATION ENGINE
    # =========================================================================
    story.append(P("PART 2: N8N MARKETING BOOST &amp; SOCIAL AUTOMATION ENGINE", st_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GREEN_DARK, spaceBefore=2, spaceAfter=8))

    # Section 2.1: Visual Pipeline Diagram
    story.append(P("2.1 Pipeline Architecture &amp; Execution Flow", st_h2))
    story.append(P("The Agrivive Boost pipeline automates social media syndication and scheduled price drops through a headless n8n workflow. "
                   "It features two asynchronous execution pathways triggered by a single secure webhook endpoint: "
                   "<b>Branch A (Initial Boost)</b> creates authentic promotional captions and posts them to Meta (Facebook &amp; Instagram); "
                   "<b>Branch B (6-Hour Follow-Up)</b> decrements the produce price by the seller's peso amount, enforces the hard floor price, "
                   "and publishes a flash-sale price drop announcement.", st_desc_text))
    story.append(Spacer(1, 4))

    # Embed High-Resolution n8n Seller Flow Diagram Image
    img_n8n_path = "/home/jarajoaquinjara/projects/Agrivive/Agrivive/docs/n8n_seller_flow_pipeline.png"
    if os.path.exists(img_n8n_path):
        story.append(Image(img_n8n_path, width=PRINT_WIDTH, height=114.9 * mm))
        story.append(Spacer(1, 2))
        story.append(P("<b>Figure 2:</b> n8n Seller Boost &amp; Scheduled Price-Drop Execution Flow (Part 1 Initial Post &amp; Part 2 After 6 Hours).", st_small))
        story.append(Spacer(1, 6))

    # Section 2.2: System Description & Decoupled Architecture
    story.append(P("2.2 System Description &amp; Security Architecture", st_h2))
    story.append(P("<b>Decoupled Security Pattern:</b> A critical design mandate of Agrivive is that n8n receives <i>IDs only, never secrets</i>. "
                   "Database credentials, Meta App secrets, AWS S3 keys, and Groq API tokens remain strictly secured inside the backend environment. "
                   "When the backend worker triggers n8n, it transmits only the unique `boostId`. n8n then calls back into protected API integration routes "
                   "using a cryptographically secure service token (`X-Service-Key`).", st_desc_text))
    story.append(Spacer(1, 4))
    story.append(P("<b>Anti-AI Slop Copywriting Principles:</b> Social copy generated by Groq (utilizing `openai/gpt-oss-20b` or Llama 3) "
                   "is strictly governed by prompt hygiene to avoid generic AI marketing clichés (e.g. 'revolutionary', 'game-changing', emojis everywhere, "
                   "or em dashes). The LLM is prohibited from inventing links or altering prices; the backend automatically injects the canonical order link "
                   "and validates that prices match database truth before publishing.", st_desc_text))
    story.append(Spacer(1, 8))

    # Section 2.3: Step-by-Step Node Execution (Tables 14 to 28)
    story.append(P("2.3 Step-by-Step Node Execution &amp; Payload Transformations", st_h2))
    story.append(P("The following tables detail the contract, inputs, logic, and output state for all 12 nodes comprising the "
                   "`agrivive-visibility-boost.json` production workflow.", st_desc_text))
    story.append(Spacer(1, 6))

    # TABLE 14: NODE REGISTRY
    tbl14_data = [
        ["Node ID & Index", "Node Name in Workflow", "Node Type", "Execution Role", "Branch Target"],
        ["Node 1 (0001)", "1. Boost Confirmed", "n8n Webhook", "Secure webhook ingestion", "Root Entry"],
        ["Node 2 (0002)", "2. Follow-Up Call?", "n8n IF Node", "Branch routing on reason", "Branch A / B"],
        ["Node 3 (0003)", "3. Get Boost Context", "HTTP Request", "Fetch produce/shop facts", "Branch A"],
        ["Node 3b (0004)", "3b. Already Posted?", "n8n IF Node", "Idempotency duplicate guard", "Branch A"],
        ["Node 4 (0005)", "4. Write Caption (Groq)", "HTTP Request", "LLM promotional copy", "Branch A"],
        ["Node 5 (0006)", "5. Format Caption", "Code (JS)", "JSON sanitation & fallback", "Branch A"],
        ["Node 6 (0007)", "6. Post to Facebook", "HTTP Request", "Backend publishing & logging", "Branch A Finish"],
        ["Node 7 (0008)", "7. Get Latest Context", "HTTP Request", "Fetch 6h updated state", "Branch B"],
        ["Node 8 (0009)", "8. Reduce Price", "HTTP Request", "API price decrement call", "Branch B"],
        ["Node 9 (0010)", "9. Price Reduced?", "n8n IF Node", "Validate price drop success", "Branch B"],
        ["Node 10 (0011)", "10. Flash-Sale Copy", "HTTP Request", "Groq flash-sale generation", "Branch B"],
        ["Node 11 (0012)", "11. Format Flash Caption", "Code (JS)", "JSON extraction & fallback", "Branch B"],
        ["Node 12 (0013)", "12. Post Flash-Sale", "HTTP Request", "Publish 2nd post & notify", "Branch B Finish"]
    ]
    t14 = styled_table(tbl14_data, [30 * mm, 42 * mm, 32 * mm, 48 * mm, 26 * mm], custom_alignments=["B", "L", "C", "L", "C"])
    story.append(table_card(
        14, "n8n Boost Workflow Node Manifest & Execution Registry",
        t14,
        explanation_text="Defines the complete structural hierarchy of the 12 workflow nodes exported in `agrivive-visibility-boost.json`. "
                         "Nodes 1-6 govern the first publication, while Nodes 7-12 execute the automatic 6-hour price drop and flash-sale syndication."
    ))

    # TABLE 15: NODE 1 WEBHOOK PAYLOAD
    tbl15_data = [
        ["Payload Key", "Data Type", "Sample Value", "Semantic Definition & Function"],
        ["boostId", "UUID v4 String", "\"bst-7c91-4e08-9422\"", "Unique database tracking key for this boost campaign cycle."],
        ["productId", "UUID v4 String", "\"prd-37a1-9f1d-4f24\"", "Foreign key referencing sellers_product in PostgreSQL."],
        ["reason", "Enum String", "\"initial\"  (or \"follow_up\")", "Execution trigger mode: 'initial' for first post, 'follow_up' for 6h cut."],
        ["timestamp", "ISO 8601 String", "\"2026-11-08T06:00:00Z\"", "Timestamp when worker selected candidate from AHP-TOPSIS ranking."]
    ]
    t15 = styled_table(tbl15_data, [32 * mm, 30 * mm, 48 * mm, 68 * mm], custom_alignments=["B", "C", "C", "L"])
    story.append(table_card(
        15, "Node 1: Webhook Ingestion Data Contract (1. Boost Confirmed)",
        t15,
        formula_text="<b>Endpoint Contract:</b> POST https://n8n.agrivive.tech/webhook/agrivive-visibility-boost<br/>"
                     "<b>Security Header:</b> { 'X-Service-Key': 'sec_live_994182...' }",
        explanation_text="Dispatched by the backend scheduled worker (queue-ranked-boost.ts) upon picking the top unlocked produce. "
                         "Contains zero sensitive credentials; passes only entity IDs and the operational reason."
    ))

    # TABLE 16: NODE 2 CONDITIONAL ROUTING
    tbl16_data = [
        ["Input Reason Parameter", "Conditional Expression", "Evaluated Branch", "Execution Outcome"],
        ["reason == \"initial\"", "$json.body.reason === 'follow_up'", "FALSE (Branch A)", "Routes to Node 3 (Get Context & First Post Flow)"],
        ["reason == \"follow_up\"", "$json.body.reason === 'follow_up'", "TRUE (Branch B)", "Routes to Node 7 (Price Drop & Flash-Sale Flow)"],
        ["reason == [malformed]", "Unrecognized string / empty", "FALSE (Branch A)", "Fails gracefully at context verification"]
    ]
    t16 = styled_table(tbl16_data, [38 * mm, 48 * mm, 38 * mm, 54 * mm], custom_alignments=["B", "C", "C", "L"])
    story.append(table_card(
        16, "Node 2: Conditional Branch Routing Logic (2. Follow-Up Call?)",
        t16,
        formula_text="Branch Decision = ( <i>r</i> = $json.body.reason == 'follow_up' ) ? <b>Branch B</b> : <b>Branch A</b>",
        explanation_text="Inspects the incoming reason token. This single switch decouples the first social announcement from the subsequent "
                         "price-reduction cycle while keeping the entire lifecycle in one visual n8n workflow canvas."
    ))

    # TABLE 17: NODE 3 CONTEXT INGESTION
    tbl17_data = [
        ["Context Property", "Extracted Value", "Source Origin", "Role in Workflow"],
        ["product.name", "\"Kalabasa (Native Squash)\"", "sellers_product.product_name", "Produce subject for social caption."],
        ["product.unit", "\"kg\"", "sellers_product.unit", "Measurement unit for pricing clarity."],
        ["product.price", "\"45.00\"", "sellers_product.product_price", "Current price in Philippine Pesos."],
        ["seller.shopName", "\"Tatay Ruben's Organic Farm\"", "seller_profile.stall_name", "Local stall identity for community trust."],
        ["seller.address", "\"Stall 14, Agdao Public Market\"", "seller_profile.address", "Pickup location for buyer navigation."]
    ]
    t17 = styled_table(tbl17_data, [38 * mm, 44 * mm, 46 * mm, 50 * mm], custom_alignments=["B", "C", "L", "L"])
    story.append(table_card(
        17, "Node 3: Boost Context Data Ingestion (3. Get Boost Context)",
        t17,
        formula_text="<b>API Request:</b> GET /integrations/visibility-boosts/{{$json.body.boostId}}/context<br/>"
                     "<b>Authorization:</b> Bearer &lt;SERVICE_TOKEN&gt;",
        explanation_text="Node 3 calls back into Agrivive's API to fetch verified facts. If the listing has been deleted, archived, "
                         "or sold out, the API returns 404/400 and the workflow halts immediately without posting false inventory."
    ))

    # TABLE 18: NODE 3B IDEMPOTENCY
    tbl18_data = [
        ["Evaluation State", "Condition Parameter", "Workflow Action", "Safety Impact"],
        ["First Run (Fresh Boost)", "$json.alreadyPosted === false", "PROCEED to Node 4", "Normal publication flow."],
        ["Duplicate Trigger (Retry)", "$json.alreadyPosted === true", "HALT Execution", "Prevents duplicate spam posts on Facebook."]
    ]
    t18 = styled_table(tbl18_data, [40 * mm, 45 * mm, 45 * mm, 48 * mm], custom_alignments=["B", "C", "C", "L"])
    story.append(table_card(
        18, "Node 3b: Idempotency Duplication Guard (3b. Already Posted?)",
        t18,
        formula_text="Execution Gate:  if ( alreadyPosted == True )  then <b>HALT</b>  else <b>CONTINUE</b>",
        explanation_text="Guarantees distributed safety. If a network blip causes the worker to retry dispatching the initial boost, "
                         "Node 3b verifies if a Facebook post record is already attached to this cycle, preventing repeated posts."
    ))

    # TABLE 19: NODE 4 GROQ PROMPT
    tbl19_data = [
        ["Configuration Parameter", "Specification Value", "Design Rationale"],
        ["LLM Model & Engine", "openai/gpt-oss-20b  (Groq LPU Inference)", "Sub-400ms token generation for rapid response."],
        ["Temperature", "0.40", "Low temperature enforces strict fact grounding without hallucination."],
        ["Response Format", "{ type: 'json_object' }", "Guarantees parsable output with a single 'caption' field."],
        ["System Instruction", "'You are Agrivive social media copywriter. Write a short, friendly post using only given facts. Do not write links. Announce fresh produce with price. No urgent buzzwords.'", "Anti-slop copywriting compliance (no em dashes, no fake urgency)."],
        ["User Payload JSON", "{ product: 'Kalabasa', unit: 'kg', price_php: '45.00', shop: \"Tatay Ruben's Farm\" }", "Minimal ground-truth entity dictionary."]
    ]
    t19 = styled_table(tbl19_data, [42 * mm, 58 * mm, 78 * mm], custom_alignments=["B", "C", "L"])
    story.append(table_card(
        19, "Node 4: Groq AI Copywriting Prompt Formulation",
        t19,
        formula_text="<b>Inference Call:</b> POST https://api.groq.com/openai/v1/chat/completions<br/>"
                     "<b>Payload Schema:</b> { model, temperature: 0.4, response_format: 'json_object', messages: [sys, user] }",
        explanation_text="Groq's high-speed inference drafts a natural announcement. Strict system rules forbid the LLM from adding URLs, "
                         "altering numbers, or using hyperbolic hype words, ensuring authentic communication."
    ))

    # TABLE 20: NODE 5 FORMAT CAPTION
    tbl20_data = [
        ["Processing Stage", "Data Representation & Transformation", "Fallback Behavior"],
        ["Groq Raw Output", "{\"caption\": \"Fresh harvest of Native Kalabasa is ready at Tatay Ruben's Farm for only ₱45.00 per kg. Drop by Stall 14!\"}", "Raw JSON string from model choices."],
        ["Sanitized Post Caption", "\"Fresh harvest of Native Kalabasa is ready at Tatay Ruben's Farm for only ₱45.00 per kg. Drop by Stall 14!\"", "If JSON parse fails, formats deterministic template."],
        ["Post Metadata", "{ boostId: 'bst-7c91', reason: 'initial', postType: 'first_post' }", "Attached to payload for backend logging."]
    ]
    t20 = styled_table(tbl20_data, [35 * mm, 85 * mm, 58 * mm], custom_alignments=["B", "L", "L"])
    story.append(table_card(
        20, "Node 5: Caption Sanitation & Fallback Logic (5. Format Caption)",
        t20,
        formula_text="try { caption = JSON.parse($input).caption; } catch { caption = `Fresh ${p.name} available at ₱${p.price} from ${s.name}!`; }",
        explanation_text="JavaScript code block providing complete runtime fault tolerance. If Groq experiences an unexpected schema deviation, "
                         "Node 5 catches the error and generates a clean, templated caption without crashing the workflow."
    ))

    # TABLE 21: NODE 6 FACEBOOK POST
    tbl21_data = [
        ["Request Parameter", "Parameter Value", "Database & API Effect"],
        ["HTTP Endpoint", "POST /integrations/visibility-boosts/:id/facebook-post", "Routes to backend Facebook integration service."],
        ["postType", "\"first_post\"", "Marks listing_cycles with first post completion."],
        ["caption", "[Sanitized Text from Node 5]", "Backend prepends stall photo and appends unique pickup pass link."],
        ["Meta Graph API", "POST /v19.0/{page-id}/photos", "Official post published to Agrivive Facebook Page."],
        ["Database Log", "INSERT INTO social_campaign_posts", "Stores post_id, permalink_url, published_at, and status='success'."]
    ]
    t21 = styled_table(tbl21_data, [38 * mm, 52 * mm, 88 * mm], custom_alignments=["B", "C", "L"])
    story.append(table_card(
        21, "Node 6: Social Syndication & Persistence (6. Post to Facebook)",
        t21,
        formula_text="<b>Dispatched Payload:</b> { postType: 'first_post', caption: $json.caption }<br/>"
                     "<b>Persistence Mutation:</b> UPDATE listing_cycles SET status = 'posted', sent_at = now()",
        explanation_text="The backend executes the actual Meta Graph API network request. Upon Facebook confirmation, the backend records "
                         "the post ID and permalink, notifies the seller via push notification, and locks the produce under the 6-Hour Rule."
    ))

    # TABLE 22: NODE 7 LATEST CONTEXT
    tbl22_data = [
        ["Status Parameter", "Retrieved Value (at T + 6 hours)", "Context Explanation"],
        ["elapsed_hours", "6.05 hours", "Confirms that the 6-hour promotional lock interval has elapsed."],
        ["current_price", "₱45.00 / kg", "Active price prior to second round reduction."],
        ["seller_drop_amount", "₱5.00 / kg", "Configured decrement amount chosen by the seller."],
        ["seller_floor_price", "₱35.00 / kg", "Hard price floor: price may never be dropped below this threshold."],
        ["current_stock", "14.5 kg", "Remaining stock verifying product is not sold out."]
    ]
    t22 = styled_table(tbl22_data, [42 * mm, 46 * mm, 90 * mm], custom_alignments=["B", "C", "L"])
    story.append(table_card(
        22, "Node 7: Follow-Up State Ingestion (7. Get Latest Boost Context)",
        t22,
        formula_text="<b>Context Fetch:</b> GET /integrations/visibility-boosts/:boostId/context   [Triggered at <i>t</i> = <i>t</i><sub>boost</sub> + 6 hours]",
        explanation_text="Triggered when the background worker fires the follow-up webhook. Inspects the current state of the listing, "
                         "ensuring that inventory remains available and checking the seller's floor price constraints."
    ))

    # TABLE 23: NODE 8 PRICE REDUCTION
    tbl23_data = [
        ["Pricing Variable", "Value Before Call", "Computation / Step", "Committed New Value"],
        ["Current Product Price", "₱45.00", "Baseline before 6h interval", "₱40.00 (Reduced by ₱5)"],
        ["Configured Drop Amount", "₱5.00", "Seller defined step", "Applied"],
        ["Seller Floor Price", "₱35.00", "Safety constraint: Price ≥ Floor", "Respected (40.00 ≥ 35.00)"],
        ["Base (Original) Price", "₱50.00", "Reference starting price", "₱50.00 (Cumulative 20% drop)"]
    ]
    t23 = styled_table(tbl23_data, [45 * mm, 40 * mm, 48 * mm, 45 * mm], custom_alignments=["B", "C", "L", "C"])
    story.append(table_card(
        23, "Node 8: Dynamic Price Reduction Execution (8. Reduce Price)",
        t23,
        formula_text="Price<sub>new</sub> = max( Price<sub>floor</sub>,  Price<sub>current</sub> − Drop<sub>amount</sub> )<br/>"
                     "reduced = ( Price<sub>new</sub> &lt; Price<sub>current</sub> )",
        explanation_text="Instructs the backend to execute an atomic price reduction transaction. The database updates sellers_product.product_price "
                         "and records an audit log in price_reduction_history. If the price is already at floor, the API reports reduced: false."
    ))

    # TABLE 24: NODE 9 REDUCTION GATE
    tbl24_data = [
        ["API Response Flag", "Condition Verification", "Workflow Action", "Operational Meaning"],
        ["{ reduced: true }", "$json.reduced === true", "PROCEED to Node 10", "Price was lowered; flash-sale post authorized."],
        ["{ reduced: false }", "$json.reduced === true (False)", "TERMINATE Workflow", "Price hit floor or product sold out; no second post."]
    ]
    t24 = styled_table(tbl24_data, [38 * mm, 46 * mm, 46 * mm, 48 * mm], custom_alignments=["B", "C", "C", "L"])
    story.append(table_card(
        24, "Node 9: Price Reduction Verification Gate (9. Price Reduced?)",
        t24,
        formula_text="Execution Gate:  if ( $json.reduced == True )  then <b>PROCEED</b>  else <b>HALT</b>",
        explanation_text="Crucial business safeguard. If a vegetable has reached its floor price (e.g. ₱35.00) or sold out during the 6 hours, "
                         "Node 9 terminates the execution immediately, preventing false 'Price Cut!' claims."
    ))

    # TABLE 25: NODE 10 FLASH-SALE GROQ
    tbl25_data = [
        ["Prompt Element", "Parameter Value", "Purpose in Flash-Sale Campaign"],
        ["Model & Engine", "openai/gpt-oss-20b (Groq Cloud)", "Ultra-fast flash-sale copy generation."],
        ["Discount Calculation", "( (50.00 − 40.00) / 50.00 ) × 100 = 20% OFF", "Explicitly highlights the cumulative discount percentage."],
        ["System Prompt", "'You are Agrivive copywriter. Write an urgent flash-sale post announcing a price drop. Mention the discount percent, old price (₱45), and exact new price (₱40). Do not write links.'", "Urgent, community-oriented flash-sale copy adhering to anti-slop guidelines."],
        ["Generated Output", "{\"caption\": \"Flash Sale! Native Kalabasa is now down to ₱40/kg (was ₱45) at Tatay Ruben's Farm! 20% total savings on fresh harvest before sundown.\"}", "Parsable JSON with accurate numbers."]
    ]
    t25 = styled_table(tbl25_data, [40 * mm, 60 * mm, 78 * mm], custom_alignments=["B", "C", "L"])
    story.append(table_card(
        25, "Node 10: Groq Flash-Sale Copywriting Formulation",
        t25,
        formula_text="Discount % = round( [ ( Price<sub>base</sub> − Price<sub>new</sub> ) / Price<sub>base</sub> ] × 100% )<br/>"
                     "Prompt Context: { product, old_price, new_price, discount_percent, shop }",
        explanation_text="Generates high-conversion social copy centered on the price cut. Groq explicitly incorporates the discount percentage "
                         "and exact peso savings without exaggerations."
    ))

    # TABLE 26: NODE 11 FORMAT FLASH CAPTION
    tbl26_data = [
        ["Extraction Stage", "Formatted Content", "Quality Assurance Guard"],
        ["Cleaned Caption", "\"Price drop! Native Kalabasa is now ₱40.00 (was ₱45.00) at Tatay Ruben's Farm. Get yours before it sells out!\"", "Extracted from JSON with whitespace trimming."],
        ["Fallback Template", "\"Price drop! Native Kalabasa is now ₱40.00 (was ₱45.00) at Tatay Ruben's Farm.\"", "Guaranteed fallback string if LLM output fails parsing."]
    ]
    t26 = styled_table(tbl26_data, [35 * mm, 85 * mm, 58 * mm], custom_alignments=["B", "L", "L"])
    story.append(table_card(
        26, "Node 11: Flash-Sale Caption Sanitation & Fallback (11. Format Caption)",
        t26,
        formula_text="let caption = `Price drop! ${p.name} is now ₱${r.newPrice} (was ₱${r.originalPrice}) at ${s.name}.`;",
        explanation_text="Formats the flash-sale text. Ensures that numerical currency symbols and decimal places are strictly aligned "
                         "with Philippine Peso standards prior to transmission."
    ))

    # TABLE 27: NODE 12 POST FLASH-SALE
    tbl27_data = [
        ["Publication Parameter", "Parameter Value", "Operational Outcome"],
        ["Endpoint Target", "POST /integrations/visibility-boosts/:id/facebook-post", "Invokes second post backend route."],
        ["postType", "\"second_post\"", "Records flash-sale post completion."],
        ["Social Syndication", "Published to Facebook Page & Instagram Feed", "Re-engages buyers with discounted pricing."],
        ["Seller Notification", "\"Price Lowered: Your Kalabasa was dropped to ₱40.00 and posted!\"", "Push notification sent to seller mobile app with post preview."],
        ["Lock Release", "Unlocks produce cycle for subsequent ranking rounds", "Eligible for re-boost in next scheduled cycle."]
    ]
    t27 = styled_table(tbl27_data, [42 * mm, 52 * mm, 84 * mm], custom_alignments=["B", "C", "L"])
    story.append(table_card(
        27, "Node 12: Second Post Syndication & Seller Notification (12. Post Flash-Sale)",
        t27,
        formula_text="<b>Dispatched Payload:</b> { postType: 'second_post', caption: $json.caption }<br/>"
                     "<b>Lock State:</b> Release 6-hour lock cooldown  ->  Re-enter AHP-TOPSIS Candidate Pool",
        explanation_text="Finalizes the Boost cycle. The backend posts the flash-sale update, sends a push notification to the seller with a preview "
                         "of the published caption, and unlocks the listing so it can rotate back into the AHP-TOPSIS candidate pool."
    ))

    # TABLE 28: END-TO-END SAFETY MATRIX
    tbl28_data = [
        ["Failure Scenario", "Detection Mechanism", "System Mitigation & Recovery Behavior", "Data Integrity Guard"],
        ["Meta Graph API Token Expired", "Node 6/12 returns HTTP 400 OAuthException", "Backend marks post status as 'failed'; surfaces 'Retry Post' button on seller mobile app.", "No crash; idempotency preserved."],
        ["Groq API Rate Limit (429)", "Node 4/10 HTTP timeout / 429 response", "Code nodes (Node 5/11) trigger deterministic fallback templates instantly.", "Social post goes out on schedule."],
        ["Produce Sold Out at Hour 5", "Node 8 detects productQty <= 0", "API blocks price reduction; Node 9 terminates workflow safely.", "No false posts for sold-out produce."],
        ["Seller Floor Price Reached", "Node 8 detects currentPrice <= floorPrice", "API sets reduced: false; Node 9 halts second post.", "Seller never sells below floor."],
        ["Worker Crash / Server Reboot", "PostgreSQL transaction rollback", "Worker reconciles state on 60s cron restart; skips elapsed locks.", "Zero duplicate posts."]
    ]
    t28 = styled_table(tbl28_data, [40 * mm, 42 * mm, 52 * mm, 44 * mm], custom_alignments=["B", "L", "L", "L"])
    story.append(table_card(
        28, "End-to-End Fault Tolerance, Safety, and Recovery Matrix",
        t28,
        explanation_text="Summarizes Agrivive's resilient error-handling architecture. From third-party API rate limits to zero-inventory "
                         "concurrency races, every node in the n8n pipeline and backend integration layer is hardened against data corruption."
    ))

    story.append(Spacer(1, 10))

    # =========================================================================
    # PART 3: ALGORITHMIC SYNTHESIS & VERIFICATION SUMMARY
    # =========================================================================
    story.append(P("PART 3: ALGORITHMIC SYNTHESIS &amp; VERIFICATION SUMMARY", st_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GREEN_DARK, spaceBefore=2, spaceAfter=8))
    
    synth_summary = [
        P("<b>COMPREHENSIVE SPECIFICATION CONFORMANCE SUMMARY</b>", st_h3),
        Spacer(1, 3),
        P("The combined AHP-TOPSIS and n8n Marketing Boost systems have been rigorously verified against Agrivive's Capstone test suites "
          "(WSV-001 through WSV-010 and N8N-001 through N8N-011):", st_desc_text),
        Spacer(1, 3),
        P("<b>1. Mathematical Rigor:</b> Pairwise comparison judgments pass Saaty's consistency test with CR = 0.0038 &le; 0.10. "
          "TOPSIS vector normalization handles unscaled real-world inputs (hours, pesos, kg, stars) without artificial pre-scaling distortion.", st_desc_text),
        P("<b>2. Fair Market Access:</b> Elimination of artificial score buckets in favor of pure Ordinal Ranking and the 6-Hour Cooldown Lock "
          "ensures that all surplus varieties achieve rotational social exposure before sunset.", st_desc_text),
        P("<b>3. Decoupled Production Security:</b> n8n operates strictly as a stateless orchestrator receiving entity IDs. "
          "All business logic, database transactions, price bounds, and Meta OAuth credentials remain strictly enclosed within the Elysia backend API.", st_desc_text)
    ]
    story.append(callout_box(synth_summary, bg=BG_SOFT, border=LINE_COLOR))
    story.append(Spacer(1, 14))

    # =========================================================================
    # PART 4: RESEARCH REFERENCES & THEORETICAL FOUNDATIONS
    # =========================================================================
    story.append(PageBreak())
    story.append(P("PART 4: RESEARCH REFERENCES &amp; THEORETICAL FOUNDATIONS", st_h1))
    story.append(HRFlowable(width="100%", thickness=1.5, color=GREEN_DARK, spaceBefore=2, spaceAfter=8))

    story.append(P("4.1 Multicriteria Decision-Making (AHP &amp; TOPSIS) Academic Literature", st_h2))
    
    mcdm_refs = [
        "<b>Saaty, R. W. (1987).</b> The analytic hierarchy process: what it is and how it is used. <i>Mathematical Modelling</i>, 9(3–5), 161–176. https://doi.org/10.1016/0270-0255(87)90473-8<br/>"
        "<i>Role in Agrivive:</i> Direct theoretical foundation for the 1–9 pairwise comparison scale, column vector normalization, priority weight derivation, and matrix consistency validation (CR ≤ 0.10).",

        "<b>Hwang, C.-L., &amp; Yoon, K. (1981).</b> <i>Multiple Attribute Decision Making: Methods and Applications, A State-of-the-Art Survey</i>. Lecture Notes in Economics and Mathematical Systems, vol. 186. Springer-Verlag, Berlin Heidelberg. https://doi.org/10.1007/978-3-642-48318-9<br/>"
        "<i>Role in Agrivive:</i> Theoretical blueprint for TOPSIS vector normalization, positive-ideal (A⁺) and negative-ideal (A⁻) solution determination, Euclidean distance separation, and relative closeness ranking.",

        "<b>Derakhshan, M., Golrezaei, N., Manshadi, V., &amp; Mirrokni, V. (2022).</b> Product ranking on online platforms. <i>Management Science</i>, 68(6), 4024–4041. https://doi.org/10.1287/mnsc.2021.4044<br/>"
        "<i>Role in Agrivive:</i> Formulates merit-based, non-pay-to-win visibility algorithms for online marketplaces, ensuring smallholder farmer produce receives organic prominence.",

        "<b>Dodevska, Z., Radovanović, S., Petrović, A., &amp; Delibašić, B. (2023).</b> When fairness meets consistency in AHP pairwise comparisons. <i>Mathematics</i>, 11(3), Article 604. https://doi.org/10.3390/math11030604<br/>"
        "<i>Role in Agrivive:</i> Theoretical justification for balancing stakeholder criteria fairness with strict mathematical consistency thresholds.",

        "<b>Biswas, T., Majumder, A., Dey, S., Mandal, A., Ray, S., Kapoor, P., Emam, W., Kanthal, S., Ishizaka, A., &amp; Matuka, A. (2024).</b> Evaluation of management practices in rice–wheat cropping systems using multicriteria decision-making methods in conservation agriculture. <i>Scientific Reports</i>, 14, Article 8600. https://doi.org/10.1038/s41598-024-58022-w<br/>"
        "<i>Role in Agrivive:</i> Validates hybrid AHP-TOPSIS methodologies for complex agricultural optimization scenarios.",

        "<b>Duarte, A. D. (2024).</b> Revisão sistemática do método TOPSIS e suas aplicações na agricultura. <i>Revista Produção Online</i>, 24(2), Article 5245. https://doi.org/10.14488/1676-1901.v24i2.5245<br/>"
        "<i>Role in Agrivive:</i> Systematic survey demonstrating the mathematical stability and empirical validity of TOPSIS in agricultural produce management.",

        "<b>Krisnawijaya, N. N. K., Tekinerdogan, B., Catal, C., &amp; van der Tol, R. (2023).</b> Multi-criteria decision analysis approach for selecting feasible data analytics platforms for precision farming. <i>Computers and Electronics in Agriculture</i>, 209, 107869. https://doi.org/10.1016/j.compag.2023.107869<br/>"
        "<i>Role in Agrivive:</i> Methodological precedent for algorithmic multi-criteria decision-support systems in regional agricultural logistics.",

        "<b>Ustaoglu, E., Sisman, S., &amp; Aydinoglu, A. C. (2021).</b> Determining agricultural suitable land in peri-urban geography using GIS and Multi Criteria Decision Analysis (MCDA) techniques. <i>Ecological Modelling</i>, 455, 109610. https://doi.org/10.1016/j.ecolmodel.2021.109610<br/>"
        "<i>Role in Agrivive:</i> Empirical domain precedent for combining geographical and multi-criteria evaluation methods in agricultural networks."
    ]

    for ref in mcdm_refs:
        story.append(callout_box([P(ref, st_desc_text)], bg=BG_CARD, border=LINE_COLOR))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 4))
    story.append(P("4.2 Perishability, Dynamic Pricing &amp; Marketplace Governance", st_h2))

    perish_refs = [
        "<b>Jiang, Y., Bian, B., &amp; Li, L. (2019).</b> Integrated harvest and farm-to-door distribution scheduling with postharvest quality deterioration for vegetable online retailing. <i>Agronomy</i>, 9(11), Article 724. https://doi.org/10.3390/agronomy9110724<br/>"
        "<i>Role in Agrivive:</i> Models physiological quality decay kinetics in fresh produce, justifying the posting age criterion, the 6-hour promotional lock, and scheduled dynamic price markdowns.",

        "<b>Kokkodis, M., Lappas, T., &amp; Kane, G. C. (2022).</b> Optional purchase verification in e-commerce platforms: More representative product ratings and higher quality reviews. <i>Production and Operations Management</i>, 31(7), 2943–2961. https://doi.org/10.1111/poms.13731<br/>"
        "<i>Role in Agrivive:</i> Empirical basis for purchase-verified reviews. Only completed QR-scanned pickups grant rating permissions, shielding seller reliability (C₄) from unverified manipulation.",

        "<b>Chu, W., &amp; Chen, H. (2022).</b> The customer trust evaluation of e-commerce market based on portfolio weighting: Cloud model. <i>International Journal of Environment and Pollution</i>, 71(1–2), 126–140. https://doi.org/10.1504/IJEP.2022.132356<br/>"
        "<i>Role in Agrivive:</i> Multi-attribute portfolio weighting model adapted to compute composite seller trust from recorded transaction infractions.",

        "<b>He, S., Hollenbeck, B., &amp; Proserpio, D. (2022).</b> The market for fake reviews. <i>Marketing Science</i>, 41(5), 896–921. https://doi.org/10.1287/mksc.2022.1353<br/>"
        "<i>Role in Agrivive:</i> Informs algorithmic defenses against fraudulent feedback, requiring dual-reporter corroboration and verified transaction event logs.",

        "<b>OECD (2022).</b> <i>The role of online marketplaces in protecting and empowering consumers</i>. OECD Digital Economy Papers, No. 334. OECD Publishing, Paris. https://doi.org/10.1787/9d8cc586-en<br/>"
        "<i>Role in Agrivive:</i> Regulatory framework for progressive platform sanctions: friendly reminders &rarr; formal warnings &rarr; temporary pauses &rarr; administrative review.",

        "<b>World Intellectual Property Organization (2023, November).</b> <i>Study on the practices of e-commerce marketplaces to combat illicit trade online</i> (Document WIPO/ACE/16/11). WIPO Advisory Committee on Enforcement, Geneva. https://www.wipo.int/edocs/mdocs/enforcement/en/wipo_ace_16/wipo_ace_16_11.pdf<br/>"
        "<i>Role in Agrivive:</i> Confirms that 86% of compliant international marketplaces employ automated progressive enforcement scales."
    ]

    for ref in perish_refs:
        story.append(callout_box([P(ref, st_desc_text)], bg=BG_CARD, border=LINE_COLOR))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 4))
    story.append(P("4.3 Workflow Automation, LPU Inference &amp; Platform Infrastructure", st_h2))

    tech_refs = [
        "<b>n8n Workflow Automation Engine (2026).</b> <i>Fair-code Workflow Automation Documentation</i>. https://docs.n8n.io<br/>"
        "<i>Role in Agrivive:</i> Orchestrates event-driven webhook ingestion, conditional branch routing, Groq payload formatting, and automated retry mechanisms for the Boost pipeline.",

        "<b>Groq Cloud LPU Inference API (2026).</b> <i>GroqCloud Documentation and Ultra-Low Latency Inference Guide</i>. https://console.groq.com/docs<br/>"
        "<i>Role in Agrivive:</i> Powers sub-400ms contextual agricultural promotion copywriting (using LLaMA3B / GPT-OSS-20B) adhering strictly to anti-slop guidelines.",

        "<b>Meta Graph API (2026).</b> <i>Meta Graph API v19.0 Reference for Facebook Pages &amp; Instagram Business Accounts</i>. https://developers.facebook.com/docs/graph-api<br/>"
        "<i>Role in Agrivive:</i> Server-to-server publishing protocol for initial harvest announcements and 6-hour promotional flash-sale price drops.",

        "<b>Better Auth Framework (2026).</b> <i>Better Auth Comprehensive Authentication &amp; RBAC Framework</i>. https://www.better-auth.com/<br/>"
        "<i>Role in Agrivive:</i> Enforces session authentication, service key tokens for integration callbacks, and role-based permissions across buyer and seller endpoints."
    ]

    for ref in tech_refs:
        story.append(callout_box([P(ref, st_desc_text)], bg=BG_CARD, border=LINE_COLOR))
        story.append(Spacer(1, 4))

    story.append(Spacer(1, 4))
    story.append(P("4.4 Capstone Research Manuscript, Codebase &amp; Test Suite Artifacts", st_h2))

    capstone_refs = [
        "<b>Capstone Research Manuscript:</b><br/>"
        "Bartiquien, A., Jara, J. T., &amp; Marundan, J. (2026). <i>Agrivive: A Surplus Vegetable Marketplace with Multicriteria Visibility Ranking and Automated Social Promotions</i> (Undergraduate Capstone Research Paper). Davao City, Philippines. Documented as <code>Agrivive/docs/CAPSTONE 2 FILES - BARTIQUIEN, JARA, MARUNDAN.pdf</code>.",

        "<b>Obsidian Engineering Vault Notes:</b><br/>"
        "• <code>Agrivive/04 Delivery/2026-11-08 AHP-TOPSIS Raw Criteria and Six-Hour Rule.md</code>: Rebuilding of the solver on raw criteria and elimination of static tiers in favor of ordinal ranking.<br/>"
        "• <code>Agrivive/Boost Ranking Flow AHP-TOPSIS.md</code>: Core architectural blueprint and 6-hour lock rotation specification.<br/>"
        "• <code>Agrivive/docs/References.md</code>: Master bibliography and theoretical foundations.",

        "<b>Formal Test Suites &amp; Verification Sheets:</b><br/>"
        "• <code>Agrivive/docs/WSV-AHP-TOPSIS-test-sheet.md</code> &amp; <code>WSV-AHP-TOPSIS-test-results.md</code>: Complete live validation cases WSV-001 through WSV-010.<br/>"
        "• <code>Agrivive/docs/N8N-Boost-test-sheet.md</code>: Marketing boost cases N8N-001 through N8N-011.<br/>"
        "• <code>backend/src/utils/ahp-topsis/ahp-topsis.test.ts</code>: 145 automated unit and regression tests passing with 0 failures.",

        "<b>Production Codebase Modules:</b><br/>"
        "• <code>backend/src/utils/ahp-topsis/index.ts</code>: Mathematical solver implementing Saaty AHP and Hwang-Yoon TOPSIS.<br/>"
        "• <code>backend/src/utils/visibility-ranking/boost-select.ts</code>: Pure function enforcing the 6-Hour Lock Rule.<br/>"
        "• <code>backend/src/worker.ts</code> &amp; <code>jobs/queue-ranked-boost.ts</code>: Background daemon polling every 60 seconds.<br/>"
        "• <code>n8n/workflows/agrivive-visibility-boost.json</code>: Production n8n workflow definition."
    ]

    for ref in capstone_refs:
        story.append(callout_box([P(ref, st_desc_text)], bg=BG_CARD, border=LINE_COLOR))
        story.append(Spacer(1, 4))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF Successfully Generated: {filename}")


if __name__ == "__main__":
    out_dir = "/home/jarajoaquinjara/projects/Agrivive/Agrivive/docs"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "AHP-TOPSIS and n8n Boost Engine Technical Specification.pdf")
    build_pdf(out_file)
