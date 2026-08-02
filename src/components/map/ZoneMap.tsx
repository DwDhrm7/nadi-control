"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";

import { useTheme } from "@/lib/theme-provider";

export interface ZoneMarker {
  id: string;
  label: string;
  lat: number;
  lng: number;
  tone: "success" | "warning" | "danger";
  detail?: string;
  pulse?: boolean;
}

const TONE_COLOR: Record<ZoneMarker["tone"], string> = {
  success: "#059669",
  warning: "#d97706",
  danger: "#dc2626",
};

function buildIcon(marker: ZoneMarker) {
  const color = TONE_COLOR[marker.tone];
  return L.divIcon({
    className: "nadi-zone-marker",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%, -100%);">
        <span style="background:${color};color:#fff;font-size:11px;font-weight:700;padding:3px 9px;border-radius:9999px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,.25);">
          ${marker.label}
        </span>
        <span style="width:10px;height:10px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 4px ${color}33;margin-top:4px;${
      marker.pulse ? "animation:nadiPulse 1.6s ease-out infinite;" : ""
    }"></span>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function ZoneMap({
  center,
  zoom = 11,
  markers,
  heat,
  className,
}: {
  center: [number, number];
  zoom?: number;
  markers: ZoneMarker[];
  heat?: boolean;
  className?: string;
}) {
  const { theme } = useTheme();
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className={`relative isolate z-0 ${className ?? ""}`}>
      <style>{`
        @keyframes nadiPulse {
          0% { box-shadow: 0 0 0 0 rgba(220,38,38,.5); }
          100% { box-shadow: 0 0 0 14px rgba(220,38,38,0); }
        }
        .leaflet-container { background: var(--color-bg); }
      `}</style>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url={tileUrl}
        />
        {heat &&
          markers.map((m) => (
            <CircleMarker
              key={`heat-${m.id}`}
              center={[m.lat, m.lng]}
              radius={26}
              pathOptions={{
                color: "transparent",
                fillColor: TONE_COLOR[m.tone],
                fillOpacity: 0.22,
              }}
            />
          ))}
        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={buildIcon(m)}>
            {m.detail && (
              <Popup>
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-slate-500">{m.detail}</div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
