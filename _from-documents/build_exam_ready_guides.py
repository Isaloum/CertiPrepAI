import io
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


PAGE_W, PAGE_H = letter
MARGIN = 0.62 * inch
CONTENT_W = PAGE_W - 2 * MARGIN
TITLE_BLUE = colors.HexColor("#17324d")
ACCENT = colors.HexColor("#f59e0b")
SUBTLE = colors.HexColor("#f3f4f6")
SUBTLE_2 = colors.HexColor("#eef2ff")
SUCCESS_BG = colors.HexColor("#dcfce7")
SUCCESS_BD = colors.HexColor("#16a34a")
WARN_BG = colors.HexColor("#fef3c7")
WARN_BD = colors.HexColor("#d97706")
INFO_BG = colors.HexColor("#dbeafe")
INFO_BD = colors.HexColor("#2563eb")
TEXT = colors.HexColor("#111827")
MUTED = colors.HexColor("#4b5563")


def styles():
    base = ParagraphStyle(
        "base",
        fontName="Helvetica",
        fontSize=9.6,
        leading=12.8,
        textColor=TEXT,
        spaceAfter=0,
    )
    return {
        "title": ParagraphStyle(
            "title",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            alignment=TA_CENTER,
            textColor=TITLE_BLUE,
            spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "subtitle",
            parent=base,
            fontSize=11,
            leading=14,
            alignment=TA_CENTER,
            textColor=MUTED,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=17,
            textColor=TITLE_BLUE,
            spaceBefore=0,
            spaceAfter=6,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=11,
            leading=14,
            textColor=ACCENT,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base,
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "small",
            parent=base,
            fontSize=8.6,
            leading=11,
            textColor=MUTED,
            spaceAfter=4,
        ),
        "table": ParagraphStyle(
            "table",
            parent=base,
            fontSize=8.4,
            leading=10.8,
        ),
        "table_head": ParagraphStyle(
            "table_head",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=10.2,
            textColor=colors.white,
            alignment=TA_CENTER,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=base,
            fontSize=9.2,
            leading=12.2,
        ),
        "callout_bold": ParagraphStyle(
            "callout_bold",
            parent=base,
            fontName="Helvetica-Bold",
            fontSize=9.2,
            leading=12.2,
        ),
    }


STYLES = styles()


def p(text, style="body"):
    return Paragraph(text, STYLES[style])


def spacer(h=0.08 * inch):
    return Spacer(1, h)


def info_box(text, bg=INFO_BG, border=INFO_BD):
    table = Table([[p(text, "callout")]], colWidths=[CONTENT_W])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 1.2, border),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ]
        )
    )
    return table


def table(rows, col_widths, head_bg=TITLE_BLUE, alt=True, font_size=8.4):
    rows = [[Paragraph(str(cell), STYLES["table_head"] if r == 0 else STYLES["table"]) for cell in row] for r, row in enumerate(rows)]
    tbl = Table(rows, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), head_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#cbd5e1")),
    ]
    if alt and len(rows) > 1:
        style_cmds.append(("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SUBTLE]))
    tbl.setStyle(TableStyle(style_cmds))
    return tbl


def bullet_list(items):
    return [
        p(f"• {item}", "body")
        for item in items
    ]


def page_decorator(canvas, doc, title):
    canvas.saveState()
    canvas.setFillColor(colors.white)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setStrokeColor(colors.HexColor("#d1d5db"))
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, PAGE_H - 0.43 * inch, PAGE_W - MARGIN, PAGE_H - 0.43 * inch)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.setFillColor(TITLE_BLUE)
    canvas.drawString(MARGIN, PAGE_H - 0.33 * inch, title)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(PAGE_W - MARGIN, 0.35 * inch, f"{doc.page}")
    canvas.drawString(MARGIN, 0.35 * inch, "SAA-C03 exam reference")
    canvas.restoreState()


def cover_page(title, subtitle, bullets, callout):
    story = [
        Spacer(1, 1.25 * inch),
        p(title, "title"),
        p(subtitle, "subtitle"),
        spacer(0.18 * inch),
        info_box(callout, INFO_BG, INFO_BD),
        spacer(0.2 * inch),
        p("Use this guide to decide, not to memorize slogans. The exam rewards service selection based on constraints, not analogies.", "small"),
    ]
    story.extend([spacer(0.1 * inch)])
    bullet_rows = [[p(f"• {b}", "body")] for b in bullets]
    bullet_tbl = Table(bullet_rows, colWidths=[CONTENT_W])
    bullet_tbl.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 1),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    story.append(bullet_tbl)
    return story


