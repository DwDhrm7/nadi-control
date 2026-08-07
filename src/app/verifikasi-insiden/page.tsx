"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Car, Users, ShieldAlert } from "lucide-react";
import { TopbarShell, PageTitle } from "@/components/layout/TopbarShell";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { TimeframeTabs, type Timeframe } from "@/components/ui/TimeframeTabs";
import { SearchInput } from "@/components/ui/SearchInput";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast-provider";
import { useTranslation } from "@/lib/i18n/language-provider";
import { dictionary, pick } from "@/lib/i18n/dictionary";
import { INCIDENTS, INCIDENTS_PREDICTED, type Incident, type IncidentStatus } from "@/lib/data/incidents";

const TYPE_ICON: Record<string, React.ElementType> = {
  Kerumunan: Users,
  Kecelakaan: Car,
  "Macet Panjang": ShieldAlert,
  "Risiko Antrean": ShieldAlert,
  "Potensi Kerumunan": Users,
};

const TYPE_TONE: Record<string, "success" | "danger" | "primary"> = {
  Kerumunan: "success",
  Kecelakaan: "danger",
  "Macet Panjang": "primary",
  "Risiko Antrean": "primary",
  "Potensi Kerumunan": "success",
};

function barColor(type: string) {
  const tone = TYPE_TONE[type] ?? "primary";
  return tone === "danger" ? "bg-danger" : tone === "success" ? "bg-success" : "bg-primary";
}

const DEFAULT_BOX = { left: 38, top: 42, width: 34, height: 32, count: 0 };

interface TrackSample {
  t: number;
  left: number;
  top: number;
  width: number;
  height: number;
  count?: number;
}

interface DetectionTrack {
  video: string;
  duration: number;
  classes: string[];
  samples: TrackSample[];
}

