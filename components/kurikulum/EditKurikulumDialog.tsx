"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          <Box>
            <TextField fullWidth label="Nama Kurikulum" required />
          </Box>
          <Box>
            <TextField fullWidth label="Tahun Akademik" placeholder="2024/2025" required />
          </Box>
          <Box>
            <TextField fullWidth label="Deskripsi" multiline rows={3} />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={handleSubmit}>Buat Kurikulum</Button>
      </DialogActions>
    </Dialog>
  );
}
