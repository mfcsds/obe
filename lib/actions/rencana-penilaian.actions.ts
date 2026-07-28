"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { rencanaPenilaianSchema } from "@/lib/schemas/kurikulum-detail.schema";
import {
  createRencanaPenilaian,
  deleteRencanaPenilaian,
  getRencanaPenilaianKurikulumId,
  listRencanaPenilaian,
  updateRencanaPenilaian,
} from "@/lib/repositories/rencana-penilaian.repository";
import { getRowKurikulumId } from "@/lib/repositories/kurikulum-child.repository";
import { TABLES } from "@/lib/appwrite/tables";
import type { RencanaPenilaian } from "@/types/kurikulum-detail";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN TAHAP DAN MEKANISME PENILAIAN (Rencana Penilaian)
 *
 * 1. Boleh membaca  : semua role yang sudah login.
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : hapus satu baris rencana penilaian wajib konfirmasi
 *                     di UI + cek role di server. Tidak ada cascade lain
 *                     yang bergantung pada baris ini.
 * 5. IDOR           : setiap create/update memverifikasi bahwa `mataKuliahId`
 *                     dan `cpmkId` yang dikirim benar-benar milik kurikulum
 *                     yang sama (bukan ID dari kurikulum lain), dan setiap
 *                     update/delete memverifikasi baris rencana penilaian
 *                     yang ditarget benar-benar milik kurikulum yang dikirim.
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

export type ActionResult = { error: string | null };

async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah data kurikulum.";
  }
  return null;
}

/** Memastikan mata kuliah dan CPMK yang dipilih benar-benar milik kurikulum yang sama (anti-IDOR). */
async function assertRelasiBelongsToKurikulum(
  kurikulumId: string,
  mataKuliahId: string,
  cpmkId: string
): Promise<string | null> {
  const [mkOwnerId, cpmkOwnerId] = await Promise.all([
    getRowKurikulumId(TABLES.mataKuliah, mataKuliahId),
    getRowKurikulumId(TABLES.cpmk, cpmkId),
  ]);

  if (!mkOwnerId || mkOwnerId !== kurikulumId) return "Mata kuliah tidak ditemukan.";
  if (!cpmkOwnerId || cpmkOwnerId !== kurikulumId) return "CPMK tidak ditemukan.";
  return null;
}

function revalidateKurikulum(kurikulumId: string) {
  revalidatePath(`/kurikulum/${kurikulumId}`);
}

/** Query daftar rencana penilaian milik satu kurikulum. */
export async function getRencanaPenilaianList(
  kurikulumId: string
): Promise<RencanaPenilaian[]> {
  const user = await getLoggedInUser();
  if (!user) return [];
  return listRencanaPenilaian(kurikulumId);
}

export async function createRencanaPenilaianAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = rencanaPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const relasiError = await assertRelasiBelongsToKurikulum(
    kurikulumId,
    parsed.data.mataKuliahId,
    parsed.data.cpmkId
  );
  if (relasiError) return { error: relasiError };

  try {
    await createRencanaPenilaian(kurikulumId, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat rencana penilaian:", error);
    return { error: "Gagal menyimpan rencana penilaian. Silakan coba lagi." };
  }
}

export async function updateRencanaPenilaianAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownerId = await getRencanaPenilaianKurikulumId(id);
  if (!ownerId || ownerId !== kurikulumId) {
    return { error: "Data tidak ditemukan." };
  }

  const parsed = rencanaPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const relasiError = await assertRelasiBelongsToKurikulum(
    kurikulumId,
    parsed.data.mataKuliahId,
    parsed.data.cpmkId
  );
  if (relasiError) return { error: relasiError };

  try {
    await updateRencanaPenilaian(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui rencana penilaian:", error);
    return { error: "Gagal memperbarui rencana penilaian. Silakan coba lagi." };
  }
}

export async function deleteRencanaPenilaianAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownerId = await getRencanaPenilaianKurikulumId(id);
  if (!ownerId || ownerId !== kurikulumId) {
    return { error: "Data tidak ditemukan." };
  }

  try {
    await deleteRencanaPenilaian(id);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus rencana penilaian:", error);
    return { error: "Gagal menghapus rencana penilaian. Silakan coba lagi." };
  }
}
