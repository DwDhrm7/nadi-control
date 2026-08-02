import { cn } from "@/lib/utils";

type BadgeTone = "success" | "danger" | "warning" | "neutral" | "primary";

const TONES: Record<BadgeTone, string> = {
  success: "bg-success-bg text-success",
  danger: "bg-danger-bg text-danger",
  warning: "bg-warning-bg text-warning",
  neutral: "bg-bg text-text-muted",
  primary: "bg-primary-light text-primary",
};

export function Badge({
  tone = "neutral",
  dot,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        TONES[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-success",
            tone === "danger" && "bg-danger",
            tone === "warning" && "bg-warning",
            tone === "primary" && "bg-primary",
            tone === "neutral" && "bg-text-muted"
          )}
        />
      )}
      {children}
    </span>
  );
}
