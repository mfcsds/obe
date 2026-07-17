---
inclusion: always
---

# Design System & UI/UX Guidelines

Steering ini wajib dipatuhi setiap kali membuat atau mengubah UI di project ini,
agar tampilan konsisten di seluruh aplikasi (auth, dashboard, dan halaman CRUD).
Sumber kebenaran style adalah `lib/theme.ts` — jangan hardcode warna/radius yang
menyimpang dari sana tanpa alasan kuat.

## Stack UI

- Library utama: **MUI (Material UI) v7**, dengan theme kustom di `lib/theme.ts`.
- Beberapa primitive shadcn/Tailwind ada di `components/ui/` (peninggalan
  scaffold `create-next-app`) — jangan campur dua sistem styling dalam satu
  komponen. Jika sebuah halaman sudah pakai MUI, tetap pakai MUI (`sx` prop),
  jangan tambahkan className Tailwind di situ, dan sebaliknya.
- Ikon: `@mui/icons-material`.

## Palet Warna & Token

Didefinisikan di `lib/theme.ts`, jangan duplikasi hex code di file lain:

- `primary` (amber `#f59e0b`) — aksi utama (tombol submit, highlight, link aktif).
- `secondary` (brown `#78350f`) — aksen, elemen di atas background gelap/brand panel.
- `background.default` (`#fafaf9`) — latar halaman.
- `background.paper` (`#ffffff`) — latar card/surface.
- Radius default: `shape.borderRadius = 12`. Tombol dan input punya radius 10,
  Card punya radius 16 (di-set lewat `components.MuiButton/MuiTextField/MuiCard`
  di theme). Jangan override radius manual di `sx` kecuali ada kebutuhan spesifik.

Saat butuh warna baru (misalnya status chip: sukses/warning/error), gunakan
palette bawaan MUI (`success`, `warning`, `error`, `info`) alih-alih membuat
warna kustom baru.

## Tipografi

- Font: `var(--font-geist-sans)` (sudah diset di theme, jangan override per
  komponen).
- Judul halaman/section: `variant="h4"` atau `h5` dengan `fontWeight={700}`.
- Sub-judul/deskripsi: `variant="body2"` dengan `color="text.secondary"`.
- Hindari inline `fontWeight`/`fontSize` di luar `variant` MUI kecuali untuk
  penekanan kecil (misal `fontWeight={600}` pada link).

## Pola Halaman

### Halaman Auth (sign-in, sign-up)
- Layout split-screen: panel branding (`components/form/AuthBrandPanel.tsx`) di
  kiri (disembunyikan di mobile, `display: { xs: 'none', md: 'flex' }`), form di
  kanan dengan `maxWidth` sekitar 420-440px agar tidak melebar penuh di desktop.
- Form auth TIDAK dibungkus `Card`/`Paper` bervolume besar — cukup heading +
  form fields langsung di atas background halaman, supaya terasa ringan/modern.
- Selalu sediakan link silang antara sign-in dan sign-up di bagian bawah form.
- Password field selalu punya toggle show/hide (`Visibility`/`VisibilityOff`).
- Gunakan bahasa Indonesia untuk label, placeholder, dan pesan (lihat pola yang
  sudah ada di `LoginForm.tsx`/`RegistrationForm.tsx`).

### Halaman List/Data (dosen, mahasiswa, kurikulum, dll)
- Header halaman: judul (`h5` bold, `color="primary.main"`) + deskripsi singkat
  di kiri, tombol aksi utama (`Add` icon, `variant="contained"`) di kanan.
- Tabel data WAJIB memakai komponen bersama `components/common/DataTable.tsx`,
  jangan menulis ulang `Table`/`TableHead` manual dengan style header custom.
  Lihat steering `clean-code.md` bagian DRY.
- Search/filter ditempatkan di atas tabel, dalam `Paper` tipis (`elevation={0}`,
  border `divider`) atau `TextField` langsung tanpa bungkus jika hanya satu field.
- Status ditampilkan sebagai `Chip` dengan warna semantik (`success` = aktif,
  `default`/`warning` = non-aktif atau perhatian, `error` = bermasalah).

### Dialog/Form Input Panjang (AddDosenDialog, dll)
- Gunakan `Stepper` untuk form multi-bagian yang panjang.
- Section di dalam step diberi `Typography variant="h6" color="primary"` +
  `Divider` sebagai pemisah visual sebelum field-field terkait.
- Grid field pakai `Box` dengan `display: grid, gridTemplateColumns: repeat(12, 1fr)`
  dan `gridColumn: { xs: 'span 12', md: 'span 6' }` untuk responsif 1/2 kolom.

## Komponen Reusable yang Harus Dipakai Ulang

- `components/common/DataTable.tsx` — semua tabel data list.
- `components/form/AuthBrandPanel.tsx` — panel branding di halaman auth.
- Jika menemukan pola UI baru yang berpotensi terpakai di 2+ tempat, ekstrak
  jadi komponen di `components/common/` (generik lintas domain) atau
  `components/<domain>/` (spesifik satu domain seperti `dosen`, `mahasiswa`).

## Aksesibilitas Minimum

- Setiap `IconButton` tanpa teks visible wajib punya `aria-label` yang jelas
  (lihat contoh toggle password di `LoginForm.tsx`).
- Kontras teks di atas `AuthBrandPanel` (background gradient gelap) harus tetap
  memakai warna terang (`secondary.contrastText` / putih dengan opacity, bukan
  warna primary/text default yang gelap).
- Form field wajib punya `label` (bukan hanya `placeholder`) dan `autoComplete`
  yang sesuai (`email`, `current-password`, `new-password`, dst).
- Perubahan UI signifikan tetap memerlukan pengujian manual aksesibilitas
  (screen reader, keyboard navigation) sebelum dianggap WCAG compliant —
  steering ini hanya menetapkan baseline, bukan pengganti audit aksesibilitas.

## Checklist Sebelum Menyelesaikan Task UI

- [ ] Warna/radius/font mengacu ke `lib/theme.ts`, tidak ada hex/style baru yang
      menyimpang tanpa alasan.
- [ ] Tidak mencampur MUI `sx` dengan className Tailwind dalam komponen yang sama.
- [ ] Komponen berulang (tabel, panel, card statistik) memakai komponen bersama
      yang sudah ada, atau diekstrak jadi komponen baru jika dipakai 2+ kali.
- [ ] Label, placeholder, dan pesan error menggunakan Bahasa Indonesia yang
      konsisten dengan halaman lain.
- [ ] Responsif diuji minimal di breakpoint `xs` dan `md`.
