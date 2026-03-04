# Domain Knowledge Brief — Healthcare Compliance & Risk SaaS (Multi-Tenant GRC Platform)

## Sub-Domain Classification

Multi-tenant healthcare governance, risk, and compliance (GRC) SaaS platform serving three distinct user personas simultaneously:
1. **Physician practices** (independent groups, 3-50 providers, primary compliance consumers)
2. **Insurers / health plans** (payers monitoring network provider compliance posture)
3. **Private equity groups / MSOs** (portfolio-level oversight across multiple acquired practices)

This is NOT a clinical EMR or billing system. It is a **compliance operations platform** — analogous to a healthcare-specific Navex One, Healthicity Compliance Manager, or symplr Compliance — that automates evidence collection, scoring, and incident tracking across the OIG's seven program elements.

---

## Job Analyst Vocabulary — Confirmed and Extended

The following vocabulary is validated against industry-standard usage in healthcare compliance operations as of 2025-2026.

### Confirmed Primary Entity Names

These are the exact terms that must appear as UI labels — sidebar nav, table column headers, KPI card titles, status badges, filter dropdowns, and search placeholders.

- **Primary record type**: "Organization" (not "client", not "account") — for practices, insurers, PE portfolios. Each org is a tenant.
- **Sub-record under org**: "Practice" (individual physician group within an insurer's or PE group's network)
- **Assessment record**: "Risk Assessment" (not "audit", not "review") — the structured intake evaluation
- **Score object**: "Compliance Score" or "Domain Score" — numerical 0-100 scale, not letter grades
- **Person (provider)**: "Provider" (not "doctor") — covers MDs, DOs, NPs, PAs
- **Person (staff)**: "Clinician" for clinical roles; "Compliance Officer" for admin roles
- **Event record**: "Compliance Event" or "Reported Incident" — what gets logged in the audit trail
- **Document record**: "Supporting Document" or "Compliance Record" — uploaded evidence files
- **Screening record**: "Exclusion Check" — OIG/LEIE/SAM database screening result
- **Workflow object**: "Corrective Action Plan" (CAP) — the remediation workflow triggered after a finding
- **Policy object**: "Policy & Procedure" (P&P) — the documents that define the compliance program
- **Training record**: "Training Completion" — staff training attestation records

### Expanded KPI Vocabulary

These are the exact metric names this platform would surface on its dashboard. Used verbatim as KPI card titles and chart axis labels.

| KPI Name | What It Measures | Typical Format |
|---|---|---|
| Overall Compliance Score | Weighted aggregate of all domain scores for an org | 0-100 integer (e.g., 74) |
| Open Findings | Count of unresolved compliance gaps identified in assessments | Count (integer) |
| Overdue CAPss | Corrective Action Plans past their target resolution date | Count (integer) |
| Exclusion Checks Due | Providers needing monthly OIG/LEIE/SAM re-screening | Count (integer) |
| Policy Attestation Rate | % of staff who have acknowledged current P&P documents | % (e.g., 87%) |
| Training Completion Rate | % of required training modules completed by assigned staff | % (e.g., 72%) |
| High-Risk Practices | Count of practices with Overall Compliance Score below 60 | Count (integer) |
| Incidents Reported (30d) | Compliance events logged in the last 30 days | Count (integer) |
| Average Days to Resolution | Mean time from finding creation to CAP closure | Days (e.g., 18d) |
| Documents Expiring (90d) | Credentials, licenses, or policies expiring within 90 days | Count (integer) |
| OIG Exclusion Hits | Providers flagged as excluded from federal health programs | Count (integer) — critical |
| Assessment Completion Rate | % of required annual risk assessments submitted on time | % (e.g., 63%) |

### Status Label Vocabulary

Exact status strings used across the platform. These go directly into badge components, filter dropdowns, and table columns.

**Assessment/Finding Statuses:**
- Active states: `In Progress`, `Pending Review`, `Awaiting Documentation`
- Problem states: `Overdue`, `Escalated`, `Requires Corrective Action`
- Terminal states: `Completed`, `Closed`, `Waived`

**Corrective Action Plan (CAP) Statuses:**
- `Open` — created, assigned, not yet started
- `In Remediation` — owner is actively working the plan
- `Pending Verification` — remediation complete, awaiting compliance officer sign-off
- `Verified` — compliance officer confirmed resolution
- `Overdue` — past target date, not yet resolved
- `Escalated` — flagged for executive or external review

**Provider/Credential Statuses:**
- `Active` — credentialed, screened, in good standing
- `Pending Enrollment` — awaiting payer credentialing approval
- `Expired` — license or credential past expiration date
- `Excluded` — flagged on OIG LEIE or SAM.gov — critical status
- `Suspended` — temporarily inactive, under investigation
- `Re-attestation Required` — CAQH attestation window has lapsed (every 120 days)

**Document Statuses:**
- `Current` — uploaded, verified, within validity period
- `Expiring Soon` — expires within 90 days
- `Expired` — past expiration date
- `Missing` — required document not yet uploaded
- `Under Review` — submitted, pending compliance officer validation

