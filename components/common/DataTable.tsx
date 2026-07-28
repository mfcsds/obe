"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import type { ReactNode } from "react";

/**
 * Definisi satu kolom pada DataTable.
 *
 * - `key` dipakai sebagai React key kolom, harus unik dalam satu tabel.
 * - `render` opsional untuk menampilkan nilai custom (misalnya Chip, link,
 *   atau gabungan beberapa field). Jika tidak diberikan, DataTable akan
 *   menampilkan `row[key]` secara langsung.
 */
export interface DataTableColumn<T> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => ReactNode;
  /** Lebar minimum kolom (px), dipakai saat isi sel butuh ruang lebih (mis. teks panjang atau dua baris kode+nama). */
  minWidth?: number;
  /** Lebar maksimum kolom (px), untuk membatasi kolom teks panjang agar tabel tetap proporsional. */
  maxWidth?: number;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Fungsi untuk mengambil React key unik dari setiap baris data. */
  getRowKey: (row: T) => string | number;
  /** Tinggi maksimum area scroll tabel, dipakai bersama `stickyHeader`. */
  maxHeight?: number | string;
  /** Pesan yang ditampilkan saat `rows` kosong. */
  emptyMessage?: string;
  /** Bungkus tabel dengan Paper + border, sesuai konvensi list page. */
  withPaper?: boolean;
  /**
   * Kepadatan baris. `false` (default) memakai padding standar MUI, cocok
   * untuk tabel data utama. `true` memampatkan padding vertikal sel,
   * cocok untuk daftar referensi singkat (mis. kategori/setting) yang
   * berdampingan dengan konten lain di halaman yang sama, agar tidak
   * memakan ruang vertikal berlebihan.
   */
  dense?: boolean;
}

/**
 * Komponen tabel data generik yang menyeragamkan tampilan header (warna
 * primary, teks tebal) dan penanganan state kosong di seluruh halaman
 * (dosen, mahasiswa, kurikulum, dll). Dibuat untuk menghilangkan duplikasi
 * styling `TableCell` yang sebelumnya di-copy paste di banyak file.
 *
 * Contoh pemakaian:
 * ```tsx
 * <DataTable
 *   columns={[
 *     { key: "nama", label: "Nama" },
 *     { key: "ipk", label: "IPK", align: "center", render: (row) => <Chip label={row.ipk} /> },
 *   ]}
 *   rows={mahasiswaData}
 *   getRowKey={(row) => row.id}
 * />
 * ```
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  maxHeight,
  emptyMessage = "Tidak ada data untuk ditampilkan.",
  withPaper = false,
  dense = false,
}: DataTableProps<T>) {
  const cellPaddingSx = dense ? { py: 0.75 } : undefined;

  const table = (
    <TableContainer sx={maxHeight ? { maxHeight } : undefined}>
      <Table stickyHeader size={dense ? "small" : "medium"}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align ?? "left"}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  fontWeight: "bold",
                  minWidth: column.minWidth,
                  maxWidth: column.maxWidth,
                  ...cellPaddingSx,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <Box sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={getRowKey(row)} hover>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    align={column.align ?? "left"}
                    sx={{ minWidth: column.minWidth, maxWidth: column.maxWidth, ...cellPaddingSx }}
                  >
                    {column.render
                      ? column.render(row)
                      : String((row as Record<string, unknown>)[column.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (!withPaper) {
    return table;
  }

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      {table}
    </Paper>
  );
}
