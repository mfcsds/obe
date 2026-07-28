/**
 * Membuat tabel-tabel detail kurikulum di Appwrite TablesDB.
 *
 * Semua tabel punya kolom `kurikulumId` sebagai penanda kepemilikan, sehingga
 * setiap kurikulum memiliki datanya sendiri (Profil Lulusan, CPL, Bahan
 * Kajian, Mata Kuliah) yang terpisah dari kurikulum lain.
 *
 * Idempotent: tabel/kolom/index yang sudah ada akan dilewati.
 * Jalankan: node --env-file=.env.local scripts/setup-kurikulum-detail-tables.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

/** Menjalankan operasi dan mengabaikan error 409 (sudah ada). */
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

/** Menunggu sebentar agar kolom selesai dibuat sebelum index dibuat. */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Definisi tabel detail kurikulum. `strings` = [key, size, required],
 * `integers` = [key, required].
 */
const TABLES = [
  {
    id: "profil_lulusan",
    name: "Profil Lulusan",
    strings: [
      ["kurikulumId", 64, true],
      ["kode", 32, true],
      ["deskripsi", 2000, true],
      ["kategori", 8, true],
      ["profesi", 4000, false],
    ],
    integers: [["urutan", false]],
  },
  {
    id: "cpl",
    name: "CPL Prodi",
    strings: [
      ["kurikulumId", 64, true],
      ["kode", 32, true],
      ["deskripsi", 2000, true],
      ["kategori", 8, true],
    ],
    integers: [["urutan", false]],
  },
  {
    id: "bahan_kajian",
    name: "Bahan Kajian",
    strings: [
      ["kurikulumId", 64, true],
      ["kode", 32, true],
      ["nama", 255, true],
      ["deskripsi", 2000, false],
    ],
    integers: [["urutan", false]],
  },
  {
    id: "mata_kuliah",
    name: "Mata Kuliah",
    strings: [
      ["kurikulumId", 64, true],
      ["kode", 32, true],
      ["nama", 255, true],
      ["jenis", 32, false],
    ],
    integers: [
      ["sks", true],
      ["semester", true],
    ],
  },
];

for (const table of TABLES) {
  await ensure(`Tabel '${table.id}'`, () =>
    tablesDB.createTable({
      databaseId: DATABASE_ID,
      tableId: table.id,
      name: table.name,
    })
  );

  for (const [key, size, required] of table.strings) {
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

  for (const [key, required] of table.integers ?? []) {
    await ensure(`  kolom '${key}'`, () =>
      tablesDB.createIntegerColumn({
        databaseId: DATABASE_ID,
        tableId: table.id,
        key,
        required,
        min: 0,
      })
    );
  }

  // Index pada kurikulumId agar query "ambil data milik kurikulum X" cepat.
  await wait(1500);
  await ensure(`  index 'idx_kurikulumId'`, () =>
    tablesDB.createIndex({
      databaseId: DATABASE_ID,
      tableId: table.id,
      key: "idx_kurikulumId",
      type: "key",
      columns: ["kurikulumId"],
    })
  );
}

console.log("\nSelesai. Tabel detail kurikulum siap dipakai.");
