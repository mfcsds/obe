import { notFound } from "next/navigation";
import {
  getDosenDetail,
  getDosenRekamJejakDetail,
} from "@/lib/actions/dosen.actions";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { DosenProfilView } from "@/components/dosen/DosenProfilView";

interface DosenProfilPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman profil dosen. Server Component: mengambil data dosen beserta
 * seluruh rekam jejaknya dari database, lalu menampilkan 404 bila dosen
 * tidak ditemukan.
 */
export default async function DosenProfilPage({ params }: DosenProfilPageProps) {
  const { id } = await params;

  const dosen = await getDosenDetail(id);
  if (!dosen) {
    notFound();
  }

  const [rekamJejak, user] = await Promise.all([
    getDosenRekamJejakDetail(id),
    getLoggedInUser(),
  ]);

  return (
    <DosenProfilView
      dosen={dosen}
      rekamJejak={rekamJejak}
      canManage={user?.role === "kaprodi"}
    />
  );
}
