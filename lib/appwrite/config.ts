/**
 * Konfigurasi terpusat untuk koneksi ke Appwrite. Semua nilai diambil dari
 * environment variable (.env.local) — jangan hardcode endpoint/project ID
 * di file lain (OWASP A05: Security Misconfiguration).
 *
 * - NEXT_PUBLIC_* boleh diakses dari client karena bukan rahasia (endpoint
 *   dan project ID bersifat publik, ini juga yang dipakai browser untuk
 *   konek ke Appwrite Cloud).
 * - APPWRITE_API_KEY TIDAK boleh diberi prefix NEXT_PUBLIC_ karena ini
 *   adalah secret server-only dengan hak admin (users.write, sessions.write).
 * - APPWRITE_DATABASE_ID dipakai saat mengakses TablesDB (data dosen,
 *   mahasiswa, kurikulum, dll) yang akan dibangun di iterasi selanjutnya.
 */
export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  apiKey: process.env.APPWRITE_API_KEY ?? "",
  databaseId: process.env.APPWRITE_DATABASE_ID ?? "",
};

/** Nama cookie session Appwrite yang disimpan di browser (httpOnly). */
export const APPWRITE_SESSION_COOKIE = "appwrite-session";
