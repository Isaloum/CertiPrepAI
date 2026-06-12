"""
Build AWS_IAM_Study_Guide_SAA-C03_v2.pdf
Creates 3 new pages (A, B, C) matching existing styling, then merges with original.
"""
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.platypus.flowables import Flowable
from pypdf import PdfReader, PdfWriter

# ── Colours ───────────────────────────────────────────────────────────────────
NAVY        = colors.HexColor('#1e2a3a')
ORANGE      = colors.HexColor('#f59e0b')
BLUE_HDR    = colors.HexColor('#2563eb')
YELLOW_BG   = colors.HexColor('#fef9c3')
YELLOW_BDR  = colors.HexColor('#ca8a04')
GREEN_BG    = colors.HexColor('#dcfce7')
GREEN_BDR   = colors.HexColor('#16a34a')
GREY_BG     = colors.HexColor('#f3f4f6')
GREY_BDR    = colors.HexColor('#9ca3af')
WHITE       = colors.white
LIGHT_ROW   = colors.HexColor('#f0f4ff')
TEXT_DARK   = colors.HexColor('#1e293b')

PAGE_W, PAGE_H = letter   # 612 x 792 pt
MARGIN = 0.65 * inch
CONTENT_W = PAGE_W - 2 * MARGIN

# ── Styles ────────────────────────────────────────────────────────────────────
def make_styles():
    base = ParagraphStyle('base', fontName='Helvetica', fontSize=10,
                          leading=14, textColor=TEXT_DARK)
    return {
        'intro': ParagraphStyle('intro', parent=base, fontName='Helvetica-Oblique',
                                fontSize=10, leading=15, leftIndent=6, rightIndent=6,
                                textColor=colors.HexColor('#374151')),
        'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=12,
                                  leading=16, textColor=ORANGE, spaceAfter=4),
        'body': base,
        'bullet': ParagraphStyle('bullet', parent=base, leftIndent=14,
                                 bulletIndent=4, spaceAfter=3),
        'code': ParagraphStyle('code', fontName='Courier-Bold', fontSize=10,
                               leading=14, textColor=colors.HexColor('#1e293b')),
        'trap': ParagraphStyle('trap', fontName='Helvetica-Bold', fontSize=9.5,
                               leading=14, textColor=colors.HexColor('#92400e')),
        'rule': ParagraphStyle('rule', fontName='Helvetica-Bold', fontSize=9.5,
                               leading=14, textColor=colors.HexColor('#14532d')),
    }

# ── Custom Flowables ──────────────────────────────────────────────────────────
class NavyHeader(Flowable):
    """Full-width dark navy page header with white text."""
    def __init__(self, text, width=CONTENT_W):
        super().__init__()
        self.text = text
        self.width = width
        self.height = 38

    def draw(self):
        c = self.canv
        c.setFillColor(NAVY)
        c.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 15)
        c.drawString(14, 11, self.text)

    def wrap(self, *args):
        return self.width, self.height


class ColoredBox(Flowable):
    """Coloured rounded box for EXAM TRAP / KEY RULE."""
    def __init__(self, text, bg_color, border_color, style, width=CONTENT_W):
        super().__init__()
        self.text = text
        self.bg_color = bg_color
        self.border_color = border_color
        self.style = style
        self.width = width
        self._padding = 10

    def wrap(self, avail_w, avail_h):
        from reportlab.platypus import Paragraph
        inner_w = self.width - 2 * self._padding
        p = Paragraph(self.text, self.style)
        _, text_h = p.wrap(inner_w, avail_h)
        self._text_h = text_h
        self.height = text_h + 2 * self._padding
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.setFillColor(self.bg_color)
        c.setStrokeColor(self.border_color)
        c.setLineWidth(1.5)
        c.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=1)
        # draw text inside
        from reportlab.platypus import Paragraph
        p = Paragraph(self.text, self.style)
        p.wrap(self.width - 2 * self._padding, self.height)
        p.drawOn(c, self._padding, self._padding)


# ── Table helpers ─────────────────────────────────────────────────────────────
def make_table(header_row, data_rows, col_widths):
    all_rows = [header_row] + data_rows
    t = Table(all_rows, colWidths=col_widths)
    style = TableStyle([
        # Header
        ('BACKGROUND', (0, 0), (-1, 0), BLUE_HDR),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 7),
        ('TOPPADDING', (0, 0), (-1, 0), 7),
        # Body rows — alternating
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9.5),
        ('TOPPADDING', (0, 1), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_ROW]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ])
    t.setStyle(style)
    return t


def p(text, style):
    return Paragraph(text, style)


