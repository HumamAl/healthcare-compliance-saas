# Creative Brief — Healthcare Compliance SaaS

**Produced by:** Creative Director
**For:** Team Lead, Layout Builder, Demo Screen Builder, Feature Builder, Challenges Builder, Proposal Builder, QA Agent

---

## Creative Brief JSON

```json
{
  "aesthetic": "saas-modern",
  "demoFormat": "dashboard-app",
  "domain": "healthcare compliance SaaS",
  "mood": "trustworthy, structured, clinical precision, institutional authority",
  "colorDirection": "deep teal primary on clean white — oklch(0.52 0.14 195) — derived from the convergent color convention across Healthicity (teal #00BCD4), MedTrainer (navy-teal #4ea0ca), SAI360 (teal-green #00856c), and MetricStream (turquoise accents #26EAC4). Every major healthcare compliance competitor uses teal-to-navy as their trust anchor. The --primary-h is 195.",
  "typography": "Geist Sans body — the clean, precise letterforms communicate technical capability without clinical coldness. Geist Mono for all compliance identifiers: finding IDs, audit event codes, presigned URL tokens, risk score numerics. This mirrors the monospace conventions in regulated-data tooling (Epic, Salesforce Health Cloud) that compliance officers and clinicians use daily.",
  "radiusProfile": "medium (0.5rem) — Compliancy Group's The Guard uses 11px, Healthicity uses 24px, MedTrainer uses a middle range. The category has moved away from sharp enterprise corners without going into consumer-rounded softness. 0.5rem sits at the professional midpoint: competent but not cold.",
  "densityProfile": "standard — competitors like Healthicity and Compliancy Group use organized card-based layouts with generous section separation, not the hyper-density of a Bloomberg terminal nor the breathing room of a wellness app. Compliance officers scan dashboards to triage — they need clear hierarchy, not maximum compression.",
  "motionCharacter": "snappy (120-150ms ease-out) — compliance tools must feel responsive and professional. Slow animations signal sluggishness to users accustomed to Epic's near-instant rendering. Theatrical animations would undermine the institutional authority this product needs to project.",
  "formatRationale": "The job describes a multi-module SaaS with distinct functional areas: risk scoring dashboard, intake forms, document vault, audit trail, RBAC management, and org admin. This is the canonical dashboard-app structure — a persistent sidebar housing nav items for each module, with a header showing org context and user role. Every competitor (Healthicity, MedTrainer, Compliatric) uses this exact layout. Compliance officers expect to switch between modules via sidebar nav, not tabs or a landing page.",
  "competitorReferences": [
    "Healthicity Compliance Manager — light theme, teal/cyan primary (#00BCD4), modern modular card layout, tabbed feature sections, rounded corners (24px). The dominant market player. Their UI is the benchmark clinicians compare against.",
    "MedTrainer — deep navy (#1b1464) + teal (#4ea0ca), Albert Sans typography, modern SaaS-adjacent corporate aesthetic, spacious layout with generous whitespace, light backgrounds. Positioned as the usability leader (G2 #1 Most Implementable).",
    "Compliancy Group (The Guard) — green accent (#65bd7d) + professional blue (#198fd9), Poppins, 11px border-radius, Poppins and Barlow fonts. Clean, professional business software with compliance-specific dashboard modules.",
    "Compliatric — minimalist white backgrounds with dark gray CTAs and blue accents, spacious modern SaaS, explicitly targets RBAC and GRC module structure. Visual language is trustworthy and quiet — no aggressive color.",
    "MetricStream (GRC platform) — deep purple/navy (#10052F) headings with teal/turquoise accents (#26EAC4), light theme, moderate-to-high density, contemporary SaaS rather than legacy enterprise. Used by health systems at scale."
  ],
  "brandSignals": null,
  "creativeRationale": "Studied five direct competitors (Healthicity, MedTrainer, Compliancy Group, Compliatric, MetricStream) — every single one uses a light theme with teal or navy-teal as the primary trust color. This is not coincidence: teal reads as 'clinical competence' to healthcare administrators in the same way that dark reads as 'serious tooling' to SOC analysts. The SaaS Modern aesthetic with a deep teal primary matches what compliance officers, clinicians, and private equity reviewers consider credible software — visually modern enough to signal this isn't a legacy portal, but structured and data-forward enough to signal it handles regulated data seriously. Dark Premium would feel like a security tool and miss the clinical register; Corporate Enterprise (with its grids and heavy borders) would look dated against MedTrainer and Accountable HQ; Warm Organic or any consumer aesthetic would destroy credibility with the physician practice and insurer buyers this product targets."
}
```

