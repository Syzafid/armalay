# Perencanaan Project: AR Melayu (Digitalisasi Artefak Kebudayaan Melayu)

> **Dokumen Perencanaan Sistem WebAR & Gamifikasi Interaktif Artefak Kebudayaan Melayu**  
> *Versi:* 1.0.0  
> *Tanggal:* 31 Agustus 2026  
> *Pengembang:* Tim AR Melayu  

---

## 📋 1. Ringkasan Eksekutif (Executive Summary)

**AR Melayu** adalah aplikasi berbasis **WebAR (Web Augmented Reality)** yang bertujuan untuk melakukan **digitalisasi dan preservasi kebudayaan Melayu** dalam bentuk pengalaman 3D interaktif berbasis web tanpa memerlukan instalasi aplikasi tambahan.

Pengguna cukup membuka browser smartphone/PC, memindai **marker AR custom**, dan artefak kebudayaan Melayu (seperti *senjata tradisional*, *patung/ukiran*, dan *pakaian adat*) akan muncul secara visual di layar.

### Fitur Kunci & Keunikan Layout:
1. **Fokus Utama Tampilan Smartphone Landscape (Layar HP Mendatar):**
   - **Desain Khusus Mode Landscape (16:9 / 20:9):** Tampilan dioptimalkan khusus untuk layar HP dalam posisi *landscape* sehingga area pandang 3D model di sisi kiri dan panel interaksi di sisi kanan seimbang dan luas.
2. **Tampilan Bersih & Minimalis (Clean Screen Concept):**
   - **Informasi Tidak Langsung Memenuhi Layar:** Setelah marker di-scan, layar **TIDAK** langsung dipenuhi teks/paragraf panjang. Hanya **Nama Artefak & Subtitle** (contoh: `🗡️ KERIS TAMING SARI — Senjata Pusaka Melayu`) yang tampil elegan di layar.
   - **Informasi Baru Muncul Saat Tombol Ditekan:** Detail sejarah, fungsi filosofis, dan kuis baru akan muncul sebagai pop-up animasi jika pengguna secara sengaja menekan tombol informasi.
3. **Hamburger Game Menu (☰ Menu Terintegrasi):**
   - **Penyimpanan Tombol Terpusat:** Agar layar HP tidak terasa semak/penuh tombol, seluruh tombol aksi (Detail Sejarah, Kontrol 3D Rotasi/Zoom, Audio Narator, Kuis, dan Tombol Reset Scan) diringkas rapi di dalam **Tombol Hamburger Menu (☰ Menu Game)** di pojok kanan atas.
4. **One-Time Scan & Persistent 3D Lock (Scan Sekali, Tampil Selamanya):**
   - **Mekanisme Kunci AR (Scan Lock):** Marker cukup dipindai **1 kali saja** di awal. Begitu terdeteksi (`markerFound`), objek 3D dikunci permanen di viewport kiri layar.
   - **Tahan Hilang Marker:** Walaupun marker fisik bergerak keluar dari sorotan kamera (`markerLost`), 3D model & UI **TIDAK AKAN HILANG**.
   - **Tombol Close Manual (Reset Scan):** Objek 3D & UI baru akan hilang saat pengguna menekan **Tombol Close (❌ Tutup Artefak / Scan Ulang)** yang ada di dalam Hamburger Menu atau tombol floating minimalis.

---

## 🔍 2. Analisis Project Eksisting (`ar-card`) vs Kebutuhan `armelayu`

Berdasarkan analisis mendalam terhadap basis kode project saat ini (`ar-card`), berikut adalah evaluasi kelebihan yang dapat diadaptasi serta aspek yang perlu ditransformasi untuk project **AR Melayu**:

### A. Komponen `ar-card` yang Dipertahankan & Ditingkatkan:
- **WebAR Stack:** Penggunaan **A-Frame + AR.js + A-Frame Extras** terbukti ringan, cepat dimuat, dan kompatibel cross-platform di browser seluler.
- **Manajemen State Marker:** Logic listener `markerFound` dan `markerLost` beserta *No-Marker Timeout* (layar peringatan jika marker tidak terdeteksi dalam 5 detik) sangat responsif dan aman bagi UX pengguna.
- **Splash Screen & Izin Kamera:** Alur *Splash Screen* sebelum masuk ke scene AR memastikan pengalaman izin kamera seluler berjalan lancar tanpa error autoplay/video permission.

