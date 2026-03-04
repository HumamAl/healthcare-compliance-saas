"use client";

import { useState } from "react";
import {
  Building2,
  Shield,
  Database,
  Server,
  Globe,
  Info,
} from "lucide-react";

interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  type: "frontend" | "middleware" | "service" | "database" | "external";
  detail: string;
}

const nodes: ArchNode[] = [
  {
    id: "client",
    label: "Client Request",
    sublabel: "Next.js page / API",
    type: "frontend",
    detail:
      "Every request carries the session JWT. The user's orgId is embedded in the token at login — no URL manipulation can change it.",
  },
  {
    id: "middleware",
    label: "Org Context Middleware",
    sublabel: "edge runtime, runs first",
    type: "middleware",
    detail:
      "Runs before any route handler. Extracts orgId from the verified JWT, attaches it to the request headers as x-org-id. If the token is invalid or orgId is missing, the request is rejected here — it never reaches the service layer.",
  },
  {
    id: "service",
    label: "Service Layer",
    sublabel: "injected org context",
    type: "service",
    detail:
      "All data access functions accept an OrgContext object as a first argument. A linter rule flags any function that queries the DB without an OrgContext parameter. No query can be written that forgets the org scope.",
  },
  {
    id: "db",
    label: "PostgreSQL + RLS",
    sublabel: "Row-Level Security",
    type: "database",
    detail:
      "Postgres Row-Level Security policies enforce orgId at the database engine level. Even if application code is bypassed, a query without the correct org context returns zero rows — not an error, which prevents enumeration attacks.",
  },
];

const typeStyles: Record<
  ArchNode["type"],
  { border: string; bg: string; iconColor: string }
> = {
  frontend: {
    border: "color-mix(in oklch, var(--primary) 30%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 8%, transparent)",
    iconColor: "var(--primary)",
  },
  middleware: {
    border: "color-mix(in oklch, var(--warning) 40%, transparent)",
    bg: "color-mix(in oklch, var(--warning) 8%, transparent)",
    iconColor: "var(--warning)",
  },
  service: {
    border: "color-mix(in oklch, var(--primary) 20%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 5%, transparent)",
    iconColor: "var(--primary)",
  },
  database: {
    border: "color-mix(in oklch, var(--success) 35%, transparent)",
    bg: "color-mix(in oklch, var(--success) 8%, transparent)",
    iconColor: "var(--success)",
  },
  external: {
    border: "color-mix(in oklch, var(--border) 60%, transparent)",
    bg: "var(--muted)",
    iconColor: "var(--muted-foreground)",
  },
};

const nodeIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  client: Globe,
  middleware: Shield,
  service: Server,
  db: Database,
};

const tenants = [
  { name: "BlueStar Health Network", type: "Insurer", score: 81 },
  { name: "Vantage Health Partners", type: "PE Group", score: 64 },
  { name: "Ridgeline Family Medicine", type: "Practice", score: 72 },
];

export function VizTenantIsolation() {
  const [selectedId, setSelectedId] = useState<string | null>("middleware");

  const selectedNode = nodes.find((n) => n.id === selectedId);

  return (
    <div className="space-y-4">
      {/* Tenant badges — shows what's being isolated */}
      <div className="flex flex-wrap gap-2">
        {tenants.map((t) => (
          <div
            key={t.name}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md"
            style={{
              border: "1px solid color-mix(in oklch, var(--border), transparent 30%)",
              background: "var(--card)",
            }}
          >
            <Building2
              className="h-3 w-3"
              style={{ color: "var(--primary)" }}
            />
            <span className="font-medium">{t.name}</span>
            <span
              className="font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              {t.type}
            </span>
          </div>
        ))}
      </div>

      {/* Architecture nodes — horizontal flow */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {nodes.map((node, i) => {
          const Icon = nodeIcons[node.id];
          const styles = typeStyles[node.type];
          const isSelected = selectedId === node.id;

          return (
            <div key={node.id} className="flex sm:flex-col items-center gap-2">
              <button
                onClick={() =>
                  setSelectedId(isSelected ? null : node.id)
                }
                className="flex-1 sm:flex-none flex items-center gap-2 px-3 py-2.5 rounded-lg text-left w-full sm:w-auto cursor-pointer"
                style={{
                  border: `1px solid ${isSelected ? styles.border : "color-mix(in oklch, var(--border), transparent 40%)"}`,
                  background: isSelected ? styles.bg : "var(--card)",
                  outline: isSelected
                    ? `2px solid ${styles.border}`
                    : "none",
                  outlineOffset: "1px",
                  transitionDuration: "120ms",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionProperty: "border-color, background, outline",
                }}
              >
                <Icon
                  className="h-4 w-4 shrink-0"
                  style={{
                    color: isSelected
                      ? styles.iconColor
                      : "var(--muted-foreground)",
                  }}
                />
                <div>
                  <p className="text-xs font-medium leading-tight">
                    {node.label}
                  </p>
                  <p
                    className="text-[10px] leading-tight mt-0.5"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {node.sublabel}
                  </p>
                </div>
              </button>

              {/* Connector arrow — only between nodes on desktop */}
              {i < nodes.length - 1 && (
                <span
                  className="hidden sm:block text-xs font-mono select-none"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail panel — slides in when a node is selected */}
      {selectedNode && (
        <div
          className="flex items-start gap-2.5 rounded-md px-3 py-2.5"
          style={{
            border: `1px solid ${typeStyles[selectedNode.type].border}`,
            background: typeStyles[selectedNode.type].bg,
            transitionDuration: "120ms",
          }}
        >
          <Info
            className="h-3.5 w-3.5 mt-0.5 shrink-0"
            style={{ color: typeStyles[selectedNode.type].iconColor }}
          />
          <div>
            <p
              className="text-xs font-semibold mb-0.5"
              style={{ color: typeStyles[selectedNode.type].iconColor }}
            >
              {selectedNode.label}
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--foreground)" }}
            >
              {selectedNode.detail}
            </p>
          </div>
        </div>
      )}

      <p
        className="text-[10px]"
        style={{ color: "var(--muted-foreground)" }}
      >
        Click any layer to see how org isolation is enforced at that stage.
      </p>
    </div>
  );
}
