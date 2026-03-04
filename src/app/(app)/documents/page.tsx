"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileX,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Plus,
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
import { complianceDocuments, complianceUsers, organizations } from "@/data/mock-data";
import type { DocumentStatus, DocumentType } from "@/lib/types";

// ---------------------------------------------------------------------------
// Document type display labels
// ---------------------------------------------------------------------------

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  business_associate_agreement: "Business Associate Agreement",
  medical_license: "Medical License",
  malpractice_certificate: "Malpractice Certificate",
  physician_compensation_agreement: "Physician Compensation Agreement",
  stark_law_exception_analysis: "Stark Law Exception Analysis",
  pp_manual: "P&P Manual",
  hipaa_security_risk_analysis: "HIPAA Security Risk Analysis",
  exclusion_screening_report: "Exclusion Screening Report",
  training_log: "Training Log",
  caqh_attestation_record: "CAQH Attestation Record",
  certificate_of_insurance: "Certificate of Insurance",
  npdb_query_result: "NPDB Query Result",
};

const DOC_TYPE_ABBREV: Record<DocumentType, string> = {
  business_associate_agreement: "BAA",
  medical_license: "License",
  malpractice_certificate: "Malpractice",
  physician_compensation_agreement: "Comp. Agreement",
  stark_law_exception_analysis: "Stark Analysis",
  pp_manual: "P&P Manual",
  hipaa_security_risk_analysis: "HIPAA SRA",
  exclusion_screening_report: "Screening Report",
  training_log: "Training Log",
  caqh_attestation_record: "CAQH Record",
  certificate_of_insurance: "COI",
  npdb_query_result: "NPDB Query",
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

function formatFileSize(kb: number | null | undefined): string {
  if (!kb) return "—";
  if (kb < 1024) return `${kb} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function getOrgName(orgId: string): string {
  return organizations.find((o) => o.id === orgId)?.name ?? orgId;
}

function getUploaderName(userId: string | null): string {
  if (!userId) return "—";
  const u = complianceUsers.find((u) => u.id === userId);
  return u ? `${u.firstName} ${u.lastName}` : userId;
}

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  const configs: Record<
    DocumentStatus,
    { label: string; colorClass: string; Icon: React.ElementType }
  > = {
    current: {
      label: "Current",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10",
      Icon: CheckCircle2,
    },
    expiring_soon: {
      label: "Expiring Soon",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
      Icon: Clock,
    },
    expired: {
      label: "Expired",
      colorClass: "text-destructive bg-destructive/10",
      Icon: AlertTriangle,
    },
    missing: {
      label: "Missing",
      colorClass: "text-destructive bg-destructive/10",
      Icon: FileX,
    },
    under_review: {
      label: "Under Review",
      colorClass: "text-primary bg-primary/10",
      Icon: Eye,
    },
  };
  const c = configs[status] ?? configs.current;
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
// Upload simulation state
// ---------------------------------------------------------------------------

interface UploadState {
  docId: string;
  state: "idle" | "uploading" | "done";
  progress: number;
}

// ---------------------------------------------------------------------------
// Summary stats
// ---------------------------------------------------------------------------

const STATUS_SUMMARY = {
  current: complianceDocuments.filter((d) => d.status === "current").length,
  expiring_soon: complianceDocuments.filter((d) => d.status === "expiring_soon").length,
  expired: complianceDocuments.filter((d) => d.status === "expired").length,
  missing: complianceDocuments.filter((d) => d.status === "missing").length,
  under_review: complianceDocuments.filter((d) => d.status === "under_review").length,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DocumentVaultPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState<
    "displayName" | "uploadedAt" | "expiryDate" | "status"
  >("uploadedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [downloadedDocs, setDownloadedDocs] = useState<Set<string>>(new Set());

  // Unique doc types for filter
  const docTypes = useMemo(() => {
    const types = new Set(complianceDocuments.map((d) => d.documentType));
    return Array.from(types);
  }, []);

  const displayed = useMemo(() => {
    return complianceDocuments
      .filter((d) => {
        const matchSearch =
          search === "" ||
          d.displayName.toLowerCase().includes(search.toLowerCase()) ||
          getOrgName(d.orgId).toLowerCase().includes(search.toLowerCase()) ||
          DOC_TYPE_LABELS[d.documentType]
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchStatus =
          statusFilter === "all" || d.status === statusFilter;
        const matchType =
          typeFilter === "all" || d.documentType === typeFilter;
        return matchSearch && matchStatus && matchType;
      })
      .sort((a, b) => {
        const av =
          sortKey === "displayName"
            ? a.displayName
            : sortKey === "uploadedAt"
            ? (a.uploadedAt ?? "")
            : sortKey === "expiryDate"
            ? (a.expiryDate ?? "")
            : a.status;
        const bv =
          sortKey === "displayName"
            ? b.displayName
            : sortKey === "uploadedAt"
            ? (b.uploadedAt ?? "")
            : sortKey === "expiryDate"
            ? (b.expiryDate ?? "")
            : b.status;
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, typeFilter, sortKey, sortDir]);

  function handleSort(
    key: "displayName" | "uploadedAt" | "expiryDate" | "status"
  ) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function simulateUpload(docId: string) {
    setUploadStates((prev) => ({
      ...prev,
      [docId]: { docId, state: "uploading", progress: 0 },
    }));
    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 20) + 10;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setUploadStates((prev) => ({
          ...prev,
          [docId]: { docId, state: "done", progress: 100 },
        }));
      } else {
        setUploadStates((prev) => ({
          ...prev,
          [docId]: { docId, state: "uploading", progress: p },
        }));
      }
    }, 150);
  }

  function simulateDownload(docId: string) {
    setDownloadedDocs((prev) => new Set([...prev, docId]));
    setTimeout(() => {
      setDownloadedDocs((prev) => {
        const n = new Set(prev);
        n.delete(docId);
        return n;
      });
    }, 2000);
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
          <h1 className="text-2xl font-bold tracking-tight">Document Vault</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compliance records with presigned URL access, expiration tracking,
            and required document monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export Inventory
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(
          [
            {
              key: "current",
              label: "Current",
              color: "text-[color:var(--success)]",
              bg: "bg-[color:var(--success)]/8",
            },
            {
              key: "expiring_soon",
              label: "Expiring Soon",
              color: "text-[color:var(--warning)]",
              bg: "bg-[color:var(--warning)]/8",
            },
            {
              key: "expired",
              label: "Expired",
              color: "text-destructive",
              bg: "bg-destructive/8",
            },
            {
              key: "missing",
              label: "Missing",
              color: "text-destructive",
              bg: "bg-destructive/8",
            },
            {
              key: "under_review",
              label: "Under Review",
              color: "text-primary",
              bg: "bg-primary/8",
            },
          ] as const
        ).map((s) => (
          <button
            key={s.key}
            onClick={() =>
              setStatusFilter(statusFilter === s.key ? "all" : s.key)
            }
            className={cn(
              "aesthetic-card p-3 text-left cursor-pointer",
              statusFilter === s.key && "border-primary/40 bg-primary/5"
            )}
            style={{ transition: "border-color var(--t-interactive), background-color var(--t-interactive)" }}
          >
            <div className={cn("text-2xl font-bold font-mono", s.color)}>
              {STATUS_SUMMARY[s.key]}
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
            placeholder="Search compliance documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="current">Current</SelectItem>
            <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="missing">Missing</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All document types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Document Types</SelectItem>
            {docTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {DOC_TYPE_ABBREV[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground shrink-0">
          {displayed.length}{" "}
          {displayed.length === 1 ? "document" : "documents"}
        </span>
      </div>

      {/* Documents table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("displayName")}
                >
                  <span className="flex items-center gap-1">
                    Document Name
                    <SortIcon col="displayName" />
                  </span>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Document Type
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Organization
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("status")}
                >
                  <span className="flex items-center gap-1">
                    Status
                    <SortIcon col="status" />
                  </span>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Uploaded By
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("uploadedAt")}
                >
                  <span className="flex items-center gap-1">
                    Uploaded
                    <SortIcon col="uploadedAt" />
                  </span>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                  onClick={() => handleSort("expiryDate")}
                >
                  <span className="flex items-center gap-1">
                    Expires
                    <SortIcon col="expiryDate" />
                  </span>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Size
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
                    No compliance documents match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((doc) => {
                  const upload = uploadStates[doc.id];
                  const isUploading = upload?.state === "uploading";
                  const uploadDone = upload?.state === "done";
                  const isDownloading = downloadedDocs.has(doc.id);
                  const isMissing = doc.status === "missing";
                  const effectiveStatus: DocumentStatus =
                    uploadDone ? "under_review" : doc.status;

                  return (
                    <TableRow
                      key={doc.id}
                      className={cn(
                        "hover:bg-[color:var(--surface-hover)] transition-colors",
                        (isMissing && !uploadDone) &&
                          "bg-destructive/3 hover:bg-destructive/5"
                      )}
                      style={{
                        transition: "background-color var(--t-interactive)",
                      }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm font-medium">
                              {doc.displayName}
                            </p>
                            {doc.presignedUrlToken && (
                              <p className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">
                                psu://
                                {doc.presignedUrlToken}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {DOC_TYPE_ABBREV[doc.documentType]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground truncate max-w-[140px] block">
                          {getOrgName(doc.orgId)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DocumentStatusBadge status={effectiveStatus} />
                        {isUploading && (
                          <div className="mt-1 w-20 h-1 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${upload.progress}%` }}
                            />
                          </div>
                        )}
                        {uploadDone && (
                          <p className="text-xs text-[color:var(--success)] mt-0.5">
                            Uploaded
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getUploaderName(doc.uploadedById)}
                      </TableCell>
                      <TableCell className="font-mono text-sm tabular-nums text-muted-foreground">
                        {formatDate(doc.uploadedAt)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "font-mono text-sm tabular-nums",
                          doc.status === "expired"
                            ? "text-destructive font-medium"
                            : doc.status === "expiring_soon"
                            ? "text-[color:var(--warning)] font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(doc.expiryDate)}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {formatFileSize(doc.fileSizeKb)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {isMissing && !uploadDone ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                              disabled={isUploading}
                              onClick={() => simulateUpload(doc.id)}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              {isUploading
                                ? `${upload?.progress ?? 0}%`
                                : "Upload"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              disabled={isDownloading || !doc.presignedUrlToken}
                              onClick={() => simulateDownload(doc.id)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {isDownloading ? "Downloading…" : "Download"}
                            </Button>
                          )}
                          {(doc.status === "expiring_soon" ||
                            doc.status === "expired") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => simulateUpload(doc.id)}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Renew
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Required documents legend */}
      <div className="aesthetic-card p-4">
        <h3 className="text-sm font-semibold mb-3">Required Document Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {(Object.entries(DOC_TYPE_ABBREV) as [DocumentType, string][]).map(
            ([type, abbrev]) => {
              const docs = complianceDocuments.filter(
                (d) => d.documentType === type
              );
              const hasIssue = docs.some(
                (d) =>
                  d.status === "missing" ||
                  d.status === "expired" ||
                  d.status === "expiring_soon"
              );
              const hasDocs = docs.length > 0;
              return (
                <div
                  key={type}
                  className={cn(
                    "flex items-center gap-2 text-xs p-2 rounded-md",
                    hasIssue
                      ? "bg-destructive/5 text-destructive"
                      : hasDocs
                      ? "bg-[color:var(--success)]/5 text-[color:var(--success)]"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {hasIssue ? (
                    <AlertTriangle className="w-3 h-3 shrink-0" />
                  ) : hasDocs ? (
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                  ) : (
                    <FileX className="w-3 h-3 shrink-0" />
                  )}
                  {abbrev}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
