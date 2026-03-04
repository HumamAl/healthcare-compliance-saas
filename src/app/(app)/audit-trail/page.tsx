"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  ShieldAlert,
  FileUp,
  FileBadge,
  UserCog,
  Building2,
  ClipboardCheck,
  BookOpen,
  BarChart2,
  Bell,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { auditEvents, complianceUsers, organizations } from "@/data/mock-data";
import type { AuditEventType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Event type config
// ---------------------------------------------------------------------------

type EventCategory =
  | "assessment"
  | "finding"
  | "cap"
  | "document"
  | "provider"
  | "user"
  | "org"
  | "report";

const EVENT_TYPE_CONFIG: Record<
  AuditEventType,
  { label: string; category: EventCategory; Icon: React.ElementType; colorClass: string }
> = {
  assessment_initiated: {
    label: "Assessment Initiated",
    category: "assessment",
    Icon: ClipboardCheck,
    colorClass: "text-primary bg-primary/10",
  },
  assessment_submitted: {
    label: "Assessment Submitted",
    category: "assessment",
    Icon: ClipboardCheck,
    colorClass: "text-primary bg-primary/10",
  },
  assessment_completed: {
    label: "Assessment Completed",
    category: "assessment",
    Icon: ClipboardCheck,
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  finding_created: {
    label: "Finding Created",
    category: "finding",
    Icon: AlertCircle,
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  finding_assigned: {
    label: "Finding Assigned",
    category: "finding",
    Icon: AlertCircle,
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  cap_created: {
    label: "CAP Created",
    category: "cap",
    Icon: BookOpen,
    colorClass: "text-primary bg-primary/10",
  },
  cap_status_changed: {
    label: "CAP Status Changed",
    category: "cap",
    Icon: BookOpen,
    colorClass: "text-primary bg-primary/10",
  },
  cap_verified: {
    label: "CAP Verified",
    category: "cap",
    Icon: BookOpen,
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  document_uploaded: {
    label: "Document Uploaded",
    category: "document",
    Icon: FileUp,
    colorClass: "text-primary bg-primary/10",
  },
  document_expired: {
    label: "Document Expired",
    category: "document",
    Icon: FileBadge,
    colorClass: "text-destructive bg-destructive/10",
  },
  provider_screened: {
    label: "Provider Screened",
    category: "provider",
    Icon: ShieldAlert,
    colorClass: "text-primary bg-primary/10",
  },
  exclusion_hit_flagged: {
    label: "Exclusion Hit Flagged",
    category: "provider",
    Icon: ShieldAlert,
    colorClass: "text-destructive bg-destructive/10",
  },
  exclusion_hit_cleared: {
    label: "Exclusion Hit Cleared",
    category: "provider",
    Icon: ShieldAlert,
    colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  },
  provider_status_changed: {
    label: "Provider Status Changed",
    category: "provider",
    Icon: ShieldAlert,
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  user_role_changed: {
    label: "Role Changed",
    category: "user",
    Icon: UserCog,
    colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  },
  org_created: {
    label: "Organization Created",
    category: "org",
    Icon: Building2,
    colorClass: "text-primary bg-primary/10",
  },
  report_exported: {
    label: "Report Exported",
    category: "report",
    Icon: BarChart2,
    colorClass: "text-muted-foreground bg-muted",
  },
  incident_reported: {
    label: "Incident Reported",
    category: "finding",
    Icon: Bell,
    colorClass: "text-destructive bg-destructive/10",
  },
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  assessment: "Assessment",
  finding: "Finding / Incident",
  cap: "Corrective Action Plan",
  document: "Document",
  provider: "Provider / Screening",
  user: "User / RBAC",
  org: "Organization",
  report: "Report Export",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getActorName(actorId: string): string {
  const u = complianceUsers.find((u) => u.id === actorId);
  return u ? `${u.firstName} ${u.lastName}` : actorId;
}

function getOrgName(orgId: string): string {
  return organizations.find((o) => o.id === orgId)?.name ?? orgId;
}

// ---------------------------------------------------------------------------
// Expandable metadata panel
// ---------------------------------------------------------------------------

function MetadataPanel({ json }: { json: string }) {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(json);
  } catch {
    return <p className="text-xs text-muted-foreground font-mono">{json}</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(parsed).map(([key, val]) => (
        <div key={key}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {key.replace(/_/g, " ")}
          </p>
          <p className="text-xs font-mono mt-0.5">
            {Array.isArray(val) ? val.join(", ") : String(val)}
          </p>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const displayed = useMemo(() => {
    return auditEvents
      .filter((e) => {
        const config = EVENT_TYPE_CONFIG[e.eventType];
        const matchSearch =
          search === "" ||
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          getActorName(e.actorId)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          config.label.toLowerCase().includes(search.toLowerCase()) ||
          (e.ipAddress ?? "").includes(search);
        const matchCategory =
          categoryFilter === "all" || config.category === categoryFilter;
        const matchOrg = orgFilter === "all" || e.orgId === orgFilter;
        return matchSearch && matchCategory && matchOrg;
      })
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      );
  }, [search, categoryFilter, orgFilter]);

  // Unique orgs in events
  const orgOptions = useMemo(() => {
    const ids = [...new Set(auditEvents.map((e) => e.orgId))];
    return ids.map((id) => ({ id, name: getOrgName(id) }));
  }, []);

  return (
    <div className="page-container space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Immutable timestamped event log — who did what, when, from which IP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* Event type summary chips */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(CATEGORY_LABELS) as [EventCategory, string][]).map(
          ([cat, label]) => {
            const count = auditEvents.filter(
              (e) => EVENT_TYPE_CONFIG[e.eventType].category === cat
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() =>
                  setCategoryFilter((prev) => (prev === cat ? "all" : cat))
                }
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                  categoryFilter === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
                style={{ transition: "all var(--t-interactive)" }}
              >
                {label}
                <span className="ml-1.5 font-mono">{count}</span>
              </button>
            );
          }
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events, actors, or IP addresses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All event types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Event Types</SelectItem>
            {(Object.entries(CATEGORY_LABELS) as [EventCategory, string][]).map(
              ([cat, label]) => (
                <SelectItem key={cat} value={cat}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <Select value={orgFilter} onValueChange={setOrgFilter}>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="All organizations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {orgOptions.map((o) => (
              <SelectItem key={o.id} value={o.id}>
                {o.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length}{" "}
          {displayed.length === 1 ? "event" : "events"}
        </span>
      </div>

      {/* Audit event table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground w-40">
                  Timestamp
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Event Type
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Description
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Actor
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Organization
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  IP Address
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No audit events match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((event) => {
                  const config = EVENT_TYPE_CONFIG[event.eventType];
                  const { date, time } = formatDateTime(event.occurredAt);
                  const isExpanded = expandedId === event.id;
                  const isCritical =
                    event.eventType === "exclusion_hit_flagged" ||
                    event.eventType === "incident_reported";

                  return (
                    <>
                      <TableRow
                        key={event.id}
                        className={cn(
                          "hover:bg-[color:var(--surface-hover)] cursor-pointer",
                          isCritical && "bg-destructive/3 hover:bg-destructive/5"
                        )}
                        style={{
                          transition: "background-color var(--t-interactive)",
                        }}
                        onClick={() =>
                          setExpandedId(isExpanded ? null : event.id)
                        }
                      >
                        <TableCell className="font-mono text-xs tabular-nums">
                          <div>{date}</div>
                          <div className="text-muted-foreground">{time}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-medium border-0 rounded-full inline-flex items-center gap-1 px-2 whitespace-nowrap",
                              config.colorClass
                            )}
                          >
                            <config.Icon className="w-3 h-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm max-w-xs">
                          <p className="line-clamp-2">{event.description}</p>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {getActorName(event.actorId)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <p className="truncate max-w-[140px]">
                            {getOrgName(event.orgId)}
                          </p>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                          {event.ipAddress ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {event.metadataJson ? (
                            isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : null}
                        </TableCell>
                      </TableRow>
                      {isExpanded && event.metadataJson && (
                        <TableRow key={`${event.id}-expanded`}>
                          <TableCell
                            colSpan={7}
                            className="bg-muted/30 px-6 py-4"
                          >
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Event Metadata
                              </p>
                              <MetadataPanel json={event.metadataJson} />
                              {event.targetEntityId && (
                                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60 mt-2">
                                  <span>
                                    Entity ID:{" "}
                                    <span className="font-mono">
                                      {event.targetEntityId}
                                    </span>
                                  </span>
                                  {event.targetEntityType && (
                                    <span>
                                      Type:{" "}
                                      <span className="font-mono capitalize">
                                        {event.targetEntityType}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Audit integrity note */}
      <div className="aesthetic-card p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">Tamper-Evident Audit Log</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            All events are cryptographically hashed and stored immutably.
            Records cannot be edited or deleted after creation. This audit trail
            satisfies OIG Element 6 (Auditing &amp; Monitoring) documentation
            requirements and supports OCR HIPAA investigation responses.
          </p>
        </div>
      </div>
    </div>
  );
}
