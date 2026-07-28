"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Warna tombol konfirmasi; gunakan "error" untuk aksi destruktif. */
  confirmColor?: "primary" | "error";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog konfirmasi generik untuk aksi yang perlu persetujuan eksplisit,
 * khususnya aksi destruktif seperti hapus data. Dipakai bersama di seluruh
 * domain agar pola konfirmasi konsisten (lihat steering design-system.md).
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  confirmColor = "error",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight="bold">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onCancel} color="inherit" disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Memproses..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
