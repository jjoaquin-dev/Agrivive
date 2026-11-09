#!/usr/bin/env python3
"""
Generates high-resolution pipeline diagram infographics for Agrivive documentation:
1. AHP-TOPSIS Visibility Ranking Algorithm (IPO) - 3 Columns (Input, Process, Output)
2. n8n Workflow - Agrivive Seller Boost Flow - 2 Rows (Initial Post, 6-Hour Price Cut)
"""

import os
import math
from PIL import Image, ImageDraw, ImageFont

OUT_DIR = "/home/jarajoaquinjara/projects/Agrivive/Agrivive/docs"
FONT_BOLD_PATH = "/home/jarajoaquinjara/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/fonts/Ubuntu-B.ttf"
FONT_REG_PATH = "/home/jarajoaquinjara/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/fonts/Ubuntu-R.ttf"

def get_font(size, bold=False):
    path = FONT_BOLD_PATH if bold else FONT_REG_PATH
    return ImageFont.truetype(path, size)

# Color Palette
C_DARK_GREEN = "#1F4D3A"
C_LIGHT_GREEN = "#457D00"
C_NAVY = "#1E3A8A"
C_PURPLE = "#4338CA"
C_DARK = "#14231A"
C_MUTED = "#5F7367"
C_BG_CARD = "#FFFFFF"
C_BG_LIGHT = "#F8F9F5"
C_BORDER = "#D9E3CC"
C_AMBER = "#F59E0B"
C_AMBER_BG = "#FFFBEB"
C_AMBER_BORDER = "#FBBF24"
C_RED = "#DC2626"
C_RED_BG = "#FEF2F2"
C_WHITE = "#FFFFFF"
C_LIME = "#CBE842"

def draw_gauge(draw, center_x, center_y, radius, score_val):
    # Draw arc background
    bbox = [center_x - radius, center_y - radius, center_x + radius, center_y + radius]
    # Semicircle from 180 to 0 degrees (counter-clockwise top half)
    draw.arc(bbox, start=180, end=240, fill="#EF4444", width=22) # Red 0.0 - 0.33
    draw.arc(bbox, start=240, end=300, fill="#F59E0B", width=22) # Amber 0.33 - 0.66
    draw.arc(bbox, start=300, end=360, fill="#22C55E", width=22) # Green 0.66 - 1.00
    
    # Draw needle
    # Score 0.0 -> 180 deg, Score 1.0 -> 0 deg (or 360 deg)
    angle_deg = 180 - (score_val * 180)
    angle_rad = math.radians(angle_deg)
    needle_len = radius - 18
    nx = center_x + needle_len * math.cos(angle_rad)
    ny = center_y - needle_len * math.sin(angle_rad)
    draw.line([center_x, center_y, nx, ny], fill="#1F2937", width=5)
    draw.ellipse([center_x - 8, center_y - 8, center_x + 8, center_y + 8], fill="#1F2937")

