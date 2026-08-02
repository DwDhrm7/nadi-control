"use client";

import { useState } from "react";
import { AlertTriangle, ClipboardList, Compass, ShieldCheck, Radio } from "lucide-react";
import { TopbarShell, PageTitle } from "@/components/layout/TopbarShell";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { LiveClock } from "@/components/ui/LiveClock";
import { TimeframeTabs, type Timeframe } from "@/components/ui/TimeframeTabs";
import { StatCard, Trend } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { ZoneMap } from "@/components/map";
import { useTranslation } from "@/lib/i18n/language-provider";
import { pick } from "@/lib/i18n/dictionary";
import {
  BALI_CENTER,
  ZONES_NOW,
  ZONES_PREDICTED,
  STREAM_NOW,
  STREAM_PREDICTED,
  STREAM_HISTORY,
  localizeZones,
} from "@/lib/data/monitoring";

export default function PemantauanPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("sekarang");
  const [historyOpen, setHistoryOpen] = useState(false);
  const { language, t } = useTranslation();

  const zonesData = timeframe === "sekarang" ? ZONES_NOW : ZONES_PREDICTED;
  const zones = localizeZones(zonesData, language);
  const stream = timeframe === "sekarang" ? STREAM_NOW : STREAM_PREDICTED;

  const activeDense = zones.filter((z) => z.tone === "danger").length;

  return (
    <>
      <TopbarShell
        left={
          <>
            <PageTitle>{t("pemantauan.title")}</PageTitle>
            <TimeframeTabs value={timeframe} onChange={setTimeframe} />
          </>
        }
        right={
          <>
            <LiveClock />
            <NotificationBell />
            <UserMenu />
          </>
        }
      />

      <div className="flex flex-col gap-6 px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label={t("pemantauan.stats.activeDenseZones")}
            value={activeDense}
            icon={AlertTriangle}
            iconTone="warning"
            footer={<Trend direction="up" tone="danger">+2 {t("pemantauan.stats.sinceLastHour")}</Trend>}
          />
          <StatCard
            label={t("pemantauan.stats.pendingIncidents")}
            value={3}
            icon={ClipboardList}
            iconTone="primary"
            footer={<span className="text-text-muted">{t("pemantauan.stats.highPriority")}</span>}
          />
          <StatCard
            label={t("pemantauan.stats.activeRecs")}
            value="1.284"
            icon={Compass}
            iconTone="primary"
            footer={<span className="text-text-muted">{t("pemantauan.stats.systemRunning")}</span>}
          />
          <StatCard
            label={t("pemantauan.stats.complianceToday")}
            value="27%"
            icon={ShieldCheck}
            iconTone="success"
            footer={<Trend direction="up" tone="success">+5% {t("pemantauan.stats.vsYesterday")}</Trend>}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2">
            <CardHeader
              title={t("pemantauan.mapTitle")}
              action={
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />{t("pemantauan.sepi")}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />{t("pemantauan.sedang")}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" />{t("pemantauan.padat")}</span>
                </div>
              }
            />
            <ZoneMap center={BALI_CENTER} zoom={11} markers={zones} className="h-110" />
          </Card>

          <Card className="flex flex-col overflow-hidden">
            <CardHeader
              icon={Radio}
              title={t("pemantauan.eventStream")}
              action={<Badge tone="danger" dot>{t("pemantauan.realTime")}</Badge>}
            />
            <div className="flex flex-1 flex-col divide-y divide-border overflow-y-auto">
              {stream.map((ev) => (
                <div
                  key={ev.id}
                  className="border-l-4 px-4 py-3"
                  style={{
                    borderLeftColor:
                      ev.tone === "danger"
                        ? "var(--color-danger)"
                        : ev.tone === "warning"
                        ? "var(--color-warning)"
                        : ev.tone === "success"
                        ? "var(--color-success)"
                        : "var(--color-primary)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-text-muted">{ev.time}</span>
                    <div className="flex items-center gap-1.5">
                      <Badge tone={ev.tone === "primary" ? "primary" : ev.tone}>{pick(ev.tag, language)}</Badge>
                      {ev.predicted && <Badge tone="primary">{t("common.prediction")}</Badge>}
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-text">{ev.title}</p>
                  <div className="mt-0.5 flex items-center justify-between">
                    <p className="text-xs text-text-muted">{pick(ev.detail, language)}</p>
                    {ev.confidence && (
                      <span className="text-xs font-semibold text-primary">
                        {t("common.confidence")} {ev.confidence}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setHistoryOpen(true)}
              className="border-t border-border py-3 text-center text-sm font-medium text-primary hover:bg-bg cursor-pointer"
            >
              {t("pemantauan.viewAllHistory")}
            </button>
          </Card>
        </div>
      </div>

      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} title={t("pemantauan.historyModalTitle")} width="max-w-lg">
        <div className="flex flex-col divide-y divide-border">
          {STREAM_HISTORY.map((ev) => (
            <div key={ev.id} className="py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-text-muted">{ev.time}</span>
                <Badge tone={ev.tone === "primary" ? "primary" : ev.tone}>{pick(ev.tag, language)}</Badge>
              </div>
              <p className="mt-1 text-sm font-semibold text-text">{ev.title}</p>
              <p className="text-xs text-text-muted">{pick(ev.detail, language)}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