# ── PAGE A: Service Control Policies (SCPs) ───────────────────────────────────
def build_page_a(styles):
    story = []
    SP = Spacer

    story.append(NavyHeader("5. Service Control Policies (SCPs)"))
    story.append(SP(1, 10))

    story.append(p(
        "<i>The Organization Firewall: SCP = building-wide security rules that apply to every "
        "floor, every room, every person. Even the building manager.</i>",
        styles['intro']
    ))
    story.append(SP(1, 10))

    # Key Facts
    story.append(p("Key Facts", styles['section']))
    kf_data = [
        ["Set by", "Org Admin (AWS Organizations)"],
        ["Applies to", "All member accounts"],
        ["Affects management account?", "NO — exempt from all SCPs"],
        ["Grants permissions?", "NO — ceiling only"],
        ["Overridable by account admin?", "NO — not even root"],
    ]
    story.append(make_table(
        ["Attribute", "Value"],
        kf_data,
        [CONTENT_W * 0.45, CONTENT_W * 0.55]
    ))
    story.append(SP(1, 12))

    # SCP vs IAM Policy
    story.append(p("SCP vs IAM Policy — Critical Distinction", styles['section']))
    cmp_data = [
        ["Normal access",  "Allow s3:*",  "Allow s3:*",  "ALLOWED"],
        ["SCP blocks",     "Deny s3:*",   "Allow s3:*",  "DENIED"],
        ["No IAM policy",  "Allow s3:*",  "None",        "DENIED (implicit deny)"],
    ]
    story.append(make_table(
        ["Scenario", "SCP", "IAM Policy", "Result"],
        cmp_data,
        [CONTENT_W * 0.28, CONTENT_W * 0.22, CONTENT_W * 0.25, CONTENT_W * 0.25]
    ))
    story.append(SP(1, 12))

    # Management Account Exemption
    story.append(p("Management Account Exemption", styles['section']))
    story.append(p(
        "SCPs apply to MEMBER accounts only. The root management account of the AWS Organization "
        "is completely exempt — SCPs never restrict it. This is a critical exam trap.",
        styles['body']
    ))
    story.append(SP(1, 12))

    # EXAM TRAP
    story.append(ColoredBox(
        "<b>EXAM TRAP:</b> 'Even root can’t do it' = SCP applied to member accounts. "
        "But the management account root is ALWAYS exempt from SCPs. SCPs also never GRANT "
        "permissions — even Allow in an SCP does nothing without a matching IAM Policy.",
        YELLOW_BG, YELLOW_BDR, styles['trap']
    ))

    return story


# ── PAGE B: Session Policies ──────────────────────────────────────────────────
def build_page_b(styles):
    story = []
    SP = Spacer

    story.append(NavyHeader("Session Policies"))
    story.append(SP(1, 10))

    story.append(p(
        "<i>The Day Pass Analogy: You have full building access (your role). For today’s "
        "contractor visit, you issue a day pass restricted to floor 3 only. Tomorrow, the "
        "contractor is back to normal. The building hasn’t changed — just today’s access.</i>",
        styles['intro']
    ))
    story.append(SP(1, 10))

    # What It Is
    story.append(p("What It Is", styles['section']))
    story.append(p(
        "A policy you pass inline when calling <b>AssumeRole</b> or <b>GetSessionToken</b>. "
        "It restricts that ONE session only. The role itself is never modified.",
        styles['body']
    ))
    story.append(SP(1, 8))

    # Code box
    story.append(ColoredBox(
        "Effective Session Permissions = Role Permissions AND Session Policy",
        GREY_BG, GREY_BDR, styles['code']
    ))
    story.append(SP(1, 12))

    # 3 Worked Examples
    story.append(p("3 Worked Examples", styles['section']))
    ex_data = [
        ["s3:*",       "s3:GetObject",  "s3:GetObject only"],
        ["ec2:*",      "s3:*",          "NOTHING — no overlap"],
        ["s3:* ec2:*", "s3:*",          "s3:* only"],
    ]
    story.append(make_table(
        ["Role Allows", "Session Policy Allows", "Effective Permissions"],
        ex_data,
        [CONTENT_W * 0.28, CONTENT_W * 0.35, CONTENT_W * 0.37]
    ))
    story.append(SP(1, 12))

    # Exam Trigger Phrases
    story.append(p("Exam Trigger Phrases", styles['section']))
    bullets = [
        "restrict one specific session",
        "temporary scoped-down access",
        "least privilege for a specific task",
        "without changing the role permanently",
        "one-time restriction",
    ]
    for b in bullets:
        story.append(p(f"• {b}", styles['bullet']))
    story.append(SP(1, 12))

    # EXAM TRAP
    story.append(ColoredBox(
        "<b>EXAM TRAP:</b> Session Policy can only RESTRICT — it can never grant MORE than the "
        "role already allows. If the role doesn’t have ec2:*, a session policy saying Allow "
        "ec2:* gives nothing.",
        YELLOW_BG, YELLOW_BDR, styles['trap']
    ))

    return story


