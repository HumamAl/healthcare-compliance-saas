import { TrendingUp } from "lucide-react";

interface OutcomeStatementProps {
  outcome: string;
  index?: number;
}

export function OutcomeStatement({ outcome }: OutcomeStatementProps) {
  return (
    <div
      className="flex items-start gap-2 rounded-md px-3 py-2.5"
      style={{
        backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
        border: "1px solid color-mix(in oklch, var(--success) 18%, transparent)",
      }}
    >
      <TrendingUp
        className="h-3.5 w-3.5 mt-0.5 shrink-0"
        style={{ color: "var(--success)" }}
      />
      <p
        className="text-xs font-medium leading-relaxed"
        style={{ color: "var(--success)" }}
      >
        {outcome}
      </p>
    </div>
  );
}
