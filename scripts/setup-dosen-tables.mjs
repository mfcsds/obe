/**
 * Membuat tabel dosen beserta tabel anaknya (publikasi, penelitian, PKM,
 * rekognisi, seminar/webinar, riwayat mengajar) di Appwrite TablesDB.
 *
 * Tabel anak memakai kolom `dosenId` sebagai penanda kepemilikan, sehingga
 * setiap dosen punya rekam jejaknya sendiri.
 *
 * Idempotent. Jalankan:
 *   node --env-file=.env.local scripts/setup-dosen-tables.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Menunggu sampai seluruh kolom yang dibutuhkan index berstatus `available`.
 * Appwrite memproses pembuatan kolom secara asinkron, jadi index yang dibuat
 * terlalu cepat akan gagal dengan `column_not_available`.
 */
async function waitForColumns(tableId, columnKeys, maxAttempts = 40) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await tablesDB.listColumns({ databaseId: DATABASE_ID, tableId });
    const relevant = result.columns.filter((column) => columnKeys.includes(column.key));

    if (relevant.length === columnKeys.length && relevant.every((c) => c.status === "available")) {
      return;
    }

    const failed = relevant.find((column) => column.status === "failed");
    if (failed) {
      throw new Error(`Kolom '${failed.key}' gagal dibuat di tabel '${tableId}'`);
    }

    await wait(2000);
  }

  throw new Error(
    `Kolom ${columnKeys.join(", ")} pada '${tableId}' belum siap setelah menunggu.`
  );
}

/** Membuat index, mengabaikan bila sudah ada. */
async function ensureIndex(label, operation) {
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

/** strings: [key, size, required] | integers: [key, required] */
const TABLES = [
  {
    id: "dosen",
    name: "Dosen",
    strings: [
      ["nama", 255, true],
      ["nidn", 32, true],
      ["email", 255, true],
      ["jabatan", 64, false],
      ["pendidikan", 16, false],
      ["bidangKeahlian", 255, false],
      ["prodi", 128, false],
      ["status", 32, false],
    ],
    indexes: [["idx_nidn", "key", ["nidn"]]],
  },
  {
    id: "dosen_publikasi",
    name: "Publikasi Dosen",
    strings: [
      ["dosenId", 64, true],
      ["judul", 500, true],
      ["jenis", 64, false],
      ["penerbit", 255, false],
      ["status", 32, false],
    ],
    integers: [["tahun", false]],
  },
  {
    id: "dosen_penelitian",
    name: "Penelitian Dosen",
    strings: [
      ["dosenId", 64, true],
      ["judul", 500, true],
      ["skema", 128, false],
      ["dana", 64, false],
      ["status", 32, false],
    ],
    integers: [["tahun", false]],
  },
  {
    id: "dosen_pkm",
    name: "Pengabdian Masyarakat Dosen",
    strings: [
      ["dosenId", 64, true],
      ["judul", 500, true],
      ["mitra", 255, false],
      ["dana", 64, false],
      ["status", 32, false],
    ],
    integers: [["tahun", false]],
  },
  {
    id: "dosen_rekognisi",
    name: "Rekognisi Dosen",
    strings: [
      ["dosenId", 64, true],
      ["nama", 500, true],
      ["penyelenggara", 255, false],
      ["tingkat", 64, false],
    ],
    integers: [["tahun", false]],
  },
  {
    id: "dosen_seminar",
    name: "Seminar & Webinar Dosen",
    strings: [
      ["dosenId", 64, true],
      ["judul", 500, true],
      ["peran", 64, false],
      ["penyelenggara", 255, false],
      ["tanggal", 32, false],
      ["jenis", 32, false],
    ],
  },
  {
    id: "dosen_mengajar",
    name: "Riwayat Mengajar Dosen",
    strings: [
      ["dosenId", 64, true],
      ["kodeMk", 32, true],
      ["namaMk", 255, true],
      ["tahunAkademik", 32, false],
      ["semester", 32, false],
    ],
    integers: [["sks", false]],
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

  for (const [key, size, required] of table.strings ?? []) {
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

  // Tabel anak selalu diindeks berdasarkan dosenId agar query cepat.
  const indexes = table.indexes ?? [["idx_dosenId", "key", ["dosenId"]]];

  for (const [key, type, columns] of indexes) {
    await waitForColumns(table.id, columns);
    await ensureIndex(`  index '${key}'`, () =>
      tablesDB.createIndex({
        databaseId: DATABASE_ID,
        tableId: table.id,
        key,
        type,
        columns,
      })
    );
  }
}

console.log("\nSelesai. Tabel dosen siap dipakai.");