**Exclusion Check Statuses:**
- `Cleared` — no matches on OIG LEIE, SAM.gov, or state Medicaid exclusion lists
- `Hit — Review Required` — potential match found, requires manual investigation
- `Excluded` — confirmed exclusion — requires immediate action
- `Screening Overdue` — not screened within the required monthly interval

### Workflow and Action Vocabulary

These become button labels, action menu items, dropdown options, and empty-state messages.

**Primary Actions:**
- `Run Exclusion Screen` — trigger OIG/LEIE/SAM check for a provider
- `Initiate Assessment` — start a new compliance risk assessment for an org
- `Create CAP` — open a Corrective Action Plan for a finding
- `Attest` — staff member acknowledges a P&P document
- `Upload Document` — add a supporting compliance record
- `Assign Finding` — route a finding to a responsible person
- `Submit for Review` — send a completed assessment to compliance officer

**Secondary Actions:**
- `Escalate` — raise a finding or CAP to senior oversight
- `Waive Finding` — mark a finding as N/A with documented rationale
- `Extend Deadline` — push a CAP target date with reason
- `Export Report` — generate PDF or CSV of assessment results
- `Archive` — move closed records out of active view
- `Request Evidence` — prompt a practice to upload a missing document
- `Delegate` — reassign a task to another team member

### Sidebar Navigation Candidates

Domain-appropriate navigation labels for the dashboard-app format. These replace generic labels.

- **Compliance Dashboard** (overview: aggregate scores, alerts, at-a-glance portfolio view)
- **Risk Assessments** (list of assessments: initiated, in-progress, completed)
- **Findings & CAPs** (open findings and corrective action plan tracker)
- **Provider Directory** (provider roster with credentialing and exclusion status)
- **Document Vault** (uploaded compliance records with expiration tracking)
- **Exclusion Screening** (OIG/LEIE/SAM screening history and scheduling)
- **Incident Reports** (compliance events logged — self-disclosures, near-misses, violations)
- **Training & Attestations** (P&P acknowledgment tracking, training completion)
- **Audit Log** (system-level event trail — who did what, when)

---

## Design Context — Visual Language of This Industry

### What "Premium" Looks Like in This Domain

Healthcare compliance GRC platforms occupy a specific visual register: **structured, clinical, and authority-signaling**. The practitioners who use these platforms are compliance officers, practice administrators, and in-house legal/regulatory staff — people who have internalized the visual language of regulated industries. They run Healthicity, symplr, or Navex One all day. Generic "SaaS modern" aesthetics signal that the builder doesn't understand the seriousness of the use case.

The dominant visual pattern in this space is **dense-but-organized**: sidebar navigation with clear hierarchy, a top KPI row that immediately shows the current risk state, and data-heavy content areas organized into tabular or card-grid layouts. Color is used semantically, not decoratively — red for excluded/overdue, amber for expiring/at-risk, green for compliant/cleared. Status badges appear everywhere because practitioners scan for status constantly.

Typography leans toward **professional and legible** — no display fonts, no editorial styling. Geist or Inter at tight weights for data labels, slightly more weight for section headers. Tables dominate over cards for data-heavy views. Where cards appear (KPI summary row, practice scorecards), they use a subtle border or slight shadow to separate without decorative flair. The overall impression should feel like: "this is a serious tool built for a serious problem" — not fun, not playful, not warm.

The color direction in real tools like NAVEX One and symplr is typically a **deep navy or slate-blue primary** with white surfaces, light gray backgrounds, and sharp semantic status colors. Dark mode is rarely used in this space — compliance workflows happen in bright office environments on standard monitors, and light-mode conveys institutional trust better than dark in regulated healthcare contexts.

### Real-World Apps Clients Would Recognize as "Premium"

1. **symplr Compliance** — The enterprise standard in hospital and health system compliance. Practitioners who've seen it describe it as dense but well-organized, with a left sidebar, tabular data views, strong status coloring, and a KPI header row. The brand uses a deep teal/blue primary. This is the "benchmark" tool clients compare against.

