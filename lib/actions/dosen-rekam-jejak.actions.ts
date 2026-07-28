"use server";

import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { TABLES } from "@/lib/appwrite/tables";
import {
  createChildRow,
  deleteChildRow,
  getChildRowParentId,
  updateChildRow,
} from "@/lib/repositories/child-rows.repository";
import {
  dosenMengajarSchema,
  dosenPenelitianSchema,
  dosenPkmSchema,
  dosenPublikasiSchema,
  dosenRekognisiSchema,
  dosenSeminarSchema,
} from "@/lib/schemas/dosen.schema";
import type { Role } from "@/types/role";

/**
 * DESAIN KEAMANAN REKAM JEJAK DOSEN
 *
 * 1. Boleh membaca  : semua role yang sudah login.
 * 2. Boleh mengubah : HANYA kaprodi.
 * 3. PII            : tidak ada data pribadi sensitif.
 * 4. Destruktif     : hapus wajib konfirmasi di UI + cek role di server.
 * 5. IDOR           : setiap update/delete memverifikasi bahwa row target
 *                     benar-benar milik `dosenId` yang dikirim.
 */
const ROLES_YANG_BOLEH_MENGELOLA: Role[] = ["kaprodi"];

export type ActionResult = { error: string | null };

/** Jenis rekam jejak yang bisa dikelola, dipakai sebagai diskriminator. */
export type JenisRekamJejak =
  | "publikasi"
  | "penelitian"
  | "pkm"
  | "rekognisi"
  | "seminar"
  | "mengajar";

/** Pemetaan jenis rekam jejak ke tabel dan skema validasinya. */
const REKAM_JEJAK_CONFIG: Record<
  JenisRekamJejak,
  { tableId: string; schema: ZodType; label: string }
> = {
  publikasi: {
    tableId: TABLES.dosenPublikasi,
    schema: dosenPublikasiSchema,
    label: "Publikasi",
  },
  penelitian: {
    tableId: TABLES.dosenPenelitian,
    schema: dosenPenelitianSchema,
    label: "Penelitian",
  },
  pkm: { tableId: TABLES.dosenPkm, schema: dosenPkmSchema, label: "PKM" },
  rekognisi: {
    tableId: TABLES.dosenRekognisi,
    schema: dosenRekognisiSchema,
    label: "Rekognisi",
  },
  seminar: {
    tableId: TABLES.dosenSeminar,
    schema: dosenSeminarSchema,
    label: "Seminar/Webinar",
  },
  mengajar: {
    tableId: TABLES.dosenMengajar,
    schema: dosenMengajarSchema,
    label: "Riwayat mengajar",
  },
};

/** Memastikan pemanggil login dan berhak mengelola rekam jejak dosen. */
async function assertCanManage(): Promise<string | null> {
  const user = await getLoggedInUser();

  if (!user) return "Sesi Anda telah berakhir. Silakan login kembali.";
  if (!user.role || !ROLES_YANG_BOLEH_MENGELOLA.includes(user.role)) {
    return "Anda tidak memiliki izin untuk mengubah rekam jejak dosen.";
  }
  return null;
}

/** Memastikan row target memang milik dosen yang dimaksud (anti-IDOR). */
async function assertRowBelongsToDosen(
  tableId: string,
  rowId: string,
  dosenId: string
): Promise<string | null> {
  const ownerId = await getChildRowParentId(tableId, "dosenId", rowId);

  if (!ownerId || ownerId !== dosenId) return "Data tidak ditemukan.";
  return null;
}

/**
 * Menambah entri rekam jejak dosen. Satu action untuk semua jenis, dibedakan
 * oleh parameter `jenis`, agar tidak ada 6 fungsi yang isinya identik.
 */
export async function createRekamJejakAction(
  jenis: JenisRekamJejak,
  dosenId: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const config = REKAM_JEJAK_CONFIG[jenis];
  const parsed = config.schema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await createChildRow(
      config.tableId,
      "dosenId",
      dosenId,
      parsed.data as Record<string, unknown>
    );
    revalidatePath(`/dosen/${dosenId}`);
    return { error: null };
  } catch (error) {
    console.error(`Gagal menambah ${config.label}:`, error);
    return { error: `Gagal menyimpan ${config.label}. Silakan coba lagi.` };
  }
}

/** Memperbarui entri rekam jejak dosen. */
export async function updateRekamJejakAction(
  jenis: JenisRekamJejak,
  dosenId: string,
  id: string,
  formValues: unknown
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const config = REKAM_JEJAK_CONFIG[jenis];

  const ownershipError = await assertRowBelongsToDosen(config.tableId, id, dosenId);
  if (ownershipError) return { error: ownershipError };

  const parsed = config.schema.safeParse(formValues);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  try {
    await updateChildRow(config.tableId, id, parsed.data as Record<string, unknown>);
    revalidatePath(`/dosen/${dosenId}`);
    return { error: null };
  } catch (error) {
    console.error(`Gagal memperbarui ${config.label}:`, error);
    return { error: `Gagal memperbarui ${config.label}. Silakan coba lagi.` };
  }
}

/** Menghapus entri rekam jejak dosen. */
export async function deleteRekamJejakAction(
  jenis: JenisRekamJejak,
  dosenId: string,
  id: string
): Promise<ActionResult> {
  const authError = await assertCanManage();
  if (authError) return { error: authError };

  const config = REKAM_JEJAK_CONFIG[jenis];

  const ownershipError = await assertRowBelongsToDosen(config.tableId, id, dosenId);
  if (ownershipError) return { error: ownershipError };

  try {
    await deleteChildRow(config.tableId, id);
    revalidatePath(`/dosen/${dosenId}`);
    return { error: null };
  } catch (error) {
    console.error(`Gagal menghapus ${config.label}:`, error);
    return { error: `Gagal menghapus ${config.label}. Silakan coba lagi.` };
  }
}
