# AR Melayu — Digitalisasi Artefak Kebudayaan Melayu

> **WebAR Application & Gamified Interactive Experience for Malay Cultural Artifacts**  
> Built with **AR.js + A-Frame + HTML5/CSS3/Vanilla JS**

---

## 🌟 Overview

**AR Melayu** adalah platform WebAR interaktif yang menghadirkan **digitalisasi artefak kebudayaan Melayu** (seperti senjata tradisional Keris, pakaian adat Tanjak/Baju Kurung, serta patung dan ukiran khas Melayu) langsung di browser pengguna tanpa unduh aplikasi.

Aplikasi ini menggunakan **Mekanisme & Desain Khusus**:
- **Fokus Smartphone Landscape:** Antarmuka dirancang khusus untuk posisi HP tidur (*landscape*) agar bidang pandang 3D dan UI seimbang.
- **Tampilan Bersih & Minimalis:** Saat marker berhasil ter-scan, **HANYA Nama Artefak** yang tampil di layar. Paragraf sejarah & kuis disembunyikan agar layar tidak berantakan.
- **Hamburger Game Menu (☰ Drawer):** Seluruh tombol aksi (Sejarah, Rotasi 3D, Audio Voiceover, Kuis, & Tombol Close) disimpan rapi di dalam **Hamburger Menu** pojok kanan atas.
- **One-Time Scan & Persistent Lock:** Marker cukup di-scan **1 kali saja**. Objek 3D terkunci permanen di layar walaupun marker fisik hilang/terlepas dari kamera.
- **Tombol Close Manual (Reset Scan):** Objek 3D & UI baru akan hilang jika pengguna menekan **Tombol Close (❌ Tutup Artefak / Scan Ulang)** di dalam menu.

---

## 📁 Struktur Project

Dokumen perencanaan lengkap project ini dapat diakses pada file:
[PERENCANAAN_PROJECT_ARMELAYU.md](file:///d:/kampus/game/ar-card/armelayu/PERENCANAAN_PROJECT_ARMELAYU.md)

```
armelayu/
├── PERENCANAAN_PROJECT_ARMELAYU.md   # Dokumen Perencanaan Project Lengkap
├── README.md                          # Dokumentasi Singkat Project
├── index.html                         # Entry point aplikasi WebAR
├── css/                               # Styling split-screen & game UI
├── js/                                # Core logic, AR controller, UI & gamifikasi
├── data/                              # Dataset JSON artefak & kuis
└── assets/                            # Models 3D (.glb), Markers (.patt), Audio, & Images
```

---

## 🎨 Objek Artefak Utama (Fase 1)
1. **Senjata Tradisional:** Keris Taming Sari Melayu, Badik Melayu, Pedang Jenawi.
2. **Pakaian & Mahkota Adat:** Tanjak Melayu (Dendam Tak Sudah), Baju Teluk Belanga & Songket.
3. **Patung & Ukiran:** Ukiran Selembayung Melayu, Relief Artefak, Sirih Junjung.
