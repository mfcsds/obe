// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import {
  countRowsByKurikulum,
  createRowForKurikulum,
  deleteRowById,
  listRowsByKurikulum,
  updateRowById,
} from "./kurikulum-child.repository";
import { TABLES } from "@/lib/appwrite/tables";
import type { Cpl, CplFormInput, KategoriCapaian } from "@/types/kurikulum-detail";

const CPL_TABLE = TABLES.cpl;

/** Bentuk mentah row Appwrite untuk tabel cpl. */
interface CplRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  deskripsi: string;
  kategori: string;
}

/** Memetakan row Appwrite ke tipe domain Cpl. */
function mapRowToCpl(row: CplRow): Cpl {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    deskripsi: row.deskripsi,
    kategori: row.kategori as KategoriCapaian,
  };
}

/** Mengambil seluruh CPL milik satu kurikulum. */
export async function listCpl(kurikulumId: string): Promise<Cpl[]> {
  const rows = await listRowsByKurikulum<CplRow>(CPL_TABLE, kurikulumId);
  return rows.map(mapRowToCpl);
}

/** Menghitung jumlah CPL milik satu kurikulum (untuk data turunan). */
export async function countCpl(kurikulumId: string): Promise<number> {
  return countRowsByKurikulum(CPL_TABLE, kurikulumId);
}

/** Membuat CPL baru untuk satu kurikulum. */
export async function createCpl(
  kurikulumId: string,
  input: CplFormInput
): Promise<Cpl> {
  const row = await createRowForKurikulum<CplRow>(CPL_TABLE, kurikulumId, {
    ...input,
  });
  return mapRowToCpl(row);
}

/** Memperbarui CPL. */
export async function updateCpl(id: string, input: CplFormInput): Promise<Cpl> {
  const row = await updateRowById<CplRow>(CPL_TABLE, id, { ...input });
  return mapRowToCpl(row);
}

/** Menghapus CPL. */
export async function deleteCpl(id: string): Promise<void> {
  await deleteRowById(CPL_TABLE, id);
}
