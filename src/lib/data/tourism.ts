import type { ZoneMarker } from "@/components/map";

export const RECOMMENDATION_CHART = [
  { zone: "Canggu", diberikan: 480, diikuti: 165 },
  { zone: "Kuta", diberikan: 420, diikuti: 150 },
  { zone: "Ubud", diberikan: 350, diikuti: 235 },
  { zone: "Seminyak", diberikan: 300, diikuti: 105 },
];

export interface IncentiveZone {
  id: string;
  name: string;
  partners: number;
  weight: number;
}

export const INCENTIVE_ZONES: IncentiveZone[] = [
  { id: "tabanan-selatan", name: "Tabanan Selatan", partners: 124, weight: 1.5 },
  { id: "karangasem-barat", name: "Karangasem Barat", partners: 86, weight: 2.0 },
];

export type ZoneStatus = "Jenuh" | "Alternatif";

export interface Destination {
  id: string;
  name: string;
  regency: string;
  status: ZoneStatus;
  occupancy: number;
  predicted: number;
  trend: "up" | "down" | "flat";
}

export const DESTINATIONS: Destination[] = [
  { id: "d1", name: "Pantai Canggu", regency: "Badung", status: "Jenuh", occupancy: 92, predicted: 94, trend: "up" },
  { id: "d2", name: "Pantai Kuta", regency: "Badung", status: "Jenuh", occupancy: 88, predicted: 88, trend: "flat" },
  { id: "d3", name: "Pantai Nyanyi", regency: "Tabanan", status: "Alternatif", occupancy: 23, predicted: 31, trend: "up" },
  { id: "d4", name: "Sidemen", regency: "Karangasem", status: "Alternatif", occupancy: 18, predicted: 20, trend: "up" },
  { id: "d5", name: "Ubud Center", regency: "Gianyar", status: "Jenuh", occupancy: 81, predicted: 85, trend: "up" },
  { id: "d6", name: "Pantai Nusa Dua", regency: "Badung", status: "Alternatif", occupancy: 34, predicted: 33, trend: "flat" },
  { id: "d7", name: "Munduk", regency: "Buleleng", status: "Alternatif", occupancy: 12, predicted: 15, trend: "up" },
];

export const HEAT_MARKERS: ZoneMarker[] = [
  { id: "canggu", label: "Canggu", lat: -8.6478, lng: 115.1385, tone: "danger" },
  { id: "kuta", label: "Kuta", lat: -8.718, lng: 115.1686, tone: "danger" },
  { id: "ubud", label: "Ubud", lat: -8.5069, lng: 115.2625, tone: "warning" },
  { id: "nyanyi", label: "Pantai Nyanyi", lat: -8.616, lng: 115.096, tone: "success" },
  { id: "sidemen", label: "Sidemen", lat: -8.409, lng: 115.463, tone: "success" },
  { id: "nusadua", label: "Nusa Dua", lat: -8.7997, lng: 115.2283, tone: "warning" },
];
