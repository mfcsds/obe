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
  IconButton,
  Chip,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import EditKurikulumDialog from '@/components/kurikulum/EditKurikulumDialog';

const kurikulumList = [
  { id: 1, nama: 'Kurikulum OBE 2024', tahunAkademik: '2024/2025', semesterMulai: 'Ganjil 2024', totalSKS: 144, jumlahCPL: 12, jumlahCPMK: 85, jumlahMK: 48, status: 'Aktif' },
  { id: 2, nama: 'Kurikulum OBE 2020', tahunAkademik: '2020/2021', semesterMulai: 'Ganjil 2020', totalSKS: 144, jumlahCPL: 10, jumlahCPMK: 75, jumlahMK: 45, status: 'Non Aktif' },
  { id: 3, nama: 'Kurikulum OBE 2018', tahunAkademik: '2018/2019', semesterMulai: 'Ganjil 2018', totalSKS: 144, jumlahCPL: 9, jumlahCPMK: 70, jumlahMK: 42, status: 'Non Aktif' },
];

export default function KurikulumPage() {
  const [openDialog, setOpenDialog] = useState(false);

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

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nama Kurikulum</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Tahun Akademik</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Semester Mulai</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Total SKS</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Jml CPL</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Jml CPMK</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Jml MK</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kurikulumList.map((kurikulum) => (
                <TableRow key={kurikulum.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{kurikulum.nama}</TableCell>
                  <TableCell>{kurikulum.tahunAkademik}</TableCell>
                  <TableCell>{kurikulum.semesterMulai}</TableCell>
                  <TableCell align="center">{kurikulum.totalSKS}</TableCell>
                  <TableCell align="center">{kurikulum.jumlahCPL}</TableCell>
                  <TableCell align="center">{kurikulum.jumlahCPMK}</TableCell>
                  <TableCell align="center">{kurikulum.jumlahMK}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={kurikulum.status}
                      color={kurikulum.status === 'Aktif' ? 'success' : 'default'}
                      size="small"
                      variant={kurikulum.status === 'Aktif' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" component={Link} href={`/kurikulum/${kurikulum.id}`}>
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

      <EditKurikulumDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
}
