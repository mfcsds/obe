/**
 * Menjadikan kolom `kategori` pada tabel profil_lulusan opsional.
 *
 * Alasan: kategori S/P/KU/KK adalah pembagian ranah untuk CPL, bukan untuk
 * Profil Lulusan. Kolom dibuat opsional (bukan dihapus) agar data yang sudah
 * ada tidak hilang dan perubahan ini dapat dibatalkan bila diperlukan.
 *
 * Jalankan: node --env-file=.env.local scripts/alter-profil-lulusan-kategori.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "profil_lulusan";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

try {
  await tablesDB.updateStringColumn({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "kategori",
    required: false,
    xdefault: null,
    size: 8,
  });
  console.log("✓ Kolom 'kategori' pada profil_lulusan sekarang opsional");
} catch (error) {
  console.error(`✗ Gagal mengubah kolom: ${error.message}`);
  process.exitCode = 1;
}
