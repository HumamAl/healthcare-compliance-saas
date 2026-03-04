"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { organizations } from "@/data/mock-data";
import type { AssessmentStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Derived assessment records from organizations
// ---------------------------------------------------------------------------

const assessmentRecords = organizations.map((org) => ({
  id: `assess_${org.id}`,
  orgId: org.id,
  orgName: org.name,
  orgType: org.type,
  specialty: org.primarySpecialty ?? "Portfolio Entity",
  assessmentStatus: org.assessmentStatus,
  lastAssessmentDate: org.lastAssessmentDate,
  nextAssessmentDue: org.nextAssessmentDue,
  overallComplianceScore: org.overallComplianceScore,
  providerCount: org.providerCount ?? 0,
  openFindingsCount: org.openFindingsCount,
}));

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface IntakeFormState {
  orgName: string;
  npi: string;
  ein: string;
  specialty: string;
  providerCount: string;
  statesOfOperation: string;
  hasBillingPolicy: string;
  lastBillingAudit: string;
  usesThirdPartyBilling: string;
  claimReviewRate: string;
  racAuditHistory: string;
  lastSraDate: string;
  hasBaaInventory: string;
  phiBreachHistory: string;
  hasIncidentResponsePlan: string;
  hipaaTrainingCurrent: string;
  hasCredentialingPolicy: string;
  monthlyOigScreening: string;
  allLicensesCurrent: string;
  allPayerEnrollmentsCurrent: string;
}

const initialForm: IntakeFormState = {
  orgName: "",
  npi: "",
  ein: "",
  specialty: "",
  providerCount: "",
  statesOfOperation: "",
  hasBillingPolicy: "",
  lastBillingAudit: "",
  usesThirdPartyBilling: "",
  claimReviewRate: "",
  racAuditHistory: "",
  lastSraDate: "",
  hasBaaInventory: "",
  phiBreachHistory: "",
  hasIncidentResponsePlan: "",
  hipaaTrainingCurrent: "",
  hasCredentialingPolicy: "",
  monthlyOigScreening: "",
  allLicensesCurrent: "",
  allPayerEnrollmentsCurrent: "",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ScorePill({ score }: { score: number | null }) {
  if (score === null)
    return (
      <span className="text-xs text-muted-foreground font-mono italic">
        Pending
      </span>
    );
  const colorClass =
    score >= 80
      ? "text-[color:var(--success)] bg-[color:var(--success)]/10"
      : score >= 60
      ? "text-[color:var(--warning)] bg-[color:var(--warning)]/10"
      : "text-destructive bg-destructive/10";
  return (
    <span
      className={cn(
        "text-xs font-mono font-semibold px-2 py-0.5 rounded-full",
        colorClass
      )}
    >
      {score}
    </span>
  );
}

function AssessmentStatusBadge({ status }: { status: AssessmentStatus }) {
  const configs: Record<
    AssessmentStatus,
    { label: string; colorClass: string; Icon: React.ElementType }
  > = {
    completed: {
      label: "Completed",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
      Icon: CheckCircle2,
    },
    in_progress: {
      label: "In Progress",
      colorClass: "text-primary bg-primary/10",
      Icon: Clock,
    },
    pending_review: {
      label: "Pending Review",
      colorClass:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
      Icon: Clock,
    },
    not_initiated: {
      label: "Not Initiated",
      colorClass: "text-muted-foreground bg-muted",
      Icon: FileText,
    },
    overdue: {
      label: "Overdue",
      colorClass: "text-destructive bg-destructive/10",
      Icon: AlertTriangle,
    },
  };
  const c = configs[status] ?? configs.not_initiated;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-full inline-flex items-center gap-1 px-2",
        c.colorClass
      )}
    >
      <c.Icon className="w-3 h-3" />
      {c.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Risk score preview from form
// ---------------------------------------------------------------------------

function estimateRiskScore(form: IntakeFormState): number | null {
  const answered = Object.values(form).filter((v) => v !== "").length;
  if (answered < 5) return null;
  let score = 45;
  if (form.hasBillingPolicy === "yes") score += 6;
  if (form.claimReviewRate === "5_10" || form.claimReviewRate === "gt10")
    score += 6;
  if (form.lastSraDate) score += 8;
  if (form.hasBaaInventory === "yes") score += 6;
  if (form.hipaaTrainingCurrent === "yes") score += 5;
  if (form.hasCredentialingPolicy === "yes") score += 4;
  if (form.monthlyOigScreening === "yes") score += 9;
  if (form.allLicensesCurrent === "yes") score += 5;
  if (form.phiBreachHistory === "no") score += 4;
  if (form.racAuditHistory === "no") score += 5;
  if (form.usesThirdPartyBilling === "yes" && form.hasBaaInventory === "yes")
    score += 3;
  return Math.min(score, 100);
}

// ---------------------------------------------------------------------------
// Form section accordion
// ---------------------------------------------------------------------------

function FormSection({
  title,
  oigElement,
  children,
  defaultOpen = false,
}: {
  title: string;
  oigElement: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="aesthetic-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[color:var(--surface-hover)] transition-colors"
        style={{ transition: "background-color var(--t-interactive)" }}
      >
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{oigElement}</p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border/60 pt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Radio option group
// ---------------------------------------------------------------------------

function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md border cursor-pointer text-sm",
              "transition-all",
              value === opt.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:bg-[color:var(--surface-hover)]"
            )}
            style={{ transition: "border-color var(--t-interactive), background-color var(--t-interactive)" }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={cn(
                "w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0",
                value === opt.value
                  ? "border-primary"
                  : "border-muted-foreground/40"
              )}
            >
              {value === opt.value && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </span>
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function IntakePage() {
  const [form, setForm] = useState<IntakeFormState>(initialForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<
    "orgName" | "lastAssessmentDate" | "overallComplianceScore"
  >("lastAssessmentDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [submitted, setSubmitted] = useState(false);

  const updateForm = <K extends keyof IntakeFormState>(
    key: K,
    value: IntakeFormState[K]
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const estimatedScore = useMemo(() => estimateRiskScore(form), [form]);

  const displayedAssessments = useMemo(() => {
    return assessmentRecords
      .filter((a) => {
        const matchSearch =
          search === "" ||
          a.orgName.toLowerCase().includes(search.toLowerCase()) ||
          a.specialty.toLowerCase().includes(search.toLowerCase());
        const matchStatus =
          statusFilter === "all" || a.assessmentStatus === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        let av: string | number =
          sortKey === "overallComplianceScore"
            ? (a.overallComplianceScore ?? -1)
            : sortKey === "lastAssessmentDate"
            ? (a.lastAssessmentDate ?? "")
            : a.orgName;
        let bv: string | number =
          sortKey === "overallComplianceScore"
            ? (b.overallComplianceScore ?? -1)
            : sortKey === "lastAssessmentDate"
            ? (b.lastAssessmentDate ?? "")
            : b.orgName;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, sortKey, sortDir]);

  function handleSort(
    key: "orgName" | "lastAssessmentDate" | "overallComplianceScore"
  ) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "unknown", label: "Unknown" },
  ];

  const yesNoDevOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "in_development", label: "In Development" },
  ];

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Intake &amp; Assessment
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Initiate compliance risk assessments aligned to OIG GCPG Seven
            Elements
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Initiate Assessment
          </Button>
        </div>
      </div>

      {/* Two-column: form + history */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Intake form — 3 cols */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">New Risk Assessment Intake</h2>
            {estimatedScore !== null && !submitted && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Live estimate:
                </span>
                <ScorePill score={estimatedScore} />
              </div>
            )}
          </div>

          {submitted ? (
            <div className="aesthetic-card p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[color:var(--success)]/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-[color:var(--success)]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Assessment Submitted</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Intake responses received. Compliance Officer will review and
                  publish domain scores within 2–3 business days.
                </p>
              </div>
              {estimatedScore !== null && (
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  Preliminary estimate:
                  <ScorePill score={estimatedScore} />
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setForm(initialForm);
                  setSubmitted(false);
                }}
              >
                Start New Assessment
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <FormSection
                title="Section A: Organization Information"
                oigElement="OIG GCPG — General Program Structure"
                defaultOpen
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Organization Legal Name</label>
                    <Input
                      placeholder="e.g. Ridgeline Family Medicine Group"
                      value={form.orgName}
                      onChange={(e) => updateForm("orgName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">NPI (National Provider Identifier)</label>
                    <Input
                      placeholder="10-digit NPI"
                      value={form.npi}
                      onChange={(e) => updateForm("npi", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Tax ID (EIN)</label>
                    <Input
                      placeholder="XX-XXXXXXX"
                      value={form.ein}
                      onChange={(e) => updateForm("ein", e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Primary Specialty</label>
                    <Input
                      placeholder="e.g. Internal Medicine"
                      value={form.specialty}
                      onChange={(e) => updateForm("specialty", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Active Providers</label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="e.g. 8"
                      value={form.providerCount}
                      onChange={(e) =>
                        updateForm("providerCount", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">States of Operation</label>
                    <Input
                      placeholder="e.g. TX, FL"
                      value={form.statesOfOperation}
                      onChange={(e) =>
                        updateForm("statesOfOperation", e.target.value)
                      }
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection
                title="Section B: Billing &amp; Coding Compliance"
                oigElement="OIG Element 6 — Auditing &amp; Monitoring (Weight: 25%)"
              >
                <RadioGroup
                  label="Do you have a written billing compliance policy?"
                  name="hasBillingPolicy"
                  options={yesNoDevOptions}
                  value={form.hasBillingPolicy}
                  onChange={(v) => updateForm("hasBillingPolicy", v)}
                />
                <RadioGroup
                  label="Do you use a third-party billing company? (If yes, is a BAA in place?)"
                  name="usesThirdPartyBilling"
                  options={yesNoOptions}
                  value={form.usesThirdPartyBilling}
                  onChange={(v) => updateForm("usesThirdPartyBilling", v)}
                />
                <div className="space-y-1.5">
                  <p className="text-sm font-medium">
                    What percentage of claims are reviewed before submission?
                  </p>
                  <Select
                    value={form.claimReviewRate}
                    onValueChange={(v) => updateForm("claimReviewRate", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select review rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zero">0%</SelectItem>
                      <SelectItem value="lt5">Less than 5%</SelectItem>
                      <SelectItem value="5_10">5% – 10%</SelectItem>
                      <SelectItem value="gt10">Greater than 10%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <RadioGroup
                  label="Have you received a RAC audit in the last 3 years?"
                  name="racAuditHistory"
                  options={yesNoOptions}
                  value={form.racAuditHistory}
                  onChange={(v) => updateForm("racAuditHistory", v)}
                />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Date of last internal billing audit
                  </label>
                  <Input
                    type="date"
                    value={form.lastBillingAudit}
                    onChange={(e) =>
                      updateForm("lastBillingAudit", e.target.value)
                    }
                  />
                </div>
              </FormSection>

              <FormSection
                title="Section C: HIPAA Privacy &amp; Security"
                oigElement="OIG Element 1 — Written Policies &amp; Procedures (Weight: 20%)"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Date of last HIPAA Security Risk Analysis (SRA)
                  </label>
                  <Input
                    type="date"
                    value={form.lastSraDate}
                    onChange={(e) => updateForm("lastSraDate", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    OCR requires ongoing SRA. Older than 24 months triggers a
                    finding.
                  </p>
                </div>
                <RadioGroup
                  label="Do you maintain a current BAA inventory?"
                  name="hasBaaInventory"
                  options={[
                    { value: "yes", label: "Yes — complete" },
                    { value: "partial", label: "Partial" },
                    { value: "no", label: "No" },
                  ]}
                  value={form.hasBaaInventory}
                  onChange={(v) => updateForm("hasBaaInventory", v)}
                />
                <RadioGroup
                  label="Reportable PHI breach in the last 2 years?"
                  name="phiBreachHistory"
                  options={yesNoOptions}
                  value={form.phiBreachHistory}
                  onChange={(v) => updateForm("phiBreachHistory", v)}
                />
                <RadioGroup
                  label="Written HIPAA incident response plan?"
                  name="hasIncidentResponsePlan"
                  options={yesNoDevOptions}
                  value={form.hasIncidentResponsePlan}
                  onChange={(v) => updateForm("hasIncidentResponsePlan", v)}
                />
                <RadioGroup
                  label="Are workforce members trained on HIPAA annually?"
                  name="hipaaTrainingCurrent"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "inconsistently", label: "Inconsistently" },
                  ]}
                  value={form.hipaaTrainingCurrent}
                  onChange={(v) => updateForm("hipaaTrainingCurrent", v)}
                />
              </FormSection>

              <FormSection
                title="Section D: Credentialing &amp; Provider Status"
                oigElement="OIG Element 6 — Auditing &amp; Monitoring (Weight: 15%)"
              >
                <RadioGroup
                  label="Written credentialing policy in place?"
                  name="hasCredentialingPolicy"
                  options={yesNoDevOptions}
                  value={form.hasCredentialingPolicy}
                  onChange={(v) => updateForm("hasCredentialingPolicy", v)}
                />
                <RadioGroup
                  label="All providers screened against OIG LEIE at hire and monthly thereafter?"
                  name="monthlyOigScreening"
                  options={yesNoOptions}
                  value={form.monthlyOigScreening}
                  onChange={(v) => updateForm("monthlyOigScreening", v)}
                />
                <RadioGroup
                  label="All state medical licenses current and verified?"
                  name="allLicensesCurrent"
                  options={[
                    { value: "yes", label: "Yes — all current" },
                    { value: "no", label: "No" },
                    { value: "some_expired", label: "Some expired" },
                  ]}
                  value={form.allLicensesCurrent}
                  onChange={(v) => updateForm("allLicensesCurrent", v)}
                />
                <RadioGroup
                  label="All providers enrolled with applicable payers?"
                  name="allPayerEnrollmentsCurrent"
                  options={[
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "some_pending", label: "Some pending" },
                  ]}
                  value={form.allPayerEnrollmentsCurrent}
                  onChange={(v) =>
                    updateForm("allPayerEnrollmentsCurrent", v)
                  }
                />
              </FormSection>

              {/* Estimated score banner */}
              {estimatedScore !== null && (
                <div className="aesthetic-card p-4 border-primary/25 bg-primary/5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      Preliminary Risk Score Estimate
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Based on responses so far — final score issued after
                      assessment review
                    </p>
                  </div>
                  <div className="text-center shrink-0">
                    <div
                      className={cn(
                        "text-3xl font-bold font-mono",
                        estimatedScore >= 80
                          ? "text-[color:var(--success)]"
                          : estimatedScore >= 60
                          ? "text-[color:var(--warning)]"
                          : "text-destructive"
                      )}
                    >
                      {estimatedScore}
                    </div>
                    <div className="text-xs text-muted-foreground">/ 100</div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full">
                Submit for Review
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          )}
        </div>

        {/* Assessment history — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-semibold">Assessment History</h2>

          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search practices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="not_initiated">Not Initiated</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {displayedAssessments.length} of {assessmentRecords.length}{" "}
              assessments
            </p>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-0.5">
            {displayedAssessments.length === 0 ? (
              <div className="aesthetic-card p-6 text-center text-sm text-muted-foreground">
                No assessments match this filter.
              </div>
            ) : (
              displayedAssessments.map((a, idx) => (
                <div
                  key={a.id}
                  className="aesthetic-card p-3 cursor-pointer hover:border-primary/30"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{a.orgName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.specialty}
                        {a.providerCount > 0 && ` · ${a.providerCount} providers`}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <AssessmentStatusBadge status={a.assessmentStatus} />
                      <ScorePill score={a.overallComplianceScore} />
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/60 flex justify-between text-xs text-muted-foreground">
                    <span>
                      Last:{" "}
                      <span className="font-mono">
                        {formatDate(a.lastAssessmentDate)}
                      </span>
                    </span>
                    <span>
                      Due:{" "}
                      <span
                        className={cn(
                          "font-mono",
                          a.assessmentStatus === "overdue" &&
                            "text-destructive font-medium"
                        )}
                      >
                        {formatDate(a.nextAssessmentDue)}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">All Assessment Records</h2>
          <span className="text-sm text-muted-foreground">
            {displayedAssessments.length} of {assessmentRecords.length} shown
          </span>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("orgName")}
                  >
                    <span className="flex items-center gap-1">
                      Practice / Organization
                      {sortKey === "orgName" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </span>
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                    Assessment Status
                  </TableHead>
                  <TableHead
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort("lastAssessmentDate")}
                  >
                    <span className="flex items-center gap-1">
                      Last Assessment
                      {sortKey === "lastAssessmentDate" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </span>
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                    Next Due
                  </TableHead>
                  <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                    Open Findings
                  </TableHead>
                  <TableHead
                    className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground text-right"
                    onClick={() => handleSort("overallComplianceScore")}
                  >
                    <span className="flex items-center justify-end gap-1">
                      Score
                      {sortKey === "overallComplianceScore" &&
                        (sortDir === "asc" ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        ))}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedAssessments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-sm text-muted-foreground"
                    >
                      No assessments match this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedAssessments.map((a) => (
                    <TableRow
                      key={a.id}
                      className="hover:bg-[color:var(--surface-hover)] cursor-pointer"
                      style={{
                        transition: "background-color var(--t-interactive)",
                      }}
                    >
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{a.orgName}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {a.orgType.replace("_", " ")} · {a.specialty}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AssessmentStatusBadge status={a.assessmentStatus} />
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums text-muted-foreground">
                        {formatDate(a.lastAssessmentDate)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-mono text-sm tabular-nums",
                          a.assessmentStatus === "overdue"
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(a.nextAssessmentDue)}
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums">
                        {a.openFindingsCount > 0 ? (
                          <span className="text-[color:var(--warning)] font-medium">
                            {a.openFindingsCount}
                          </span>
                        ) : (
                          <span className="text-[color:var(--success)]">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <ScorePill score={a.overallComplianceScore} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
