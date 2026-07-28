/**
 * Membuat tabel `teknik_penilaian` — kategori teknik penilaian CPMK (mis.
 * "Partisipasi", "Unjuk Kerja", "Tes Tulis (UTS)") yang dikelola per
 * kurikulum, lalu dipetakan ke CPMK mana yang boleh diukur dengan teknik
 * tersebut lewat tabel `pemetaan` (jenis `cpmk_teknik_penilaian`).
 *
 * Idempotent. Jalankan:
 *   node --env-file=.env.local scripts/setup-teknik-penilaian-table.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "teknik_penilaian";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensure(label, operation) {
  try {
    await operation();
    console.log(`✓ ${label}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`- ${label} (sudah ada)`);
      return;
    }
    throw error;
  }
}

await ensure(`Tabel '${TABLE_ID}'`, () =>
  tablesDB.createTable({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    name: "Teknik Penilaian CPMK",
  })
);

const stringColumns = [
  ["kurikulumId", 64, true],
  ["kode", 32, true],
  ["nama", 100, true],
];

for (const [key, size, required] of stringColumns) {
  await ensure(`  kolom '${key}'`, () =>
    tablesDB.createStringColumn({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      key,
      size,
      required,
    })
  );
}

await wait(1500);
await ensure("  index 'idx_kurikulumId'", () =>
  tablesDB.createIndex({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "idx_kurikulumId",
    type: "key",
    columns: ["kurikulumId"],
  })
);

console.log("\nSelesai. Tabel teknik_penilaian siap dipakai.");
