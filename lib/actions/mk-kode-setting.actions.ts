"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { mataKuliahKodeSettingSchema } from "@/lib/schemas/kurikulum-detail.schema";
import { listMkKodeSetting, upsertMkKodeSetting } from "@/lib/repositories/mk-kode-setting.repository";
import { listMataKuliah } from "@/lib/repositories/mata-kuliah.repository";
import { getKurikulumById } from "@/lib/repositories/kurikulum.repository";
import { buildNextJenisMataKuliahKode } from "@/lib/utils/kode-generator";
import {
  DEFAULT_MK_KODE_PREFIX,
  DEFAULT_MK_KODE_SEQUENCE_WIDTH,
  JENIS_MATA_KULIAH,
  type MataKuliahKodeSetting,
} from "@/types/kurikulum-detail";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN SETTING KODE MATA KULIAH
 *
 * 1. Boleh membaca  : semua role yang sudah login (dipakai untuk saran kode
 *                     saat menambah mata kuliah, tidak berisi data sensitif).
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : tidak ada operasi hapus; mengubah setting hanya
 *                     mengubah saran kode untuk mata kuliah BARU, tidak
 *                     mengubah kode mata kuliah yang sudah tersimpan.
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

export type ActionResult = { error: string | null };

async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah setting kode mata kuliah.";
  }
  return null;
}

/**
 * Mengambil dua digit terakhir tahun mulai dari string tahun akademik,
 * mis. "2026/2027" -> "26". Dipakai sebagai akhiran kode bawaan sesuai
 * kebiasaan penomoran mata kuliah di lingkungan kampus.
 */
function extractYearSuffix(tahunAkademik: string): string {
  const match = tahunAkademik.match(/(\d{4})/);
  if (!match) return "";
  return match[1].slice(-2);
}

/**
 * Mengambil setting kode LENGKAP untuk seluruh jenis mata kuliah pada satu
 * kurikulum: jenis yang belum pernah diatur kaprodi akan diisi nilai bawaan
 * (prefix standar + akhiran dari tahun kurikulum), sehingga UI selalu
 * mendapat satu baris setting per jenis tanpa perlu menangani "belum ada".
 */
export async function getMkKodeSettingList(
  kurikulumId: string
): Promise<MataKuliahKodeSetting[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const [tersimpan, kurikulum] = await Promise.all([
    listMkKodeSetting(kurikulumId),
    getKurikulumById(kurikulumId),
  ]);

  const suffixTahun = kurikulum ? extractYearSuffix(kurikulum.tahunAkademik) : "";
  const byJenis = new Map(tersimpan.map((setting) => [setting.jenis, setting]));

  return JENIS_MATA_KULIAH.map((jenis) => {
    const existing = byJenis.get(jenis);
    if (existing) return existing;

    return {
      id: "",
      kurikulumId,
      jenis,
      prefix: DEFAULT_MK_KODE_PREFIX[jenis],
      suffix: suffixTahun,
      sequenceWidth: DEFAULT_MK_KODE_SEQUENCE_WIDTH,
    };
  });
}

/** Menyimpan perubahan format kode untuk satu jenis mata kuliah. */
export async function saveMkKodeSettingAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = mataKuliahKodeSettingSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await upsertMkKodeSetting(kurikulumId, parsed.data);
    revalidatePath(`/kurikulum/${kurikulumId}`);
    return { error: null };
  } catch (error) {
    console.error("Gagal menyimpan setting kode mata kuliah:", error);
    return { error: "Gagal menyimpan setting kode. Silakan coba lagi." };
  }
}

/**
 * Menyarankan kode berikutnya untuk jenis mata kuliah tertentu, berdasarkan
 * setting yang berlaku dan banyaknya mata kuliah berjenis sama yang sudah
 * ada. Dipanggil saat kaprodi memilih jenis pada form tambah mata kuliah.
 */
export async function suggestMataKuliahKodeAction(
  kurikulumId: string,
  jenis: string
): Promise<{ kode: string } | { error: string }> {
  const user = await getLoggedInUser();
  if (!user) return { error: "Sesi Anda telah berakhir. Silakan login kembali." };

  const [settingList, mataKuliahList] = await Promise.all([
    getMkKodeSettingList(kurikulumId),
    listMataKuliah(kurikulumId),
  ]);

  const setting = settingList.find((item) => item.jenis === jenis);
  if (!setting) return { error: "Jenis mata kuliah tidak dikenali." };

  const kodeSejenis = mataKuliahList
    .filter((mk) => mk.jenis === jenis)
    .map((mk) => mk.kode);

  return { kode: buildNextJenisMataKuliahKode(kodeSejenis, setting) };
}
