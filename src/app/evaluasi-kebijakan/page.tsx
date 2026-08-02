"use client";

import { useState } from "react";
import { Download, FlaskConical, MoreVertical } from "lucide-react";
import { TopbarShell, PageTitle } from "@/components/layout/TopbarShell";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { HistoryButton } from "@/components/layout/HistoryButton";
import { RoadmapLink } from "@/components/layout/RoadmapLink";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DonutProgress } from "@/components/ui/DonutProgress";
import { DensityLineChart } from "@/components/charts/DensityLineChart";
import { ZoneMap } from "@/components/map";
import { useToast } from "@/lib/toast-provider";
import { useTranslation } from "@/lib/i18n/language-provider";
import { dictionary, pick } from "@/lib/i18n/dictionary";
import { AUDIT_TRAIL, KPI_METRICS, localizeDensityTrend, localizePolicyMarkers } from "@/lib/data/policy";

export default function EvaluasiKebijakanPage() {
  const { language, t } = useTranslation();
  const focusOptions = dictionary.evaluasi.focusOptions;
  const [visitors, setVisitors] = useState(15000);
  const [peakHour, setPeakHour] = useState("02:00 PM");
  const [duration, setDuration] = useState(4);
  const [focus, setFocus] = useState<string>(focusOptions[0].id);
  const [result, setResult] = useState({ main: 92, overflow: 45 });
  const [running, setRunning] = useState(false);
  const toast = useToast();

  function runSimulation() {
    setRunning(true);
    setTimeout(() => {
      const load = Math.min(99, Math.round(60 + (visitors / 1000) * 1.8 + duration * 1.2));
      const overflow = Math.max(10, Math.round(load * 0.5 - duration));
      setResult({ main: load, overflow });
      setRunning(false);
      toast("success", t("evaluasi.simDone"));
    }, 700);
  }

  function downloadReport() {
    const header = "Waktu,Operator,Tindakan,Alasan,Status\n";
    const rows = AUDIT_TRAIL.map(
      (a) => `${a.time},${a.operator},"${a.action}","${a.reason}",${a.status}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "jejak-audit-keputusan.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast("success", t("evaluasi.reportDownloaded"));
  }

  return (
    <>
      <TopbarShell
        left={
          <>
            <PageTitle>{t("evaluasi.controlCenter")}</PageTitle>
            <span className="border-b-2 border-primary pb-0.5 text-sm font-medium text-primary">
              {t("evaluasi.tabTitle")}
            </span>
            <RoadmapLink />
          </>
        }
        right={
          <>
            <HistoryButton />
            <NotificationBell />
            <UserMenu />
          </>
        }
      />

      <div className="flex flex-col gap-5 px-8 py-6">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-5">
          {KPI_METRICS.map((m) => (
            <Card key={m.id} className="flex flex-col items-center gap-3 p-5 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                {t(`evaluasi.kpi.${m.id}`)}
              </p>
              <DonutProgress value={m.value} tone={m.tone} />
              <p className="text-xs text-text-muted">
                {m.exceeded ? (
                  <span className="font-semibold text-success">
                    {t("evaluasi.exceeded")} ({m.target}%)
                  </span>
                ) : (
                  <>{t("evaluasi.target")}: {m.target}%</>
                )}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="flex flex-col gap-5 xl:col-span-2">
            <Card className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-text">{t("evaluasi.lineChartTitle")}</h3>
                <MoreVertical size={16} className="text-text-muted" />
              </div>
              <DensityLineChart data={localizeDensityTrend(language)} labels={{ sebelum: t("evaluasi.before"), sesudah: t("evaluasi.after") }} />
            </Card>

            <Card className="overflow-hidden">
              <CardHeader title={t("evaluasi.mapTitle")} />
              <ZoneMap center={[-8.55, 115.25]} zoom={9} markers={localizePolicyMarkers(language)} className="h-64" />
              <div className="flex items-center justify-between px-5 py-3 text-xs text-text-muted">
                <span>{t("evaluasi.visitLevel")}</span>
                <span>{t("evaluasi.lowHigh")}</span>
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-text">
              <FlaskConical size={17} className="text-primary" />
              {t("evaluasi.simTitle")}
            </h3>
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-medium text-text-muted">{t("evaluasi.estVisitors")}</label>
                <input
                  type="number"
                  value={visitors}
                  onChange={(e) => setVisitors(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-text-muted">{t("evaluasi.peakHour")}</label>
                  <input
                    type="text"
                    value={peakHour}
                    onChange={(e) => setPeakHour(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted">{t("evaluasi.duration")}</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted">{t("evaluasi.focusDestination")}</label>
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {focusOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {pick(opt, language)}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={runSimulation} disabled={running}>
                <FlaskConical size={15} />
                {running ? t("evaluasi.running") : t("evaluasi.runSimulation")}
              </Button>
            </div>

            <div className="mt-5 rounded-lg bg-bg p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                {t("evaluasi.predictionTitle")}
              </p>
              <div className="mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text">{t("evaluasi.mainZoneCapacity")}</span>
                  <span className="font-bold text-danger">{result.main}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-danger" style={{ width: `${result.main}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-text">{t("evaluasi.overflowZone")}</span>
                  <span className="font-bold text-success">{result.overflow}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full rounded-full bg-success" style={{ width: `${result.overflow}%` }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-[15px] font-semibold text-text">{t("evaluasi.auditTitle")}</h3>
            <button
              onClick={downloadReport}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline cursor-pointer"
            >
              <Download size={14} /> {t("evaluasi.downloadReport")}
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                <th className="px-5 py-3">{t("evaluasi.col.time")}</th>
                <th className="px-5 py-3">{t("evaluasi.col.operator")}</th>
                <th className="px-5 py-3">{t("evaluasi.col.action")}</th>
                <th className="px-5 py-3">{t("evaluasi.col.reason")}</th>
                <th className="px-5 py-3">{t("evaluasi.col.status")}</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_TRAIL.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-5 py-3.5 text-text-muted">{a.time}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={`flex h-6 w-8 items-center justify-center rounded text-[10px] font-bold text-white ${
                          a.automated ? "bg-text-muted" : "bg-primary"
                        }`}
                      >
                        {a.initials}
                      </span>
                      <span className="text-text">{a.operator}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-text">{a.action}</td>
                  <td className="px-5 py-3.5 text-text-muted">{a.reason}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={a.status === "Aktif" ? "primary" : "neutral"}>
                      {a.status === "Aktif" ? t("evaluasi.active") : t("evaluasi.done")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
