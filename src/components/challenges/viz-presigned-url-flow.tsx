import {
  Monitor,
  Server,
  Cloud,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface FlowStep {
  id: string;
  actor: string;
  action: string;
  note: string;
  type: "client" | "server" | "storage" | "audit";
  highlight?: boolean;
}

const secureFlow: FlowStep[] = [
  {
    id: "1",
    actor: "Browser",
    action: "POST /api/upload-intent",
    note: "Sends: filename, docType, orgId (from session only)",
    type: "client",
  },
  {
    id: "2",
    actor: "API Route",
    action: "Validates role + generates presigned URL",
    note: "AWS SDK calls S3 server-side — credentials never leave this layer",
    type: "server",
    highlight: true,
  },
  {
    id: "3",
    actor: "Browser",
    action: "PUT {presigned-url} ← directly to S3",
    note: "Signed URL expires in 300 seconds. No app server in the upload path.",
    type: "client",
  },
  {
    id: "4",
    actor: "S3",
    action: "Emits upload event via S3 Event Notification",
    note: "Triggers Lambda/webhook to confirm the upload completed",
    type: "storage",
  },
  {
    id: "5",
    actor: "API Route",
    action: "Writes Audit Log entry",
    note:
      "Logs: userId, orgId, docType, s3Key, timestamp, role — used for HIPAA audit trail",
    type: "audit",
    highlight: true,
  },
];

const typeConfig = {
  client: {
    icon: Monitor,
    border: "color-mix(in oklch, var(--primary) 25%, transparent)",
    bg: "color-mix(in oklch, var(--primary) 7%, transparent)",
    iconColor: "var(--primary)",
  },
  server: {
    icon: Server,
    border: "color-mix(in oklch, var(--warning) 35%, transparent)",
    bg: "color-mix(in oklch, var(--warning) 8%, transparent)",
    iconColor: "var(--warning)",
  },
  storage: {
    icon: Cloud,
    border: "color-mix(in oklch, var(--border), transparent 30%)",
    bg: "var(--muted)",
    iconColor: "var(--muted-foreground)",
  },
  audit: {
    icon: FileCheck,
    border: "color-mix(in oklch, var(--success) 30%, transparent)",
    bg: "color-mix(in oklch, var(--success) 7%, transparent)",
    iconColor: "var(--success)",
  },
};

interface PatternBadgeProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  sublabel: string;
  good: boolean;
}

function PatternBadge({ icon: Icon, label, sublabel, good }: PatternBadgeProps) {
  return (
    <div
      className="flex-1 rounded-md p-2.5"
      style={{
        border: `1px solid ${
          good
            ? "color-mix(in oklch, var(--success) 25%, transparent)"
            : "color-mix(in oklch, var(--destructive) 25%, transparent)"
        }`,
        background: good
          ? "color-mix(in oklch, var(--success) 6%, transparent)"
          : "color-mix(in oklch, var(--destructive) 6%, transparent)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon
          className="h-3 w-3"
          style={{ color: good ? "var(--success)" : "var(--destructive)" }}
        />
        <p
          className="text-xs font-semibold"
          style={{ color: good ? "var(--success)" : "var(--destructive)" }}
        >
          {label}
        </p>
      </div>
      <p
        className="text-[10px] leading-snug"
        style={{ color: "var(--muted-foreground)" }}
      >
        {sublabel}
      </p>
    </div>
  );
}

export function VizPresignedUrlFlow() {
  return (
    <div className="space-y-4">
      {/* Pattern comparison */}
      <div className="flex gap-2">
        <PatternBadge
          icon={ShieldAlert}
          label="Naive pattern"
          sublabel="Upload to Next.js API route → server relays to S3 → credentials in server memory"
          good={false}
        />
        <PatternBadge
          icon={ShieldCheck}
          label="Presigned URL pattern"
          sublabel="Server generates signed URL → browser uploads directly to S3 → credentials never leave server"
          good={true}
        />
      </div>

      {/* Step-by-step flow */}
      <div className="space-y-1.5">
        {secureFlow.map((step, i) => {
          const config = typeConfig[step.type];
          const Icon = config.icon;
          return (
            <div key={step.id} className="flex items-start gap-2">
              {/* Step number + connector line */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-medium shrink-0"
                  style={{
                    background: step.highlight
                      ? config.bg
                      : "var(--muted)",
                    border: `1px solid ${
                      step.highlight
                        ? config.border
                        : "color-mix(in oklch, var(--border), transparent 40%)"
                    }`,
                    color: step.highlight
                      ? config.iconColor
                      : "var(--muted-foreground)",
                  }}
                >
                  {step.id}
                </div>
                {i < secureFlow.length - 1 && (
                  <div
                    className="w-px flex-1 mt-1"
                    style={{
                      background:
                        "color-mix(in oklch, var(--border), transparent 30%)",
                      minHeight: "12px",
                    }}
                  />
                )}
              </div>

              {/* Step content */}
              <div
                className="flex-1 rounded-md px-3 py-2 mb-1.5"
                style={{
                  border: `1px solid ${
                    step.highlight
                      ? config.border
                      : "color-mix(in oklch, var(--border), transparent 50%)"
                  }`,
                  background: step.highlight ? config.bg : "var(--card)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Icon
                    className="h-3 w-3 shrink-0"
                    style={{
                      color: step.highlight
                        ? config.iconColor
                        : "var(--muted-foreground)",
                    }}
                  />
                  <span
                    className="text-[10px] font-medium uppercase tracking-wide"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {step.actor}
                  </span>
                  {step.highlight && (
                    <span
                      className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                      style={{
                        background: config.bg,
                        color: config.iconColor,
                        border: `1px solid ${config.border}`,
                      }}
                    >
                      key step
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium font-mono">{step.action}</p>
                <p
                  className="text-[10px] mt-0.5 leading-snug"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {step.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
