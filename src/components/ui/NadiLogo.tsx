"use client";

import { cn } from "@/lib/utils";

interface NadiLogoProps {
  variant?: "icon" | "full" | "horizontal" | "sidebar";
  className?: string;
  showSubtitle?: boolean;
}

export function NadiIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 220"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id="nadiComponentGrad" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#00D2C8" />
          <stop offset="25%" stopColor="#00B8E6" />
          <stop offset="60%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0044FF" />
        </linearGradient>
      </defs>

      {/* 4x4 dots matrix */}
      <g fill="#00D2C8">
        <circle cx="76.00" cy="132.00" r="3.8" />
        <circle cx="76.00" cy="145.00" r="3.8" />
        <circle cx="76.00" cy="158.00" r="3.8" />
        <circle cx="76.00" cy="171.00" r="3.8" />

        <circle cx="64.00" cy="132.00" r="3.8" />
        <circle cx="64.00" cy="145.00" r="3.8" />
        <circle cx="64.00" cy="158.00" r="3.8" />
        <circle cx="64.00" cy="171.00" r="3.8" />

        <circle cx="52.00" cy="132.00" r="3.8" />
        <circle cx="52.00" cy="145.00" r="3.8" />
        <circle cx="52.00" cy="158.00" r="3.8" />
        <circle cx="52.00" cy="171.00" r="3.8" />

        <circle cx="40.00" cy="132.00" r="3.8" />
        <circle cx="40.00" cy="145.00" r="3.8" />
        <circle cx="40.00" cy="158.00" r="3.8" />
        <circle cx="40.00" cy="171.00" r="3.8" />
      </g>

      {/* Parallel flowing lines */}
      <g fill="none" stroke="url(#nadiComponentGrad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 40.00 118.00 C 40.00 48.00, 82.00 24.00, 115.00 24.00 C 148.00 24.00, 152.00 126.00, 185.00 126.00 C 220.00 126.00, 245.00 80.00, 275.00 80.00" />
        <path d="M 52.00 118.00 C 52.00 48.00, 82.00 24.00, 115.00 24.00 C 148.00 24.00, 152.00 126.00, 185.00 126.00 C 220.00 126.00, 245.00 68.00, 275.00 68.00" />
        <path d="M 64.00 118.00 C 64.00 48.00, 82.00 24.00, 115.00 24.00 C 148.00 24.00, 152.00 126.00, 185.00 126.00 C 220.00 126.00, 245.00 56.00, 275.00 56.00" />
        <path d="M 76.00 118.00 C 76.00 48.00, 82.00 24.00, 115.00 24.00 C 148.00 24.00, 152.00 126.00, 185.00 126.00 C 220.00 126.00, 245.00 44.00, 275.00 44.00" />
      </g>

      {/* Node terminal circles */}
      <g fill="#ffffff" stroke="url(#nadiComponentGrad)" strokeWidth="4">
        <circle cx="275.00" cy="44.00" r="5.5" />
        <circle cx="275.00" cy="56.00" r="5.5" />
        <circle cx="275.00" cy="68.00" r="5.5" />
        <circle cx="275.00" cy="80.00" r="5.5" />
      </g>
    </svg>
  );
}

export function NadiIconTile({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-2.5 backdrop-blur-md border border-white/10 shadow-sm", className)}>
      <NadiIcon className="h-full w-full" />
    </div>
  );
}

export function NadiLogo({
  variant = "full",
  className,
  showSubtitle = true,
}: NadiLogoProps) {
  if (variant === "icon") {
    return <NadiIcon className={className} />;
  }

  if (variant === "sidebar") {
    return (
      <div className={cn("flex items-center gap-4", className)}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-2.5 backdrop-blur-md border border-white/10 shadow-sm">
          <NadiIcon className="h-full w-full" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold tracking-[0.25em] text-white leading-none">
            N Λ D I
          </h2>
          <p className="mt-1 text-xs font-medium tracking-wide text-white/70">
            Control Center
          </p>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={cn("flex items-center gap-3.5", className)}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 p-2 border border-white/10">
          <NadiIcon />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 font-bold tracking-widest text-text">
            <span>N Λ D I</span>
          </div>
          {showSubtitle && (
            <span className="text-[9px] font-semibold tracking-widest text-text-muted uppercase">
              NAVIGASI ADAPTIF DAN DISTRIBUSI INTELIJEN
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 p-4 border border-white/10 shadow-md">
        <NadiIcon />
      </div>
      <div className="mt-4 flex justify-center gap-4 text-2xl font-extrabold tracking-[0.3em] text-text">
        <span>N</span>
        <span>Λ</span>
        <span>D</span>
        <span>I</span>
      </div>
      {showSubtitle && (
        <p className="mt-2 text-[10px] font-bold tracking-[0.25em] text-text-muted uppercase">
          NAVIGASI ADAPTIF DAN DISTRIBUSI INTELIJEN
        </p>
      )}
    </div>
  );
}