### B. Transformasi & Perbedaan Utama untuk `armelayu`:

| Parameter | Project Lama (`ar-card`) | Project Baru (`armelayu`) |
| :--- | :--- | :--- |
| **Fokus Konten** | Kartu nama personal & Link Media Sosial | Digitalisasi Artefak Kebudayaan Melayu (Multi-Objek) |
| **Mekanisme Scan AR** | Real-time Continuous Tracking (3D hilang saat marker lost) | **One-Time Scan & Persistent Lock:** Scan 1x saja, 3D terkunci permanen hingga tombol Close ditekan |
| **Tata Letak (Layout)** | 3D Spatial (UI & Objek melayang di atas marker 3D) | **Split Layout:** 3D Model di Kiri Layar (Fixed Overlay), Info & Pop-up UI di Kanan Layar |
| **Kontrol Interaksi** | Gaze Cursor (Tatap 1.5 detik) | **Touch UI & Game Buttons** (Sisi Kanan Layar + Hotspot 3D + Tombol Close Manual) |
| **Pengalaman Pengguna** | Profil Informasi Statis | **Gamifikasi Interaktif:** Animasi 3D, Narasi Audio, Mode Inspeksi, Kuis, & Badge Koleksi |
| **Struktur Asset** | 1 Model 3D tunggal (`owl.glb`) | **Katalog Modular GLB** (Senjata, Pakaian, Ukiran/Patung Melayu) |

---

## 🗿 3. Target Artefak Kebudayaan Melayu (Fase 1)

Pada fase pertama pengembangan, objek 3D yang didigitalisasi dikelompokkan ke dalam 3 kategori utama artefak Melayu:

```
                  ┌─────────────────────────────────────────┐
                  │      Artefak Kebudayaan Melayu          │
                  └──────────────────┬──────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
┌────────┴─────────┐        ┌────────┴─────────┐        ┌────────┴─────────┐
│Senjata Tradisional│        │ Pakaian & Tanjak │        │ Patung & Ukiran  │
└────────┬─────────┘        └────────┬─────────┘        └────────┬─────────┘
         │                           │                           │
 ├── Keris Taming Sari       ├── Tanjak Dendam Tak Sudah ├── Ukiran Selembayung
 ├── Pedang Jenawi           ├── Baju Teluk Belanga      ├── Relief Ornamen Melayu
 └── Badik Melayu            └── Songket Tenun Melayu    └── Sirih Junjung Adat
```

1. **Senjata Tradisional Melayu:**
   - *Keris Melayu (contoh: Keris Taming Sari / Keris Lekuk 7):* Simbol kehormatan dan kedaulatan.
   - *Pedang Jenawi / Badik Melayu:* Senjata khas pendekar Melayu.
2. **Pakaian & Mahkota Adat Melayu:**
   - *Tanjak / Tengkolok (Dendam Tak Sudah / Solemo Bunga):* Penutup kepala khas lelaki Melayu.
   - *Baju Teluk Belanga & Songket Melayu:* Busana adat lengkap dengan kain samping woven songket.
3. **Patung, Ukiran, & Ornamen Budaya:**
   - *Ukiran Selembayung Melayu:* Hiasan pucuk rebung / ukiran khas arsitektur rumah Melayu.
   - *Sirih Junjung & Relief Artefak:* Kelengkapan upacara adat Melayu.

---

## 🎨 4. Konsep Layout & Visual Interface (Game Aesthetic Landscape)

### A. Wireframe Layout Smartphone Landscape (Clean & Minimalist View)

