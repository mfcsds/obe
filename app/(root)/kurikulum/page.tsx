import { getKurikulumList } from "@/lib/actions/kurikulum.actions";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { KurikulumView } from "@/components/kurikulum/KurikulumView";

/**
 * Halaman daftar kurikulum. Server Component: mengambil data dari database
 * di server lalu meneruskannya ke komponen interaktif sebagai props.
 *
 * Sengaja TIDAK mengimpor komponen MUI di sini. Barrel import `@mui/material`
 * dari Server Component memicu error resolusi `unstable_createUseMediaQuery`
 * saat build, jadi seluruh markup MUI ditangani oleh komponen client.
 *
 * `canManage` dihitung di server berdasarkan role, dipakai komponen client
 * hanya untuk menyembunyikan kontrol. Penegakan izin yang sesungguhnya ada
 * di server action (lib/actions/kurikulum.actions.ts).
 */
export default async function KurikulumPage() {
  const [kurikulumList, user] = await Promise.all([
    getKurikulumList(),
    getLoggedInUser(),
  ]);

  const canManage = user?.role === "kaprodi";

  return <KurikulumView kurikulumList={kurikulumList} canManage={canManage} />;
}
