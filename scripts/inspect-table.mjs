/**
 * Menampilkan status kolom sebuah tabel, untuk mendiagnosis kolom yang
 * gagal/masih diproses Appwrite.
 *
 * Jalankan: node --env-file=.env.local scripts/inspect-table.mjs <tableId>
 */
import { Client, TablesDB } from "node-appwrite";

const tableId = process.argv[2];
if (!tableId) {
  console.error("Sertakan tableId. Contoh: node ... scripts/inspect-table.mjs dosen_pkm");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

const result = await tablesDB.listColumns({
  databaseId: process.env.APPWRITE_DATABASE_ID,
  tableId,
});

console.log(`Tabel '${tableId}' — ${result.total} kolom:`);
for (const column of result.columns) {
  const error = column.error ? ` | error: ${column.error}` : "";
  console.log(`- ${column.key} (${column.type}) status=${column.status}${error}`);
}
