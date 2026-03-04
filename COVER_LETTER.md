Hi,

Multi-tenant compliance SaaS where a PE group, insurer, and physician practice each see only their own data — plus a rule-based risk scoring engine with triggered rationale per finding. Built a working version: https://healthcare-compliance-saas.vercel.app

Demo shows tenant isolation, RBAC across org admin / clinician / viewer roles, intake forms feeding the scoring engine, document vault with presigned URLs. Same multi-clinic architecture as Tinnitus Therapy SaaS I shipped last year.

Are risk scoring rules global across tenant types, or do PE portfolio views need different domain weights than a practice's self-assessment?

Quick call to align on scope, or I can draft the first sprint. Whatever works.

Humam

P.S. Happy to record a Loom walkthrough if that helps.
