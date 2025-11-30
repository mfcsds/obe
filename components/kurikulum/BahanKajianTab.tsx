"use client";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';

const bahanKajianData = [
  {
    section: 'A. Bahan Kajian Wajib Informatika*', items: [
      { id: 1, kode: 'BK01', nama: 'Social Issues and Professional Practice', min: 2, max: 4 },
      { id: 2, kode: 'BK02', nama: 'Project Management', min: 2, max: 3 },
      { id: 3, kode: 'BK03', nama: 'User Experience Design', min: 2, max: 4 },
      { id: 4, kode: 'BK04', nama: 'Data and Information Management', min: 2, max: 4 },
      { id: 5, kode: 'BK05', nama: 'Parallel and Distributed Computing', min: 2, max: 4 },
      { id: 6, kode: 'BK06', nama: 'Computer Networks', min: 2, max: 4 },
      { id: 7, kode: 'BK07', nama: 'Software Design', min: 2, max: 4 },
      { id: 8, kode: 'BK08', nama: 'Operating Systems', min: 3, max: 5 },
      { id: 9, kode: 'BK09', nama: 'Data Structures, Algorithms and Complexity', min: 4, max: 5 },
      { id: 10, kode: 'BK10', nama: 'Programming Languages', min: 3, max: 5 },
      { id: 11, kode: 'BK11', nama: 'Programming Fundamentals', min: 4, max: 5 },
      { id: 12, kode: 'BK12', nama: 'Computing Systems Fundamentals', min: 2, max: 3 },
      { id: 13, kode: 'BK13', nama: 'Architecture and Organization', min: 3, max: 4 },
      { id: 14, kode: 'BK14', nama: 'Graphics and Visualization', min: 2, max: 4 },
      { id: 15, kode: 'BK15', nama: 'Intelligent Systems', min: 3, max: 5 },
      { id: 16, kode: 'BK16', nama: 'Platform-based Development', min: 2, max: 4 },
      { id: 17, kode: 'BK17', nama: 'Cyber Security', min: 1, max: 3 },
    ]
  },
  {
    section: 'B. BK Tambahan (Opsional) Bidang Informatika**', items: [
      { id: 18, kode: 'BK18', nama: 'Computational Science', min: 2, max: 3 },
      { id: 19, kode: 'BK19', nama: 'Discrete Structures', min: 2, max: 3 },
      { id: 20, kode: 'BK20', nama: 'Human-Computer Interaction', min: 2, max: 3 },
      { id: 21, kode: 'BK21', nama: 'Software Development Fundamentals', min: 2, max: 3 },
      { id: 22, kode: 'BK22', nama: 'Software Engineering', min: 2, max: 3 },
      { id: 23, kode: 'BK23', nama: 'Systems Analysis & Design', min: 2, max: 3 },
      { id: 24, kode: 'BK24', nama: 'Software Quality, Verification and Validation', min: 2, max: 3 },
      { id: 25, kode: 'BK25', nama: 'Software Modeling and Analysis', min: 2, max: 3 },
    ]
  },
  {
    section: 'C. BK Wajib SN Dikti', items: [
      { id: 26, kode: 'BK26', nama: 'Pengembangan Diri', min: 2, max: 2 },
    ]
  },
  {
    section: 'D. BK Wajib Umum', items: [
      { id: 27, kode: 'BK27', nama: 'Metodologi Penelitian', min: 2, max: 6 },
    ]
  },
];

export default function BahanKajianTab() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setOpenDialog(true);
  };

  const handleAdd = () => {
    setSelectedData(null);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedData(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Box sx={{ typography: 'h5', fontWeight: 'bold', color: 'primary.main' }}>Bahan Kajian (BK)</Box>
          <Box sx={{ typography: 'body1', color: 'text.secondary', mt: 1 }}>
            Daftar bahan kajian yang menjadi dasar pembentukan mata kuliah.
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Tambah Bahan Kajian
        </Button>
      </Box>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell width="5%" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>No</TableCell>
                <TableCell width="10%" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Kode BK</TableCell>
                <TableCell width="50%" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Bahan Kajian</TableCell>
                <TableCell colSpan={2} align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Bobot Kepentingan</TableCell>
                <TableCell width="10%" align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} sx={{ bgcolor: 'primary.light' }}></TableCell>
                <TableCell width="10%" align="center" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 'bold' }}>Min</TableCell>
                <TableCell width="10%" align="center" sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 'bold' }}>Max</TableCell>
                <TableCell sx={{ bgcolor: 'primary.light' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bahanKajianData.map((section, sectionIndex) => (
                <>
                  <TableRow key={`section-${sectionIndex}`}>
                    <TableCell colSpan={6} sx={{ bgcolor: 'grey.100', fontWeight: 'bold', borderTop: '1px solid', borderColor: 'divider' }}>
                      {section.section}
                    </TableCell>
                  </TableRow>
                  {section.items.map((item, itemIndex) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{itemIndex + 1}</TableCell>
                      <TableCell>{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell align="center">{item.min}</TableCell>
                      <TableCell align="center">{item.max}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(item)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedData ? 'Edit Bahan Kajian' : 'Tambah Bahan Kajian'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField
              fullWidth
              label="Kode BK"
              defaultValue={selectedData?.kode}
              placeholder="BK01"
              required
            />
            <TextField
              fullWidth
              label="Nama Bahan Kajian"
              defaultValue={selectedData?.nama}
              required
            />
            <FormControl fullWidth required>
              <InputLabel>Kategori</InputLabel>
              <Select label="Kategori" defaultValue="">
                <MenuItem value="A">A. Bahan Kajian Wajib Informatika</MenuItem>
                <MenuItem value="B">B. BK Tambahan (Opsional) Bidang Informatika</MenuItem>
                <MenuItem value="C">C. BK Wajib SN Dikti</MenuItem>
                <MenuItem value="D">D. BK Wajib Umum</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Bobot Min"
                type="number"
                defaultValue={selectedData?.min}
                required
              />
              <TextField
                fullWidth
                label="Bobot Max"
                type="number"
                defaultValue={selectedData?.max}
                required
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button variant="contained" onClick={handleClose}>Simpan</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
