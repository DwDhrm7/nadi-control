"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useClickOutside } from "@/lib/use-click-outside";
import { useTranslation } from "@/lib/i18n/language-provider";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const { t } = useTranslation();
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 shrink-0 cursor-pointer overflow-hidden rounded-full ring-2 ring-transparent hover:ring-primary/30"
      >
        <img
          src="https://i.pravatar.cc/64?img=13"
          alt="Operator Alpha"
          className="h-full w-full object-cover"
        />
      </button>
      {open && (
        <div className="absolute right-0 z-[1100] mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-text">Operator Alpha</p>
            <p className="text-xs text-text-muted">ID: NADI-OPS-042</p>
          </div>
          <Link
            href="/pengaturan"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-bg"
          >
            <User size={15} /> {t("userMenu.operatorProfile")}
          </Link>
          <Link
            href="/pengaturan"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-bg"
          >
            <Settings size={15} /> {t("userMenu.settings")}
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="flex w-full cursor-pointer items-center gap-2.5 border-t border-border px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger-bg"
          >
            <LogOut size={15} /> {t("userMenu.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
