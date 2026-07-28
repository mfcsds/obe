// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { TABLES } from "@/lib/appwrite/tables";
import { deleteChildRowsByParent } from "./child-rows.repository";
import type { Dosen, DosenFormInput } from "@/types/dosen";

/** Bentuk mentah row Appwrite untuk tabel dosen. */
interface DosenRow {
  $id: string;
  nama: string;
  nidn: string;
  email: string;
  jabatan: string | null;
  pendidikan: string | null;
  bidangKeahlian: string | null;
  prodi: string | null;
  status: string | null;
}

/** Memetakan row Appwrite ke tipe domain Dosen. */
function mapRowToDosen(row: DosenRow): Dosen {
  return {
    id: row.$id,
    nama: row.nama,
    nidn: row.nidn,
    email: row.email,
    jabatan: row.jabatan ?? null,
    pendidikan: row.pendidikan ?? null,
    bidangKeahlian: row.bidangKeahlian ?? null,
    prodi: row.prodi ?? null,
    status: row.status ?? null,
  };
}

/** Seluruh tabel anak dosen, dipakai saat menghapus dosen (cascade manual). */
const DOSEN_CHILD_TABLES = [
  TABLES.dosenPublikasi,
  TABLES.dosenPenelitian,
  TABLES.dosenPkm,
  TABLES.dosenRekognisi,
  TABLES.dosenSeminar,
  TABLES.dosenMengajar,
];

/** Mengambil seluruh dosen, diurutkan berdasarkan nama. */
export async function listDosen(): Promise<Dosen[]> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.dosen,
    queries: [Query.orderAsc("nama"), Query.limit(500)],
  });

  return (result.rows as unknown as DosenRow[]).map(mapRowToDosen);
}

/** Mengambil satu dosen berdasarkan ID, `null` jika tidak ditemukan. */
export async function getDosenById(id: string): Promise<Dosen | null> {
  const { tablesDB } = await createAdminClient();

  try {
    const row = await tablesDB.getRow({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLES.dosen,
      rowId: id,
    });
    return mapRowToDosen(row as unknown as DosenRow);
  } catch {
    return null;
  }
}

/** Membuat dosen baru. */
export async function createDosen(input: DosenFormInput): Promise<Dosen> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.dosen,
    rowId: ID.unique(),
    data: input,
  });

  return mapRowToDosen(row as unknown as DosenRow);
}

/** Memperbarui data dosen. */
export async function updateDosen(id: string, input: DosenFormInput): Promise<Dosen> {
  const { tablesDB } = await createAdminClient();

  const row = await tablesDB.updateRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.dosen,
    rowId: id,
    data: input,
  });

  return mapRowToDosen(row as unknown as DosenRow);
}

/**
 * Menghapus dosen beserta seluruh rekam jejaknya. Appwrite tidak melakukan
 * cascade delete otomatis untuk relasi berbasis kolom ID, jadi tabel anak
 * dibersihkan manual agar tidak meninggalkan data orphan.
 */
export async function deleteDosen(id: string): Promise<void> {
  const { tablesDB } = await createAdminClient();

  for (const tableId of DOSEN_CHILD_TABLES) {
    await deleteChildRowsByParent(tableId, "dosenId", id);
  }

  await tablesDB.deleteRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.dosen,
    rowId: id,
  });
}

/** Mengecek apakah NIDN sudah dipakai dosen lain (untuk validasi unik). */
export async function isNidnTaken(nidn: string, exceptId?: string): Promise<boolean> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.dosen,
    queries: [Query.equal("nidn", nidn), Query.limit(2)],
  });

  const rows = result.rows as unknown as DosenRow[];
  return rows.some((row) => row.$id !== exceptId);
}
