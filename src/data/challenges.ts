import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers building multi-tenant healthcare platforms add org-level filtering as an afterthought — row-level conditions sprinkled into individual queries after the data layer is already shaped. In regulated healthcare, that approach creates invisible cross-tenant exposure that no integration test will ever catch.",
  differentApproach:
    "I design tenant isolation as a structural constraint at the data access layer — every query runs through an org-scoped context object that gets injected at middleware, so no query can physically execute without the tenantId in scope. Compliance officers don't need to trust the application logic; the architecture makes leakage structurally impossible.",
  accentWord: "structurally impossible",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Multi-Tenant Data Isolation at the Org Level",
    description:
      "In a platform serving physician practices, insurers, and PE portfolio groups simultaneously, a single leaky query can expose one tenant's risk assessment findings to another. Traditional filtering-by-column approaches rely on developers remembering to add the WHERE clause — which is not a compliance-grade guarantee.",
    visualizationType: "architecture",
    outcome:
      "Could eliminate cross-tenant data leakage risk — every query is scoped to org context before reaching the database, making it structurally impossible for BlueStar Health Network to see Vantage Health Partners' Corrective Action Plans.",
  },
  {
    id: "challenge-2",
    title: "Rule-Based Compliance Risk Scoring Engine",
    description:
      "Compliance scores aren't a simple average of checkboxes. Each of the OIG's seven elements carries a different weight, findings have severity tiers, and CAP resolution status should dynamically update the domain score it resolved. Building a scoring engine that reflects real regulatory weight — not just a raw percentage — is where most compliance tools fall short.",
    visualizationType: "flow",
    outcome:
      "Could reduce compliance gap identification from manual monthly score reviews to real-time triggered re-scoring after each CAP verification — so a compliance officer at Ridgeline Family Medicine Group sees their updated Billing & Coding score within seconds of closing a finding.",
  },
  {
    id: "challenge-3",
    title: "Secure Document Upload with Presigned URL Flow",
    description:
      "PHI-adjacent documents — HIPAA Security Risk Analyses, Physician Compensation Agreements, Exclusion Screening Reports — cannot go through the application server. A naive implementation that accepts file uploads at a Next.js API route exposes S3 credentials in server memory and creates an audit trail gap. The right pattern requires a presigned URL flow where credentials never leave the backend.",
    visualizationType: "flow",
    outcome:
      "Could replace insecure direct-upload patterns with a server-side presigned URL flow that never exposes S3 credentials to the client — and ensures every document upload event writes a timestamped entry to the Audit Log with the uploader's role, orgId, and document type.",
  },
  {
    id: "challenge-4",
    title: "RBAC Enforcement Across Routes and API Endpoints",
    description:
      "Three distinct role tiers — Org Admin, Compliance Officer, and Viewer — must see different data and trigger different actions. Role checking scattered across individual page components creates gaps: a viewer who navigates directly to /organizations/settings should not reach that page, and that enforcement cannot rely on UI hiding alone.",
    visualizationType: "before-after",
    outcome:
      "Could ensure org admin, clinician, and viewer permission boundaries are enforced at the Next.js middleware layer — audit-proof from day one, so a role boundary violation is impossible without a middleware bypass, not just an absent button.",
  },
];
