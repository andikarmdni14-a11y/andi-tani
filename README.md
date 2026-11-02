# Andi Tani (Teman Hijau)

Fase 1 - Tahap 3: Checkout & Alur Transaksi WhatsApp (Next.js 16, Tailwind CSS 4, Supabase, Zustand, React Hook Form + Zod).

## Rute
| Rute | Isi |
|---|---|
| `/` | Beranda: hero, kategori, pilihan favorit |
| `/produk` | Katalog: filter kategori, pencarian, nomor halaman |
| `/produk/[id]` | Detail produk + panduan perawatan |
| `/panduan` | Daftar panduan perawatan |
| `/masuk`, `/akun` | Login/daftar pelanggan, profil & riwayat pesanan |
| `/checkout`, `/checkout/sukses` | Checkout dan kirim pesanan ke WhatsApp |
| `/admin/login` | Masuk admin |
| `/admin/pesanan` | Konfirmasi / batalkan pesanan |
| `/admin/produk`, `/admin/kategori`, `/admin/panduan` | Dashboard CRUD |

## 1. Database Supabase
1. Buat project di supabase.com (region disarankan: Singapore `ap-southeast-1`).
2. SQL Editor, jalankan berurutan:
   - `supabase/migrations/001_fase1_schema.sql` (tabel, keamanan, 8 kategori)
   - `supabase/migrations/002_seed_katalog.sql` (8 panduan + 36 produk, stok default 10)
   - `supabase/migrations/003_harden_function_grants.sql` (pengetatan hak akses fungsi)
3. Unggah foto produk lewat dashboard admin, ikuti `docs/UPLOAD-FOTO.md`.

## 2. Login (Email + Google)

### 2a. URL aplikasi
Supabase > Authentication > URL Configuration:
- Site URL: domain produksi (sementara `http://localhost:3000`)
- Redirect URLs: `http://localhost:3000/**` dan `https://<domain-produksi>/**`

### 2b. Google
1. Google Cloud Console > APIs & Services > Credentials > Create OAuth client ID (Web application).
2. Authorized redirect URI: `https://gzzsxdbazgxofqanzzci.supabase.co/auth/v1/callback`
3. Supabase > Authentication > Sign In / Providers > Google: isi Client ID & Client Secret, aktifkan.

### 2c. Email + password (PENTING sebelum go-live)
Layanan email bawaan Supabase hanya mengirim ke email anggota tim project dan dibatasi
per jam. Pelanggan umum TIDAK akan menerima email konfirmasi sampai custom SMTP
dipasang (misal Resend, Brevo): Authentication > Emails > SMTP Settings.

Setelah SMTP aktif, ubah template "Confirm signup" (Authentication > Emails > Templates)
agar tautan konfirmasi berfungsi di perangkat mana pun:
```html
<h2>Konfirmasi email Andi Tani</h2>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/akun">Aktifkan akun</a></p>
```

## 3. Environment
```bash
cp .env.example .env.local   # isi URL dan publishable key Supabase
```
Variabel yang sama juga diisi di Vercel > Project Settings > Environment Variables.

## 4. Menjalankan
```bash
npm install
npm run dev
```

## 5. Admin pertama
Daftar akun, lalu jalankan query di bagian 8 file SQL untuk menetapkan role admin.

## 6. Catatan upload foto
Foto produk dikompres ke WebP di browser admin. Gunakan Chrome atau Edge versi terbaru di dashboard admin.
