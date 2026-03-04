"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  MapPin,
  ShieldCheck,
  X,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  organizations,
  complianceUsers,
  findings,
  correctiveActionPlans,
} from "@/data/mock-data";
import type {
  Organization,
  ComplianceRiskTier,
  OrganizationType,
  UserRole,
} from "@/lib/types";

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

function getComplianceOfficerName(officerId: string | null): string {
  if (!officerId) return "Unassigned";
  const u = complianceUsers.find((u) => u.id === officerId);
  return u ? `${u.firstName} ${u.lastName}` : officerId;
}

function getUsersByOrg(orgId: string) {
  return complianceUsers.filter((u) => u.orgId === orgId);
}

function getOrgFindings(orgId: string) {
  return findings.filter((f) => f.orgId === orgId);
}

function getOrgCaps(orgId: string) {
  return correctiveActionPlans.filter((c) => c.orgId === orgId);
}

// ---------------------------------------------------------------------------
// Risk tier badge
// ---------------------------------------------------------------------------

type ExtendedRiskTier = ComplianceRiskTier | "pending_assessment";

function RiskTierBadge({ tier }: { tier: ExtendedRiskTier }) {
  const configs: Record<
    ExtendedRiskTier,
    { label: string; colorClass: string; Icon: React.ElementType }
  > = {
    compliant: {
      label: "Compliant",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
      Icon: CheckCircle2,
    },
    at_risk: {
      label: "At Risk",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
      Icon: AlertTriangle,
    },
    high_risk: {
      label: "High Risk",
      colorClass: "text-destructive bg-destructive/10",
      Icon: AlertTriangle,
    },
    critical: {
      label: "Critical",
      colorClass: "text-destructive bg-destructive/10",
      Icon: AlertTriangle,
    },
    pending_assessment: {
      label: "Baseline Pending",
      colorClass: "text-muted-foreground bg-muted",
      Icon: Clock,
    },
  };
  const c = configs[tier] ?? configs.pending_assessment;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-full inline-flex items-center gap-1 px-2 whitespace-nowrap",
        c.colorClass
      )}
    >
      <c.Icon className="w-3 h-3" />
      {c.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Org type badge
// ---------------------------------------------------------------------------

function OrgTypeBadge({ type }: { type: OrganizationType }) {
  const labels: Record<OrganizationType, string> = {
    physician_practice: "Physician Practice",
    insurer: "Insurer / Health Plan",
    pe_group: "PE Group / MSO",
  };
  return (
    <span className="text-xs text-muted-foreground font-medium">
      {labels[type]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// RBAC role badge
// ---------------------------------------------------------------------------

function RoleBadge({ role }: { role: UserRole }) {
  const configs: Record<
    UserRole,
    { label: string; colorClass: string }
  > = {
    org_admin: {
      label: "Org Admin",
      colorClass: "text-primary bg-primary/10",
    },
    compliance_officer: {
      label: "Compliance Officer",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
    },
    clinician: {
      label: "Clinician",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    viewer: {
      label: "Viewer",
      colorClass: "text-muted-foreground bg-muted",
    },
  };
  const c = configs[role] ?? configs.viewer;
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border-0 rounded-full px-2",
        c.colorClass
      )}
    >
      {c.label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Compliance score cell
// ---------------------------------------------------------------------------

function ScoreCell({ score }: { score: number | null }) {
  if (score === null)
    return (
      <span className="text-xs text-muted-foreground font-mono italic">
        Pending
      </span>
    );
  const colorClass =
    score >= 80
      ? "text-[color:var(--success)]"
      : score >= 60
      ? "text-[color:var(--warning)]"
      : "text-destructive";
  return (
    <div className="flex items-center gap-2">
      <span className={cn("text-sm font-bold font-mono tabular-nums", colorClass)}>
        {score}
      </span>
      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden w-16">
        <div
          className={cn(
            "h-full rounded-full",
            score >= 80
              ? "bg-[color:var(--success)]"
              : score >= 60
              ? "bg-[color:var(--warning)]"
              : "bg-destructive"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Organization detail sheet
// ---------------------------------------------------------------------------

function OrgDetailSheet({
  org,
  onClose,
}: {
  org: Organization | null;
  onClose: () => void;
}) {
  if (!org) return null;

  const users = getUsersByOrg(org.id);
  const orgFindings = getOrgFindings(org.id);
  const orgCaps = getOrgCaps(org.id);
  const openCaps = orgCaps.filter((c) => c.status !== "verified");
  const overdueCaps = orgCaps.filter((c) => c.status === "overdue" || c.status === "escalated");

  return (
    <Sheet open={!!org} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base font-semibold leading-snug">
            {org.name}
          </SheetTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <OrgTypeBadge type={org.type} />
            <RiskTierBadge tier={org.riskTier} />
          </div>
        </SheetHeader>

        <div className="space-y-5">
          {/* Compliance overview */}
          <div className="grid grid-cols-2 gap-3">
            <div className="aesthetic-card p-3 text-center">
              <div
                className={cn(
                  "text-2xl font-bold font-mono",
                  !org.overallComplianceScore
                    ? "text-muted-foreground"
                    : org.overallComplianceScore >= 80
                    ? "text-[color:var(--success)]"
                    : org.overallComplianceScore >= 60
                    ? "text-[color:var(--warning)]"
                    : "text-destructive"
                )}
              >
                {org.overallComplianceScore ?? "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Compliance Score
              </div>
            </div>
            <div className="aesthetic-card p-3 text-center">
              <div
                className={cn(
                  "text-2xl font-bold font-mono",
                  org.openFindingsCount > 0
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--success)]"
                )}
              >
                {org.openFindingsCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Open Findings
              </div>
            </div>
            <div className="aesthetic-card p-3 text-center">
              <div
                className={cn(
                  "text-2xl font-bold font-mono",
                  org.overdueCapCount > 0 ? "text-destructive" : "text-[color:var(--success)]"
                )}
              >
                {org.overdueCapCount}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Overdue CAPs
              </div>
            </div>
            <div className="aesthetic-card p-3 text-center">
              <div
                className={cn(
                  "text-2xl font-bold font-mono",
                  (org.trainingCompletionRate ?? 0) < 60
                    ? "text-[color:var(--warning)]"
                    : "text-foreground"
                )}
              >
                {org.trainingCompletionRate != null
                  ? `${org.trainingCompletionRate}%`
                  : "—"}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Training Completion
              </div>
            </div>
          </div>

          {/* Organization details */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Organization Details
            </h3>
            <dl className="space-y-2">
              {org.npi && (
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">NPI</dt>
                  <dd className="font-mono font-medium">{org.npi}</dd>
                </div>
              )}
              {org.ein && (
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">EIN</dt>
                  <dd className="font-mono font-medium">{org.ein}</dd>
                </div>
              )}
              {org.primarySpecialty && (
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">Specialty</dt>
                  <dd>{org.primarySpecialty}</dd>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Providers</dt>
                <dd className="font-mono font-medium">{org.providerCount ?? "—"}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">States</dt>
                <dd>{org.statesOfOperation.join(", ")}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Compliance Officer</dt>
                <dd>{getComplianceOfficerName(org.complianceOfficerId)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Last Assessment</dt>
                <dd className="font-mono">{formatDate(org.lastAssessmentDate)}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Next Assessment Due</dt>
                <dd
                  className={cn(
                    "font-mono",
                    org.assessmentStatus === "overdue"
                      ? "text-destructive font-medium"
                      : ""
                  )}
                >
                  {formatDate(org.nextAssessmentDue)}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-muted-foreground">Policy Attestation Rate</dt>
                <dd
                  className={cn(
                    "font-mono font-medium",
                    (org.policyAttestationRate ?? 0) < 70
                      ? "text-[color:var(--warning)]"
                      : "text-[color:var(--success)]"
                  )}
                >
                  {org.policyAttestationRate != null
                    ? `${org.policyAttestationRate}%`
                    : "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* RBAC user roster */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              User Roster &amp; RBAC Roles
            </h3>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No users assigned to this organization.
              </p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-2 border-b border-border/60 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {u.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RoleBadge role={u.role} />
                      {u.status === "pending_invitation" && (
                        <Badge
                          variant="outline"
                          className="text-xs border-0 bg-muted text-muted-foreground rounded-full"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Open findings summary */}
          {orgFindings.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Open Findings ({orgFindings.filter(f => f.status !== "verified" && f.status !== "waived").length})
              </h3>
              <div className="space-y-1.5">
                {orgFindings
                  .filter(
                    (f) => f.status !== "verified" && f.status !== "waived"
                  )
                  .slice(0, 5)
                  .map((f) => (
                    <div
                      key={f.id}
                      className={cn(
                        "flex items-start gap-2 text-xs p-2 rounded-md",
                        f.severity === "critical"
                          ? "bg-destructive/8 text-destructive"
                          : f.severity === "high"
                          ? "bg-[color:var(--warning)]/8 text-[color:var(--warning)]"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{f.title}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tenant isolation note */}
          <div className="aesthetic-card p-3 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-primary">
                  Tenant Isolation Active
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Data for this organization is isolated at the row-security
                  level. Users in other tenants cannot access these records.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              Initiate Assessment
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              View Findings
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [sortKey, setSortKey] = useState<
    "name" | "overallComplianceScore" | "openFindingsCount" | "lastAssessmentDate"
  >("overallComplianceScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Risk tier summary counts
  const riskSummary = useMemo(
    () => ({
      compliant: organizations.filter((o) => o.riskTier === "compliant").length,
      at_risk: organizations.filter((o) => o.riskTier === "at_risk").length,
      high_risk: organizations.filter((o) => o.riskTier === "high_risk").length,
      critical: organizations.filter((o) => o.riskTier === "critical").length,
      pending_assessment: organizations.filter(
        (o) => o.riskTier === "pending_assessment"
      ).length,
    }),
    []
  );

  const displayed = useMemo(() => {
    return organizations
      .filter((o) => {
        const matchSearch =
          search === "" ||
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          (o.primarySpecialty ?? "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          o.statesOfOperation.some((s) =>
            s.toLowerCase().includes(search.toLowerCase())
          );
        const matchType = typeFilter === "all" || o.type === typeFilter;
        const matchRisk = riskFilter === "all" || o.riskTier === riskFilter;
        return matchSearch && matchType && matchRisk;
      })
      .sort((a, b) => {
        let av: string | number;
        let bv: string | number;
        switch (sortKey) {
          case "overallComplianceScore":
            av = a.overallComplianceScore ?? -1;
            bv = b.overallComplianceScore ?? -1;
            break;
          case "openFindingsCount":
            av = a.openFindingsCount;
            bv = b.openFindingsCount;
            break;
          case "lastAssessmentDate":
            av = a.lastAssessmentDate ?? "";
            bv = b.lastAssessmentDate ?? "";
            break;
          default:
            av = a.name;
            bv = b.name;
        }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, typeFilter, riskFilter, sortKey, sortDir]);

  function handleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const SortIcon = ({ col }: { col: typeof sortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-3 h-3" />
      ) : (
        <ChevronDown className="w-3 h-3" />
      )
    ) : null;

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Multi-tenant organization management — practices, insurers, and PE
            groups with RBAC role assignment and tenant isolation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Portfolio
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Organization
          </Button>
        </div>
      </div>

      {/* Risk tier summary — clickable filter chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(
          [
            {
              tier: "compliant",
              label: "Compliant",
              colorClass: "text-[color:var(--success)]",
            },
            {
              tier: "at_risk",
              label: "At Risk",
              colorClass: "text-[color:var(--warning)]",
            },
            {
              tier: "high_risk",
              label: "High Risk",
              colorClass: "text-destructive",
            },
            {
              tier: "critical",
              label: "Critical",
              colorClass: "text-destructive",
            },
            {
              tier: "pending_assessment",
              label: "Baseline Pending",
              colorClass: "text-muted-foreground",
            },
          ] as const
        ).map((s) => (
          <button
            key={s.tier}
            onClick={() =>
              setRiskFilter((prev) => (prev === s.tier ? "all" : s.tier))
            }
            className={cn(
              "aesthetic-card p-3 text-left cursor-pointer",
              riskFilter === s.tier && "border-primary/40 bg-primary/5"
            )}
            style={{ transition: "border-color var(--t-interactive), background-color var(--t-interactive)" }}
          >
            <div className={cn("text-2xl font-bold font-mono", s.colorClass)}>
              {riskSummary[s.tier]}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations, specialties, or states..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All org types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="physician_practice">Physician Practice</SelectItem>
            <SelectItem value="insurer">Insurer / Health Plan</SelectItem>
            <SelectItem value="pe_group">PE Group / MSO</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All risk tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Tiers</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="high_risk">High Risk</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="pending_assessment">Baseline Pending</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length}{" "}
          {displayed.length === 1 ? "organization" : "organizations"}
        </span>
      </div>

      {/* Organizations table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("name")}
                >
                  <span className="flex items-center gap-1">
                    Organization
                    <SortIcon col="name" />
                  </span>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Type
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Risk Tier
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("overallComplianceScore")}
                >
                  <span className="flex items-center gap-1">
                    Compliance Score
                    <SortIcon col="overallComplianceScore" />
                  </span>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("openFindingsCount")}
                >
                  <span className="flex items-center gap-1">
                    Open Findings
                    <SortIcon col="openFindingsCount" />
                  </span>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Overdue CAPs
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  States
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("lastAssessmentDate")}
                >
                  <span className="flex items-center gap-1">
                    Last Assessment
                    <SortIcon col="lastAssessmentDate" />
                  </span>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No organizations match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((org) => {
                  const users = getUsersByOrg(org.id);
                  const isCritical =
                    org.riskTier === "critical" || org.overdueCapCount >= 5;

                  return (
                    <TableRow
                      key={org.id}
                      className={cn(
                        "hover:bg-[color:var(--surface-hover)] cursor-pointer",
                        isCritical && "bg-destructive/3 hover:bg-destructive/5"
                      )}
                      style={{
                        transition: "background-color var(--t-interactive)",
                      }}
                      onClick={() => setSelectedOrg(org)}
                    >
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{org.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {org.primarySpecialty && (
                              <span className="text-xs text-muted-foreground">
                                {org.primarySpecialty}
                              </span>
                            )}
                            {org.providerCount && (
                              <span className="text-xs text-muted-foreground font-mono">
                                {org.providerCount} providers
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <OrgTypeBadge type={org.type} />
                      </TableCell>
                      <TableCell>
                        <RiskTierBadge tier={org.riskTier} />
                      </TableCell>
                      <TableCell>
                        <ScoreCell score={org.overallComplianceScore} />
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums">
                        {org.openFindingsCount > 0 ? (
                          <span className="text-[color:var(--warning)] font-medium">
                            {org.openFindingsCount}
                          </span>
                        ) : (
                          <span className="text-[color:var(--success)]">0</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums">
                        {org.overdueCapCount > 0 ? (
                          <span className="text-destructive font-medium">
                            {org.overdueCapCount}
                          </span>
                        ) : (
                          <span className="text-[color:var(--success)]">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground/60 shrink-0" />
                          {org.statesOfOperation.join(", ")}
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-mono text-sm tabular-nums",
                          org.assessmentStatus === "overdue"
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(org.lastAssessmentDate)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrg(org);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* RBAC overview cards for quick reference */}
      <div>
        <h2 className="text-base font-semibold mb-3">
          User Roster by Organization
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations
            .filter((o) => getUsersByOrg(o.id).length > 0)
            .slice(0, 6)
            .map((org, idx) => {
              const users = getUsersByOrg(org.id);
              return (
                <div
                  key={org.id}
                  className="aesthetic-card p-4 cursor-pointer hover:border-primary/30"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => setSelectedOrg(org)}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {org.name}
                      </p>
                      <OrgTypeBadge type={org.type} />
                    </div>
                    <RiskTierBadge tier={org.riskTier} />
                  </div>
                  <div className="space-y-1.5">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className="text-muted-foreground truncate">
                          {u.firstName} {u.lastName}
                        </span>
                        <RoleBadge role={u.role} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {users.length} user{users.length !== 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Tenant isolated
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Organization detail sheet */}
      <OrgDetailSheet
        org={selectedOrg}
        onClose={() => setSelectedOrg(null)}
      />
    </div>
  );
}