# ── PAGE C: Identity Center (SSO) ────────────────────────────────────────────
def build_page_c(styles):
    story = []
    SP = Spacer

    story.append(NavyHeader("Identity Center (SSO)"))
    story.append(SP(1, 10))

    story.append(p(
        "<i>The Master Key Card Analogy: Instead of carrying 20 separate key cards for 20 "
        "buildings, you get one master card that works everywhere based on your job role. "
        "One login. All accounts.</i>",
        styles['intro']
    ))
    story.append(SP(1, 10))

    # What It Replaces
    story.append(p("What It Replaces", styles['section']))
    story.append(p(
        "Multiple IAM users created manually across multiple AWS accounts. With Identity Center, "
        "one user identity gets access to all assigned accounts with appropriate permission sets.",
        styles['body']
    ))
    story.append(SP(1, 12))

    # 3 Key Components
    story.append(p("3 Key Components", styles['section']))
    comp_data = [
        ["Identity Source",  "Where users come from",          "Active Directory, Okta, built-in directory"],
        ["Permission Sets",  "What access level the user gets", "ReadOnly, AdminAccess, DeveloperAccess"],
        ["AWS Accounts",     "Which accounts the user can access", "Dev, Staging, Production accounts"],
    ]
    story.append(make_table(
        ["Component", "What It Is", "Example"],
        comp_data,
        [CONTENT_W * 0.25, CONTENT_W * 0.38, CONTENT_W * 0.37]
    ))
    story.append(SP(1, 12))

    # Identity Center vs SAML
    story.append(p("Identity Center vs SAML — Know the Difference", styles['section']))
    saml_data = [
        ["Use case",  "Corporate SSO into ONE account",  "SSO across MULTIPLE AWS accounts"],
        ["Scale",     "Single account federation",        "Entire AWS Organization"],
        ["Setup",     "IAM Identity Provider",            "AWS Identity Center service"],
        ["Keyword",   "Active Directory + one account",   "multiple accounts + single login"],
    ]
    story.append(make_table(
        ["—", "SAML 2.0 (AD FS)", "Identity Center"],
        saml_data,
        [CONTENT_W * 0.20, CONTENT_W * 0.40, CONTENT_W * 0.40]
    ))
    story.append(SP(1, 12))

    # KEY RULE
    story.append(ColoredBox(
        "<b>KEY RULE:</b> If the exam says ‘single sign-on across multiple AWS accounts’ "
        "→ Identity Center. If it says ‘corporate Active Directory + one AWS account’ "
        "→ SAML 2.0.",
        GREEN_BG, GREEN_BDR, styles['rule']
    ))
    story.append(SP(1, 10))

    # EXAM TRAP
    story.append(ColoredBox(
        "<b>EXAM TRAP:</b> Identity Center is the MODERN replacement for creating IAM users in "
        "every account. If a question mentions managing access across 10+ AWS accounts centrally "
        "→ Identity Center, not individual IAM users.",
        YELLOW_BG, YELLOW_BDR, styles['trap']
    ))

    return story


# ── Render a story to in-memory PDF bytes ────────────────────────────────────
def story_to_pdf_bytes(story):
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=MARGIN,
        bottomMargin=MARGIN,
    )
    doc.build(story)
    buf.seek(0)
    return buf.read()


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    src = '/Users/ihabsaloum/Documents/CertiPrepAI/AWS_IAM_Study_Guide_SAA-C03.pdf'
    dst = '/Users/ihabsaloum/Documents/CertiPrepAI/AWS_IAM_Study_Guide_SAA-C03_v2.pdf'

    styles = make_styles()

    print("Building Page A (SCPs)...")
    bytes_a = story_to_pdf_bytes(build_page_a(styles))

    print("Building Page B (Session Policies)...")
    bytes_b = story_to_pdf_bytes(build_page_b(styles))

    print("Building Page C (Identity Center)...")
    bytes_c = story_to_pdf_bytes(build_page_c(styles))

    print("Merging with original...")
    orig = PdfReader(src)
    rdr_a = PdfReader(io.BytesIO(bytes_a))
    rdr_b = PdfReader(io.BytesIO(bytes_b))
    rdr_c = PdfReader(io.BytesIO(bytes_c))

    writer = PdfWriter()

    # Original pages 1-5 (indices 0-4)
    for i in range(5):
        writer.add_page(orig.pages[i])

    # Page A: SCPs
    writer.add_page(rdr_a.pages[0])

    # Original pages 6-8 (indices 5-7)
    for i in range(5, 8):
        writer.add_page(orig.pages[i])

    # Page B: Session Policies
    writer.add_page(rdr_b.pages[0])

    # Original pages 9-13 (indices 8-12)
    for i in range(8, 13):
        writer.add_page(orig.pages[i])

    # Page C: Identity Center
    writer.add_page(rdr_c.pages[0])

    with open(dst, 'wb') as f:
        writer.write(f)

    total = len(writer.pages)
    print(f"Done! Saved to: {dst}")
    print(f"Total pages: {total} (original 13 + 3 new = 16 expected)")


if __name__ == '__main__':
    main()
