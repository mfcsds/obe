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
import Link from 'next/link';
import { useState } from 'react';
import AddDosenDialog from '@/components/dosen/AddDosenDialog';

const dosenData = [
  { id: 1, nama: 'Dr. Ahmad Fauzi, M.Kom', nidn: '0123456789', email: 'ahmad.fauzi@yarsi.ac.id', jabatan: 'Lektor Kepala', prodi: 'Teknik Informatika', status: 'Tetap PT' },
  { id: 2, nama: 'Siti Nurhaliza, S.Kom., M.T', nidn: '0987654321', email: 'siti.nurhaliza@yarsi.ac.id', jabatan: 'Asisten Ahli', prodi: 'Teknik Informatika', status: 'Tetap PT' },
];

export default function DosenPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">Daftar Dosen</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Tambah Dosen
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Cari dosen berdasarkan nama, NIDN, atau email..."
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
                <TableCell><strong>Nama</strong></TableCell>
                <TableCell><strong>NIDN</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Jabatan</strong></TableCell>
                <TableCell><strong>Prodi</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Aksi</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dosenData.filter(d => 
                d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.nidn.includes(searchTerm) ||
                d.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((dosen) => (
                <TableRow key={dosen.id} hover>
                  <TableCell>{dosen.nama}</TableCell>
                  <TableCell>{dosen.nidn}</TableCell>
                  <TableCell>{dosen.email}</TableCell>
                  <TableCell>{dosen.jabatan}</TableCell>
                  <TableCell>{dosen.prodi}</TableCell>
                  <TableCell>
                    <Chip label={dosen.status} color="primary" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="info" component={Link} href={`/dosen/${dosen.id}`}>
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

      <AddDosenDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Container>
  );
}
