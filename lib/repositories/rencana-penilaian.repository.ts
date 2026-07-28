// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { TABLES } from "@/lib/appwrite/tables";
import type {
  RencanaPenilaian,
  RencanaPenilaianFormInput,
  TahapanPenilaian,
} from "@/types/kurikulum-detail";

const TABLE_ID = TABLES.rencanaPenilaian;

/**
 * Repository Rencana Penilaian: baris tahap & mekanisme penilaian yang
 * menghubungkan satu Mata Kuliah + CPMK dengan tahapan, teknik, instrumen,
 * kriteria, dan bobot penilaiannya.
 *
 * Tidak memakai helper generik `kurikulum-child.repository.ts` karena tabel
 * ini tidak punya kolom `kode` (helper tersebut selalu mengurutkan `orderAsc
 * ("kode")`) — di sini diurutkan berdasarkan `mataKuliahId` agar baris untuk
 * mata kuliah yang sama tampil berdekatan di tabel.
 */

interface RencanaPenilaianRow {
  $id: string;
  kurikulumId: string;
  mataKuliahId: string;
  cpmkId: string;
  tahapan: string;
  teknikPenilaianId: string;
  instrumenPenilaianId: string;
  kriteriaPenilaianId: string;
  bobot: number;
}

function mapRow(row: RencanaPenilaianRow): RencanaPenilaian {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    mataKuliahId: row.mataKuliahId,
    cpmkId: row.cpmkId,
    tahapan: row.tahapan as TahapanPenilaian,
    teknikPenilaianId: row.teknikPenilaianId,
    instrumenPenilaianId: row.instrumenPenilaianId,
    kriteriaPenilaianId: row.kriteriaPenilaianId,
    bobot: row.bobot,
  };
}

/** Mengambil seluruh rencana penilaian milik satu kurikulum. */
export async function listRencanaPenilaian(
  kurikulumId: string
): Promise<RencanaPenilaian[]> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    queries: [
      Query.equal("kurikulumId", kurikulumId),
      Query.orderAsc("mataKuliahId"),
      Query.limit(1000),
    ],
  });

  return (result.rows as unknown as RencanaPenilaianRow[]).map(mapRow);
}

/** Membuat baris rencana penilaian baru. */
export async function createRencanaPenilaian(
  kurikulumId: string,
  input: RencanaPenilaianFormInput
): Promise<RencanaPenilaian> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data: { ...input, kurikulumId },
  });

  return mapRow(row as unknown as RencanaPenilaianRow);
}

/** Memperbarui baris rencana penilaian. */
export async function updateRencanaPenilaian(
  id: string,
  input: RencanaPenilaianFormInput
): Promise<RencanaPenilaian> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: id,
    data: input,
  });

  return mapRow(row as unknown as RencanaPenilaianRow);
}

/** Menghapus baris rencana penilaian. */
export async function deleteRencanaPenilaian(id: string): Promise<void> {
  const { tablesDB } = await createAdminClient();

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: id,
  });
}

/**
 * Mengambil `kurikulumId` dari satu baris rencana penilaian. Dipakai server
 * action untuk memverifikasi kepemilikan sebelum update/delete (anti-IDOR).
 */
export async function getRencanaPenilaianKurikulumId(id: string): Promise<string | null> {
  const { tablesDB } = await createAdminClient();

  try {
    const row = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLE_ID,
      rowId: id,
    });
    return (row as unknown as { kurikulumId?: string }).kurikulumId ?? null;
  } catch {
    return null;
  }
}
