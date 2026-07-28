/**
 * Membuat tabel `cpmk` — Capaian Pembelajaran Mata Kuliah, turunan langsung
 * dari satu Capaian Pembelajaran Lulusan (CPL) lewat kolom `cplId`.
 *
 * Kode CPMK (mis. "CPMK011") tidak disimpan sebagai counter terpisah; nomor
 * urutnya selalu dihitung ulang dari banyaknya CPMK yang sudah ada untuk CPL
 * yang sama (lihat lib/utils/kode-generator.ts -> `buildNextCpmkKode`),
 * sehingga tidak drift bila ada CPMK yang dihapus.
 *
 * Idempotent. Jalankan:
 *   node --env-file=.env.local scripts/setup-cpmk-table.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "cpmk";

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

/** Menunggu sampai kolom yang dibutuhkan index berstatus `available`. */
async function waitForColumns(columnKeys, maxAttempts = 40) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId: TABLE_ID });
    const relevant = result.columns.filter((c) => columnKeys.includes(c.key));

    if (
      relevant.length === columnKeys.length &&
      relevant.every((c) => c.status === "available")
    ) {
      return;
    }
    const failed = relevant.find((c) => c.status === "failed");
    if (failed) throw new Error(`Kolom '${failed.key}' gagal dibuat`);

    await wait(2000);
  }
  throw new Error(`Kolom ${columnKeys.join(", ")} belum siap setelah menunggu.`);
}

await ensure(`Tabel '${TABLE_ID}'`, () =>
  tablesDB.createTable({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    name: "CPMK",
  })
);

const stringColumns = [
  ["kurikulumId", 64, true],
  ["cplId", 64, true],
  ["kode", 32, true],
  ["deskripsi", 2000, true],
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

await waitForColumns(["kurikulumId", "cplId"]);

// Index gabungan: query utama selalu "ambil CPMK milik CPL X pada kurikulum Y".
await ensure("  index 'idx_kurikulum_cpl'", () =>
  tablesDB.createIndex({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "idx_kurikulum_cpl",
    type: "key",
    columns: ["kurikulumId", "cplId"],
  })
);

console.log("\nSelesai. Tabel cpmk siap dipakai.");
