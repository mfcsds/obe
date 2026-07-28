/** Status aktif/non-aktif sebuah kurikulum. */
export const KURIKULUM_STATUS = ["Aktif", "Non Aktif"] as const;

export type KurikulumStatus = (typeof KURIKULUM_STATUS)[number];

/**
 * Tipe domain kurikulum yang dipakai lintas lapisan (repository, action,
 * komponen). Sengaja tidak memakai field bawaan Appwrite (`$id`, `$createdAt`)
 * agar lapisan UI tidak terikat pada bentuk data SDK.
 *
 * Field `semesterMulai`, `totalSKS`, `jumlahCPL`, `jumlahCPMK`, dan `jumlahMK`
 * adalah DATA TURUNAN: nilainya tidak diisi manual lewat form, melainkan
 * terakumulasi seiring pengisian susunan mata kuliah, CPL, dan CPMK di
 * halaman detail kurikulum.
 */
export interface Kurikulum {
  id: string;
  nama: string;
  tahunAkademik: string;
  semesterMulai: string | null;
  totalSKS: number;
  jumlahCPL: number;
  jumlahCPMK: number;
  jumlahMK: number;
  status: KurikulumStatus;
}

/**
 * Field kurikulum yang boleh diisi/diubah pengguna lewat form. Data turunan
 * sengaja tidak termasuk agar tidak bisa ditimpa manual dari client.
 */
export interface KurikulumFormInput {
  nama: string;
  tahunAkademik: string;
  status: KurikulumStatus;
}
