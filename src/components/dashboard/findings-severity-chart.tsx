"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { FindingSeverityByOrg } from "@/lib/types";

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

const SEVERITY_COLORS = {
  critical: "var(--chart-5)",
  high: "var(--chart-4)",
  medium: "var(--chart-2)",
  low: "var(--chart-3)",
};

const SEVERITY_LABELS = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0);

  return (
    <div
      className="rounded border border-border/60 bg-card p-3 text-xs shadow-md"
      style={{ minWidth: "10rem" }}
    >
      <p className="font-medium text-foreground mb-2 truncate max-w-[10rem]">
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-3 mb-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
          </div>
          <span className="font-mono font-semibold text-foreground">
            {entry.value}
          </span>
        </div>
      ))}
      <div className="mt-1.5 pt-1.5 border-t border-border/40 flex justify-between">
        <span className="text-muted-foreground">Total Findings:</span>
        <span className="font-mono font-semibold">{total}</span>
      </div>
    </div>
  );
};

interface FindingsSeverityChartProps {
  data: FindingSeverityByOrg[];
}

export function FindingsSeverityChart({ data }: FindingsSeverityChartProps) {
  // Filter to orgs with findings for a cleaner chart
  const filtered = data.filter((d) => d.total > 0);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={filtered}
        margin={{ top: 4, right: 12, bottom: 0, left: -16 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.7}
          vertical={false}
        />
        <XAxis
          dataKey="orgName"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
        <Legend
          iconType="square"
          iconSize={8}
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
        />
        <Bar
          dataKey="critical"
          name={SEVERITY_LABELS.critical}
          stackId="findings"
          fill={SEVERITY_COLORS.critical}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="high"
          name={SEVERITY_LABELS.high}
          stackId="findings"
          fill={SEVERITY_COLORS.high}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="medium"
          name={SEVERITY_LABELS.medium}
          stackId="findings"
          fill={SEVERITY_COLORS.medium}
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="low"
          name={SEVERITY_LABELS.low}
          stackId="findings"
          fill={SEVERITY_COLORS.low}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
