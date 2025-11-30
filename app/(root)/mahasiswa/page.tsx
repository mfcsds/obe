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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility, Download } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import AddMahasiswaDialog from '@/components/mahasiswa/AddMahasiswaDialog';

const mahasiswaData = [
  { id: 1, nim: '2021001', nama: 'Budi Santoso', prodi: 'Teknik Informatika', angkatan: 2021, semester: 6, statusAwal: 'Peserta Didik Baru', sksTempuh: 120, ipk: 3.75, status: 'Aktif' },
  { id: 2, nim: '2021002', nama: 'Siti Aminah', prodi: 'Teknik Informatika', angkatan: 2021, semester: 6, statusAwal: 'Peserta Didik Baru', sksTempuh: 122, ipk: 3.85, status: 'Aktif' },
  { id: 3, nim: '2022015', nama: 'Ahmad Rizki', prodi: 'Teknik Informatika', angkatan: 2022, semester: 4, statusAwal: 'Pindahan', sksTempuh: 80, ipk: 3.50, status: 'Aktif' },
];

export default function MahasiswaPage() {
  const [filterAngkatan, setFilterAngkatan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterStatusAwal, setFilterStatusAwal] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleExport = () => {
    const headers = ['NIM', 'Nama', 'Prodi', 'Angkatan', 'Semester', 'Status Awal', 'SKS Tempuh', 'IPK', 'Status'];
    const csvContent = [
      headers.join(','),
      ...mahasiswaData.filter(m => {
        const matchSearch = m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.nim.includes(searchTerm);
        const matchAngkatan = filterAngkatan ? m.angkatan.toString() === filterAngkatan : true;
        const matchStatus = filterStatus ? m.status === filterStatus : true;
        const matchStatusAwal = filterStatusAwal ? m.statusAwal === filterStatusAwal : true;
        return matchSearch && matchAngkatan && matchStatus && matchStatusAwal;
      }).map(m => [
        m.nim,
        `"${m.nama}"`,
        `"${m.prodi}"`,
        m.angkatan,
        m.semester,
        `"${m.statusAwal}"`,
        m.sksTempuh,
        m.ipk,
        m.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data_mahasiswa.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const uniqueAngkatan = [...new Set(mahasiswaData.map(m => m.angkatan))].sort((a, b) => b - a);
  const uniqueStatus = [...new Set(mahasiswaData.map(m => m.status))];
  const uniqueStatusAwal = [...new Set(mahasiswaData.map(m => m.statusAwal))];

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary.main">Daftar Mahasiswa</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kelola data mahasiswa aktif dan status akademik untuk keperluan akreditasi.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Download />} onClick={handleExport}>
            Export Excel
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Tambah Mahasiswa
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            size="small"
          />
          <FormControl size="small" fullWidth>
            <InputLabel>Angkatan</InputLabel>
            <Select
              value={filterAngkatan}
              label="Angkatan"
              onChange={(e) => setFilterAngkatan(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              {uniqueAngkatan.map((angkatan) => (
                <MenuItem key={angkatan} value={angkatan.toString()}>{angkatan}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              label="Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              {uniqueStatus.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth>
            <InputLabel>Status Awal</InputLabel>
            <Select
              value={filterStatusAwal}
              label="Status Awal"
              onChange={(e) => setFilterStatusAwal(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              {uniqueStatusAwal.map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>NIM</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nama</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Prodi</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Angkatan</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Semester</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status Awal</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>SKS Tempuh</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>IPK</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mahasiswaData.filter(m => {
                const matchSearch = m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.nim.includes(searchTerm);
                const matchAngkatan = filterAngkatan ? m.angkatan.toString() === filterAngkatan : true;
                const matchStatus = filterStatus ? m.status === filterStatus : true;
                const matchStatusAwal = filterStatusAwal ? m.statusAwal === filterStatusAwal : true;
                return matchSearch && matchAngkatan && matchStatus && matchStatusAwal;
              }).map((mhs) => (
                <TableRow key={mhs.id} hover>
                  <TableCell>{mhs.nim}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{mhs.nama}</TableCell>
                  <TableCell>{mhs.prodi}</TableCell>
                  <TableCell align="center">{mhs.angkatan}</TableCell>
                  <TableCell align="center">{mhs.semester}</TableCell>
                  <TableCell>{mhs.statusAwal}</TableCell>
                  <TableCell align="center">{mhs.sksTempuh}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={mhs.ipk}
                      color={mhs.ipk >= 3.5 ? 'success' : mhs.ipk >= 3.0 ? 'primary' : 'warning'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
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
    </Box>
  );
}
