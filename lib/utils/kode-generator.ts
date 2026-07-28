/**
 * Utilitas murni (tanpa efek samping, aman dipakai di client) untuk
 * menyarankan kode berikutnya berdasarkan kode-kode yang sudah ada dalam
 * satu kurikulum, mis. "CPL01", "CPL02" -> saran berikutnya "CPL03".
 *
 * Dipakai sebagai NILAI AWAL pada form tambah data (Profil Lulusan, CPL,
 * Bahan Kajian, Mata Kuliah), bukan sebagai penguncian penuh — pengguna
 * tetap bisa mengubahnya, misalnya untuk menyesuaikan skema penomoran mata
 * kuliah institusi (contoh: "TIF101").
 */

const KODE_PATTERN = /^([A-Za-z][A-Za-z.\-]*)?(\d+)$/;

/**
 * Menghasilkan saran kode berikutnya.
 *
 * Algoritma: setiap kode dipecah menjadi (prefix huruf, angka di akhir).
 * Kode dikelompokkan per prefix, lalu prefix dengan angka tertinggi dianggap
 * sebagai seri penomoran yang sedang aktif dipakai. Angka pada prefix
 * tersebut dinaikkan satu, dengan jumlah digit dipertahankan sama seperti
 * kode acuan (misal "01" -> "02", "001" -> "002").
 *
 * @param existingCodes Kode-kode yang sudah ada pada kurikulum yang sama.
 * @param fallbackPrefix Prefix yang dipakai bila belum ada kode sama sekali,
 *                        atau bila kode yang ada tidak mengikuti pola huruf+angka.
 */
export function suggestNextKode(existingCodes: string[], fallbackPrefix: string): string {
  const groups = new Map<string, { max: number; width: number }>();

  for (const raw of existingCodes) {
    const match = raw.trim().toUpperCase().match(KODE_PATTERN);
    if (!match) continue;

    const prefix = match[1] ?? "";
    const digits = match[2];
    const value = Number(digits);

    const existing = groups.get(prefix);
    if (!existing || value > existing.max) {
      groups.set(prefix, { max: value, width: digits.length });
    }
  }

  if (groups.size === 0) {
    return `${fallbackPrefix}01`;
  }

  let bestPrefix = fallbackPrefix;
  let bestMax = -1;
  let bestWidth = 2;

  for (const [prefix, info] of groups) {
    if (info.max > bestMax) {
      bestPrefix = prefix || fallbackPrefix;
      bestMax = info.max;
      bestWidth = info.width;
    }
  }

  return `${bestPrefix}${String(bestMax + 1).padStart(bestWidth, "0")}`;
}

/**
 * Merakit kode CPMK otomatis berdasarkan kode CPL induknya.
 *
 * Format: `CPMK` + dua digit nomor CPL induk + nomor urut CPMK di dalam CPL
 * itu. Contoh: CPL induk berkode "CPL01" dan sudah punya 2 CPMK -> CPMK
 * berikutnya berkode "CPMK013" (nomor urut ke-3). Nomor urut dihitung dari
 * BANYAKNYA CPMK yang sudah ada untuk CPL yang sama (bukan counter
 * tersimpan), sehingga tidak drift bila ada CPMK yang dihapus — sama seperti
 * pola `buildNextJenisMataKuliahKode` di atas.
 *
 * @param cplKode Kode CPL induk, mis. "CPL01".
 * @param existingCpmkCountForCpl Banyaknya CPMK yang sudah ada untuk CPL ini.
 */
export function buildNextCpmkKode(
  cplKode: string,
  existingCpmkCountForCpl: number
): string {
  const nomorCpl = cplKode.trim().toUpperCase().match(/(\d+)$/)?.[1] ?? "00";
  const nomorUrutCpmk = existingCpmkCountForCpl + 1;
  return `CPMK${nomorCpl}${nomorUrutCpmk}`;
}

/**
 * Merakit kode mata kuliah otomatis berdasarkan setting format
 * (awalan/akhiran/lebar digit) satu jenis mata kuliah tertentu.
 *
 * Nomor urut dihitung dari BANYAKNYA kode yang sudah memakai kombinasi
 * prefix+suffix yang sama pada `existingCodesForJenis` (bukan dari counter
 * tersimpan), sehingga tidak drift bila ada data yang dihapus. Kode yang
 * sudah ada namun tidak cocok dengan format saat ini (mis. dibuat manual,
 * atau setting baru diubah) tetap dihitung sebagai satu slot terpakai agar
 * nomor urut yang disarankan tidak bertabrakan.
 *
 * @param existingCodesForJenis Kode-kode mata kuliah yang sudah ada UNTUK
 *                               JENIS YANG SAMA pada kurikulum yang sama.
 * @param setting Format kode: prefix, suffix, dan lebar digit urutan.
 */
export function buildNextJenisMataKuliahKode(
  existingCodesForJenis: string[],
  setting: { prefix: string; suffix: string; sequenceWidth: number }
): string {
  const nextSequence = existingCodesForJenis.length + 1;
  const sequenceText = String(nextSequence).padStart(setting.sequenceWidth, "0");
  return `${setting.prefix}${sequenceText}${setting.suffix}`;
}
