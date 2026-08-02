# 🏙️ NADI Control Center — City Intelligence & Urban Mobility Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Interactive_Maps-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-green.style=for-the-badge)]()

**NADI Control Center** adalah platform pusat kendali dan pemantauan intelijen kota (*City Intelligence*) generasi baru yang dirancang untuk operator manajemen lalu lintas dan distribusi pariwisata. Aplikasi ini menggabungkan pemantauan real-time, verifikasi insiden berbasis AI kamera CCTV, simulasi evaluasi kebijakan, serta kontrol perangkat plang informasi digital (VMS) dan lampu lalu lintas adaptif.

---

## 🌟 Fitur Utama (Core Features)

### 1. 📡 Pemantauan Langsung (Live Monitoring)
- **Peta Kepadatan Real-time**: Peta interaktif Leaflet yang menampilkan zona lalu lintas sepi, sedang, dan padat secara visual dengan dukungan *Dark Mode* & *Light Mode* otomatis.
- **Aliran Kejadian (Event Stream)**: Log kejadian real-time yang memuat skor keyakinan AI, indikator prediksi 1-3 jam, serta pengalihan otomatis ke riwayat kejadian.
- **Statistik Utama**: Metrik ringkas zona padat aktif, antrean insiden, rekomendasi aktif, dan kepatuhan wisatawan.

### 2. 🛡️ Verifikasi Insiden (Incident Verification)
- **Antrean Verifikasi Kamera CCTV**: Pemantauan visual berbasis simulasi kamera CCTV resolusi tinggi (Kerumunan Braga, Kecelakaan Asia Afrika, Jalan Pasteur Lengang).
- **Deteksi AI & Bounding Box**: Tampilan visual area deteksi AI beserta persentase skor keyakinan (*confidence score*).
- **Manajemen Keputusan Operator**: Tindakan konfirmasi insiden, penolakan insiden false-positive, atau penandaan *Perlu Tinjauan* beserta catatan analisis terintegrasi.

### 3. 🗺️ Distribusi Wisata (Tourism Distribution)
- **Manajemen Zona Jenuh vs Alternatif**: Pemantauan tingkat okupansi destinasi pariwisata dan grafik rekomendasi diberikan vs diikuti.
- **Penyesuaian Bobot Insentif UMKM**: Modalisasi pengatur bobot prioritas destinasi alternatif bagi wisatawan (*slider weight adjustment* 1.0x - 3.0x).
- **Peta Sebaran Kunjungan (Heatmap)**: Indikator visual kepadatan antar-kabupaten.

### 4. 📊 Evaluasi Kebijakan (Policy Evaluation)
- **Grafik Kepadatan Sebelum vs Sesudah**: Grafik garis interaktif Recharts memperlihatkan tren kepadatan sebelum vs sesudah intervensi kebijakan.
- **Simulasi Skenario Interaktif**: Modul pengujian estimasi jumlah wisatawan, jam puncak, dan durasi untuk memprediksi limpahan kapasitas zona utama dan alternatif.
- **Jejak Audit Keputusan (Audit Trail)**: Tabel histori tindakan operator beserta tombol unduh laporan format CSV (`.csv`).

### 5. 🎛️ Kendali Perangkat (Device Control)
- **Papan Informasi Digital (VMS - Variable Message Sign)**: Penyusun pesan plang jalan dengan indikator prioritas (Darurat, Keselamatan, Kemacetan) serta tampilan preview plang LED menyala real-time.
- **Pengendali Lampu Lintas Adaptif (TLS)**: Pengubah mode operasi lampu sinyal lalu lintas (Normal, Mode Hijau Ekstra, Mode Malam).

### 6. ⚙️ Pengaturan & Internasionalisasi (Settings & i18n)
- **Dukungan Multi-Bahasa (ID / EN)**: Pengalihan bahasa instan antara **Bahasa Indonesia** dan **English** di seluruh teks UI, legenda chart, tooltip, serta sumbu periode.
- **Manajemen Tema**: Dukungan mode tampilan Terang (*Light*) dan Gelap (*Dark*) yang tersinkronisasi hingga ke tile peta Leaflet CartoDB.
- **Keamanan & Dukungan**: Pengaturan ambang batas notifikasi push, autentikasi 2FA, ubah kata sandi, dan hotline bantuan IT.

