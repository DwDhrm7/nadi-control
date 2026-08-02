"use client";

import { Bell, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useClickOutside } from "@/lib/use-click-outside";
import { useTranslation } from "@/lib/i18n/language-provider";
import { dictionary, pick } from "@/lib/i18n/dictionary";

const KINDS = ["warning", "danger", "info", "success"] as const;

const ICONS = {
  warning: { Icon: AlertTriangle, cls: "text-warning" },
  danger: { Icon: AlertTriangle, cls: "text-danger" },
  info: { Icon: Info, cls: "text-primary" },
  success: { Icon: CheckCircle2, cls: "text-success" },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(2);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { language, t } = useTranslation();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          setUnread(0);
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-bg hover:text-text cursor-pointer"
        aria-label="Notifikasi"
      >
        <Bell size={19} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-[1100] mt-2 w-80 rounded-xl border border-border bg-surface shadow-xl">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold text-text">
            {t("notificationBell.title")}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {dictionary.notificationBell.items.map((n, i) => {
              const { Icon, cls } = ICONS[KINDS[i % KINDS.length]];
              return (
                <div
                  key={i}
                  className="flex gap-3 border-b border-border px-4 py-3 last:border-0 hover:bg-bg"
                >
                  <Icon size={16} className={`mt-0.5 shrink-0 ${cls}`} />
                  <div>
                    <p className="text-sm text-text">{pick(n.title, language)}</p>
                    <p className="mt-0.5 text-xs text-text-muted">{pick(n.time, language)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
