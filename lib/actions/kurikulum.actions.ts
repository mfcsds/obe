"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { kurikulumSchema } from "@/lib/schemas/kurikulum.schema";
import {
  createKurikulum,
  deleteKurikulum,
  getKurikulumById,
  listKurikulum,
  updateKurikulum,
} from "@/lib/repositories/kurikulum.repository";
import type { Kurikulum } from "@/types/kurikulum";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN FITUR KURIKULUM
 *
 * 1. Boleh membaca  : kaprodi, dosen, mahasiswa (data kurikulum bersifat
 *                     informasi akademik umum, bukan PII).
 * 2. Boleh mengubah : HANYA kaprodi. Dosen/mahasiswa read-only.
 * 3. PII            : tidak ada data pribadi pada entitas ini.
 * 4. Aksi destruktif: hapus wajib konfirmasi di UI DAN dicek role di server
 *                     (fungsi assertCanManage di bawah).
 *
 * Penegakan akses per-route ada di lib/access-control.ts; pengecekan di sini
 * adalah lapisan kedua yang melindungi mutasi data secara langsung, sehingga
 * request yang di-craft manual tanpa melewati UI tetap ditolak (OWASP A01).
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

export type ActionResult = { error: string | null };

/**
 * Memastikan pemanggil sudah login DAN punya role yang berhak mengelola
 * kurikulum. Mengembalikan pesan error bila tidak berhak, `null` bila boleh.
 */
async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) {
    return "Sesi Anda telah berakhir. Silakan login kembali.";
  }

  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah data kurikulum.";
  }

  return null;
}

/**
 * Query untuk halaman daftar kurikulum. Memastikan user sudah login
 * sebelum data dikembalikan.
 */
export async function getKurikulumList(): Promise<Kurikulum[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  return listKurikulum();
}

/**
 * Query untuk halaman detail kurikulum. Mengembalikan `null` bila user
 * belum login atau kurikulum tidak ditemukan, sehingga halaman bisa
 * menampilkan 404 tanpa membocorkan keberadaan data ke user tak berwenang.
 */
export async function getKurikulumDetail(id: string): Promise<Kurikulum | null> {
  const user = await getLoggedInUser();
  if (!user) return null;

  return getKurikulumById(id);
}

/** Membuat kurikulum baru. Hanya kaprodi. */
export async function createKurikulumAction(
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = kurikulumSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createKurikulum(parsed.data);
    revalidatePath("/kurikulum");
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat kurikulum:", error);
    return { error: "Gagal menyimpan kurikulum. Silakan coba lagi." };
  }
}

/** Memperbarui kurikulum yang sudah ada. Hanya kaprodi. */
export async function updateKurikulumAction(
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  if (!id) return { error: "ID kurikulum tidak valid." };

  const parsed = kurikulumSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateKurikulum(id, parsed.data);
    revalidatePath("/kurikulum");
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui kurikulum:", error);
    return { error: "Gagal memperbarui kurikulum. Silakan coba lagi." };
  }
}

/** Menghapus kurikulum. Hanya kaprodi. Aksi destruktif. */
export async function deleteKurikulumAction(id: string): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  if (!id) return { error: "ID kurikulum tidak valid." };

  try {
    await deleteKurikulum(id);
    revalidatePath("/kurikulum");
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus kurikulum:", error);
    return { error: "Gagal menghapus kurikulum. Silakan coba lagi." };
  }
}
