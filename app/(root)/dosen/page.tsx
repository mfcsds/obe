import { getDosenList } from "@/lib/actions/dosen.actions";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { DosenView } from "@/components/dosen/DosenView";

/**
 * Halaman daftar dosen. Server Component: mengambil data dari database lalu
 * meneruskannya ke komponen interaktif.
 *
 * Tidak mengimpor komponen MUI di sini — barrel import `@mui/material` dari
 * Server Component memicu error resolusi saat build.
 */
export default async function DosenPage() {
  const [dosenList, user] = await Promise.all([getDosenList(), getLoggedInUser()]);

  return <DosenView dosenList={dosenList} canManage={user?.role === "kaprodi"} />;
}