def compute_story():
    story = []
    story += cover_page(
        "AWS Compute",
        "SAA-C03 exam-ready reference",
        [
            "Know the decision rule for EC2 families, pricing, storage, load balancing, Lambda, containers, and Beanstalk.",
            "Prefer the service that matches the workload constraint: latency, cost, durability, scaling, or operational overhead.",
            "Treat the trap boxes as the exam shortcut: they tell you what the wrong answer is trying to exploit.",
        ],
        "Aligned to current AWS terminology. This version removes vague shortcuts and keeps only the rules that stay true on the exam.",
    )
    story.append(PageBreak())

    story += [
        p("1. EC2 Instance Families", "h1"),
        p("Choose the family from the workload shape, then confirm the generation and suffix. The family is usually the real answer on the exam.", "body"),
        table(
            [
                ["Family", "Best fit", "Typical examples", "Exam cue"],
                ["General purpose", "Balanced CPU and memory", "M / T families", "Web apps, app servers, default choice"],
                ["Compute optimized", "High CPU per dollar", "C families", "Batch, HPC, video encoding, CPU-heavy"],
                ["Memory optimized", "Large working set in RAM", "R / X / U families", "In-memory DB, SAP HANA, caching"],
                ["Storage optimized", "Fast local or dense disk", "I / D / H families", "NoSQL, log processing, big I/O"],
                ["Accelerated computing", "GPU, ML, inference", "P / G / Trn / Inf families", "AI/ML, CUDA, graphics, training"],
            ],
            [1.55 * inch, 2.0 * inch, 1.8 * inch, 2.0 * inch],
        ),
        spacer(0.08 * inch),
        info_box(
            "<b>Key nuance:</b> T-family instances are burstable. They accumulate CPU credits while idle and spend them while bursting. If credits run out, CPU drops to baseline. For sustained CPU load, the right answer is usually a non-burstable M or C family.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        table(
            [
                ["Suffix", "Meaning", "Exam use"],
                ["g", "Graviton/ARM", "Better price/performance when the app supports ARM"],
                ["a", "AMD", "Common cost-optimized alternative"],
                ["i", "Intel", "Standard compatibility or specific Intel requirement"],
                ["d", "Instance store", "Local disk attached to the host"],
                ["n", "High network", "Bandwidth-heavy workloads"],
            ],
            [1.0 * inch, 1.55 * inch, 3.45 * inch],
        ),
    ]
    story.append(PageBreak())

    story += [
        p("2. EC2 Pricing Models", "h1"),
        p("Use the commitment level and interruption risk to decide. Savings Plans and Spot are the two words that most often show up in cost questions.", "body"),
        table(
            [
                ["Model", "What you commit to", "Best for", "Interruptible?"],
                ["On-Demand", "Nothing", "Unpredictable or short-lived workloads", "No"],
                ["Savings Plans", "Hourly spend commitment", "Flexible steady usage; Compute SP covers EC2, Fargate, Lambda", "No"],
                ["Reserved Instances", "Specific capacity pattern", "Predictable EC2 usage, older exam wording", "No"],
                ["Spot", "No upfront commitment", "Fault-tolerant, batch, interruption-tolerant jobs", "Yes"],
                ["Dedicated Instances / Hosts", "Physical isolation", "Licensing, compliance, or host-level control", "No"],
                ["Capacity Reservations", "Capacity only", "Need guaranteed capacity in an AZ", "No"],
            ],
            [1.18 * inch, 2.22 * inch, 2.55 * inch, 1.0 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Decision rule:</b> if the question says save money without losing flexibility, start with Savings Plans. If it says spare capacity and interruptions are acceptable, use Spot. If it says you need reserved capacity in a specific AZ, look for Capacity Reservations.",
            INFO_BG,
            INFO_BD,
        ),
        spacer(0.08 * inch),
        p("<b>Exam trap:</b> Reserved Instances are a billing construct, not a capacity guarantee. Capacity Reservations guarantee capacity; Savings Plans lower the cost of usage.", "small"),
    ]
    story.append(PageBreak())

    story += [
        p("3. Storage", "h1"),
        p("The exam usually reduces storage to three choices: local ephemeral disk, block storage, or shared file storage.", "body"),
        table(
            [
                ["Storage", "Durability", "Scope", "Good answer when the question says..."],
                ["Instance Store", "Ephemeral", "Host local", "Need the fastest local scratch disk; data can disappear on stop/terminate"],
                ["EBS", "Persistent block", "Single AZ", "Need boot volume, transactional block storage, or volume snapshots"],
                ["EFS", "Persistent file", "Multi-AZ regional", "Many EC2 instances need the same shared files at once"],
            ],
            [1.2 * inch, 1.0 * inch, 1.15 * inch, 3.2 * inch],
        ),
        spacer(0.06 * inch),
        table(
            [
                ["EBS type", "Use when"],
                ["gp3", "General purpose baseline with tunable performance"],
                ["io2", "Very high IOPS, mission-critical databases"],
                ["st1", "Throughput-heavy, sequential HDD access"],
                ["sc1", "Cold, infrequent access on HDD"],
            ],
            [1.2 * inch, 4.85 * inch],
        ),
        spacer(0.05 * inch),
        info_box(
            "<b>Important fact:</b> EBS volumes live in one Availability Zone and must be attached to an instance in the same AZ. EFS Regional file systems can be mounted from instances in multiple AZs.",
            SUCCESS_BG,
            SUCCESS_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("4. Auto Scaling Groups", "h1"),
        p("Use ASG when the workload must scale horizontally or self-heal. The exam usually wants the policy type or the health-check behavior.", "body"),
        table(
            [
                ["Term", "Meaning", "Exam cue"],
                ["Min", "Lowest desired fleet size", "Always keep at least this many instances"],
                ["Desired", "Current target fleet size", "Actual target count right now"],
                ["Max", "Upper bound", "Never exceed this many instances"],
                ["Target tracking", "Maintain a metric", "Keep CPU around a target percentage"],
                ["Step scaling", "Scale by breach size", "Different alarm sizes, different scale steps"],
                ["Scheduled", "Scale on a timetable", "Predictable traffic peaks"],
                ["Health checks", "Replace bad instances", "Use EC2 and ELB health checks together"],
            ],
            [1.3 * inch, 2.55 * inch, 2.35 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Exam cue:</b> if the workload needs time to initialize, look for launch warm-up / grace period / warm pool language. If the question says the fleet should react to CPU or queue depth automatically, target tracking is usually the best answer.",
            INFO_BG,
            INFO_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("5. Load Balancers", "h1"),
        p("Pick the balancer by layer and by what the exam is telling you to preserve: host/path routing, static IPs, or inline appliance chaining.", "body"),
        table(
            [
                ["Type", "Layer", "Best for", "Key clue"],
                ["ALB", "Layer 7", "HTTP/HTTPS, path or host routing, WAF, microservices", "Rules use host-header, path-pattern, query-string, source-ip"],
                ["NLB", "Layer 4", "TCP/UDP/TLS/QUIC, static IP, extreme performance", "Static IPs, source IP preservation, high throughput"],
                ["GWLB", "Layer 3", "Security appliances and service insertion", "GENEVE on port 6081"],
                ["CLB", "Legacy", "Only if the question is old or says classic", "Usually not the answer"],
            ],
            [0.82 * inch, 0.72 * inch, 2.6 * inch, 2.35 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>ALB rule cue:</b> host-based routing and path-based routing belong to ALB. If the problem is about HTTP request content, ALB is usually the right load balancer. If it is about preserving client IP or handling TCP/UDP, think NLB.",
            SUCCESS_BG,
            SUCCESS_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("6. AMIs and Placement Groups", "h1"),
        p("AMI is the image. Placement groups are about where the instances land. The exam often swaps those two on purpose.", "body"),
        table(
            [
                ["Concept", "What it is", "Important exam fact"],
                ["AMI", "Reusable template for EC2 instances", "Region-specific; copy it to another Region if needed"],
                ["EBS-backed AMI", "Snapshot-backed image", "Can be copied across Regions and accounts"],
                ["Cluster placement", "Close together in one AZ", "Lowest latency, highest throughput, great for HPC"],
                ["Spread placement", "Separate hardware", "Use for a small number of critical instances"],
                ["Partition placement", "Separate racks per partition", "Use for large distributed systems like Hadoop/Cassandra/Kafka"],
            ],
            [1.15 * inch, 2.15 * inch, 3.05 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Placement rule:</b> cluster is for low latency, spread is for fault isolation, partition is for large distributed systems. If the question says 'maximum resilience for a few critical instances,' spread is the answer. If it says 'low-latency node-to-node traffic,' choose cluster.",
            WARN_BG,
            WARN_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("7. Lambda", "h1"),
        p("Lambda is the right answer when you want event-driven compute with no server management and short execution windows.", "body"),
        table(
            [
                ["Fact", "Exam-safe value"],
                ["Memory range", "128 MB to 10,240 MB"],
                ["Timeout", "Up to 15 minutes"],
                ["Ephemeral storage", "512 MB to 10,240 MB in /tmp"],
                ["Scaling", "Automatic per event / request"],
                ["Cold-start mitigation", "Provisioned concurrency"],
                ["Best use", "Event processing, automation, lightweight APIs, scheduled jobs"],
            ],
            [2.0 * inch, 4.5 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Decision rule:</b> if the job is short, stateless, and event driven, Lambda is usually the best answer. If the job needs long runtime, large local scratch space, or you want to keep containers warm, use ECS/Fargate or EC2 instead.",
            INFO_BG,
            INFO_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("8. Containers and Elastic Beanstalk", "h1"),
        p("The exam usually wants you to distinguish orchestrator, infrastructure model, and deployment abstraction.", "body"),
        table(
            [
                ["Service", "What AWS manages", "When to pick it"],
                ["ECS", "Container orchestration", "AWS-native container platform with low operational overhead"],
                ["EKS", "Managed Kubernetes control plane", "You need Kubernetes APIs and ecosystem compatibility"],
                ["Fargate", "No servers or node groups", "Serverless containers for ECS or EKS"],
                ["Elastic Beanstalk", "Deployment orchestration on top of EC2 / ALB / ASG", "You want app deployment without building the platform yourself"],
            ],
            [1.0 * inch, 2.2 * inch, 3.3 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Exam trap:</b> Beanstalk is not the same thing as Lambda, and Fargate is not Kubernetes itself. Fargate is the serverless compute layer for containers. EKS is Kubernetes. ECS is AWS-native orchestration.",
            WARN_BG,
            WARN_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("9. Master Keyword Map", "h1"),
        p("Use this as the fastest translation layer on the exam. Read the clue, then jump straight to the service.", "body"),
        table(
            [
                ["If the question says...", "Think..."],
                ["host-based or path-based HTTP routing", "ALB"],
                ["static IPs, TCP/UDP/TLS, high throughput", "NLB"],
                ["service insertion / firewall appliance", "GWLB"],
                ["shared files across many EC2 instances", "EFS"],
                ["fast local scratch disk", "Instance Store"],
                ["boot volume, snapshots, block storage", "EBS"],
                ["event-driven code with no servers", "Lambda"],
                ["Kubernetes requirement", "EKS"],
                ["AWS-native container orchestration", "ECS"],
                ["simple deploy pipeline for web apps", "Elastic Beanstalk"],
            ],
            [2.95 * inch, 3.55 * inch],
        ),
    ]
    story.append(PageBreak())

    story += [
        p("10. Top Exam Traps", "h1"),
        info_box(
            "<b>T3 trap:</b> T instances are burstable. If the load is sustained, CPU credits run out and performance drops. Pick M or C for steady CPU.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>EBS trap:</b> EBS is AZ-scoped and persistent. It is not the answer when the question asks for multi-AZ shared file access.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>ALB vs NLB trap:</b> ALB is for HTTP/HTTPS routing decisions. NLB is for TCP/UDP/TLS and static IP needs.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Placement trap:</b> Cluster gives low latency, not high availability. Spread gives failure isolation, not high fan-out density.",
            WARN_BG,
            WARN_BD,
        ),
    ]
    return story


def iam_story():
    story = []
    story += cover_page(
        "AWS IAM",
        "SAA-C03 exam-ready reference",
        [
            "The exam is mostly about evaluation order: identity policy, resource policy, permissions boundary, session policy, SCP, and explicit deny.",
            "Use the right identity model: user, group, role, root, or federated identity.",
            "Most wrong answers exploit one mistake: confusing a ceiling with a grant.",
        ],
        "This version removes the fuzzy parts and keeps the evaluation rules that matter in exam questions.",
    )
    story.append(PageBreak())

    story += [
        p("1. IAM Fundamentals", "h1"),
        p("IAM is about identities and policies. Users, groups, roles, and root solve different problems.", "body"),
        table(
            [
                ["Identity", "What it is", "Credentials", "Exam cue"],
                ["IAM user", "Long-term human or application identity", "Access keys or password", "Use sparingly; best for named users only"],
                ["IAM group", "Collection of users", "None", "Used to share policies across users"],
                ["IAM role", "Temporary identity assumed by a trusted principal", "Temporary STS credentials", "Best for AWS services and cross-account access"],
                ["Root user", "Account owner", "Email/password plus MFA", "Never for daily work"],
            ],
            [1.15 * inch, 2.4 * inch, 1.7 * inch, 2.0 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Core rule:</b> only identity-based policies and resource-based policies can grant permissions. Boundaries, SCPs, and session policies only set ceilings. For same-account access, a resource-based policy can be enough on its own; for cross-account access, the trust and identity sides both matter.",
            SUCCESS_BG,
            SUCCESS_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("2. Policy Evaluation Logic", "h1"),
        p("This is the page that wins or loses the exam. Keep the sequence in your head and ignore the noise.", "body"),
        table(
            [
                ["Step", "Question AWS asks", "Result if the answer is no"],
                ["1", "Did the request authenticate?", "Deny"],
                ["2", "Is there an explicit Deny anywhere?", "Deny immediately"],
                ["3", "Do the applicable grant policies allow it?", "Implicit deny"],
                ["4", "Do ceilings also allow it? (boundary, session policy, SCP)", "Deny if any ceiling blocks it"],
                ["5", "If cross-account or resource policy is involved, does the resource policy allow it?", "Deny"],
                ["6", "Does a same-account resource policy grant it directly?", "Allow if the resource policy is sufficient"],
            ],
            [0.5 * inch, 3.95 * inch, 1.75 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Remember:</b> explicit deny always wins. Default state is deny. An allow only matters if no higher-level guardrail blocks it.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Nuance that shows up on harder questions:</b> resource-based policies can grant access directly for same-account access. For cross-account access, the resource policy and the caller's identity side both matter. The safest exam shortcut is still to check explicit deny first, then check every applicable ceiling.",
            INFO_BG,
            INFO_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("3. Policy Conditions and Permission Boundaries", "h1"),
        p("Conditions are filters. Permission boundaries are ceilings. Neither one is a grant by itself.", "body"),
        table(
            [
                ["Condition key", "Typical use"],
                ["aws:SourceIp", "Allow or deny based on client IP"],
                ["aws:RequestedRegion", "Limit actions to a Region"],
                ["aws:MultiFactorAuthPresent", "Require MFA"],
                ["aws:PrincipalTag / aws:ResourceTag", "ABAC with tags"],
                ["s3:prefix", "Scope S3 access to a prefix"],
            ],
            [2.25 * inch, 4.45 * inch],
        ),
        spacer(0.06 * inch),
        table(
            [
                ["Boundary fact", "Exam-safe wording"],
                ["What it does", "Sets the maximum permissions an IAM user or role can have"],
                ["What it does not do", "It does not grant permissions by itself"],
                ["Effective result", "Identity policy AND boundary"],
                ["Best clue", "The question says 'prevent privilege escalation' or 'delegate policy management safely'"],
            ],
            [2.25 * inch, 4.45 * inch],
        ),
    ]
    story.append(PageBreak())

    story += [
        p("4. SCPs and Session Policies", "h1"),
        p("Both are ceilings. SCPs are organizational guardrails. Session policies are temporary per-session guardrails.", "body"),
        table(
            [
                ["Policy type", "Where it applies", "What it does", "What it does not do"],
                ["SCP", "AWS Organizations root / OU / account", "Sets the maximum permissions for member accounts", "Does not grant permissions"],
                ["Session policy", "One STS session", "Scopes down a temporary session", "Does not modify the role"],
            ],
            [0.95 * inch, 1.9 * inch, 2.25 * inch, 1.65 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>SCP fact:</b> SCPs do not affect the management account. They do affect member accounts, including the member account root user. Service-linked roles are also exempt.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Session policy fact:</b> a session policy is passed when assuming a role or creating a federated session. The effective permissions are the intersection of the role permissions and the session policy.",
            SUCCESS_BG,
            SUCCESS_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("5. STS and Federation", "h1"),
        p("STS issues temporary credentials. Federation answers the question 'how did the user get there in the first place?'", "body"),
        table(
            [
                ["Mechanism", "Best use", "Exam cue"],
                ["AssumeRole", "Temporary access to another role", "Cross-account access, service access, or temporary elevation"],
                ["AssumeRoleWithSAML", "Workforce SSO from an enterprise IdP", "SAML 2.0 / AD FS / corporate directory"],
                ["AssumeRoleWithWebIdentity", "Web or mobile app identity federation", "Cognito or other OpenID Connect identity provider"],
                ["GetSessionToken", "Temporary session for IAM user", "Less common; user needs temporary credentials"],
                ["GetCallerIdentity", "Identify the caller", "Troubleshooting; does not grant access"],
            ],
            [1.45 * inch, 2.85 * inch, 1.95 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Federation shortcut:</b> Identity Center is the modern central workforce SSO answer across multiple AWS accounts. If the question explicitly describes direct federation from an external IdP, use SAML 2.0 for workforce users or web identity for apps and social identity providers.",
            INFO_BG,
            INFO_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("6. Credential Types and Roles for Services", "h1"),
        p("The exam likes to ask which credential type belongs to which scenario, and whether a service should use a role instead of hardcoded keys.", "body"),
        table(
            [
                ["Credential type", "When to use it"],
                ["Long-term access key", "Only when you must support an IAM user and cannot use a role"],
                ["Temporary role credentials", "Best default for AWS services and cross-account access"],
                ["Root credentials", "Initial setup, billing, or emergency recovery only"],
                ["MFA", "Always a good answer when the question mentions human sign-in security"],
            ],
            [2.0 * inch, 4.7 * inch],
        ),
        spacer(0.06 * inch),
        table(
            [
                ["Service pattern", "Correct AWS identity choice"],
                ["EC2 needs to reach S3", "IAM role via instance profile"],
                ["Lambda needs to call DynamoDB", "Execution role"],
                ["ECS task needs to call Secrets Manager", "Task role"],
                ["AWS service needs to act on your behalf", "Role, not an IAM user"],
            ],
            [2.0 * inch, 4.7 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Exam trap:</b> do not use hardcoded access keys for an AWS service. If the question says 'an EC2 instance needs access', the correct answer is almost always an IAM role attached to the instance profile.",
            WARN_BG,
            WARN_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("7. Access Analyzer, Policy Simulator, and CloudTrail", "h1"),
        p("These three services answer different questions: what is exposed, what would happen, and what actually happened.", "body"),
        table(
            [
                ["Service", "Best question it answers", "Exam cue"],
                ["IAM Access Analyzer", "Is this resource exposed outside my trust zone?", "Findings for external access and unused access"],
                ["Policy Simulator", "Will this policy combination allow the request?", "Test before deployment"],
                ["CloudTrail", "What action actually occurred?", "Audit and investigation"],
            ],
            [1.45 * inch, 3.0 * inch, 2.25 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Access Analyzer fact:</b> it can generate a least-privilege policy from CloudTrail activity. It is not a logger; CloudTrail is the logger.",
            SUCCESS_BG,
            SUCCESS_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("8. Identity Center", "h1"),
        p("Identity Center is the modern answer for workforce SSO across many AWS accounts and apps.", "body"),
        table(
            [
                ["Component", "Meaning"],
                ["Identity source", "Where users come from: built-in directory, AD, or an external IdP"],
                ["Permission set", "Reusable access template such as ReadOnly or AdminAccess"],
                ["AWS account assignment", "Which account and permission set a user receives"],
            ],
            [1.75 * inch, 4.95 * inch],
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Exam cue:</b> if the problem says one login for multiple AWS accounts and a central permission model, the answer is Identity Center. If it describes direct federation from an external IdP, use SAML 2.0 or web identity, depending on whether the users are workforce users or app users.",
            INFO_BG,
            INFO_BD,
        ),
    ]
    story.append(PageBreak())

    story += [
        p("9. Master Keyword Map", "h1"),
        table(
            [
                ["If the question says...", "Think..."],
                ["maximum permissions for a role or user", "Permissions boundary"],
                ["organizational guardrail across accounts", "SCP"],
                ["temporary session-only reduction", "Session policy"],
                ["enterprise SSO into AWS", "Identity Center or SAML"],
                ["web/mobile login from an app", "AssumeRoleWithWebIdentity / Cognito"],
                ["need to verify what happened", "CloudTrail"],
                ["need to test a permission before using it", "Policy Simulator"],
                ["need to see external sharing risk", "Access Analyzer"],
            ],
            [2.8 * inch, 3.7 * inch],
        ),
    ]
    story.append(PageBreak())

    story += [
        p("10. Top Exam Traps and Quick Reference", "h1"),
        info_box(
            "<b>Trap 1:</b> a permissions boundary does not grant permissions. It only caps what the identity policy can grant.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Trap 2:</b> an SCP does not grant permissions. It sets the maximum for member accounts in the organization.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Trap 3:</b> a session policy is temporary and session-specific. It does not permanently modify the role.",
            WARN_BG,
            WARN_BD,
        ),
        spacer(0.06 * inch),
        info_box(
            "<b>Trap 4:</b> explicit deny wins. If you remember only one rule, remember this one.",
            SUCCESS_BG,
            SUCCESS_BD,
        ),
        spacer(0.08 * inch),
        table(
            [
                ["Quick formula", "Use this"],
                ["Single policy decision", "Deny by default, allow only if explicitly allowed"],
                ["With boundary", "Identity policy AND boundary"],
                ["With session policy", "Role permissions AND session policy"],
                ["With SCP", "Identity policy AND SCP must both allow"],
            ],
            [2.15 * inch, 4.55 * inch],
        ),
    ]
    return story


def build_pdf(path, title, story):
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.7 * inch,
        bottomMargin=0.6 * inch,
        title=title,
        author="OpenAI Codex",
    )

    def first(canvas, doc_):
        page_decorator(canvas, doc_, title)

    def later(canvas, doc_):
        page_decorator(canvas, doc_, title)

    doc.build(story, onFirstPage=first, onLaterPages=later)


def main():
    base = Path("/Users/ihabsaloum/Desktop/Projects/CertiPrepAI/docs")
    build_pdf(
        base / "AWS_Compute_Cheatsheet_SAA-C03.pdf",
        "AWS Compute - SAA-C03 exam reference",
        compute_story(),
    )
    build_pdf(
        base / "AWS_IAM_Study_Guide_SAA-C03_v2.pdf",
        "AWS IAM - SAA-C03 exam reference",
        iam_story(),
    )
    print("Done")


if __name__ == "__main__":
    main()
