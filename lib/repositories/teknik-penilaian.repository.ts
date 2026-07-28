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
import type { TeknikPenilaian, TeknikPenilaianFormInput } from "@/types/kurikulum-detail";

const TEKNIK_PENILAIAN_TABLE = TABLES.teknikPenilaian;

/** Bentuk mentah row Appwrite untuk tabel teknik_penilaian. */
interface TeknikPenilaianRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
}

/** Memetakan row Appwrite ke tipe domain TeknikPenilaian. */
function mapRowToTeknikPenilaian(row: TeknikPenilaianRow): TeknikPenilaian {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    nama: row.nama,
  };
}

/** Mengambil seluruh teknik penilaian milik satu kurikulum. */
export async function listTeknikPenilaian(kurikulumId: string): Promise<TeknikPenilaian[]> {
  const rows = await listRowsByKurikulum<TeknikPenilaianRow>(
    TEKNIK_PENILAIAN_TABLE,
    kurikulumId
  );
  return rows.map(mapRowToTeknikPenilaian);
}

/** Membuat teknik penilaian baru untuk satu kurikulum. */
export async function createTeknikPenilaian(
  kurikulumId: string,
  input: TeknikPenilaianFormInput
): Promise<TeknikPenilaian> {
  const row = await createRowForKurikulum<TeknikPenilaianRow>(
    TEKNIK_PENILAIAN_TABLE,
    kurikulumId,
    { ...input }
  );
  return mapRowToTeknikPenilaian(row);
}

/** Memperbarui teknik penilaian. */
export async function updateTeknikPenilaian(
  id: string,
  input: TeknikPenilaianFormInput
): Promise<TeknikPenilaian> {
  const row = await updateRowById<TeknikPenilaianRow>(TEKNIK_PENILAIAN_TABLE, id, {
    ...input,
  });
  return mapRowToTeknikPenilaian(row);
}

/** Menghapus teknik penilaian. */
export async function deleteTeknikPenilaian(id: string): Promise<void> {
  await deleteRowById(TEKNIK_PENILAIAN_TABLE, id);
}
