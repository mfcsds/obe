// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";

/**
 * Helper CRUD generik untuk tabel "anak" yang dimiliki oleh satu entitas
 * induk lewat kolom foreign key (mis. `dosenId`, `kurikulumId`).
 *
 * Dibuat generik agar setiap entitas baru tidak menduplikasi kode akses data
 * yang identik (steering clean-code: DRY). Mapping ke tipe domain tetap
 * tanggung jawab repository masing-masing entitas.
 */

interface ListOptions {
  /** Kolom untuk pengurutan; default tanpa urutan khusus. */
  orderByDesc?: string;
  orderByAsc?: string;
  limit?: number;
}

/** Mengambil seluruh row anak milik satu induk. */
export async function listChildRows<TRow>(
  tableId: string,
  foreignKey: string,
  parentId: string,
  options: ListOptions = {}
): Promise<TRow[]> {
  const { tablesDB } = await createAdminClient();

  const queries = [Query.equal(foreignKey, parentId), Query.limit(options.limit ?? 200)];
  if (options.orderByDesc) queries.push(Query.orderDesc(options.orderByDesc));
  if (options.orderByAsc) queries.push(Query.orderAsc(options.orderByAsc));

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries,
  });

  return result.rows as unknown as TRow[];
}

/** Membuat row anak yang terikat pada satu induk. */
export async function createChildRow<TRow>(
  tableId: string,
  foreignKey: string,
  parentId: string,
  data: Record<string, unknown>
): Promise<TRow> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId,
    rowId: ID.unique(),
    data: { ...data, [foreignKey]: parentId },
  });

  return row as unknown as TRow;
}

/** Memperbarui row berdasarkan ID. */
export async function updateChildRow<TRow>(
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
export async function deleteChildRow(tableId: string, rowId: string): Promise<void> {
  const { tablesDB } = await createAdminClient();

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId,
    rowId,
  });
}

/**
 * Mengambil nilai foreign key dari sebuah row. Dipakai server action untuk
 * memastikan row yang akan diubah/dihapus benar-benar milik induk yang
 * dimaksud, mencegah IDOR (OWASP A01).
 */
export async function getChildRowParentId(
  tableId: string,
  foreignKey: string,
  rowId: string
): Promise<string | null> {
  const { tablesDB } = await createAdminClient();

  try {
    const row = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId,
      rowId,
    });
    return (row as unknown as Record<string, string | undefined>)[foreignKey] ?? null;
  } catch {
    return null;
  }
}

/** Menghapus seluruh row anak milik satu induk (dipakai saat induk dihapus). */
export async function deleteChildRowsByParent(
  tableId: string,
  foreignKey: string,
  parentId: string
): Promise<void> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId,
    queries: [Query.equal(foreignKey, parentId), Query.limit(500)],
  });

  await Promise.all(
    (result.rows as unknown as Array<{ $id: string }>).map((row) =>
      tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId,
        rowId: row.$id,
      })
    )
  );
}
