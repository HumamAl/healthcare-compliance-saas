"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  AlertTriangle,
  ShieldAlert,
  FileWarning,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";

import {
  dashboardStats,
  organizations,
  findings,
  complianceScoreTrend,
  findingSeverityByOrg,
  complianceUsers,
  COMPLIANCE_DOMAIN_LABELS,
  RISK_TIER_LABELS,
} from "@/data/mock-data";
import { APP_CONFIG } from "@/lib/config";
import type { ComplianceRiskTier } from "@/lib/types";

// ---------------------------------------------------------------------------
// SSR-safe chart imports
// ---------------------------------------------------------------------------

const ComplianceTrendChart = dynamic(
  () =>
    import("@/components/dashboard/compliance-trend-chart").then(
      (m) => m.ComplianceTrendChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[260px] rounded bg-muted/30 animate-pulse" />
    ),
  }
);

const FindingsSeverityChart = dynamic(
  () =>
    import("@/components/dashboard/findings-severity-chart").then(
      (m) => m.FindingsSeverityChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[240px] rounded bg-muted/30 animate-pulse" />
    ),
  }
);

// ---------------------------------------------------------------------------
// Animated counter hook — viewport-triggered, ease-out
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration: number = 900) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
            else setCount(target);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ---------------------------------------------------------------------------
// Risk tier helpers
// ---------------------------------------------------------------------------

type RiskTierKey = ComplianceRiskTier | "pending_assessment";

const TIER_COLORS: Record<RiskTierKey, string> = {
  compliant: "var(--success)",
  at_risk: "var(--warning)",
  high_risk: "var(--destructive)",
  critical: "var(--destructive)",
  pending_assessment: "var(--muted-foreground)",
};

const TIER_BG: Record<RiskTierKey, string> = {
  compliant:
    "color-mix(in oklch, var(--success), transparent 85%)",
  at_risk:
    "color-mix(in oklch, var(--warning), transparent 82%)",
  high_risk:
    "color-mix(in oklch, var(--destructive), transparent 82%)",
  critical:
    "color-mix(in oklch, var(--destructive), transparent 78%)",
  pending_assessment:
    "color-mix(in oklch, var(--muted-foreground), transparent 88%)",
};

function scoreTierColor(score: number | null): string {
  if (score === null) return "var(--muted-foreground)";
  if (score >= 80) return "var(--success)";
  if (score >= 60) return "var(--warning)";
  return "var(--destructive)";
}

// ---------------------------------------------------------------------------
// Domain label map (compact display versions for the scorecard)
// ---------------------------------------------------------------------------

const DOMAIN_SHORT: Record<string, string> = {
  billing_and_coding: "Billing & Coding",
  hipaa_privacy_security: "HIPAA Privacy & Security",
  credentialing_enrollment: "Credentialing",
  physician_arrangements: "Physician Arrangements",
  exclusion_screening: "Exclusion Screening",
  training_education: "Training & Education",
  policies_procedures: "Policies & Procedures",
  incident_response: "Incident Response",
};

// ---------------------------------------------------------------------------
// Finding severity badge
// ---------------------------------------------------------------------------

const SEVERITY_BADGE: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  critical: {
    label: "Critical",
    color: "var(--destructive)",
    bg: "color-mix(in oklch, var(--destructive), transparent 82%)",
  },
  high: {
    label: "High",
    color: "var(--warning)",
    bg: "color-mix(in oklch, var(--warning), transparent 80%)",
  },
  medium: {
    label: "Medium",
    color: "var(--chart-2)",
    bg: "color-mix(in oklch, var(--chart-2), transparent 82%)",
  },
  low: {
    label: "Low",
    color: "var(--muted-foreground)",
    bg: "color-mix(in oklch, var(--muted-foreground), transparent 85%)",
  },
};

