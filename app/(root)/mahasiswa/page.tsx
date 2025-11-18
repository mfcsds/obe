"use client";

import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import AddMahasiswaDialog from '@/components/mahasiswa/AddMahasiswaDialog';

const mahasiswaData = [
  { id: 1, nim: '2021001', nama: 'Budi Santoso', prodi: 'Teknik Informatika', angkatan: 2021, semester: 6, ipk: 3.75, status: 'Aktif' },
  { id: 2, nim: '2021002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', angkatan: 2021, semester: 6, ipk: 3.85, status: 'Aktif' },
  { id: 3, nim: '2022015', nama: 'Ahmad Rizki', prodi: 'Teknik Informatika', angkatan: 2022, semester: 4, ipk: 3.50, status: 'Aktif' },
];

export default function MahasiswaPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">Daftar Mahasiswa</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Tambah Mahasiswa
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>NIM</strong></TableCell>
                <TableCell><strong>Nama</strong></TableCell>
                <TableCell><strong>Prodi</strong></TableCell>
                <TableCell><strong>Angkatan</strong></TableCell>
                <TableCell><strong>Semester</strong></TableCell>
                <TableCell><strong>IPK</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Aksi</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mahasiswaData.filter(m => 
                m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.nim.includes(searchTerm)
              ).map((mhs) => (
                <TableRow key={mhs.id} hover>
                  <TableCell>{mhs.nim}</TableCell>
                  <TableCell>{mhs.nama}</TableCell>
                  <TableCell>{mhs.prodi}</TableCell>
                  <TableCell>{mhs.angkatan}</TableCell>
                  <TableCell>{mhs.semester}</TableCell>
                  <TableCell>{mhs.ipk}</TableCell>
                  <TableCell>
                    <Chip label={mhs.status} color="success" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="info" component={Link} href={`/mahasiswa/${mhs.id}`}>
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
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
      </Paper>

      <AddMahasiswaDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Container>
  );
}
