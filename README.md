# 🌲 Ngalam Hidden Spot
> **"Exclusive Local Discovery for Malang Raya"**
> Platform penemuan spot nugas dan kafe "Hidden Gem" terbaik di Malang, dirancang khusus untuk kenyamanan produktivitas mahasiswa.

---

## 📋 Daftar Isi
1. [Tentang Proyek](#-tentang-proyek)
2. [Fitur Utama Berdasarkan Role](#-fitur-utama-berdasarkan-role)
3. [Aspek Kualitas & Pengujian](#-aspek-kualitas--pengujian)
4. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
5. [Panduan Instalasi](#-panduan-instalasi)
6. [Struktur Folder](#-struktur-folder)

---

## 🌟 Tentang Proyek
**Ngalam Hidden Spot** lahir dari kebutuhan mahasiswa Malang akan tempat nugas yang kondusif. Aplikasi ini memfasilitasi pengguna untuk menemukan lokasi dengan kriteria spesifik seperti budget ramah kantong, kecepatan WiFi tinggi, dan ketersediaan colokan listrik. 

Proyek ini mengintegrasikan **Frontend Modern (React)** dengan **Backend-as-a-Service (Supabase)** untuk menjamin keamanan data dan performa yang responsif.

---

## 👥 Fitur Utama Berdasarkan Role

### 👨‍🎓 Student (Pengguna Umum)
- **Explore & Filter**: Mencari spot berdasarkan budget, WiFi, dan colokan.
- **Interactive Maps**: Melihat lokasi presisi spot melalui integrasi peta.
- **Review System**: Memberikan rating dan ulasan jujur untuk membantu mahasiswa lain.
- **Identify Verification**: Unggah KTM untuk mendapatkan akses kontribusi spot.

### 🏪 Merchant (Pemilik Bisnis)
- **Claim Spot**: Mengklaim kepemilikan bisnis yang sudah terdaftar.
- **Real-time Update**: Mengubah menu, jam operasional, dan fasilitas WiFi secara instan.
- **Merchant Dashboard**: Memantau status verifikasi dan ulasan pelanggan.

### ⚡ Admin (Pengelola Sistem)
- **Verification Desk**: Meninjau dokumen KTM Student dan NIB Merchant.
- **Spot Moderation**: Menyetujui atau menolak pendaftaran spot baru.
- **Report Resolution**: Menangani laporan masalah dari pengguna.

---

## 🧪 Aspek Kualitas & Pengujian
*Dokumentasi Pengujian Sesuai Desain Daily Project 6:*

| Aspek Kualitas | Parameter Keberhasilan | Hasil Pengujian | Status |
| :--- | :--- | :--- | :--- |
| **Functional Correctness** | Data NIB & Telepon tersimpan di tabel `profiles`. | Input pendaftaran berhasil dipetakan ke kolom Supabase. | ✅ Passed |
| **Functional Correctness** | Sinkronisasi update data merchant ke halaman Explore. | Setelah klik update, data langsung berubah tanpa refresh browser. | ✅ Passed |
| **Security** | Role-Based Access Control (RBAC). | Student tidak bisa mengakses Admin Page; Merchant hanya bisa akses spot miliknya. | ✅ Passed |
| **Security** | Proteksi API Key via Environment Variables. | API Key dikelola aman melalui Vercel Secrets & `.env`. | ✅ Passed |
| **Usability** | Sistem Notifikasi yang Estetik & Informatif. | Menggunakan Custom Toast (Framer Motion) menggantikan popup kaku. | ✅ Passed |
| **Usability** | Desain UI Responsif & Modern. | Layout Mint/Teal konsisten di desktop maupun mobile. | ✅ Passed |
| **Reliability** | Penanganan Koneksi Database. | Sistem menampilkan loading state & error handling yang jelas saat koneksi gagal. | ✅ Passed |
| **Efficiency** | Kecepatan Pemuatan Data. | Query data dioptimasi menggunakan `select` spesifik dan indexing Supabase. | ✅ Passed |

---

## 🛠️ Teknologi yang Digunakan
- **Frontend Core**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling & Animation**: Vanilla CSS + [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (untuk foto spot & dokumen)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Panduan Instalasi

### 1. Clone Repositori
```bash
git clone https://github.com/MarselPTR/NgalamHiddenSpot.git
cd NgalamHiddenSpot
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` di root directory dan isi dengan kredensial Supabase Anda:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Jalankan Aplikasi
```bash
npm run dev
```

---

## 📁 Struktur Folder
```text
NgalamHiddenSpot/
├── src/
│   ├── components/    # Komponen UI (Navbar, Toast, Panel)
│   ├── pages/         # Halaman utama (Home, Explore, Admin, dll)
│   ├── lib/           # Konfigurasi Supabase Client
│   ├── data/          # Data inisial & mock
│   ├── App.jsx        # Logika aplikasi utama & routing
│   └── App.css        # Sistem desain global
├── public/            # Aset statis (Logo, Ikon)
├── vercel.json        # Konfigurasi routing Vercel
└── README.md          # Dokumentasi proyek
```

---
*Dikembangkan dengan ❤️ untuk Mahasiswa Malang Raya oleh MarselPTR.*
