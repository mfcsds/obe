"use server";

import { Client, Account, Users } from "node-appwrite";
import { cookies } from "next/headers";
import { appwriteConfig, APPWRITE_SESSION_COOKIE } from "./config";
import type { Role } from "@/types/role";

/**
 * Membuat Appwrite client yang terikat pada sesi user yang sedang login
 * (dibaca dari cookie httpOnly). Dipakai untuk operasi atas nama user itu
 * sendiri (get profile, logout, dll).
 *
 * Melempar error jika tidak ada sesi aktif, agar caller wajib menangani
 * kasus "belum login" secara eksplisit.
 */
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const cookieStore = await cookies();
  const session = cookieStore.get(APPWRITE_SESSION_COOKIE);

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

/**
 * Membuat Appwrite client dengan hak admin (API key server-only). WAJIB
 * hanya dipanggil dari server action/route handler, tidak pernah dari
 * client component, karena API key ini punya akses penuh (create user,
 * create session, update label/role).
 *
 * Setiap panggilan membuat instance Client baru (bukan singleton) untuk
 * mencegah kebocoran state antar request yang berbeda pengguna.
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.apiKey);

  return {
    get account() {
      return new Account(client);
    },
    get users() {
      return new Users(client);
    },
  };
}

/**
 * Mengambil data user yang sedang login beserta role-nya (dari Appwrite
 * label). Mengembalikan `null` jika belum login, tidak melempar error,
 * sehingga aman dipanggil langsung dari Server Component untuk keperluan
 * render kondisional.
 */
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    const role = extractRoleFromLabels(user.labels);

    return {
      id: user.$id,
      name: user.name,
      email: user.email,
      role,
    };
  } catch {
    return null;
  }
}

/**
 * Role disimpan sebagai Appwrite user label (misalnya "kaprodi"). Fungsi
 * ini mengambil label pertama yang cocok dengan salah satu Role yang valid,
 * agar label lain (jika ada di masa depan) tidak mengacaukan penentuan role.
 */
function extractRoleFromLabels(labels: string[]): Role | undefined {
  const validRoles: Role[] = ["kaprodi", "dosen", "mahasiswa"];
  return labels.find((label): label is Role =>
    validRoles.includes(label as Role)
  );
}
