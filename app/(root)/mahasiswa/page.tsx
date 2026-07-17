"use client";

import {
  Typography,
  Box,
  Button,
  Paper,
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
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';
import { exportRowsToCsv } from '@/lib/csv-export';

interface Mahasiswa {
  id: number;
  nim: string;
  nama: string;
  prodi: string;
  angkatan: number;
  semester: number;
  statusAwal: string;
  sksTempuh: number;
  ipk: number;
  status: string;
}

const mahasiswaData: Mahasiswa[] = [
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

  const filteredMahasiswa = mahasiswaData.filter((mhs) => {
    const matchSearch = mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) || mhs.nim.includes(searchTerm);
    const matchAngkatan = filterAngkatan ? mhs.angkatan.toString() === filterAngkatan : true;
    const matchStatus = filterStatus ? mhs.status === filterStatus : true;
    const matchStatusAwal = filterStatusAwal ? mhs.statusAwal === filterStatusAwal : true;
    return matchSearch && matchAngkatan && matchStatus && matchStatusAwal;
  });

  const handleExport = () => {
    exportRowsToCsv(
      filteredMahasiswa,
      [
        { header: 'NIM', getValue: (m) => m.nim },
        { header: 'Nama', getValue: (m) => m.nama },
        { header: 'Prodi', getValue: (m) => m.prodi },
        { header: 'Angkatan', getValue: (m) => m.angkatan },
        { header: 'Semester', getValue: (m) => m.semester },
        { header: 'Status Awal', getValue: (m) => m.statusAwal },
        { header: 'SKS Tempuh', getValue: (m) => m.sksTempuh },
        { header: 'IPK', getValue: (m) => m.ipk },
        { header: 'Status', getValue: (m) => m.status },
      ],
      'data_mahasiswa.csv'
    );
  };

  const uniqueAngkatan = [...new Set(mahasiswaData.map(m => m.angkatan))].sort((a, b) => b - a);
  const uniqueStatus = [...new Set(mahasiswaData.map(m => m.status))];
  const uniqueStatusAwal = [...new Set(mahasiswaData.map(m => m.statusAwal))];

  const columns: DataTableColumn<Mahasiswa>[] = [
    { key: 'nim', label: 'NIM' },
    { key: 'nama', label: 'Nama' },
    { key: 'prodi', label: 'Prodi' },
    { key: 'angkatan', label: 'Angkatan', align: 'center' },
    { key: 'semester', label: 'Semester', align: 'center' },
    { key: 'statusAwal', label: 'Status Awal' },
    { key: 'sksTempuh', label: 'SKS Tempuh', align: 'center' },
    {
      key: 'ipk',
      label: 'IPK',
      align: 'center',
      render: (mhs) => (
        <Chip
          label={mhs.ipk}
          color={mhs.ipk >= 3.5 ? 'success' : mhs.ipk >= 3.0 ? 'primary' : 'warning'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (mhs) => <Chip label={mhs.status} color="success" size="small" />,
    },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'center',
      render: (mhs) => (
        <>
          <IconButton size="small" color="info" component={Link} href={`/mahasiswa/${mhs.id}`}>
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton size="small" color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error">
            <Delete fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

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

      <DataTable
        columns={columns}
        rows={filteredMahasiswa}
        getRowKey={(mhs) => mhs.id}
        withPaper
        emptyMessage="Tidak ada mahasiswa yang cocok dengan filter."
      />

      <AddMahasiswaDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
}
