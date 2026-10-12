import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#555555"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(54, letter[1] - 36, "Agrivive Technical Report | AHP–TOPSIS Visibility Engine")
            self.setStrokeColor(colors.HexColor("#D0CCC0"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)
            
        # Footer (All pages)
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 30, footer_text)
        self.drawString(54, 30, "Confidential & Academic Research — Agrivive Capstone 2026")
        self.setStrokeColor(colors.HexColor("#D0CCC0"))
        self.setLineWidth(0.5)
        self.line(54, 40, letter[0] - 54, 40)
        self.restoreState()

def build_pdf(filename="outputs/Agrivive_AHP_TOPSIS_Engine.pdf"):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # 54 pt margins = 0.75 in
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    c_primary = colors.HexColor("#1F4D3A")     # Forest Green
    c_secondary = colors.HexColor("#C85A32")   # Terracotta Accent
    c_subtext = colors.HexColor("#4A5568")     # Slate Gray
    c_dark = colors.HexColor("#1A202C")        # Charcoal Body
    c_bg_box = colors.HexColor("#F7F9F7")      # Light Green Tint
    c_border_box = colors.HexColor("#C2D6CC")  # Border Green
    c_math_bg = colors.HexColor("#FDFCF8")     # Warm Math Tint
    c_math_border = colors.HexColor("#E5E0D5") # Math Border

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=c_primary,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceAfter=14
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=c_subtext
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=c_primary,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=c_dark,
        spaceAfter=8,
        alignment=4 # Justified
    )

    intro_box_style = ParagraphStyle(
        'IntroBox',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=13,
        textColor=colors.HexColor("#2D3748"),
        alignment=4
    )

    formula_style = ParagraphStyle(
        'FormulaText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=14,
        textColor=c_primary,
        alignment=1 # Centered
    )

    formula_desc_style = ParagraphStyle(
        'FormulaDesc',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=c_subtext,
        alignment=1
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=1
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=c_primary
    )

    ref_style = ParagraphStyle(
        'RefStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11.5,
        textColor=c_dark,
        leftIndent=18,
        firstLineIndent=-18,
        spaceAfter=5
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("AHP–TOPSIS Multi-Criteria Decision Visibility Engine", title_style))
    story.append(Paragraph("Algorithmic Specification, Mathematical Formulation, and Implementation in Agrivive", subtitle_style))
    
    meta_text = (
        "<b>Project:</b> Agrivive Marketplace Capstone &nbsp;|&nbsp; "
        "<b>Repository:</b> backend/src/utils/ahp-topsis &nbsp;|&nbsp; "
        "<b>Date:</b> October 2026<br/>"
        "<b>Authors:</b> Arianne Bartiquien, et al. &nbsp;|&nbsp; "
        "<b>Architecture:</b> Bun, TypeScript, ElysiaJS, PostgreSQL, React Native Expo, React Web"
    )
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=c_primary, spaceBefore=0, spaceAfter=10))

    # Abstract / Executive Overview Box
    intro_p1 = (
        "<b>Abstract & Context:</b> The Weighted Surplus Visibility Algorithm in Agrivive is a multi-criteria "
        "decision-making method that determines the visibility level and display priority of active surplus "
        "vegetable listings. It uses the Analytic Hierarchy Process (AHP) to determine the importance of each "
        "criterion and the Technique for Order Preference by Similarity to Ideal Solution (TOPSIS) to calculate "
        "scores and rank listings. AHP provides a structured way to assign criterion weights and check the "
        "consistency of comparisons, while TOPSIS evaluates listings based on their distance from the ideal best "
        "and worst results [1], [2]. These methods have also been applied in agricultural management, land suitability "
        "assessment, and precision farming [3]–[6]."
    )
    intro_p2 = (
        "The algorithm evaluates each eligible listing using four criteria: freshness based on posting time, "
        "stock availability, seller reliability, and historical surplus recurrence. First, AHP establishes the "
        "weights for these criteria through pairwise comparisons and checks their consistency. Next, TOPSIS "
        "normalizes the listing data, applies the weights, identifies the ideal best and worst results, and "
        "calculates a final score for each listing. Based on this score, Agrivive assigns one of three visibility levels: "
        "<b>Priority Boost</b> for scores of 0.60 and above, <b>Standard Exposure</b> for scores from 0.40 to below 0.60, "
        "and <b>Basic/Hold</b> for scores below 0.40."
    )
    intro_p3 = (
        "This algorithm helps Agrivive prioritize listings using a consistent and explainable process rather than "
        "relying on a single factor or arbitrary ranking. By considering multiple criteria, it prevents one listing "
        "characteristic alone from determining the final priority and helps identify listings that may benefit from "
        "greater marketplace exposure [2]. Listings under Priority Boost may receive better feed placement, a visibility "
        "badge, and eligibility for promotional activities through n8n, while other listings remain accessible through "
        "regular marketplace discovery. This supports sellers in promoting their remaining vegetables and helps buyers "
        "discover available surplus products. However, the visibility score measures promotional priority only and does "
        "not determine the actual freshness, safety, or marketability of the vegetables."
    )
    
    intro_content = [
        [Paragraph(intro_p1, intro_box_style)],
        [Spacer(1, 4)],
        [Paragraph(intro_p2, intro_box_style)],
        [Spacer(1, 4)],
        [Paragraph(intro_p3, intro_box_style)]
    ]
    intro_table = Table(intro_content, colWidths=[letter[0] - 108])
    intro_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_bg_box),
        ('BOX', (0,0), (-1,-1), 1, c_border_box),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(intro_table)
    story.append(Spacer(1, 10))

    # Section 1: Architectural Dual-Policy Design
    story.append(Paragraph("1. System Architecture & Dual-Policy Implementation", h1_style))
    p_arch = (
        "Agrivive implements the ranking engine using a dual-policy architecture controlled by the server environment "
        "variable <code>VISIBILITY_POLICY</code>. This decoupling allows live A/B benchmarking and safe zero-downtime "
        "rollback between the baseline model and the new pilot decision engine. Under the baseline mode "
        "(<code>visibility-v4</code>), the system executes a linear Weighted Surplus Visibility (WVS) scoring formula: "
        "<b>V = 0.40P + 0.40Q + 0.20R</b>, where P represents elapsed posting age, Q is remaining inventory quantity, and R "
        "is previous listing cycle count. While functional, the baseline assigns fixed heuristic weights and inadvertently "
        "rewards aging produce. Under the pilot policy (<code>visibility-ahptopsis-v1</code>), the system activates "
        "the full AHP–TOPSIS multi-criteria pipeline implemented in <code>backend/src/utils/ahp-topsis/index.ts</code>, "
        "incorporating four rigorously normalized benefit criteria and matrix consistency verification."
    )
    story.append(Paragraph(p_arch, body_style))

    # Helper function to create centered formula callouts
    def make_formula_box(formula_str, desc_str=""):
        content = [[Paragraph(formula_str, formula_style)]]
        if desc_str:
            content.append([Paragraph(desc_str, formula_desc_style)])
        t = Table(content, colWidths=[letter[0] - 108])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_math_bg),
            ('BOX', (0,0), (-1,-1), 0.75, c_math_border),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        return t

    # Section 2: The Four Evaluated Criteria
    story.append(Paragraph("2. Detailed Discussion of the Four Evaluated Criteria", h1_style))
    p_crit_intro = (
        "Each active candidate listing is evaluated against four quantitative criteria. To establish geometric comparability "
        "across disparate physical units (hours, kilogram ratios, review stars, and cycle counters), every criterion is "
        "structured as a <b>benefit criterion</b> (where higher normalized values signify higher marketplace promotion priority) "
        "and clamped strictly within the closed interval [0, 1]."
    )
    story.append(Paragraph(p_crit_intro, body_style))

    # Criterion 1: Freshness
    story.append(Paragraph("2.1 Criterion 1: Freshness (C₁)", h2_style))
    p_c1 = (
        "<b>Operational Definition & Rationale:</b> Freshness addresses the rapid post-harvest degradation inherent to "
        "tropical horticultural crops. The criterion measures the elapsed chronological time between listing publication "
        "and evaluation. Because quality deterioration in leafy and fruit vegetables begins immediately post-harvest, "
        "Agrivive establishes a 12-hour evaluation horizon. If t_eval is the query timestamp and t_pub,i is the listing publication "
        "time, the elapsed age in hours is calculated as age_i = (t_eval - t_pub,i) / 3600. The normalized freshness metric x_i1 is:"
    )
    story.append(Paragraph(p_c1, body_style))
    story.append(make_formula_box(
        "x<sub>i1</sub> = clamp(1 - age<sub>i</sub> / 12, 0, 1) = max(0, min(1, 1 - age<sub>i</sub> / 12))",
        "Equation 1: Freshness Benefit Metric (12-Hour Linear Decay Horizon)"
    ))
    story.append(Spacer(1, 4))
    p_c1_sub = (
        "<b>Platform Usage:</b> This metric assigns a perfect score of 1.0 to freshly published listings, linearly decaying "
        "to 0.0 once elapsed age reaches or exceeds 12 hours. This operational priority ensures newly harvested surplus produce "
        "receives immediate customer visibility and accelerated turnover before physiological decay occurs."
    )
    story.append(Paragraph(p_c1_sub, body_style))

    # Criterion 2: Stock Availability
    story.append(Paragraph("2.2 Criterion 2: Stock Availability (C₂)", h2_style))
    p_c2 = (
        "<b>Operational Definition & Rationale:</b> Stock Availability measures the proportion of unreserved produce volume "
        "remaining in the active sales batch relative to the initial quantity declared when the listing cycle was created. "
        "Letting q_current,i represent unreserved inventory and q_original,i represent starting batch inventory, x_i2 is computed as:"
    )
    story.append(Paragraph(p_c2, body_style))
    story.append(make_formula_box(
        "x<sub>i2</sub> = clamp(q<sub>current, i</sub> / q<sub>original, i</sub>, 0, 1) = max(0, min(1, q<sub>current, i</sub> / q<sub>original, i</sub>))",
        "Equation 2: Remaining Surplus Stock Availability Ratio"
    ))
    story.append(Spacer(1, 4))
    p_c2_sub = (
        "<b>Platform Usage:</b> This criterion assists sellers in clearing large remaining surpluses by prioritizing batches "
        "with substantial unreserved inventory. Conversely, batches with only residual quantities near zero score lower, "
        "preventing nearly exhausted listings from dominating marketplace discovery."
    )
    story.append(Paragraph(p_c2_sub, body_style))

    # Criterion 3: Seller Reliability
    story.append(Paragraph("2.3 Criterion 3: Seller Reliability (C₃)", h2_style))
    p_c3 = (
        "<b>Operational Definition & Rationale:</b> Seller Reliability incorporates vendor trust and verified fulfillment into "
        "the multi-criteria model. Letting R_i in [1, 5] represent the seller's cumulative mean star rating derived from verified "
        "buyer post-pickup evaluations, the metric x_i3 is normalized against the 5-star ceiling:"
    )
    story.append(Paragraph(p_c3, body_style))
    story.append(make_formula_box(
        "x<sub>i3</sub> = clamp(R<sub>i</sub> / 5, 0, 1), &nbsp;&nbsp;&nbsp;&nbsp; with default fallback x<sub>i3</sub> = 0.50 when no review history exists",
        "Equation 3: Normalized Seller Reliability Rating with Cold-Start Baseline"
    ))
    story.append(Spacer(1, 4))
    p_c3_sub = (
        "<b>Platform Usage:</b> To address the cold-start barrier and prevent structural discrimination against newly registered "
        "farmers and vendors, the engine applies an unpenalized neutral baseline of 0.50 (equivalent to 2.5 stars) whenever review "
        "records are absent. This safeguards consumer confidence while preserving open access for new market participants."
    )
    story.append(Paragraph(p_c3_sub, body_style))

    # Criterion 4: Recurrence
    story.append(Paragraph("2.4 Criterion 4: Surplus Recurrence (C₄)", h2_style))
    p_c4 = (
        "<b>Operational Definition & Rationale:</b> Recurrence quantifies long-term supply consistency and vendor engagement "
        "for a specific vegetable commodity. Linked through Agrivive's standardized botanical catalog identifier and selling unit "
        "(e.g., Sitaw sold per kilogram versus Sitaw per bundle), the engine tallies the seller's prior completed zero-stock "
        "replenishment cycles (prior cycles_i):"
    )
    story.append(Paragraph(p_c4, body_style))
    story.append(make_formula_box(
        "x<sub>i4</sub> = clamp(prior cycles<sub>i</sub> / 3, 0, 1) = max(0, min(1, prior cycles<sub>i</sub> / 3))",
        "Equation 4: Standardized Catalog Recurrence Factor (3-Cycle Saturation)"
    ))
    story.append(Spacer(1, 4))
    p_c4_sub = (
        "<b>Platform Usage:</b> This metric rewards vendors who demonstrate sustained agricultural supply reliability, reaching "
        "maximum saturation (1.0) after three completed stock turnover cycles. It differentiates active, dependable marketplace "
        "producers from isolated or irregular sellers."
    )
    story.append(Paragraph(p_c4_sub, body_style))

    # Summary Table of Criteria
    crit_table_data = [
        [Paragraph("<b>Criterion</b>", table_header_style), 
         Paragraph("<b>Symbol</b>", table_header_style), 
         Paragraph("<b>Physical Source</b>", table_header_style), 
         Paragraph("<b>Normalized Domain</b>", table_header_style), 
         Paragraph("<b>AHP Derived Weight</b>", table_header_style)],
        [Paragraph("Freshness", table_cell_bold), Paragraph("C₁", table_cell_style), Paragraph("Elapsed hours since publication", table_cell_style), Paragraph("[0, 1] (12-hr decay)", table_cell_style), Paragraph("0.400 (40%)", table_cell_bold)],
        [Paragraph("Stock Availability", table_cell_bold), Paragraph("C₂", table_cell_style), Paragraph("Current vs. original batch qty", table_cell_style), Paragraph("[0, 1] (proportion)", table_cell_style), Paragraph("0.300 (30%)", table_cell_bold)],
        [Paragraph("Seller Reliability", table_cell_bold), Paragraph("C₃", table_cell_style), Paragraph("Verified order review rating", table_cell_style), Paragraph("[0, 1] (0.50 default)", table_cell_style), Paragraph("0.200 (20%)", table_cell_bold)],
        [Paragraph("Surplus Recurrence", table_cell_bold), Paragraph("C₄", table_cell_style), Paragraph("Prior completed catalog cycles", table_cell_style), Paragraph("[0, 1] (3-cycle cap)", table_cell_style), Paragraph("0.100 (10%)", table_cell_bold)],
    ]
    t_crit = Table(crit_table_data, colWidths=[100, 45, 175, 100, 84])
    t_crit.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border_box),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_box]),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ('ALIGN', (4,0), (4,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_crit)
    story.append(Spacer(1, 10))

    # Section 3: Step-by-Step Mathematical Workflow
    story.append(Paragraph("3. Step-by-Step Mathematical Workflow & Formulas", h1_style))
    p_wf_intro = (
        "The algorithmic engine executes in two distinct phases: Phase 1 derives criterion weights using the Analytic "
        "Hierarchy Process (AHP) [1] and verifies matrix consistency; Phase 2 executes the Technique for Order Preference "
        "by Similarity to Ideal Solution (TOPSIS) [2] across all active listings to produce a normalized closeness index."
    )
    story.append(Paragraph(p_wf_intro, body_style))

    # Phase 1: AHP
    story.append(Paragraph("3.1 Phase 1: Analytic Hierarchy Process (AHP) Weight Derivation", h2_style))
    p_ahp_step1 = (
        "<b>Step 1 — Pairwise Comparison Matrix Construction:</b> Domain agricultural criteria priorities are formalized "
        "into an m x m reciprocal comparison matrix A = [a_jk] (where m = 4) using Saaty's 1–9 fundamental scale [1]. "
        "The elements satisfy reciprocal condition a_kj = 1 / a_jk and diagonal identity a_jj = 1.0:"
    )
    story.append(Paragraph(p_ahp_step1, body_style))

    matrix_data = [
        [Paragraph("<b>Criteria Comparison</b>", table_header_style), Paragraph("<b>C₁ (Fresh)</b>", table_header_style), Paragraph("<b>C₂ (Stock)</b>", table_header_style), Paragraph("<b>C₃ (Reliab)</b>", table_header_style), Paragraph("<b>C₄ (Recurr)</b>", table_header_style)],
        [Paragraph("<b>C₁: Freshness</b>", table_cell_bold), Paragraph("1.000", table_cell_style), Paragraph("1.333", table_cell_style), Paragraph("2.000", table_cell_style), Paragraph("4.000", table_cell_style)],
        [Paragraph("<b>C₂: Stock Availability</b>", table_cell_bold), Paragraph("0.750", table_cell_style), Paragraph("1.000", table_cell_style), Paragraph("1.500", table_cell_style), Paragraph("3.000", table_cell_style)],
        [Paragraph("<b>C₃: Seller Reliability</b>", table_cell_bold), Paragraph("0.500", table_cell_style), Paragraph("0.667", table_cell_style), Paragraph("1.000", table_cell_style), Paragraph("2.000", table_cell_style)],
        [Paragraph("<b>C₄: Recurrence</b>", table_cell_bold), Paragraph("0.250", table_cell_style), Paragraph("0.333", table_cell_style), Paragraph("0.500", table_cell_style), Paragraph("1.000", table_cell_style)],
    ]
    t_matrix = Table(matrix_data, colWidths=[150, 88, 88, 88, 90])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_primary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border_box),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_box]),
        ('ALIGN', (1,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 6))

    p_ahp_step23 = (
        "<b>Step 2 & 3 — Geometric Mean and Weight Vector Computation:</b> To avoid rank reversal and maintain reciprocal "
        "symmetry, the engine computes the unnormalized geometric mean g_j for each row j, followed by normalization across total sum:"
    )
    story.append(Paragraph(p_ahp_step23, body_style))
    story.append(make_formula_box(
        "g<sub>j</sub> = ( &prod;<sub>k=1</sub><sup>m</sup> a<sub>jk</sub> )<sup>1/m</sup> &nbsp;&nbsp;&rArr;&nbsp;&nbsp; w<sub>j</sub> = g<sub>j</sub> / &sum;<sub>r=1</sub><sup>m</sup> g<sub>r</sub>",
        "Equation 5: Geometric Mean (Logarithmic Least Squares) and Normalized Weight Vector"
    ))
    story.append(Spacer(1, 4))
    p_ahp_weights_eval = (
        "Evaluating Equation 5 across Matrix A yields unnormalized geometric means g_1 = 1.807, g_2 = 1.355, g_3 = 0.904, and g_4 = 0.452 "
        "(summing to 4.518). Normalization produces the definitive weight vector: <b>w = [0.400, 0.300, 0.200, 0.100]ᵀ</b>, "
        "satisfying the unity axiom (&sum; w_j = 1.000)."
    )
    story.append(Paragraph(p_ahp_weights_eval, body_style))

    p_ahp_step4 = (
        "<b>Step 4 — Mathematical Consistency Verification:</b> To verify that subjective pairwise judgments do not contain "
        "intransitive contradictions (e.g., A > B and B > C but C > A), eigenvalue analysis computes the weighted sum vector "
        "s_j = &sum; a_jk w_k and individual eigenvalue ratios &lambda;_j = s_j / w_j. The maximum eigenvalue &lambda;_max, "
        "Consistency Index (CI), and Consistency Ratio (CR) are evaluated against Saaty's empirical Random Index (RI₄ = 0.90 for m = 4) [1]:"
    )
    story.append(Paragraph(p_ahp_step4, body_style))
    story.append(make_formula_box(
        "&lambda;<sub>max</sub> = (1/m) &sum;<sub>j=1</sub><sup>m</sup> (s<sub>j</sub> / w<sub>j</sub>), &nbsp;&nbsp; CI = (&lambda;<sub>max</sub> - m) / (m - 1), &nbsp;&nbsp; CR = CI / RI<sub>m</sub>",
        "Equation 6: Maximum Eigenvalue, Consistency Index (CI), and Consistency Ratio (CR)"
    ))
    story.append(Spacer(1, 4))
    p_cr_verif = (
        "For the Agrivive comparison matrix, &lambda;_max evaluates to exactly 4.000, yielding CI = 0.000 and CR &approx; 0.000. "
        "Because CR is substantially below the established threshold of 0.10, the matrix achieves complete mathematical transitivity."
    )
    story.append(Paragraph(p_cr_verif, body_style))

    # Phase 2: TOPSIS
    story.append(Paragraph("3.2 Phase 2: TOPSIS Ranking and Closeness Computation", h2_style))
    p_topsis_step56 = (
        "<b>Step 5 & 6 — Decision Matrix Formation and Vector Normalization:</b> For n active eligible listings, the decision matrix "
        "X = [x_ik]_(n x 4) aggregates the four normalized benefit criteria. To eliminate dimensional distortion and map all criteria onto "
        "a shared geometric scale, Euclidean vector normalization transforms each element into r_ik:"
    )
    story.append(Paragraph(p_topsis_step56, body_style))
    story.append(make_formula_box(
        "r<sub>ik</sub> = x<sub>ik</sub> / &radic;( &sum;<sub>i=1</sub><sup>n</sup> x<sub>ik</sub><sup>2</sup> )",
        "Equation 7: TOPSIS Vector Normalization"
    ))
    story.append(Spacer(1, 4))
    p_topsis_step7 = (
        "<b>Step 7 — Weighted Normalized Decision Matrix Construction:</b> Each normalized column is multiplied by its AHP weight w_k:"
    )
    story.append(Paragraph(p_topsis_step7, body_style))
    story.append(make_formula_box(
        "v<sub>ik</sub> = w<sub>k</sub> &times; r<sub>ik</sub>",
        "Equation 8: Weighted Normalized Attribute Formulation"
    ))
    story.append(Spacer(1, 4))

    p_topsis_step8 = (
        "<b>Step 8 — Identification of Positive and Negative Ideal Solutions:</b> Because all four criteria are formulated as benefit metrics, "
        "the Positive Ideal Solution (A⁺) represents the maximum column elements, while the Negative Ideal Solution (A⁻) represents the minimum column bounds:"
    )
    story.append(Paragraph(p_topsis_step8, body_style))
    story.append(make_formula_box(
        "A<sup>+</sup> = ( max<sub>i</sub> v<sub>i1</sub>, max<sub>i</sub> v<sub>i2</sub>, max<sub>i</sub> v<sub>i3</sub>, max<sub>i</sub> v<sub>i4</sub> ) = ( v<sub>1</sub><sup>+</sup>, v<sub>2</sub><sup>+</sup>, v<sub>3</sub><sup>+</sup>, v<sub>4</sub><sup>+</sup> )<br/>"
        "A<sup>-</sup> = ( min<sub>i</sub> v<sub>i1</sub>, min<sub>i</sub> v<sub>i2</sub>, min<sub>i</sub> v<sub>i3</sub>, min<sub>i</sub> v<sub>i4</sub> ) = ( v<sub>1</sub><sup>-</sup>, v<sub>2</sub><sup>-</sup>, v<sub>3</sub><sup>-</sup>, v<sub>4</sub><sup>-</sup> )",
        "Equation 9: Positive-Ideal (A⁺) and Negative-Ideal (A⁻) Benchmark Coordinates"
    ))
    story.append(Spacer(1, 4))

    p_topsis_step910 = (
        "<b>Step 9 & 10 — Euclidean Distance and Relative Closeness Coefficient Computation:</b> The Euclidean separation of each listing "
        "from the ideal-best (D_i⁺) and ideal-worst (D_i⁻) is measured. The final closeness coefficient C_i* determines overall promotional priority [2]:"
    )
    story.append(Paragraph(p_topsis_step910, body_style))
    story.append(make_formula_box(
        "D<sub>i</sub><sup>+</sup> = &radic;( &sum;<sub>k=1</sub><sup>4</sup> (v<sub>ik</sub> - v<sub>k</sub><sup>+</sup>)<sup>2</sup> ), &nbsp;&nbsp;&nbsp;&nbsp; "
        "D<sub>i</sub><sup>-</sup> = &radic;( &sum;<sub>k=1</sub><sup>4</sup> (v<sub>ik</sub> - v<sub>k</sub><sup>-</sup>)<sup>2</sup> )<br/><br/>"
        "C<sub>i</sub><sup>*</sup> = D<sub>i</sub><sup>-</sup> / ( D<sub>i</sub><sup>+</sup> + D<sub>i</sub><sup>-</sup> ), &nbsp;&nbsp;&nbsp;&nbsp; where 0 &le; C<sub>i</sub><sup>*</sup> &le; 1",
        "Equation 10: Multidimensional Euclidean Distances and Relative Closeness Coefficient"
    ))
    story.append(Spacer(1, 4))

    p_topsis_step11 = (
        "<b>Step 11 — Ordering, Deterministic Tie-Breaking, and Tier Assignment:</b> Candidate listings are sorted in descending order of "
        "C_i* (C_(1)* &ge; C_(2)* &ge; ... &ge; C_(n)*). In the event of identical numerical closeness coefficients, pagination stability is "
        "maintained through deterministic tie-breaking: listings are sorted by publication timestamp descending (publishedAt), followed by "
        "lexicographical sorting of unique listing identifiers (id). Finally, continuous scores are partitioned into discrete marketplace tiers:"
    )
    story.append(Paragraph(p_topsis_step11, body_style))
    story.append(make_formula_box(
        "VisibilityTier(C<sub>i</sub><sup>*</sup>) = "
        "Priority Boost (C<sub>i</sub><sup>*</sup> &ge; 0.60) &nbsp;|&nbsp; "
        "Standard Exposure (0.40 &le; C<sub>i</sub><sup>*</sup> &lt; 0.60) &nbsp;|&nbsp; "
        "Basic / Hold (C<sub>i</sub><sup>*</sup> &lt; 0.40)",
        "Equation 11: Marketplace Exposure Tier Classification Boundaries"
    ))
    story.append(Spacer(1, 8))

    # Tier Table
    tier_table_data = [
        [Paragraph("<b>Visibility Tier</b>", table_header_style), Paragraph("<b>Score Domain</b>", table_header_style), Paragraph("<b>Marketplace Treatment</b>", table_header_style), Paragraph("<b>Automated Promotion Impact</b>", table_header_style)],
        [Paragraph("Priority Boost", table_cell_bold), Paragraph("C<sub>i</sub><sup>*</sup> &ge; 0.60", table_cell_style), Paragraph("Top search feed placement & distinctive badge", table_cell_style), Paragraph("Eligible for automated n8n official social dispatches", table_cell_style)],
        [Paragraph("Standard Exposure", table_cell_bold), Paragraph("0.40 &le; C<sub>i</sub><sup>*</sup> &lt; 0.60", table_cell_style), Paragraph("Standard catalog discovery feed placement", table_cell_style), Paragraph("Available through organic search; no external boost", table_cell_style)],
        [Paragraph("Basic / Hold", table_cell_bold), Paragraph("C<sub>i</sub><sup>*</sup> &lt; 0.40", table_cell_style), Paragraph("Direct category search and store view only", table_cell_style), Paragraph("Retained in catalog; not highlighted in public feed", table_cell_style)],
    ]
    t_tier = Table(tier_table_data, colWidths=[100, 85, 150, 169])
    t_tier.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('GRID', (0,0), (-1,-1), 0.5, c_border_box),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_box]),
        ('ALIGN', (1,0), (1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_tier)
    story.append(Spacer(1, 10))

    # Section 4: Operational Benefits & Practical Impact
    story.append(Paragraph("4. Operational Value to Agrivive and Stakeholders", h1_style))
    p_benefits = (
        "The AHP–TOPSIS multi-criteria engine provides four foundational advantages to the platform:<br/>"
        "<b>1. Cold-Start Viability:</b> Unlike machine-learning recommenders that depend on extensive historical purchase records, "
        "AHP–TOPSIS functions deterministically using day-one operational data, resolving cold-start data sparsity.<br/>"
        "<b>2. Explainable Agricultural Alignment:</b> Pairing 40% harvest freshness with 30% surplus stock ratio directly accelerates the "
        "turnover of high-volume perishable produce before quality degradation occurs, directly addressing local food loss.<br/>"
        "<b>3. Objective Weight Justification:</b> Moving away from guessed heuristic percentages to an AHP comparison matrix "
        "provides empirical consistency proof (CR &approx; 0.000 < 0.10), giving the academic capstone rigorous scientific defensibility [1], [3].<br/>"
        "<b>4. Safe Deployment & Reproducibility:</b> Controlled behind the <code>VISIBILITY_POLICY</code> environment flag and verified "
        "through the companion simulation workbook (<code>outputs/agrivive-ahp-topsis-simulation.xlsx</code>), the engine allows "
        "empirical benchmark evaluation against legacy policies without threatening live marketplace operations."
    )
    story.append(Paragraph(p_benefits, body_style))
    story.append(Spacer(1, 10))

    # Section 5: References
    story.append(Paragraph("5. References and Academic Literature", h1_style))
    
    refs = [
        "<b>[1] Saaty, R. W. (1987).</b> <i>The analytic hierarchy process—what it is and how it is used.</i> Mathematical Modelling, 9(3–5), 161–176. DOI: 10.1016/0270-0255(87)90473-8",
        "<b>[2] Hwang, C.-L., & Yoon, K. (1981).</b> <i>Multiple Attribute Decision Making: Methods and Applications: A State-of-the-Art Survey.</i> Lecture Notes in Economics and Mathematical Systems, vol. 186. Springer. DOI: 10.1007/978-3-642-48318-9",
        "<b>[3] Biswas, T., et al. (2024).</b> <i>Evaluation of management practices in rice-wheat cropping system using multicriteria decision-making methods in conservation agriculture.</i> Scientific Reports, 14, 8251. DOI: 10.1038/s41598-024-58022-w",
        "<b>[4] Duarte, A. D. (2024).</b> <i>Revisão sistemática do método TOPSIS e suas aplicações na agricultura [Systematic review of the TOPSIS method and its applications in agriculture].</i> Revista Produção Online, 24(2), 5245. DOI: 10.14488/1676-1901.v24i2.5245",
        "<b>[5] Krisnawijaya, N. N. K., Tekinerdogan, B., Catal, C., & van der Tol, R. (2023).</b> <i>Multi-Criteria decision analysis approach for selecting feasible data analytics platforms for precision farming.</i> Computers and Electronics in Agriculture, 209, 107869. DOI: 10.1016/j.compag.2023.107869",
        "<b>[6] Ustaoglu, E., Sisman, S., & Aydinoglu, A. C. (2021).</b> <i>Determining agricultural suitable land in peri-urban geography using GIS and Multi Criteria Decision Analysis (MCDA) techniques.</i> Ecological Modelling, 455, 109610. DOI: 10.1016/j.ecolmodel.2021.109610",
        "<b>[7] Agrivive Engineering Documentation. (2026).</b> <i>AHP-TOPSIS Visibility Implementation Plan.</i> Obsidian Vault Note, <code>Agrivive/04 Delivery/2026-10-11 AHP-TOPSIS Visibility Implementation Plan.md</code>.",
        "<b>[8] Agrivive Source Code. (2026).</b> <i>Core AHP-TOPSIS Multi-Criteria Utility.</i> TypeScript implementation, <code>backend/src/utils/ahp-topsis/index.ts</code>.",
        "<b>[9] Agrivive Simulation Artifact. (2026).</b> <i>AHP-TOPSIS Formula-Driven Simulation Model.</i> Excel Workbook, <code>outputs/agrivive-ahp-topsis-simulation.xlsx</code>."
    ]

    for ref in refs:
        story.append(Paragraph(ref, ref_style))

    # Build document with custom canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated academic PDF report at: {filename}")

if __name__ == "__main__":
    build_pdf()
