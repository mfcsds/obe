"use client";

import {
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';
import AddDosenDialog from '@/components/dosen/AddDosenDialog';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';

interface Dosen {
  id: number;
  nama: string;
  nidn: string;
  email: string;
  jabatan: string;
  pendidikan: string;
  bidangKeahlian: string;
  prodi: string;
  status: string;
}

const dosenData: Dosen[] = [
  { id: 1, nama: 'Dr. Ahmad Fauzi, M.Kom', nidn: '0123456789', email: 'ahmad.fauzi@yarsi.ac.id', jabatan: 'Lektor Kepala', pendidikan: 'S3', bidangKeahlian: 'Artificial Intelligence', prodi: 'Teknik Informatika', status: 'Tetap PT' },
  { id: 2, nama: 'Siti Nurhaliza, S.Kom., M.T', nidn: '0987654321', email: 'siti.nurhaliza@yarsi.ac.id', jabatan: 'Asisten Ahli', pendidikan: 'S2', bidangKeahlian: 'Software Engineering', prodi: 'Teknik Informatika', status: 'Tetap PT' },
];

export default function DosenPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDosen = dosenData.filter((dosen) =>
    dosen.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dosen.nidn.includes(searchTerm) ||
    dosen.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: DataTableColumn<Dosen>[] = [
    {
      key: 'nama',
      label: 'Nama',
      render: (dosen) => (
        <Box>
          {dosen.nama}
          <Typography variant="caption" display="block" color="text.secondary">
            {dosen.email}
          </Typography>
        </Box>
      ),
    },
    { key: 'nidn', label: 'NIDN' },
    { key: 'pendidikan', label: 'Pendidikan' },
    { key: 'jabatan', label: 'Jabatan Akademik' },
    { key: 'bidangKeahlian', label: 'Bidang Keahlian' },
    {
      key: 'status',
      label: 'Status',
      render: (dosen) => <Chip label={dosen.status} color="primary" size="small" variant="outlined" />,
    },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'center',
      render: (dosen) => (
        <>
          <IconButton size="small" color="info" component={Link} href={`/dosen/${dosen.id}`}>
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

      <DataTable
        columns={columns}
        rows={filteredDosen}
        getRowKey={(dosen) => dosen.id}
        withPaper
        emptyMessage="Tidak ada dosen yang cocok dengan pencarian."
      />

      <AddDosenDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
}
