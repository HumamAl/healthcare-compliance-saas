"use client";

import { useState } from "react";
import {
  ClipboardList,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface ScoringStep {
  id: string;
  label: string;
  detail: string;
  example: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const steps: ScoringStep[] = [
  {
    id: "intake",
    label: "Assessment Intake",
    detail:
      "Compliance officer initiates a risk assessment for Ridgeline Family Medicine. The intake form maps to all seven OIG GCPG elements — each question carries a weighted score contribution.",
    example:
      "Question: \"When was your last HIPAA Security Risk Analysis?\" → score contribution to HIPAA Privacy & Security domain (weight: 20%)",
    icon: ClipboardList,
  },
  {
    id: "weight",
    label: "Domain Weighting",
    detail:
      "Each domain is scored against its OIG element weight. Billing & Coding carries 25% of the overall score; Incident Response only 2%. A 60-point Billing score has more drag than a 60-point P&P score.",
    example:
      "Ridgeline: Billing 58 × 0.25 = 14.5 pts | HIPAA 74 × 0.20 = 14.8 pts | Credentialing 82 × 0.15 = 12.3 pts ...",
    icon: Sliders,
  },
  {
    id: "findings",
    label: "Finding Severity Adjustment",
    detail:
      "Critical and High findings apply a penalty to their domain score until a CAP is verified. A Critical finding (e.g., an unresolved OIG Exclusion Hit) can suppress the domain score by up to 15 points until closed.",
    example:
      "Exclusion Screening domain: base score 79 → Critical finding active → adjusted score 64 → marked Overdue CAP → further penalized to 51",
    icon: AlertTriangle,
  },
  {
    id: "cap-resolve",
    label: "CAP Resolution Trigger",
    detail:
      "When a compliance officer marks a CAP as Verified, the scoring engine re-runs the affected domain score in real time — not at the next monthly batch. The practice sees its score update within the session.",
    example:
      "Patricia Reyes closes CAP-0041 (Billing Finding #7) → Billing domain re-scores from 58 → 71 → Overall score: 64 → 67",
    icon: CheckCircle2,
  },
  {
    id: "trend",
    label: "Score History & Trend",
    detail:
      "Every scoring event is appended to the practice's score history. The compliance score trend chart shows improvement over time — critical for PE groups demonstrating remediation progress to insurers or during due diligence.",
    example:
      "Vantage Health Partners portfolio: Ridgeline trend 58 → 64 → 67 → 72 over 90 days — documented evidence of active compliance program.",
    icon: RefreshCw,
  },
];

export function VizRiskScoringFlow() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const Icon = step.icon;
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="space-y-4">
      {/* Step indicators */}
      <div className="flex items-center gap-1.5">
        {steps.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = i === currentStep;
          const isPast = i < currentStep;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium"
              style={{
                background: isActive
                  ? "color-mix(in oklch, var(--primary) 10%, transparent)"
                  : isPast
                  ? "color-mix(in oklch, var(--success) 8%, transparent)"
                  : "var(--muted)",
                border: isActive
                  ? "1px solid color-mix(in oklch, var(--primary) 30%, transparent)"
                  : isPast
                  ? "1px solid color-mix(in oklch, var(--success) 25%, transparent)"
                  : "1px solid color-mix(in oklch, var(--border), transparent 30%)",
                color: isActive
                  ? "var(--primary)"
                  : isPast
                  ? "var(--success)"
                  : "var(--muted-foreground)",
                transitionDuration: "120ms",
              }}
            >
              <StepIcon className="h-2.5 w-2.5 shrink-0" />
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Active step detail */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          border: "1px solid color-mix(in oklch, var(--primary) 20%, transparent)",
          background:
            "color-mix(in oklch, var(--primary) 4%, transparent)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center shrink-0"
            style={{
              background: "color-mix(in oklch, var(--primary) 12%, transparent)",
            }}
          >
            <Icon
              className="h-3.5 w-3.5"
              style={{ color: "var(--primary)" }}
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{step.label}</p>
            <p
              className="text-[10px] font-mono"
              style={{ color: "var(--muted-foreground)" }}
            >
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--foreground)" }}
        >
          {step.detail}
        </p>

        {/* Example trace */}
        <div
          className="rounded px-3 py-2"
          style={{
            background: "oklch(0.10 0.03 195 / 0.06)",
            border: "1px solid color-mix(in oklch, var(--border), transparent 50%)",
          }}
        >
          <p
            className="text-[10px] font-mono leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            {step.example}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={isFirst}
          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-30"
          style={{
            border: "1px solid color-mix(in oklch, var(--border), transparent 40%)",
            background: "var(--card)",
            color: "var(--muted-foreground)",
            transitionDuration: "120ms",
          }}
        >
          <ChevronLeft className="h-3 w-3" />
          Previous
        </button>

        <p
          className="text-[10px] font-mono"
          style={{ color: "var(--muted-foreground)" }}
        >
          {currentStep + 1} / {steps.length}
        </p>

        <button
          onClick={() =>
            setCurrentStep((s) => Math.min(steps.length - 1, s + 1))
          }
          disabled={isLast}
          className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md disabled:opacity-30"
          style={{
            border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)",
            background: "color-mix(in oklch, var(--primary) 8%, transparent)",
            color: "var(--primary)",
            transitionDuration: "120ms",
          }}
        >
          Next
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
