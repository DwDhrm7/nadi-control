import type { ZoneMarker } from "@/components/map";
import type { Language } from "@/lib/i18n/dictionary";

interface Bilingual {
  id: string;
  en: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  tone: "primary" | "success" | "danger" | "warning";
  exceeded?: boolean;
}

export const KPI_METRICS: KpiMetric[] = [
  { id: "density", label: "Penurunan Kepadatan", value: 12, target: 15, tone: "primary" },
  { id: "lagging", label: "Kunjungan Daerah Tertinggal", value: 8, target: 10, tone: "primary" },
  { id: "compliance", label: "Kepatuhan Rekomendasi", value: 27, target: 25, tone: "success", exceeded: true },
  { id: "accuracy", label: "Akurasi Prediksi", value: 83, target: 85, tone: "primary" },
  { id: "response", label: "Pengurangan Waktu Respons", value: 24, target: 30, tone: "danger" },
];

export const DENSITY_TREND = [
  { period: "Minggu 1", sebelum: 62, sesudah: 55 },
  { period: "Minggu 2", sebelum: 68, sesudah: 58 },
  { period: "Minggu 3", sebelum: 71, sesudah: 60 },
  { period: "Minggu 4", sebelum: 75, sesudah: 66 },
  { period: "Minggu 5", sebelum: 82, sesudah: 64 },
  { period: "Minggu 6", sebelum: 88, sesudah: 70 },
];

export function localizeDensityTrend(lang: Language) {
  return DENSITY_TREND.map((item, idx) => ({
    ...item,
    period: lang === "en" ? `Week ${idx + 1}` : `Minggu ${idx + 1}`,
  }));
}

interface PolicyMapMarkerData {
  id: string;
  label: Bilingual;
  lat: number;
  lng: number;
  tone: "success" | "warning" | "danger";
  detail: Bilingual;
}

export const POLICY_MAP_MARKERS_DATA: PolicyMapMarkerData[] = [
  { id: "candi", label: { id: "Zona Candi & Sejarah", en: "Temple & Heritage Zone" }, lat: -8.5833, lng: 115.32, tone: "warning", detail: { id: "Tingkat kunjungan tinggi.", en: "High visit level." } },
  { id: "ubud", label: { id: "Kawasan Ubud", en: "Ubud Area" }, lat: -8.5069, lng: 115.2625, tone: "danger", detail: { id: "Kepadatan tertinggi minggu ini.", en: "Highest density this week." } },
  { id: "tabanan", label: { id: "Tabanan Selatan", en: "South Tabanan" }, lat: -8.58, lng: 115.13, tone: "success", detail: { id: "Distribusi kunjungan meningkat.", en: "Visit distribution improving." } },
];

export function localizePolicyMarkers(lang: Language): ZoneMarker[] {
  return POLICY_MAP_MARKERS_DATA.map((m) => ({
    id: m.id,
    lat: m.lat,
    lng: m.lng,
    tone: m.tone,
    label: m.label[lang],
    detail: m.detail[lang],
  }));
}

export interface AuditEntry {
  id: string;
  time: string;
  operator: string;
  initials: string;
  action: string;
  reason: string;
  status: "Aktif" | "Selesai";
  automated?: boolean;
}

export const AUDIT_TRAIL: AuditEntry[] = [
  {
    id: "a1",
    time: "10:45:22",
    operator: "A. Riyadi",
    initials: "OP1",
    action: "Pengalihan Rute Selatan",
    reason: "Kepadatan Zona Candi > 85%, Prediksi stagnasi 2 jam",
    status: "Aktif",
  },
  {
    id: "a2",
    time: "09:12:05",
    operator: "S. Wibowo",
    initials: "OP3",
    action: "Broadcast Peringatan Parkir Penuh",
    reason: "Sensor parkir P1 & P2 mencapai 98% kapasitas",
    status: "Selesai",
  },
  {
    id: "a3",
    time: "08:30:00",
    operator: "Automated (NADI)",
    initials: "SYS",
    action: "Penyesuaian Lampu Lintas (Pola Pagi)",
    reason: "Jadwal harian rutin, peningkatan volume masuk kota",
    status: "Selesai",
    automated: true,
  },
];
