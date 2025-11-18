"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';

interface EditKurikulumDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function EditKurikulumDialog({ open, onClose }: EditKurikulumDialogProps) {
  const handleSubmit = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Buat Kurikulum Baru</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="Nama Kurikulum" required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Tahun Akademik" placeholder="2024/2025" required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Deskripsi" multiline rows={3} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit}>Buat Kurikulum</Button>
      </DialogActions>
    </Dialog>
  );
}
