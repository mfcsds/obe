/**
 * Seed data kurikulum awal (memindahkan data mock lama ke database).
 * Idempotent: dilewati bila sudah ada baris dengan nama yang sama.
 *
 * Jalankan: node --env-file=.env.local scripts/seed-kurikulum.mjs
 */
import { Client, TablesDB, ID, Query } from "node-appwrite";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
const TABLE_ID = "kurikulum";

const SEED_DATA = [
  {
    nama: "Kurikulum OBE 2024",
    tahunAkademik: "2024/2025",
    semesterMulai: "Ganjil 2024",
    totalSKS: 144,
    jumlahCPL: 12,
    jumlahCPMK: 85,
    jumlahMK: 48,
    status: "Aktif",
  },
  {
    nama: "Kurikulum OBE 2020",
    tahunAkademik: "2020/2021",
    semesterMulai: "Ganjil 2020",
    totalSKS: 144,
    jumlahCPL: 10,
    jumlahCPMK: 75,
    jumlahMK: 45,
    status: "Non Aktif",
  },
  {
    nama: "Kurikulum OBE 2018",
    tahunAkademik: "2018/2019",
    semesterMulai: "Ganjil 2018",
    totalSKS: 144,
    jumlahCPL: 9,
    jumlahCPMK: 70,
    jumlahMK: 42,
    status: "Non Aktif",
  },
];

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const tablesDB = new TablesDB(client);

for (const data of SEED_DATA) {
  const existing = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [Query.equal("nama", data.nama)],
  });

  if (existing.total > 0) {
    console.log(`- Dilewati (sudah ada): ${data.nama}`);
    continue;
  }

  await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data,
  });
  console.log(`✓ Dibuat: ${data.nama}`);
}

console.log("\nSeed kurikulum selesai.");
