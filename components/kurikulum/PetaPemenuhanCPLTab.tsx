"use client";

import { Box, Alert, LinearProgress, Typography, Stack, Chip } from "@mui/material";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { LargeTooltip } from "@/components/common/LargeTooltip";
import { toPemetaanKey, type Cpl, type MataKuliah } from "@/types/kurikulum-detail";

interface PetaPemenuhanCPLTabProps {
  cplList: Cpl[];
  mataKuliahList: MataKuliah[];
  /** Kunci pemetaan MK→CPL yang aktif. */
  mkCplKeys: string[];
}

/** Satu baris rekap pemenuhan CPL. */
interface BarisPemenuhan {
  id: string;
  kode: string;
  deskripsi: string;
  kategori: string;
  mataKuliah: MataKuliah[];
}

/**
 * Tab Peta Pemenuhan CPL: menunjukkan CPL mana yang sudah didukung mata
 * kuliah dan mana yang belum. Seluruhnya data turunan dari pemetaan MK vs CPL,
 * jadi read-only.
 */
export default function PetaPemenuhanCPLTab({
  cplList,
  mataKuliahList,
  mkCplKeys,
}: PetaPemenuhanCPLTabProps) {
  const activeKeys = new Set(mkCplKeys);

  const rows: BarisPemenuhan[] = cplList.map((cpl) => ({
    id: cpl.id,
    kode: cpl.kode,
    deskripsi: cpl.deskripsi,
    kategori: cpl.kategori,
    mataKuliah: mataKuliahList.filter((mk) =>
      activeKeys.has(toPemetaanKey(mk.id, cpl.id))
    ),
  }));

  const cplTerpenuhi = rows.filter((row) => row.mataKuliah.length > 0).length;
  const persentase = cplList.length > 0 ? (cplTerpenuhi / cplList.length) * 100 : 0;

  const columns: DataTableColumn<BarisPemenuhan>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => rows.indexOf(row) + 1,
    },
    {
      key: "kode",
      label: "CPL",
      render: (row) => (
        <LargeTooltip title={row.deskripsi}>
          <Typography variant="body2" fontWeight={500}>
            {row.kode}
          </Typography>
        </LargeTooltip>
      ),
    },
    {
      key: "kategori",
      label: "Kategori",
      align: "center",
      render: (row) => <Chip label={row.kategori} size="small" variant="outlined" />,
    },
    {
      key: "jumlahMk",
      label: "Jml MK",
      align: "center",
      render: (row) => row.mataKuliah.length,
    },
    {
      key: "mataKuliah",
      label: "Mata Kuliah Pendukung",
      minWidth: 260,
      render: (row) =>
        row.mataKuliah.length === 0 ? (
          <Chip label="Belum terpenuhi" size="small" color="warning" variant="outlined" />
        ) : (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
            sx={{ py: 0.75 }}
          >
            {row.mataKuliah.map((mk) => (
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
                  minWidth: 150,
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
        ),
    },
  ];

  return (
    <Box>
      <TabHeader
        title="Peta Pemenuhan Capaian Pembelajaran Lulusan"
        description="Rekapitulasi capaian pembelajaran lulusan yang telah didukung mata kuliah, dihitung otomatis dari pembebanan CPL pada mata kuliah."
        badges={[`${cplTerpenuhi}/${cplList.length} CPL terpenuhi`]}
      />

      {cplList.length === 0 ? (
        <Alert severity="info">
          Belum ada data Capaian Pembelajaran Lulusan. Lengkapi tahap Capaian
          Pembelajaran Lulusan terlebih dahulu.
        </Alert>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.75 }}>
              <Typography variant="body2" color="text.secondary">
                Tingkat pemenuhan CPL
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {persentase.toFixed(0)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={persentase}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(row) => row.id}
            withPaper
            maxHeight="60vh"
            emptyMessage="Belum ada data pemenuhan CPL."
          />
        </>
      )}
    </Box>
  );
}
