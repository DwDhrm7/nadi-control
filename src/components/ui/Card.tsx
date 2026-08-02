import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  icon: Icon,
  title,
  action,
  className,
}: {
  icon?: React.ElementType;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border px-5 py-4",
        className
      )}
    >
      <h3 className="flex items-center gap-2 text-[15px] font-semibold text-text">
        {Icon && <Icon size={18} className="text-primary" />}
        {title}
      </h3>
      {action}
    </div>
  );
}