#### 1. Tampilan Default Saat Marker Ter-scan (Bersih & Console D-Pad Active):
```
+───────────────────────────────────────────────────────────────────────────+
| 🗡️ KERIS TAMING SARI                     [Status: 🔒 Locked]   [ ⛶ ] [ ☰ ] |
| (Senjata Pusaka Kesultanan Melayu)                              <-- Header|
+───────────────────────────────────────────────────────────────────────────+
|                                                                           |
|                  SISI KIRI: MODEL 3D ARTEFAK MELAYU                       |
|           (Posisi Pas -0.55 -0.05 -1.8 & Rotasi Interactive)              |
|                                                                           |
|                                ▲                                          |
|                               / \   [3D Model GLB]   +──────────────────+ |
|                              /   \  Keris Melayu     |    [▲]           | |
|                             /_____\                  | [◄][↺][►] [🔍+][🔍-]| |
|                                                      |    [▼]           | |
|                                                      +──────────────────+ |
|                                                      D-Pad Console (Kanan)|
+───────────────────────────────────────────────────────────────────────────+
```

#### 2. Tampilan Saat Hamburger Menu (☰) Ditekan (Drawer Meluncur dari Kanan):
```
+───────────────────────────────────────────────────────────────────────────+
| 🗡️ KERIS TAMING SARI                       [ ✖ TUTUP MENU ]              |
+──────────────────────────────────────┬────────────────────────────────────+
|                                      |       PANEL HAMBURGER MENU         |
|         SISI KIRI LAYAR              |  (Meluncur Ringkas dari Kanan)    |
|      (Fixed 3D Model Viewport)       |                                    |
|                                      | +────────────────────────────────+ |
|               ▲                      | | 📜 INFORMASI & SEJARAH ARTEFAK | |
|              / \   [3D Model GLB]    | | (Klik untuk buka pop-up info)  | |
|             /   \  Keris Melayu      | +────────────────────────────────+ |
|            /_____\                   | | 🔍 KONTROL 3D (Rotasi & Zoom)  | |
|                                      | +────────────────────────────────+ |
|                                      | | 🔊 AUDIO VOICE-OVER SEJARAH    | |
|                                      | +────────────────────────────────+ |
|                                      | | 🎮 KUIS & PENCAPAIAN BADGE     | |
|                                      | +────────────────────────────────+ |
|                                      | | ❌ CLOSE & SCAN MARKER LAIN    | |
|                                      | +────────────────────────────────+ |
+──────────────────────────────────────┴────────────────────────────────────+
```

#### 3. Tampilan Pop-up Panel Informasi (Meluncur Ringkas di Sisi Kanan Layar):
```
+───────────────────────────────────────────────────────────────────────────+
| 🗡️ KERIS TAMING SARI                     [Status: 🔒 Locked]   [ ⛶ ] [ ☰ ] |
+──────────────────────────────────────┬────────────────────────────────────+
|                                      |      PANEL INFORMASI SISI KANAN    |
|      SISI KIRI: MODEL 3D             |  (Side Panel Slide-in dari Kanan)  |
| (100% Terlihat & Bebas Di-inspeksi)  |                                    |
|                                      | +────────────────────────────────+ |
|               ▲                      | | 📜 SEJARAH KERIS    [ ✖ CLOSE ]| |
|              / \   [3D Model GLB]    | +────────────────────────────────+ |
|             /   \  Keris Melayu      | | Keris Taming Sari adalah       | |
|            /_____\                   | | senjata pusaka Laksamana       | |
|                                      | | Hang Tuah yang memiliki...     | |
|                                      | +────────────────────────────────+ |
|                                      | | 🎮 JAWAB KUIS UNTUK DENGAR SFX | |
|                                      | +────────────────────────────────+ |
+──────────────────────────────────────┴────────────────────────────────────+
```

### B. Skema Warna Brand (Melayu Royal Game Palette)
- **Royal Gold (Emas Melayu):** `#D4AF37` *(Aksen tombol, border glowing, header)*
- **Emerald Green (Hijau Melayu):** `#004B23` *(Background panel UI, badge sukses)*
- **Deep Maroon (Merah Marun):** `#6B0000` *(Tombol aksi utama & highlight kuis)*
- **Dark Ebony (Hitam Malam):** `#0D0D11` *(Background canvas WebAR & glassmorphism backdrop)*
- **Pearl Cream:** `#F5F2EB` *(Teks informasi & sub-header)*

---

