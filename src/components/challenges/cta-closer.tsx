"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaCloser() {
  return (
    <section
      className="rounded-lg border p-6"
      style={{
        borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--primary) 4%, transparent), var(--background))",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold mb-1">
            Ready to discuss the architecture?
          </h3>
          <p
            className="text-sm max-w-md"
            style={{ color: "var(--muted-foreground)" }}
          >
            These aren&apos;t hypotheticals — they&apos;re the actual decisions
            I&apos;d make in week one. Happy to walk through any of them in a
            call.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
            style={{
              color: "var(--muted-foreground)",
              transitionDuration: "120ms",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--foreground)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--muted-foreground)")
            }
          >
            See the proposal
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <span
            className="text-xs font-medium px-3 py-1.5 rounded-md"
            style={{
              color: "var(--primary)",
              border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
              background:
                "color-mix(in oklch, var(--primary) 6%, transparent)",
            }}
          >
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </section>
  );
}
