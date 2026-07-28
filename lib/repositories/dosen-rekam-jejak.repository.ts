// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { TABLES } from "@/lib/appwrite/tables";
import { listChildRows } from "./child-rows.repository";
import type {
  DosenMengajar,
  DosenPenelitian,
  DosenPkm,
  DosenPublikasi,
  DosenRekamJejak,
  DosenRekognisi,
  DosenSeminar,
} from "@/types/dosen";

/**
 * Repository untuk rekam jejak dosen (publikasi, penelitian, PKM, rekognisi,
 * seminar, riwayat mengajar). Operasi tulisnya memakai helper generik
 * `child-rows.repository`, jadi di sini fokusnya pada query + mapping.
 */

/** Normalisasi field opsional: `undefined` dari SDK menjadi `null`. */
function nullable<T>(value: T | undefined | null): T | null {
  return value ?? null;
}

/** Mengambil seluruh rekam jejak dosen sekaligus untuk halaman profil. */
export async function getDosenRekamJejak(dosenId: string): Promise<DosenRekamJejak> {
  const [publikasi, penelitian, pkm, rekognisi, seminar, mengajar] = await Promise.all([
    listChildRows<Record<string, never>>(TABLES.dosenPublikasi, "dosenId", dosenId, {
      orderByDesc: "tahun",
    }),
    listChildRows<Record<string, never>>(TABLES.dosenPenelitian, "dosenId", dosenId, {
      orderByDesc: "tahun",
    }),
    listChildRows<Record<string, never>>(TABLES.dosenPkm, "dosenId", dosenId, {
      orderByDesc: "tahun",
    }),
    listChildRows<Record<string, never>>(TABLES.dosenRekognisi, "dosenId", dosenId, {
      orderByDesc: "tahun",
    }),
    listChildRows<Record<string, never>>(TABLES.dosenSeminar, "dosenId", dosenId, {
      orderByDesc: "tanggal",
    }),
    listChildRows<Record<string, never>>(TABLES.dosenMengajar, "dosenId", dosenId, {
      orderByAsc: "kodeMk",
    }),
  ]);

  return {
    publikasi: (publikasi as unknown as RawRow[]).map(mapPublikasi),
    penelitian: (penelitian as unknown as RawRow[]).map(mapPenelitian),
    pkm: (pkm as unknown as RawRow[]).map(mapPkm),
    rekognisi: (rekognisi as unknown as RawRow[]).map(mapRekognisi),
    seminar: (seminar as unknown as RawRow[]).map(mapSeminar),
    mengajar: (mengajar as unknown as RawRow[]).map(mapMengajar),
  };
}

/** Bentuk mentah row Appwrite sebelum dipetakan ke tipe domain. */
type RawRow = Record<string, string | number | null | undefined> & {
  $id: string;
  dosenId: string;
};

function mapPublikasi(row: RawRow): DosenPublikasi {
  return {
    id: row.$id,
    dosenId: row.dosenId,
    judul: String(row.judul ?? ""),
    tahun: nullable(row.tahun as number | null),
    jenis: nullable(row.jenis as string | null),
    penerbit: nullable(row.penerbit as string | null),
    status: nullable(row.status as string | null),
  };
}

function mapPenelitian(row: RawRow): DosenPenelitian {
  return {
    id: row.$id,
    dosenId: row.dosenId,
    judul: String(row.judul ?? ""),
    tahun: nullable(row.tahun as number | null),
    skema: nullable(row.skema as string | null),
    dana: nullable(row.dana as string | null),
    status: nullable(row.status as string | null),
  };
}

function mapPkm(row: RawRow): DosenPkm {
  return {
    id: row.$id,
    dosenId: row.dosenId,
    judul: String(row.judul ?? ""),
    tahun: nullable(row.tahun as number | null),
    mitra: nullable(row.mitra as string | null),
    dana: nullable(row.dana as string | null),
    status: nullable(row.status as string | null),
  };
}

function mapRekognisi(row: RawRow): DosenRekognisi {
  return {
    id: row.$id,
    dosenId: row.dosenId,
    nama: String(row.nama ?? ""),
    penyelenggara: nullable(row.penyelenggara as string | null),
    tahun: nullable(row.tahun as number | null),
    tingkat: nullable(row.tingkat as string | null),
  };
}

function mapSeminar(row: RawRow): DosenSeminar {
  return {
    id: row.$id,
    dosenId: row.dosenId,
    judul: String(row.judul ?? ""),
    peran: nullable(row.peran as string | null),
    penyelenggara: nullable(row.penyelenggara as string | null),
    tanggal: nullable(row.tanggal as string | null),
    jenis: nullable(row.jenis as string | null),
  };
}

function mapMengajar(row: RawRow): DosenMengajar {
  return {
    id: row.$id,
    dosenId: row.dosenId,
    kodeMk: String(row.kodeMk ?? ""),
    namaMk: String(row.namaMk ?? ""),
    sks: nullable(row.sks as number | null),
    tahunAkademik: nullable(row.tahunAkademik as string | null),
    semester: nullable(row.semester as string | null),
  };
}
