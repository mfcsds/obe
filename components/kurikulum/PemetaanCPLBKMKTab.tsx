"use client";

import { Box, Alert, Stack, Typography } from "@mui/material";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import {
  toPemetaanKey,
  type BahanKajian,
  type Cpl,
  type MataKuliah,
} from "@/types/kurikulum-detail";

interface PemetaanCPLBKMKTabProps {
  cplList: Cpl[];
  bahanKajianList: BahanKajian[];
  mataKuliahList: MataKuliah[];
  /** Kunci pemetaan Bahan Kajian→Mata Kuliah yang aktif (tab 6). */
  bkMkKeys: string[];
  /** Kunci pemetaan Mata Kuliah→CPL yang aktif (tab 7). */
  mkCplKeys: string[];
}

/** Satu baris matriks: satu Bahan Kajian, dengan MK penghubung ke setiap CPL. */
interface BarisMatriks {
  bahanKajian: BahanKajian;
  /** Mata kuliah penghubung per CPL, dikunci oleh ID CPL. */
  mataKuliahPerCpl: Map<string, MataKuliah[]>;
}

/**
 * Tab Keterkaitan CPL, Bahan Kajian, dan Mata Kuliah.
 *
 * Ditampilkan sebagai matriks: baris = Bahan Kajian, kolom = CPL, isi sel =
 * kode mata kuliah yang menjadi penghubung nyata antara keduanya. Sebuah
 * mata kuliah dianggap menjembatani satu pasang (BK, CPL) bila mata kuliah
 * tersebut sudah dipetakan ke BK itu (tab "Pemetaan Bahan Kajian dan Mata
 * Kuliah") DAN dibebankan CPL itu (tab "Pembebanan CPL pada Mata Kuliah").
 *
 * Seluruhnya data turunan (read-only) — tidak ada input baru di tab ini,
 * hanya rekap otomatis dari dua pemetaan yang sudah diisi kaprodi.
 */
export default function PemetaanCPLBKMKTab({
  cplList,
  bahanKajianList,
  mataKuliahList,
  bkMkKeys,
  mkCplKeys,
}: PemetaanCPLBKMKTabProps) {
  const bkMk = new Set(bkMkKeys);
  const mkCpl = new Set(mkCplKeys);

  const rows: BarisMatriks[] = bahanKajianList.map((bahanKajian) => {
    // Mata kuliah yang memuat bahan kajian ini (dari tab BK vs MK).
    const mataKuliahBk = mataKuliahList.filter((mk) =>
      bkMk.has(toPemetaanKey(bahanKajian.id, mk.id))
    );

    // Untuk setiap CPL, saring mata kuliah tersebut menjadi hanya yang juga
    // dibebankan CPL itu (dari tab Pembebanan CPL pada Mata Kuliah).
    const mataKuliahPerCpl = new Map<string, MataKuliah[]>();
    for (const cpl of cplList) {
      const penghubung = mataKuliahBk.filter((mk) => mkCpl.has(toPemetaanKey(mk.id, cpl.id)));
      if (penghubung.length > 0) {
        mataKuliahPerCpl.set(cpl.id, penghubung);
      }
    }

    return { bahanKajian, mataKuliahPerCpl };
  });

  const bkBelumTerhubung = rows.filter((row) => row.mataKuliahPerCpl.size === 0).length;
  const hasPrerequisites = bahanKajianList.length > 0 && cplList.length > 0;

  const columns: DataTableColumn<BarisMatriks>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => rows.indexOf(row) + 1,
    },
    {
      key: "bahanKajian",
      label: "Bahan Kajian",
      minWidth: 320,
      maxWidth: 320,
      render: (row) => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: "normal", fontWeight: 500, py: 0.5 }}
        >
          {row.bahanKajian.nama}
        </Typography>
      ),
    },
    ...cplList.map(
      (cpl): DataTableColumn<BarisMatriks> => ({
        key: `cpl-${cpl.id}`,
        label: cpl.kode,
        align: "center",
        minWidth: 168,
        maxWidth: 168,
        render: (row) => {
          const penghubung = row.mataKuliahPerCpl.get(cpl.id) ?? [];

          if (penghubung.length === 0) {
            return (
              <Box component="span" sx={{ color: "text.disabled" }}>
                &ndash;
              </Box>
            );
          }

          return (
            <Stack spacing={1} alignItems="stretch" sx={{ py: 0.75 }}>
              {penghubung.map((mk) => (
                <Box
                  key={mk.id}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: "rgba(245, 158, 11, 0.12)",
                    border: "1px solid",
                    borderColor: "primary.main",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.4 }}
                  >
                    {mk.kode}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ fontSize: "0.6875rem", lineHeight: 1.4, mt: 0.5 }}
                  >
                    {mk.nama} ({mk.sks} SKS)
                  </Typography>
                </Box>
              ))}
            </Stack>
          );
        },
      })
    ),
  ];

  return (
    <Box>
      <TabHeader
        title="Keterkaitan Capaian Pembelajaran Lulusan, Bahan Kajian, dan Mata Kuliah"
        description="Kode mata kuliah yang menghubungkan setiap bahan kajian dengan capaian pembelajaran lulusan, disusun otomatis berdasarkan pemetaan pada tahap sebelumnya."
        badges={
          bkBelumTerhubung > 0
            ? [`${bkBelumTerhubung} bahan kajian belum terhubung ke CPL`]
            : [`${rows.length} bahan kajian terhubung`]
        }
      />

      {!hasPrerequisites ? (
        <Alert severity="info">
          Lengkapi data Bahan Kajian dan Capaian Pembelajaran Lulusan terlebih
          dahulu, lalu isi pemetaan pada tab BK vs Mata Kuliah dan Pembebanan
          CPL pada Mata Kuliah.
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.bahanKajian.id}
          withPaper
          maxHeight="65vh"
          emptyMessage="Belum ada data pemetaan."
        />
      )}
    </Box>
  );
}
