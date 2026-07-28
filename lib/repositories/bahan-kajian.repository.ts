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
import type { BahanKajian, BahanKajianFormInput } from "@/types/kurikulum-detail";

/** Bentuk mentah row Appwrite untuk tabel bahan_kajian. */
interface BahanKajianRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
  deskripsi: string | null;
}

/** Memetakan row Appwrite ke tipe domain BahanKajian. */
function mapRow(row: BahanKajianRow): BahanKajian {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    nama: row.nama,
    deskripsi: row.deskripsi ?? null,
  };
}

/** Mengambil seluruh bahan kajian milik satu kurikulum. */
export async function listBahanKajian(kurikulumId: string): Promise<BahanKajian[]> {
  const rows = await listChildRows<BahanKajianRow>(
    TABLES.bahanKajian,
    "kurikulumId",
    kurikulumId,
    { orderByAsc: "kode" }
  );
  return rows.map(mapRow);
}

/** Membuat bahan kajian baru. */
export async function createBahanKajian(
  kurikulumId: string,
  input: BahanKajianFormInput
): Promise<BahanKajian> {
  const row = await createChildRow<BahanKajianRow>(
    TABLES.bahanKajian,
    "kurikulumId",
    kurikulumId,
    { ...input }
  );
  return mapRow(row);
}

/** Memperbarui bahan kajian. */
export async function updateBahanKajian(
  id: string,
  input: BahanKajianFormInput
): Promise<BahanKajian> {
  const row = await updateChildRow<BahanKajianRow>(TABLES.bahanKajian, id, { ...input });
  return mapRow(row);
}

/** Menghapus bahan kajian. */
export async function deleteBahanKajian(id: string): Promise<void> {
  await deleteChildRow(TABLES.bahanKajian, id);
}
