/**
 * Membuat tabel-tabel untuk tab "Tahap dan Mekanisme Penilaian":
 * - `instrumen_penilaian`: kategori instrumen (Rubrik, Soal Tes, Observasi,
 *   Tugas, Dokumen Proyek Akhir, dst), dapat ditambah sendiri oleh kaprodi.
 * - `kriteria_penilaian`: kategori kriteria (Sesuai Rubrik, Ketepatan
 *   Menjawab Soal, Kedisiplinan, dst), dapat ditambah sendiri oleh kaprodi.
 * - `rencana_penilaian`: baris rencana penilaian yang menghubungkan Mata
 *   Kuliah + CPMK dengan tahapan, teknik, instrumen, kriteria, dan bobot.
 *
 * Idempotent. Jalankan:
 *   node --env-file=.env.local scripts/setup-rencana-penilaian-tables.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

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

// --- Tabel referensi sederhana (kode + nama) -------------------------------

const REFERENCE_TABLES = [
  { id: "instrumen_penilaian", name: "Instrumen Penilaian" },
  { id: "kriteria_penilaian", name: "Kriteria Penilaian" },
];

for (const table of REFERENCE_TABLES) {
  await ensure(`Tabel '${table.id}'`, () =>
    tablesDB.createTable({ databaseId: DATABASE_ID, tableId: table.id, name: table.name })
  );

  for (const [key, size, required] of [
    ["kurikulumId", 64, true],
    ["kode", 32, true],
    ["nama", 150, true],
  ]) {
    await ensure(`  kolom '${key}'`, () =>
      tablesDB.createStringColumn({
        databaseId: DATABASE_ID,
        tableId: table.id,
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
      tableId: table.id,
      key: "idx_kurikulumId",
      type: "key",
      columns: ["kurikulumId"],
    })
  );
}

// --- Tabel rencana_penilaian -------------------------------------------------

const RENCANA_TABLE_ID = "rencana_penilaian";

await ensure(`Tabel '${RENCANA_TABLE_ID}'`, () =>
  tablesDB.createTable({
    databaseId: DATABASE_ID,
    tableId: RENCANA_TABLE_ID,
    name: "Rencana Penilaian",
  })
);

const rencanaStringColumns = [
  ["kurikulumId", 64, true],
  ["mataKuliahId", 64, true],
  ["cpmkId", 64, true],
  ["tahapan", 64, true],
  ["teknikPenilaianId", 64, true],
  ["instrumenPenilaianId", 64, true],
  ["kriteriaPenilaianId", 64, true],
];

for (const [key, size, required] of rencanaStringColumns) {
  await ensure(`  kolom '${key}'`, () =>
    tablesDB.createStringColumn({
      databaseId: DATABASE_ID,
      tableId: RENCANA_TABLE_ID,
      key,
      size,
      required,
    })
  );
}

await ensure("  kolom 'bobot'", () =>
  tablesDB.createFloatColumn({
    databaseId: DATABASE_ID,
    tableId: RENCANA_TABLE_ID,
    key: "bobot",
    required: true,
    min: 0,
    max: 100,
  })
);

await wait(1500);
await ensure("  index 'idx_kurikulum_mk'", () =>
  tablesDB.createIndex({
    databaseId: DATABASE_ID,
    tableId: RENCANA_TABLE_ID,
    key: "idx_kurikulum_mk",
    type: "key",
    columns: ["kurikulumId", "mataKuliahId"],
  })
);

console.log("\nSelesai. Tabel instrumen_penilaian, kriteria_penilaian, dan rencana_penilaian siap dipakai.");
