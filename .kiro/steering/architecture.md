---
inclusion: always
---

# Arsitektur & Pola Desain (Next.js App Router)

Steering ini menetapkan struktur berlapis yang wajib diikuti saat menambah
fitur baru, agar kode mudah dirawat, diuji, dan diganti backend-nya tanpa
merombak UI. Pola ini adalah adaptasi MVVM ke idiom Next.js App Router
(Server Components + Server Actions), bukan MVC klasik.

## Pemetaan MVVM ke Next.js

| Lapisan MVVM | Di project ini | Lokasi |
|---|---|---|
| **Model** | Tipe domain + skema validasi + akses data (repository) | `types/`, `lib/schemas/`, `lib/repositories/` |
| **ViewModel** | Server Actions (mutasi) & fungsi query untuk halaman; state interaktif lokal | `lib/actions/`, `hooks/` |
| **View** | Server/Client Component yang hanya merender | `app/**/page.tsx`, `components/` |

Aturan arah ketergantungan (satu arah, tidak boleh dibalik):

```
View  →  ViewModel  →  Model (repository)  →  Appwrite SDK
```

- View TIDAK boleh mengimpor Appwrite SDK atau memanggil repository langsung.
- Repository TIDAK boleh mengimpor komponen React atau `next/navigation`.
- Hanya lapisan ViewModel (server actions) yang boleh memanggil repository
  DAN melakukan pengecekan otorisasi.

## Lapisan Model

### Tipe domain (`types/`)
Satu file per domain (`types/kurikulum.ts`, `types/dosen.ts`, dst). Berisi
`interface`/`type` yang dipakai lintas lapisan. Jangan mendefinisikan ulang
bentuk data yang sama di komponen.

### Skema validasi (`lib/schemas/`)
Gunakan **Zod** (sudah ada di dependency) untuk setiap input yang berasal
dari user. Skema ini adalah satu-satunya sumber kebenaran validasi dan
WAJIB dijalankan di server, bukan hanya di client (OWASP A03/A08 — jangan
percaya data dari client). Client boleh memakai skema yang sama untuk
feedback cepat, tapi itu bonus UX, bukan pengganti validasi server.

### Repository (`lib/repositories/`)
Satu file per tabel/koleksi. Tanggung jawabnya hanya CRUD + mapping antara
bentuk data Appwrite (`$id`, `$createdAt`, dst) dan tipe domain aplikasi.

- Nama fungsi deskriptif: `listKurikulum()`, `getKurikulumById()`,
  `createKurikulum()`, `updateKurikulum()`, `deleteKurikulum()`.
- Selalu memetakan row Appwrite ke tipe domain lewat fungsi `mapRowTo*()`,
  jangan membocorkan bentuk mentah SDK ke lapisan atas.
- Tidak ada logika otorisasi di sini (itu tugas ViewModel), tapi juga
  tidak boleh dipanggil langsung dari View.

## Lapisan ViewModel

### Server Actions (`lib/actions/`)
Setiap mutasi (create/update/delete) diekspos sebagai Server Action dengan
urutan wajib berikut:

1. **Autentikasi** — `getLoggedInUser()`, tolak jika `null`.
2. **Otorisasi** — cek role terhadap aksi yang diminta. Jangan mengandalkan
   UI yang menyembunyikan tombol (OWASP A01).
3. **Validasi** — parse input dengan skema Zod.
4. **Eksekusi** — panggil repository.
5. **Revalidasi** — `revalidatePath()` agar UI ikut ter-update.
6. **Kembalikan hasil** berbentuk `{ error: string | null }` (atau dengan
   `data`), jangan melempar error mentah ke client.

Server Action mengembalikan pesan error yang aman dibaca user; detail
teknis cukup di `console.error` sisi server, jangan dikirim ke browser.

### State interaktif
State UI murni (dialog terbuka, tab aktif, teks pencarian) tetap di client
component memakai `useState`, atau custom hook di `hooks/` bila logikanya
dipakai ulang di beberapa tempat.

## Lapisan View

- Halaman (`page.tsx`) default **Server Component**: fetch data lewat
  fungsi query, lalu teruskan sebagai props ke komponen presentasi.
- Bagian interaktif (form, dialog, tombol aksi) dipecah menjadi Client
  Component terpisah yang menerima data lewat props dan memanggil Server
  Action. Jangan menaruh `"use client"` di seluruh halaman hanya karena ada
  satu tombol.
- Komponen presentasi tidak menyimpan sumber kebenaran data; mereka
  menerima props dan melaporkan intent ke atas.

## Desain Keamanan per Fitur

Setiap fitur baru yang menyentuh data wajib mendefinisikan hal ini secara
eksplisit (boleh sebagai komentar di file action-nya):

1. **Siapa yang boleh membaca** data ini? (role apa saja)
2. **Siapa yang boleh mengubah/menghapus**? Biasanya lebih ketat daripada
   membaca — mis. semua role boleh melihat kurikulum, hanya `kaprodi` yang
   boleh mengubah.
3. **Apakah ada data pribadi (PII)** yang tidak boleh ikut terkirim ke
   client? Jika ya, filter di server sebelum dikirim.
4. **Aksi destruktif** (hapus) wajib punya konfirmasi di UI dan pengecekan
   role di server.

Tambahkan juga route baru ke `lib/access-control.ts` agar penegakan akses
per-path tetap terpusat di satu tempat.

## Struktur Folder Referensi

```
app/                      # Routing & komposisi (View)
  (root)/<fitur>/page.tsx
components/
  <domain>/               # Komponen spesifik domain
  common/                 # Komponen generik lintas domain
lib/
  actions/                # Server Actions (ViewModel)
  repositories/           # Akses data (Model)
  schemas/                # Skema validasi Zod (Model)
  appwrite/               # Client & konfigurasi Appwrite
  access-control.ts       # Aturan otorisasi per-route
types/                    # Tipe domain
hooks/                    # Custom hooks (ViewModel sisi client)
```

## Checklist Sebelum Menyelesaikan Fitur Baru

- [ ] Tipe domain didefinisikan di `types/`, tidak duplikat di komponen.
- [ ] Input user divalidasi dengan skema Zod di server.
- [ ] Akses data lewat repository, bukan SDK langsung di komponen.
- [ ] Server Action melakukan cek auth + role sebelum mutasi.
- [ ] `revalidatePath()` dipanggil setelah mutasi berhasil.
- [ ] Halaman tetap Server Component; hanya bagian interaktif jadi client.
- [ ] Route baru terdaftar di `lib/access-control.ts` bila perlu batasan role.
- [ ] Build & lint lolos.
