"use client";

import { useEffect, useState } from "react";

export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = () =>
      new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-danger-bg px-3 py-1.5 text-xs font-semibold text-danger">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
      {time ?? "--:--:--"}
    </span>
  );
}
