"use server";

import { revalidatePath } from "next/cache";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { dosenSchema } from "@/lib/schemas/dosen.schema";
import {
  createDosen,
  deleteDosen,
  getDosenById,
  isNidnTaken,
  listDosen,
  updateDosen,
} from "@/lib/repositories/dosen.repository";
import { getDosenRekamJejak } from "@/lib/repositories/dosen-rekam-jejak.repository";
import type { Dosen, DosenRekamJejak } from "@/types/dosen";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN FITUR DOSEN
 *
 * 1. Boleh membaca  : kaprodi, dosen, mahasiswa (profil dosen bersifat
 *                     informasi publik internal kampus).
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : email dosen ikut ditampilkan karena merupakan email
 *                     institusi yang memang dipublikasikan pada borang.
 *                     Data pribadi lain (KTP, alamat, tanggal lahir) TIDAK
 *                     disimpan pada tabel ini.
 * 4. Destruktif     : hapus dosen ikut menghapus seluruh rekam jejaknya,
 *                     jadi wajib konfirmasi eksplisit di UI + cek role.
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

export type ActionResult = { error: string | null };

/** Memastikan pemanggil login dan berhak mengelola data dosen. */
async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah data dosen.";
  }
  return null;
}

/** Query daftar dosen untuk halaman list. */
export async function getDosenList(): Promise<Dosen[]> {
  const user = await getLoggedInUser();
  if (!user) return [];

  return listDosen();
}

/** Query satu dosen untuk halaman profil. */
export async function getDosenDetail(id: string): Promise<Dosen | null> {
  const user = await getLoggedInUser();
  if (!user) return null;

  return getDosenById(id);
}

/** Query seluruh rekam jejak dosen untuk halaman profil. */
export async function getDosenRekamJejakDetail(id: string): Promise<DosenRekamJejak> {
  const user = await getLoggedInUser();
  const empty: DosenRekamJejak = {
    publikasi: [],
    penelitian: [],
    pkm: [],
    rekognisi: [],
    seminar: [],
    mengajar: [],
  };

  if (!user) return empty;
  return getDosenRekamJejak(id);
}

export async function createDosenAction(formValues: unknown): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const parsed = dosenSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    if (await isNidnTaken(parsed.data.nidn)) {
      return { error: `NIDN ${parsed.data.nidn} sudah terdaftar untuk dosen lain.` };
    }

    await createDosen(parsed.data);
    revalidatePath("/dosen");
    return { error: null };
  } catch (error) {
    console.error("Gagal membuat dosen:", error);
    return { error: "Gagal menyimpan data dosen. Silakan coba lagi." };
  }
}

export async function updateDosenAction(
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };
  if (!id) return { error: "ID dosen tidak valid." };

  const parsed = dosenSchema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    if (await isNidnTaken(parsed.data.nidn, id)) {
      return { error: `NIDN ${parsed.data.nidn} sudah terdaftar untuk dosen lain.` };
    }

    await updateDosen(id, parsed.data);
    revalidatePath("/dosen");
    revalidatePath(`/dosen/${id}`);
    return { error: null };
  } catch (error) {
    console.error("Gagal memperbarui dosen:", error);
    return { error: "Gagal memperbarui data dosen. Silakan coba lagi." };
  }
}

export async function deleteDosenAction(id: string): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };
  if (!id) return { error: "ID dosen tidak valid." };

  try {
    await deleteDosen(id);
    revalidatePath("/dosen");
    return { error: null };
  } catch (error) {
    console.error("Gagal menghapus dosen:", error);
    return { error: "Gagal menghapus dosen. Silakan coba lagi." };
  }
}
