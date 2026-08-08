"use client";

import { useEffect, useState } from "react";

function formatTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function LiveClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setTime(formatTime()), 0);
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => {
      clearTimeout(timer);
      clearInterval(id);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-danger-bg px-3 py-1.5 text-xs font-semibold text-danger">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
      {time ?? "--:--:--"}
    </span>
  );
}
