import { z } from "zod";
import { JENIS_MATA_KULIAH, KATEGORI_CAPAIAN, TAHAPAN_PENILAIAN } from "@/types/kurikulum-detail";

/** Kode capaian, mis. "PL01" atau "CPL01". Huruf besar + angka saja. */
const kodeSchema = z
  .string()
  .trim()
  .min(2, "Kode minimal 2 karakter")
  .max(32, "Kode maksimal 32 karakter")
  .regex(/^[A-Za-z0-9.\-]+$/, "Kode hanya boleh huruf, angka, titik, atau tanda hubung");

/**
 * Skema Profil Lulusan. Dijalankan di server sebelum data disimpan
 * (OWASP A03/A08 — input dari client tidak dipercaya).
 */
export const profilLulusanSchema = z.object({
  kode: kodeSchema,
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi profil lulusan minimal 10 karakter")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
  profesi: z
    .string()
    .trim()
    .max(4000, "Daftar profesi maksimal 4000 karakter")
    .optional()
    .transform((value) => (value ? value : null)),
});

/** Skema CPL Prodi. */
export const cplSchema = z.object({
  kode: kodeSchema,
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi CPL minimal 10 karakter")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
  kategori: z.enum(KATEGORI_CAPAIAN),
});

/** Skema CPMK. `cplId` (induk) tidak divalidasi di sini — ditentukan lewat konteks baris CPL yang dipilih di UI, dan kepemilikannya diverifikasi terpisah di server action (anti-IDOR). */
export const cpmkSchema = z.object({
  kode: kodeSchema,
  deskripsi: z
    .string()
    .trim()
    .min(10, "Deskripsi CPMK minimal 10 karakter")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
});

/** Skema Teknik Penilaian CPMK. */
export const teknikPenilaianSchema = z.object({
  kode: kodeSchema,
  nama: z
    .string()
    .trim()
    .min(3, "Nama teknik penilaian minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
});

/** Skema Instrumen Penilaian (mis. Rubrik, Soal Tes, Dokumen Proyek Akhir). */
export const instrumenPenilaianSchema = z.object({
  kode: kodeSchema,
  nama: z
    .string()
    .trim()
    .min(3, "Nama instrumen penilaian minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
});

/** Skema Kriteria Penilaian (mis. Sesuai Rubrik, Ketepatan Menjawab Soal). */
export const kriteriaPenilaianSchema = z.object({
  kode: kodeSchema,
  nama: z
    .string()
    .trim()
    .min(3, "Nama kriteria penilaian minimal 3 karakter")
    .max(150, "Nama maksimal 150 karakter"),
});

/**
 * Skema Rencana Penilaian. Field relasi (`mataKuliahId`, `cpmkId`,
 * `teknikPenilaianId`, `instrumenPenilaianId`, `kriteriaPenilaianId`) hanya
 * dicek tidak kosong di sini; kepemilikannya terhadap kurikulum yang sama
 * diverifikasi terpisah di server action (anti-IDOR), karena Zod tidak
 * mengetahui konteks kurikulum mana yang sedang diproses.
 */
export const rencanaPenilaianSchema = z.object({
  mataKuliahId: z.string().trim().min(1, "Mata kuliah wajib dipilih"),
  cpmkId: z.string().trim().min(1, "CPMK wajib dipilih"),
  tahapan: z.enum(TAHAPAN_PENILAIAN),
  teknikPenilaianId: z.string().trim().min(1, "Teknik penilaian wajib dipilih"),
  instrumenPenilaianId: z.string().trim().min(1, "Instrumen penilaian wajib dipilih"),
  kriteriaPenilaianId: z.string().trim().min(1, "Kriteria penilaian wajib dipilih"),
  bobot: z.coerce
    .number()
    .min(0, "Bobot minimal 0")
    .max(100, "Bobot maksimal 100"),
});

/** Skema Bahan Kajian. */
export const bahanKajianSchema = z.object({
  kode: kodeSchema,
  nama: z
    .string()
    .trim()
    .min(3, "Nama bahan kajian minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  deskripsi: z
    .string()
    .trim()
    .max(2000, "Deskripsi maksimal 2000 karakter")
    .optional()
    .transform((value) => (value ? value : null)),
});

/** Awalan/akhiran kode: huruf, angka, titik, atau tanda hubung, boleh kosong untuk suffix. */
const kodeFragmentSchema = (label: string, required: boolean) => {
  const base = z
    .string()
    .trim()
    .max(16, `${label} maksimal 16 karakter`)
    .regex(/^[A-Za-z0-9.\-]*$/, `${label} hanya boleh huruf, angka, titik, atau tanda hubung`);

  return required ? base.min(1, `${label} wajib diisi`) : base;
};

/** Skema setting format kode otomatis per jenis mata kuliah. */
export const mataKuliahKodeSettingSchema = z.object({
  jenis: z.enum(JENIS_MATA_KULIAH),
  prefix: kodeFragmentSchema("Awalan kode", true),
  suffix: kodeFragmentSchema("Akhiran kode", false),
  sequenceWidth: z.coerce
    .number()
    .int("Lebar digit urutan harus bilangan bulat")
    .min(1, "Lebar digit urutan minimal 1")
    .max(6, "Lebar digit urutan maksimal 6"),
});

/** Skema Mata Kuliah. */
export const mataKuliahSchema = z.object({
  kode: kodeSchema,
  nama: z
    .string()
    .trim()
    .min(3, "Nama mata kuliah minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  sks: z.coerce
    .number()
    .int("SKS harus bilangan bulat")
    .min(1, "SKS minimal 1")
    .max(24, "SKS maksimal 24"),
  semester: z.coerce
    .number()
    .int("Semester harus bilangan bulat")
    .min(1, "Semester minimal 1")
    .max(14, "Semester maksimal 14"),
  jenis: z
    .string()
    .trim()
    .max(32)
    .optional()
    .transform((value) => (value ? value : null)),
});
