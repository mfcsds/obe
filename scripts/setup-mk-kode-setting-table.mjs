/**
 * Membuat tabel `mk_kode_setting` — menyimpan format kode otomatis
 * (awalan, akhiran, lebar digit urutan) per jenis mata kuliah pada satu
 * kurikulum. Nomor urut TIDAK disimpan sebagai counter di tabel ini;
 * nomor urut dihitung dari kode-kode yang sudah dipakai jenis yang sama
 * (lihat lib/utils/kode-generator.ts), sehingga tidak bisa drift bila ada
 * mata kuliah yang dihapus.
 *
 * Idempotent. Jalankan:
 *   node --env-file=.env.local scripts/setup-mk-kode-setting-table.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "mk_kode_setting";

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
    name: "Setting Kode Mata Kuliah",
  })
);

const stringColumns = [
  ["kurikulumId", 64],
  ["jenis", 32],
  ["prefix", 16],
  ["suffix", 8],
];

for (const [key, size] of stringColumns) {
  await ensure(`  kolom '${key}'`, () =>
    tablesDB.createStringColumn({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      key,
      size,
      required: true,
    })
  );
}

await ensure("  kolom 'sequenceWidth'", () =>
  tablesDB.createIntegerColumn({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "sequenceWidth",
    required: true,
    min: 1,
    max: 6,
  })
);

await waitForColumns(["kurikulumId", "jenis"]);

await ensure("  index 'idx_kurikulum_jenis'", () =>
  tablesDB.createIndex({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "idx_kurikulum_jenis",
    type: "key",
    columns: ["kurikulumId", "jenis"],
  })
);

console.log("\nSelesai. Tabel mk_kode_setting siap dipakai.");
