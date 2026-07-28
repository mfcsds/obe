/**
 * Seed script untuk membuat akun awal di Appwrite beserta role-nya
 * (disimpan sebagai user label), menggantikan mock user yang dulu ada di
 * lib/mock-users.ts.
 *
 * Cara pakai:
 *   1. Pastikan project Appwrite tidak dalam status paused.
 *   2. Set password lewat environment variable (JANGAN hardcode di file ini
 *      supaya tidak ikut ter-commit - lihat steering security-owasp.md):
 *        SEED_PASSWORD='PasswordKuat123!' node --env-file=.env.local scripts/seed-users.mjs
 *
 * Script ini idempotent: user yang sudah ada akan dilewati, bukan error.
 */
import { Client, Users, ID } from "node-appwrite";

const SEED_PASSWORD = process.env.SEED_PASSWORD;

if (!SEED_PASSWORD || SEED_PASSWORD.length < 8) {
  console.error(
    "SEED_PASSWORD wajib diisi (minimal 8 karakter).\n" +
      "Contoh: SEED_PASSWORD='PasswordKuat123!' node --env-file=.env.local scripts/seed-users.mjs"
  );
  process.exit(1);
}

/** Akun awal per role. Email memakai domain kampus agar konsisten. */
const SEED_USERS = [
  { name: "Kepala Program Studi", email: "kaprodi@yarsi.ac.id", role: "kaprodi" },
  { name: "Dosen Pengajar", email: "dosen@yarsi.ac.id", role: "dosen" },
  { name: "Mahasiswa", email: "mahasiswa@yarsi.ac.id", role: "mahasiswa" },
];

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const users = new Users(client);

for (const seed of SEED_USERS) {
  try {
    const created = await users.create({
      userId: ID.unique(),
      email: seed.email,
      password: SEED_PASSWORD,
      name: seed.name,
    });

    await users.updateLabels({ userId: created.$id, labels: [seed.role] });
    console.log(`✓ Dibuat: ${seed.email} (role: ${seed.role})`);
  } catch (error) {
    if (error.type === "user_already_exists") {
      console.log(`- Dilewati (sudah ada): ${seed.email}`);
      continue;
    }
    console.error(`✗ Gagal membuat ${seed.email}: ${error.message}`);
  }
}
