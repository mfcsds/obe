"use client";

import { useState, useTransition } from "react";
import { Typography, Box, Button, IconButton, Chip, Tooltip } from "@mui/material";
import { Add, Edit, Delete, AccountTree } from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { KurikulumFormDialog } from "@/components/kurikulum/KurikulumFormDialog";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { deleteKurikulumAction } from "@/lib/actions/kurikulum.actions";
import type { Kurikulum } from "@/types/kurikulum";

interface KurikulumViewProps {
  kurikulumList: Kurikulum[];
  /** Apakah user boleh membuat/mengubah/menghapus (hanya kaprodi). */
  canManage: boolean;
}

/**
 * Komponen interaktif untuk daftar kurikulum: menangani state dialog
 * tambah/edit/hapus dan memanggil server action. Data awal diterima dari
 * Server Component induk, jadi komponen ini tidak melakukan fetch sendiri.
 */
export function KurikulumView({ kurikulumList, canManage }: KurikulumViewProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Kurikulum | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Kurikulum | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleOpenCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (kurikulum: Kurikulum) => {
    setEditing(kurikulum);
    setFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    startDeleteTransition(async () => {
      const result = await deleteKurikulumAction(pendingDelete.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Kurikulum "${pendingDelete.nama}" berhasil dihapus.`);
      }
      setPendingDelete(null);
    });
  };

  const columns: DataTableColumn<Kurikulum>[] = [
    { key: "nama", label: "Nama Kurikulum" },
    { key: "tahunAkademik", label: "Tahun Akademik" },
    {
      key: "semesterMulai",
      label: "Semester Mulai",
      render: (kurikulum) => kurikulum.semesterMulai ?? "-",
    },
    { key: "totalSKS", label: "Total SKS", align: "center" },
    { key: "jumlahCPL", label: "Jml CPL", align: "center" },
    { key: "jumlahCPMK", label: "Jml CPMK", align: "center" },
    { key: "jumlahMK", label: "Jml MK", align: "center" },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (kurikulum) => (
        <Chip
          label={kurikulum.status}
          color={kurikulum.status === "Aktif" ? "success" : "default"}
          size="small"
          variant={kurikulum.status === "Aktif" ? "filled" : "outlined"}
        />
      ),
    },
    {
      key: "aksi",
      label: "Aksi",
      align: "center",
      render: (kurikulum) => (
        <>
          <Tooltip title="Buka penyusunan kurikulum">
            <IconButton
              size="small"
              color="info"
              component={Link}
              href={`/kurikulum/${kurikulum.id}`}
              aria-label={`Buka pemetaan ${kurikulum.nama}`}
            >
              <AccountTree fontSize="small" />
            </IconButton>
          </Tooltip>
          {canManage && (
            <>
              <Tooltip title="Ubah nama, tahun akademik, dan status">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleOpenEdit(kurikulum)}
                  aria-label={`Ubah data ${kurikulum.nama}`}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Hapus kurikulum">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setPendingDelete(kurikulum)}
                  aria-label={`Hapus ${kurikulum.nama}`}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Kurikulum Program Studi
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Pengelolaan dokumen kurikulum berbasis capaian pembelajaran (Outcome Based Education).
          </Typography>
        </Box>
        {canManage && (
          <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate}>
            Buat Kurikulum Baru
          </Button>
        )}
      </Box>

      <DataTable
        columns={columns}
        rows={kurikulumList}
        getRowKey={(kurikulum) => kurikulum.id}
        withPaper
        emptyMessage="Belum ada kurikulum. Buat kurikulum baru untuk memulai."
      />

      <KurikulumFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        kurikulum={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus kurikulum?"
        description={
          pendingDelete
            ? `Kurikulum "${pendingDelete.nama}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
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
