// Modul ini hanya boleh dieksekusi di server. Memakai `server-only` alih-alih
// directive "use server" karena directive tersebut akan mengekspos setiap
// fungsi yang diekspor sebagai endpoint HTTP yang bisa dipanggil dari browser
// tanpa melewati pengecekan otorisasi di lapisan action (OWASP A01).
import "server-only";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite/server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { TABLES } from "@/lib/appwrite/tables";
import type {
  MataKuliahKodeSetting,
  MataKuliahKodeSettingFormInput,
} from "@/types/kurikulum-detail";

const TABLE_ID = TABLES.mkKodeSetting;

interface MkKodeSettingRow {
  $id: string;
  kurikulumId: string;
  jenis: string;
  prefix: string;
  suffix: string;
  sequenceWidth: number;
}

function mapRow(row: MkKodeSettingRow): MataKuliahKodeSetting {
  return {
    id: row.$id,
    kurikulumId: row.kurikulumId,
    jenis: row.jenis,
    prefix: row.prefix,
    suffix: row.suffix,
    sequenceWidth: row.sequenceWidth,
  };
}

/** Mengambil seluruh setting kode yang sudah diatur untuk satu kurikulum. */
export async function listMkKodeSetting(
  kurikulumId: string
): Promise<MataKuliahKodeSetting[]> {
  const { tablesDB } = await createAdminClient();

  const result = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    queries: [Query.equal("kurikulumId", kurikulumId), Query.limit(20)],
  });

  return (result.rows as unknown as MkKodeSettingRow[]).map(mapRow);
}

/**
 * Menyimpan setting kode untuk satu jenis mata kuliah pada satu kurikulum.
 * Upsert: bila setting untuk jenis tersebut sudah ada, diperbarui; bila
 * belum, dibuat baru. Kombinasi (kurikulumId, jenis) bersifat unik secara
 * logis meski tidak diberi unique index di Appwrite (dicek manual di sini).
 */
export async function upsertMkKodeSetting(
  kurikulumId: string,
  input: MataKuliahKodeSettingFormInput
): Promise<MataKuliahKodeSetting> {
  const { tablesDB } = await createAdminClient();

  const existing = await tablesDB.listRows({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    queries: [
      Query.equal("kurikulumId", kurikulumId),
      Query.equal("jenis", input.jenis),
      Query.limit(1),
    ],
  });

  const rows = existing.rows as unknown as MkKodeSettingRow[];

  if (rows.length > 0) {
    const row = await tablesDB.updateRow({
      databaseId: appwriteConfig.databaseId,
      tableId: TABLE_ID,
      rowId: rows[0].$id,
      data: input,
    });
    return mapRow(row as unknown as MkKodeSettingRow);
  }

  const row = await tablesDB.createRow({
    databaseId: appwriteConfig.databaseId,
    tableId: TABLE_ID,
    rowId: ID.unique(),
    data: { ...input, kurikulumId },
  });
  return mapRow(row as unknown as MkKodeSettingRow);
}
