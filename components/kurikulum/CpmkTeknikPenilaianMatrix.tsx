"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { toast } from "sonner";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import { LargeTooltip } from "@/components/common/LargeTooltip";
import {
  HEADER_ROW_HEIGHT,
  headerCellSx,
  subHeaderCellSx,
  stickyBodyCellSx,
} from "@/components/kurikulum/MatrixMappingTab";
import { togglePemetaanAction } from "@/lib/actions/pemetaan.actions";
import {
  toPemetaanKey,
  type JenisPemetaan,
  type Cpmk,
  type MataKuliah,
  type TeknikPenilaian,
} from "@/types/kurikulum-detail";

/** Satu baris matriks: kombinasi satu Mata Kuliah dengan satu CPMK yang didukungnya. */
export interface CpmkMataKuliahRow {
  /** ID komposit unik (lihat `toCompositeId`), dipakai sebagai `sourceId` pemetaan. */
  id: string;
  mataKuliah: MataKuliah;
  cpmk: Cpmk;
}

interface CpmkTeknikPenilaianMatrixProps {
  kurikulumId: string;
  jenis: JenisPemetaan;
  rows: CpmkMataKuliahRow[];
  teknikPenilaianList: TeknikPenilaian[];
  activeKeys: string[];
  canManage: boolean;
}

/**
 * Matriks Mata Kuliah+CPMK × Teknik Penilaian.
 *
 * Berbeda dari `MatrixMappingTab` generik (satu entitas per baris), matriks
 * ini butuh DUA kolom label sticky (Mata Kuliah dan CPMK) karena satu baris
 * merepresentasikan satu kombinasi keduanya: CPMK yang sama bisa didukung
 * beberapa mata kuliah, dan tiap mata kuliah boleh memilih teknik penilaian
 * yang berbeda untuk mengukur CPMK tersebut. Komponen dibuat khusus (bukan
 * reuse `MatrixMappingTab`) karena bentuk header/baris berbeda, tapi tetap
 * memakai style sticky yang sama (diimpor dari `MatrixMappingTab`) agar
 * tampilan konsisten (steering clean-code: DRY sebisa mungkin).
 */
