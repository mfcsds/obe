/**
 * Daftar role yang dikenal aplikasi. Dijadikan satu sumber kebenaran
 * (single source of truth) agar tidak ada string role yang salah ketik
 * tersebar di berbagai file (mock-users, sidebar, access-control, dll).
 */
export const ROLES = ["kaprodi", "dosen", "mahasiswa"] as const;

export type Role = (typeof ROLES)[number];
