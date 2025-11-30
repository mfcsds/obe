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
  { id: 1, nama: 'Dr. Ahmad Fauzi, M.Kom', nidn: '0123456789', email: 'ahmad.fauzi@yarsi.ac.id', jabatan: 'Lektor Kepala', pendidikan: 'S3', bidangKeahlian: 'Artificial Intelligence', prodi: 'Teknik Informatika', status: 'Tetap PT' },
  { id: 2, nama: 'Siti Nurhaliza, S.Kom., M.T', nidn: '0987654321', email: 'siti.nurhaliza@yarsi.ac.id', jabatan: 'Asisten Ahli', pendidikan: 'S2', bidangKeahlian: 'Software Engineering', prodi: 'Teknik Informatika', status: 'Tetap PT' },
];

export default function DosenPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.main">Daftar Dosen</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kelola data dosen tetap program studi (DTPS) untuk keperluan akreditasi.
          </Typography>
        </Box>
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
          sx={{ bgcolor: 'background.paper' }}
        />
      </Box>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nama</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>NIDN</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Pendidikan</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Jabatan Akademik</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Bidang Keahlian</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dosenData.filter(d =>
                d.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.nidn.includes(searchTerm) ||
                d.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((dosen) => (
                <TableRow key={dosen.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>
                    <Box>
                      {dosen.nama}
                      <Typography variant="caption" display="block" color="text.secondary">{dosen.email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{dosen.nidn}</TableCell>
                  <TableCell>{dosen.pendidikan}</TableCell>
                  <TableCell>{dosen.jabatan}</TableCell>
                  <TableCell>{dosen.bidangKeahlian}</TableCell>
                  <TableCell>
                    <Chip label={dosen.status} color="primary" size="small" variant="outlined" />
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
    </Box>
  );
}