export function CpmkTeknikPenilaianMatrix({
  kurikulumId,
  jenis,
  rows,
  teknikPenilaianList,
  activeKeys,
  canManage,
}: CpmkTeknikPenilaianMatrixProps) {
  const [keys, setKeys] = useState<Set<string>>(() => new Set(activeKeys));
  const [, startTransition] = useTransition();

  const isChecked = (rowId: string, teknikId: string) =>
    keys.has(toPemetaanKey(rowId, teknikId));

  const handleToggle = (rowId: string, teknikId: string) => {
    const key = toPemetaanKey(rowId, teknikId);
    const nextChecked = !keys.has(key);

    // Optimistic update supaya matriks terasa responsif.
    setKeys((prev) => {
      const next = new Set(prev);
      if (nextChecked) next.add(key);
      else next.delete(key);
      return next;
    });

    startTransition(async () => {
      const result = await togglePemetaanAction(
        kurikulumId,
        jenis,
        rowId,
        teknikId,
        nextChecked
      );

      if (result.error) {
        toast.error(result.error);
        setKeys((prev) => {
          const next = new Set(prev);
          if (nextChecked) next.delete(key);
          else next.add(key);
          return next;
        });
      }
    });
  };

  const totalRelasi = keys.size;
  const hasPrerequisites = rows.length > 0 && teknikPenilaianList.length > 0;

  return (
    <Box>
      <TabHeader
        title="Pemetaan CPMK dan Teknik Penilaian"
        description="Tentukan teknik penilaian yang dipakai setiap mata kuliah untuk mengukur pencapaian CPMK-nya. Satu CPMK yang didukung beberapa mata kuliah boleh memakai teknik penilaian yang berbeda-beda di tiap mata kuliah."
        badges={[
          `${rows.length} baris`,
          `${teknikPenilaianList.length} teknik penilaian`,
          `${totalRelasi} relasi aktif`,
        ]}
      />

      {!hasPrerequisites ? (
        <Alert severity="info">
          Lengkapi dulu tab &quot;Pemetaan CPMK dan Mata Kuliah&quot; (menentukan
          mata kuliah pendukung setiap CPMK) dan Kategori Teknik Penilaian di
          atas sebelum melakukan pemetaan ini.
        </Alert>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ "& th": { height: HEADER_ROW_HEIGHT } }}>
                  <TableCell
                    align="center"
                    sx={{
                      ...headerCellSx,
                      position: "sticky",
                      left: 0,
                      top: 0,
                      zIndex: 5,
                      minWidth: 56,
                    }}
                  >
                    No
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      position: "sticky",
                      left: 56,
                      top: 0,
                      zIndex: 5,
                      minWidth: 240,
                    }}
                  >
                    Mata Kuliah
                  </TableCell>
                  <TableCell
                    sx={{
                      ...headerCellSx,
                      position: "sticky",
                      left: 296,
                      top: 0,
                      zIndex: 5,
                      minWidth: 260,
                    }}
                  >
                    CPMK
                  </TableCell>
                  <TableCell
                    colSpan={teknikPenilaianList.length}
                    align="center"
                    sx={{ ...headerCellSx, top: 0 }}
                  >
                    Teknik Penilaian
                  </TableCell>
                </TableRow>
                <TableRow sx={{ "& th": { height: HEADER_ROW_HEIGHT } }}>
                  <TableCell
                    sx={{
                      ...subHeaderCellSx,
                      position: "sticky",
                      left: 0,
                      top: HEADER_ROW_HEIGHT,
                      zIndex: 5,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...subHeaderCellSx,
                      position: "sticky",
                      left: 56,
                      top: HEADER_ROW_HEIGHT,
                      zIndex: 5,
                    }}
                  />
                  <TableCell
                    sx={{
                      ...subHeaderCellSx,
                      position: "sticky",
                      left: 296,
                      top: HEADER_ROW_HEIGHT,
                      zIndex: 5,
                    }}
                  />
                  {teknikPenilaianList.map((teknik) => (
                    <TableCell
                      key={teknik.id}
                      align="center"
                      sx={{ ...subHeaderCellSx, top: HEADER_ROW_HEIGHT, minWidth: 140 }}
                    >
                      {teknik.nama}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell align="center" sx={{ ...stickyBodyCellSx, left: 0, zIndex: 2 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ ...stickyBodyCellSx, left: 56, zIndex: 2, maxWidth: 240 }}>
                      <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                        {row.mataKuliah.kode}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {row.mataKuliah.nama} ({row.mataKuliah.sks} SKS)
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...stickyBodyCellSx, left: 296, zIndex: 2, maxWidth: 260 }}>
                      <LargeTooltip title={row.cpmk.deskripsi}>
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                            {row.cpmk.kode}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              lineHeight: 1.3,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {row.cpmk.deskripsi}
                          </Typography>
                        </Box>
                      </LargeTooltip>
                    </TableCell>
                    {teknikPenilaianList.map((teknik) => {
                      const checked = isChecked(row.id, teknik.id);
                      return (
                        <TableCell
                          key={teknik.id}
                          align="center"
                          sx={{
                            py: 0.25,
                            bgcolor: checked ? "rgba(245, 158, 11, 0.12)" : undefined,
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          <Checkbox
                            size="small"
                            checked={checked}
                            onChange={() => handleToggle(row.id, teknik.id)}
                            disabled={!canManage}
                            inputProps={{
                              "aria-label": `Pilih teknik ${teknik.nama} untuk CPMK ${row.cpmk.kode} pada mata kuliah ${row.mataKuliah.kode}`,
                            }}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ px: 2, py: 1.5, borderTop: "1px solid", borderColor: "divider" }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 0.5,
                  bgcolor: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Sel yang sudah dipetakan
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              &middot; Setiap baris adalah kombinasi satu mata kuliah dengan satu CPMK
              yang didukungnya
            </Typography>
          </Stack>
        </Paper>
      )}

      {hasPrerequisites && !canManage && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5, display: "block" }}>
          Hanya kaprodi yang dapat mengubah pemetaan.
        </Typography>
      )}
    </Box>
  );
}
