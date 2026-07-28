// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { TABLES } from "@/lib/appwrite/tables";
import type { JenisPemetaan, Pemetaan } from "@/types/kurikulum-detail";

/**
 * Repository untuk seluruh matriks pemetaan kurikulum. Satu tabel `pemetaan`
 * dipakai bersama oleh keempat matriks (Profil↔CPL, CPL↔BK, BK↔MK, MK↔CPL),
 * dibedakan oleh kolom `jenis`.
 */

interface PemetaanRow {
  $id: string;
  kurikulumId: string;
  jenis: string;
  sourceId: string;
  targetId: string;
}

function mapRow(row: PemetaanRow): Pemetaan {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    jenis: row.jenis as JenisPemetaan,
    sourceId: row.sourceId,
    targetId: row.targetId,
  };
}

/** Mengambil seluruh relasi satu jenis matriks pada satu kurikulum. */
export async function listPemetaan(
  kurikulumId: string,
  jenis: JenisPemetaan
): Promise<Pemetaan[]> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.pemetaan,
    queries: [
      Query.equal("kurikulumId", kurikulumId),
      Query.equal("jenis", jenis),
      Query.limit(2000),
    ],
  });

  return (result.rows as unknown as PemetaanRow[]).map(mapRow);
}

/** Mencari satu relasi spesifik; `null` bila belum ada. */
async function findPemetaan(
  kurikulumId: string,
  jenis: JenisPemetaan,
  sourceId: string,
  targetId: string
): Promise<Pemetaan | null> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLES.pemetaan,
    queries: [
      Query.equal("kurikulumId", kurikulumId),
      Query.equal("jenis", jenis),
      Query.equal("sourceId", sourceId),
      Query.equal("targetId", targetId),
      Query.limit(1),
    ],
  });

  const rows = result.rows as unknown as PemetaanRow[];
  return rows.length > 0 ? mapRow(rows[0]) : null;
}

/**
 * Mengaktifkan/menonaktifkan satu sel matriks. Mengembalikan status akhir
 * (`true` = relasi aktif) supaya UI bisa menyelaraskan tampilannya.
 *
 * Operasi ini idempotent terhadap state yang diminta: bila `aktif` sama dengan
 * kondisi saat ini, tidak ada perubahan di database.
 */
export async function setPemetaan(
  kurikulumId: string,
  jenis: JenisPemetaan,
  sourceId: string,
  targetId: string,
  aktif: boolean
): Promise<boolean> {
  const { tablesDB } = await createAdminClient();
  const existing = await findPemetaan(kurikulumId, jenis, sourceId, targetId);

  if (aktif && !existing) {
    await tablesDB.createRow({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLES.pemetaan,
      rowId: ID.unique(),
      data: { kurikulumId, jenis, sourceId, targetId },
    });
    return true;
  }

  if (!aktif && existing) {
    await tablesDB.deleteRow({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLES.pemetaan,
      rowId: existing.id,
    });
    return false;
  }

  return aktif;
}

/**
 * Menghapus seluruh relasi yang menyangkut satu entitas, dipakai saat entitas
 * (CPL, bahan kajian, mata kuliah, profil lulusan) dihapus agar tidak
 * meninggalkan pemetaan orphan.
 */
export async function deletePemetaanByEntity(
  kurikulumId: string,
  entityId: string
): Promise<void> {
  const { tablesDB } = await createAdminClient();

  const [asSource, asTarget] = await Promise.all([
    tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLES.pemetaan,
      queries: [
        Query.equal("kurikulumId", kurikulumId),
        Query.equal("sourceId", entityId),
        Query.limit(500),
      ],
    }),
    tablesDB.listRows({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLES.pemetaan,
      queries: [
        Query.equal("kurikulumId", kurikulumId),
        Query.equal("targetId", entityId),
        Query.limit(500),
      ],
    }),
  ]);

  const rows = [
    ...(asSource.rows as unknown as PemetaanRow[]),
    ...(asTarget.rows as unknown as PemetaanRow[]),
  ];

  await Promise.all(
    rows.map((row) =>
      tablesDB.deleteRow({
        databaseId: appwriteConfig.databaseId,
        tableId: TABLES.pemetaan,
        rowId: row.$id,
      })
    )
  );
}
