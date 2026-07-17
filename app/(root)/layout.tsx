import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { isRouteAllowedForRole } from "@/lib/access-control";
import ROUTES from "@/constant/routes";
import { DashboardShell } from "@/components/navigation/DashboardShell";

/**
 * Layout untuk seluruh halaman dashboard (/dashboard, /dosen, /mahasiswa,
 * dst). Ini adalah Server Component yang menjalankan validasi otentikasi
 * SESUNGGUHNYA (bukan hanya cek cookie seperti di middleware) sebelum
 * konten dirender.
 *
 * Middleware hanya redirect cepat berdasarkan keberadaan cookie (karena
 * berjalan di Edge Runtime yang tidak mendukung node-appwrite). Di sinilah
 * sesi divalidasi ke server Appwrite yang sesungguhnya - jika cookie ada
 * tapi sesi sudah expired/invalid, user tetap akan di-redirect ke sign-in
 * (OWASP A01: Broken Access Control tidak boleh hanya bersandar ke client
 * atau ke keberadaan cookie semata).
 */
const RootLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getLoggedInUser();

  if (!user) {
    redirect(ROUTES.SIGN_IN);
  }

  const pathname = (await headers()).get("x-pathname") ?? "";
  if (!isRouteAllowedForRole(pathname, user.role)) {
    redirect(ROUTES.HOME);
  }

  return (
    <DashboardShell userName={user.name} userRole={user.role}>
      {children}
    </DashboardShell>
  );
};

export default RootLayout;
