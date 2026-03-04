"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { OutcomeStatement } from "./outcome-statement";
import { cn } from "@/lib/utils";

interface ChallengeListItemProps {
  challenge: Challenge;
  index: number;
  visualization?: ReactNode;
}

function ChallengeListItem({
  challenge,
  index,
  visualization,
}: ChallengeListItemProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "bg-card rounded-lg p-6 space-y-4",
        "border hover:border-primary/30 transition-all",
        "shadow-[0_1px_3px_oklch(0_0_0/0.07),0_1px_2px_oklch(0_0_0/0.04)]",
        "hover:shadow-[0_4px_12px_oklch(0_0_0/0.10),0_2px_4px_oklch(0_0_0/0.05)]",
        "hover:-translate-y-px"
      )}
      style={{
        borderColor: "color-mix(in oklch, var(--border), transparent 40%)",
        transitionDuration: "120ms",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Step number + title */}
      <div className="flex items-baseline gap-3">
        <span
          className="font-mono text-sm font-medium shrink-0 tabular-nums"
          style={{ color: "color-mix(in oklch, var(--primary) 60%, transparent)" }}
        >
          {stepNumber}
        </span>
        <h3 className="text-lg font-semibold leading-snug">
          {challenge.title}
        </h3>
      </div>

      {/* Description */}
      <p
        className="text-sm leading-relaxed pl-8"
        style={{ color: "var(--muted-foreground)" }}
      >
        {challenge.description}
      </p>

      {/* Visualization slot */}
      {visualization && <div>{visualization}</div>}

      {/* Outcome statement */}
      {challenge.outcome && (
        <OutcomeStatement outcome={challenge.outcome} index={index} />
      )}
    </div>
  );
}

interface ChallengeListProps {
  challenges: Challenge[];
  visualizations?: Record<string, ReactNode>;
}

export function ChallengeList({
  challenges,
  visualizations = {},
}: ChallengeListProps) {
  return (
    <div className="flex flex-col gap-4">
      {challenges.map((challenge, index) => (
        <ChallengeListItem
          key={challenge.id}
          challenge={challenge}
          index={index}
          visualization={visualizations[challenge.id]}
        />
      ))}
    </div>
  );
}
