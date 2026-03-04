import Link from "next/link";

interface ExecutiveSummaryProps {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export function ExecutiveSummary({
  commonApproach,
  differentApproach,
  accentWord,
}: ExecutiveSummaryProps) {
  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg p-6 md:p-8"
      style={{
        background: "oklch(0.10 0.03 195)",
        backgroundImage:
          "radial-gradient(ellipse at 25% 60%, oklch(0.52 0.14 195 / 0.12), transparent 65%)",
      }}
    >
      {/* Common approach — what most devs do wrong */}
      <p className="text-sm md:text-base leading-relaxed text-white/50">
        {commonApproach}
      </p>

      <hr className="my-4 border-white/10" />

      {/* Different approach — the accent word is highlighted */}
      <p className="text-base md:text-lg leading-relaxed font-medium text-white/90">
        {renderDifferentApproach()}
      </p>

      <p className="text-xs text-white/40 mt-4">
        <Link
          href="/"
          className="hover:text-white/70 transition-colors underline underline-offset-2"
          style={{ transitionDuration: "120ms" }}
        >
          ← Back to the live demo
        </Link>
      </p>
    </div>
  );
}
