"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import {
  cplSchema,
  cpmkSchema,
  profilLulusanSchema,
} from "@/lib/schemas/kurikulum-detail.schema";
import {
  createProfilLulusan,
  deleteProfilLulusan,
  listProfilLulusan,
  updateProfilLulusan,
} from "@/lib/repositories/profil-lulusan.repository";
import {
  countCpl,
  createCpl,
  deleteCpl,
  listCpl,
  updateCpl,
} from "@/lib/repositories/cpl.repository";
import {
  countCpmk,
  countCpmkByCpl,
  createCpmk,
  deleteCpmk,
  listCpmk,
  updateCpmk,
} from "@/lib/repositories/cpmk.repository";
import { getRowKurikulumId } from "@/lib/repositories/kurikulum-child.repository";
import { deletePemetaanByEntity } from "@/lib/repositories/pemetaan.repository";
import { TABLES } from "@/lib/appwrite/tables";
import { syncKurikulumCounters } from "@/lib/repositories/kurikulum.repository";
import { buildNextCpmkKode } from "@/lib/utils/kode-generator";
import type { Cpl, Cpmk, ProfilLulusan } from "@/types/kurikulum-detail";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN DETAIL KURIKULUM (Profil Lulusan & CPL)
 *
 * 1. Boleh membaca  : semua role yang sudah login (kaprodi, dosen, mahasiswa).
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : hapus wajib konfirmasi di UI + cek role di server.
 * 5. IDOR           : setiap update/delete memverifikasi bahwa row target
 *                     benar-benar milik `kurikulumId` yang dikirim, sehingga
 *                     ID dari kurikulum lain tidak bisa dimanipulasi.
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

export type ActionResult = { error: string | null };

/** Memastikan pemanggil login dan berhak mengelola isi kurikulum. */
async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah data kurikulum.";
  }
  return null;
}

/**
 * Memastikan row target memang milik kurikulum yang dimaksud sebelum
 * diubah/dihapus. Mencegah Insecure Direct Object Reference.
 */
async function assertRowBelongsToKurikulum(
  tableId: string,
  rowId: string,
  kurikulumId: string
): Promise<string | null> {
  const ownerId = await getRowKurikulumId(tableId, rowId);

  if (!ownerId) return "Data tidak ditemukan.";
  if (ownerId !== kurikulumId) return "Data tidak ditemukan.";
  return null;
}

/** Merevalidasi halaman detail kurikulum dan daftar kurikulum. */
function revalidateKurikulum(kurikulumId: string) {
  revalidatePath(`/kurikulum/${kurikulumId}`);
  revalidatePath("/kurikulum");
}

// ---------------------------------------------------------------------------
// Profil Lulusan
// ---------------------------------------------------------------------------

/** Query daftar profil lulusan milik satu kurikulum. */
export async function getProfilLulusanList(
  kurikulumId: string
): Promise<ProfilLulusan[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  return listProfilLulusan(kurikulumId);
}

export async function createProfilLulusanAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = profilLulusanSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createProfilLulusan(kurikulumId, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat profil lulusan:", error);
    return { error: "Gagal menyimpan profil lulusan. Silakan coba lagi." };
  }
}

export async function updateProfilLulusanAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertRowBelongsToKurikulum(
    TABLES.profilLulusan,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  const parsed = profilLulusanSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateProfilLulusan(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui profil lulusan:", error);
    return { error: "Gagal memperbarui profil lulusan. Silakan coba lagi." };
  }
}

export async function deleteProfilLulusanAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertRowBelongsToKurikulum(
    TABLES.profilLulusan,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  try {
    // Pemetaan yang menyangkut profil ini dibersihkan agar tidak orphan.
    await deletePemetaanByEntity(kurikulumId, id);
    await deleteProfilLulusan(id);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus profil lulusan:", error);
    return { error: "Gagal menghapus profil lulusan. Silakan coba lagi." };
  }
}

// ---------------------------------------------------------------------------
// CPL Prodi
// ---------------------------------------------------------------------------

/** Query daftar CPL milik satu kurikulum. */
export async function getCplList(kurikulumId: string): Promise<Cpl[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  return listCpl(kurikulumId);
}

/**
 * Menyelaraskan nilai turunan `jumlahCPL` pada tabel kurikulum setelah
 * jumlah CPL berubah, agar angka di halaman daftar kurikulum selalu akurat.
 */
