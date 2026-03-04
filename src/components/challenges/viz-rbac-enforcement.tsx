"use client";

import { useState } from "react";
import { X, Check, AlertTriangle, ShieldCheck, User, UserCog, Eye } from "lucide-react";

type ViewMode = "problem" | "solution";

interface RoutePermission {
  route: string;
  orgAdmin: boolean | "partial";
  complianceOfficer: boolean | "partial";
  viewer: boolean | "partial";
  note?: string;
}

const routes: RoutePermission[] = [
  {
    route: "/organizations/settings",
    orgAdmin: true,
    complianceOfficer: false,
    viewer: false,
    note: "Tenant config, user invites, RBAC management",
  },
  {
    route: "/findings (create CAP)",
    orgAdmin: true,
    complianceOfficer: true,
    viewer: false,
    note: "CAP creation requires write permission",
  },
  {
    route: "/audit-trail",
    orgAdmin: true,
    complianceOfficer: true,
    viewer: "partial",
    note: "Viewers can read; cannot export",
  },
  {
    route: "/documents (upload)",
    orgAdmin: true,
    complianceOfficer: true,
    viewer: false,
    note: "Supporting Document upload requires Compliance Officer+",
  },
  {
    route: "/risk-overview",
    orgAdmin: true,
    complianceOfficer: true,
    viewer: true,
    note: "Read-only score view accessible to all roles",
  },
];

const problemIssues = [
  "Role checks scattered across 12+ page components",
  "Viewer navigates directly to /organizations/settings — no block",
  "A logged-out session can reach /documents via direct URL",
  "No audit trail of denied access attempts",
  "Adding a new route means remembering to add role checks manually",
];

const solutionItems = [
  "Single middleware.ts runs before every route — one place to change",
  "Role matrix defined in config: routes → allowed roles → enforced at edge",
  "Unauthenticated requests redirected to login regardless of route",
  "Every denied attempt logged with userId, route, timestamp, and role",
  "New routes are blocked by default — must be explicitly allowlisted",
];

function CellIcon({ value }: { value: boolean | "partial" }) {
  if (value === true)
    return <Check className="h-3.5 w-3.5" style={{ color: "var(--success)" }} />;
  if (value === false)
    return <X className="h-3.5 w-3.5" style={{ color: "var(--destructive)" }} />;
  return (
    <span
      className="text-[10px] font-medium"
      style={{ color: "var(--warning)" }}
    >
      read
    </span>
  );
}

