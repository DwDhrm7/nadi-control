import type { ZoneMarker } from "@/components/map";
import type { Language } from "@/lib/i18n/dictionary";

export const BALI_CENTER: [number, number] = [-8.6482, 115.1892];

interface Bilingual {
  id: string;
  en: string;
}

export interface ZoneMarkerData {
  id: string;
  label: Bilingual;
  lat: number;
  lng: number;
  tone: "success" | "warning" | "danger";
  detail?: Bilingual;
  pulse?: boolean;
}

export function localizeZones(zones: ZoneMarkerData[], lang: Language): ZoneMarker[] {
  return zones.map((z) => ({
    id: z.id,
    lat: z.lat,
    lng: z.lng,
    tone: z.tone,
    pulse: z.pulse,
    label: z.label[lang],
    detail: z.detail?.[lang],
  }));
}

export const ZONES_NOW: ZoneMarkerData[] = [
  { id: "tabanan", label: { id: "Tabanan", en: "Tabanan" }, lat: -8.5443, lng: 115.1289, tone: "success", detail: { id: "Kepadatan rendah — lalu lintas lancar.", en: "Low density — traffic flowing smoothly." } },
  { id: "canggu", label: { id: "Canggu 1.240", en: "Canggu 1,240" }, lat: -8.6478, lng: 115.1385, tone: "danger", detail: { id: "1.240 kendaraan terdeteksi — kepadatan tinggi.", en: "1,240 vehicles detected — high density." }, pulse: true },
  { id: "seminyak", label: { id: "Seminyak (Sedang)", en: "Seminyak (Moderate)" }, lat: -8.6905, lng: 115.1611, tone: "warning", detail: { id: "Volume kendaraan meningkat, masih terkendali.", en: "Vehicle volume rising, still under control." } },
  { id: "kuta", label: { id: "Kuta (Padat)", en: "Kuta (Heavy)" }, lat: -8.718, lng: 115.1686, tone: "danger", detail: { id: "Kepadatan tinggi di simpang utama.", en: "High density at the main intersection." } },
  { id: "pecatu", label: { id: "Pecatu", en: "Pecatu" }, lat: -8.8291, lng: 115.1808, tone: "danger", detail: { id: "Antrean panjang menuju kawasan wisata.", en: "Long queues heading into the tourist area." } },
];

export const ZONES_PREDICTED: ZoneMarkerData[] = [
  { id: "tabanan", label: { id: "Tabanan", en: "Tabanan" }, lat: -8.5443, lng: 115.1289, tone: "success", detail: { id: "Diprediksi tetap lancar dalam 1-3 jam.", en: "Predicted to stay smooth over the next 1-3 hours." } },
  { id: "canggu", label: { id: "Canggu (Naik)", en: "Canggu (Rising)" }, lat: -8.6478, lng: 115.1385, tone: "danger", detail: { id: "Diprediksi meningkat 8% dalam 1-3 jam.", en: "Predicted to rise 8% over the next 1-3 hours." }, pulse: true },
  { id: "seminyak", label: { id: "Seminyak (Padat)", en: "Seminyak (Heavy)" }, lat: -8.6905, lng: 115.1611, tone: "danger", detail: { id: "Diprediksi naik ke status padat.", en: "Predicted to escalate to heavy status." } },
  { id: "kuta", label: { id: "Kuta (Padat)", en: "Kuta (Heavy)" }, lat: -8.718, lng: 115.1686, tone: "danger", detail: { id: "Tetap padat, disarankan pengalihan rute.", en: "Remains heavy, route diversion advised." } },
  { id: "pecatu", label: { id: "Pecatu (Turun)", en: "Pecatu (Falling)" }, lat: -8.8291, lng: 115.1808, tone: "warning", detail: { id: "Diprediksi turun ke status sedang.", en: "Predicted to drop to moderate status." } },
];

export interface StreamEvent {
  id: number;
  time: string;
  tag: Bilingual;
  tone: "danger" | "warning" | "success" | "primary";
  title: string;
  detail: Bilingual;
  confidence?: number;
  predicted?: boolean;
}

export const STREAM_NOW: StreamEvent[] = [
  { id: 1, time: "14:32", tag: { id: "DUGAAN INSIDEN", en: "SUSPECTED INCIDENT" }, tone: "danger", title: "Jl. Raya Canggu", detail: { id: "Deteksi Anomali", en: "Anomaly Detected" }, confidence: 87, predicted: true },
  { id: 2, time: "14:28", tag: { id: "KEPADATAN", en: "DENSITY" }, tone: "warning", title: "Kawasan Kuta", detail: { id: "Volume Kendaraan Naik", en: "Vehicle Volume Rising" }, confidence: 92 },
  { id: 3, time: "14:15", tag: { id: "KONFLIK LALU LINTAS", en: "TRAFFIC CONFLICT" }, tone: "warning", title: "Simpang Seminyak", detail: { id: "Antrean Simpang", en: "Intersection Queue" }, confidence: 75 },
  { id: 4, time: "13:50", tag: { id: "TERURAI", en: "CLEARED" }, tone: "success", title: "Jl. Raya Denpasar", detail: { id: "Kepadatan kembali normal", en: "Density back to normal" } },
];

export const STREAM_PREDICTED: StreamEvent[] = [
  { id: 5, time: "+1j", tag: { id: "PREDIKSI KEPADATAN", en: "DENSITY FORECAST" }, tone: "warning", title: "Simpang Seminyak", detail: { id: "Diperkirakan naik ke status padat", en: "Expected to escalate to heavy status" }, confidence: 81, predicted: true },
  { id: 6, time: "+2j", tag: { id: "PREDIKSI INSIDEN", en: "INCIDENT FORECAST" }, tone: "danger", title: "Tol Pasir Koja KM 4", detail: { id: "Risiko antrean akibat perangkat offline", en: "Queue risk due to offline device" }, confidence: 68, predicted: true },
  { id: 7, time: "+2j", tag: { id: "PREDIKSI TERURAI", en: "CLEARING FORECAST" }, tone: "success", title: "Jl. Raya Canggu", detail: { id: "Diperkirakan terurai setelah jam puncak", en: "Expected to clear after peak hour" }, confidence: 74, predicted: true },
];

export const STREAM_HISTORY: StreamEvent[] = [
  ...STREAM_NOW,
  { id: 8, time: "13:22", tag: { id: "KEPATUHAN", en: "COMPLIANCE" }, tone: "success", title: "Zona Ubud", detail: { id: "Rekomendasi rute alternatif diikuti 82% wisatawan", en: "Alternative route recommendation followed by 82% of visitors" } },
  { id: 9, time: "12:58", tag: { id: "KEPADATAN", en: "DENSITY" }, tone: "warning", title: "Pantai Nyanyi", detail: { id: "Lonjakan kunjungan +18%", en: "Visit surge +18%" } },
  { id: 10, time: "12:10", tag: { id: "DUGAAN INSIDEN", en: "SUSPECTED INCIDENT" }, tone: "danger", title: "Tol Pasir Koja KM 4", detail: { id: "Kecelakaan minor terverifikasi", en: "Minor accident verified" }, confidence: 91 },
];
