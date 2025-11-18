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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';

const profilLulusanData = [
  { 
    id: 1, 
    kode: 'PL01', 
    profil: 'Lulusan mampu bertindak sebagai profesional yang mampu belajar sepanjang hayat, Smart, Compassionate, dan Reliable', 
    kategori: 'S', 
    profesi: '1. Network & System Administrator\n2. Network Engineer\n3. Cloud Computing Engineer\n4. Web Master & Dev Ops, Software Engineer\n5. Web Developer\n6. Mobile Developer\n7. Game Developer\n8. Machine Learning Developer and AI Engineer' 
  },
  { 
    id: 2, 
    kode: 'PL02', 
    profil: 'Lulusan mampu mengidentifikasi pengetahuan, prinsip, standar, dan langkah-langkah yang perlu dilakukan, dalam disiplin computing atau bidang relevan lainnya, untuk mendesain solusi teknologi informasi sesuai dengan kebutuhan pengguna di dalam atau luar negeri.', 
    kategori: 'P', 
    profesi: '' 
  },
  { 
    id: 3, 
    kode: 'PL03', 
    profil: 'Lulusan mampu berpikir logis, kritis serta sistematis dalam memanfaatkan pengetahuan yang dimilikinya dalam menyelesaikan masalah nyata.', 
    kategori: 'KU', 
    profesi: '' 
  },
  { 
    id: 4, 
    kode: 'PL04', 
    profil: 'Lulusan mampu mendesain, mengevaluasi, dan mengimplementasikan solusi computing sesuai kebutuhan pengguna dalam bidang sistem terdistribusi, rekayasa perangkat lunak, atau kecerdasan buatan dengan mempertimbangkan performa dan keamanan yang berstandar nasional dan internasional', 
    kategori: 'KK', 
    profesi: '' 
  },
];

export default function ProfilLulusanTab() {
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
          <Box sx={{ typography: 'h6' }}>Profil Lulusan</Box>
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Definisikan profil lulusan program studi yang menggambarkan kompetensi yang diharapkan dimiliki oleh lulusan.
          </Box>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Tambah Profil
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%"><strong>No</strong></TableCell>
              <TableCell width="10%"><strong>Kode PL</strong></TableCell>
              <TableCell width="35%"><strong>Profil Lulusan (PL)</strong></TableCell>
              <TableCell width="10%"><strong>Kategori</strong></TableCell>
              <TableCell width="30%"><strong>Profesi</strong></TableCell>
              <TableCell width="10%" align="center"><strong>Aksi</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profilLulusanData.map((item, index) => (
              <TableRow key={item.id} hover>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.kode}</TableCell>
                <TableCell>{item.profil}</TableCell>
                <TableCell>{item.kategori}</TableCell>
                <TableCell sx={{ whiteSpace: 'pre-line' }}>{item.profesi}</TableCell>
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
        <DialogTitle>{selectedData ? 'Edit Profil Lulusan' : 'Tambah Profil Lulusan'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }}>
            <TextField 
              fullWidth 
              label="Kode PL" 
              defaultValue={selectedData?.kode} 
              placeholder="PL01"
              required 
            />
            <TextField 
              fullWidth 
              label="Profil Lulusan (PL)" 
              multiline 
              rows={5}
              defaultValue={selectedData?.profil}
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
            <TextField 
              fullWidth 
              label="Profesi" 
              multiline 
              rows={7}
              defaultValue={selectedData?.profesi}
              placeholder="1. Network & System Administrator&#10;2. Network Engineer&#10;3. Cloud Computing Engineer"
            />
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
