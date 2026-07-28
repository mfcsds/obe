/**
 * Membuat tabel `pemetaan` — satu tabel generik untuk SEMUA matriks pemetaan
 * kurikulum (Profil↔CPL, CPL↔BK, BK↔MK, MK↔CPL).
 *
 * Alasan desain: keempat matriks punya bentuk data identik (relasi many-to-many
 * antara dua entitas dalam satu kurikulum). Memakai satu tabel dengan kolom
 * diskriminator `jenis` jauh lebih ringkas daripada 4 tabel terpisah, dan
 * memungkinkan satu komponen UI + satu server action melayani semuanya.
 *
 * Struktur: kurikulumId | jenis | sourceId | targetId
 *
 * Jalankan: node --env-file=.env.local scripts/setup-pemetaan-table.mjs
 */
import { Client, TablesDB } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "pemetaan";

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

/** Menunggu kolom selesai diproses Appwrite sebelum index dibuat. */
async function waitForColumns(columnKeys, maxAttempts = 40) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const result = await tablesDB.listColumns({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
    });
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
  throw new Error(`Kolom ${columnKeys.join(", ")} belum siap.`);
}

await ensure(`Tabel '${TABLE_ID}'`, () =>
  tablesDB.createTable({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    name: "Pemetaan Kurikulum",
  })
);

const columns = [
  ["kurikulumId", 64],
  ["jenis", 32],
  ["sourceId", 64],
  ["targetId", 64],
];

for (const [key, size] of columns) {
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

await waitForColumns(columns.map(([key]) => key));

// Index gabungan: query utama selalu "ambil pemetaan jenis X milik kurikulum Y".
await ensure("  index 'idx_kurikulum_jenis'", () =>
  tablesDB.createIndex({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    key: "idx_kurikulum_jenis",
    type: "key",
    columns: ["kurikulumId", "jenis"],
  })
);

console.log("\nSelesai. Tabel pemetaan siap dipakai.");
