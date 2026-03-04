import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Navigation & Layout
// ---------------------------------------------------------------------------

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// Screen definition for frame-based demo formats
export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

// ---------------------------------------------------------------------------
// Challenge & Proposal Types (used by Challenges and Proposal builders)
// ---------------------------------------------------------------------------

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ---------------------------------------------------------------------------
// Domain: Organizations (Tenants)
// ---------------------------------------------------------------------------

export type OrganizationType = "physician_practice" | "insurer" | "pe_group";

export type ComplianceRiskTier =
  | "compliant"    // Overall score 80-100
  | "at_risk"      // Overall score 60-79
  | "high_risk"    // Overall score 40-59
  | "critical";    // Overall score < 40

export type AssessmentStatus =
  | "not_initiated"
  | "in_progress"
  | "pending_review"
  | "completed"
  | "overdue";

export interface Organization {
  id: string;
  /** Legal name of the physician practice, insurer, or PE group */
  name: string;
  type: OrganizationType;
  /** NPI — National Provider Identifier (10-digit, physician practices only) */
  npi?: string;
  /** Tax ID / EIN */
  ein?: string;
  primarySpecialty?: string;
  providerCount: number;
  statesOfOperation: string[];
  /** Assigned compliance officer (references ComplianceUser.id) */
  complianceOfficerId: string | null;
  overallComplianceScore: number | null; // null if assessment not yet completed
  riskTier: ComplianceRiskTier | "pending_assessment";
  lastAssessmentDate: string | null;
  nextAssessmentDue: string | null;
  assessmentStatus: AssessmentStatus;
  /** Count of open (unresolved) findings */
  openFindingsCount: number;
  /** Count of overdue Corrective Action Plans */
  overdueCapCount: number;
  trainingCompletionRate: number | null; // 0-100 percentage
  policyAttestationRate: number | null;  // 0-100 percentage
  /** Parent org ID — used when practice is part of an insurer's or PE group's network */
  parentOrgId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Domain: Compliance Domain Scores (8 scored domains per org)
// ---------------------------------------------------------------------------

export type ComplianceDomain =
  | "billing_and_coding"
  | "hipaa_privacy_security"
  | "credentialing_enrollment"
  | "physician_arrangements"
  | "exclusion_screening"
  | "training_education"
  | "policies_procedures"
  | "incident_response";

export interface DomainScore {
  id: string;
  orgId: string;
  domain: ComplianceDomain;
  score: number;          // 0-100 integer
  /** OIG GCPG element this domain maps to */
  oigElement: string;
  /** Weight this domain carries in the overall compliance score rollup */
  weight: number;         // percentage, e.g., 25 for 25%
  openFindingsCount: number;
  lastScoredAt: string;
  scoreTrend: "improving" | "declining" | "stable";
}

// ---------------------------------------------------------------------------
// Domain: Findings
// ---------------------------------------------------------------------------

export type FindingSeverity = "critical" | "high" | "medium" | "low";

export type FindingStatus =
  | "open"
  | "in_remediation"     // CAP created and in progress
  | "pending_verification"
  | "verified"           // resolved and confirmed by compliance officer
  | "overdue"
  | "escalated"
  | "waived";

export interface Finding {
  id: string;
  orgId: string;
  domain: ComplianceDomain;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: FindingStatus;
  /** Person responsible for remediation (references ComplianceUser.id) */
  assignedToId: string | null;
  /** Associated CAP ID, if one has been created */
  capId: string | null;
  identifiedAt: string;
  targetResolutionDate: string | null;
  resolvedAt: string | null;
  /** OIG GCPG element this finding relates to */
  oigElementRef: string;
  /** Whether a CAP has been initiated */
  capInitiated: boolean;
}

// ---------------------------------------------------------------------------
// Domain: Corrective Action Plans (CAPs)
// ---------------------------------------------------------------------------

export type CapStatus =
  | "open"
  | "in_remediation"
  | "pending_verification"
  | "verified"
  | "overdue"
  | "escalated";

export interface CorrectiveActionPlan {
  id: string;
  findingId: string;
  orgId: string;
  title: string;
  description: string;
  /** Steps the CAP owner must complete to remediate the finding */
  remediationSteps: string[];
  status: CapStatus;
  /** CAP owner responsible for execution (references ComplianceUser.id) */
  ownerId: string;
  /** Compliance officer who will verify completion (references ComplianceUser.id) */
  verifierId: string;
  openedAt: string;
  targetDate: string;
  completedAt: string | null;
  verifiedAt: string | null;
  /** Days overdue (only meaningful when status === "overdue") */
  daysOverdue?: number;
  evidenceUploaded: boolean;
  lastUpdatedAt: string;
}

// ---------------------------------------------------------------------------
// Domain: Providers (with exclusion and credentialing status)
// ---------------------------------------------------------------------------

export type ProviderCredentialStatus =
  | "active"
  | "pending_enrollment"
  | "expired"
  | "excluded"           // OIG LEIE / SAM.gov confirmed — critical status
  | "suspended"
  | "re_attestation_required"; // CAQH ProView 120-day window lapsed

export type ExclusionScreeningResult =
  | "cleared"
  | "hit_review_required"  // potential match — manual investigation needed
  | "excluded"             // confirmed exclusion
  | "screening_overdue";   // not screened within required monthly interval

export interface Provider {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  credentials: string; // "MD", "DO", "NP", "PA-C"
  specialty: string;
  /** National Provider Identifier — 10-digit */
  npi: string;
  /** CAQH ProView ID */
  caqhId?: string;
  credentialStatus: ProviderCredentialStatus;
  /** State medical license expiry date — null if never entered */
  licenseExpiryDate: string | null;
  /** Date of last CAQH ProView re-attestation — must be within 120 days */
  lastCaqhAttestationDate: string | null;
  lastExclusionScreenDate: string | null;
  exclusionScreenResult: ExclusionScreeningResult;
  /** For "hit_review_required" or "excluded" — investigation notes */
  exclusionNote?: string | null;
  enrolledPayers: string[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Domain: Documents (Compliance Record Vault)
// ---------------------------------------------------------------------------

export type DocumentType =
  | "business_associate_agreement"
  | "medical_license"
  | "malpractice_certificate"
  | "physician_compensation_agreement"
  | "stark_law_exception_analysis"
  | "pp_manual"
  | "hipaa_security_risk_analysis"
  | "exclusion_screening_report"
  | "training_log"
  | "caqh_attestation_record"
  | "certificate_of_insurance"
  | "npdb_query_result";

export type DocumentStatus =
  | "current"
  | "expiring_soon"   // expires within 90 days
  | "expired"
  | "missing"
  | "under_review";

export interface ComplianceDocument {
  id: string;
  orgId: string;
  documentType: DocumentType;
  fileName: string;
  /** Display name for the document */
  displayName: string;
  status: DocumentStatus;
  /** Uploader (references ComplianceUser.id) — null if document is "missing" */
  uploadedById: string | null;
  uploadedAt: string | null;
  expiryDate: string | null;
  /** Required by a specific domain — helps show which finding this addresses */
  relatedDomain: ComplianceDomain | null;
  /** Presigned URL token placeholder — signals S3-compatible storage */
  presignedUrlToken?: string | null;
  fileSizeKb?: number | null;
  fileType?: string | null;
}

// ---------------------------------------------------------------------------
// Domain: Audit Events (Audit Trail)
// ---------------------------------------------------------------------------

export type AuditEventType =
  | "assessment_initiated"
  | "assessment_submitted"
  | "assessment_completed"
  | "finding_created"
  | "finding_assigned"
  | "cap_created"
  | "cap_status_changed"
  | "cap_verified"
  | "document_uploaded"
  | "document_expired"
  | "provider_screened"
  | "exclusion_hit_flagged"
  | "exclusion_hit_cleared"
  | "provider_status_changed"
  | "user_role_changed"
  | "org_created"
  | "report_exported"
  | "incident_reported";

export interface AuditEvent {
  id: string;
  orgId: string;
  eventType: AuditEventType;
  /** Human-readable description of the event */
  description: string;
  /** Actor who triggered the event (references ComplianceUser.id) */
  actorId: string;
  /** The entity this event pertains to (finding ID, provider ID, document ID, etc.) */
  targetEntityId?: string;
  targetEntityType?: "finding" | "cap" | "provider" | "document" | "assessment" | "org" | "user";
  /** IP address of the actor at the time of the event */
  ipAddress?: string;
  occurredAt: string;
  /** Any metadata payload — stringified JSON for the audit log detail view */
  metadataJson?: string;
}

// ---------------------------------------------------------------------------
// Domain: Compliance Users (RBAC)
// ---------------------------------------------------------------------------

export type UserRole =
  | "org_admin"       // full access within their org
  | "compliance_officer"
  | "clinician"
  | "viewer";         // read-only access

export type UserStatus = "active" | "inactive" | "pending_invitation";

export interface ComplianceUser {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  role: UserRole;
  status: UserStatus;
  /** Linked provider record (if this user is also a provider) */
  providerId?: string | null;
  lastLoginAt: string | null;
  invitedAt: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Domain: Incident Reports
// ---------------------------------------------------------------------------

export type IncidentType =
  | "privacy_breach_near_miss"
  | "billing_discrepancy"
  | "aks_concern"           // Anti-Kickback Statute concern
  | "stark_concern"         // Stark Law concern
  | "staff_policy_violation"
  | "excluded_provider_discovery"
  | "hipaa_complaint_received"
  | "self_disclosure";      // voluntary OIG/CMS self-disclosure — most serious

export type IncidentStatus =
  | "open"
  | "under_investigation"
  | "pending_review"
  | "resolved"
  | "self_disclosed"    // formal self-disclosure submitted to OIG/CMS
  | "closed";

export interface IncidentReport {
  id: string;
  orgId: string;
  incidentType: IncidentType;
  title: string;
  description: string;
  severity: FindingSeverity;
  status: IncidentStatus;
  reportedById: string;
  assignedToId: string | null;
  reportedAt: string;
  resolvedAt: string | null;
  involvedProviderIds: string[];
  /** Whether legal counsel has been notified */
  legalNotified: boolean;
  /** Self-disclosure case reference number, if applicable */
  selfDisclosureRef?: string | null;
}

// ---------------------------------------------------------------------------
// Domain: Exclusion Screening Records
// ---------------------------------------------------------------------------

export interface ExclusionScreeningRecord {
  id: string;
  orgId: string;
  providerId: string;
  /** Screening run date */
  screenedAt: string;
  result: ExclusionScreeningResult;
  /** Databases queried during this screening run */
  databasesChecked: string[];
  /** Notes for hits or overdue records */
  investigationNote?: string | null;
  /** Whether this was part of an automated monthly batch or a manual run */
  runType: "automated_batch" | "manual";
  resolvedAt?: string | null;
}

// ---------------------------------------------------------------------------
// Dashboard Stats (KPI Cards)
// ---------------------------------------------------------------------------

export interface DashboardStats {
  /** Weighted average compliance score across all active organizations */
  portfolioComplianceScore: number;
  scoreChangeVsLastMonth: number;       // points, positive = improving
  openFindings: number;
  openFindingsChange: number;           // count delta vs last month
  overdueCAPs: number;
  overdueCAPsChange: number;
  /** OIG LEIE / SAM.gov confirmed exclusion hits — any value > 0 is critical */
  exclusionHits: number;
  /** Providers not screened within the required monthly interval */
  exclusionChecksDue: number;
  /** Assessments past their annual due date */
  assessmentsPastDue: number;
  highRiskPractices: number;
  policyAttestationRate: number;        // % across all orgs
  trainingCompletionRate: number;       // % across all orgs
  incidentsReported30d: number;
  avgDaysToCapResolution: number;
  documentsExpiring90d: number;
}

// ---------------------------------------------------------------------------
// Chart Data Types
// ---------------------------------------------------------------------------

/** Monthly compliance score trend — for area/line chart */
export interface ComplianceScoreTrendPoint {
  month: string;           // "Mar 25", "Apr 25" etc.
  portfolioScore: number;  // overall weighted portfolio score
  compliantCount: number;  // orgs scoring 80+
  atRiskCount: number;     // orgs scoring 60-79
  highRiskCount: number;   // orgs scoring 40-59
  criticalCount: number;   // orgs scoring <40
}

/** Finding severity distribution by practice — for stacked bar chart */
export interface FindingSeverityByOrg {
  orgName: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

/** Domain score radar / bar chart — per org breakdown */
export interface DomainScoreChartPoint {
  domain: string;    // Short display label
  score: number;
  benchmark: number; // Industry average for this domain
}

/** Compliance score distribution histogram */
export interface ScoreDistributionPoint {
  range: string;    // "0-39", "40-59", "60-79", "80-100"
  count: number;
  label: string;    // "Critical", "High Risk", "At Risk", "Compliant"
}
