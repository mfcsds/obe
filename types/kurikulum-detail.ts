/**
 * Kategori capaian pembelajaran menurut SN-Dikti:
 * S = Sikap, P = Pengetahuan, KU = Keterampilan Umum, KK = Keterampilan Khusus
 */
export const KATEGORI_CAPAIAN = ["S", "P", "KU", "KK"] as const;

export type KategoriCapaian = (typeof KATEGORI_CAPAIAN)[number];

/** Label panjang untuk setiap kategori, dipakai di dropdown dan tooltip. */
export const KATEGORI_CAPAIAN_LABEL: Record<KategoriCapaian, string> = {
  S: "S - Sikap",
  P: "P - Pengetahuan",
  KU: "KU - Keterampilan Umum",
  KK: "KK - Keterampilan Khusus",
};

/**
 * Profil Lulusan (PL) milik satu kurikulum.
 *
 * Sengaja TIDAK memiliki field `kategori`: pembagian ranah S/P/KU/KK berlaku
 * untuk CPL, bukan untuk profil lulusan. Setiap profil lulusan pada praktiknya
 * menuntut keempat ranah sekaligus, sehingga memaksakan satu kategori justru
 * menyesatkan.
 */
export interface ProfilLulusan {
  id: string;
  kurikulumId: string;
  kode: string;
  deskripsi: string;
  profesi: string | null;
}

export type ProfilLulusanFormInput = Omit<ProfilLulusan, "id" | "kurikulumId">;

/** Capaian Pembelajaran Lulusan (CPL) milik satu kurikulum. */
export interface Cpl {
  id: string;
  kurikulumId: string;
  kode: string;
  deskripsi: string;
  kategori: KategoriCapaian;
}

export type CplFormInput = Omit<Cpl, "id" | "kurikulumId">;

/**
 * Capaian Pembelajaran Mata Kuliah (CPMK): turunan langsung dari satu CPL.
 * Kode CPMK mengikuti kode CPL induknya, mis. CPL01 -> CPMK011, CPMK012,
 * dst (dua digit nomor CPL diikuti nomor urut CPMK di dalamnya). Lihat
 * `lib/utils/kode-generator.ts` -> `buildNextCpmkKode`.
 */
export interface Cpmk {
  id: string;
  kurikulumId: string;
  /** CPL induk yang diturunkan menjadi CPMK ini. */
  cplId: string;
  kode: string;
  deskripsi: string;
}

export type CpmkFormInput = Omit<Cpmk, "id" | "kurikulumId" | "cplId">;

/** Bahan Kajian (BK) milik satu kurikulum. */
export interface BahanKajian {
  id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
  deskripsi: string | null;
}

export type BahanKajianFormInput = Omit<BahanKajian, "id" | "kurikulumId">;

/** Jenis mata kuliah dalam struktur kurikulum. */
export const JENIS_MATA_KULIAH = [
  "Wajib Prodi",
  "Pilihan Prodi",
  "Wajib Universitas",
  "MKWK",
] as const;

export type JenisMataKuliah = (typeof JENIS_MATA_KULIAH)[number];

/** Mata Kuliah (MK) milik satu kurikulum. */
export interface MataKuliah {
  id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  jenis: string | null;
}

export type MataKuliahFormInput = Omit<MataKuliah, "id" | "kurikulumId">;

/**
 * Kategori Teknik Penilaian CPMK, mis. "Partisipasi", "Unjuk Kerja",
 * "Tes Tulis (UTS)", "Presentasi". Dikelola per kurikulum sehingga setiap
 * kurikulum bisa memiliki daftar teknik penilaiannya sendiri, lalu dipetakan
 * ke CPMK mana yang bisa memakai teknik tersebut (lihat `JENIS_PEMETAAN.cpmkTeknikPenilaian`).
 */
export interface TeknikPenilaian {
  id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
}

export type TeknikPenilaianFormInput = Omit<TeknikPenilaian, "id" | "kurikulumId">;

/**
 * Kategori Instrumen Penilaian, mis. "Rubrik", "Soal Tes", "Observasi",
 * "Tugas", "Dokumen Proyek Akhir". Dikelola per kurikulum dan dapat
 * ditambah sendiri oleh kaprodi.
 */
export interface InstrumenPenilaian {
  id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
}

