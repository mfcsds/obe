/**
 * Memperbaiki kolom yang macet di status `processing` dengan menghapus lalu
 * membuatnya kembali, kemudian menunggu sampai statusnya `available`.
 *
 * Jalankan: node --env-file=.env.local scripts/repair-stuck-column.mjs <tableId> <columnKey> <size>
 */
import { Client, TablesDB } from "node-appwrite";

const [tableId, columnKey, sizeArg] = process.argv.slice(2);
if (!tableId || !columnKey) {
  console.error("Contoh: node ... scripts/repair-stuck-column.mjs dosen_pkm dosenId 64");
  process.exit(1);
}
const size = Number(sizeArg ?? 64);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  await tablesDB.deleteColumn({ databaseId: DATABASE_ID, tableId, key: columnKey });
  console.log(`✓ Kolom '${columnKey}' dihapus`);
} catch (error) {
  console.log(`- Tidak bisa menghapus '${columnKey}': ${error.message}`);
}

await wait(3000);

await tablesDB.createStringColumn({
  databaseId: DATABASE_ID,
  tableId,
  key: columnKey,
  size,
  required: true,
});
console.log(`✓ Kolom '${columnKey}' dibuat ulang, menunggu status available...`);

for (let attempt = 1; attempt <= 30; attempt += 1) {
  await wait(2000);
  const result = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId });
  const column = result.columns.find((item) => item.key === columnKey);

  if (column?.status === "available") {
    console.log(`✓ Kolom '${columnKey}' siap`);
    process.exit(0);
  }
  if (column?.status === "failed") {
    console.error(`✗ Kolom '${columnKey}' gagal dibuat: ${column.error ?? "-"}`);
    process.exit(1);
  }
}

console.error(`✗ Kolom '${columnKey}' masih belum siap setelah menunggu 60 detik.`);
process.exit(1);
