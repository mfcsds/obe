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
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';

const cplData = [
  { id: 1, kode: 'CPL01', deskripsi: 'Menjadi muslim yang Smart: cerdas, profesional, pandai (fathonah); Compasionate: menyampaikan (tabligh), berakhlak baik, bersyukur, pemaaf, sabar, santun, dan bijak; dan Reliable: bertanggung jawab, kuat, jujur, benar, dan dapat dipercaya (shiddiq dan amanah)', kategori: 'S' },
  { id: 2, kode: 'CPL02', deskripsi: 'Mampu mencari dan menentukan pengetahuan, algoritma, prinsip, standar, dan langkah-langkah computing untuk memecahkan permasalahan yang dihadapi pengguna di dalam atau luar negeri.', kategori: 'P' },
  { id: 3, kode: 'CPL03', deskripsi: 'Mampu mengidentifikasi langkah-langkah yang dibutuhkan untuk mendesain solusi teknologi informasi dan mengelola pengerjaannya dengan mempertimbangkan berbagai bidang ilmu terkait.', kategori: 'P' },
  { id: 4, kode: 'CPL04', deskripsi: 'Memahami konsep teoritis informatika dan cara mentransfer pengetahuannya ke domain permasalahan yang berbeda.', kategori: 'P' },
  { id: 5, kode: 'CPL05', deskripsi: 'Mampu memelihara dan mengembangkan jaringan kerja dengan pembimbing, kolega, sejawat baik di dalam maupun luar lembaganya dengan menjunjung akhlak seorang muslim', kategori: 'KU' },
  { id: 6, kode: 'CPL06', deskripsi: 'Mampu menunjukkan kinerja terukur yang terdokumentasi dalam memahami dan mendesain solusi dari suatu permasalahan dengan menggunakan prinsip-prinsip saintifik berasaskan ruhul Islam', kategori: 'KU' },
  { id: 7, kode: 'CPL07', deskripsi: 'Mampu menerapkan keterampilan dasar sebagai seorang muslim yang merupakan bagian dari kewarganegaraan global', kategori: 'KU' },
  { id: 8, kode: 'CPL08', deskripsi: 'Mampu mengimplementasikan kebutuhan computing dengan mempertimbangkan berbagai metode/algoritma yang sesuai.', kategori: 'KK' },
  { id: 9, kode: 'CPL09', deskripsi: 'Mampu merancang, menganalisis, dan mengevaluasi antarmuka dan aplikasi interaktif dengan mempertimbangkan kebutuhan pengguna serta berbagai disiplin keilmuan terkait.', kategori: 'KK' },
  { id: 10, kode: 'CPL10', deskripsi: 'Mampu mendesain dan mengevaluasi solusi computing multi-platform yang memenuhi kebutuhan pengguna di dalam atau luar negeri.', kategori: 'KK' },
];

export default function CPLProdiTab() {
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Box sx={{ typography: 'h6' }}>Capaian Pembelajaran Lulusan (CPL Prodi)</Box>
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Daftar CPL yang harus dicapai oleh lulusan program studi.
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Tambah CPL
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%"><strong>No</strong></TableCell>
              <TableCell width="10%"><strong>Kode CPL</strong></TableCell>
              <TableCell width="65%"><strong>Deskripsi CPL</strong></TableCell>
              <TableCell width="10%"><strong>Kategori</strong></TableCell>
              <TableCell width="10%" align="center"><strong>Aksi</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cplData.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.kode}</TableCell>
                <TableCell>{item.deskripsi}</TableCell>
                <TableCell>{item.kategori}</TableCell>
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
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedData ? 'Edit CPL Prodi' : 'Tambah CPL Prodi'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              fullWidth 
              label="Kode CPL" 
              defaultValue={selectedData?.kode} 
              placeholder="CPL01"
              required 
            />
            <TextField 
              fullWidth 
              label="Deskripsi CPL" 
              multiline 
              rows={6}
              defaultValue={selectedData?.deskripsi}
              required 
            />
            <FormControl fullWidth required>
              <InputLabel>Kategori</InputLabel>
              <Select label="Kategori" defaultValue={selectedData?.kategori || ''}>
                <MenuItem value="S">S - Sikap</MenuItem>
                <MenuItem value="P">P - Pengetahuan</MenuItem>
                <MenuItem value="KU">KU - Keterampilan Umum</MenuItem>
                <MenuItem value="KK">KK - Keterampilan Khusus</MenuItem>
              </Select>
            </FormControl>
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
