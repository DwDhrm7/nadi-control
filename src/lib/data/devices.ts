export type DeviceType = "Plang Digital (VMS)" | "Lampu Adaptif";
export type DeviceStatus = "Online" | "Offline";

export interface Device {
  id: string;
  location: string;
  type: DeviceType;
  status: DeviceStatus;
  activeMessage: string;
  tlsMode?: "Normal" | "Mode Hijau Ekstra" | "Mode Malam";
}

const LOCATIONS = [
  "Jl. Asia Afrika",
  "Jl. Braga Simpang",
  "Perempatan Pasteur",
  "Tol Pasir Koja KM 4",
  "Gedung Sate Sel.",
  "Simpang Dago",
  "Jl. Soekarno-Hatta",
  "Buah Batu",
  "Jl. Ir. H. Juanda",
  "Cibiru Junction",
  "Jl. Ahmad Yani",
  "Kiaracondong",
];

const seedDevices: Device[] = [
  { id: "VMS-001", location: "Jl. Asia Afrika", type: "Plang Digital (VMS)", status: "Online", activeMessage: "AWAS MACET" },
  { id: "VMS-002", location: "Jl. Braga Simpang", type: "Plang Digital (VMS)", status: "Online", activeMessage: "-" },
  { id: "TLS-042", location: "Perempatan Pasteur", type: "Lampu Adaptif", status: "Online", activeMessage: "Mode Hijau Ekstra", tlsMode: "Mode Hijau Ekstra" },
  { id: "VMS-015", location: "Tol Pasir Koja KM 4", type: "Plang Digital (VMS)", status: "Offline", activeMessage: "Koneksi Terputus" },
  { id: "TLS-088", location: "Gedung Sate Sel.", type: "Lampu Adaptif", status: "Online", activeMessage: "Normal", tlsMode: "Normal" },
];

function generateDevices(total: number): Device[] {
  const list = [...seedDevices];
  let vms = 16;
  let tls = 89;
  for (let i = list.length; i < total; i++) {
    const isVms = i % 2 === 0;
    const location = LOCATIONS[i % LOCATIONS.length];
    const offline = i % 21 === 0;
    if (isVms) {
      list.push({
        id: `VMS-${String(vms++).padStart(3, "0")}`,
        location,
        type: "Plang Digital (VMS)",
        status: offline ? "Offline" : "Online",
        activeMessage: offline ? "Koneksi Terputus" : "-",
      });
    } else {
      list.push({
        id: `TLS-${String(tls++).padStart(3, "0")}`,
        location,
        type: "Lampu Adaptif",
        status: offline ? "Offline" : "Online",
        activeMessage: offline ? "Koneksi Terputus" : "Normal",
        tlsMode: "Normal",
      });
    }
  }
  return list;
}

export const DEVICES: Device[] = generateDevices(124);

export const MESSAGE_PRIORITIES = [
  { id: "darurat", label: "Darurat", warn: true },
  { id: "keselamatan", label: "Keselamatan", warn: false },
  { id: "penutupan", label: "Penutupan jalan", warn: false },
  { id: "kemacetan", label: "Kemacetan", warn: false },
  { id: "pariwisata", label: "Informasi pariwisata", warn: false },
] as const;

export const TLS_MODES: Device["tlsMode"][] = ["Normal", "Mode Hijau Ekstra", "Mode Malam"];
