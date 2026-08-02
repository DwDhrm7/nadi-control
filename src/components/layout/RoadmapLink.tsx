"use client";

import { Milestone, CheckCircle2, CircleDot, Circle } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useTranslation } from "@/lib/i18n/language-provider";
import { dictionary, pick } from "@/lib/i18n/dictionary";

const STATUS_ICON = {
  done: { Icon: CheckCircle2, cls: "text-success" },
  active: { Icon: CircleDot, cls: "text-primary" },
  planned: { Icon: Circle, cls: "text-text-muted" },
};

const QUARTERS = ["Q1 2026", "Q1 2026", "Q2 2026", "Q2 2026", "Q3 2026", "Q3 2026"];

export function RoadmapLink() {
  const [open, setOpen] = useState(false);
  const { language, t } = useTranslation();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary sm:flex cursor-pointer"
      >
        <Milestone size={15} />
        {t("common.roadmap")}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title={t("roadmapModal.title")} width="max-w-lg">
        <ul className="flex flex-col gap-3">
          {dictionary.roadmapModal.items.map((item, i) => {
            const { Icon, cls } = STATUS_ICON[item.status];
            return (
              <li key={i} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <Icon size={18} className={`mt-0.5 shrink-0 ${cls}`} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {QUARTERS[i]}
                  </p>
                  <p className="text-sm text-text">{pick(item.title, language)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Modal>
    </>
  );
}
