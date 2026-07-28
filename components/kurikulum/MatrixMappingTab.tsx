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
import { togglePemetaanAction } from "@/lib/actions/pemetaan.actions";
import { toPemetaanKey, type JenisPemetaan } from "@/types/kurikulum-detail";

/** Entitas apa pun yang bisa menjadi baris/kolom matriks. */
export interface MatrixEntity {
  id: string;
  kode: string;
  /** Keterangan panjang untuk tooltip. */
  keterangan?: string;
}

interface MatrixMappingTabProps {
  kurikulumId: string;
  jenis: JenisPemetaan;
  title: string;
  description: string;
  /** Entitas yang ditampilkan sebagai baris (murni posisi visual). */
  rows: MatrixEntity[];
  /** Entitas yang ditampilkan sebagai kolom (murni posisi visual). */
  columns: MatrixEntity[];
  rowHeaderLabel: string;
  columnGroupLabel: string;
  /** Pesan saat baris atau kolom masih kosong. */
  prerequisiteMessage: string;
  /** Kunci `"sourceId:targetId"` yang aktif, dari server. */
  activeKeys: string[];
  canManage: boolean;
  /**
   * Urutan penyimpanan kunci relatif terhadap posisi visual baris/kolom.
   * - "rowFirst" (default): kunci disimpan sebagai `${baris}:${kolom}`.
   * - "columnFirst": kunci disimpan sebagai `${kolom}:${baris}`.
   *
   * Dipakai saat posisi visual (mis. Bahan Kajian sebagai baris agar
   * teksnya terbaca penuh) berbeda dari urutan source/target yang sudah
   * dipakai di data tersimpan dan tab lain (mis. CPL selalu jadi `source`
   * pada matriks CPL↔BK) — sehingga format data lama tidak perlu diubah.
   */
  keyOrder?: "rowFirst" | "columnFirst";
  /**
   * Cara menampilkan label pada kolom baris (sticky, kolom kedua).
   * - "kode" (default): menampilkan `kode` (mis. "CPL01"), teks lengkap
   *   muncul lewat tooltip saat kursor diarahkan.
   * - "teks": menampilkan `keterangan` (teks lengkap) langsung tanpa
   *   dipotong, cocok untuk entitas yang lebih mudah dikenali dari
   *   deskripsinya daripada kodenya, mis. Bahan Kajian.
   * - "kodeDenganNama": menampilkan `kode` tebal di baris atas dan
   *   `keterangan` di baris bawah (dipotong 2 baris), mis. kode mata
   *   kuliah lalu nama & SKS-nya.
   */
  rowLabelMode?: "kode" | "teks" | "kodeDenganNama";
  /**
   * Cara menampilkan label pada header kolom.
   * - "kode" (default): hanya menampilkan `kode` (mis. "CPL01").
   * - "kodeDenganNama": menampilkan `kode` di baris atas (tebal) dan
   *   `keterangan` di baris bawah (lebih kecil, terpotong 2 baris), mis.
   *   "KK14000126" lalu "Dasar-Dasar Pemrograman (4 SKS)". Kolom otomatis
   *   dilebarkan agar kedua baris terbaca tanpa perlu tooltip.
   */
  columnLabelMode?: "kode" | "kodeDenganNama";
  /**
   * Membatasi sel mana yang boleh dicentang, di luar pembatasan role
   * (`canManage`). Dipakai saat satu pemetaan harus konsisten dengan
   * pemetaan lain yang sudah diisi lebih dulu — mis. CPMK hanya boleh
   * dibebankan ke mata kuliah yang sudah dibebankan CPL induknya
   * (tab "Pembebanan CPL pada Mata Kuliah"), supaya kaprodi tidak bisa
   * salah pilih kombinasi yang tidak konsisten.
   *
   * Bila diberikan dan mengembalikan `false`, sel ditampilkan non-aktif
   * (abu-abu, checkbox terkunci) beserta tooltip yang dikembalikan lewat
   * `disabledReason`.
   */
  isCellAllowed?: (row: MatrixEntity, column: MatrixEntity) => boolean;
  /** Pesan tooltip untuk sel yang dikunci oleh `isCellAllowed`. */
  disabledReason?: string;
}

