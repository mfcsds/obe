// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { TABLES } from "@/lib/appwrite/tables";
import {
  createChildRow,
  deleteChildRow,
  listChildRows,
  updateChildRow,
} from "./child-rows.repository";
import type { MataKuliah, MataKuliahFormInput } from "@/types/kurikulum-detail";

/** Bentuk mentah row Appwrite untuk tabel mata_kuliah. */
interface MataKuliahRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
  sks: number | null;
  semester: number | null;
  jenis: string | null;
}

/** Memetakan row Appwrite ke tipe domain MataKuliah. */
function mapRow(row: MataKuliahRow): MataKuliah {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    nama: row.nama,
    sks: row.sks ?? 0,
    semester: row.semester ?? 1,
    jenis: row.jenis ?? null,
  };
}

/**
 * Mengambil seluruh mata kuliah milik satu kurikulum, diurutkan berdasarkan
 * semester lalu kode agar tampil rapi pada susunan mata kuliah.
 */
export async function listMataKuliah(kurikulumId: string): Promise<MataKuliah[]> {
  const rows = await listChildRows<MataKuliahRow>(
    TABLES.mataKuliah,
    "kurikulumId",
    kurikulumId,
    { orderByAsc: "kode", limit: 300 }
  );

  return rows
    .map(mapRow)
    .sort((a, b) => a.semester - b.semester || a.kode.localeCompare(b.kode));
}

/** Membuat mata kuliah baru. */
export async function createMataKuliah(
  kurikulumId: string,
  input: MataKuliahFormInput
): Promise<MataKuliah> {
  const row = await createChildRow<MataKuliahRow>(
    TABLES.mataKuliah,
    "kurikulumId",
    kurikulumId,
    { ...input }
  );
  return mapRow(row);
}

/** Memperbarui mata kuliah. */
export async function updateMataKuliah(
  id: string,
  input: MataKuliahFormInput
): Promise<MataKuliah> {
  const row = await updateChildRow<MataKuliahRow>(TABLES.mataKuliah, id, { ...input });
  return mapRow(row);
}

/** Menghapus mata kuliah. */
export async function deleteMataKuliah(id: string): Promise<void> {
  await deleteChildRow(TABLES.mataKuliah, id);
}
