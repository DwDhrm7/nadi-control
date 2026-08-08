export type IncidentStatus = "Menunggu" | "Dikonfirmasi" | "Ditolak" | "Perlu Tinjauan";

export interface Incident {
  id: string;
  time: string;
  cameraId: string;
  location: string;
  type: string;
  confidence: number;
  status: IncidentStatus;
  detectedObjects: number;
  speedEstimate: string;
  image: string;
  video?: string;
  timeline: { time: string; active: boolean }[];
  note?: string;
}

export const INCIDENTS: Incident[] = [
  {
    id: "inc-1",
    time: "14:32:10",
    cameraId: "CCTV-BDG-021",
    location: "Jl. Braga Simpang",
    type: "Kerumunan",
    confidence: 92,
    status: "Menunggu",
    detectedObjects: 42,
    speedEstimate: "12 km/jam",
    image: "/images/incidents/inc-1.png",
    video: "/videos/ramai.mp4",
    timeline: [
      { time: "14:29", active: false },
      { time: "14:30", active: false },
      { time: "14:31", active: true },
      { time: "14:32", active: true },
    ],
  },
  {
    id: "inc-2",
    time: "14:30:05",
    cameraId: "CCTV-BDG-045",
    location: "Jl. Asia Afrika",
    type: "Kecelakaan",
    confidence: 88,
    status: "Menunggu",
    detectedObjects: 18,
    speedEstimate: "4 km/jam",
    image: "/images/incidents/inc-2.png",
    video: "/videos/kecelakaan.mp4",
    timeline: [
      { time: "14:27", active: false },
      { time: "14:28", active: false },
      { time: "14:29", active: true },
      { time: "14:30", active: true },
    ],
  },
  {
    id: "inc-3",
    time: "14:28:42",
    cameraId: "CCTV-BDG-012",
    location: "Perempatan Pasteur",
    type: "Macet Panjang",
    confidence: 75,
    status: "Menunggu",
    detectedObjects: 65,
    speedEstimate: "6 km/jam",
    image: "/images/incidents/inc-3.png",
    video: "/videos/macet.mp4",
    timeline: [
      { time: "14:25", active: false },
      { time: "14:26", active: false },
      { time: "14:27", active: true },
      { time: "14:28", active: true },
    ],
  },
];

export const INCIDENTS_PREDICTED: Incident[] = [
  {
    id: "inc-p1",
    time: "+1j 10m",
    cameraId: "CCTV-BDG-033",
    location: "Tol Pasir Koja KM 4",
    type: "Risiko Antrean",
    confidence: 68,
    status: "Menunggu",
    detectedObjects: 31,
    speedEstimate: "9 km/jam",
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=60",
    video: "/videos/sepi.mp4",
    timeline: [
      { time: "+40m", active: false },
      { time: "+50m", active: false },
      { time: "+1j", active: true },
      { time: "+1j 10m", active: true },
    ],
  },
  {
    id: "inc-p2",
    time: "+2j",
    cameraId: "CCTV-BDG-008",
    location: "Gedung Sate Selatan",
    type: "Potensi Kerumunan",
    confidence: 71,
    status: "Menunggu",
    detectedObjects: 54,
    speedEstimate: "3 km/jam",
    image: "/images/incidents/inc-1.png",
    video: "/videos/sepi.mp4",
    timeline: [
      { time: "+1j 30m", active: false },
      { time: "+1j 40m", active: false },
      { time: "+1j 50m", active: true },
      { time: "+2j", active: true },
    ],
  },
];
