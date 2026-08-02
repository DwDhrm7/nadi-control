"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PenSquare, Play, TrafficCone } from "lucide-react";
import { TopbarShell, PageTitle } from "@/components/layout/TopbarShell";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { HistoryButton } from "@/components/layout/HistoryButton";
import { RoadmapLink } from "@/components/layout/RoadmapLink";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { StatCard, Trend } from "@/components/ui/StatCard";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast-provider";
import { useTranslation } from "@/lib/i18n/language-provider";
import { dictionary, pick } from "@/lib/i18n/dictionary";
import { DEVICES, MESSAGE_PRIORITIES, TLS_MODES, type Device } from "@/lib/data/devices";

const PAGE_SIZE = 5;
const MAX_CHARS = 60;

export default function KendaliPerangkatPage() {
  const [devices, setDevices] = useState<Device[]>(DEVICES);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(DEVICES[0].id);
  const [priority, setPriority] = useState("kemacetan");
  const [content, setContent] = useState("AWAS MACET DI DEPAN GUNAKAN JALUR ALTERNATIF");
  const [startTime, setStartTime] = useState("02:30 PM");
  const [endTime, setEndTime] = useState("06:00 PM");
  const [tlsMode, setTlsMode] = useState<Device["tlsMode"]>("Normal");
  const toast = useToast();
  const { language, t } = useTranslation();

  const typeLabel = (type: Device["type"]) => pick(dictionary.kendali.types[type], language);
  const priorityLabel = (label: string) => {
    const entry = (dictionary.kendali.priorities as Record<string, { id: string; en: string }>)[label];
    return entry ? pick(entry, language) : label;
  };
  const tlsModeLabel = (mode: string) => {
    const entry = (dictionary.kendali.tlsModes as Record<string, { id: string; en: string }>)[mode];
    return entry ? pick(entry, language) : mode;
  };
  const activeMessageLabel = (msg: string) => {
    if (msg === "-") return t("kendali.noActiveMessage");
    if (msg === "Koneksi Terputus") return t("kendali.connectionLost");
    const entry = (dictionary.kendali.tlsModes as Record<string, { id: string; en: string }>)[msg];
    return entry ? pick(entry, language) : msg;
  };

  const filtered = useMemo(
    () =>
      devices.filter(
        (d) =>
          d.id.toLowerCase().includes(search.toLowerCase()) ||
          d.location.toLowerCase().includes(search.toLowerCase())
      ),
    [devices, search]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const selected = devices.find((d) => d.id === selectedId) ?? devices[0];

  const online = devices.filter((d) => d.status === "Online").length;
  const attention = devices.filter((d) => d.status === "Offline").length;

  function selectDevice(d: Device) {
    setSelectedId(d.id);
    if (d.type === "Lampu Adaptif") {
      setTlsMode(d.tlsMode ?? "Normal");
    } else {
      setContent(d.activeMessage === "-" ? "" : d.activeMessage);
    }
  }

  function sendCommand() {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== selected.id) return d;
        if (d.type === "Lampu Adaptif") {
          return { ...d, tlsMode, activeMessage: tlsMode ?? "Normal" };
        }
        return { ...d, activeMessage: content || "-" };
      })
    );
    toast("success", `${t("kendali.commandSent")} ${selected.id}.`);
  }

  return (
    <>
      <TopbarShell
        left={
          <>
            <PageTitle>{t("kendali.title")}</PageTitle>
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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard label={t("kendali.stats.totalDevices")} value={devices.length} footer={<Trend direction="up" tone="success">2.4%</Trend>} />
          <StatCard
            label={t("kendali.stats.onlineStatus")}
            value={online}
            footer={<span className="text-success">● {Math.round((online / devices.length) * 100)}%</span>}
          />
          <StatCard
            label={t("kendali.stats.needsAttention")}
            value={attention}
            footer={<span className="text-danger">⚠ {t("common.offline")}</span>}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h3 className="text-[15px] font-semibold text-text">{t("kendali.listTitle")}</h3>
              <SearchInput
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(0);
                }}
                placeholder={t("kendali.searchPlaceholder")}
                className="w-64"
              />
            </div>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <th className="px-5 py-3">{t("kendali.col.id")}</th>
                  <th className="px-5 py-3">{t("kendali.col.location")}</th>
                  <th className="px-5 py-3">{t("kendali.col.type")}</th>
                  <th className="px-5 py-3">{t("kendali.col.status")}</th>
                  <th className="px-5 py-3">{t("kendali.col.activeMessage")}</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((d) => (
                  <tr
                    key={d.id}
                    onClick={() => selectDevice(d)}
                    className={cn(
                      "cursor-pointer border-t border-border hover:bg-bg",
                      selected?.id === d.id && "border-l-4 border-l-primary bg-primary-light"
                    )}
                  >
                    <td className="px-5 py-3 font-medium text-text">{d.id}</td>
                    <td className="px-5 py-3 text-text">{d.location}</td>
                    <td className="px-5 py-3 text-text-muted">{typeLabel(d.type)}</td>
                    <td className="px-5 py-3">
                      <Badge tone={d.status === "Online" ? "success" : "danger"} dot>
                        {d.status === "Online" ? t("common.online") : t("common.offline")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-text-muted">{activeMessageLabel(d.activeMessage)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-text-muted">
              <span>
                {t("kendali.showing")} {page * PAGE_SIZE + 1}-{Math.min(filtered.length, page * PAGE_SIZE + PAGE_SIZE)} {t("kendali.of")}{" "}
                {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded p-1 hover:bg-bg disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded p-1 hover:bg-bg disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </Card>

          {selected.type === "Plang Digital (VMS)" ? (
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-text">
                  <PenSquare size={16} className="text-primary" />
                  {t("kendali.composeTitle")}
                </h3>
                <Badge tone="neutral">{selected.id}</Badge>
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                {t("kendali.priorityTitle")}
              </p>
              <div className="flex flex-col gap-2">
                {MESSAGE_PRIORITIES.map((p) => (
                  <label
                    key={p.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm",
                      priority === p.id ? "border-primary bg-primary-light" : "border-border",
                      p.warn && priority !== p.id && "border-danger/30 text-danger"
                    )}
                  >
                    <input
                      type="radio"
                      name="priority"
                      checked={priority === p.id}
                      onChange={() => setPriority(p.id)}
                      className="accent-primary"
                    />
                    <span className={cn(p.warn && "font-medium text-danger", priority === p.id && "font-medium text-text")}>
                      {p.warn && "⚠ "}
                      {priorityLabel(p.label)}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {t("kendali.contentTitle")}
                  </label>
                  <span className="text-xs text-text-muted">
                    {content.length}/{MAX_CHARS} {t("kendali.characters")}
                  </span>
                </div>
                <textarea
                  value={content}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setContent(e.target.value.toUpperCase())}
                  rows={2}
                  className="mt-1.5 w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="mt-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  {t("kendali.previewTitle")}
                </p>
                <div className="flex min-h-24 items-center justify-center rounded-lg bg-black p-4 text-center">
                  <span className="text-lg font-extrabold uppercase leading-snug tracking-wide text-amber-400">
                    {content || "—"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-text-muted">{t("kendali.startTime")}</label>
                  <input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-muted">{t("kendali.endTime")}</label>
                  <input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => setContent("")}>
                  {t("common.cancel")}
                </Button>
                <Button variant="confirm" onClick={sendCommand}>
                  <Play size={14} />
                  {t("kendali.sendCommand")}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[15px] font-semibold text-text">
                  <TrafficCone size={16} className="text-primary" />
                  {t("kendali.tlsControlTitle")}
                </h3>
                <Badge tone="neutral">{selected.id}</Badge>
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                {t("kendali.operationMode")}
              </p>
              <div className="flex flex-col gap-2">
                {TLS_MODES.map((mode) => (
                  <label
                    key={mode}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm",
                      tlsMode === mode ? "border-primary bg-primary-light font-medium text-text" : "border-border text-text"
                    )}
                  >
                    <input
                      type="radio"
                      name="tlsMode"
                      checked={tlsMode === mode}
                      onChange={() => setTlsMode(mode)}
                      className="accent-primary"
                    />
                    {tlsModeLabel(mode ?? "")}
                  </label>
                ))}
              </div>
              <Button variant="confirm" className="mt-5 w-full" onClick={sendCommand}>
                <Play size={14} />
                {t("kendali.applyMode")}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
