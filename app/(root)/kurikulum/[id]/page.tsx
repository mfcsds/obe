import { notFound } from "next/navigation";
import { getKurikulumDetail } from "@/lib/actions/kurikulum.actions";
import {
  getCplList,
  getCpmkList,
  getProfilLulusanList,
} from "@/lib/actions/kurikulum-detail.actions";
import {
  getBahanKajianList,
  getInstrumenPenilaianList,
  getKriteriaPenilaianList,
  getMataKuliahList,
  getTeknikPenilaianList,
} from "@/lib/actions/kurikulum-master.actions";
import { getMkKodeSettingList } from "@/lib/actions/mk-kode-setting.actions";
import { getPemetaanKeys } from "@/lib/actions/pemetaan.actions";
import { getRencanaPenilaianList } from "@/lib/actions/rencana-penilaian.actions";
import { getLoggedInUser } from "@/lib/appwrite/server";
import { KurikulumDetailView } from "@/components/kurikulum/KurikulumDetailView";
import { JENIS_PEMETAAN } from "@/types/kurikulum-detail";

interface KurikulumDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Halaman detail/pemetaan satu kurikulum. Server Component: mengambil
 * kurikulum beserta seluruh data anaknya (profil lulusan, CPL, bahan kajian,
 * mata kuliah, dan keempat matriks pemetaan) dari database.
 */
export default async function KurikulumDetailPage({ params }: KurikulumDetailPageProps) {
  const { id } = await params;

  const kurikulum = await getKurikulumDetail(id);
  if (!kurikulum) {
    notFound();
  }

  const [
    profilLulusanList,
    cplList,
    bahanKajianList,
    mataKuliahList,
    cpmkList,
    teknikPenilaianList,
    instrumenPenilaianList,
    kriteriaPenilaianList,
    rencanaPenilaianList,
    kodeSettingList,
    profilCpl,
    cplBk,
    bkMk,
    mkCpl,
    cpmkMk,
    cpmkTeknikPenilaian,
    user,
  ] = await Promise.all([
    getProfilLulusanList(id),
    getCplList(id),
    getBahanKajianList(id),
    getMataKuliahList(id),
    getCpmkList(id),
    getTeknikPenilaianList(id),
    getInstrumenPenilaianList(id),
    getKriteriaPenilaianList(id),
    getRencanaPenilaianList(id),
    getMkKodeSettingList(id),
    getPemetaanKeys(id, JENIS_PEMETAAN.profilCpl),
    getPemetaanKeys(id, JENIS_PEMETAAN.cplBk),
    getPemetaanKeys(id, JENIS_PEMETAAN.bkMk),
    getPemetaanKeys(id, JENIS_PEMETAAN.mkCpl),
    getPemetaanKeys(id, JENIS_PEMETAAN.cpmkMk),
    getPemetaanKeys(id, JENIS_PEMETAAN.cpmkTeknikPenilaian),
    getLoggedInUser(),
  ]);

  return (
    <KurikulumDetailView
      kurikulum={kurikulum}
      profilLulusanList={profilLulusanList}
      cplList={cplList}
      bahanKajianList={bahanKajianList}
      mataKuliahList={mataKuliahList}
      cpmkList={cpmkList}
      teknikPenilaianList={teknikPenilaianList}
      instrumenPenilaianList={instrumenPenilaianList}
      kriteriaPenilaianList={kriteriaPenilaianList}
      rencanaPenilaianList={rencanaPenilaianList}
      kodeSettingList={kodeSettingList}
      pemetaan={{ profilCpl, cplBk, bkMk, mkCpl, cpmkMk, cpmkTeknikPenilaian }}
      canManage={user?.role === "kaprodi"}
    />
  );
}
