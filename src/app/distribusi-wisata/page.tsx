"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Compass, Info, ThumbsUp, Filter } from "lucide-react";
import { TopbarShell, PageTitle } from "@/components/layout/TopbarShell";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { TimeframeTabs, type Timeframe } from "@/components/ui/TimeframeTabs";
import { StatCard, Trend } from "@/components/ui/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SearchInput } from "@/components/ui/SearchInput";
import { RecommendationBarChart } from "@/components/charts/RecommendationBarChart";
import { ZoneMap } from "@/components/map";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast-provider";
import { useTranslation } from "@/lib/i18n/language-provider";
import {
  DESTINATIONS,
  HEAT_MARKERS,
  INCENTIVE_ZONES,
  RECOMMENDATION_CHART,
  type IncentiveZone,
} from "@/lib/data/tourism";

export default function DistribusiWisataPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("sekarang");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Jenuh" | "Alternatif">("Semua");
  const [filterOpen, setFilterOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [zones, setZones] = useState<IncentiveZone[]>(INCENTIVE_ZONES);
  const [draftZones, setDraftZones] = useState<IncentiveZone[]>(INCENTIVE_ZONES);
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const toast = useToast();
  const { t } = useTranslation();

  const statusLabel = (s: "Semua" | "Jenuh" | "Alternatif") =>
    s === "Semua" ? t("distribusi.filterAll") : s === "Jenuh" ? t("distribusi.statusJenuh") : t("distribusi.statusAlternatif");

  const filtered = useMemo(() => {
    let list = DESTINATIONS.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "Semua") list = list.filter((d) => d.status === statusFilter);
    return showAll ? list : list.slice(0, 4);
  }, [search, statusFilter, showAll]);

  return (
    <>
      <TopbarShell
        left={
          <>
            <PageTitle>{t("distribusi.title")}</PageTitle>
            <TimeframeTabs value={timeframe} onChange={setTimeframe} />
          </>
        }
        right={
          <>
            <NotificationBell />
            <UserMenu />
          </>
        }
      />

      <div className="flex flex-col gap-5 px-8 py-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            label={t("distribusi.stats.saturatedDensity")}
            value={timeframe === "sekarang" ? "-12%" : "-9%"}
            icon={AlertTriangle}
            iconTone="warning"
            footer={<Trend direction="down" tone="success">{t("distribusi.stats.loadReduced")}</Trend>}
          />
          <StatCard
            label={t("distribusi.stats.altVisits")}
            value={timeframe === "sekarang" ? "+8%" : "+13%"}
            icon={Compass}
            iconTone="primary"
            footer={<Trend direction="up" tone="success">{t("distribusi.stats.trafficIncrease")}</Trend>}
          />
          <StatCard
            label={t("distribusi.stats.recFollowed")}
            value="27%"
            icon={ThumbsUp}
            iconTone="primary"
            footer={<span className="text-text-muted">{t("distribusi.stats.conversionRate")}</span>}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="p-5 xl:col-span-2">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-text">{t("distribusi.chartTitle")}</h3>
            </div>
            <RecommendationBarChart
              data={RECOMMENDATION_CHART}
              labels={{ diberikan: t("distribusi.given"), diikuti: t("distribusi.followed") }}
            />
          </Card>

          <Card className="p-5">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-[15px] font-semibold text-text">
                {t("distribusi.weightTitle")}
                <Info size={14} className="text-text-muted" />
              </h3>
            </div>
            <p className="mb-4 text-xs text-text-muted">{t("distribusi.weightDesc")}</p>
            <div className="flex flex-col gap-4">
              {zones.map((z) => (
                <div key={z.id}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-semibold text-text">{z.name}</span>
                    <span className="font-bold text-primary">{z.weight.toFixed(1)}x</span>
                  </div>
                  <p className="text-xs text-text-muted">{z.partners} {t("distribusi.activePartners")}</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(z.weight / 3) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              className="mt-5 w-full"
              onClick={() => {
                setDraftZones(zones);
                setWeightModalOpen(true);
              }}
            >
              {t("distribusi.adjustWeight")}
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-[15px] font-semibold text-text">{t("distribusi.statusTitle")}</h3>
              <div className="flex items-center gap-2">
                <SearchInput value={search} onChange={setSearch} placeholder={t("distribusi.searchPlaceholder")} className="w-52" />
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen((v) => !v)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg cursor-pointer"
                  >
                    <Filter size={15} />
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 z-20 mt-1.5 w-40 rounded-lg border border-border bg-surface py-1 shadow-lg">
                      {(["Semua", "Jenuh", "Alternatif"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setStatusFilter(opt);
                            setFilterOpen(false);
                          }}
                          className={cn(
                            "block w-full px-3 py-1.5 text-left text-sm hover:bg-bg cursor-pointer",
                            statusFilter === opt ? "font-semibold text-primary" : "text-text"
                          )}
                        >
                          {statusLabel(opt)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <th className="px-5 py-3">{t("distribusi.col.destination")}</th>
                  <th className="px-5 py-3">{t("distribusi.col.regency")}</th>
                  <th className="px-5 py-3">{t("distribusi.col.zoneStatus")}</th>
                  <th className="px-5 py-3">{t("distribusi.col.occupancy")}</th>
                  <th className="px-5 py-3">{t("distribusi.col.forecast")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d, i) => (
                  <tr key={d.id} className={cn("border-t border-border", i === 0 && "border-l-4 border-l-primary bg-primary-light")}>
                    <td className="px-5 py-3 font-medium text-text">{d.name}</td>
                    <td className="px-5 py-3 text-text-muted">{d.regency}</td>
                    <td className="px-5 py-3">
                      <Badge tone={d.status === "Jenuh" ? "danger" : "success"} dot>
                        {d.status === "Jenuh" ? t("distribusi.statusJenuh") : t("distribusi.statusAlternatif")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-text">{d.occupancy}%</td>
                    <td className="px-5 py-3">
                      <span className={cn("font-semibold", d.trend === "up" ? (d.status === "Jenuh" ? "text-danger" : "text-success") : "text-text-muted")}>
                        {d.predicted}% {d.trend === "up" ? "↗" : d.trend === "down" ? "↘" : "→"}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-text-muted">
                      {t("verifikasi.noResults")} &quot;{search}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full border-t border-border py-3 text-center text-sm font-medium text-primary hover:bg-bg cursor-pointer"
            >
              {showAll ? t("distribusi.hide") : t("distribusi.viewAll")}
            </button>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader title={t("distribusi.heatmapTitle")} />
            <ZoneMap center={[-8.5833, 115.32]} zoom={9} markers={HEAT_MARKERS} heat className="h-64" />
            <div className="flex items-center justify-center gap-4 px-4 py-3 text-xs text-text-muted">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" />{t("distribusi.high")}</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />{t("distribusi.low")}</span>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={weightModalOpen} onClose={() => setWeightModalOpen(false)} title={t("distribusi.adjustWeightModal")}>
        <div className="flex flex-col gap-5">
          {draftZones.map((z, idx) => (
            <div key={z.id}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold text-text">{z.name}</span>
                <span className="font-bold text-primary">{z.weight.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={z.weight}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setDraftZones((prev) =>
                    prev.map((p, i) => (i === idx ? { ...p, weight: value } : p))
                  );
                }}
                className="mt-2 w-full accent-primary"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setWeightModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              onClick={() => {
                setZones(draftZones);
                setWeightModalOpen(false);
                toast("success", t("distribusi.weightUpdated"));
              }}
            >
              {t("distribusi.saveWeight")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
