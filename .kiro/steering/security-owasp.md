---
inclusion: always
---

# Keamanan & OWASP Guidelines

Steering ini wajib dipatuhi setiap kali menulis atau mengubah kode di project ini.
Tujuannya mencegah kembalinya isu keamanan yang sudah pernah ditemukan (auth bypass,
broken access control, exposed PII di client, dsb).

## Aturan Keras (Non-Negotiable)

1. **Jangan pernah membuat bypass autentikasi/otorisasi**, termasuk untuk keperluan
   testing atau debugging. Jika perlu akun untuk testing, gunakan akun mock yang sudah
   ada di `lib/mock-users.ts` atau minta user membuat akun baru — jangan mematikan
   `middleware.ts`, session check, atau role check untuk "sementara".
2. **Tidak ada flag seperti `BYPASS_AUTH`, `SKIP_AUTH`, `DEBUG_MODE = true` yang
   melewati proses login/otorisasi** di kode yang akan di-commit. Kalau dibutuhkan
   untuk debugging lokal, gunakan environment variable yang secara eksplisit
   di-gitignore dan tidak pernah menjadi default `true`.
3. **Role-based access control harus ditegakkan di server** (middleware / route
   handler / server action), bukan hanya menyaring menu di client
   (contoh: `MuiSidebar.tsx` hanya untuk UX, bukan security boundary). Setiap route
   yang punya batasan role wajib dicek ulang otorisasinya di layer server.
4. Jangan expose data sensitif (PII: email, NIM, IPK, dsb) lebih dari yang
   diperlukan oleh halaman yang bersangkutan. Pertimbangkan memindahkan fetching
   data ke Server Component / server action agar data tidak seluruhnya ikut ke
   client bundle.

## Checklist OWASP Top 10 (2021/2023) untuk Setiap Perubahan Kode

- **A01 Broken Access Control** — Apakah endpoint/page baru memvalidasi role dan
  ownership sebelum mengembalikan/mengubah data? Jangan andalkan hanya UI hiding.
- **A02 Cryptographic Failures** — Jangan simpan password/secret dalam plaintext.
  Gunakan hashing (bcrypt/argon2) untuk password sungguhan. Jangan commit API key,
  token, atau credential ke source code — gunakan `.env.local` (sudah di-gitignore).
- **A03 Injection** — Validasi & sanitize semua input user (form, query param,
  search field). Untuk export CSV, escape field yang diawali `=`, `+`, `-`, `@`
  untuk mencegah CSV/formula injection. Gunakan parameterized query jika nanti
  ada koneksi database langsung.
- **A04 Insecure Design** — Pikirkan alur abuse case (apa yang terjadi jika role
  salah, input kosong, request diulang cepat/rate-limit, dsb) sebelum implementasi.
- **A05 Security Misconfiguration** — Jangan biarkan flag debug/bypass aktif
  secara default. Tinjau `next.config.ts` untuk security header (CSP,
  X-Frame-Options, Referrer-Policy) saat menyentuh konfigurasi server.
- **A06 Vulnerable Components** — Saat menambah dependency, gunakan versi pin/
  exact version dari sumber terpercaya, cek nama package tidak typosquatting.
- **A07 Identification & Authentication Failures** — Jangan melemahkan validasi
  credential, session expiry, atau redirect logic di `auth.ts` / `middleware.ts`
  tanpa persetujuan eksplisit dari user.
- **A08 Software & Data Integrity Failures** — Jangan percaya data dari client
  tanpa validasi ulang di server (contoh: role, id, harga, dsb yang dikirim dari
  form/body request).
- **A09 Security Logging & Monitoring Failures** — Untuk aksi sensitif (login,
  perubahan role, hapus data), pertimbangkan logging yang tidak membocorkan
  credential/PII di log.
- **A10 SSRF** — Jika ada fitur fetch URL dari input user (misalnya upload dari
  link), validasi dan whitelist domain tujuan.

## Saat Membantu Debugging/Testing Login

Jika user lupa password atau ingin masuk untuk testing:
- Tunjukkan cara reset/lihat kredensial yang sudah sah (mock user, seed data, dsb).
- Jangan modifikasi kode produksi/auth untuk melewati proteksi.
- Jika benar-benar diperlukan environment testing tanpa auth, sarankan solusi yang
  terisolasi (misalnya seed user baru, atau flag khusus di file environment lokal
  yang tidak pernah masuk ke git) dan jelaskan risikonya ke user sebelum membuatnya.
