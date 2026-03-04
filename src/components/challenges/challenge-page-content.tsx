"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { ChallengeList } from "./challenge-list";
import { VizTenantIsolation } from "./viz-tenant-isolation";
import { VizRiskScoringFlow } from "./viz-risk-scoring-flow";
import { VizPresignedUrlFlow } from "./viz-presigned-url-flow";
import { VizRbacEnforcement } from "./viz-rbac-enforcement";

interface ChallengePageContentProps {
  challenges: Challenge[];
}

export function ChallengePageContent({
  challenges,
}: ChallengePageContentProps) {
  const visualizations: Record<string, ReactNode> = {
    "challenge-1": <VizTenantIsolation />,
    "challenge-2": <VizRiskScoringFlow />,
    "challenge-3": <VizPresignedUrlFlow />,
    "challenge-4": <VizRbacEnforcement />,
  };

  return (
    <ChallengeList challenges={challenges} visualizations={visualizations} />
  );
}