const FINDING_STATUS_LABEL: Record<string, string> = {
  open: "Open",
  in_remediation: "In Remediation",
  pending_verification: "Pending Verification",
  verified: "Verified",
  overdue: "Overdue",
  escalated: "Escalated",
  waived: "Waived",
};

// ---------------------------------------------------------------------------
// Portfolio score radial gauge
// ---------------------------------------------------------------------------

function ComplianceScoreGauge({ score }: { score: number }) {
  const { count, ref } = useCountUp(score, 1000);
  const circumference = 2 * Math.PI * 44;
  const tier =
    count >= 80 ? "Compliant" : count >= 60 ? "At-Risk" : "High-Risk";
  const tierColor = scoreTierColor(count);
  const dashOffset = circumference - (count / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative w-[120px] h-[120px]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          {/* track */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="8"
            stroke="var(--border)"
            strokeLinecap="round"
          />
          {/* progress arc */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            strokeWidth="8"
            stroke={tierColor}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono tabular-nums leading-none">
            {count}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 tracking-wide">
            / 100
          </span>
        </div>
      </div>
      <div
        className="mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full"
        style={{
          color: tierColor,
          backgroundColor: `color-mix(in oklch, ${tierColor}, transparent 82%)`,
        }}
      >
        {tier}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KPI Stat Card
// ---------------------------------------------------------------------------

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  delta?: number;
  deltaLabel?: string;
  icon: React.ReactNode;
  accentColor?: string;
  isCritical?: boolean;
  index: number;
}

function StatCard({
  title,
  value,
  suffix,
  delta,
  deltaLabel,
  icon,
  accentColor,
  isCritical,
  index,
}: StatCardProps) {
  const { count, ref } = useCountUp(value, 800);

  return (
    <div
      ref={ref}
      className="aesthetic-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
        animationFillMode: "both",
        ...(isCritical
          ? {
              borderColor: "color-mix(in oklch, var(--destructive), transparent 60%)",
              background:
                "color-mix(in oklch, var(--destructive), transparent 96%)",
            }
          : {}),
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground leading-tight">
          {title}
        </p>
        <div
          className="flex items-center justify-center w-8 h-8 rounded"
          style={{
            backgroundColor: accentColor
              ? `color-mix(in oklch, ${accentColor}, transparent 87%)`
              : "var(--muted)",
            color: accentColor ?? "var(--muted-foreground)",
          }}
        >
          {icon}
        </div>
      </div>
      <p
        className="text-3xl font-bold font-mono tabular-nums leading-none"
        style={{ color: isCritical ? "var(--destructive)" : "var(--foreground)" }}
      >
        {count}
        {suffix && (
          <span className="text-lg font-normal text-muted-foreground ml-0.5">
            {suffix}
          </span>
        )}
      </p>
      {(delta !== undefined || deltaLabel) && (
        <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
          {delta !== undefined && delta > 0 && (
            <TrendingUp className="h-3 w-3 text-destructive shrink-0" />
          )}
          {delta !== undefined && delta < 0 && (
            <TrendingDown className="h-3 w-3 text-success shrink-0" />
          )}
          {delta !== undefined && delta === 0 && (
            <Minus className="h-3 w-3 shrink-0" />
          )}
          {deltaLabel}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main dashboard page
// ---------------------------------------------------------------------------

type RiskFilter = "all" | "critical" | "high_risk" | "at_risk" | "compliant";

export default function ComplianceDashboardPage() {
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [trendPeriod, setTrendPeriod] = useState<"6m" | "12m">("12m");

  // Filtered practice scorecard
  const practiceOrgs = useMemo(() => {
    const orgs = organizations.filter((o) => o.type === "physician_practice");
    if (riskFilter === "all") return orgs;
    return orgs.filter((o) => o.riskTier === riskFilter);
  }, [riskFilter]);

  // Chart data filtered by period
  const trendData = useMemo(() => {
    return trendPeriod === "6m"
      ? complianceScoreTrend.slice(-6)
      : complianceScoreTrend;
  }, [trendPeriod]);

  // Recent findings — last 7, sorted by severity then date
  const recentFindings = useMemo(() => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...findings]
      .filter((f) => f.status !== "verified" && f.status !== "waived")
      .sort(
        (a, b) =>
          severityOrder[a.severity] - severityOrder[b.severity] ||
          new Date(b.identifiedAt).getTime() -
            new Date(a.identifiedAt).getTime()
      )
      .slice(0, 7);
  }, []);

  // KPI stats
  const stats = dashboardStats;

  // User lookup for findings
  const userMap = useMemo(() => {
    const map: Record<string, string> = {};
    complianceUsers.forEach((u) => {
      map[u.id] = `${u.firstName} ${u.lastName}`;
    });
    return map;
  }, []);

  // Org lookup
  const orgMap = useMemo(() => {
    const map: Record<string, string> = {};
    organizations.forEach((o) => {
      map[o.id] = o.name;
    });
    return map;
  }, []);

  const exclusionHitOrg = organizations.find(
    (o) => o.riskTier === "critical"
  );

  return (
    <div className="page-container space-y-6">

      {/* ── EXCLUSION ALERT BANNER (critical — always shown) ─────────────── */}
      {stats.exclusionHits > 0 && (
        <div
          className="rounded flex items-start gap-3 px-4 py-3 animate-fade-up-in"
          style={{
            background:
              "color-mix(in oklch, var(--destructive), transparent 88%)",
            border:
              "1px solid color-mix(in oklch, var(--destructive), transparent 60%)",
            animationDuration: "150ms",
            animationFillMode: "both",
          }}
        >
          <TriangleAlert
            className="h-4 w-4 shrink-0 mt-0.5"
            style={{ color: "var(--destructive)" }}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--destructive)" }}
            >
              Immediate Action Required — Confirmed OIG LEIE Exclusion
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {exclusionHitOrg?.name}: Dr. Fatima Al-Rashid confirmed excluded.
              Billing activities suspended. Legal counsel notified. Retroactive
              claims review initiated.
            </p>
          </div>
          <a
            href="/organizations"
            className="text-xs font-medium shrink-0 flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ color: "var(--destructive)" }}
          >
            View <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold leading-tight"
            style={{
              letterSpacing: "var(--heading-tracking)",
              fontWeight: "var(--heading-weight)",
            }}
          >
            Portfolio Compliance Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {organizations.filter((o) => o.type === "physician_practice").length}{" "}
            practices across{" "}
            {
              organizations.filter(
                (o) => o.type === "insurer" || o.type === "pe_group"
              ).length
            }{" "}
            network tenants &mdash; OIG GCPG seven-element framework
          </p>
        </div>
        {/* Portfolio score gauge — hero element */}
        <div
          className="aesthetic-card flex items-center gap-5 shrink-0"
          style={{ padding: "1rem 1.5rem" }}
        >
          <ComplianceScoreGauge score={stats.portfolioComplianceScore} />
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              Portfolio Score
            </p>
            <div className="flex items-center gap-1.5">
              {stats.scoreChangeVsLastMonth > 0 ? (
                <TrendingUp
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--success)" }}
                />
              ) : (
                <TrendingDown
                  className="h-3.5 w-3.5"
                  style={{ color: "var(--destructive)" }}
                />
              )}
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    stats.scoreChangeVsLastMonth >= 0
                      ? "var(--success)"
                      : "var(--destructive)",
                }}
              >
                {stats.scoreChangeVsLastMonth > 0 ? "+" : ""}
                {stats.scoreChangeVsLastMonth} pts vs. last month
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.highRiskPractices} practices need urgent attention
            </p>
          </div>
        </div>
      </div>

      {/* ── KPI STAT CARDS ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          index={0}
          title="Open Findings"
          value={stats.openFindings}
          delta={stats.openFindingsChange}
          deltaLabel={`${Math.abs(stats.openFindingsChange)} ${stats.openFindingsChange < 0 ? "resolved" : "new"} this month · 4 Critical`}
          icon={<AlertTriangle className="h-4 w-4" />}
          accentColor="var(--warning)"
        />
        <StatCard
          index={1}
          title="Overdue CAPs"
          value={stats.overdueCAPs}
          delta={stats.overdueCAPsChange}
          deltaLabel={`+${stats.overdueCAPsChange} since last month · avg ${stats.avgDaysToCapResolution}d to resolve`}
          icon={<Clock className="h-4 w-4" />}
          accentColor="var(--destructive)"
        />
        <StatCard
          index={2}
          title="OIG Exclusion Hits"
          value={stats.exclusionHits}
          deltaLabel={`${stats.exclusionChecksDue} screenings overdue · immediate action required`}
          icon={<ShieldAlert className="h-4 w-4" />}
          accentColor="var(--destructive)"
          isCritical={stats.exclusionHits > 0}
        />
        <StatCard
          index={3}
          title="Documents Expiring (90d)"
          value={stats.documentsExpiring90d}
          deltaLabel={`${stats.assessmentsPastDue} assessments past due · ${stats.incidentsReported30d} incidents (30d)`}
          icon={<FileWarning className="h-4 w-4" />}
          accentColor="var(--chart-2)"
        />
      </div>

      {/* ── CHART ROW ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Compliance score trend — 3/5 width */}
        <div
          className="aesthetic-card lg:col-span-3"
          style={{ padding: "var(--card-padding)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Portfolio Compliance Score Trend
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Weighted average across all active practices
              </p>
            </div>
            <div className="flex gap-1.5">
              {(["6m", "12m"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setTrendPeriod(p)}
                  className="px-2.5 py-1 text-xs rounded border transition-colors"
                  style={{
                    backgroundColor:
                      trendPeriod === p ? "var(--primary)" : "transparent",
                    color:
                      trendPeriod === p
                        ? "var(--primary-foreground)"
                        : "var(--muted-foreground)",
                    borderColor:
                      trendPeriod === p
                        ? "var(--primary)"
                        : "var(--border)",
                    transition: "var(--t-interactive)",
                  }}
                >
                  {p === "6m" ? "6 months" : "12 months"}
                </button>
              ))}
            </div>
          </div>
          <ComplianceTrendChart data={trendData} />
        </div>

        {/* Finding severity by org — 2/5 width */}
        <div
          className="aesthetic-card lg:col-span-2"
          style={{ padding: "var(--card-padding)" }}
        >
          <div className="mb-4">
            <p className="text-sm font-semibold text-foreground">
              Finding Severity by Practice
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Distribution for quarterly board report
            </p>
          </div>
          <FindingsSeverityChart data={findingSeverityByOrg} />
        </div>
      </div>

      {/* ── PRACTICE SCORECARD TABLE ──────────────────────────────────────── */}
      <div
        className="aesthetic-card"
        style={{ padding: "0" }}
      >
        {/* Table header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-border/50"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">
              Practice Scorecard
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Per-practice compliance posture &mdash; filter by Risk Tier
            </p>
          </div>
          {/* Risk Tier filter */}
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { key: "all", label: "All Practices" },
                { key: "critical", label: "Critical" },
                { key: "high_risk", label: "High-Risk" },
                { key: "at_risk", label: "At-Risk" },
                { key: "compliant", label: "Compliant" },
              ] as { key: RiskFilter; label: string }[]
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRiskFilter(key)}
                className="px-2.5 py-1 text-xs rounded border transition-colors"
                style={{
                  backgroundColor:
                    riskFilter === key ? "var(--primary)" : "transparent",
                  color:
                    riskFilter === key
                      ? "var(--primary-foreground)"
                      : "var(--muted-foreground)",
                  borderColor:
                    riskFilter === key ? "var(--primary)" : "var(--border)",
                  transition: "var(--t-interactive)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 whitespace-nowrap">
                  Practice
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Overall Score
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Risk Tier
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Open Findings
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Overdue CAPs
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Assessment Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Training Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {practiceOrgs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-muted-foreground"
                  >
                    No practices match the selected risk tier filter.
                  </td>
                </tr>
              ) : (
                practiceOrgs.map((org, i) => {
                  const tier = org.riskTier as RiskTierKey;
                  const tierColor = TIER_COLORS[tier] ?? "var(--muted-foreground)";
                  const tierBg = TIER_BG[tier] ?? "transparent";
                  const scoreColor = scoreTierColor(org.overallComplianceScore);

                  return (
                    <tr
                      key={org.id}
                      className="border-b border-border/30 last:border-0 aesthetic-hover"
                    >
                      {/* Practice name */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-foreground text-sm leading-snug">
                            {org.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {org.primarySpecialty} &middot;{" "}
                            {org.providerCount} providers
                          </p>
                        </div>
                      </td>

                      {/* Overall score */}
                      <td className="px-4 py-3.5">
                        {org.overallComplianceScore !== null ? (
                          <div className="flex items-center gap-2.5">
                            <div className="w-20 h-1.5 rounded-full bg-border/60 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${org.overallComplianceScore}%`,
                                  backgroundColor: scoreColor,
                                  transition: "width 0.4s ease-out",
                                }}
                              />
                            </div>
                            <span
                              className="font-mono font-semibold text-sm tabular-nums"
                              style={{ color: scoreColor }}
                            >
                              {org.overallComplianceScore}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Risk tier badge */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{
                            color: tierColor,
                            backgroundColor: tierBg,
                          }}
                        >
                          {RISK_TIER_LABELS[tier] ?? tier}
                        </span>
                      </td>

                      {/* Open findings */}
                      <td className="px-4 py-3.5">
                        <span
                          className="font-mono font-semibold"
                          style={{
                            color:
                              org.openFindingsCount > 5
                                ? "var(--destructive)"
                                : org.openFindingsCount > 0
                                ? "var(--warning)"
                                : "var(--success)",
                          }}
                        >
                          {org.openFindingsCount}
                        </span>
                      </td>

                      {/* Overdue CAPs */}
                      <td className="px-4 py-3.5">
                        <span
                          className="font-mono font-semibold"
                          style={{
                            color:
                              org.overdueCapCount > 0
                                ? "var(--destructive)"
                                : "var(--success)",
                          }}
                        >
                          {org.overdueCapCount}
                        </span>
                      </td>

                      {/* Assessment status */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={
                            org.assessmentStatus === "overdue"
                              ? {
                                  color: "var(--destructive)",
                                  backgroundColor:
                                    "color-mix(in oklch, var(--destructive), transparent 85%)",
                                }
                              : org.assessmentStatus === "completed"
                              ? {
                                  color: "var(--success)",
                                  backgroundColor:
                                    "color-mix(in oklch, var(--success), transparent 85%)",
                                }
                              : org.assessmentStatus === "not_initiated"
                              ? {
                                  color: "var(--muted-foreground)",
                                  backgroundColor:
                                    "color-mix(in oklch, var(--muted-foreground), transparent 88%)",
                                }
                              : {
                                  color: "var(--warning)",
                                  backgroundColor:
                                    "color-mix(in oklch, var(--warning), transparent 85%)",
                                }
                          }
                        >
                          {org.assessmentStatus === "not_initiated"
                            ? "Baseline Pending"
                            : org.assessmentStatus === "overdue"
                            ? "Assessment Overdue"
                            : org.assessmentStatus === "completed"
                            ? "Completed"
                            : org.assessmentStatus === "in_progress"
                            ? "In Progress"
                            : "Pending Review"}
                        </span>
                      </td>

                      {/* Training completion rate */}
                      <td className="px-4 py-3.5">
                        {org.trainingCompletionRate !== null ? (
                          <span
                            className="font-mono text-sm tabular-nums"
                            style={{
                              color:
                                org.trainingCompletionRate >= 80
                                  ? "var(--success)"
                                  : org.trainingCompletionRate >= 60
                                  ? "var(--warning)"
                                  : "var(--destructive)",
                            }}
                          >
                            {org.trainingCompletionRate}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── RECENT FINDINGS TABLE ─────────────────────────────────────────── */}
      <div
        className="aesthetic-card"
        style={{ padding: "0" }}
      >
        <div className="px-5 py-4 border-b border-border/50">
          <p className="text-sm font-semibold text-foreground">
            Recent Open Findings
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Active findings requiring attention &mdash; sorted by severity
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 whitespace-nowrap">
                  Finding
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Severity
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Domain
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Assigned To
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 whitespace-nowrap">
                  Organization
                </th>
              </tr>
            </thead>
            <tbody>
              {recentFindings.map((finding) => {
                const badge = SEVERITY_BADGE[finding.severity];
                const isOverdue =
                  finding.targetResolutionDate &&
                  new Date(finding.targetResolutionDate) < new Date();
                const assignedName = finding.assignedToId
                  ? userMap[finding.assignedToId]
                  : null;

                return (
                  <tr
                    key={finding.id}
                    className="border-b border-border/30 last:border-0 aesthetic-hover"
                  >
                    {/* Finding title */}
                    <td className="px-5 py-3.5 max-w-[280px]">
                      <p className="font-medium text-foreground text-xs leading-snug line-clamp-2">
                        {finding.title}
                      </p>
                      {isOverdue && (
                        <span
                          className="inline-flex items-center gap-0.5 text-[10px] font-medium mt-1"
                          style={{ color: "var(--destructive)" }}
                        >
                          <Clock className="h-2.5 w-2.5" />
                          Overdue
                        </span>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          color: badge.color,
                          backgroundColor: badge.bg,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Domain */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground">
                        {DOMAIN_SHORT[finding.domain] ??
                          COMPLIANCE_DOMAIN_LABELS[finding.domain] ??
                          finding.domain}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className="text-xs font-medium"
                        style={{
                          color:
                            finding.status === "escalated"
                              ? "var(--destructive)"
                              : finding.status === "overdue"
                              ? "var(--destructive)"
                              : finding.status === "pending_verification"
                              ? "var(--chart-2)"
                              : finding.status === "in_remediation"
                              ? "var(--warning)"
                              : "var(--muted-foreground)",
                        }}
                      >
                        {FINDING_STATUS_LABEL[finding.status] ?? finding.status}
                      </span>
                    </td>

                    {/* Assigned to */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground">
                        {assignedName ?? (
                          <span
                            className="font-medium"
                            style={{ color: "var(--warning)" }}
                          >
                            Unassigned
                          </span>
                        )}
                      </span>
                    </td>

                    {/* Org */}
                    <td className="px-4 py-3.5 max-w-[180px]">
                      <span className="text-xs text-muted-foreground truncate block">
                        {orgMap[finding.orgId] ?? finding.orgId}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── PROPOSAL CONVERSION BANNER ────────────────────────────────────── */}
      <div
        className="rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 border"
        style={{
          borderColor: "color-mix(in oklch, var(--primary), transparent 70%)",
          background:
            "linear-gradient(to right, color-mix(in oklch, var(--primary), transparent 93%), transparent)",
        }}
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Live demo built for{" "}
            {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam &middot; Full-Stack Developer &middot; Available now
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            style={{ transition: "var(--t-interactive)" }}
          >
            My approach &rarr;
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded text-primary-foreground"
            style={{
              backgroundColor: "var(--primary)",
              transition: "var(--t-interactive)",
            }}
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
