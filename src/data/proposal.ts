// Proposal page data — Healthcare Compliance SaaS
// All portfolio outcomes are exact text from references/developer-profile.md.
// Stats are exact social proof stats from developer-profile.md.
// clientName is null — APP_CONFIG.projectName used in CTA copy instead.

export interface HeroStat {
  value: string;
  label: string;
}

export interface PortfolioProject {
  name: string;
  description: string;
  outcome: string;       // exact text from developer-profile.md — never invented
  tech: string[];
  url: string | null;    // null when no URL in developer-profile.md — omit ExternalLink
  relevance: string;
}

export interface ApproachStep {
  step: string;
  title: string;
  description: string;
  timeline: string;
}

export interface SkillCategory {
  label: string;
  skills: string[];
}

export interface ProposalData {
  hero: {
    name: string;
    valueProp: string;
    badgeText: string;
    stats: HeroStat[];
  };
  projects: PortfolioProject[];
  approachSteps: ApproachStep[];
  skillCategories: SkillCategory[];
  cta: {
    heading: string;
    subtext: string;
    authorName: string;
  };
}

export const proposalData: ProposalData = {
  hero: {
    name: "Humam",
    // Tailored to this specific job: multi-tenant healthcare compliance SaaS MVP
    // with risk scoring, RBAC, document vault, and audit trail.
    valueProp:
      "I build multi-tenant healthcare compliance SaaS platforms — risk scoring dashboards, OIG exclusion tracking, document vaults, and audit trails — and I've already built one for your review in Tab 1.",
    badgeText: "Built this demo for your project",
    // 3 stats from developer-profile.md — selected to match what this client cares about:
    // scope confidence (24+ projects), domain breadth (15+ industries), speed (< 48hr demo)
    stats: [
      { value: "24+", label: "Projects shipped" },
      { value: "15+", label: "Industries served" },
      { value: "< 48hr", label: "Demo turnaround" },
    ],
  },

  // 4 projects — selected by domain match → feature overlap → tech match
  // 1. Tinnitus Therapy SaaS — closest structural match: multi-clinic SaaS, patient mgmt, multi-location
  // 2. Southfield Healthcare — healthcare ops platform, scheduling, clinical workflows
  // 3. DealerHub — multi-tenant RBAC architecture, role-based access, complex data relationships
  // 4. PayGuard — compliance monitoring, flagging, alert management
  projects: [
    {
      name: "Tinnitus Therapy SaaS",
      description:
        "Multi-clinic tinnitus therapy management platform with patient intake, treatment protocols, progress tracking, and clinic analytics. Same multi-tenant architecture your platform needs — one codebase serving multiple clinic locations with isolated data per tenant.",
      // exact from developer-profile.md
      outcome:
        "Multi-clinic SaaS covering the full patient journey — intake, protocol assignment, session tracking, and outcome dashboards",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
      url: "https://tinnitus-therapy.vercel.app",
      relevance:
        "Directly parallel to your platform: multi-tenant SaaS serving separate clinical organizations, each with their own data, users, and workflows.",
    },
    {
      name: "Southfield Healthcare",
      description:
        "Healthcare operations platform with patient management, appointment scheduling, provider dashboards, and clinical analytics. Demonstrates the domain vocabulary and UI conventions your compliance officers and practice administrators expect.",
      // exact from developer-profile.md
      outcome:
        "Consolidated patient scheduling and management into a single interface, replacing disconnected spreadsheet workflows",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
      url: "https://southfield-healthcare.vercel.app",
      relevance:
        "Shows healthcare domain fluency — provider management, clinical workflows, and the structured layout that healthcare B2B buyers recognize as credible software.",
    },
    {
      name: "DealerHub — Automotive SaaS",
      description:
        "Multi-tenant automotive dealership platform with role-based access control, inventory management, lead scoring, and reconditioning pipeline. The RBAC architecture here maps directly to your org_admin / compliance_officer / clinician / viewer role structure.",
      // exact from developer-profile.md
      outcome:
        "Full dealership ops platform — inventory, leads, appraisals, and reconditioning all in one place",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
      url: "https://dealer-platform-neon.vercel.app",
      relevance:
        "Multi-tenant RBAC is the architectural core of your platform — this demonstrates exactly that pattern in a production-grade SaaS context.",
    },
    {
      name: "PayGuard — Transaction Monitor",
      description:
        "Compliance monitoring dashboard with real-time flagging, linked account tracking, alert management, and prohibited merchant detection. The mental model is identical to OIG exclusion monitoring — scan a data set, surface hits, manage the alert queue.",
      // exact from developer-profile.md
      outcome:
        "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery tracking",
      tech: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Recharts"],
      url: "https://payment-monitor.vercel.app",
      relevance:
        "Compliance flagging and alert workflow is exactly what your Exclusion Screening and Findings & CAPs modules require — same pattern, different domain.",
    },
  ],

  // Steps adapted to this specific project type: multi-tenant SaaS MVP build
  // Not generic Understand/Build/Ship/Iterate — follows the actual engineering phases
  // for a regulated healthcare compliance platform with security requirements.
  approachSteps: [
    {
      step: "01",
      title: "Architecture Design",
      description:
        "Start with the data model: tenant isolation strategy, RBAC permission matrix, and domain scoring schema. These decisions shape everything else — getting them right on paper before writing a line saves weeks of refactoring. I'll document the schema and API contracts so we're aligned before implementation starts.",
      timeline: "Days 1–4",
    },
    {
      step: "02",
      title: "Data Layer & Multi-Tenancy",
      description:
        "PostgreSQL schema with Row-Level Security or org-scoped queries — your choice of isolation approach documented with tradeoffs. Prisma ORM for type-safe queries. S3-compatible presigned URLs for the document vault. The compliance data model (orgs, findings, CAPs, providers) implemented and seeded with realistic test data.",
      timeline: "Days 5–10",
    },
    {
      step: "03",
      title: "Feature Modules",
      description:
        "Risk scoring dashboard, intake assessment forms, document vault with upload/expiry tracking, findings and CAP tracker, exclusion screening records, and audit trail — built module by module. You see working software at the end of each week, not at delivery. Each module is testable independently before the next begins.",
      timeline: "Days 11–28",
    },
    {
      step: "04",
      title: "RBAC & Security",
      description:
        "Role enforcement at the API and UI layer — org_admin, compliance_officer, clinician, and viewer roles each see only what their access level permits. Server-side permission checks on every protected route. AWS S3 presigned URLs expire after access. HIPAA-aware logging patterns in the audit trail.",
      timeline: "Days 22–32",
    },
    {
      step: "05",
      title: "QA & Deploy",
      description:
        "End-to-end testing across all role types and tenant boundaries. TypeScript strict mode with zero build errors. Deployed to Vercel with environment variable management. Clean handoff documentation covering schema, API shape, and the permission model — so your team can extend it without needing me to explain it.",
      timeline: "Days 33–40",
    },
  ],

  // Filtered to exactly what this job requires — no AI, no n8n, no Shopify
  skillCategories: [
    {
      label: "Frontend",
      skills: [
        "Next.js (App Router)",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
        "Recharts",
      ],
    },
    {
      label: "Backend & APIs",
      skills: [
        "Node.js",
        "REST API design",
        "PostgreSQL",
        "Prisma ORM",
        "Row-Level Security",
      ],
    },
    {
      label: "Infrastructure",
      skills: ["AWS S3", "Presigned URLs", "Vercel", "GitHub Actions"],
    },
    {
      label: "Architecture",
      skills: [
        "Multi-Tenant SaaS",
        "RBAC (Role-Based Access Control)",
        "Audit Trail Design",
        "TypeScript strict mode",
      ],
    },
  ],

  cta: {
    // Specific to this job: 120-200 hour scope, client wants an architectural thinker
    heading: "Let's build the compliance platform your clients actually need.",
    subtext:
      "The demo shows the risk scoring dashboard, document vault, exclusion tracking, and CAP workflow — all the pieces. The production build starts with the data model, so the architecture is sound before we write a feature line. 120–200 hours, scoped by module, visible progress weekly.",
    authorName: "Humam",
  },
};
