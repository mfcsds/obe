import { z } from "zod";

/**
 * Skema validasi data dosen dan rekam jejaknya. Semua dijalankan di server
 * (server action) sebelum menyentuh database — input client tidak dipercaya
 * (OWASP A03/A08).
 */

/** Teks opsional: string kosong dinormalkan menjadi null. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Maksimal ${max} karakter`)
    .optional()
    .transform((value) => (value ? value : null));

/** Tahun opsional dalam rentang wajar. */
const optionalYear = z
  .union([z.coerce.number().int().min(1950).max(2100), z.literal("")])
  .optional()
  .transform((value) => (typeof value === "number" ? value : null));

export const dosenSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama dosen minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  nidn: z
    .string()
    .trim()
    .min(8, "NIDN minimal 8 karakter")
    .max(32, "NIDN maksimal 32 karakter")
    .regex(/^[0-9]+$/, "NIDN hanya boleh berisi angka"),
  email: z
    .string()
    .trim()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),
  jabatan: optionalText(64),
  pendidikan: optionalText(16),
  bidangKeahlian: optionalText(255),
  prodi: optionalText(128),
  status: optionalText(32),
});

export const dosenPublikasiSchema = z.object({
  judul: z.string().trim().min(5, "Judul minimal 5 karakter").max(500),
  tahun: optionalYear,
  jenis: optionalText(64),
  penerbit: optionalText(255),
  status: optionalText(32),
});

export const dosenPenelitianSchema = z.object({
  judul: z.string().trim().min(5, "Judul minimal 5 karakter").max(500),
  tahun: optionalYear,
  skema: optionalText(128),
  dana: optionalText(64),
  status: optionalText(32),
});

export const dosenPkmSchema = z.object({
  judul: z.string().trim().min(5, "Judul minimal 5 karakter").max(500),
  tahun: optionalYear,
  mitra: optionalText(255),
  dana: optionalText(64),
  status: optionalText(32),
});

export const dosenRekognisiSchema = z.object({
  nama: z.string().trim().min(3, "Nama penghargaan minimal 3 karakter").max(500),
  penyelenggara: optionalText(255),
  tahun: optionalYear,
  tingkat: optionalText(64),
});

export const dosenSeminarSchema = z.object({
  judul: z.string().trim().min(3, "Judul minimal 3 karakter").max(500),
  peran: optionalText(64),
  penyelenggara: optionalText(255),
  tanggal: optionalText(32),
  jenis: optionalText(32),
});

export const dosenMengajarSchema = z.object({
  kodeMk: z.string().trim().min(2, "Kode mata kuliah minimal 2 karakter").max(32),
  namaMk: z.string().trim().min(3, "Nama mata kuliah minimal 3 karakter").max(255),
  sks: z
    .union([z.coerce.number().int().min(0).max(24), z.literal("")])
    .optional()
    .transform((value) => (typeof value === "number" ? value : null)),
  tahunAkademik: optionalText(32),
  semester: optionalText(32),
});
