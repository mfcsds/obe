---
inclusion: always
---

# Clean Code & Maintainability Guidelines

Steering ini wajib dipatuhi setiap kali menulis, mengubah, atau meng-generate kode
baru di project ini (komponen, page, service, hook, dll). Tujuannya agar kode mudah
dibaca, dirawat, dan konsisten di seluruh codebase.

## Prinsip Umum

1. **Single Responsibility** — Satu file/komponen fokus pada satu tanggung jawab.
   Jangan campur data mock, logic filter/fetch, dan UI rendering dalam satu
   komponen besar. Pisahkan:
   - Data/mock → `lib/mock-*.ts` atau `lib/services/*.ts`
   - Logic bisnis (filter, kalkulasi, transformasi) → helper function atau service,
     jangan ditulis inline di dalam JSX/handler kalau bisa diekstrak dan diberi nama.
   - UI murni → komponen di `components/`.
2. **DRY (Don't Repeat Yourself)** — Jika sebuah pattern UI (misalnya style header
   tabel, card statistik, dialog) sudah dipakai lebih dari 2 kali, ekstrak jadi
   komponen reusable di `components/ui/` atau folder domain terkait. Jangan copy
   paste block JSX/style yang identik antar file.
3. **Penamaan jelas** — Nama variabel, fungsi, dan komponen harus deskriptif dan
   konsisten dengan bahasa domain yang sudah dipakai project ini (boleh Bahasa
   Indonesia untuk istilah domain seperti `mahasiswa`, `dosen`, `kurikulum`, tapi
   konsisten, jangan campur dengan istilah Inggris untuk hal yang sama).
4. **Hindari magic number/index** — Jangan gunakan angka index mentah untuk
   mengontrol tab/step yang banyak (misal `tabValue === 7`). Gunakan array of
   object `{ key, label, Component }` dan render lewat `.map()`, atau enum/const
   yang diberi nama.
5. **Komponen kecil dan komposabel** — Jika satu file page melebihi ~150-200 baris
   atau punya banyak blok kondisional berulang, pecah menjadi sub-komponen.

## Dokumentasi Kode

- Setiap fungsi/service yang punya logic non-trivial (bukan sekadar getter/setter)
  wajib diberi komentar singkat yang menjelaskan **apa** dan **mengapa**, bukan
  menerjemahkan kode baris per baris.
- Komponen/hook yang dipakai lintas fitur (reusable) diberi JSDoc ringkas di atas
  deklarasinya: tujuan komponen, props penting, contoh penggunaan bila perlu.
- Gunakan TypeScript types/interfaces eksplisit untuk props, return value service,
  dan bentuk data (hindari `any`). Ini juga berfungsi sebagai dokumentasi hidup.
- Untuk keputusan desain yang tidak obvious (workaround, batasan library, dsb),
  tambahkan komentar `// NOTE:` atau `// WHY:` di titik terkait.

## Struktur Next.js App Router yang Harus Diikuti

- Gunakan **Server Component secara default**. Tambahkan `"use client"` hanya pada
  bagian yang benar-benar butuh interaktivitas (state, event handler, browser API).
  Jangan taruh `"use client"` di seluruh page kalau hanya sebagian kecil yang
  interaktif — pecah jadi sub-komponen client di dalam server component.
- Data statis/mock yang di-render di page murni tanpa interaksi sebaiknya di-fetch
  di server (server component / server action), bukan didefinisikan ulang di
  setiap file client component.
- Manfaatkan file konvensi App Router (`loading.tsx`, `error.tsx`, `not-found.tsx`)
  saat menambah route baru yang butuh state loading/error.
- Ikuti pola pemisahan yang sudah ada: `app/` untuk routing & composition,
  `components/` untuk UI reusable, `lib/` untuk data/util/service,
  `hooks/` untuk custom hook, `types/` untuk shared TypeScript types.

## Konsistensi Style & Lint

- Ikuti konfigurasi ESLint yang sudah ada (`eslint.config.mjs`). Jangan menonaktifkan
  rule lint untuk "memudahkan" generate kode.
- Hapus import yang tidak terpakai sebelum menganggap task selesai (cek diagnostics).
- Ikuti konvensi komponen MUI yang sudah dipakai di project (`sx` prop, theme dari
  `lib/theme.ts`) daripada memperkenalkan library styling baru tanpa persetujuan user.

## Checklist Sebelum Menyelesaikan Task Generate/Edit Kode

- [ ] Tidak ada duplikasi logic/JSX yang seharusnya diekstrak.
- [ ] Tidak ada `any`, unused import, atau unused variable (cek via diagnostics).
- [ ] Fungsi/komponen punya nama dan tanggung jawab yang jelas.
- [ ] Logic non-trivial didokumentasikan singkat.
- [ ] Perubahan sudah diverifikasi (build/lint/diagnostics) sebelum dianggap selesai.
