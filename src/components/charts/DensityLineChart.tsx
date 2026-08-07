"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DensityLineChart({
  data,
  labels,
}: {
  data: { period: string; sebelum: number; sesudah: number }[];
  labels: { sebelum: string; sesudah: string };
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 11 }} />
        <Tooltip
          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          formatter={(value: any, name: any) => [
            value,
            name === "sebelum" || name === labels.sebelum
              ? labels.sebelum
              : name === "sesudah" || name === labels.sesudah
              ? labels.sesudah
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
            value === "sebelum" || value === labels.sebelum
              ? labels.sebelum
              : value === "sesudah" || value === labels.sesudah
              ? labels.sesudah
              : value
          }
          wrapperStyle={{ fontSize: 12, color: "var(--color-text-muted)" }}
        />
        <Line
          type="monotone"
          dataKey="sebelum"
          name={labels.sebelum}
          stroke="var(--color-text-muted)"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="sesudah"
          name={labels.sesudah}
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
