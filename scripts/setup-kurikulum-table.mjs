/**
 * Membuat tabel `kurikulum` beserta kolomnya di Appwrite TablesDB.
 * Idempotent: kalau tabel/kolom sudah ada, akan dilewati.
 *
 * Jalankan: node --env-file=.env.local scripts/setup-kurikulum-table.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "kurikulum";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

/** Menjalankan operasi dan mengabaikan error "sudah ada". */
async function ensure(label, operation) {
  try {
    await operation();
    console.log(`✓ ${label}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`- ${label} (sudah ada, dilewati)`);
      return;
    }
    throw error;
  }
}

await ensure("Tabel 'kurikulum'", () =>
  tablesDB.createTable({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    name: "Kurikulum",
  })
);

const stringColumns = [
  { key: "nama", size: 255, required: true },
  { key: "tahunAkademik", size: 32, required: true },
  { key: "semesterMulai", size: 64, required: true },
  { key: "status", size: 32, required: true },
];

for (const column of stringColumns) {
  await ensure(`Kolom '${column.key}' (string)`, () =>
    tablesDB.createStringColumn({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      key: column.key,
      size: column.size,
      required: column.required,
    })
  );
}

const integerColumns = ["totalSKS", "jumlahCPL", "jumlahCPMK", "jumlahMK"];

for (const key of integerColumns) {
  await ensure(`Kolom '${key}' (integer)`, () =>
    tablesDB.createIntegerColumn({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      key,
      required: false,
      min: 0,
    })
  );
}

console.log("\nSelesai. Tabel kurikulum siap dipakai.");
