"use client";

import { useState, useTransition } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  GenericFormDialog,
  type FieldValue,
  type FormFieldConfig,
} from "@/components/common/GenericFormDialog";
import {
  createRekamJejakAction,
  deleteRekamJejakAction,
  updateRekamJejakAction,
  type JenisRekamJejak,
} from "@/lib/actions/dosen-rekam-jejak.actions";

interface RekamJejakTabProps<T extends { id: string }> {
  jenis: JenisRekamJejak;
  dosenId: string;
  canManage: boolean;
  rows: T[];
  columns: DataTableColumn<T>[];
  /** Label entitas untuk tombol dan pesan, mis. "Publikasi". */
  entityLabel: string;
  emptyMessage: string;
  fields: FormFieldConfig[];
  emptyValues: Record<string, FieldValue>;
  toFormValues: (item: T) => Record<string, FieldValue>;
  /** Teks pengenal baris untuk konfirmasi hapus. */
  getRowLabel: (row: T) => string;
}

/**
 * Tab rekam jejak dosen (publikasi, penelitian, PKM, rekognisi, seminar,
 * riwayat mengajar). Keenam tab memakai komponen ini dengan konfigurasi
 * kolom dan field yang berbeda, sehingga tidak ada duplikasi logika CRUD
 * (steering clean-code: DRY).
 */
export function RekamJejakTab<T extends { id: string }>({
  jenis,
  dosenId,
  canManage,
  rows,
  columns,
  entityLabel,
  emptyMessage,
  fields,
  emptyValues,
  toFormValues,
  getRowLabel,
}: RekamJejakTabProps<T>) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [pendingDelete, setPendingDelete] = useState<T | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const label = getRowLabel(pendingDelete);

    startDeleteTransition(async () => {
      const result = await deleteRekamJejakAction(jenis, dosenId, pendingDelete.id);

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
      {canManage && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Tambah {entityLabel}
          </Button>
        </Box>
      )}

      <DataTable
        columns={tableColumns}
        rows={rows}
        getRowKey={(row) => row.id}
        maxHeight={500}
        emptyMessage={emptyMessage}
      />

      <GenericFormDialog<T>
        open={formOpen}
        onClose={() => setFormOpen(false)}
        createTitle={`Tambah ${entityLabel}`}
        editTitle={`Ubah ${entityLabel}`}
        fields={fields}
        editing={editing}
        emptyValues={emptyValues}
        toFormValues={toFormValues}
        onSubmit={(values) =>
          editing
            ? updateRekamJejakAction(jenis, dosenId, editing.id, values)
            : createRekamJejakAction(jenis, dosenId, values)
        }
        successMessage={{
          create: `${entityLabel} berhasil ditambahkan.`,
          update: `${entityLabel} berhasil diperbarui.`,
        }}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Hapus ${entityLabel.toLowerCase()}?`}
        description={
          pendingDelete
            ? `${getRowLabel(pendingDelete)} akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
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