// Pre-computed offline by running YOLOv8 over the raw mp4 (see scratch/yolo) —
// each track is a list of {t, left, top, width, height} in percent, sampled
// every ~0.3s. This hook just plays that track back in sync with the video.
function useDetectionTrack(videoSrc: string | undefined) {
  const [track, setTrack] = useState<DetectionTrack | null>(null);

  useEffect(() => {
    if (!videoSrc) return;
    const base = videoSrc.split("/").pop()?.replace(/\.mp4$/, "");
    let cancelled = false;
    fetch(`/videos/tracks/${base}.json`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setTrack(data);
      })
      .catch(() => {
        if (!cancelled) setTrack(null);
      });
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  return videoSrc ? track : null;
}

function sampleTrackAt(track: DetectionTrack, time: number) {
  const samples = track.samples;
  if (samples.length === 0) return null;
  if (time <= samples[0].t) return samples[0];
  const last = samples[samples.length - 1];
  if (time >= last.t) return last;

  let lo = samples[0];
  let hi = last;
  for (let i = 0; i < samples.length - 1; i++) {
    if (samples[i].t <= time && samples[i + 1].t >= time) {
      lo = samples[i];
      hi = samples[i + 1];
      break;
    }
  }
  const span = hi.t - lo.t || 1;
  const f = (time - lo.t) / span;
  const lerp = (a: number, b: number) => a + (b - a) * f;
  return {
    left: lerp(lo.left, hi.left),
    top: lerp(lo.top, hi.top),
    width: lerp(lo.width, hi.width),
    height: lerp(lo.height, hi.height),
    count: hi.count ?? lo.count ?? 0,
  };
}

function useTrackedBox(videoRef: React.RefObject<HTMLVideoElement | null>, track: DetectionTrack | null) {
  const [box, setBox] = useState(DEFAULT_BOX);

  useEffect(() => {
    if (!track) return;
    let raf: number;
    const loop = () => {
      const el = videoRef.current;
      if (el) {
        const sample = sampleTrackAt(track, el.currentTime);
        if (sample) setBox({ ...sample, count: sample.count ?? 0 });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [track, videoRef]);

  return track ? box : DEFAULT_BOX;
}

export default function VerifikasiInsidenPage() {
  const [timeframe, setTimeframe] = useState<Timeframe>("sekarang");
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");
  const [nowIncidents, setNowIncidents] = useState<Incident[]>(INCIDENTS);
  const [predictedIncidents, setPredictedIncidents] = useState<Incident[]>(INCIDENTS_PREDICTED);
  const [selectedId, setSelectedId] = useState<string>(INCIDENTS[0].id);
  const toast = useToast();
  const { language, t } = useTranslation();

  const typeLabel = (type: string) => {
    const entry = (dictionary.verifikasi.types as Record<string, { id: string; en: string }>)[type];
    return entry ? pick(entry, language) : type;
  };

  const statusLabel = (status: IncidentStatus) =>
    status === "Menunggu"
      ? t("verifikasi.waiting")
      : status === "Dikonfirmasi"
      ? t("verifikasi.confirmed")
      : status === "Ditolak"
      ? t("verifikasi.rejected")
      : t("verifikasi.needsReview");

  const source = timeframe === "sekarang" ? nowIncidents : predictedIncidents;
  const setSource = timeframe === "sekarang" ? setNowIncidents : setPredictedIncidents;

  const filtered = useMemo(
    () =>
      source.filter((i) =>
        i.cameraId.toLowerCase().includes(search.toLowerCase())
      ),
    [source, search]
  );

  const selected = source.find((i) => i.id === selectedId) ?? filtered[0] ?? source[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const track = useDetectionTrack(selected?.video);
  const trackedBox = useTrackedBox(videoRef, track);

  const criticalCount = source.filter((i) => i.confidence >= 90).length;

  function selectIncident(id: string) {
    setSelectedId(id);
    const target = source.find((i) => i.id === id);
    if (target) setNote(target.note ?? "");
  }

  function decide(status: IncidentStatus) {
    if (!selected) return;
    const currentNote = note.trim();
    setSource((prev) =>
      prev.map((i) => (i.id === selected.id ? { ...i, status, note: currentNote || undefined } : i))
    );
    toast(
      status === "Dikonfirmasi" ? "success" : status === "Ditolak" ? "error" : "info",
      `${selected.cameraId} ${t("verifikasi.toast.marked")}: ${statusLabel(status)}`
    );
    const remaining = source.filter((i) => i.status === "Menunggu" && i.id !== selected.id);
    if (remaining.length > 0) {
      selectIncident(remaining[0].id);
    } else {
      setNote("");
    }
  }

  return (
    <>
      <TopbarShell
        left={
          <>
            <PageTitle>{t("verifikasi.title")}</PageTitle>
            <TimeframeTabs value={timeframe} onChange={setTimeframe} />
          </>
        }
        right={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder={t("verifikasi.searchPlaceholder")} className="w-56" />
            <NotificationBell />
            <UserMenu />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 px-8 py-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2">
          <CardHeader
            title={t("verifikasi.queueTitle")}
            action={
              <div className="flex items-center gap-2">
                <Badge tone="danger">{criticalCount} {t("verifikasi.critical")}</Badge>
                <Badge tone="neutral">{t("verifikasi.total")}: {source.length}</Badge>
              </div>
            }
          />
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                <th className="px-5 py-3">{t("verifikasi.col.time")}</th>
                <th className="px-5 py-3">{t("verifikasi.col.camera")}</th>
                <th className="px-5 py-3">{t("verifikasi.col.type")}</th>
                <th className="px-5 py-3">{t("verifikasi.col.confidenceScore")}</th>
                <th className="px-5 py-3">{t("verifikasi.col.status")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((incident) => {
                const Icon = TYPE_ICON[incident.type] ?? ShieldAlert;
                const active = selected?.id === incident.id;
                return (
                  <tr
                    key={incident.id}
                    onClick={() => selectIncident(incident.id)}
                    className={cn(
                      "cursor-pointer border-t border-border hover:bg-bg",
                      active && "border-l-4 border-l-primary bg-primary-light"
                    )}
                  >
                    <td className="px-5 py-3 text-text">{incident.time}</td>
                    <td className="px-5 py-3 font-medium text-primary">{incident.cameraId}</td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5 text-text">
                        <Icon size={14} className="text-text-muted" />
                        {typeLabel(incident.type)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-bg">
                          <div
                            className={cn("h-full rounded-full", barColor(incident.type))}
                            style={{ width: `${incident.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-text-muted">
                          {incident.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {incident.status === "Menunggu" && active ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectIncident(incident.id);
                          }}
                          className="rounded-md bg-confirm px-3 py-1 text-xs font-semibold text-white hover:bg-confirm-dark cursor-pointer"
                        >
                          {t("verifikasi.review")}
                        </button>
                      ) : incident.status === "Menunggu" ? (
                        <Badge tone="neutral">{t("verifikasi.waiting")}</Badge>
                      ) : (
                        <Badge
                          tone={
                            incident.status === "Dikonfirmasi"
                              ? "success"
                              : incident.status === "Ditolak"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {statusLabel(incident.status)}
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-text-muted">
                    {t("verifikasi.noResults")} &quot;{search}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>

        {selected && (
          <div className="flex flex-col gap-5">
            <Card className="overflow-hidden">
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                {selected.video ? (
                  <video
                    key={selected.video}
                    ref={videoRef}
                    src={selected.video}
                    poster={selected.image}
                    className="h-full w-full object-cover opacity-90"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img src={selected.image} alt={selected.cameraId} className="h-full w-full object-cover opacity-90" />
                )}
                <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
                  LIVE REC · {selected.cameraId}
                </span>
                <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
                  {selected.time}
                </span>
                <div
                  className={cn(
                    "absolute rounded-sm border-2",
                    TYPE_TONE[selected.type] === "danger" ? "border-danger" : "border-warning"
                  )}
                  style={{
                    left: `${trackedBox.left}%`,
                    top: `${trackedBox.top}%`,
                    width: `${trackedBox.width}%`,
                    height: `${trackedBox.height}%`,
                  }}
                >
                  <span
                    className={cn(
                      "absolute -top-5 left-0 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold text-white",
                      TYPE_TONE[selected.type] === "danger" ? "bg-danger" : "bg-warning"
                    )}
                  >
                    {typeLabel(selected.type).toUpperCase()} ({selected.confidence}% Conf)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 px-5 py-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase text-text-muted">{t("verifikasi.cameraId")}</p>
                  <p className="font-semibold text-text">{selected.cameraId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-text-muted">{t("verifikasi.location")}</p>
                  <p className="font-semibold text-text">{selected.location}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-text-muted">{t("verifikasi.detectedObjects")}</p>
                  <p className="font-semibold text-text">{selected.detectedObjects} {t("verifikasi.entities")}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-text-muted">{t("verifikasi.speedEstimate")}</p>
                  <p className="font-semibold text-text">{selected.speedEstimate}</p>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
                {t("verifikasi.timeline")}
              </p>
              <div className="flex items-center justify-between">
                {selected.timeline.map((tl, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div className="h-full w-full border-t border-dashed border-border" style={{ marginTop: 5 }} />
                    <span
                      className={cn(
                        "h-2.5 w-2.5 -mt-4.75 rounded-full",
                        tl.active ? "bg-success" : "bg-border"
                      )}
                    />
                    <span className="text-[11px] text-text-muted">{tl.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <label className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                {t("verifikasi.decisionReason")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("verifikasi.notePlaceholder")}
                rows={3}
                className="mt-2 w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button variant="confirm" size="sm" onClick={() => decide("Dikonfirmasi")}>
                  {t("verifikasi.confirmIncident")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => decide("Ditolak")}>
                  {t("verifikasi.reject")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => decide("Perlu Tinjauan")}>
                  {t("verifikasi.needsReviewBtn")}
                </Button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
                {t("verifikasi.privacyNote")}
              </p>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
