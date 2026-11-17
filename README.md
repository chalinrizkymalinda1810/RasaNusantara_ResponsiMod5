# Rasa Nusantara — PWA Kuliner & Resep Indonesia

Aplikasi Progressive Web App (PWA) modern berbasis **React 18** dan **Vite** yang dirancang untuk eksplorasi, kurasi, dan manajemen resep masakan tradisional khas Nusantara dari Sabang sampai Merauke.

Aplikasi ini memenuhi seluruh kriteria dan spesifikasi pada **Modul Praktikum Pengembangan Perangkat Bergerak (PPB)**.

---

## 👤 Informasi Praktikan
- **Nama:** Chalin Rizky Malinda
- **NIM:** 21120124120029
- **Kelompok:** 35
- **Mata Kuliah:** Praktikum Pengembangan Perangkat Bergerak (PPB)
- **Program Studi:** Teknik Komputer, Fakultas Teknik, Universitas Diponegoro

---

## 🚀 Fitur Utama & Pemenuhan Syarat

### 1. Minimal 3 Halaman Navigasi (Tersedia 5 Halaman Penuh)
1. **Katalog Resep (Beranda/Catalog):**
   - Eksplorasi resep masakan dengan pencarian instan (nama masakan, asal daerah, bahan).
   - Filter kategori masakan (Makanan Utama, Minuman Tradisional, Cemilan & Jajanan, Dessert).
   - Filter tingkat kesulitan (Mudah, Sedang, Sulit).
   - Pengurutan data (Nama A-Z, Waktu Memasak, Estimasi Biaya, Rating Tertinggi).
   - Kartu masakan interaktif dengan tombol toggle Favorit, Edit, Hapus, dan Detail.
2. **Detail Resep & Ulasan Interaktif (Detail View):**
   - Rincian masakan lengkap (foto, deskripsi, waktu persiapan, waktu memasak, porsi, biaya).
   - **Checklist Bahan Interaktif:** praktikan/pengguna dapat mencentang bahan belanjaan saat memasak.
   - **Panduan Langkah Berurutan:** nomor dan instruksi memasak tahap demi tahap.
   - **Sistem Rating & Ulasan Fungsional:** pengguna dapat memberikan rating bintang (1-5) dan komentar ulasan yang langsung tersimpan secara persisten.
3. **Resep Favorit Saya (Favorites Page):**
   - Menampilkan daftar resep yang ditandai dengan ikon hati.
   - Bekerja persisten menggunakan `localStorage` sehingga tidak hilang saat ditutup atau offline.
4. **Kelola Resep (CRUD: Tambah & Edit Resep):**
   - Formulir dinamis untuk **Create** (membuat resep baru) dan **Update** (mengedit resep).
   - Pemilih preset ilustrasi vektor masakan Nusantara (Rendang, Soto, Sate, Cendol, Nasi Goreng, Gado-Gado) atau unggah foto masakan dari perangkat.
   - Dynamic form input untuk **Daftar Bahan & Takaran** (tambah/hapus baris dinamis).
   - Dynamic form input untuk **Langkah Memasak** (tambah/hapus langkah dinamis).
   - **Auto-Save Draft:** Formulir otomatis menyimpan draft ke `localStorage` setiap 30 detik serta mendeteksi pemulihan draft sebelumnya.
   - **Accessible Confirm Modal:** Dialog konfirmasi penghapusan (Delete) yang aman.
5. **Halaman Profil Pengembang (Profile Page):**
   - Menampilkan identitas praktikan: **Nama: Chalin Rizky Malinda**, **NIM: 21120124120029**, **Kelompok: 35**.
   - Pengunggahan foto profil / avatar kustom dari file lokal dengan pratinjau instan.
   - Widget statistik langsung (Jumlah Resep di Katalog, Jumlah Resep Favorit, Jumlah Draft Autosave).
   - Editor catatan dan bio praktikan tersimpan di `localStorage`.
   - Diagnostik status PWA (Service Worker aktif, status jaringan online/offline).
   - Tombol putar ulang animasi Splash Screen dan reset database katalog ke data awal.
6. **Tentang PWA (About Page):**
   - Dokumentasi konsep arsitektur Progressive Web App (PWA), Service Worker, Web App Manifest, Cache Storage, dan Single Page Application (SPA).

---

## 📱 Fungsionalitas PWA (Installable & Offline-First)

1. **Dapat Diinstal (Installable):**
   - Menggunakan `vite-plugin-pwa` dengan `registerType: 'autoUpdate'`.
   - Web App Manifest standar lengkap dengan ikon 192x192, 512x512, maskable, dan SVG.
   - Komponen `PWABadge.jsx` menangkap event `beforeinstallprompt` dan menampilkan banner ajakan instalasi kustom satu klik.
2. **Bekerja Offline (Offline-First):**
   - Service worker men-generate pre-cache untuk semua bundle JS, CSS, file SVG, font, dan HTML.
   - Runtime caching untuk gambar dan aset statis menggunakan strategi `CacheFirst` dan `StaleWhileRevalidate`.
   - Seluruh data resep, ulasan, draf, dan favorit memiliki data persistence di `localStorage` dengan fallback cerdas sehingga aplikasi tetap berjalan 100% normal tanpa koneksi internet.
   - Indikator visual otomatis muncul saat perangkat kehilangan koneksi internet (`window.addEventListener('offline')`).

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

- **Framework:** React 18
- **Tooling / Bundler:** Vite 5
- **PWA Plugin:** `vite-plugin-pwa` (Workbox)
- **Icons:** `lucide-react`
- **HTTP Client:** `axios` (dilengkapi request/response interceptors)
- **State & Persistence:** React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`) + HTML5 `localStorage` API + Service Worker Cache Storage

---

## 💻 Panduan Menjalankan Secara Lokal

### 1. Masuk ke direktori proyek
```bash
cd "C:\Users\asus vivobook\.gemini\antigravity\scratch\rasa-nusantara-pwa"
```

### 2. Instal dependensi (sudah terinstal)
```bash
npm install
```

### 3. Jalankan server pengembangan (Development)
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

### 4. Build untuk Produksi (Production Build)
```bash
npm run build
```
Hasil build beserta Service Worker (`sw.js`) dan Manifest akan berada di dalam folder `dist/`.

### 5. Pratinjau Build Produksi
```bash
npm run preview
```

---

## ☁️ Panduan Deploy ke Vercel (Sesuai Modul Praktikum)

1. Buat repository baru di GitHub (misal: `PWA_Kelompok35_RasaNusantara`).
2. Jalankan perintah git pada folder proyek:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi aplikasi Rasa Nusantara PWA"
   git branch -M main
   git remote add origin https://github.com/[username]/[repo-name].git
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com/) dan login menggunakan akun GitHub Anda.
4. Klik **"Add New Project"** lalu pilih repository yang baru dibuat.
5. Pada bagian **Framework Preset**, pilih **Vite**.
6. Klik tombol **Deploy**. Aplikasi PWA akan otomatis ter-deploy dan mendapatkan domain HTTPS publik yang siap di-install di smartphone maupun desktop!
