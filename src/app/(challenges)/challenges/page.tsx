import type { Metadata } from "next";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { ChallengePageContent } from "@/components/challenges/challenge-page-content";
import { CtaCloser } from "@/components/challenges/cta-closer";
import { challenges, executiveSummary } from "@/data/challenges";

export const metadata: Metadata = {
  title: "My Engineering Approach — ComplianceHub",
  description:
    "How I would tackle the core technical challenges in building a multi-tenant healthcare compliance SaaS: tenant isolation, risk scoring, presigned document uploads, and RBAC enforcement.",
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 space-y-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Engineering Approach
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            Four technical decisions that determine whether this platform is
            audit-proof or just compliance-adjacent
          </p>
        </div>

        {/* Executive summary — dark banner */}
        <ExecutiveSummary
          commonApproach={executiveSummary.commonApproach}
          differentApproach={executiveSummary.differentApproach}
          accentWord={executiveSummary.accentWord}
        />

        {/* Challenge cards with visualizations */}
        <ChallengePageContent challenges={challenges} />

        {/* CTA closer */}
        <CtaCloser />

      </div>
    </div>
  );
}