## 🛠️ 5. Spesifikasi Arsitektur Teknis

### A. Tech Stack Framework
1. **Frontend Core:** HTML5, Modern CSS3 (CSS Grid & Flexbox, Backdrop Filter Glassmorphism), JavaScript (ES6+ Vanilla/Modular).
2. **WebAR & 3D Rendering Engine:**
   - **A-Frame v1.4.2+:** Framework WebVR/WebAR berbasis Entity-Component.
   - **AR.js v3.4+:** Marker-based tracking (Custom Pattern Marker `.patt`).
   - **A-Frame Extras (v7.5+):** Animasi model 3D (`animation-mixer`).
3. **Audio Engine:** HTML5 Web Audio API / Howler.js untuk SFX tombol, musik latar budaya Melayu, dan voiceover narasi sejarah.
4. **Data Store:** `data/artifacts.json` sebagai database lokal berformat JSON untuk menyimpan data artefak, kuis, dan teks deskripsi sejarah.

### B. Arsitektur Multi-Marker Dynamic Mapping & One-Time Scan Lock
Sistem dirancang untuk mendukung **banyak marker sekaligus (multi-marker ready)** secara bergantian. Pengguna dapat memindai marker mana saja terlebih dahulu, dan sistem akan memuat data 3D & informasi artefak yang sesuai dari `data/artifacts.json`.

```javascript
// State Control AR Multi-Marker Controller
let isScannedLocked = false;
let currentArtifact = null;

// Registry Listener untuk Banyak Marker (Multi-Marker)
document.querySelectorAll('a-marker').forEach(markerEl => {
  markerEl.addEventListener('markerFound', () => {
    // Jika sistem sedang mengunci artefak aktif, abaikan scan marker lain
    if (isScannedLocked) return;

    const markerId = markerEl.getAttribute('id'); // e.g., 'marker-keris', 'marker-tanjak', 'marker-prototype'
    currentArtifact = artifactDatabase[markerId];

    if (!currentArtifact) return;

    isScannedLocked = true;
    
    // Dynamic Load Model GLB & Data Artefak
    load3DModelToViewport(currentArtifact.modelPath, currentArtifact.scale);
    setArtifactHeader(currentArtifact.title, currentArtifact.subtitle);
    prepareModalContent(currentArtifact.historyText, currentArtifact.quizData);

    updateStatusBadge(`🔒 Terkunci: ${currentArtifact.title}`);
  });

  markerEl.addEventListener('markerLost', () => {
    // 3D & UI TETAP MUNCUL PERMANEN saat dalam status locked
    if (isScannedLocked) return;
  });
});

// Event Tombol Close (Reset State & Siap Scan Marker Lain)
btnCloseArtifact.addEventListener('click', () => {
  hide3DModel();              // Clear/hide model 3D
  closeDrawerMenu();           // Sembunyikan menu & modal pop-up
  isScannedLocked = false;     // Reset state kunci
  currentArtifact = null;
  updateStatusBadge('🔍 Mencari Marker Melayu...');
});
```

### C. Prototype Uji Coba Awal (Testing Phase dengan `owl.glb`)
Untuk tahap uji coba awal sistem WebAR & UI Multi-Marker, kita menggunakan asset 3D yang sudah tersedia di project eksisting (`assets/owl.glb` sebagai *Artefak Burung Hantu Ukiran Melayu* / *Simbolik Melayu*) sebelum model 3D senjata/pakaian asli selesai di-render.