---

## Design Direction Narrative

### Why SaaS Modern, Not Corporate Enterprise

The Job Analyst correctly flagged the tension between Corporate Enterprise and SaaS Modern. Research resolves it: the healthcare compliance market has already completed the transition. Every major competitor — MedTrainer (G2's most implementable), Accountable HQ, Compliatric — now delivers SaaS Modern visual language. Corporate Enterprise would look like an older generation of tools (pre-2020 HIPAA compliance portals). The buyers this client is targeting (physician practices, private equity groups evaluating compliance posture) are used to evaluating SaaS products. Corporate Enterprise signals "difficult to implement."

SaaS Modern at this client's institutional scale means:
- Clean white/light backgrounds with well-defined card hierarchy
- Teal primary (not blue, not green — the specific teal-to-navy range)
- Moderate spacing that communicates organization without waste
- Data tables that are legible and scannable, not compressed

### The Color Decision

Teal as the trust color for healthcare compliance is as established as blue is for banks. The specific oklch value `oklch(0.52 0.14 195)` targets the hue range shared by Healthicity's cyan, MedTrainer's teal, and SAI360's teal-green — all cluster around hue 185-210. Hue 195 lands squarely in that range. The chroma at 0.14 is saturated enough to be distinctive on white but not so vivid it reads as consumer or playful.

This is convention-informed, not brand-informed (client has no discoverable brand). Which means it is the right choice: it will feel native to the category immediately.

### Risk Score Visualization Direction

The core differentiator of this product is the compliance risk scoring engine. The dashboard's hero element should be a risk score — a circular gauge or radial progress indicator showing the overall compliance score (0-100), with domain-level breakdown cards below it (e.g., HIPAA Privacy: 87, Documentation: 64, Training: 91). This is the exact pattern compliance officers use to triage where to spend attention. Color-coding follows a three-tier severity convention native to regulated industries:

- Score 80-100: `--success` (green oklch range)
- Score 60-79: `--warning` (amber oklch range)
- Score below 60: destructive/danger (red oklch range)

This scoring convention is visible in Compliancy Group's Guard dashboard and implied by Accountable HQ's risk assessment scoring. It is what institutional buyers will expect to see first.

### Density Rationale

Standard density was chosen by comparing two reference points:
- Denser than: MetricStream, which serves enterprise health systems with power users who navigate complex regulatory mappings — more information per screen
- Less dense than: Bloomberg or Datadog equivalents that serve 8-hour-a-day power users

Compliance officers review dashboards periodically (weekly risk reviews, monthly reporting cycles, audit preparation). They are not ops engineers living in the tool. Standard density optimizes for clarity-at-a-glance rather than maximum data compression.

### Sidebar Navigation Structure (Guidance for Layout Builder)

Based on the job's feature list, sidebar nav items should use domain vocabulary:

| Nav Item | Domain Label | What it covers |
|---|---|---|
| 1 | Risk Overview | Compliance risk scoring dashboard + domain breakdown |
| 2 | Intake & Assessment | Structured intake forms feeding the risk engine |
| 3 | Document Vault | Secure document upload, presigned URLs, S3-compatible storage |
| 4 | Audit Trail | Event log, audit reporting, timestamped activity |
| 5 | Organizations | Multi-tenant org management, RBAC role assignment |

Never use generic labels like "Dashboard", "Analytics", "Settings". Use the client's own vocabulary: "triggered rationale," "domain-level breakdown," "tenant isolation," "presigned URLs" — these exact terms belong in the UI copy.

### What Would Signal the Wrong Choice

- Dark Premium: would feel like a cybersecurity tool. Compliance officers would question whether it's the right category of software.
- Warm Organic: any softness, rounded cards, warm colors, or illustration-forward design would fail the physician practice administrator credibility test.
- NeoBrutalism: immediately disqualifying for regulated healthcare.
- Heavy corporate blue (not teal): would look like a generic enterprise portal from 2015. The teal specificity is what signals research.

---

## CSS Token Direction (for Layout Builder)

```css
:root {
  /* Primary: deep teal */
  --primary: oklch(0.52 0.14 195);
  --primary-h: 195;
  --primary-foreground: oklch(0.99 0 0);

  /* Accent: slightly lighter teal for hover states and secondary actions */
  --accent: oklch(0.60 0.12 195);
  --accent-foreground: oklch(0.15 0.03 195);

  /* Ring matches primary */
  --ring: oklch(0.52 0.14 195);

  /* Sidebar: clean white with subtle teal tint on active nav */
  --sidebar-primary: oklch(0.52 0.14 195);
  --sidebar-bg: oklch(0.98 0.005 195);

  /* Section dark: deep teal-navy for section headers / dark panels */
  --section-dark: oklch(0.18 0.04 195);

  /* Status colors */
  --success: oklch(0.62 0.17 145);   /* green — compliance passed */
  --warning: oklch(0.75 0.18 85);    /* amber — compliance at risk */
  /* destructive stays near oklch(0.55 0.22 25) — compliance critical */

  /* Charts: harmonized to teal hue family */
  --chart-1: oklch(0.52 0.14 195);   /* primary teal */
  --chart-2: oklch(0.62 0.13 210);   /* blue-teal */
  --chart-3: oklch(0.62 0.17 145);   /* green (pass) */
  --chart-4: oklch(0.75 0.18 85);    /* amber (at risk) */
  --chart-5: oklch(0.55 0.22 25);    /* red (critical) */

  /* Spacing: standard */
  --content-padding: 1.5rem;
  --card-padding: 1.5rem;
  --nav-item-py: 0.5rem;
  --sidebar-width: 16rem;
  --header-height: 3.5rem;

  /* Radius: medium */
  --radius: 0.5rem;
}
```

### Motion (for all builders)

```css
/* Snappy: 120-150ms ease-out */
--transition-base: 130ms ease-out;
--transition-slow: 200ms ease-out;  /* chart entrance only */
```

Animated number counters on KPI cards: count up on viewport entry over 800ms (the counter duration is slower than the UI transition — it is a display animation, not a response animation).

---

## Competitive Positioning Summary

| Product | Aesthetic | Primary Color | Density | Theme |
|---|---|---|---|---|
| Healthicity Compliance Manager | SaaS Modern | Teal/cyan (#00BCD4) | Standard | Light |
| MedTrainer | SaaS Modern / Corporate | Navy + teal (#4ea0ca) | Standard-spacious | Light |
| Compliancy Group The Guard | SaaS Modern | Green + blue (#65bd7d + #198fd9) | Standard | Light |
| Compliatric | SaaS Modern / Minimal | White + dark gray + blue | Spacious | Light |
| MetricStream | Corporate / SaaS Modern | Navy (#10052F) + teal accents | Standard-dense | Light |
| **This Demo** | **SaaS Modern** | **Deep teal oklch(0.52 0.14 195)** | **Standard** | **Light** |

The demo lands in the center of the competitive space — more modern than MetricStream's corporate density, more structured than Compliatric's minimal approach, and aligned with where the leading usability-focused products (MedTrainer, Accountable HQ) have positioned themselves.
