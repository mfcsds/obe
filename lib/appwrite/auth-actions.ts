"use server";

import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminClient, createSessionClient } from "./server";
import { APPWRITE_SESSION_COOKIE } from "./config";
import ROUTES from "@/constant/routes";
import type { Role } from "@/types/role";

/** Bentuk hasil server action, dipakai form client untuk menampilkan pesan. */
export type AuthActionResult = { error: string } | { error: null };

/** Mengekstrak pesan error yang aman ditampilkan ke user dari unknown error. */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Terjadi kesalahan. Silakan coba lagi.";
}

/**
 * Menyimpan secret session Appwrite ke cookie httpOnly. Dipanggil setelah
 * sign-in/sign-up/OAuth callback berhasil membuat sesi baru.
 *
 * httpOnly + secure + sameSite=strict mencegah pencurian cookie lewat XSS
 * dan mitigasi CSRF (OWASP A07: Identification & Authentication Failures).
 */
async function persistSessionCookie(sessionSecret: string) {
  const cookieStore = await cookies();
  cookieStore.set(APPWRITE_SESSION_COOKIE, sessionSecret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

/**
 * Login dengan email + password. Membuat sesi baru lewat admin client
 * (karena belum ada sesi user), lalu menyimpannya sebagai cookie.
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthActionResult> {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession({
      email,
      password,
    });

    await persistSessionCookie(session.secret);
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Registrasi user baru dengan email + password, lalu langsung membuat
 * sesi (auto sign-in) supaya user tidak perlu login manual setelah daftar.
 * Role default diset ke "mahasiswa" lewat user label — kaprodi/dosen
 * dinaikkan rolenya secara manual melalui Appwrite Console atau admin tool.
 */
export async function signUpWithEmail(
  name: string,
  email: string,
  password: string,
  role: Role = "mahasiswa"
): Promise<AuthActionResult> {
  try {
    const { account, users } = await createAdminClient();
    const userId = ID.unique();

    await account.create({ userId, email, password, name });
    await users.updateLabels({ userId, labels: [role] });

    const session = await account.createEmailPasswordSession({
      email,
      password,
    });
    await persistSessionCookie(session.secret);

    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/** Menghapus sesi Appwrite (server + cookie) dan redirect ke halaman login. */
export async function signOutAction() {
  try {
    const { account } = await createSessionClient();
    await account.deleteSession({ sessionId: "current" });
  } catch {
    // Sesi mungkin sudah tidak valid di server; lanjut hapus cookie lokal.
  }

  const cookieStore = await cookies();
  cookieStore.delete(APPWRITE_SESSION_COOKIE);
  redirect(ROUTES.SIGN_IN);
}
