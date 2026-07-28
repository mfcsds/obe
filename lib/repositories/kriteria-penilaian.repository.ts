// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import {
  createRowForKurikulum,
  deleteRowById,
  listRowsByKurikulum,
  updateRowById,
} from "./kurikulum-child.repository";
import { TABLES } from "@/lib/appwrite/tables";
import type { KriteriaPenilaian, KriteriaPenilaianFormInput } from "@/types/kurikulum-detail";

const KRITERIA_PENILAIAN_TABLE = TABLES.kriteriaPenilaian;

/** Bentuk mentah row Appwrite untuk tabel kriteria_penilaian. */
interface KriteriaPenilaianRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
}

/** Memetakan row Appwrite ke tipe domain KriteriaPenilaian. */
function mapRowToKriteriaPenilaian(row: KriteriaPenilaianRow): KriteriaPenilaian {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    nama: row.nama,
  };
}

/** Mengambil seluruh kriteria penilaian milik satu kurikulum. */
export async function listKriteriaPenilaian(
  kurikulumId: string
): Promise<KriteriaPenilaian[]> {
  const rows = await listRowsByKurikulum<KriteriaPenilaianRow>(
    KRITERIA_PENILAIAN_TABLE,
    kurikulumId
  );
  return rows.map(mapRowToKriteriaPenilaian);
}

/** Membuat kriteria penilaian baru untuk satu kurikulum. */
export async function createKriteriaPenilaian(
  kurikulumId: string,
  input: KriteriaPenilaianFormInput
): Promise<KriteriaPenilaian> {
  const row = await createRowForKurikulum<KriteriaPenilaianRow>(
    KRITERIA_PENILAIAN_TABLE,
    kurikulumId,
    { ...input }
  );
  return mapRowToKriteriaPenilaian(row);
}

/** Memperbarui kriteria penilaian. */
export async function updateKriteriaPenilaian(
  id: string,
  input: KriteriaPenilaianFormInput
): Promise<KriteriaPenilaian> {
  const row = await updateRowById<KriteriaPenilaianRow>(KRITERIA_PENILAIAN_TABLE, id, {
    ...input,
  });
  return mapRowToKriteriaPenilaian(row);
}

/** Menghapus kriteria penilaian. */
export async function deleteKriteriaPenilaian(id: string): Promise<void> {
  await deleteRowById(KRITERIA_PENILAIAN_TABLE, id);
}
