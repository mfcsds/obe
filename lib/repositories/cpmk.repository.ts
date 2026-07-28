// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  countRowsByKurikulum,
  createRowForKurikulum,
  deleteRowById,
  listRowsByKurikulum,
  updateRowById,
} from "./kurikulum-child.repository";
import { TABLES } from "@/lib/appwrite/tables";
import type { Cpmk, CpmkFormInput } from "@/types/kurikulum-detail";

const CPMK_TABLE = TABLES.cpmk;

/** Bentuk mentah row Appwrite untuk tabel cpmk. */
interface CpmkRow {
  $id: string;
  kurikulumId: string;
  cplId: string;
  kode: string;
  deskripsi: string;
}

/** Memetakan row Appwrite ke tipe domain Cpmk. */
function mapRowToCpmk(row: CpmkRow): Cpmk {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    cplId: row.cplId,
    kode: row.kode,
    deskripsi: row.deskripsi,
  };
}

/** Mengambil seluruh CPMK milik satu kurikulum (lintas semua CPL). */
export async function listCpmk(kurikulumId: string): Promise<Cpmk[]> {
  const rows = await listRowsByKurikulum<CpmkRow>(CPMK_TABLE, kurikulumId);
  return rows.map(mapRowToCpmk);
}

/** Menghitung jumlah CPMK milik satu kurikulum (untuk data turunan `jumlahCPMK`). */
export async function countCpmk(kurikulumId: string): Promise<number> {
  return countRowsByKurikulum(CPMK_TABLE, kurikulumId);
}

/**
 * Menghitung jumlah CPMK yang sudah ada untuk satu CPL induk tertentu.
 * Dipakai untuk menentukan nomor urut kode CPMK berikutnya
 * (lihat `lib/utils/kode-generator.ts` -> `buildNextCpmkKode`).
 */
export async function countCpmkByCpl(
  kurikulumId: string,
  cplId: string
): Promise<number> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: CPMK_TABLE,
    queries: [
      Query.equal("kurikulumId", kurikulumId),
      Query.equal("cplId", cplId),
      Query.limit(1),
    ],
  });

  return result.total;
}

/** Membuat CPMK baru untuk satu CPL induk pada satu kurikulum. */
export async function createCpmk(
  kurikulumId: string,
  cplId: string,
  input: CpmkFormInput
): Promise<Cpmk> {
  const row = await createRowForKurikulum<CpmkRow>(CPMK_TABLE, kurikulumId, {
    ...input,
    cplId,
  });
  return mapRowToCpmk(row);
}

/** Memperbarui CPMK. `cplId` (induk) sengaja tidak bisa diubah lewat form ubah. */
export async function updateCpmk(id: string, input: CpmkFormInput): Promise<Cpmk> {
  const row = await updateRowById<CpmkRow>(CPMK_TABLE, id, { ...input });
  return mapRowToCpmk(row);
}

/** Menghapus CPMK. */
export async function deleteCpmk(id: string): Promise<void> {
  await deleteRowById(CPMK_TABLE, id);
}
