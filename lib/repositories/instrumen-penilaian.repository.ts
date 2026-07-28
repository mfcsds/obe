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
import type { InstrumenPenilaian, InstrumenPenilaianFormInput } from "@/types/kurikulum-detail";

const INSTRUMEN_PENILAIAN_TABLE = TABLES.instrumenPenilaian;

/** Bentuk mentah row Appwrite untuk tabel instrumen_penilaian. */
interface InstrumenPenilaianRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
}

/** Memetakan row Appwrite ke tipe domain InstrumenPenilaian. */
function mapRowToInstrumenPenilaian(row: InstrumenPenilaianRow): InstrumenPenilaian {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    nama: row.nama,
  };
}

/** Mengambil seluruh instrumen penilaian milik satu kurikulum. */
export async function listInstrumenPenilaian(
  kurikulumId: string
): Promise<InstrumenPenilaian[]> {
  const rows = await listRowsByKurikulum<InstrumenPenilaianRow>(
    INSTRUMEN_PENILAIAN_TABLE,
    kurikulumId
  );
  return rows.map(mapRowToInstrumenPenilaian);
}

/** Membuat instrumen penilaian baru untuk satu kurikulum. */
export async function createInstrumenPenilaian(
  kurikulumId: string,
  input: InstrumenPenilaianFormInput
): Promise<InstrumenPenilaian> {
  const row = await createRowForKurikulum<InstrumenPenilaianRow>(
    INSTRUMEN_PENILAIAN_TABLE,
    kurikulumId,
    { ...input }
  );
  return mapRowToInstrumenPenilaian(row);
}

/** Memperbarui instrumen penilaian. */
export async function updateInstrumenPenilaian(
  id: string,
  input: InstrumenPenilaianFormInput
): Promise<InstrumenPenilaian> {
  const row = await updateRowById<InstrumenPenilaianRow>(INSTRUMEN_PENILAIAN_TABLE, id, {
    ...input,
  });
  return mapRowToInstrumenPenilaian(row);
}

/** Menghapus instrumen penilaian. */
export async function deleteInstrumenPenilaian(id: string): Promise<void> {
  await deleteRowById(INSTRUMEN_PENILAIAN_TABLE, id);
}
