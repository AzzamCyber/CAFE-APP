# Code By Azzam Codex

# ☕ Cafe App — Modern Cafe Management System

![Cafe App Screenshot](./public/example.png)

**Cafe App** adalah sistem manajemen kafe modern berbasis web yang dibangun dengan **Next.js 16** dan **Prisma ORM**. Aplikasi ini menyediakan solusi lengkap mulai dari pemesanan mandiri via kiosk, antrian dapur (*kitchen display*), hingga panel administrasi yang powerful — semuanya dalam satu platform.

---

## 🚀 Fitur Utama

### 🛒 Kiosk & Pemesanan
- **Self-Order Kiosk** — Pelanggan dapat memesan langsung dari layar kiosk tanpa kasir.
- **Keranjang Belanja (Cart)** — Manajemen item pesanan secara real-time dengan state management **Zustand**.
- **Pilihan Tipe Order** — Mendukung **Dine In** (makan di tempat) dan **Takeaway** (bawa pulang).
- **Metode Pembayaran** — Mendukung **CASH** dan **QRIS**.
- **Catatan Pesanan** — Pelanggan dapat menambahkan catatan khusus per item (contoh: "Jangan pedas", "Es dikit").

### 🍳 Kitchen Display System
- **Antrian Dapur Real-time** — Halaman `/admin/kitchen` menampilkan antrian pesanan yang masuk secara live.
- **Update Status Pesanan** — Dapur dapat mengubah status pesanan: `PENDING → PROCESSING → COMPLETED`.
- **Tampilan Queue** — Halaman `/queue` menampilkan nomor antrian yang siap diambil pelanggan.

### 📊 Admin Dashboard
- **Statistik Penjualan** — Ringkasan total pendapatan, jumlah transaksi, dan produk terlaris.
- **Grafik & Analitik** — Visualisasi data penjualan menggunakan **Recharts**.
- **Manajemen Produk & Menu** — CRUD (Tambah, Edit, Hapus) produk dengan dukungan upload gambar.
- **Manajemen Kategori** — Kelompokkan menu ke dalam kategori (Makanan, Minuman, Snack, dll.).
- **Riwayat Transaksi** — Lihat semua history pesanan lengkap dengan filter dan detail.
- **Export Data** — Export laporan transaksi ke format **Excel (XLSX)**.

### ⚙️ Pengaturan Kafe (Dinamis)
- **Konfigurasi Nama & Deskripsi Kafe** — Ubah nama dan tagline kafe dari panel admin.
- **Upload Logo** — Ganti logo kafe langsung dari halaman settings.
- **Tema Warna** — Kustomisasi warna utama dan warna aksen aplikasi.
- **Info Kontak** — Simpan alamat dan nomor telepon kafe.

### 🔐 Autentikasi & Keamanan
- **Multi-Role Authentication** — Sistem login dengan role: `ADMIN`, `CASHIER`, dan `KITCHEN`.
- **Route Protection** — Middleware Next.js melindungi semua halaman `/admin` dari akses tidak sah.
- **Password Hashing** — Password dienkripsi menggunakan **bcrypt** sebelum disimpan.
- **Session Management** — Sesi login berbasis cookie yang aman.

### 📱 Progressive Web App (PWA)
- **Installable** — Dapat diinstal di perangkat sebagai aplikasi native.
- **Offline-Ready** — Manifest lengkap dengan ikon berbagai ukuran.
- **Mobile-Friendly** — Desain responsif untuk semua ukuran layar.

---

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| **Framework** | Next.js 16 (App Router) & React 19 |
| **Bahasa** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Database** | PostgreSQL (Production) / SQLite (Development) |
| **ORM** | Prisma v5 |
| **Autentikasi** | Next-Auth v4 + bcrypt |
| **State Management** | Zustand |
| **Animasi** | Framer Motion |
| **Chart** | Recharts |
| **Validasi** | Zod |
| **Icon** | Lucide React |
| **Notifikasi** | React Hot Toast |
| **Export** | XLSX |
| **Tanggal** | date-fns |

