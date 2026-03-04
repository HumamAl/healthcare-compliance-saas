# Screening Answers — Healthcare Compliance SaaS MVP

---

**1. A brief description of a SaaS product you architected from scratch**

Built Tinnitus Therapy SaaS — multi-clinic platform with patient intake, treatment protocols, RBAC, and clinic-level analytics. Full architecture from schema to deployment. Also built a compliance monitoring dashboard (PayGuard) with flagging, alert delivery, and audit trail. Demo for your project: {VERCEL_URL}

---

**2. How you would structure multi-tenant data isolation**

Org-scoped foreign keys on every table with Prisma middleware injecting `orgId` into every query. No RLS shortcut. Application-layer enforcement with a typed `TenantContext` passed through the request lifecycle. Cross-tenant leakage becomes a type error, not a runtime risk.

---

**3. Your estimated timeline for a functional MVP of this scope**

10-12 weeks for a working MVP covering RBAC, intake forms feeding the rule-based risk scoring engine, document vault with presigned URLs, and audit trail. Weeks 1-2 are schema and API-first backend. The demo shows the full scope: {VERCEL_URL}

---

**4. Your availability over the next 6–8 weeks**

Available to start within the week. Already built the demo to show how I'd approach the architecture. {VERCEL_URL} — we'd skip the "explain your approach" phase and go straight to scoping.
