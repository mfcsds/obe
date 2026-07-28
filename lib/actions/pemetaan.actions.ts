"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { listPemetaan, setPemetaan } from "@/lib/repositories/pemetaan.repository";
import {
  JENIS_PEMETAAN,
  toPemetaanKey,
  type JenisPemetaan,
} from "@/types/kurikulum-detail";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN MATRIKS PEMETAAN
 *
 * 1. Boleh membaca  : semua role yang sudah login.
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : menonaktifkan sel hanya menghapus satu relasi, dampaknya
 *                     kecil dan mudah dikembalikan, jadi tidak perlu dialog
 *                     konfirmasi terpisah.
 * 5. Validasi jenis : `jenis` dicek terhadap daftar yang sah agar nilai
 *                     arbitrer dari client tidak masuk ke database.
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

const JENIS_PEMETAAN_VALID: JenisPemetaan[] = Object.values(JENIS_PEMETAAN);

export type ActionResult = { error: string | null };

/** Memastikan pemanggil login dan berhak mengubah pemetaan. */
async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah pemetaan kurikulum.";
  }
  return null;
}

/**
 * Mengambil pemetaan satu jenis matriks sebagai array kunci `"source:target"`.
 * Dikembalikan sebagai array (bukan Set) agar bisa diserialisasi dari Server
 * Component ke Client Component.
 */
export async function getPemetaanKeys(
  kurikulumId: string,
  jenis: JenisPemetaan
): Promise<string[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  const rows = await listPemetaan(kurikulumId, jenis);
  return rows.map((row) => toPemetaanKey(row.sourceId, row.targetId));
}

/**
 * Mengaktifkan/menonaktifkan satu sel matriks pemetaan.
 * Satu action ini melayani keempat matriks, dibedakan oleh `jenis`.
 */
export async function togglePemetaanAction(
  kurikulumId: string,
  jenis: JenisPemetaan,
  sourceId: string,
  targetId: string,
  aktif: boolean
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  if (!JENIS_PEMETAAN_VALID.includes(jenis)) {
    return { error: "Jenis pemetaan tidak dikenali." };
  }
  if (!kurikulumId || !sourceId || !targetId) {
    return { error: "Data pemetaan tidak lengkap." };
  }

  try {
    await setPemetaan(kurikulumId, jenis, sourceId, targetId, aktif);
    revalidatePath(`/kurikulum/${kurikulumId}`);
    return { error: null };
  } catch (error) {
    console.error("Gagal menyimpan pemetaan:", error);
    return { error: "Gagal menyimpan pemetaan. Silakan coba lagi." };
  }
}
