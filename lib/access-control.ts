import type { Role } from "@/types/role";

/**
 * Aturan akses per-prefix path. Ini adalah single source of truth untuk
 * otorisasi berbasis role di level server (middleware). UI (misalnya
 * MuiSidebar) boleh punya aturan tampilan menu yang lebih detail, tapi
 * keputusan akses yang sesungguhnya harus selalu merujuk ke sini supaya
 * tidak ada halaman yang hanya "disembunyikan" di client tanpa proteksi
 * nyata di server (OWASP A01 - Broken Access Control).
 *
 * Urutan tidak masalah karena pencocokan diambil dari prefix TERPANJANG
 * yang match, bukan urutan array.
 */
const ROUTE_ACCESS_RULES: Array<{ pathPrefix: string; roles: Role[] }> = [
  { pathPrefix: "/dashboard", roles: ["kaprodi", "dosen", "mahasiswa"] },
  { pathPrefix: "/kurikulum", roles: ["kaprodi", "dosen", "mahasiswa"] },
  { pathPrefix: "/dosen", roles: ["kaprodi", "dosen", "mahasiswa"] },
  { pathPrefix: "/mahasiswa", roles: ["kaprodi", "dosen"] },
  { pathPrefix: "/alumni", roles: ["kaprodi"] },
];

/**
 * Mencari aturan akses yang paling spesifik untuk sebuah path, dengan
 * memilih pathPrefix terpanjang yang cocok. Mengembalikan `null` jika
 * path tidak punya aturan khusus (artinya: semua user yang sudah login
 * boleh mengakses, tidak ada batasan role tambahan).
 */
function findMatchingRule(pathname: string) {
  const matchingRules = ROUTE_ACCESS_RULES.filter((rule) =>
    pathname.startsWith(rule.pathPrefix)
  );

  if (matchingRules.length === 0) {
    return null;
  }

  return matchingRules.reduce((mostSpecific, current) =>
    current.pathPrefix.length > mostSpecific.pathPrefix.length
      ? current
      : mostSpecific
  );
}

/**
 * Mengecek apakah sebuah role diperbolehkan mengakses path tertentu.
 * Dipakai di middleware sebagai penegakan otorisasi sisi server.
 *
 * - Jika path tidak punya aturan khusus di ROUTE_ACCESS_RULES, akses
 *   diizinkan (hanya butuh login, tidak butuh role tertentu).
 * - Jika path punya aturan tapi role tidak diketahui/kosong, akses ditolak.
 */
export function isRouteAllowedForRole(
  pathname: string,
  role: string | undefined
): boolean {
  const rule = findMatchingRule(pathname);

  if (!rule) {
    return true;
  }

  if (!role) {
    return false;
  }

  return rule.roles.includes(role as Role);
}
