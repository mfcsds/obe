"use client";

import { useState, useTransition, type ComponentProps, type ReactNode } from "react";
import { Box, Button, IconButton, Tooltip, Stack } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import {
  GenericFormDialog,
  type FieldValue,
  type FormFieldConfig,
} from "@/components/common/GenericFormDialog";

/** Bentuk hasil server action yang dipakai seluruh tab kurikulum. */
type ActionResult = { error: string | null };

interface CrudTabSectionProps<T extends { id: string }> {
  title: string;
  description: string;
  addLabel: string;
  rows: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
  /** Apakah user boleh menambah/mengubah/menghapus (hanya kaprodi). */
  canManage: boolean;
  /** Label entitas untuk pesan konfirmasi hapus, mis. "bahan kajian". */
  entityLabel: string;
  /** Deskripsi singkat baris yang akan dihapus. */
  getRowLabel: (row: T) => string;
  /** Badge ringkasan di header, mis. jumlah data. */
  badges?: string[];
  /** Elemen tambahan di sisi kanan header, ditampilkan sebelum tombol tambah. */
  headerExtra?: ReactNode;

  // Konfigurasi form tambah/ubah
  fields: FormFieldConfig[];
  emptyValues: Record<string, FieldValue>;
  toFormValues: (row: T) => Record<string, FieldValue>;
  onCreate: (values: Record<string, FieldValue>) => Promise<ActionResult>;
  onUpdate: (row: T, values: Record<string, FieldValue>) => Promise<ActionResult>;
  onDelete: (row: T) => Promise<ActionResult>;
  /** Diteruskan ke GenericFormDialog untuk penyesuaian nilai antar field. */
  onFieldChange?: ComponentProps<typeof GenericFormDialog<T>>["onFieldChange"];
  /**
   * Tinggi maksimum area scroll tabel; default "65vh". Diturunkan untuk tab
   * yang menampilkan konten lain di bawah tabel ini pada halaman yang sama
   * (mis. daftar referensi singkat diikuti matriks pemetaan), agar konten
   * berikutnya tidak tertutup terlalu jauh ke bawah.
   */
  maxHeight?: number | string;
  /** Memampatkan padding baris tabel; lihat `DataTable` -> `dense`. */
  dense?: boolean;
}

/**
 * Kerangka umum untuk tab kurikulum yang berisi tabel data dengan aksi
 * tambah/ubah/hapus. Form-nya dibangun dari konfigurasi field, sehingga
 * setiap tab tidak perlu komponen dialog sendiri (steering clean-code: DRY).
 *
 * Kolom "Aksi" ditambahkan otomatis bila `canManage` true.
 */
export function CrudTabSection<T extends { id: string }>({
  title,
  description,
  addLabel,
  rows,
  columns,
  getRowKey,
  emptyMessage,
  canManage,
  entityLabel,
  getRowLabel,
  badges,
  headerExtra,
  fields,
  emptyValues,
  toFormValues,
  onCreate,
  onUpdate,
  onDelete,
  onFieldChange,
  maxHeight = "65vh",
  dense = false,
}: CrudTabSectionProps<T>) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const label = getRowLabel(pendingDelete);

    startDeleteTransition(async () => {
      const result = await onDelete(pendingDelete);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${label} berhasil dihapus.`);
      }
      setPendingDelete(null);
    });
  };

  const actionColumn: DataTableColumn<T> = {
    key: "aksi",
    label: "Aksi",
    align: "center",
    render: (row) => (
      <>
        <Tooltip title="Ubah">
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              setEditing(row);
              setFormOpen(true);
            }}
            aria-label={`Ubah ${getRowLabel(row)}`}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus">
          <IconButton
            size="small"
            color="error"
            onClick={() => setPendingDelete(row)}
            aria-label={`Hapus ${getRowLabel(row)}`}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    ),
  };

  const tableColumns = canManage ? [...columns, actionColumn] : columns;

  return (
    <Box>
      <TabHeader
        title={title}
        description={description}
        badges={badges}
        action={
          canManage || headerExtra ? (
            <Stack direction="row" spacing={1} alignItems="center">
              {headerExtra}
              {canManage && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setEditing(null);
                    setFormOpen(true);
                  }}
                >
                  {addLabel}
                </Button>
              )}
            </Stack>
          ) : undefined
        }
      />

      <DataTable
        columns={tableColumns}
        rows={rows}
        getRowKey={getRowKey}
        withPaper
        maxHeight={maxHeight}
        dense={dense}
        emptyMessage={emptyMessage}
      />

      <GenericFormDialog<T>
        open={formOpen}
        onClose={() => setFormOpen(false)}
        createTitle={addLabel}
        editTitle={`Ubah ${entityLabel}`}
        fields={fields}
        editing={editing}
        emptyValues={emptyValues}
        toFormValues={toFormValues}
        onSubmit={(values) => (editing ? onUpdate(editing, values) : onCreate(values))}
        successMessage={{
          create: `${entityLabel} berhasil ditambahkan.`,
          update: `${entityLabel} berhasil diperbarui.`,
        }}
        onFieldChange={onFieldChange}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Hapus ${entityLabel}?`}
        description={
          pendingDelete
            ? `${getRowLabel(pendingDelete)} akan dihapus permanen beserta seluruh pemetaan yang terkait. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Hapus"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
