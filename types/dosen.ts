/** Status kepegawaian dosen sesuai kebutuhan borang akreditasi. */
export const STATUS_KEPEGAWAIAN = [
  "Tetap PT",
  "DLB",
  "Industri",
  "Asdos",
  "Honorer",
] as const;

export type StatusKepegawaian = (typeof STATUS_KEPEGAWAIAN)[number];

/** Jenjang pendidikan terakhir. */
export const JENJANG_PENDIDIKAN = ["S1", "S2", "S3"] as const;

export type JenjangPendidikan = (typeof JENJANG_PENDIDIKAN)[number];

/** Jabatan akademik/fungsional dosen. */
export const JABATAN_AKADEMIK = [
  "Tenaga Pengajar",
  "Asisten Ahli",
  "Lektor",
  "Lektor Kepala",
  "Guru Besar",
] as const;

export type JabatanAkademik = (typeof JABATAN_AKADEMIK)[number];

/** Data induk dosen. */
export interface Dosen {
  id: string;
  nama: string;
  nidn: string;
  email: string;
  jabatan: string | null;
  pendidikan: string | null;
  bidangKeahlian: string | null;
  prodi: string | null;
  status: string | null;
}

export type DosenFormInput = Omit<Dosen, "id">;

/** Publikasi ilmiah dosen. */
export interface DosenPublikasi {
  id: string;
  dosenId: string;
  judul: string;
  tahun: number | null;
  jenis: string | null;
  penerbit: string | null;
  status: string | null;
}

/** Hibah penelitian dosen. */
export interface DosenPenelitian {
  id: string;
  dosenId: string;
  judul: string;
  tahun: number | null;
  skema: string | null;
  dana: string | null;
  status: string | null;
}

/** Pengabdian kepada masyarakat (PKM). */
export interface DosenPkm {
  id: string;
  dosenId: string;
  judul: string;
  tahun: number | null;
  mitra: string | null;
  dana: string | null;
  status: string | null;
}

/** Rekognisi/penghargaan dosen. */
export interface DosenRekognisi {
  id: string;
  dosenId: string;
  nama: string;
  penyelenggara: string | null;
  tahun: number | null;
  tingkat: string | null;
}

/** Keterlibatan dosen pada seminar/webinar. */
export interface DosenSeminar {
  id: string;
  dosenId: string;
  judul: string;
  peran: string | null;
  penyelenggara: string | null;
  tanggal: string | null;
  jenis: string | null;
}

/** Riwayat mengajar dosen per semester. */
export interface DosenMengajar {
  id: string;
  dosenId: string;
  kodeMk: string;
  namaMk: string;
  sks: number | null;
  tahunAkademik: string | null;
  semester: string | null;
}

/** Rekap seluruh rekam jejak dosen untuk halaman profil. */
export interface DosenRekamJejak {
  publikasi: DosenPublikasi[];
  penelitian: DosenPenelitian[];
  pkm: DosenPkm[];
  rekognisi: DosenRekognisi[];
  seminar: DosenSeminar[];
  mengajar: DosenMengajar[];
}
