// Tab 3 — "Work With Me"
// Sales page for the healthcare compliance SaaS proposal.
// Project-first: leads with what gets built for the client, not Humam's bio.
// Aesthetic: SaaS Modern, deep teal primary, light theme, 0.5rem radius,
//            snappy 120ms transitions. Dark panel bookends (hero + CTA).
//
// Data: src/data/proposal.ts — all portfolio outcomes from developer-profile.md.
// No "use client" — no client-side state needed.

import { ExternalLink, TrendingUp, Shield, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { proposalData } from "@/data/proposal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work With Me",
};

export default function ProposalPage() {
  const { hero, projects, approachSteps, skillCategories, cta } = proposalData;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-12">

        {/* ── Section 1: Hero — Project Brief ─────────────────────────────────
            Dark teal-navy panel. Project-first value prop.
            "Built this demo for your project" badge is mandatory.
            Background uses --section-dark (oklch(0.10 0.02 var(--primary-h)))
            set by the Layout Builder for this app.                          */}
        <section
          className="relative rounded-lg overflow-hidden"
          style={{ background: "var(--section-dark)" }}
        >
          {/* Subtle radial highlight — deep teal tint at top-left */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 20%, oklch(0.52 0.14 195 / 0.18), transparent 60%)",
            }}
          />

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-14 space-y-6">
            {/* Effort badge — mandatory in all aesthetics */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1"
                 style={{ background: "oklch(1 0 0 / 0.08)" }}>
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="font-mono text-xs tracking-wider text-white/70">
                {hero.badgeText}
              </span>
            </div>

            {/* Role label */}
            <p className="font-mono text-xs tracking-widest uppercase text-white/40">
              Full-Stack Developer · Healthcare Compliance SaaS
            </p>

            {/* Name with weight contrast */}
            <h1 className="text-4xl md:text-5xl tracking-tight leading-none">
              <span className="font-light text-white/75">Hi, I&apos;m </span>
              <span className="font-black text-white">{hero.name}</span>
            </h1>

            {/* Tailored value prop — specific to this job */}
            <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
              {hero.valueProp}
            </p>
          </div>

          {/* Stats shelf */}
          <div
            className="relative z-10 border-t border-white/10 px-8 py-5 md:px-12"
            style={{ background: "oklch(1 0 0 / 0.05)" }}
          >
            <div className="grid grid-cols-3 gap-6">
              {hero.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 2: Proof of Work ─────────────────────────────────────────
            4 projects — domain match → feature overlap → tech match.
            Outcomes are exact text from developer-profile.md.
            ExternalLink icon only rendered when url is not null.            */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Proof of Work
            </p>
            <h2 className="text-2xl font-bold tracking-tight">Relevant Projects</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Real clients, shipped to production — matched to what your platform needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.name}
                className="bg-card border border-border/60 rounded-lg p-5 space-y-3 hover:border-primary/30 transition-colors"
                style={{ transitionDuration: "var(--dur-fast, 120ms)" }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold leading-snug">
                    {project.name}
                  </h3>
                  {/* Only render ExternalLink if url exists — never links to # */}
                  {project.url !== null && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                      style={{ transitionDuration: "var(--dur-fast, 120ms)" }}
                      aria-label={`View ${project.name} live demo`}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Outcome badge — exact text from developer-profile.md */}
                <div
                  className="flex items-start gap-2 rounded-md px-3 py-2"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--success) 8%, transparent)",
                    border: "1px solid color-mix(in oklch, var(--success) 20%, transparent)",
                  }}
                >
                  <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
                  <p className="text-xs font-medium text-[color:var(--success)]">
                    {project.outcome}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="font-mono text-xs px-2 py-0.5 rounded-md"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>

                {/* Relevance note — specific match to this job */}
                {project.relevance && (
                  <p className="text-xs text-primary/80 italic border-t border-border/60 pt-2">
                    {project.relevance}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: How I Work ────────────────────────────────────────────
            Steps adapted to this project type: multi-tenant SaaS MVP build.
            Architecture → Data Layer → Feature Modules → Security → QA & Deploy.
            5 steps because this project has 5 distinct engineering phases.  */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Process
            </p>
            <h2 className="text-2xl font-bold tracking-tight">How I Work</h2>
            <p className="text-sm text-muted-foreground mt-1">
              No dark periods. Architecture agreed before implementation. Weekly working software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approachSteps.map((step, index) => (
              <div
                key={step.step}
                className={`bg-card border border-border/60 rounded-lg p-5 space-y-2 hover:border-primary/30 transition-colors ${
                  // Last step (5th) spans full width on md+ when there's an odd count
                  index === approachSteps.length - 1 && approachSteps.length % 2 !== 0
                    ? "md:col-span-2"
                    : ""
                }`}
                style={{ transitionDuration: "var(--dur-fast, 120ms)" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-2xl font-bold tabular-nums"
                        style={{
                          background: "linear-gradient(to bottom, var(--primary), oklch(0.52 0.14 195 / 0.4))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}>
                    {step.step}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground/70">
                    <Clock className="h-3 w-3" />
                    {step.timeline}
                  </span>
                </div>
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: Skills Grid ───────────────────────────────────────────
            Filtered to exactly what this job requires.
            No AI/n8n/Shopify — those are irrelevant to this project.        */}
        <section className="space-y-5">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
              Tech Stack
            </p>
            <h2 className="text-2xl font-bold tracking-tight">What I Build With</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Filtered to what your platform actually needs — no filler.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillCategories.map((category) => (
              <div
                key={category.label}
                className="bg-card border border-border/60 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-primary/70" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {category.label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="font-mono text-xs px-2.5 py-0.5 rounded-md border-border/60 text-foreground/80"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: CTA — Dark Panel ─────────────────────────────────────
            Bookend to the hero. Pulsing availability indicator is mandatory.
            "Reply on Upwork to start" is text — not a button linking to #.
            Background matches hero: var(--section-dark).                   */}
        <section
          className="relative rounded-lg overflow-hidden text-center"
          style={{ background: "var(--section-dark)" }}
        >
          {/* Subtle radial highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 80% 80%, oklch(0.52 0.14 195 / 0.15), transparent 60%)",
            }}
          />

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-14 space-y-5">
            {/* Pulsing availability indicator — mandatory, uses var(--success) */}
            <div className="flex items-center justify-center gap-2">
              <span className="relative inline-flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "var(--success)" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "var(--success)" }}
                />
              </span>
              <span
                className="text-sm"
                style={{
                  color: "color-mix(in oklch, var(--success) 80%, white)",
                }}
              >
                Currently available for new projects
              </span>
            </div>

            {/* Headline — tailored to this project */}
            <h2 className="text-2xl font-bold text-white">
              {cta.heading}
            </h2>

            {/* Body — specific to this scope (120-200 hours, module-based) */}
            <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
              {cta.subtext}
            </p>

            {/* What's already done — proof the work has started */}
            <div className="flex flex-col items-center gap-2 py-2">
              {[
                "Risk scoring dashboard built — visible in Tab 1",
                "OIG exclusion tracking and document vault implemented",
                "Multi-tenant RBAC architecture demonstrated",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2
                    className="h-3.5 w-3.5 shrink-0"
                    style={{ color: "color-mix(in oklch, var(--success) 80%, white)" }}
                  />
                  <span className="text-sm text-white/60">{item}</span>
                </div>
              ))}
            </div>

            {/* Primary action — text, not a dead-end button */}
            <p className="text-lg font-semibold text-white pt-2">
              Reply on Upwork to start
            </p>

            {/* Back to demo link */}
            <a
              href="/"
              className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors"
              style={{ transitionDuration: "var(--dur-fast, 120ms)" }}
            >
              ← Back to the demo
            </a>

            {/* Signature */}
            <p className="text-sm text-white/35 border-t border-white/10 pt-5 mt-2">
              — {cta.authorName}
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