---

## 💻 Panduan Instalasi Lengkap

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal:
- **Node.js** versi `18` atau lebih baru → [Download Node.js](https://nodejs.org/)
- **npm** (sudah termasuk bersama Node.js)
- **Git** → [Download Git](https://git-scm.com/)

---

### 1. Kloning Repositori

```bash
git clone https://github.com/AzzamCyber/cafe-app.git
cd cafe-app
```

---

### 2. Instalasi Dependensi

```bash
npm install
```

---

### 3. Konfigurasi Environment Variables

Buat file `.env` di root folder proyek:

```bash
# Salin dari contoh (jika tersedia)
copy .env.example .env
```

Isi variabel berikut di file `.env`:

```env
# === DATABASE ===
# Untuk Development (SQLite — lokal, tidak perlu instalasi tambahan)
DATABASE_URL="file:./prisma/dev.db"

# Untuk Production (PostgreSQL — ganti provider di schema.prisma ke "postgresql")
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# === NEXTAUTH ===
NEXTAUTH_SECRET="isi-dengan-string-acak-yang-panjang-dan-aman"
NEXTAUTH_URL="http://localhost:3000"
```

> **💡 Tip:** Untuk generate `NEXTAUTH_SECRET`, jalankan perintah ini di terminal:
> ```bash
> openssl rand -base64 32
> ```

---

### 4. Persiapan Database

#### Untuk Development (SQLite)

Pastikan `schema.prisma` menggunakan provider `sqlite`:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Kemudian generate Prisma Client dan buat tabel:
```bash
npx prisma generate
npx prisma db push
```

#### Untuk Production (PostgreSQL)

Ubah provider di `prisma/schema.prisma` ke `postgresql`, lalu jalankan migrasi:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### 5. Isi Data Awal (Seed)

Jalankan seeder untuk mengisi data awal (kategori, produk contoh, dan akun admin):

```bash
npx prisma db seed
```

Akun default yang dibuat seeder:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@cafe.com` | `admin123` |

---

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

| Halaman | URL |
|---|---|
| Kiosk / Beranda | `http://localhost:3000` |
| Admin Login | `http://localhost:3000/admin/login` |
| Admin Dashboard | `http://localhost:3000/admin/dashboard` |
| Kitchen Display | `http://localhost:3000/admin/kitchen` |
| Antrian Pelanggan | `http://localhost:3000/queue` |

---

### 7. Build untuk Produksi

Script `build` sudah otomatis menjalankan `prisma generate` dan `prisma db push` sebelum build:

```bash
npm run build
npm run start
```

---

## 📁 Struktur Folder

```
cafe-app/
├── prisma/
│   ├── schema.prisma       # Definisi model database
│   └── seed.ts             # Data awal (kategori, produk, user)
├── public/                 # Aset statis & upload gambar
├── src/
│   ├── app/
│   │   ├── admin/          # Panel admin (protected route)
│   │   │   ├── dashboard/  # Statistik & grafik penjualan
│   │   │   ├── products/   # CRUD produk & kategori
│   │   │   ├── history/    # Riwayat transaksi & export
│   │   │   ├── kitchen/    # Kitchen display system
│   │   │   ├── settings/   # Konfigurasi kafe
│   │   │   └── login/      # Halaman login
│   │   ├── kiosk/          # Self-order kiosk
│   │   ├── cart/           # Keranjang & checkout
│   │   ├── order/          # Konfirmasi pesanan
│   │   └── queue/          # Tampilan antrian pelanggan
│   ├── components/         # Komponen UI yang dapat digunakan ulang
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utilitas (prisma client, helpers)
└── middleware.ts           # Route protection untuk /admin
```

---

## 👨‍💻 Kredit Pengembang

Proyek ini dikembangkan dengan sepenuh hati oleh:

**AZZAM CODEX**
*Fullstack Web Developer & UI/UX Enthusiast*

---

*Silakan beri ⭐ (star) pada repository ini jika Anda merasa proyek ini bermanfaat!*