---

## 🎨 Spesifikasi Desain & Estetika (Design System)

Aplikasi dibangun dengan standar antarmuka modern, elegan, dan fungsional:

| Elemen Desain | Spesifikasi & Token Warna |
|---------------|---------------------------|
| **Primary Theme** | Emerald Teal / Indigo Accent (`#0d9488` / `#2563eb`) |
| **Sidebar Navigation** | Deep Navy (`#0f172a` / `#1e293b`) dengan highlight status aktif |
| **Status Tones** | Danger (`#dc2626`), Warning (`#d97706`), Success (`#059669`), Neutral (`#64748b`) |
| **Peta (CartoDB Tiles)**| Light Mode: `light_all` \| Dark Mode: `dark_all` |
| **Tipografi** | Modern Sans-Serif font hierarchy (Inter / System Fonts) |
| **Komponen UI** | Glassmorphic dropdowns, badge indikator status, kartu statistik rounded-xl, animasi pulse micro-interactions |

---

## 📂 Struktur Direktori Proyek

```text
nadi-control/
├── public/                  # Asset publik (Gambar CCTV insiden, SVG icons)
│   └── images/incidents/    # Gambar CCTV hasil generasi (inc-1, inc-2, inc-3)
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── distribusi-wisata/  # Halaman Distribusi Wisata
│   │   ├── evaluasi-kebijakan/ # Halaman Evaluasi Kebijakan
│   │   ├── kendali-perangkat/  # Halaman Kendali Perangkat VMS & Sinyal
│   │   ├── pengaturan/         # Halaman Pengaturan Sistem
│   │   ├── verifikasi-insiden/ # Halaman Verifikasi CCTV Insiden
│   │   ├── globals.css         # Variabel tema CSS & utility classes
│   │   ├── layout.tsx          # Root Layout & Provider Wrapper
│   │   └── page.tsx            # Halaman Utam Pemantauan Langsung
│   ├── components/          # Komponen React Reusable
│   │   ├── charts/          # DensityLineChart & RecommendationBarChart
│   │   ├── layout/          # Sidebar, TopbarShell, UserMenu, NotificationBell
│   │   ├── map/             # ZoneMap (Leaflet integration)
│   │   └── ui/              # Button, Card, Badge, Modal, SearchInput, StatCard
│   ├── lib/                 # Utility & Provider State
│   │   ├── data/            # Mock dataset (monitoring, incidents, tourism, policy)
│   │   ├── i18n/            # Kamus Bahasa (dictionary.ts) & LanguageProvider
│   │   ├── auth-provider.tsx# Context Autentikasi Operator
│   │   ├── theme-provider.tsx# Context Tema (Dark/Light)
│   │   └── toast-provider.tsx# Context Notifikasi Toast
├── tests/
│   └── testing.md           # Laporan Testing Komprehensif (User & Developer Audit)
├── package.json
└── README.md
```

---

## 🚀 Panduan Instalasi & Penggunaan (Getting Started)

### Prasyarat System
- **Node.js**: v18.0.0 atau lebih baru
- **npm** / **yarn** / **pnpm**

### Langkah-Langkah Jalankan Lokal

1. **Clone repositori**:
   ```bash
   git clone https://github.com/DwDhrm7/nadi-control.git
   cd nadi-control
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka peramban di [http://localhost:3000](http://localhost:3000)

4. **Build untuk Produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Laporan Pengujian (Testing Report)

Seluruh pengujian komprehensif dari sudut pandang **User Experience (UI/UX)** dan **Developer Code Quality** dapat dipelajari pada berkas:
📄 [tests/testing.md](file:///Users/idewamadedharmaputrasantika/Projects/JavaScript/Next/nadi-operator/tests/testing.md)

---

## 📄 Lisensi

Dikembangkan di bawah lisensi **MIT License**.
