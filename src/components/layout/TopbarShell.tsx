export function TopbarShell({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-surface px-8 py-4">
      <div className="flex items-center gap-6">{left}</div>
      <div className="flex items-center gap-4">{right}</div>
    </header>
  );
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="text-xl font-bold text-primary">{children}</h1>;
}
