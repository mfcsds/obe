"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { TABLES } from "@/lib/appwrite/tables";
import {
  bahanKajianSchema,
  instrumenPenilaianSchema,
  kriteriaPenilaianSchema,
  mataKuliahSchema,
  teknikPenilaianSchema,
} from "@/lib/schemas/kurikulum-detail.schema";
import {
  createBahanKajian,
  deleteBahanKajian,
  listBahanKajian,
  updateBahanKajian,
} from "@/lib/repositories/bahan-kajian.repository";
import {
  createMataKuliah,
  deleteMataKuliah,
  listMataKuliah,
  updateMataKuliah,
} from "@/lib/repositories/mata-kuliah.repository";
import {
  createTeknikPenilaian,
  deleteTeknikPenilaian,
  listTeknikPenilaian,
  updateTeknikPenilaian,
} from "@/lib/repositories/teknik-penilaian.repository";
import {
  createInstrumenPenilaian,
  deleteInstrumenPenilaian,
  listInstrumenPenilaian,
  updateInstrumenPenilaian,
} from "@/lib/repositories/instrumen-penilaian.repository";
import {
  createKriteriaPenilaian,
  deleteKriteriaPenilaian,
  listKriteriaPenilaian,
  updateKriteriaPenilaian,
} from "@/lib/repositories/kriteria-penilaian.repository";
import { getChildRowParentId } from "@/lib/repositories/child-rows.repository";
import { deletePemetaanByEntity } from "@/lib/repositories/pemetaan.repository";
import { syncKurikulumCounters } from "@/lib/repositories/kurikulum.repository";
import type {
  BahanKajian,
  InstrumenPenilaian,
  KriteriaPenilaian,
  MataKuliah,
  TeknikPenilaian,
} from "@/types/kurikulum-detail";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN BAHAN KAJIAN & MATA KULIAH
 *
 * 1. Boleh membaca  : semua role yang sudah login.
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : hapus entitas juga menghapus seluruh pemetaan yang
 *                     menyangkutnya (cascade manual), jadi wajib konfirmasi
 *                     di UI + cek role di server.
 * 5. IDOR           : update/delete memverifikasi row milik kurikulum terkait.
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

/** Memastikan row target memang milik kurikulum yang dimaksud (anti-IDOR). */
async function assertBelongsToKurikulum(
  tableId: string,
  rowId: string,
  kurikulumId: string
): Promise<string | null> {
  const ownerId = await getChildRowParentId(tableId, "kurikulumId", rowId);
  if (!ownerId || ownerId !== kurikulumId) return "Data tidak ditemukan.";
  return null;
}

function revalidateKurikulum(kurikulumId: string) {
  revalidatePath(`/kurikulum/${kurikulumId}`);
  revalidatePath("/kurikulum");
}

// ---------------------------------------------------------------------------
// Bahan Kajian
// ---------------------------------------------------------------------------

export async function getBahanKajianList(kurikulumId: string): Promise<BahanKajian[]> {
  const user = await getLoggedInUser();
  if (!user) return [];
  return listBahanKajian(kurikulumId);
}

export async function createBahanKajianAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = bahanKajianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createBahanKajian(kurikulumId, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat bahan kajian:", error);
    return { error: "Gagal menyimpan bahan kajian. Silakan coba lagi." };
  }
}

export async function updateBahanKajianAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.bahanKajian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  const parsed = bahanKajianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateBahanKajian(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui bahan kajian:", error);
    return { error: "Gagal memperbarui bahan kajian. Silakan coba lagi." };
  }
}

export async function deleteBahanKajianAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.bahanKajian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  try {
    // Pemetaan yang menyangkut bahan kajian ini dibersihkan agar tidak orphan.
    await deletePemetaanByEntity(kurikulumId, id);
    await deleteBahanKajian(id);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus bahan kajian:", error);
    return { error: "Gagal menghapus bahan kajian. Silakan coba lagi." };
  }
}

// ---------------------------------------------------------------------------
// Mata Kuliah
// ---------------------------------------------------------------------------

export async function getMataKuliahList(kurikulumId: string): Promise<MataKuliah[]> {
  const user = await getLoggedInUser();
  if (!user) return [];
  return listMataKuliah(kurikulumId);
}

/**
 * Menyelaraskan data turunan kurikulum (jumlah MK dan total SKS) setelah
 * daftar mata kuliah berubah, sehingga angka di halaman daftar kurikulum
 * selalu mencerminkan isi sebenarnya.
 */
async function syncRekapMataKuliah(kurikulumId: string) {
  const daftar = await listMataKuliah(kurikulumId);
  const totalSKS = daftar.reduce((total, mk) => total + mk.sks, 0);

  await syncKurikulumCounters(kurikulumId, {
    jumlahMK: daftar.length,
    totalSKS,
  });
}

export async function createMataKuliahAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = mataKuliahSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createMataKuliah(kurikulumId, parsed.data);
    await syncRekapMataKuliah(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat mata kuliah:", error);
    return { error: "Gagal menyimpan mata kuliah. Silakan coba lagi." };
  }
}

export async function updateMataKuliahAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.mataKuliah,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  const parsed = mataKuliahSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateMataKuliah(id, parsed.data);
    await syncRekapMataKuliah(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui mata kuliah:", error);
    return { error: "Gagal memperbarui mata kuliah. Silakan coba lagi." };
  }
}

