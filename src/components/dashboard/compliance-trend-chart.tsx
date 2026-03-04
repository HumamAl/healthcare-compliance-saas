"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { ComplianceScoreTrendPoint } from "@/lib/types";

interface TooltipPayloadItem {
  value?: number | string;
  name?: string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value as number;
  const tier =
    score >= 80
      ? { label: "Compliant", color: "var(--success)" }
      : score >= 60
      ? { label: "At-Risk", color: "var(--warning)" }
      : { label: "High-Risk", color: "var(--destructive)" };

  return (
    <div
      className="rounded border border-border/60 bg-card p-3 text-xs shadow-md"
      style={{ minWidth: "9rem" }}
    >
      <p className="font-medium text-foreground mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full shrink-0"
          style={{ backgroundColor: "var(--chart-1)" }}
        />
        <span className="text-muted-foreground">Portfolio Score:</span>
        <span className="font-mono font-semibold text-foreground">{score}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `color-mix(in oklch, ${tier.color}, transparent 80%)`,
            color: tier.color,
          }}
        >
          {tier.label}
        </span>
      </div>
    </div>
  );
};

interface ComplianceTrendChartProps {
  data: ComplianceScoreTrendPoint[];
}

export function ComplianceTrendChart({ data }: ComplianceTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
        <defs>
          <linearGradient id="fillPortfolioScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.20} />
            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.7}
          vertical={false}
        />
        <ReferenceLine
          y={80}
          stroke="var(--success)"
          strokeDasharray="4 3"
          strokeOpacity={0.5}
          label={{
            value: "Compliant threshold (80)",
            position: "insideTopRight",
            fontSize: 10,
            fill: "var(--success)",
            dy: -4,
          }}
        />
        <ReferenceLine
          y={60}
          stroke="var(--warning)"
          strokeDasharray="4 3"
          strokeOpacity={0.5}
          label={{
            value: "At-Risk threshold (60)",
            position: "insideTopRight",
            fontSize: 10,
            fill: "var(--warning)",
            dy: -4,
          }}
        />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          domain={[50, 100]}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="portfolioScore"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#fillPortfolioScore)"
          dot={false}
          activeDot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
