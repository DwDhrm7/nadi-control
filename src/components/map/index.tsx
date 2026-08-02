"use client";

import dynamic from "next/dynamic";

export const ZoneMap = dynamic(
  () => import("./ZoneMap").then((mod) => mod.ZoneMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-bg text-sm text-text-muted">
        Memuat peta...
      </div>
    ),
  }
);

export type { ZoneMarker } from "./ZoneMap";