export function VizRbacEnforcement() {
  const [mode, setMode] = useState<ViewMode>("problem");

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div
        className="inline-flex rounded-md p-0.5"
        style={{
          border: "1px solid color-mix(in oklch, var(--border), transparent 30%)",
          background: "var(--muted)",
        }}
      >
        {(["problem", "solution"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setMode(v)}
            className="px-3 py-1 text-xs font-medium rounded-sm capitalize"
            style={{
              background:
                mode === v
                  ? v === "problem"
                    ? "color-mix(in oklch, var(--destructive) 10%, var(--card))"
                    : "color-mix(in oklch, var(--success) 10%, var(--card))"
                  : "transparent",
              color:
                mode === v
                  ? v === "problem"
                    ? "var(--destructive)"
                    : "var(--success)"
                  : "var(--muted-foreground)",
              border:
                mode === v
                  ? `1px solid ${
                      v === "problem"
                        ? "color-mix(in oklch, var(--destructive) 25%, transparent)"
                        : "color-mix(in oklch, var(--success) 25%, transparent)"
                    }`
                  : "1px solid transparent",
              transitionDuration: "120ms",
            }}
          >
            {v === "problem" ? (
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Current state
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Middleware approach
              </span>
            )}
          </button>
        ))}
      </div>

      {mode === "problem" ? (
        <div className="space-y-3">
          {/* Problem items */}
          <div
            className="rounded-md p-3 space-y-2"
            style={{
              border: "1px solid color-mix(in oklch, var(--destructive) 25%, transparent)",
              background: "color-mix(in oklch, var(--destructive) 5%, transparent)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--destructive)" }}
            >
              Scattered role checks — the risks
            </p>
            <ul className="space-y-1.5">
              {problemIssues.map((issue) => (
                <li key={issue} className="flex items-start gap-2 text-xs">
                  <X
                    className="h-3.5 w-3.5 mt-0.5 shrink-0"
                    style={{ color: "var(--destructive)" }}
                  />
                  <span style={{ color: "var(--foreground)" }}>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Route matrix showing gaps */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid color-mix(in oklch, var(--border), transparent 40%)",
                  }}
                >
                  <th className="text-left pb-2 font-medium text-xs pr-3" style={{ color: "var(--muted-foreground)" }}>
                    Route
                  </th>
                  <th className="pb-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <UserCog className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Admin</span>
                    </div>
                  </th>
                  <th className="pb-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <User className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Officer</span>
                    </div>
                  </th>
                  <th className="pb-2 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <Eye className="h-3 w-3" style={{ color: "var(--primary)" }} />
                      <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>Viewer</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {routes.map((r) => (
                  <tr
                    key={r.route}
                    style={{
                      borderBottom: "1px solid color-mix(in oklch, var(--border), transparent 60%)",
                    }}
                  >
                    <td className="py-1.5 pr-3">
                      <span className="font-mono text-[10px]" style={{ color: "var(--foreground)" }}>
                        {r.route}
                      </span>
                    </td>
                    <td className="py-1.5 text-center">
                      <CellIcon value={r.orgAdmin} />
                    </td>
                    <td className="py-1.5 text-center">
                      <CellIcon value={r.complianceOfficer} />
                    </td>
                    <td className="py-1.5 text-center">
                      <CellIcon value={r.viewer} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="text-[10px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Without middleware enforcement, these rules only hold when every developer
            remembers to add checks to every new component.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Solution items */}
          <div
            className="rounded-md p-3 space-y-2"
            style={{
              border: "1px solid color-mix(in oklch, var(--success) 25%, transparent)",
              background: "color-mix(in oklch, var(--success) 5%, transparent)",
            }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: "var(--success)" }}
            >
              Middleware enforcement — what changes
            </p>
            <ul className="space-y-1.5">
              {solutionItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs">
                  <Check
                    className="h-3.5 w-3.5 mt-0.5 shrink-0"
                    style={{ color: "var(--success)" }}
                  />
                  <span style={{ color: "var(--foreground)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Middleware code sketch */}
          <div
            className="rounded-md p-3"
            style={{
              border: "1px solid color-mix(in oklch, var(--border), transparent 40%)",
              background: "oklch(0.10 0.03 195 / 0.06)",
            }}
          >
            <p
              className="text-[10px] font-mono leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {`// middleware.ts — runs at edge before every route\n`}
              {`const roleMatrix = {\n`}
              {`  "/organizations/settings": ["org_admin"],\n`}
              {`  "/findings":               ["org_admin", "compliance_officer"],\n`}
              {`  "/audit-trail":            ["org_admin", "compliance_officer", "viewer"],\n`}
              {`};\n\n`}
              {`export function middleware(req: NextRequest) {\n`}
              {`  const { role, orgId } = verifyJwt(req);\n`}
              {`  if (!isAllowed(req.nextUrl.pathname, role)) {\n`}
              {`    auditLog({ type: "ACCESS_DENIED", orgId, role, path });\n`}
              {`    return NextResponse.redirect("/unauthorized");\n`}
              {`  }\n`}
              {`}`}
            </p>
          </div>

          <p
            className="text-[10px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            Role boundaries enforced at the network edge — no component-level check
            can be forgotten because no component-level check is needed.
          </p>
        </div>
      )}
    </div>
  );
}