export async function deleteMataKuliahAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.mataKuliah,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  try {
    await deletePemetaanByEntity(kurikulumId, id);
    await deleteMataKuliah(id);
    await syncRekapMataKuliah(kurikulumId);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus mata kuliah:", error);
    return { error: "Gagal menghapus mata kuliah. Silakan coba lagi." };
  }
}

// ---------------------------------------------------------------------------
// Teknik Penilaian CPMK
// ---------------------------------------------------------------------------

/**
 * DESAIN KEAMANAN TEKNIK PENILAIAN CPMK
 *
 * 1. Boleh membaca  : semua role yang sudah login.
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : hapus juga membersihkan pemetaan CPMK↔teknik yang
 *                     menyangkutnya, wajib konfirmasi di UI + cek role server.
 * 5. IDOR           : update/delete memverifikasi row milik kurikulum terkait.
 */

export async function getTeknikPenilaianList(
  kurikulumId: string
): Promise<TeknikPenilaian[]> {
  const user = await getLoggedInUser();
  if (!user) return [];
  return listTeknikPenilaian(kurikulumId);
}

export async function createTeknikPenilaianAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = teknikPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createTeknikPenilaian(kurikulumId, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat teknik penilaian:", error);
    return { error: "Gagal menyimpan teknik penilaian. Silakan coba lagi." };
  }
}

export async function updateTeknikPenilaianAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.teknikPenilaian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  const parsed = teknikPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateTeknikPenilaian(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui teknik penilaian:", error);
    return { error: "Gagal memperbarui teknik penilaian. Silakan coba lagi." };
  }
}

export async function deleteTeknikPenilaianAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.teknikPenilaian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  try {
    // Pemetaan yang menyangkut teknik penilaian ini dibersihkan agar tidak orphan.
    await deletePemetaanByEntity(kurikulumId, id);
    await deleteTeknikPenilaian(id);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus teknik penilaian:", error);
    return { error: "Gagal menghapus teknik penilaian. Silakan coba lagi." };
  }
}

// ---------------------------------------------------------------------------
// Instrumen Penilaian (mis. Rubrik, Soal Tes, Observasi, Dokumen Proyek Akhir)
// ---------------------------------------------------------------------------

/**
 * DESAIN KEAMANAN INSTRUMEN & KRITERIA PENILAIAN
 *
 * 1. Boleh membaca  : semua role yang sudah login.
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada.
 * 4. Destruktif     : hapus kategori ini TIDAK mengecek pemakaiannya pada
 *                     Rencana Penilaian (tabel `rencana_penilaian` menyimpan
 *                     ID referensi, bukan salinan nilai) — baris rencana
 *                     penilaian yang masih merujuk kategori terhapus akan
 *                     tampil sebagai "tidak dikenal" di UI, bukan error, dan
 *                     kaprodi bisa memperbarui baris tersebut memilih
 *                     kategori baru. Wajib konfirmasi di UI + cek role server.
 * 5. IDOR           : update/delete memverifikasi row milik kurikulum terkait.
 */

export async function getInstrumenPenilaianList(
  kurikulumId: string
): Promise<InstrumenPenilaian[]> {
  const user = await getLoggedInUser();
  if (!user) return [];
  return listInstrumenPenilaian(kurikulumId);
}

export async function createInstrumenPenilaianAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = instrumenPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createInstrumenPenilaian(kurikulumId, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat instrumen penilaian:", error);
    return { error: "Gagal menyimpan instrumen penilaian. Silakan coba lagi." };
  }
}

export async function updateInstrumenPenilaianAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.instrumenPenilaian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  const parsed = instrumenPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateInstrumenPenilaian(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui instrumen penilaian:", error);
    return { error: "Gagal memperbarui instrumen penilaian. Silakan coba lagi." };
  }
}

export async function deleteInstrumenPenilaianAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.instrumenPenilaian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  try {
    await deleteInstrumenPenilaian(id);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus instrumen penilaian:", error);
    return { error: "Gagal menghapus instrumen penilaian. Silakan coba lagi." };
  }
}

// ---------------------------------------------------------------------------
// Kriteria Penilaian (mis. Sesuai Rubrik, Ketepatan Menjawab Soal)
// ---------------------------------------------------------------------------

export async function getKriteriaPenilaianList(
  kurikulumId: string
): Promise<KriteriaPenilaian[]> {
  const user = await getLoggedInUser();
  if (!user) return [];
  return listKriteriaPenilaian(kurikulumId);
}

export async function createKriteriaPenilaianAction(
  kurikulumId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = kriteriaPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createKriteriaPenilaian(kurikulumId, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat kriteria penilaian:", error);
    return { error: "Gagal menyimpan kriteria penilaian. Silakan coba lagi." };
  }
}

export async function updateKriteriaPenilaianAction(
  kurikulumId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.kriteriaPenilaian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  const parsed = kriteriaPenilaianSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateKriteriaPenilaian(id, parsed.data);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui kriteria penilaian:", error);
    return { error: "Gagal memperbarui kriteria penilaian. Silakan coba lagi." };
  }
}

export async function deleteKriteriaPenilaianAction(
  kurikulumId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const ownershipError = await assertBelongsToKurikulum(
    TABLES.kriteriaPenilaian,
    id,
    kurikulumId
  );
  if (ownershipError) return { error: ownershipError };

  try {
    await deleteKriteriaPenilaian(id);
    revalidateKurikulum(kurikulumId);
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus kriteria penilaian:", error);
    return { error: "Gagal menghapus kriteria penilaian. Silakan coba lagi." };
  }
}
