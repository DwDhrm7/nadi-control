"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function RecommendationBarChart({
  data,
  labels,
}: {
  data: { zone: string; diberikan: number; diikuti: number }[];
  labels: { diberikan: string; diikuti: string };
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={6}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="zone"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
        <Tooltip
          cursor={{ fill: "var(--color-bg)" }}
          formatter={(value: any, name: any) => [
            value,
            name === "diberikan" || name === labels.diberikan
              ? labels.diberikan
              : name === "diikuti" || name === labels.diikuti
              ? labels.diikuti
              : name,
          ]}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend
          formatter={(value) =>
            value === "diberikan" || value === labels.diberikan
              ? labels.diberikan
              : value === "diikuti" || value === labels.diikuti
              ? labels.diikuti
              : value
          }
          wrapperStyle={{ fontSize: 12, color: "var(--color-text-muted)" }}
        />
        <Bar dataKey="diberikan" name={labels.diberikan} fill="var(--color-border)" radius={[4, 4, 0, 0]} maxBarSize={38} />
        <Bar dataKey="diikuti" name={labels.diikuti} fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={38} />
      </BarChart>
    </ResponsiveContainer>
  );
}
