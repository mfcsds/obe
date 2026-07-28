import { z } from "zod";
import { KURIKULUM_STATUS } from "@/types/kurikulum";

/**
 * Skema validasi input kurikulum yang berasal dari form. Ini adalah
 * satu-satunya sumber kebenaran validasi dan WAJIB dijalankan di server
 * (server action) sebelum data masuk ke database — jangan percaya data dari
 * client (OWASP A03/A08).
 *
 * Hanya memuat field yang memang diisi pengguna. Data turunan (total SKS,
 * jumlah CPL/CPMK/MK, semester mulai) sengaja TIDAK ada di sini supaya tidak
 * bisa ditimpa lewat request yang di-craft manual.
 */
export const kurikulumSchema = z.object({
  nama: z
    .string()
    .trim()
    .min(3, "Nama kurikulum minimal 3 karakter")
    .max(255, "Nama kurikulum maksimal 255 karakter"),
  tahunAkademik: z
    .string()
    .trim()
    .regex(/^\d{4}\/\d{4}$/, "Format tahun akademik harus YYYY/YYYY, contoh 2024/2025"),
  status: z.enum(KURIKULUM_STATUS),
});

export type KurikulumSchemaInput = z.infer<typeof kurikulumSchema>;
