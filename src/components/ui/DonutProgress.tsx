import { cn } from "@/lib/utils";

export function DonutProgress({
  value,
  size = 88,
  stroke = 8,
  tone = "primary",
}: {
  value: number;
  size?: number;
  stroke?: number;
  tone?: "primary" | "success" | "danger" | "warning";
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(value, 100) / 100);

  const colorClass = {
    primary: "stroke-primary",
    success: "stroke-success",
    danger: "stroke-danger",
    warning: "stroke-warning",
  }[tone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("fill-none transition-all duration-700 ease-out", colorClass)}
        />
      </svg>
      <span className="absolute text-lg font-bold text-text">{value}%</span>
    </div>
  );
}
