// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";

/**
 * Helper CRUD generik untuk entitas yang "dimiliki" oleh satu kurikulum
 * (Profil Lulusan, CPL, Bahan Kajian, Mata Kuliah, dst). Semua tabel
 * tersebut punya pola sama: difilter berdasarkan `kurikulumId`.
 *
 * Dibuat generik agar tiap entitas baru tidak menduplikasi kode akses data
 * yang identik (steering clean-code: DRY). Mapping ke tipe domain tetap
 * menjadi tanggung jawab repository masing-masing entitas.
 */

/** Field bawaan Appwrite yang selalu ada pada setiap row. */
export interface AppwriteRowMeta {
  $id: string;
}

/** Mengambil seluruh row milik satu kurikulum, diurutkan naik berdasarkan kode. */
export async function listRowsByKurikulum<TRow>(
  tableId: string,
  kurikulumId: string
): Promise<TRow[]> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [
      Query.equal("kurikulumId", kurikulumId),
      Query.orderAsc("kode"),
      Query.limit(200),
    ],
  });

  return result.rows as unknown as TRow[];
}

/** Menghitung jumlah row milik satu kurikulum tanpa mengambil datanya. */
export async function countRowsByKurikulum(
  tableId: string,
  kurikulumId: string
): Promise<number> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [Query.equal("kurikulumId", kurikulumId), Query.limit(1)],
  });

  return result.total;
}

/** Membuat row baru yang terikat pada satu kurikulum. */
export async function createRowForKurikulum<TRow>(
  tableId: string,
  kurikulumId: string,
  data: Record<string, unknown>
): Promise<TRow> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId,
    rowId: ID.unique(),
    data: { ...data, kurikulumId },
  });

  return row as unknown as TRow;
}

/** Memperbarui row berdasarkan ID. */
export async function updateRowById<TRow>(
  tableId: string,
  rowId: string,
  data: Record<string, unknown>
): Promise<TRow> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId,
    rowId,
    data,
  });

  return row as unknown as TRow;
}

/** Menghapus row berdasarkan ID. */
export async function deleteRowById(tableId: string, rowId: string): Promise<void> {
  const { tablesDB } = await createAdminClient();

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId,
    rowId,
  });
}

/**
 * Mengambil `kurikulumId` dari sebuah row. Dipakai server action untuk
 * memverifikasi bahwa row yang akan diubah/dihapus benar-benar milik
 * kurikulum yang dimaksud, mencegah manipulasi ID lintas kurikulum
 * (OWASP A01 — Broken Access Control / IDOR).
 */
export async function getRowKurikulumId(
  tableId: string,
  rowId: string
): Promise<string | null> {
  const { tablesDB } = await createAdminClient();

  try {
    const row = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId,
      rowId,
    });
    return (row as unknown as { kurikulumId?: string }).kurikulumId ?? null;
  } catch {
    return null;
  }
}