def generate_ahp_topsis_diagram(out_path):
    W, H = 2400, 1500
    img = Image.new("RGB", (W, H), color="#F4F6F0")
    draw = ImageDraw.Draw(img)

    f_title = get_font(42, bold=True)
    f_sub = get_font(22, bold=False)
    f_col_head = get_font(28, bold=True)
    f_card_title = get_font(21, bold=True)
    f_body = get_font(18, bold=False)
    f_body_bold = get_font(18, bold=True)
    f_code = get_font(17, bold=True)
    f_small = get_font(15, bold=False)
    f_score = get_font(38, bold=True)

    # Top Title Card
    draw.rounded_rectangle([40, 30, W - 40, 115], radius=14, fill=C_DARK_GREEN)
    draw.text((65, 45), "2.3.2.1 AHP-TOPSIS VISIBILITY RANKING ALGORITHM (IPO ARCHITECTURE)", fill=C_WHITE, font=f_title)
    draw.text((65, 88), "Agrivive Multi-Criteria Decision Engine · Input-Process-Output Framework with 6-Hour Lock Rotation", fill=C_LIME, font=f_sub)

    col_y = 135
    col_h = 1320
    c1_w = 690
    c2_w = 820
    c3_w = 690

    # ------------------ COLUMN 1: INPUT ------------------
    c1_x = 40
    draw.rounded_rectangle([c1_x, col_y, c1_x + c1_w, col_y + col_h], radius=16, fill=C_BG_CARD, outline=C_BORDER, width=2)
    # Header bar
    draw.rounded_rectangle([c1_x, col_y, c1_x + c1_w, col_y + 65], radius=16, fill=C_DARK_GREEN)
    draw.rectangle([c1_x, col_y + 35, c1_x + c1_w, col_y + 65], fill=C_DARK_GREEN)
    draw.text((c1_x + c1_w // 2, col_y + 18), "INPUT", fill=C_WHITE, font=f_col_head, anchor="mt")

    draw.text((c1_x + 30, col_y + 85), "Candidate Produce Raw Attributes", fill=C_DARK, font=f_card_title)
    draw.text((c1_x + 30, col_y + 115), "Real-time measurements extracted from PostgreSQL", fill=C_MUTED, font=f_small)

    inputs = [
        ("1. Posting Age (hours)", "Hours elapsed since stall publication.", "x1 = 5.0h (Kalabasa)  |  9.0h (Sigarilyas)", "#059669"),
        ("2. Price Drop (PHP / kg)", "Discount magnitude from seller baseline price.", "x2 = ₱5.00 (Kalabasa)  |  ₱20.00 (Sigarilyas)", "#D97706"),
        ("3. Stock Level (kg)", "Remaining unsold surplus volume at stall.", "x3 = 20.0 kg (Kalabasa)  |  5.0 kg (Sigarilyas)", "#2563EB"),
        ("4. Seller Reliability (★)", "Average verified order service rating (1 to 5).", "x4 = 4.50 ★ (Consistent seller service)", "#7C3AED")
    ]

    card_y = col_y + 150
    for title, desc, sample, col in inputs:
        draw.rounded_rectangle([c1_x + 25, card_y, c1_x + c1_w - 25, card_y + 160], radius=12, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
        # Left accent stripe
        draw.rounded_rectangle([c1_x + 25, card_y, c1_x + 35, card_y + 160], radius=4, fill=col)
        draw.text((c1_x + 50, card_y + 18), title, fill=C_DARK, font=f_card_title)
        draw.text((c1_x + 50, card_y + 55), desc, fill=C_MUTED, font=f_body)
        draw.rounded_rectangle([c1_x + 50, card_y + 92, c1_x + c1_w - 45, card_y + 140], radius=8, fill=C_WHITE, outline=C_BORDER, width=1)
        draw.text((c1_x + 65, card_y + 104), sample, fill=C_DARK, font=f_code)
        card_y += 180

    # System Settings Box in Column 1
    draw.rounded_rectangle([c1_x + 25, card_y + 15, c1_x + c1_w - 25, col_y + col_h - 25], radius=12, fill=C_AMBER_BG, outline=C_AMBER_BORDER, width=2)
    draw.text((c1_x + 45, card_y + 35), "System Reference Grounding", fill=C_DARK, font=f_card_title)
    sys_notes = [
        "• Saaty Scale: 1-9 pairwise priority judgments",
        "• Random Index (RI): 0.90 for n = 4 criteria",
        "• Consistency Threshold: CR <= 0.10 standard",
        "• 6-Hour Cooldown Lock interval per boosted produce",
        "• All metrics fed raw without manual scaling bias"
    ]
    ny = card_y + 75
    for note in sys_notes:
        draw.text((c1_x + 45, ny), note, fill=C_DARK, font=f_body)
        ny += 35

    # Connecting Arrow 1 -> 2
    arr1_x = c1_x + c1_w + 12
    arr1_y = col_y + col_h // 2
    draw.polygon([(arr1_x, arr1_y - 25), (arr1_x + 28, arr1_y), (arr1_x, arr1_y + 25)], fill=C_DARK_GREEN)

    # ------------------ COLUMN 2: PROCESS ------------------
    c2_x = 790
    draw.rounded_rectangle([c2_x, col_y, c2_x + c2_w, col_y + col_h], radius=16, fill=C_BG_CARD, outline=C_BORDER, width=2)
    # Header bar
    draw.rounded_rectangle([c2_x, col_y, c2_x + c2_w, col_y + 65], radius=16, fill=C_NAVY)
    draw.rectangle([c2_x, col_y + 35, c2_x + c2_w, col_y + 65], fill=C_NAVY)
    draw.text((c2_x + c2_w // 2, col_y + 18), "PROCESS", fill=C_WHITE, font=f_col_head, anchor="mt")

    # Step 1: AHP
    s1_y = col_y + 85
    draw.rounded_rectangle([c2_x + 25, s1_y, c2_x + c2_w - 25, s1_y + 245], radius=12, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
    draw.text((c2_x + 45, s1_y + 16), "1. AHP PAIRWISE WEIGHTING & CR VERIFICATION", fill=C_NAVY, font=f_card_title)
    draw.text((c2_x + 45, s1_y + 50), "Saaty 4x4 Pairwise Matrix (A)  ->  Normalize Columns  ->  Row Means:", fill=C_MUTED, font=f_body)
    
    # 4 weight boxes
    w_boxes = [("w1 (Age)", "0.3507 (35.1%)"), ("w2 (Drop)", "0.3507 (35.1%)"), ("w3 (Stock)", "0.1892 (18.9%)"), ("w4 (Trust)", "0.1093 (10.9%)")]
    bx = c2_x + 45
    for w_name, w_val in w_boxes:
        draw.rounded_rectangle([bx, s1_y + 85, bx + 170, s1_y + 145], radius=8, fill=C_WHITE, outline=C_BORDER, width=1)
        draw.text((bx + 15, s1_y + 95), w_name, fill=C_MUTED, font=f_small)
        draw.text((bx + 15, s1_y + 115), w_val, fill=C_DARK, font=f_body_bold)
        bx += 182

    draw.rounded_rectangle([c2_x + 45, s1_y + 165, c2_x + c2_w - 45, s1_y + 225], radius=8, fill="#ECFDF5", outline="#A7F3D0", width=1)
    draw.text((c2_x + 60, s1_y + 178), "Consistency Verification:  lambda_max = 4.0104,  CI = 0.00346", fill="#065F46", font=f_code)
    draw.text((c2_x + 60, s1_y + 200), "Consistency Ratio: CR = CI / 0.90 = 0.0038 <= 0.10  [HIGHLY CONSISTENT]", fill="#047857", font=f_code)

    # Down Arrow
    draw.polygon([(c2_x + c2_w // 2 - 15, s1_y + 255), (c2_x + c2_w // 2 + 15, s1_y + 255), (c2_x + c2_w // 2, s1_y + 280)], fill=C_NAVY)

    # Step 2: TOPSIS Normalization
    s2_y = s1_y + 290
    draw.rounded_rectangle([c2_x + 25, s2_y, c2_x + c2_w - 25, s2_y + 225], radius=12, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
    draw.text((c2_x + 45, s2_y + 16), "2. TOPSIS VECTOR NORMALIZATION & WEIGHTING", fill=C_NAVY, font=f_card_title)
    draw.text((c2_x + 45, s2_y + 48), "Vector Normalization Formula (transforms disparate physical units into 0..1):", fill=C_MUTED, font=f_body)
    draw.rounded_rectangle([c2_x + 45, s2_y + 80, c2_x + c2_w - 45, s2_y + 130], radius=8, fill=C_WHITE, outline=C_BORDER, width=1)
    draw.text((c2_x + 60, s2_y + 95), "r_ij = x_ij / sqrt( Sum_{k=1 to m} x_kj^2 )    and    v_ij = w_j * r_ij", fill=C_DARK, font=f_code)
    draw.text((c2_x + 45, s2_y + 145), "Column Norms: Age=10.4881,  Drop=20.6155,  Stock=54.0833,  Rating=7.7942", fill=C_DARK, font=f_small)
    draw.text((c2_x + 45, s2_y + 175), "Matrix V coordinates established for all candidate alternatives.", fill=C_MUTED, font=f_small)

    # Down Arrow
    draw.polygon([(c2_x + c2_w // 2 - 15, s2_y + 235), (c2_x + c2_w // 2 + 15, s2_y + 235), (c2_x + c2_w // 2, s2_y + 260)], fill=C_NAVY)

    # Step 3: Ideal Solutions
    s3_y = s2_y + 270
    draw.rounded_rectangle([c2_x + 25, s3_y, c2_x + c2_w - 25, s3_y + 245], radius=12, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
    draw.text((c2_x + 45, s3_y + 16), "3. IDEAL SOLUTIONS & SEPARATION DISTANCES", fill=C_NAVY, font=f_card_title)
    draw.text((c2_x + 45, s3_y + 48), "Determine positive ideal (A+) and negative ideal (A-) coordinates:", fill=C_MUTED, font=f_body)
    draw.rounded_rectangle([c2_x + 45, s3_y + 80, c2_x + c2_w - 45, s3_y + 130], radius=8, fill=C_WHITE, outline=C_BORDER, width=1)
    draw.text((c2_x + 60, s3_y + 92), "A+ = [max v_1, max v_2, max v_3, max v_4] = [0.3010, 0.3402, 0.1750, 0.0631]\nA- = [min v_1, min v_2, min v_3, min v_4] = [0.0669, 0.0000, 0.0175, 0.0631]", fill=C_DARK, font=f_code)
    draw.text((c2_x + 45, s3_y + 148), "Compute Euclidean distances from A+ (S_i+) and from A- (S_i-):", fill=C_MUTED, font=f_small)
    draw.text((c2_x + 45, s3_y + 175), "S_i+ = sqrt( Sum (v_ij - v_j+)^2 )       S_i- = sqrt( Sum (v_ij - v_j-)^2 )", fill=C_DARK, font=f_code)
    draw.text((c2_x + 45, s3_y + 205), "Sigarilyas: S+=0.1575, S-=0.4130  |  Kalabasa: S+=0.3066, S-=0.1416", fill=C_DARK, font=f_small)

    # Down Arrow
    draw.polygon([(c2_x + c2_w // 2 - 15, s3_y + 255), (c2_x + c2_w // 2 + 15, s3_y + 255), (c2_x + c2_w // 2, s3_y + 280)], fill=C_NAVY)

    # Step 4: Relative Closeness
    s4_y = s3_y + 290
    draw.rounded_rectangle([c2_x + 25, s4_y, c2_x + c2_w - 25, col_y + col_h - 25], radius=12, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
    draw.text((c2_x + 45, s4_y + 16), "4. RELATIVE CLOSENESS & ORDINAL SORTING", fill=C_NAVY, font=f_card_title)
    draw.rounded_rectangle([c2_x + 45, s4_y + 55, c2_x + c2_w - 45, s4_y + 115], radius=8, fill=C_WHITE, outline=C_BORDER, width=1)
    draw.text((c2_x + 60, s4_y + 75), "C_i = S_i- / ( S_i+ + S_i- )      where 0 <= C_i <= 1", fill=C_DARK, font=f_code)
    draw.text((c2_x + 45, s4_y + 130), "• Sigarilyas: C = 0.4130 / (0.1575 + 0.4130) = 0.7240  ->  Rank 1", fill=C_DARK, font=f_body_bold)
    draw.text((c2_x + 45, s4_y + 160), "• Kalabasa:   C = 0.1416 / (0.3066 + 0.1416) = 0.3159  ->  Rank 2", fill=C_DARK, font=f_body)
    draw.text((c2_x + 45, s4_y + 185), "• Karot:      C = 0.1575 / (0.4130 + 0.1575) = 0.2760  ->  Rank 3", fill=C_DARK, font=f_body)

    # Connecting Arrow 2 -> 3
    arr2_x = c2_x + c2_w + 12
    arr2_y = col_y + col_h // 2
    draw.polygon([(arr2_x, arr2_y - 25), (arr2_x + 28, arr2_y), (arr2_x, arr2_y + 25)], fill=C_NAVY)

    # ------------------ COLUMN 3: OUTPUT ------------------
    c3_x = 1670
    draw.rounded_rectangle([c3_x, col_y, c3_x + c3_w, col_y + col_h], radius=16, fill=C_BG_CARD, outline=C_BORDER, width=2)
    # Header bar
    draw.rounded_rectangle([c3_x, col_y, c3_x + c3_w, col_y + 65], radius=16, fill=C_PURPLE)
    draw.rectangle([c3_x, col_y + 35, c3_x + c3_w, col_y + 65], fill=C_PURPLE)
    draw.text((c3_x + c3_w // 2, col_y + 18), "OUTPUT", fill=C_WHITE, font=f_col_head, anchor="mt")

    # Gauge Card
    draw.text((c3_x + 30, col_y + 85), "Visibility Score Meter (TOPSIS Closeness)", fill=C_DARK, font=f_card_title)
    draw_gauge(draw, c3_x + c3_w // 2, col_y + 245, 120, 0.724)
    draw.text((c3_x + c3_w // 2 - 120, col_y + 255), "0.0", fill=C_MUTED, font=f_small)
    draw.text((c3_x + c3_w // 2, col_y + 155), "0.50", fill=C_MUTED, font=f_small, anchor="mt")
    draw.text((c3_x + c3_w // 2 + 105, col_y + 255), "1.0", fill=C_MUTED, font=f_small)
    draw.text((c3_x + c3_w // 2, col_y + 275), "V_i = 0.7240", fill=C_PURPLE, font=f_score, anchor="mt")

    # Rank & Placement Card
    draw.rounded_rectangle([c3_x + 25, col_y + 340, c3_x + c3_w - 25, col_y + 465], radius=12, fill="#ECFDF5", outline="#10B981", width=2)
    draw.text((c3_x + c3_w // 2, col_y + 360), "ORDINAL RANK: RANK 1", fill="#065F46", font=f_card_title, anchor="mt")
    draw.text((c3_x + c3_w // 2, col_y + 395), "HIGHEST VISIBILITY ON MARKETPLACE FEED", fill="#047857", font=f_body_bold, anchor="mt")
    draw.text((c3_x + c3_w // 2, col_y + 425), "\"Buyers see higher ranks first\"", fill=C_MUTED, font=f_small, anchor="mt")

    # 6-Hour Lock Rule Card
    draw.rounded_rectangle([c3_x + 25, col_y + 490, c3_x + c3_w - 25, col_y + 680], radius=12, fill=C_AMBER_BG, outline=C_AMBER_BORDER, width=2)
    draw.text((c3_x + 45, col_y + 510), "6-Hour Boost Rotation Rule", fill=C_DARK, font=f_card_title)
    draw.text((c3_x + 45, col_y + 545), "• Rank 1 (Sigarilyas) was boosted 2 hours ago:", fill=C_DARK, font=f_body)
    draw.text((c3_x + 65, col_y + 575), "-> Currently LOCKED (4.0h cooldown remaining).", fill=C_RED, font=f_body_bold)
    draw.text((c3_x + 45, col_y + 605), "• Rank 2 (Kalabasa) boosted 8.5h ago (>6h):", fill=C_DARK, font=f_body)
    draw.text((c3_x + 65, col_y + 635), "-> UNLOCKED! Selected for next social boost.", fill="#047857", font=f_body_bold)

    # System Actions Grid
    draw.text((c3_x + 30, col_y + 705), "System Actions (Automated Execution)", fill=C_DARK, font=f_card_title)
    actions = [
        ("Top Placement in Feed", "Displayed in prime screen real estate on buyer web app.", "#1E3A8A"),
        ("Buyer Alerts & Push", "Sent to buyers with favorited sellers or categories.", "#059669"),
        ("n8n Webhook Dispatch", "Pushed to n8n for automated FB/IG campaign post.", "#D97706"),
        ("6-Hour Price Cut Clock", "Countdown started for dynamic price drop interval.", "#7C3AED")
    ]
    ay = col_y + 745
    for atitle, adesc, acol in actions:
        draw.rounded_rectangle([c3_x + 25, ay, c3_x + c3_w - 25, ay + 120], radius=10, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
        draw.rounded_rectangle([c3_x + 25, ay, c3_x + 35, ay + 120], radius=4, fill=acol)
        draw.text((c3_x + 50, ay + 16), atitle, fill=C_DARK, font=f_card_title)
        draw.text((c3_x + 50, ay + 52), adesc, fill=C_MUTED, font=f_small)
        ay += 140

    img.save(out_path, quality=95)
    print("AHP-TOPSIS Diagram Generated:", out_path)


def generate_n8n_diagram(out_path):
    W, H = 2400, 1550
    img = Image.new("RGB", (W, H), color="#F4F6F0")
    draw = ImageDraw.Draw(img)

    f_title = get_font(38, bold=True)
    f_sub = get_font(20, bold=False)
    f_badge = get_font(18, bold=True)
    f_part_head = get_font(22, bold=True)
    f_card_num = get_font(15, bold=True)
    f_card_title = get_font(17, bold=True)
    f_card_sub = get_font(14, bold=False)
    f_card_code = get_font(13, bold=True)
    f_box_title = get_font(20, bold=True)
    f_box_body = get_font(15, bold=False)

    # Top Banner
    draw.rounded_rectangle([40, 30, W - 40, 115], radius=14, fill="#111827")
    draw.text((65, 45), "n8n WORKFLOW - AGRIVIVE SELLER BOOST FLOW", fill=C_WHITE, font=f_title)
    draw.text((65, 88), "Flow: 1st Post to Facebook/IG -> After 6 Hours, Reduce Price by Seller Amount -> Post Flash-Sale", fill=C_LIME, font=f_sub)
    # Right badge
    draw.rounded_rectangle([W - 460, 48, W - 65, 98], radius=8, fill="#1F2937", outline="#374151", width=1)
    draw.text((W - 440, 62), "MODEL: LLaMA3B / GPT-OSS-20B (Groq API)", fill="#60A5FA", font=f_badge)

    card_w = 310
    card_h = 240
    gap = 25
    start_x = 45

    # ------------------ PART 1: FIRST POST ------------------
    p1_y = 135
    draw.rounded_rectangle([40, p1_y, W - 40, p1_y + 45], radius=8, fill=C_DARK_GREEN)
    draw.text((60, p1_y + 12), "PART 1 - FIRST POST (INITIAL BOOST CAMPAIGN)", fill=C_WHITE, font=f_part_head)

    cards_p1 = [
        ("1", "NEW LISTING BOOSTED", "Seller taps Boost or Worker picks top rank.", "Webhook Trigger", "POST /webhook"),
        ("2", "RETRIEVE DATA", "Fetch verified facts from ElysiaJS API.", "ElysiaJS Core API", "GET /context"),
        ("3", "GENERATE CAPTION", "AI writes friendly Facebook announcement.", "Groq Cloud API", "LLaMA3B / 20B"),
        ("4", "FORMAT CONTENT", "Parse JSON & apply fallback template.", "Code (JS) Node", "Format Caption"),
        ("5", "POST TO FACEBOOK", "Publish to Facebook Page & Instagram.", "Meta Graph API", "POST /photos"),
        ("6", "STORE POST RECORD", "Save post_id & permalink in database.", "PostgreSQL DB", "social_posts"),
        ("7", "WAIT 6 HOURS", "Cooldown lock active before price drop.", "Timer / Worker", "6h Cooldown")
    ]

    cx = start_x
    cy = p1_y + 65
    for idx, (num, title, desc, role, tech) in enumerate(cards_p1):
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=12, fill=C_BG_CARD, outline=C_BORDER, width=2)
        # Top pill for step number
        draw.ellipse([cx + 15, cy + 15, cx + 55, cy + 55], fill=C_DARK_GREEN)
        draw.text((cx + 35, cy + 25), num, fill=C_WHITE, font=f_card_num, anchor="mt")
        
        draw.text((cx + 65, cy + 22), title, fill=C_DARK, font=f_card_title)
        draw.text((cx + 15, cy + 70), desc, fill=C_MUTED, font=f_card_sub)
        
        draw.rounded_rectangle([cx + 15, cy + 140, cx + card_w - 15, cy + 180], radius=6, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
        draw.text((cx + 25, cy + 152), role, fill=C_DARK, font=f_card_sub)
        
        draw.rounded_rectangle([cx + 15, cy + 190, cx + card_w - 15, cy + 225], radius=6, fill="#ECFDF5", outline="#A7F3D0", width=1)
        draw.text((cx + 25, cy + 200), tech, fill="#047857", font=f_card_code)

        # Arrow to next card
        if idx < 6:
            arr_x = cx + card_w + 3
            arr_y = cy + card_h // 2
            draw.polygon([(arr_x, arr_y - 10), (arr_x + 18, arr_y), (arr_x, arr_y + 10)], fill=C_DARK_GREEN)

        cx += card_w + gap

    # Connecting loop curve from Step 7 to Step 8
    # Vertical connector on right
    c7_right = start_x + 6 * (card_w + gap) + card_w // 2
    draw.line([c7_right, cy + card_h, c7_right, cy + card_h + 85], fill=C_NAVY, width=4)
    draw.polygon([(c7_right - 10, cy + card_h + 85), (c7_right + 10, cy + card_h + 85), (c7_right, cy + card_h + 105)], fill=C_NAVY)

    # ------------------ PART 2: AFTER 6 HOURS ------------------
    p2_y = cy + card_h + 115
    draw.rounded_rectangle([40, p2_y, W - 40, p2_y + 45], radius=8, fill=C_NAVY)
    draw.text((60, p2_y + 12), "PART 2 - AFTER 6 HOURS (PRICE REDUCTION & FLASH-SALE SECOND POST)", fill=C_WHITE, font=f_part_head)

    cards_p2 = [
        ("8", "GET LATEST DATA", "Fetch updated stock & floor settings.", "ElysiaJS API", "GET /context"),
        ("9", "CALCULATE NEW PRICE", "new_price = max(floor, price - drop).", "Business Logic", "Atomic Price Step"),
        ("10", "UPDATE DATABASE", "Update productPrice in PostgreSQL.", "PostgreSQL DB", "PATCH /price"),
        ("11", "GENERATE FLASH-SALE", "AI writes urgent discount social copy.", "Groq Cloud API", "LLaMA3B / 20B"),
        ("12", "FORMAT FLASH POST", "Format discount % and old/new prices.", "Code (JS) Node", "Format Caption"),
        ("13", "POST TO FACEBOOK", "Publish flash-sale post to Meta.", "Meta Graph API", "POST /photos"),
        ("14", "STORE & NOTIFY", "Save 2nd post log & push alert to seller.", "PostgreSQL + FCM", "Notification Sent")
    ]

    cx = start_x
    cy2 = p2_y + 65
    for idx, (num, title, desc, role, tech) in enumerate(cards_p2):
        draw.rounded_rectangle([cx, cy2, cx + card_w, cy2 + card_h], radius=12, fill=C_BG_CARD, outline=C_BORDER, width=2)
        # Top pill for step number
        draw.ellipse([cx + 15, cy2 + 15, cx + 55, cy2 + 55], fill=C_NAVY)
        draw.text((cx + 35, cy2 + 25), num, fill=C_WHITE, font=f_card_num, anchor="mt")
        
        draw.text((cx + 65, cy2 + 22), title, fill=C_DARK, font=f_card_title)
        draw.text((cx + 15, cy2 + 70), desc, fill=C_MUTED, font=f_card_sub)
        
        draw.rounded_rectangle([cx + 15, cy2 + 140, cx + card_w - 15, cy2 + 180], radius=6, fill=C_BG_LIGHT, outline=C_BORDER, width=1)
        draw.text((cx + 25, cy2 + 152), role, fill=C_DARK, font=f_card_sub)
        
        draw.rounded_rectangle([cx + 15, cy2 + 190, cx + card_w - 15, cy2 + 225], radius=6, fill="#EFF6FF", outline="#BFDBFE", width=1)
        draw.text((cx + 25, cy2 + 200), tech, fill="#1D4ED8", font=f_card_code)

        # Arrow to next card
        if idx < 6:
            arr_x = cx + card_w + 3
            arr_y = cy2 + card_h // 2
            draw.polygon([(arr_x, arr_y - 10), (arr_x + 18, arr_y), (arr_x, arr_y + 10)], fill=C_NAVY)

        cx += card_w + gap

    # ------------------ BOTTOM 4 SUMMARY PANELS ------------------
    b_y = cy2 + card_h + 40
    b_w = 550
    b_h = 320

    panels = [
        ("WORKFLOW SUMMARY", [
            "• New listing triggers initial boost webhook.",
            "• ElysiaJS returns verified produce facts.",
            "• Groq creates engaging, friendly social copy.",
            "• Published to Facebook Page & logged in DB.",
            "• After 6 hours, price drops by seller amount.",
            "• Flash-sale second post published automatically."
        ], "#059669", "#ECFDF5", "#A7F3D0"),

        ("TECHNOLOGY STACK", [
            "• n8n: Workflow automation orchestrator",
            "• ElysiaJS: Bun-powered high-performance API",
            "• Groq API: LLaMA3B ultra-fast LPU inference",
            "• PostgreSQL (Aurora): Relational data storage",
            "• Meta Graph API: Facebook & Instagram posting",
            "• FCM: Android push notification triggers"
        ], "#1D4ED8", "#EFF6FF", "#BFDBFE"),

        ("DATA STORED IN POSTGRESQL", [
            "• Table: social_campaign_posts",
            "• id (UUID PK), product_id (FK), seller_id",
            "• post_type: 'first_post' | 'second_post'",
            "• facebook_post_id, permalink_url",
            "• price, original_price, discount_percent",
            "• status: 'posted' | 'failed', sent_at"
        ], "#D97706", "#FFFBEB", "#FDE68A"),

        ("OPERATIONAL RULES & SAFEGUARDS", [
            "• Price is reduced by seller step (e.g. ₱5 - ₱10).",
            "• Hard Floor Price: price never drops below floor.",
            "• Zero Inventory: if sold out, 2nd post cancelled.",
            "• Anti-Duplicate: idempotent checks prevent spam.",
            "• All times synchronized with VPS server clock.",
            "• Full audit trail preserved for transparency."
        ], "#7C3AED", "#F5F3FF", "#DDD6FE")
    ]

    bx = start_x
    for title, bullets, header_col, bg_col, border_col in panels:
        draw.rounded_rectangle([bx, b_y, bx + b_w, b_y + b_h], radius=12, fill=bg_col, outline=border_col, width=2)
        draw.rounded_rectangle([bx, b_y, bx + b_w, b_y + 45], radius=12, fill=header_col)
        draw.rectangle([bx, b_y + 25, bx + b_w, b_y + 45], fill=header_col)
        draw.text((bx + 20, b_y + 12), title, fill=C_WHITE, font=f_box_title)

        by = b_y + 65
        for bullet in bullets:
            draw.text((bx + 20, by), bullet, fill=C_DARK, font=f_box_body)
            by += 40

        bx += b_w + gap

    img.save(out_path, quality=95)
    print("n8n Workflow Diagram Generated:", out_path)

if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    generate_ahp_topsis_diagram(os.path.join(OUT_DIR, "ahp_topsis_ipo_pipeline.png"))
    generate_n8n_diagram(os.path.join(OUT_DIR, "n8n_seller_flow_pipeline.png"))