#### Skema Dataset Prototype (`data/artifacts.json`):
```json
{
  "marker-prototype": {
    "id": "marker-prototype",
    "title": "🦉 BURUNG HANTU UKIRAN MELAYU",
    "subtitle": "Artefak Simbolik Kebijaksanaan Kuno Melayu (Prototype Test)",
    "category": "Ornamen & Ukiran",
    "modelPath": "../assets/owl.glb",
    "scale": "0.8 0.8 0.8",
    "historyText": "Burung Hantu Ukiran Melayu merupakan motif hias kuno yang melambangkan keheningan malam, pengawasan tajam, dan kebijaksanaan para tetua adat dalam meramu hukum serta adat istiadat Melayu.",
    "quizData": [
      {
        "question": "Apa makna filosofis utama ukiran Burung Hantu Melayu?",
        "options": ["Kecepatan & Keberanian", "Kebijaksanaan & Keheningan Malam", "Kekayaan & Kejayaan", "Kekuatan Fisik"],
        "correctIndex": 1
      }
    ]
  },
  "marker-keris": {
    "id": "marker-keris",
    "title": "🗡️ KERIS TAMING SARI MELAYU",
    "subtitle": "Senjata Pusaka Kedaulatan Laksamana Melayu",
    "category": "Senjata Tradisional",
    "modelPath": "assets/models/keris_taming_sari.glb",
    "scale": "1 1 1",
    "historyText": "Keris Taming Sari adalah senjata pusaka terkenal dalam tradisi Melayu yang pernah dimiliki oleh Laksamana Hang Tuah. Keris ini melambangkan kedaulatan dan kewibawaan Melayu.",
    "quizData": [
      {
        "question": "Siapakah pahlawan Melayu yang paling terkenal memiliki Keris Taming Sari?",
        "options": ["Hang Jebat", "Hang Tuah", "Hang Kasturi", "Hang Lekir"],
        "correctIndex": 1
      }
    ]
  }
}
```

### C. Strategi Layout "Fixed 3D Model di Kiri Screen"
Untuk memastikan model 3D artefak Melayu tampak **"lengket di sebelah kiri layar"** dan tidak terlepas liar dari tampilan kamera pengguna:
- **Teknik Fixed Screen Camera Anchor:** Setelah `isScannedLocked = true`, posisi objek 3D GLB di-bind langsung ke hierarki `a-camera` (Camera-Relative Coordinate: Left X: -1.2, Y: 0, Z: -2.5) sehingga posisi model 3D stabil di kiri layar meskipun HP digerakkan.
- **Smooth Marker Tracking:** Menggunakan opsi AR.js `smooth="true"` dengan `smoothCount="8"` dan `smoothTolerance="0.01"` untuk meminimalkan *jitter* (getaran) saat pembacaan marker pertama kali.

---

## 🎮 6. Fitur Interaktif & Gamifikasi

1. **Mode Inspeksi 3D (3D Artifact Inspector):**
   - Pengguna dapat memutar objek 360°, melakukan zoom-in/out pada ukiran keris/pakaian, serta mengaktifkan *Exploded View* (jika model 3D mendukung animasi pembongkaran bagian artefak).
2. **Pop-up Informasi Gamified (Right-Panel Cards):**
   - Saat tombol di panel kanan diklik, pop-up bermunculan dengan animasi *slide-in* dari kanan.
   - Menyajikan informasi sejarah, makna filosofis ukiran, serta fungsi sosial artefak dalam adat Melayu.
3. **Voiceover Narator & Audio Suara Adat:**
   - Audio narasi sejarah yang dapat diputar/di-pause dengan indikator gelombang suara animasi.
   - Efek suara alat musik tradisional Melayu (Gambus/Gendang) sebagai musik latar lembut.
4. **Mode Kuis & Sistem Badge Koleksi (Artifact Codex):**
   - Kuis interaktif 3 pertanyaan seputar artefak yang sedang dilihat.
   - Pengguna mendapatkan **XP Point** dan muka **Badge Kebudayaan Melayu** saat berhasil menjawab benar.
   - Fitur *Codex Artefak* untuk melihat daftar artefak Melayu yang sudah berhasil di-scan dan dipelajari.

---

## 📁 7. Arsitektur Folder Project `armelayu`

Berikut adalah rancangan struktur folder untuk project `armelayu`:

```
armelayu/
├── PERENCANAAN_PROJECT_ARMELAYU.md   # Dokumen perencanaan ini
├── README.md                          # Panduan singkat project armelayu
├── index.html                         # Entry point utama aplikasi WebAR
├── css/
│   ├── main.css                       # Design system, layout grid split-screen
│   ├── game-ui.css                    # Styling tombol game, popup modal, animation
│   └── responsive.css                 # Penyesuaian layout mobile portrait & landscape
├── js/
│   ├── app.js                         # Inisialisasi utama & state management
│   ├── ar-controller.js               # Event handling AR.js, marker tracking, 3D positioning
│   ├── ui-manager.js                  # Manager panel kanan, popup info, & modal
│   ├── gamification.js                # Logic kuis, XP point, badge collection, & audio SFX
│   └── artifact-loader.js             # Fetching data dari artifacts.json & load 3D GLB
├── data/
│   └── artifacts.json                 # Dataset artefak (info sejarah, audio path, kuis)
└── assets/
    ├── markers/
    │   ├── marker-melayu.patt         # File pattern marker AR.js
    │   └── marker-melayu.png          # Gambar cetak marker Melayu
    ├── models/
    │   ├── keris_taming_sari.glb      # Asset 3D Keris Melayu
    │   ├── tanjak_melayu.glb          # Asset 3D Tanjak/Pakaian Adat
    │   └── selembayung_melayu.glb     # Asset 3D Ukiran/Patung Melayu
    ├── audio/
    │   ├── sfx-click.mp3              # Suara tombol game
    │   ├── sfx-success.mp3            # Suara kuis berhasil
    │   ├── bgm-melayu.mp3             # Musik latar Melayu
    │   └── narration-keris.mp3        # Voiceover sejarah keris
    └── images/
        ├── ui-bg.jpg                  # Background motif ukiran Melayu
        ├── badges/                    # Icon badge koleksi
        └── icons/                     # Icon UI tombol interaktif
```

---

## 📅 8. Roadmap Pengembangan (Implementation Roadmap)

```
Fase 1: Setup & Data Pipeline ──► Fase 2: Layout & AR Engine ──► Fase 3: UI & Gamifikasi ──► Fase 4: Optimization
  (Aset 3D & Marker Melayu)       (Split-Screen 3D & Fixed Cam)    (Kuis, Pop-up & Audio SFX)    (Testing & Deployment)
```

### **Fase 1: Preparasi Asset & Marker (Minggu 1)**
- Optimasi model 3D GLB (Compression DRACO max 5MB per model).
- Pembuatan dan pengujian marker custom khas Melayu (`marker-melayu.patt`).
- Penyusunan `data/artifacts.json` untuk konten narasi dan kuis.

### **Fase 2: Core AR & Split-Screen Viewport (Minggu 2)**
- Implementasi HTML/CSS layout split screen (Canvas AR di Kiri, UI Container di Kanan).
- Sinkronisasi posisi 3D model agar sticky/fixed di area viewport sebelah kiri.
- Pengujian event `markerFound` & `markerLost` dengan feedback visual.

### **Fase 3: Pengembangan UI Gamifikasi & Interaksi (Minggu 3)**
- Pembuatan komponen UI bergaya game Melayu (Gold/Emerald Glassmorphism).
- Integrasi tombol interaktif (Detail Sejarah, Animasi 3D Model, Audio Voiceover).
- Pengembangan sistem Kuis Interaktif & Pengumpulan Badge.

### **Fase 4: Pengujian & Optimasi Performa (Minggu 4)**
- Uji coba di berbagai jenis perangkat smartphone (Android Chrome, iOS Safari).
- Optimasi FPS rendering 3D dan efisiensi memori audio.
- Rilis versi Beta WebAR Digitalisasi Artefak Kebudayaan Melayu.

---

## 📌 9. Kesimpulan & Langkah Selanjutnya

Dokumen ini menjadi acuan utama pengembangan project **AR Melayu**. Berbeda dari project dasar `ar-card`, **AR Melayu** menyajikan pendekatan edukasi budaya yang modern, dinamis, dan menyenangkan dengan menggabungkan **teknologi WebAR terkini** dan **elemen gamifikasi interaktif**.

**Rekomendasi Langkah Berikutnya:**
1. Menyiapkan asset awal model 3D GLB artefak Melayu dan marker pattern Melayu di folder `armelayu/assets/`.
2. Membuat pondasi file `armelayu/index.html` dan `armelayu/css/main.css` sesuai spesifikasi split-screen.
3. Melakukan eksekusi modul JavaScript secara bertahap sesuai roadmap.
