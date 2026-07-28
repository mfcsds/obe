/**
 * Mengubah kolom `semesterMulai` pada tabel kurikulum menjadi opsional.
 *
 * Alasan: kolom ini tidak lagi diisi lewat form pembuatan kurikulum karena
 * akan terisi otomatis dari data turunan (susunan mata kuliah per semester).
 *
 * Jalankan: node --env-file=.env.local scripts/alter-kurikulum-optional.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "kurikulum";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

try {
  await tablesDB.updateStringColumn({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "semesterMulai",
    required: false,
    xdefault: null,
    size: 64,
  });
  console.log("✓ Kolom 'semesterMulai' sekarang opsional");
} catch (error) {
  console.error(`✗ Gagal mengubah kolom: ${error.message}`);
  process.exitCode = 1;
}