/**
 * Matriks centang untuk memetakan dua entitas kurikulum (Profil↔CPL,
 * CPL↔BK, BK↔MK, MK↔CPL). Keempat tab pemetaan memakai komponen ini dengan
 * konfigurasi baris/kolom berbeda, sehingga tidak ada duplikasi logika
 * (steering clean-code: DRY).
 *
 * Perubahan disimpan per sel (optimistic): checkbox langsung berubah, lalu
 * dikembalikan ke kondisi semula bila server menolak.
 */
export function MatrixMappingTab({
  kurikulumId,
  jenis,
  title,
  description,
  rows,
  columns,
  rowHeaderLabel,
  columnGroupLabel,
  prerequisiteMessage,
  activeKeys,
  canManage,
  keyOrder = "rowFirst",
  rowLabelMode = "kode",
  columnLabelMode = "kode",
  isCellAllowed,
  disabledReason = "Kombinasi ini tidak tersedia karena belum konsisten dengan pemetaan sebelumnya.",
}: MatrixMappingTabProps) {
  const [keys, setKeys] = useState<Set<string>>(() => new Set(activeKeys));
  const [, startTransition] = useTransition();

  /** Mengurutkan (baris, kolom) menjadi (source, target) sesuai `keyOrder`. */
  const toSourceTarget = (rowId: string, columnId: string) =>
    keyOrder === "columnFirst" ? [columnId, rowId] : [rowId, columnId];

  const isChecked = (rowId: string, columnId: string) => {
    const [sourceId, targetId] = toSourceTarget(rowId, columnId);
    return keys.has(toPemetaanKey(sourceId, targetId));
  };

  const handleToggle = (rowId: string, columnId: string) => {
    const [sourceId, targetId] = toSourceTarget(rowId, columnId);
    const key = toPemetaanKey(sourceId, targetId);
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
        sourceId,
        targetId,
        nextChecked
      );

      if (result.error) {
        toast.error(result.error);
        // Kembalikan ke kondisi sebelum toggle.
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
  const hasPrerequisites = rows.length > 0 && columns.length > 0;

  // Kolom label baris dilebarkan saat menampilkan teks lengkap, agar tidak
  // terlalu sempit untuk deskripsi Bahan Kajian/CPL yang bisa cukup panjang.
  const rowLabelColumnWidth =
    rowLabelMode === "teks" ? 320 : rowLabelMode === "kodeDenganNama" ? 220 : 140;

  // Kolom pemetaan dilebarkan saat header menampilkan kode + nama, agar dua
  // baris teks tetap terbaca tanpa harus mengandalkan tooltip.
  const columnWidth = columnLabelMode === "kodeDenganNama" ? 168 : undefined;

  return (
    <Box>
      <TabHeader
        title={title}
        description={description}
        badges={[
          `${rows.length} baris`,
          `${columns.length} kolom`,
          `${totalRelasi} relasi aktif`,
        ]}
      />

      {!hasPrerequisites ? (
        <Alert severity="info">{prerequisiteMessage}</Alert>
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
                      minWidth: rowLabelColumnWidth,
                    }}
                  >
                    {rowHeaderLabel}
                  </TableCell>
                  <TableCell
                    colSpan={columns.length}
                    align="center"
                    sx={{ ...headerCellSx, top: 0 }}
                  >
                    {columnGroupLabel}
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
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      sx={{
                        ...subHeaderCellSx,
                        top: HEADER_ROW_HEIGHT,
                        height: columnLabelMode === "kodeDenganNama" ? "auto" : HEADER_ROW_HEIGHT,
                        minWidth: columnWidth,
                        maxWidth: columnWidth,
                        whiteSpace: columnLabelMode === "kodeDenganNama" ? "normal" : "nowrap",
                        verticalAlign: "middle",
                        py: columnLabelMode === "kodeDenganNama" ? 1 : undefined,
                      }}
                    >
                      {columnLabelMode === "kodeDenganNama" ? (
                        <LargeTooltip title={column.keterangan ?? column.kode}>
                          <Box>
                            <Typography
                              variant="caption"
                              component="div"
                              sx={{ fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.3 }}
                            >
                              {column.kode}
                            </Typography>
                            <Typography
                              variant="caption"
                              component="div"
                              sx={{
                                fontWeight: 400,
                                fontSize: "0.6875rem",
                                lineHeight: 1.3,
                                opacity: 0.9,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                mt: 0.25,
                              }}
                            >
                              {column.keterangan}
                            </Typography>
                          </Box>
                        </LargeTooltip>
                      ) : (
                        <LargeTooltip title={column.keterangan ?? column.kode}>
                          <span>{column.kode}</span>
                        </LargeTooltip>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.id} hover>
                    <TableCell
                      align="center"
                      sx={{ ...stickyBodyCellSx, left: 0, zIndex: 2 }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...stickyBodyCellSx,
                        left: 56,
                        zIndex: 2,
                        maxWidth: rowLabelColumnWidth,
                      }}
                    >
                      {rowLabelMode === "teks" && (
                        <Typography variant="body2" sx={{ whiteSpace: "normal" }}>
                          {row.keterangan ?? row.kode}
                        </Typography>
                      )}
                      {rowLabelMode === "kodeDenganNama" && (
                        <LargeTooltip title={row.keterangan ?? row.kode}>
                          <Box>
                            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                              {row.kode}
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
                              {row.keterangan}
                            </Typography>
                          </Box>
                        </LargeTooltip>
                      )}
                      {rowLabelMode === "kode" && (
                        <LargeTooltip title={row.keterangan ?? row.kode}>
                          <Typography variant="body2" fontWeight={500} noWrap>
                            {row.kode}
                          </Typography>
                        </LargeTooltip>
                      )}
                    </TableCell>
                    {columns.map((column) => {
                      const checked = isChecked(row.id, column.id);
                      const allowed = isCellAllowed ? isCellAllowed(row, column) : true;

                      const checkbox = (
                        <Checkbox
                          size="small"
                          checked={checked}
                          onChange={() => handleToggle(row.id, column.id)}
                          disabled={!canManage || !allowed}
                          inputProps={{
                            "aria-label": `Petakan ${row.kode} dengan ${column.kode}`,
                          }}
                        />
                      );

                      return (
                        <TableCell
                          key={column.id}
                          align="center"
                          sx={{
                            py: 0.25,
                            bgcolor: checked
                              ? "rgba(245, 158, 11, 0.12)"
                              : !allowed
                                ? "action.hover"
                                : undefined,
                            transition: "background-color 0.15s ease",
                          }}
                        >
                          {allowed ? (
                            checkbox
                          ) : (
                            <LargeTooltip title={disabledReason}>
                              <span>{checkbox}</span>
                            </LargeTooltip>
                          )}
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
            {isCellAllowed && (
              <Stack direction="row" spacing={0.75} alignItems="center">
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: 0.5,
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  Sel terkunci, tidak konsisten dengan pemetaan sebelumnya
                </Typography>
              </Stack>
            )}
            <Typography variant="caption" color="text.secondary">
              &middot; Arahkan kursor ke kode baris/kolom untuk melihat deskripsi lengkap
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

/**
 * Tinggi setiap baris header, dipakai untuk menghitung posisi sticky baris
 * ke-2. Diekspor agar komponen matriks lain yang butuh tampilan sticky
 * serupa (mis. matriks dengan lebih dari satu kolom label baris) tidak
 * menduplikasi nilai ini (steering clean-code: DRY).
 */
export const HEADER_ROW_HEIGHT = 44;

/**
 * Style header utama matriks. Memakai `secondary` (warna coklat tua) alih-alih
 * `primary.dark` karena `contrastText` MUI hanya dihitung terhadap warna
 * `.main`, bukan `.dark` — memasangkannya dengan `.dark` menghasilkan teks
 * gelap di atas latar gelap yang hampir tidak terbaca.
 */
export const headerCellSx = {
  bgcolor: "primary.main",
  color: "primary.contrastText",
  fontWeight: 700,
  fontSize: "0.8125rem",
  height: HEADER_ROW_HEIGHT,
  whiteSpace: "nowrap",
} as const;

/** Style baris header kedua (daftar kode kolom). */
export const subHeaderCellSx = {
  bgcolor: "secondary.main",
  color: "secondary.contrastText",
  fontWeight: 700,
  fontSize: "0.8125rem",
  height: HEADER_ROW_HEIGHT,
  whiteSpace: "nowrap",
} as const;

/** Style kolom kiri yang tetap terlihat saat matriks di-scroll horizontal. */
export const stickyBodyCellSx = {
  position: "sticky",
  bgcolor: "background.paper",
  borderRight: "1px solid",
  borderRightColor: "divider",
} as const;