export type InstrumenPenilaianFormInput = Omit<InstrumenPenilaian, "id" | "kurikulumId">;

/**
 * Kategori Kriteria Penilaian, mis. "Sesuai Rubrik", "Ketepatan Menjawab
 * Soal", "Kedisiplinan". Dikelola per kurikulum dan dapat ditambah sendiri
 * oleh kaprodi.
 */
export interface KriteriaPenilaian {
  id: string;
  kurikulumId: string;
  kode: string;
  nama: string;
}

export type KriteriaPenilaianFormInput = Omit<KriteriaPenilaian, "id" | "kurikulumId">;

/**
 * Tahapan pelaksanaan penilaian dalam satu semester. Mengikuti struktur RPS
 * (Rencana Pembelajaran Semester) standar OBE, di mana penilaian tidak hanya
 * dilakukan di UTS/UAS tapi berjenjang dari awal hingga akhir semester,
 * mencerminkan prinsip *assessment for/as/of learning*: awal semester untuk
 * memastikan kesiapan mahasiswa, proses (formatif) untuk memantau kemajuan
 * belajar secara berkelanjutan, UTS/UAS sebagai penilaian tengah dan akhir
 * periode, dan sumatif akhir untuk mengukur pencapaian CPMK secara utuh
 * (mis. lewat proyek/tugas akhir). Nilai-nilai ini merupakan daftar tertutup
 * (bukan dapat ditambah pengguna) karena mencerminkan tahapan pedagogis baku,
 * berbeda dari Teknik/Instrumen/Kriteria Penilaian yang sifatnya spesifik
 * per mata kuliah dan dapat diperluas.
 */
export const TAHAPAN_PENILAIAN = [
  "Awal Semester (Diagnostik)",
  "Proses (Formatif)",
  "Tengah Semester (UTS)",
  "Akhir Semester (UAS)",
  "Akhir Pembelajaran (Sumatif)",
] as const;

export type TahapanPenilaian = (typeof TAHAPAN_PENILAIAN)[number];

/**
 * Satu baris rencana penilaian: menetapkan kapan (tahapan), dengan teknik
 * dan instrumen apa, berdasarkan kriteria apa, serta seberapa besar bobot
 * satu CPMK dinilai pada satu mata kuliah tertentu.
 *
 * CPL sengaja TIDAK disimpan di sini — selalu diturunkan dari `cpmkId`
 * (lihat `Cpmk.cplId`), karena setiap CPMK sudah pasti berasal dari satu CPL,
 * sehingga menyimpannya ulang di sini berisiko tidak sinkron bila CPMK
 * dipindah/diubah induknya.
 */
export interface RencanaPenilaian {
  id: string;
  kurikulumId: string;
  mataKuliahId: string;
  cpmkId: string;
  tahapan: TahapanPenilaian;
  teknikPenilaianId: string;
  instrumenPenilaianId: string;
  kriteriaPenilaianId: string;
  /** Bobot penilaian dalam persen (0-100). */
  bobot: number;
}

export type RencanaPenilaianFormInput = Omit<RencanaPenilaian, "id" | "kurikulumId">;

/**
 * Format kode otomatis untuk satu jenis mata kuliah pada satu kurikulum.
 *
 * Kode akhir dirakit sebagai: `${prefix}${urutan}${suffix}`, dengan `urutan`
 * dipadatkan menjadi angka bertitik nol sesuai `sequenceWidth`.
 *
 * Contoh: prefix "KK140", sequenceWidth 3, suffix "26" (dua digit tahun
 * kurikulum dibuat) -> mata kuliah ke-1 berkode "KK140" + "001" + "26"
 * = "KK14000126".
 *
 * Urutan TIDAK disimpan sebagai counter terpisah; selalu dihitung ulang dari
 * kode-kode bertipe sama yang sudah ada pada kurikulum, sehingga tidak
 * drift/bentrok bila ada mata kuliah yang dihapus
 * (lihat lib/utils/kode-generator.ts -> `buildJenisMataKuliahKode`).
 */
export interface MataKuliahKodeSetting {
  id: string;
  kurikulumId: string;
  jenis: string;
  prefix: string;
  suffix: string;
  sequenceWidth: number;
}

export type MataKuliahKodeSettingFormInput = Omit<
  MataKuliahKodeSetting,
  "id" | "kurikulumId"
