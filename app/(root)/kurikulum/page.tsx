"use client";

import {
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import EditKurikulumDialog from '@/components/kurikulum/EditKurikulumDialog';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';

interface Kurikulum {
  id: number;
  nama: string;
  tahunAkademik: string;
  semesterMulai: string;
  totalSKS: number;
  jumlahCPL: number;
  jumlahCPMK: number;
  jumlahMK: number;
  status: string;
}

const kurikulumList: Kurikulum[] = [
  { id: 1, nama: 'Kurikulum OBE 2024', tahunAkademik: '2024/2025', semesterMulai: 'Ganjil 2024', totalSKS: 144, jumlahCPL: 12, jumlahCPMK: 85, jumlahMK: 48, status: 'Aktif' },
  { id: 2, nama: 'Kurikulum OBE 2020', tahunAkademik: '2020/2021', semesterMulai: 'Ganjil 2020', totalSKS: 144, jumlahCPL: 10, jumlahCPMK: 75, jumlahMK: 45, status: 'Non Aktif' },
  { id: 3, nama: 'Kurikulum OBE 2018', tahunAkademik: '2018/2019', semesterMulai: 'Ganjil 2018', totalSKS: 144, jumlahCPL: 9, jumlahCPMK: 70, jumlahMK: 42, status: 'Non Aktif' },
];

export default function KurikulumPage() {
  const [openDialog, setOpenDialog] = useState(false);

  const columns: DataTableColumn<Kurikulum>[] = [
    { key: 'nama', label: 'Nama Kurikulum' },
    { key: 'tahunAkademik', label: 'Tahun Akademik' },
    { key: 'semesterMulai', label: 'Semester Mulai' },
    { key: 'totalSKS', label: 'Total SKS', align: 'center' },
    { key: 'jumlahCPL', label: 'Jml CPL', align: 'center' },
    { key: 'jumlahCPMK', label: 'Jml CPMK', align: 'center' },
    { key: 'jumlahMK', label: 'Jml MK', align: 'center' },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (kurikulum) => (
        <Chip
          label={kurikulum.status}
          color={kurikulum.status === 'Aktif' ? 'success' : 'default'}
          size="small"
          variant={kurikulum.status === 'Aktif' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      key: 'aksi',
      label: 'Aksi',
      align: 'center',
      render: (kurikulum) => (
        <>
          <IconButton size="small" color="primary" component={Link} href={`/kurikulum/${kurikulum.id}`}>
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
          <Typography variant="h5" fontWeight="bold" color="primary.main">Daftar Kurikulum</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Kelola data kurikulum program studi berbasis Outcome Based Education (OBE).
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
          Buat Kurikulum Baru
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={kurikulumList}
        getRowKey={(kurikulum) => kurikulum.id}
        withPaper
      />

      <EditKurikulumDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
}
