"use client";

import {
  Activity,
  ShieldCheck,
  Map,
  BarChart3,
  SlidersHorizontal,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/language-provider";

const NAV_ITEMS = [
  { href: "/", key: "nav.pemantauan", icon: Activity },
  { href: "/verifikasi-insiden", key: "nav.verifikasiInsiden", icon: ShieldCheck },
  { href: "/distribusi-wisata", key: "nav.distribusiWisata", icon: Map },
  { href: "/evaluasi-kebijakan", key: "nav.evaluasiKebijakan", icon: BarChart3 },
  { href: "/kendali-perangkat", key: "nav.kendaliPerangkat", icon: SlidersHorizontal },
  { href: "/pengaturan", key: "nav.pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="flex h-full w-70 shrink-0 flex-col bg-navy px-4 py-6">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Activity size={22} className="text-white" />
        </div>
        <div>
          <p className="text-[17px] font-bold leading-tight text-white">
            NADI
            <br />
            Control
          </p>
          <p className="mt-1 text-[11px] font-medium tracking-wide text-white/50">
            {t("common.cityIntelligence")}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, key, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white",
                active && "bg-navy-active text-white shadow-sm hover:bg-navy-active"
              )}
            >
              <Icon size={18} />
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
