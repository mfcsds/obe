/**
 * ID tabel Appwrite yang dipakai aplikasi. Dikumpulkan di satu file agar
 * tidak ada string nama tabel yang tersebar dan berisiko salah ketik.
 *
 * Sengaja TIDAK memakai directive "use server": file dengan directive itu
 * hanya boleh mengekspor async function, sedangkan ini konstanta biasa.
 */
export const TABLES = {
  kurikulum: "kurikulum",
  profilLulusan: "profil_lulusan",
  cpl: "cpl",
  cpmk: "cpmk",
  teknikPenilaian: "teknik_penilaian",
  instrumenPenilaian: "instrumen_penilaian",
  kriteriaPenilaian: "kriteria_penilaian",
  rencanaPenilaian: "rencana_penilaian",
  bahanKajian: "bahan_kajian",
  mataKuliah: "mata_kuliah",
  mkKodeSetting: "mk_kode_setting",
  pemetaan: "pemetaan",
  dosen: "dosen",
  dosenPublikasi: "dosen_publikasi",
  dosenPenelitian: "dosen_penelitian",
  dosenPkm: "dosen_pkm",
  dosenRekognisi: "dosen_rekognisi",
  dosenSeminar: "dosen_seminar",
  dosenMengajar: "dosen_mengajar",
} as const;