2. **Healthicity Compliance Manager** — Purpose-built for physician groups and ambulatory practices (closer to this platform's actual audience). Features a "Workspace" dashboard showing tasks, alerts, due dates, and recent activity in a single view. Known for being more approachable than enterprise systems — still structured and tabular, but slightly less dense. Navy/blue primary with white cards.

3. **NAVEX One** — The enterprise GRC platform healthcare orgs use when they want the "full suite" approach. Known for its Policy Center, Training Center, and Incident Reporting in one unified UI. Dashboard is standard enterprise: KPI cards at top, charts in the middle, data tables below. Deep navy primary, structured grid layout. The UI that compliance officers trained on.

### Aesthetic Validation

- **Domain validation**: Corporate-Enterprise aesthetic is strongly confirmed for this domain. Practitioners in this space use symplr, Healthicity, and NAVEX One — all of which use structured, tabular, authority-signaling layouts with navy/slate primary colors. SaaS-Modern would read as too casual for a compliance and risk platform. Dark-Premium would read as cybersecurity, not healthcare compliance.
- **Color nuance**: Deep navy primary (not bright blue, not slate gray). oklch hue around 240-250 range. Use a slightly desaturated navy that feels institutional rather than tech-startup. Status colors must be sharp and semantic: red for critical violations, amber for warnings, green for compliant states.
- **One adjustment**: Reduce card border-radius slightly (0.375-0.5rem) vs. standard SaaS Modern (0.75rem). Healthcare compliance tools use tighter corners — signals precision and formality over approachability.

### Format Validation

- **Job Analyst format**: dashboard-app
- **Domain validation**: Confirmed. This is a B2B SaaS compliance operations platform — sidebar navigation with multiple feature pages is the architecturally correct format. The platform has distinct modules (assessments, findings, providers, documents, screening) that map directly to sidebar nav items and separate feature pages. A landing-page or mobile-app format would be fundamentally wrong for this use case.
- **Format-specific design notes**: The dashboard should open to a portfolio-level overview (aggregate compliance scores across all orgs), not a single-org view. This signals the multi-tenant architecture immediately. The KPI row should show 5-6 cards with color-coded numbers — overall compliance score, open findings, overdue CAPs, exclusion hits, and expiring documents. A secondary chart area should show compliance score trends over time (line/area chart). Below that, a practices table or scorecard grid showing per-practice compliance scores with status badges.

### Density and Layout Expectations

**Density**: Standard-to-compact. Not as dense as a Bloomberg Terminal or Datadog, but denser than typical SaaS-Modern. Practitioners expect to see substantial data without scrolling extensively. Content padding should be 1-1.25rem (compact side of standard). Sidebar width: 16rem — enough for longer nav labels like "Exclusion Screening" and "Findings & CAPs."

**List-heavy vs. card-heavy**: Strongly list-heavy (tables, queues) for data views (providers, findings, documents, audit logs). Card-heavy only for the overview dashboard KPI row and practice scorecard summaries. This mirrors how Healthicity and symplr handle information density.

---

## Entity Names (10+ realistic names)

### Physician Practices / Organizations

- Ridgeline Family Medicine Group
- Eastgate Orthopaedics & Sports Medicine
- Harborview Internal Medicine Associates
- Pinebrook Gastroenterology Partners
- Meridian Multi-Specialty Clinic
- Summit Primary Care Network
- Clearwater Urgent Care Centers
- Northgate Women's Health Group
- Valley Behavioral Health Associates
- Lakeside Cardiology & Vascular
- Apex Rehabilitation Medicine
- Crestwood Pediatrics & Adolescent Care

### Insurers / Health Plans (as tenants)

- BlueStar Health Network
- Keystone Regional Health Plan
- Anthem Select Provider Network (use "Anthem Select" in demo)
- Horizon Preferred Payer Group

### Private Equity / MSO Groups (as tenants)

- Vantage Health Partners (PE portfolio group)
- Summit Medical Holdings LLC
- Clearpath Healthcare MSO
- Bridgepoint Physician Equity Group

### Provider Names (role-appropriate, demographically realistic)

- Dr. Ananya Krishnan, MD — Internal Medicine, Compliance Officer
- Dr. Robert Osei, DO — Family Medicine
- Dr. Sarah Whitfield, MD — Gastroenterology
- Dr. James Morales, MD — Orthopedic Surgery
- Dr. Fatima Al-Rashid, MD — Cardiology
- Dr. Linda Chen, NP — Nurse Practitioner, Primary Care
- Dr. Michael Torres, PA-C — Physician Assistant
- Dr. Yuki Tanaka, MD — Psychiatry
- Dr. Elena Vasquez, MD — OB/GYN
- Dr. Samuel Okonkwo, MD — Urgent Care

### Compliance Staff Names

- Patricia Reyes — Compliance Officer
- Marcus Webb — Risk Analyst
- Diane Kowalski — Practice Administrator
- James Sutherland — Compliance Coordinator
- Aisha Mohammed — HIPAA Privacy Officer
- Carlos Gutierrez — Billing Compliance Specialist

---

## Realistic Metric Ranges

| Metric | Low | Typical | High | Notes |
|--------|-----|---------|------|-------|
| Overall Compliance Score | 38 | 71 | 94 | Scores below 60 flagged as High Risk; above 85 = Compliant |
| Billing Domain Score | 42 | 68 | 92 | Typically lowest-scoring domain — coding errors common |
| HIPAA Privacy Score | 55 | 74 | 97 | Higher baseline — practices fear breach penalties |
| Credentialing Domain Score | 60 | 79 | 98 | Relatively easy to document when systems are in place |
| Anti-Kickback/Stark Score | 35 | 62 | 88 | Often lowest — complex physician arrangement rules |
| Training Completion Rate | 31% | 67% | 96% | Highly variable; training fatigue is real |
| Policy Attestation Rate | 44% | 72% | 99% | Higher in credentialed/accredited organizations |
| Open Findings per Practice | 0 | 4 | 23 | Median ~4; outliers at 15+ signal systemic issues |
| Days to CAP Resolution | 5 | 18 | 120 | Regulatory standard expects resolution within 90 days |
| Providers per Practice | 2 | 11 | 48 | Small independent = 2-5; multi-site group = 20-50 |
| Documents per Assessment | 8 | 24 | 67 | Grows with practice size and specialty complexity |
| Exclusion Checks / Month | 1 | 18 | 200 | One per provider; monthly cadence required by most payers |
| Incidents Reported (90d) | 0 | 3 | 17 | Zero is suspicious — likely underreporting, not true compliance |
| OIG Exclusion Hits (per 100 providers) | 0 | 0.3 | 2.1 | 0.3% baseline from industry data; any hit requires immediate action |
| Annual Assessment Completion Rate | 22% | 58% | 94% | Many practices fall behind; PE groups track this by portfolio |

---

## Industry Terminology Glossary (15+ terms)

| Term | Definition | Usage Context |
|------|-----------|---------------|
| OIG LEIE | Office of Inspector General — List of Excluded Individuals and Entities. Federal exclusion database. | Required monthly screening for all providers and vendors. An "exclusion hit" means the provider cannot bill Medicare/Medicaid. |
| SAM.gov | System for Award Management. Federal database of debarred/suspended parties. | Screened alongside OIG LEIE — required for federal healthcare program participation. |
| HIPAA Security Rule | The technical/administrative safeguard requirements for protecting ePHI under HIPAA. | Governs one compliance domain (Privacy & Security). |
| Stark Law | Physician Self-Referral Law (42 U.S.C. § 1395nn). Prohibits physicians from referring patients to entities with which they have financial relationships, unless a specific exception applies. | Governs the "Physician Arrangements" compliance domain. Key risk area for PE-backed practices. |
| Anti-Kickback Statute (AKS) | Federal law prohibiting offering, paying, soliciting, or receiving anything of value to induce referrals for items covered by federal health programs. | Often assessed alongside Stark. Safe harbor documentation is the key mitigation. |
| CAP | Corrective Action Plan. The formal remediation document created in response to a compliance finding. Has owner, target date, and verification steps. | Core workflow object — appears in findings tracker, KPI cards, dashboard alerts. |
| Finding | A specific identified gap or deficiency in a compliance domain. One assessment generates one or more findings. | Table row in findings tracker; each finding maps to a domain (billing, privacy, credentialing, etc.). |
| CAQH ProView | Council for Affordable Quality Healthcare — the industry-standard provider data repository used by insurers for credentialing. Providers must re-attest every 120 days. | Referenced in credentialing workflow; "CAQH attestation overdue" is a compliance finding. |
| GCPG | General Compliance Program Guidance. OIG's November 2023 updated framework describing the seven elements of an effective compliance program. | The authoritative reference for what a complete compliance program looks like. Platform scores against these elements. |
| Seven Elements | The OIG's seven components of an effective compliance program: (1) Written Policies & Procedures, (2) Compliance Oversight, (3) Training & Education, (4) Lines of Communication, (5) Enforcing Standards, (6) Risk Assessment/Auditing/Monitoring, (7) Responding to Offenses. | The structural basis for compliance scoring domains. |
| MSO | Management Services Organization. The entity that PE groups use to manage physician practices without technically "owning" them — preserving corporate practice of medicine law compliance. | PE tenant type in the platform. MSOs monitor compliance across their affiliated practices. |
| HCC | Hierarchical Condition Category. CMS risk adjustment model used in value-based care. | Referenced in billing compliance domain — relevant when practices participate in Medicare Advantage or ACO models. |
| P&P | Policies and Procedures. The written compliance program documentation required under OIG Element 1. Staff must attest to P&Ps annually. | Document type; attestation tracking KPI. |
| Self-Disclosure | A voluntary report of a potential compliance violation made to OIG or CMS before an investigation. Viewed favorably by regulators; may reduce penalties. | Incident report type — the most serious category of reported incident. |
| Credentialing | The formal process of verifying a provider's education, training, licensure, and practice history before granting practice or billing privileges. | Compliance domain and workflow category; tracked in Provider Directory. |
| Network Participation | Whether a provider is actively enrolled and credentialed with specific payers (Medicare, Medicaid, commercial insurers). | Tracked per provider; expired enrollment = cannot bill = compliance and revenue risk. |
| Excluded Provider | A provider or vendor on OIG LEIE or SAM.gov — meaning they are legally barred from participation in Medicare, Medicaid, and other federal health programs. | Most critical status; requires immediate off-boarding. Any claim submitted involving an excluded provider triggers repayment liability. |

---

## Common Workflows

### Workflow 1: Annual Compliance Risk Assessment

1. Compliance officer initiates assessment for a practice (selects assessment template: OIG-aligned, HIPAA Security, Billing & Coding, or Custom)
2. System sends intake form link to designated practice contact (practice administrator or compliance coordinator)
3. Practice contact completes multi-section questionnaire covering all seven OIG elements (typically 40-80 questions)
4. Practice uploads supporting documentation for each domain (P&P documents, training logs, exclusion screening records, audit reports)
5. Compliance officer reviews submitted responses and documents; requests clarification or additional evidence as needed
6. System generates domain-level scores and overall compliance score based on weighted response analysis
7. Compliance officer reviews draft findings, adds commentary, adjusts scores if warranted
8. System creates individual findings for each identified gap
9. Compliance officer publishes assessment; practice receives results with per-domain score breakdown
10. CAPs are automatically generated for High and Critical findings; assigned to responsible parties with target dates
11. 90-day follow-up check: system sends reminders and tracks CAP resolution progress

**Trigger**: Annual schedule, regulatory audit notice, new practice onboarding, ownership change (PE acquisition)
**Duration**: 2-6 weeks from initiation to published results
**Output**: Compliance Score Report, Findings List, CAP assignments

---

### Workflow 2: Monthly Provider Exclusion Screening

1. System generates monthly screening batch on a fixed schedule (1st of month or triggered manually)
2. Batch includes all active providers and contracted vendors for the organization
3. System queries OIG LEIE, SAM.gov, and applicable state Medicaid exclusion databases
4. Results parsed: "Cleared" (no match), "Potential Hit" (name/SSN match requiring manual review), or "Excluded" (confirmed match)
5. Any "Potential Hit" or "Excluded" result immediately triggers alert to compliance officer and practice administrator
6. Compliance officer investigates hit: confirms identity (name/DOB/NPI match), determines if actual exclusion
7. If confirmed excluded: provider is immediately suspended from billing activities; incident report filed; legal counsel notified; CMS/OIG self-disclosure evaluated
8. If false positive: investigation documented and record cleared
9. Screening record saved with timestamp, database versions checked, and result documented for audit trail
10. Monthly screening report available for download by insurers and PE group oversight teams

**Trigger**: Monthly calendar, new provider onboarding, contract renewal
**Duration**: Automated batch runs in minutes; manual investigation of hits = 1-3 days
**Output**: Screening Report, Cleared/Hit records, Incident Report (if Excluded), Audit Trail entry

---

### Workflow 3: Corrective Action Plan (CAP) Remediation

1. Finding identified (from assessment, incident report, or internal audit)
2. Compliance officer creates CAP: describes the finding, assigns to responsible party, sets target completion date (typically 30-90 days)
3. CAP owner receives notification with finding details, required corrective actions, and deadline
4. Owner executes remediation steps: updates P&P, conducts staff training, implements new controls, etc.
5. Owner uploads evidence of remediation (training logs, updated policy documents, vendor contracts, etc.)
6. Owner marks CAP as "Pending Verification" with a completion summary
7. Compliance officer reviews evidence; may request additional documentation
8. If evidence sufficient: compliance officer closes CAP as "Verified" — finding marked resolved
9. If evidence insufficient: CAP returned to "In Remediation" with specific requests
10. If CAP passes target date without resolution: status auto-escalates to "Overdue"; compliance officer and practice administrator notified
11. Closed CAPs update the practice's compliance score for affected domain

**Trigger**: Finding creation (from assessment, incident report, or audit)
**Duration**: 30-90 days target; regulatory standard is resolution within 90 days
**Output**: Verified CAP record, updated domain score, audit trail entry

---

## Common Edge Cases

1. **OIG Exclusion Hit** — A provider matches the OIG LEIE database. Even a false positive requires documented investigation. True exclusion means the practice may have unknowingly submitted fraudulent claims, creating immediate repayment liability. Status = "Excluded", severity = Critical.

2. **Overdue Annual Assessment** — A practice has not completed its annual risk assessment in 14+ months. Compliance score shows "Assessment Overdue" rather than a numeric score. PE group dashboards surface these immediately as portfolio risk.

3. **CAP Past Target Date** — A Corrective Action Plan has not been resolved by its target date. Status escalates to "Overdue", then "Escalated" if it remains open 30+ days past deadline. A backlog of overdue CAPs is a regulatory red flag if OIG ever investigates.

4. **Expired Provider License** — A physician's state medical license has lapsed. Status = "Expired." The practice cannot legally bill for services rendered after the expiration date. Common edge case: doctors forget to renew across multiple state licenses.

5. **CAQH Re-attestation Lapsed** — Provider has not re-attested their CAQH ProView profile within the 120-day window. Payers can deactivate the provider from their network, stopping claim reimbursement. Status = "Re-attestation Required."

6. **Mass Training Non-Compliance** — Training completion rate drops below 50%. Common after staff turnover or during busy seasons. Edge case record: a practice with 12 providers where only 3 have completed annual HIPAA training.

7. **Missing Required Document** — A key document (Business Associate Agreement with a vendor, physician compensation arrangement, Certificate of Insurance) has never been uploaded. Status = "Missing." A finding is triggered automatically if a required document has no uploaded record.

8. **Self-Disclosure Event** — A practice self-reports a potential AKS violation discovered during an internal audit (e.g., a physician referral arrangement that may not qualify for a Stark exception). This is the most serious incident type. Status = "Under Investigation."

9. **Newly Acquired Practice** — A PE group has acquired a new physician practice. The practice has no compliance score yet ("Baseline Assessment Pending"). This appears as a blank scorecard in the portfolio dashboard — a clear call to action.

10. **Score Regression** — A practice that was previously Compliant (score 88) drops to At-Risk (score 61) after a reassessment reveals previously undisclosed financial arrangements. Score history chart should show the drop.

---

## What Would Impress a Domain Expert

1. **OIG LEIE monthly screening cadence is a hard requirement, not a best practice.** Most healthcare compliance professionals know that failure to screen providers monthly — and document those screens — exposes the organization to FCA (False Claims Act) liability. The platform surfacing "Screening Overdue" badges per provider, with the exact last-screened date, is something only a domain-aware developer would include.

2. **The "Stark Law" and "Anti-Kickback" domains are separate scoring categories.** Non-experts conflate them. Stark Law is a strict-liability civil statute (intent doesn't matter; the arrangement either fits an exception or it doesn't). AKS is a criminal intent-based statute with safe harbors. Scoring them separately, with different remediation paths, signals deep understanding.

3. **CAQH re-attestation has a 120-day window, not annual.** Most developers would assume annual credentialing. The 120-day re-attestation cycle is a pain point practitioners actively manage — and a common source of network participation lapses. Surfacing this with a countdown per provider is something insiders would immediately notice.

4. **The OIG GCPG's seven elements are the industry-standard scoring framework** (published November 2023). A compliance platform that explicitly maps its domain scores to these seven elements — and shows which OIG element each finding relates to — demonstrates structural alignment with the authoritative regulatory guidance practitioners reference.

5. **"Excluded provider" is a business-critical emergency, not a warning.** Any claim involving an excluded provider is considered fraudulent under FCA, regardless of intent. The practice must stop billing immediately, assess past claims for exposure, and consider voluntary self-disclosure. A platform that marks this status in red with an immediate action prompt ("Immediate action required — cease billing activities") rather than just a badge understands the severity.

---

## Common Systems & Tools Used

| Tool | Purpose |
|---|---|
| OIG LEIE Database (HHS.gov) | Monthly exclusion screening — federal exclusion list |
| SAM.gov | Federal debarment/suspension screening — General Services Administration |
| CAQH ProView | Provider data repository for insurer credentialing — industry standard |
| Healthicity Compliance Manager | Incumbent compliance management platform — direct competitor |
| symplr Compliance | Enterprise healthcare operations platform — larger health systems |
| NAVEX One | Enterprise GRC platform with Policy Center, Training, Incident Reporting |
| MedTrainer | Compliance + credentialing + training for ambulatory practices |
| Epic / Athenahealth | EMR systems — referenced in data integration context (not in scope for this platform) |
| Compliancy Group | HIPAA-focused compliance software for small practices |
| NetSmart / AdvancedMD | Practice management — source systems for billing compliance data |

---

## Geographic / Cultural Considerations

- **US jurisdiction only.** All regulatory references are to US federal law (HIPAA, Stark, AKS, FCA) and state medical licensing boards. No international compliance considerations.
- **State Medicaid exclusion lists** vary by state — practices operating across multiple states must screen against each applicable state list in addition to federal lists. Multi-site PE-backed groups face the highest complexity.
- **California, New York, Texas, Florida** are highest-volume states for physician practice PE consolidation — realistic practice names should reflect these geographies.
- **Time zones**: For compliance deadline tracking, all dates display in the user's local timezone with UTC stored in the database. This is a known pain point in multi-state deployments.
- **Fiscal year alignment**: Healthcare organizations typically align compliance reporting to calendar year (Jan-Dec), but some large health systems use July 1 - June 30. Mock data should default to calendar year.

---

## Compliance Domains — Scoring Breakdown

These are the specific scored domains that appear on the Risk Assessment and in domain-level score cards. Each practice gets a score per domain that rolls up to the Overall Compliance Score.

| Domain | OIG Element | Weight | Description |
|---|---|---|---|
| Billing & Coding | Element 6 (Auditing) | 25% | Claim accuracy, upcoding, unbundling, documentation supporting billed services |
| HIPAA Privacy & Security | Element 1 (P&P) | 20% | Safeguard adequacy, BAA inventory, breach history, security risk assessment |
| Credentialing & Enrollment | Element 6 (Monitoring) | 15% | License currency, CAQH status, payer enrollment, NPDB check history |
| Physician Arrangements | Element 1 (P&P) | 20% | Stark Law exception documentation, AKS safe harbor compliance, FMV analyses |
| Exclusion Screening | Element 6 (Monitoring) | 10% | Monthly OIG/SAM screening cadence, documentation, hit investigation |
| Training & Education | Element 3 | 5% | HIPAA training completion, coding education, AKS/Stark training for physicians |
| Policies & Procedures | Element 1 | 3% | P&P currency, staff attestation rates, annual review documentation |
| Incident Response | Element 7 | 2% | Breach response protocols, self-disclosure history, corrective action responsiveness |

---

## Intake Assessment Form Fields

Representative questions from a compliance risk assessment intake form. These become the mock form fields in the assessment workflow UI.

**Section A: Organization Basics**
- Organization legal name
- NPI (National Provider Identifier) — 10-digit
- Tax ID (EIN)
- Primary specialty / specialties
- Number of active providers
- CMS Certification Number (if applicable)
- States of operation
- Designated Compliance Officer (name, title, contact)
- Compliance Officer independence status (reports directly to board or senior leadership?)

**Section B: Billing & Coding**
- Do you have a written billing compliance policy? (Yes / No / In development)
- When was your last internal billing audit? (Date)
- Do you use a third-party billing company? (Yes / No) — if yes, is a BAA in place?
- What percentage of claims are reviewed before submission? (0%, <5%, 5-10%, >10%)
- Have you received a RAC (Recovery Audit Contractor) audit in the last 3 years? (Yes / No)
- Have you overpaid or been identified as having billing errors in the last 12 months? (Yes / No / Unknown)

**Section C: HIPAA Privacy & Security**
- When was your last HIPAA Security Risk Analysis (SRA) completed? (Date / Never)
- Do you have a current Business Associate Agreement (BAA) inventory? (Yes / Partial / No)
- Have you experienced a reportable PHI breach in the last 2 years? (Yes / No)
- Do you have an incident response plan? (Yes / No)
- Are workforce members trained on HIPAA annually? (Yes / No / Inconsistently)

**Section D: Credentialing & Provider Status**
- Do you have a written credentialing policy? (Yes / No)
- Are all providers screened against OIG LEIE at hire and monthly thereafter? (Yes / No)
- Are all providers' state medical licenses current and verified? (Yes / No / Some expired)
- Are all providers enrolled with applicable payers? (Yes / No / Some pending)

**Section E: Physician Arrangements**
- Do any physicians receive compensation from entities to which they refer patients? (Yes / No / Unknown)
- Are all physician compensation arrangements reviewed for Stark Law exceptions? (Yes / No)
- Are all compensation arrangements in writing and at fair market value? (Yes / No / Some)
- Has a healthcare attorney reviewed your physician contracts in the last 2 years? (Yes / No)

---

## Data Architect Notes

- **Entity names to use**: Practice names from the "Physician Practices / Organizations" list above. Provider names from the "Provider Names" list. Compliance staff names from the "Compliance Staff Names" list.
- **Org/tenant structure**: Mock data should include 3 tenant types — one insurer (BlueStar Health Network), one PE group (Vantage Health Partners), and 8-10 individual practices. The insurer and PE group have child practices under them.
- **Compliance score field**: Integer 0-100. Low risk = 80-100. Moderate risk = 60-79. High risk = 40-59. Critical = below 40. Include 2-3 practices in each tier.
- **Domain scores**: Include all 8 domains per practice (Billing, HIPAA, Credentialing, Physician Arrangements, Exclusion Screening, Training, P&P, Incident Response). Billing and Physician Arrangements scores should average ~10 points lower than other domains.
- **Findings records**: 15-20 findings across the practice set. Mix of severities: 3-4 Critical, 6-8 High, 5-6 Medium, 2-3 Low. Each finding should have a domain, severity, status, assigned to, and target date. Include 3-4 overdue findings.
- **CAP records**: One CAP per Critical or High finding. Mix of statuses: Open, In Remediation, Pending Verification, Overdue. Include exact status strings from the vocabulary section above.
- **Provider records**: 15-18 providers across practices. Mix of statuses: mostly Active, 1 Excluded (critical edge case), 2 Re-attestation Required, 1 Expired license, 1 Pending Enrollment.
- **Document records**: 15-20 documents. Types: Business Associate Agreement, Medical License, Malpractice Certificate, Physician Compensation Agreement, Stark Law Exception Analysis, P&P Manual, HIPAA Security Risk Analysis, Exclusion Screening Report, Training Log. Mix statuses: Current, Expiring Soon (3-4), Expired (1-2), Missing (2-3).
- **Exclusion screening records**: Monthly records per provider. Most = "Cleared". Include 1 record with "Hit — Review Required" and 1 resolved as false positive (documented). Include 2-3 providers with "Screening Overdue."
- **Incident reports**: 8-10 incidents. Types: Privacy Breach (Near-Miss), Billing Discrepancy, AKS Concern, Staff Policy Violation, Excluded Provider Discovery, HIPAA Complaint Received. One incident should be a "Self-Disclosure" type — the most serious.
- **Date patterns**: Assessment dates spread over last 90 days. Some initiated 60+ days ago and still In Progress (edge case). CAP target dates: some upcoming (15-30 days), some past due (Overdue). Exclusion screening: monthly — most done in last 30 days, some providers 45+ days (Overdue).
- **Status distribution for practices**: ~30% Compliant (80+), ~40% At-Risk (60-79), ~20% High-Risk (40-59), ~10% Critical (<40). This reflects a realistic portfolio that has not uniformly completed its compliance program.

## Layout Builder Notes

- **Density**: Standard-to-compact. `--content-padding: 1.25rem`, `--card-padding: 1.25rem`, `--nav-item-py: 0.375rem`
- **Sidebar width**: 16rem — labels like "Exclusion Screening" need adequate space without truncation
- **Border-radius**: 0.375rem (`--radius: 0.375rem`) — tighter than default SaaS Modern. Signals precision and institutional authority.
- **Primary color direction**: Deep navy — oklch around `oklch(0.35 0.10 247)`. Not bright blue, not indigo-purple. The specific shade of institutional navy that symplr and Healthicity use.
- **Status color discipline**: Red/rose for Excluded, Overdue, Critical. Amber for Expiring Soon, High-Risk, At-Risk. Green for Compliant, Cleared, Verified. These must be sharp and unambiguous — compliance practitioners scan for status color constantly.
- **Surface treatment**: White card surfaces (`--card: oklch(1 0 0)`), very light gray page background (`--background: oklch(0.97 0.005 247)`). Subtle card borders rather than drop shadows — shadows feel consumer, borders feel enterprise.
- **Typography**: Geist Sans body text. Tabular numeric data should use `font-variant-numeric: tabular-nums` for column alignment. Status badges use uppercase letter-spacing for scannability.
- **Sidebar treatment**: Sidebar background should be a slightly darker surface than the page — `oklch(0.95 0.008 247)` or tinted navy — to visually separate navigation from content.

## Demo Screen Builder Notes

- **Hero metric / largest stat card**: Overall Portfolio Compliance Score (weighted average across all active orgs). Display as a large number (e.g., 71) with a trend indicator (up/down vs. last month) and a risk tier badge ("At-Risk" in amber). This is the number that PE portfolio managers and insurers look at first.
- **Second most important KPI cards** (in order): Open Findings, Overdue CAPs, Exclusion Hits (show in red with value "1" to make the severity immediately clear), Assessments Pending.
- **Chart type**: Area chart (not bar) for compliance score trend over 6-12 months. Area chart with a soft fill emphasizes trajectory — compliance officers care about direction (improving vs. declining) not just point-in-time. Line chart works too. Avoid pie/donut for the main visualization — compliance scores are not part-of-whole.
- **Secondary chart**: Stacked bar chart showing finding severity distribution by practice — this is exactly the type of chart healthcare compliance officers use in board reports and committee presentations. Categories: Critical, High, Medium, Low. Color-coded per severity.
- **Domain-specific panel that would impress a practitioner**: A "Practice Scorecard" grid below the charts — showing each practice as a row with: practice name, overall compliance score (color-coded), top finding, last assessment date, and CAP count. This mirrors how PE groups actually monitor their portfolio in spreadsheets today — seeing it in a live dashboard would be a clear "this developer gets it" moment.
- **Dashboard layout**: KPI row (5-6 cards) → two-column chart area (trend line + finding severity bar) → practice scorecard table. This three-zone structure is standard in enterprise GRC dashboards (symplr, NAVEX One) and will feel immediately familiar.
- **Interactive elements**: A "Risk Tier" filter above the practice scorecard table (All / Critical / High-Risk / At-Risk / Compliant) that filters the table rows. This is the #1 interaction compliance officers do when monitoring a portfolio.
- **Alert/notification panel**: A sidebar or modal-triggering badge count for "Excluded Provider — Immediate Action Required" — practitioners would expect this to trigger an urgent notification, not just a table row. Show it as a banner or alert chip above the KPI cards.

---

Sources consulted during research:
- OIG General Compliance Program Guidance (November 2023): https://oig.hhs.gov/documents/compliance-guidance/1135/HHS-OIG-GCPG-2023.pdf
- Healthicity Compliance Manager: https://www.healthicity.com/solutions/compliance/software
- MedTrainer Compliance Platform: https://medtrainer.com/products/compliance-overview/
- symplr Compliance: https://www.symplr.com/products/symplr-compliance
- NAVEX One Healthcare: https://www.navex.com/en-us/solutions/industries/healthcare/
- Ethico GRC Platform: https://ethico.com/grc-platform-risk-and-compliance-software/
- Compliancy Group High-Risk Areas: https://compliancy-group.com/high-risk-areas-for-compliance-issues-in-healthcare/
- OIG Compliance Programs for Physicians: https://oig.hhs.gov/compliance/physician-education/compliance-programs-for-physicians/
- CAQH ProView: https://www.caqh.org/providers
- Physician Credentialing Checklist: https://rcmexperts.us/blog/physician-credentialing-checklist/
- HHS HIPAA Security Risk Analysis: https://www.hhs.gov/hipaa/for-professionals/security/guidance/guidance-risk-analysis/index.html
- OIG General Compliance Program Guidance overview: https://www.qordata.com/oig-general-compliance-program-guidance/
