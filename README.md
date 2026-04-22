# Ngalam Hidden Spot - Web MVP

Starter website untuk Daily Project 7 berdasarkan rancangan kebutuhan pada Daily Project 6.

## Fitur yang Sudah Dibuat

- Login/Register simulasi dengan role: General User, Student, Merchant, Admin.
- Explore hidden spots dengan kartu detail, galeri gambar, dan filter WFC + Budget.
- Maps interaktif OpenStreetMap dengan marker setiap spot yang disetujui.
- Submit spot baru (student/merchant/admin) dengan koordinat dan gambar.
- Verifikasi identitas (KTM/KTP/SIM/Kartu Pelajar) dengan status request.
- Post review terverifikasi (hanya user verified atau admin).
- Report informasi usang dengan status open/resolved.
- Merchant update detail spot (menu, fasilitas, jam operasional).
- Admin panel moderasi: approve/reject spot, approve/reject verifikasi, resolve report, hapus review.

## Stack

- React
- Vite
- CSS custom (tanpa framework UI)

## Cara Menjalankan Lokal

```bash
npm.cmd install
npm.cmd run dev
```

## Build Production

```bash
npm.cmd run build
npm.cmd run preview
```

## Akun Demo Cepat

- Admin: nama `Admin NHS`, role `admin`
- Student verified: nama `Marsel`, role `student`
- Merchant: nama `Merchant Mie Gacoan`, role `merchant`

Catatan: Login menggunakan nama + role di form login. Jika nama baru belum ada, sistem otomatis membuat akun.

## Tahap Selanjutnya

- Integrasi backend nyata (Supabase/Firebase) agar data persisten.
- Upload file gambar/dokumen ke cloud storage.
- Tambah test otomatis dan tabel hasil pengujian kualitas di README.
