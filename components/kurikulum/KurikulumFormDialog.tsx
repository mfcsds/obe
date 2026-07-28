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
  Alert,
} from "@mui/material";
import { toast } from "sonner";
import {
  createKurikulumAction,
  updateKurikulumAction,
} from "@/lib/actions/kurikulum.actions";
import { KURIKULUM_STATUS, type Kurikulum, type KurikulumFormInput } from "@/types/kurikulum";

interface KurikulumFormDialogProps {
  open: boolean;
  onClose: () => void;
  /** Data yang sedang diedit; `null` berarti mode pembuatan baru. */
  kurikulum: Kurikulum | null;
}

const EMPTY_FORM: KurikulumFormInput = {
  nama: "",
  tahunAkademik: "",
  status: "Non Aktif",
};

/**
 * Dialog form untuk membuat maupun mengubah metadata kurikulum.
 *
 * Form ini sengaja hanya memuat nama, tahun akademik, dan status. Total SKS,
 * semester mulai, serta jumlah CPL/CPMK/mata kuliah adalah data turunan yang
 * terakumulasi otomatis dari pengisian di halaman detail kurikulum, jadi
 * tidak diisi manual di sini.
 *
 * Validasi final dilakukan di server action; di sini hanya menampilkan pesan
 * errornya agar tidak ada duplikasi aturan validasi.
 */
export function KurikulumFormDialog({
  open,
  onClose,
  kurikulum,
}: KurikulumFormDialogProps) {
  const [form, setForm] = useState<KurikulumFormInput>(EMPTY_FORM);
  const [isSubmitting, startTransition] = useTransition();
  const isEditMode = Boolean(kurikulum);

  // Menyelaraskan isi form saat dialog dibuka untuk data yang berbeda.
  useEffect(() => {
    if (!open) return;

    if (kurikulum) {
      setForm({
        nama: kurikulum.nama,
        tahunAkademik: kurikulum.tahunAkademik,
        status: kurikulum.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [open, kurikulum]);

  const handleChange = <K extends keyof KurikulumFormInput>(
    field: K,
    value: KurikulumFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = kurikulum
        ? await updateKurikulumAction(kurikulum.id, form)
        : await createKurikulumAction(form);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(
        isEditMode ? "Kurikulum berhasil diperbarui." : "Kurikulum berhasil dibuat."
      );
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">
        {isEditMode ? "Ubah Kurikulum" : "Buat Kurikulum Baru"}
      </DialogTitle>
      <DialogContent dividers>
        {!isEditMode && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Total SKS, jumlah CPL, CPMK, dan mata kuliah akan terisi otomatis
            saat Anda melengkapi kurikulum ini di halaman detail.
          </Alert>
        )}

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <TextField
            label="Nama Kurikulum"
            placeholder="Kurikulum OBE 2024"
            fullWidth
            required
            autoFocus
            value={form.nama}
            onChange={(e) => handleChange("nama", e.target.value)}
          />
          <TextField
            label="Tahun Akademik"
            placeholder="2024/2025"
            fullWidth
            required
            value={form.tahunAkademik}
            onChange={(e) => handleChange("tahunAkademik", e.target.value)}
            helperText="Format: YYYY/YYYY"
          />
          <TextField
            select
            label="Status"
            fullWidth
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value as KurikulumFormInput["status"])
            }
            helperText="Kurikulum aktif adalah yang sedang berjalan saat ini"
          >
            {KURIKULUM_STATUS.map((status) => (
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
