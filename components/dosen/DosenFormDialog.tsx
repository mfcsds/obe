"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { toast } from "sonner";
import { createDosenAction, updateDosenAction } from "@/lib/actions/dosen.actions";
import {
  JABATAN_AKADEMIK,
  JENJANG_PENDIDIKAN,
  STATUS_KEPEGAWAIAN,
  type Dosen,
  type DosenFormInput,
} from "@/types/dosen";

interface DosenFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** Data yang sedang diedit; `null` berarti mode pembuatan baru. */
  dosen: Dosen | null;
}

const EMPTY_FORM: DosenFormInput = {
  nama: "",
  nidn: "",
  email: "",
  jabatan: "",
  pendidikan: "",
  bidangKeahlian: "",
  prodi: "Teknik Informatika",
  status: "Tetap PT",
};

/**
 * Dialog tambah/ubah data induk dosen. Rekam jejak (publikasi, penelitian,
 * dll) dikelola terpisah di halaman profil dosen.
 */
export function DosenFormDialog({ open, onClose, dosen }: DosenFormDialogProps) {
  const [form, setForm] = useState<DosenFormInput>(EMPTY_FORM);
  const [isSubmitting, startTransition] = useTransition();
  const isEditMode = Boolean(dosen);

  useEffect(() => {
    if (!open) return;

    if (dosen) {
      setForm({
        nama: dosen.nama,
        nidn: dosen.nidn,
        email: dosen.email,
        jabatan: dosen.jabatan ?? "",
        pendidikan: dosen.pendidikan ?? "",
        bidangKeahlian: dosen.bidangKeahlian ?? "",
        prodi: dosen.prodi ?? "",
        status: dosen.status ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, dosen]);

  const handleChange = <K extends keyof DosenFormInput>(
    field: K,
    value: DosenFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = dosen
        ? await updateDosenAction(dosen.id, form)
        : await createDosenAction(form);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditMode ? "Data dosen diperbarui." : "Dosen berhasil ditambahkan.");
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEditMode ? "Ubah Data Dosen" : "Tambah Dosen"}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2.5,
            pt: 1,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Nama Lengkap (dengan gelar)"
              placeholder="Dr. Ahmad Fauzi, M.Kom"
              fullWidth
              required
              autoFocus
              value={form.nama}
              onChange={(e) => handleChange("nama", e.target.value)}
            />
          </Box>
          <TextField
            label="NIDN"
            placeholder="0123456789"
            fullWidth
            required
            value={form.nidn}
            onChange={(e) => handleChange("nidn", e.target.value)}
            helperText="Hanya angka"
          />
          <TextField
            label="Email Institusi"
            type="email"
            placeholder="nama@yarsi.ac.id"
            fullWidth
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <TextField
            select
            label="Pendidikan Terakhir"
            fullWidth
            value={form.pendidikan ?? ""}
            onChange={(e) => handleChange("pendidikan", e.target.value)}
          >
            <MenuItem value="">
              <em>Belum diisi</em>
            </MenuItem>
            {JENJANG_PENDIDIKAN.map((jenjang) => (
              <MenuItem key={jenjang} value={jenjang}>
                {jenjang}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Jabatan Akademik"
            fullWidth
            value={form.jabatan ?? ""}
            onChange={(e) => handleChange("jabatan", e.target.value)}
          >
            <MenuItem value="">
              <em>Belum diisi</em>
            </MenuItem>
            {JABATAN_AKADEMIK.map((jabatan) => (
              <MenuItem key={jabatan} value={jabatan}>
                {jabatan}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ gridColumn: "1 / -1" }}>
            <TextField
              label="Bidang Keahlian"
              placeholder="Artificial Intelligence, Software Engineering"
              fullWidth
              value={form.bidangKeahlian ?? ""}
              onChange={(e) => handleChange("bidangKeahlian", e.target.value)}
            />
          </Box>
          <TextField
            label="Program Studi (Homebase)"
            fullWidth
            value={form.prodi ?? ""}
            onChange={(e) => handleChange("prodi", e.target.value)}
          />
          <TextField
            select
            label="Status Kepegawaian"
            fullWidth
            value={form.status ?? ""}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <MenuItem value="">
              <em>Belum diisi</em>
            </MenuItem>
            {STATUS_KEPEGAWAIAN.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Batal
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
