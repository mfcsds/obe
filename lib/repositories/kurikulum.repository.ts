// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { TABLES } from "@/lib/appwrite/tables";
import type { Kurikulum, KurikulumFormInput, KurikulumStatus } from "@/types/kurikulum";

const TABLE_ID = TABLES.kurikulum;

/**
 * Bentuk mentah row dari Appwrite. Sengaja dipisah dari tipe domain agar
 * perubahan bentuk data SDK tidak merembet ke lapisan UI.
 */
interface KurikulumRow {
  $id: string;
  nama: string;
  tahunAkademik: string;
  semesterMulai: string | null;
  totalSKS: number | null;
  jumlahCPL: number | null;
  jumlahCPMK: number | null;
  jumlahMK: number | null;
  status: string;
}

/** Memetakan row Appwrite ke tipe domain Kurikulum. */
function mapRowToKurikulum(row: KurikulumRow): Kurikulum {
  return {
    id: row.$id,
    nama: row.nama,
    tahunAkademik: row.tahunAkademik,
    semesterMulai: row.semesterMulai ?? null,
    totalSKS: row.totalSKS ?? 0,
    jumlahCPL: row.jumlahCPL ?? 0,
    jumlahCPMK: row.jumlahCPMK ?? 0,
    jumlahMK: row.jumlahMK ?? 0,
    status: (row.status as KurikulumStatus) ?? "Non Aktif",
  };
}

/** Mengambil seluruh kurikulum, terbaru lebih dulu. */
export async function listKurikulum(): Promise<Kurikulum[]> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    queries: [Query.orderDesc("$createdAt"), Query.limit(100)],
  });

  return (result.rows as unknown as KurikulumRow[]).map(mapRowToKurikulum);
}

/** Mengambil satu kurikulum berdasarkan ID, `null` jika tidak ditemukan. */
export async function getKurikulumById(id: string): Promise<Kurikulum | null> {
  const { tablesDB } = await createAdminClient();

  try {
    const row = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLE_ID,
      rowId: id,
    });
    return mapRowToKurikulum(row as unknown as KurikulumRow);
  } catch {
    return null;
  }
}

/**
 * Membuat kurikulum baru. Nilai turunan (total SKS, jumlah CPL/CPMK/MK)
 * diinisialisasi 0 karena akan terakumulasi sendiri saat kurikulum diisi
 * di halaman detail.
 */
export async function createKurikulum(input: KurikulumFormInput): Promise<Kurikulum> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data: {
      ...input,
      totalSKS: 0,
      jumlahCPL: 0,
      jumlahCPMK: 0,
      jumlahMK: 0,
    },
  });

  return mapRowToKurikulum(row as unknown as KurikulumRow);
}

/**
 * Memperbarui metadata kurikulum. Hanya field dari form yang dikirim,
 * sehingga nilai turunan yang sudah terakumulasi tidak ikut tertimpa.
 */
export async function updateKurikulum(
  id: string,
  input: KurikulumFormInput
): Promise<Kurikulum> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: id,
    data: input,
  });

  return mapRowToKurikulum(row as unknown as KurikulumRow);
}

/**
 * Memperbarui nilai turunan (counter) pada kurikulum, mis. `jumlahCPL`
 * setelah CPL ditambah/dihapus. Hanya field yang dikirim yang diubah,
 * sehingga counter lain tidak tertimpa.
 */
export async function syncKurikulumCounters(
  id: string,
  counters: Partial<
    Pick<Kurikulum, "totalSKS" | "jumlahCPL" | "jumlahCPMK" | "jumlahMK">
  >
): Promise<void> {
  const { tablesDB } = await createAdminClient();

  await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: id,
    data: counters,
  });
}

/** Menghapus kurikulum berdasarkan ID. */
export async function deleteKurikulum(id: string): Promise<void> {
  const { tablesDB } = await createAdminClient();

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: id,
  });
}
