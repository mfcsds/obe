"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Chip,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search, Person } from "@mui/icons-material";
import Link from "next/link";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DosenFormDialog } from "@/components/dosen/DosenFormDialog";
import { deleteDosenAction } from "@/lib/actions/dosen.actions";
import type { Dosen } from "@/types/dosen";

interface DosenViewProps {
  dosenList: Dosen[];
  /** Apakah user boleh menambah/mengubah/menghapus (hanya kaprodi). */
  canManage: boolean;
}

/** Halaman daftar dosen dengan pencarian dan aksi CRUD. */
export function DosenView({ dosenList, canManage }: DosenViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Dosen | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Dosen | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  const filteredDosen = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return dosenList;

    return dosenList.filter(
      (dosen) =>
        dosen.nama.toLowerCase().includes(keyword) ||
        dosen.nidn.includes(keyword) ||
        dosen.email.toLowerCase().includes(keyword)
    );
  }, [dosenList, searchTerm]);

  const handleOpenCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const nama = pendingDelete.nama;

    startDeleteTransition(async () => {
      const result = await deleteDosenAction(pendingDelete.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Dosen ${nama} berhasil dihapus.`);
      }
      setPendingDelete(null);
    });
  };

  const columns: DataTableColumn<Dosen>[] = [
    {
      key: "nama",
      label: "Nama",
      render: (dosen) => (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {dosen.nama}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dosen.email}
          </Typography>
        </Box>
      ),
    },
    { key: "nidn", label: "NIDN" },
    {
      key: "pendidikan",
      label: "Pendidikan",
      render: (dosen) => dosen.pendidikan ?? "-",
    },
    {
      key: "jabatan",
      label: "Jabatan Akademik",
      render: (dosen) => dosen.jabatan ?? "-",
    },
    {
      key: "bidangKeahlian",
      label: "Bidang Keahlian",
      render: (dosen) => dosen.bidangKeahlian ?? "-",
    },
    {
      key: "status",
      label: "Status",
      render: (dosen) =>
        dosen.status ? (
          <Chip label={dosen.status} color="primary" size="small" variant="outlined" />
        ) : (
          "-"
        ),
    },
    {
      key: "aksi",
      label: "Aksi",
      align: "center",
      render: (dosen) => (
        <>
          <Tooltip title="Lihat profil & rekam jejak">
            <IconButton
              size="small"
              color="info"
              component={Link}
              href={`/dosen/${dosen.id}`}
              aria-label={`Lihat profil ${dosen.nama}`}
            >
              <Person fontSize="small" />
            </IconButton>
          </Tooltip>
          {canManage && (
            <>
              <Tooltip title="Ubah data dosen">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    setEditing(dosen);
                    setFormOpen(true);
                  }}
                  aria-label={`Ubah data ${dosen.nama}`}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Hapus dosen">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => setPendingDelete(dosen)}
                  aria-label={`Hapus ${dosen.nama}`}
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
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            Daftar Dosen
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kelola data dosen tetap program studi (DTPS) untuk keperluan akreditasi.
          </Typography>
        </Box>
        {canManage && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreate}
            sx={{ flexShrink: 0 }}
          >
            Tambah Dosen
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Cari dosen berdasarkan nama, NIDN, atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ bgcolor: "background.paper" }}
        />
      </Box>

      <DataTable
        columns={columns}
        rows={filteredDosen}
        getRowKey={(dosen) => dosen.id}
        withPaper
        emptyMessage={
          dosenList.length === 0
            ? "Belum ada data dosen. Tambahkan dosen untuk memulai."
            : "Tidak ada dosen yang cocok dengan pencarian."
        }
      />

      <DosenFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        dosen={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus dosen?"
        description={
          pendingDelete
            ? `Dosen ${pendingDelete.nama} beserta seluruh rekam jejaknya (publikasi, penelitian, PKM, rekognisi, seminar, riwayat mengajar) akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`
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
