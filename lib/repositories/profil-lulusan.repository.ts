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
import type {
  ProfilLulusan,
  ProfilLulusanFormInput,
} from "@/types/kurikulum-detail";
import { TABLES } from "@/lib/appwrite/tables";

const PROFIL_LULUSAN_TABLE = TABLES.profilLulusan;

/** Bentuk mentah row Appwrite untuk tabel profil_lulusan. */
interface ProfilLulusanRow {
  $id: string;
  kurikulumId: string;
  kode: string;
  deskripsi: string;
  profesi: string | null;
}

/** Memetakan row Appwrite ke tipe domain ProfilLulusan. */
function mapRowToProfilLulusan(row: ProfilLulusanRow): ProfilLulusan {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    kode: row.kode,
    deskripsi: row.deskripsi,
    profesi: row.profesi ?? null,
  };
}

/** Mengambil seluruh profil lulusan milik satu kurikulum. */
export async function listProfilLulusan(kurikulumId: string): Promise<ProfilLulusan[]> {
  const rows = await listRowsByKurikulum<ProfilLulusanRow>(
    PROFIL_LULUSAN_TABLE,
    kurikulumId
  );
  return rows.map(mapRowToProfilLulusan);
}

/** Membuat profil lulusan baru untuk satu kurikulum. */
export async function createProfilLulusan(
  kurikulumId: string,
  input: ProfilLulusanFormInput
): Promise<ProfilLulusan> {
  const row = await createRowForKurikulum<ProfilLulusanRow>(
    PROFIL_LULUSAN_TABLE,
    kurikulumId,
    { ...input }
  );
  return mapRowToProfilLulusan(row);
}

/** Memperbarui profil lulusan. */
export async function updateProfilLulusan(
  id: string,
  input: ProfilLulusanFormInput
): Promise<ProfilLulusan> {
  const row = await updateRowById<ProfilLulusanRow>(PROFIL_LULUSAN_TABLE, id, {
    ...input,
  });
  return mapRowToProfilLulusan(row);
}

/** Menghapus profil lulusan. */
export async function deleteProfilLulusan(id: string): Promise<void> {
  await deleteRowById(PROFIL_LULUSAN_TABLE, id);
}