async function syncJumlahCpl(kurikulumId: string) {
  const jumlahCPL = await countCpl(kurikulumId);
  await syncKurikulumCounters(kurikulumId, { jumlahCPL });
}

export async function createCplAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = cplSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createCpl(kurikulumId, parsed.data);
    await syncJumlahCpl(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat CPL:", error);
    return { error: "Gagal menyimpan CPL. Silakan coba lagi." };
  }
}

export async function updateCplAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertRowBelongsToKurikulum(TABLES.cpl, id, kurikulumId);
  if (ownershipError) return { error: ownershipError };

  const parsed = cplSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateCpl(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui CPL:", error);
    return { error: "Gagal memperbarui CPL. Silakan coba lagi." };
  }
}

export async function deleteCplAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertRowBelongsToKurikulum(TABLES.cpl, id, kurikulumId);
  if (ownershipError) return { error: ownershipError };

  try {
    // Pemetaan yang menyangkut CPL ini dibersihkan agar tidak orphan.
    await deletePemetaanByEntity(kurikulumId, id);
    await deleteCpl(id);
    await syncJumlahCpl(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus CPL:", error);
    return { error: "Gagal menghapus CPL. Silakan coba lagi." };
  }
}

// ---------------------------------------------------------------------------
// CPMK (turunan dari CPL)
// ---------------------------------------------------------------------------

/** Query daftar CPMK milik satu kurikulum (lintas seluruh CPL). */
export async function getCpmkList(kurikulumId: string): Promise<Cpmk[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  return listCpmk(kurikulumId);
}

/**
 * Menyelaraskan nilai turunan `jumlahCPMK` pada tabel kurikulum setelah
 * jumlah CPMK berubah, agar angka di halaman daftar kurikulum selalu akurat.
 */
async function syncJumlahCpmk(kurikulumId: string) {
  const jumlahCPMK = await countCpmk(kurikulumId);
  await syncKurikulumCounters(kurikulumId, { jumlahCPMK });
}

/**
 * Menyarankan kode CPMK berikutnya untuk satu CPL induk, mis. CPL induk
 * "CPL01" yang sudah punya 2 CPMK -> disarankan "CPMK013". Dipanggil dari
 * client saat kaprodi memilih/mengganti CPL induk pada form tambah CPMK.
 */
export async function suggestNextCpmkKodeAction(
  kurikulumId: string,
  cplId: string,
  cplKode: string
): Promise<string> {
  const user = await getLoggedInUser();
  if (!user) return buildNextCpmkKode(cplKode, 0);

  const jumlahCpmkCpl = await countCpmkByCpl(kurikulumId, cplId);
  return buildNextCpmkKode(cplKode, jumlahCpmkCpl);
}

export async function createCpmkAction(
  kurikulumId: string,
  cplId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  // CPL induk harus benar-benar milik kurikulum ini (anti-IDOR).
  const cplOwnershipError = await assertRowBelongsToKurikulum(TABLES.cpl, cplId, kurikulumId);
  if (cplOwnershipError) return { error: "CPL induk tidak ditemukan." };

  const parsed = cpmkSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createCpmk(kurikulumId, cplId, parsed.data);
    await syncJumlahCpmk(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat CPMK:", error);
    return { error: "Gagal menyimpan CPMK. Silakan coba lagi." };
  }
}

export async function updateCpmkAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertRowBelongsToKurikulum(TABLES.cpmk, id, kurikulumId);
  if (ownershipError) return { error: ownershipError };

  const parsed = cpmkSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateCpmk(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui CPMK:", error);
    return { error: "Gagal memperbarui CPMK. Silakan coba lagi." };
  }
}

export async function deleteCpmkAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertRowBelongsToKurikulum(TABLES.cpmk, id, kurikulumId);
  if (ownershipError) return { error: ownershipError };

  try {
    // Pemetaan yang menyangkut CPMK ini dibersihkan agar tidak orphan
    // (akan relevan setelah tab Pemetaan CPL-CPMK-Mata Kuliah tersedia).
    await deletePemetaanByEntity(kurikulumId, id);
    await deleteCpmk(id);
    await syncJumlahCpmk(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus CPMK:", error);
    return { error: "Gagal menghapus CPMK. Silakan coba lagi." };
  }
}
