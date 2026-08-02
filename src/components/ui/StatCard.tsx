import { cn } from "@/lib/utils";
import { Card } from "./Card";

type Tone = "primary" | "success" | "danger" | "warning";

const ICON_TONES: Record<Tone, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconTone = "primary",
  footer,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  iconTone?: Tone;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              ICON_TONES[iconTone]
            )}
          >
            <Icon size={15} />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-text">{value}</p>
      {footer && <div className="mt-2 text-xs">{footer}</div>}
    </Card>
  );
}

export function Trend({
  direction,
  tone = "neutral",
  children,
}: {
  direction?: "up" | "down";
  tone?: "success" | "danger" | "neutral";
  children: React.ReactNode;
}) {
  const toneCls =
    tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-text-muted";
  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", toneCls)}>
      {direction === "up" && <span>↗</span>}
      {direction === "down" && <span>↘</span>}
      {children}
    </span>
  );
}