>;

/**
 * Awalan bawaan per jenis mata kuliah, dipakai sebagai nilai awal saat
 * kaprodi belum pernah mengatur sendiri untuk kurikulum tersebut. Nilai
 * `suffix` bawaan sengaja kosong di sini karena diisi secara otomatis dari
 * dua digit terakhir tahun akademik kurikulum (lihat
 * `lib/actions/mk-kode-setting.actions.ts` -> `getDefaultKodeSetting`).
 */
export const DEFAULT_MK_KODE_PREFIX: Record<JenisMataKuliah, string> = {
  "Wajib Prodi": "KK140",
  "Pilihan Prodi": "KK140",
  "Wajib Universitas": "KU140",
  MKWK: "KU140",
};

export const DEFAULT_MK_KODE_SEQUENCE_WIDTH = 3;

/**
 * Jenis matriks pemetaan. Dipakai sebagai diskriminator pada tabel `pemetaan`
 * sehingga keempat matriks berbagi satu tabel dan satu alur CRUD.
 */
export const JENIS_PEMETAAN = {
  profilCpl: "profil_cpl",
  cplBk: "cpl_bk",
  bkMk: "bk_mk",
  mkCpl: "mk_cpl",
  /** Mata kuliah yang mendukung pencapaian satu CPMK tertentu. */
  cpmkMk: "cpmk_mk",
  /** Teknik penilaian yang boleh dipakai untuk mengukur satu CPMK tertentu. */
  cpmkTeknikPenilaian: "cpmk_teknik_penilaian",
} as const;

export type JenisPemetaan = (typeof JENIS_PEMETAAN)[keyof typeof JENIS_PEMETAAN];

/** Satu relasi pemetaan antara dua entitas kurikulum. */
export interface Pemetaan {
  id: string;
  kurikulumId: string;
  jenis: JenisPemetaan;
  sourceId: string;
  targetId: string;
}

/**
 * Pasangan relasi yang aktif, direpresentasikan sebagai himpunan string
 * `"sourceId:targetId"` agar pengecekan status checkbox di UI menjadi O(1).
 */
export type PemetaanKeySet = Set<string>;

/** Membentuk kunci gabungan untuk satu sel matriks. */
export function toPemetaanKey(sourceId: string, targetId: string): string {
  return `${sourceId}:${targetId}`;
}

/**
 * Menggabungkan dua ID menjadi satu ID komposit. Dipakai saat satu sisi
 * pemetaan sebenarnya merupakan PASANGAN dua entitas yang bersama-sama
 * membentuk satu baris, mis. pada matriks "Mata Kuliah + CPMK vs Teknik
 * Penilaian": satu baris = satu kombinasi (Mata Kuliah, CPMK), karena CPMK
 * yang sama bisa didukung beberapa mata kuliah dengan teknik penilaian
 * yang berbeda-beda di tiap mata kuliah.
 *
 * Delimiter "__" sengaja berbeda dari ":" yang dipakai `toPemetaanKey`,
 * agar tidak ambigu saat kunci ini nanti dijadikan `sourceId` pada
 * `toPemetaanKey` (yang sudah memakai ":").
 */
export function toCompositeId(a: string, b: string): string {
  return `${a}__${b}`;
}

/**
 * Memecah kunci `"sourceId:targetId"` kembali menjadi pasangan ID-nya.
 * Kebalikan dari `toPemetaanKey`. ID Appwrite tidak pernah mengandung ":",
 * sehingga pemisahan pada kemunculan pertama karakter tersebut selalu aman.
 */
export function fromPemetaanKey(key: string): [sourceId: string, targetId: string] {
  const separatorIndex = key.indexOf(":");
  return [key.slice(0, separatorIndex), key.slice(separatorIndex + 1)];
}

/**
 * Memecah ID komposit `"a__b"` kembali menjadi pasangannya. Kebalikan dari
 * `toCompositeId`. ID Appwrite tidak pernah mengandung "__", sehingga
 * pemisahan pada kemunculan pertama urutan tersebut selalu aman.
 */
export function fromCompositeId(compositeId: string): [a: string, b: string] {
  const separatorIndex = compositeId.indexOf("__");
  return [compositeId.slice(0, separatorIndex), compositeId.slice(separatorIndex + 2)];
}
