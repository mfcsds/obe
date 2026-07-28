"use client";

import { useMemo } from "react";
import { Box, Divider } from "@mui/material";
import { CrudTabSection } from "@/components/kurikulum/CrudTabSection";
import {
  CpmkTeknikPenilaianMatrix,
  type CpmkMataKuliahRow,
} from "@/components/kurikulum/CpmkTeknikPenilaianMatrix";
import type { DataTableColumn } from "@/components/common/DataTable";
import {
  createTeknikPenilaianAction,
  deleteTeknikPenilaianAction,
  updateTeknikPenilaianAction,
} from "@/lib/actions/kurikulum-master.actions";
import { suggestNextKode } from "@/lib/utils/kode-generator";
import {
  JENIS_PEMETAAN,
  toCompositeId,
  toPemetaanKey,
  type Cpmk,
  type MataKuliah,
  type TeknikPenilaian,
} from "@/types/kurikulum-detail";

interface TeknikPenilaianTabProps {
  kurikulumId: string;
  cpmkList: Cpmk[];
  mataKuliahList: MataKuliah[];
  teknikPenilaianList: TeknikPenilaian[];
  /** Kunci pemetaan CPMK→Mata Kuliah yang aktif (menentukan mata kuliah pendukung setiap CPMK). */
  cpmkMkKeys: string[];
  /** Kunci pemetaan (MataKuliah+CPMK)→Teknik Penilaian yang aktif. */
  cpmkTeknikPenilaianKeys: string[];
  canManage: boolean;
}

/**
 * Tab Teknik Penilaian CPMK, terdiri dari dua bagian:
 *
 * 1. CRUD kategori teknik penilaian (mis. "Partisipasi", "Unjuk Kerja",
 *    "Tes Tulis (UTS)") — daftar ini spesifik per kurikulum, sehingga setiap
 *    kurikulum bisa punya kategori penilaiannya sendiri.
 * 2. Matriks (Mata Kuliah + CPMK) × Teknik Penilaian: setiap baris adalah
 *    kombinasi satu mata kuliah dengan satu CPMK yang didukungnya (diambil
 *    dari tab "Pemetaan CPMK dan Mata Kuliah"), karena satu CPMK yang sama
 *    bisa didukung beberapa mata kuliah dengan teknik penilaian yang
 *    berbeda-beda di tiap mata kuliah.
 */
export default function TeknikPenilaianTab({
  kurikulumId,
  cpmkList,
  mataKuliahList,
  teknikPenilaianList,
  cpmkMkKeys,
  cpmkTeknikPenilaianKeys,
  canManage,
}: TeknikPenilaianTabProps) {
  const columns: DataTableColumn<TeknikPenilaian>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => teknikPenilaianList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Nama Teknik Penilaian" },
  ];

  // Saran kode berikutnya, mis. sudah ada TP01-TP03 -> saran "TP04".
  const kodeBerikutnya = useMemo(
    () => suggestNextKode(teknikPenilaianList.map((row) => row.kode), "TP"),
    [teknikPenilaianList]
  );

  /**
   * Setiap baris matriks = satu kombinasi (Mata Kuliah, CPMK), diturunkan
   * dari tab "Pemetaan CPMK dan Mata Kuliah" (jenis `cpmkMk`, disimpan
   * sebagai kunci `cpmkId:mkId` — lihat konfigurasi `rows`/`columns` pada
   * `MatrixMappingTab` untuk jenis tersebut di `KurikulumDetailView`).
   * ID komposit `${mkId}__${cpmkId}` dipakai sebagai `sourceId` pemetaan
   * teknik penilaian, agar satu (MK, CPMK) punya slot pemetaan sendiri.
   */
  const rows: CpmkMataKuliahRow[] = useMemo(() => {
    const cpmkMkSet = new Set(cpmkMkKeys);
    const result: CpmkMataKuliahRow[] = [];

    for (const cpmk of cpmkList) {
      for (const mataKuliah of mataKuliahList) {
        if (!cpmkMkSet.has(toPemetaanKey(cpmk.id, mataKuliah.id))) continue;
        result.push({
          id: toCompositeId(mataKuliah.id, cpmk.id),
          mataKuliah,
          cpmk,
        });
      }
    }

    return result;
  }, [cpmkList, mataKuliahList, cpmkMkKeys]);

  return (
    <Box>
      <CrudTabSection
        title="Kategori Teknik Penilaian"
        description="Daftar teknik penilaian yang tersedia pada kurikulum ini, mis. Partisipasi, Unjuk Kerja, Tes Tulis (UTS/UAS), Presentasi, atau Kuis."
        addLabel="Tambah Teknik Penilaian"
        rows={teknikPenilaianList}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyMessage="Belum ada teknik penilaian. Tambahkan teknik penilaian untuk memulai."
        canManage={canManage}
        entityLabel="teknik penilaian"
        getRowLabel={(row) => `Teknik penilaian ${row.nama}`}
        badges={[`${teknikPenilaianList.length} teknik penilaian`]}
        onDelete={(row) => deleteTeknikPenilaianAction(kurikulumId, row.id)}
        fields={[
          { name: "kode", label: "Kode", required: true, span: "half", placeholder: "TP01" },
          { name: "nama", label: "Nama Teknik Penilaian", required: true, span: "half" },
        ]}
        emptyValues={{ kode: kodeBerikutnya, nama: "" }}
        toFormValues={(row) => ({ kode: row.kode, nama: row.nama })}
        onCreate={(values) => createTeknikPenilaianAction(kurikulumId, values)}
        onUpdate={(row, values) => updateTeknikPenilaianAction(kurikulumId, row.id, values)}
        // Daftar kategori biasanya singkat (segelintir baris), jadi tabel
        // dipampatkan dan dibatasi tinggi maksimum agar matriks pemetaan
        // di bawahnya langsung terlihat tanpa perlu scroll jauh.
        dense
        maxHeight={260}
      />

      <Divider sx={{ my: 3 }} />

      <CpmkTeknikPenilaianMatrix
        kurikulumId={kurikulumId}
        jenis={JENIS_PEMETAAN.cpmkTeknikPenilaian}
        rows={rows}
        teknikPenilaianList={teknikPenilaianList}
        activeKeys={cpmkTeknikPenilaianKeys}
        canManage={canManage}
      />
    </Box>
  );
}
