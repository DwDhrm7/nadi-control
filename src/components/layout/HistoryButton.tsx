"use client";

import { History } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { useTranslation } from "@/lib/i18n/language-provider";
import { dictionary, pick } from "@/lib/i18n/dictionary";

export function HistoryButton() {
  const [open, setOpen] = useState(false);
  const { language, t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted hover:bg-bg hover:text-text cursor-pointer"
        aria-label="Riwayat Aktivitas"
      >
        <History size={19} />
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={t("historyModal.title")} width="max-w-lg">
        <ul className="flex flex-col gap-3">
          {dictionary.historyModal.items.map((item, i) => (
            <li key={i} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm text-text">{pick(item.action, language)}</p>
                <p className="mt-1 text-xs text-text-muted">{item.actor}</p>
              </div>
              <Badge tone={item.status === "Aktif" ? "primary" : "neutral"}>
                {item.status === "Aktif" ? t("historyModal.active") : t("historyModal.done")}
              </Badge>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
