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
  { id: 1, nama: 'Kurikulum OBE 2024', tahunAkademik: '2024/2025', jumlahCPL: 12, jumlahCPMK: 85, jumlahMK: 48, status: 'Aktif' },
  { id: 2, nama: 'Kurikulum OBE 2020', tahunAkademik: '2020/2021', jumlahCPL: 10, jumlahCPMK: 75, jumlahMK: 45, status: 'Non Aktif' },
  { id: 3, nama: 'Kurikulum OBE 2018', tahunAkademik: '2018/2019', jumlahCPL: 9, jumlahCPMK: 70, jumlahMK: 42, status: 'Non Aktif' },
];

export default function KurikulumPage() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">Daftar Kurikulum</Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)}>
            Buat Kurikulum Baru
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nama Kurikulum</strong></TableCell>
                <TableCell><strong>Tahun Akademik</strong></TableCell>
                <TableCell><strong>Jumlah CPL</strong></TableCell>
                <TableCell><strong>Jumlah CPMK</strong></TableCell>
                <TableCell><strong>Jumlah Mata Kuliah</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Aksi</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kurikulumList.map((kurikulum) => (
                <TableRow key={kurikulum.id} hover>
                  <TableCell>{kurikulum.nama}</TableCell>
                  <TableCell>{kurikulum.tahunAkademik}</TableCell>
                  <TableCell>{kurikulum.jumlahCPL}</TableCell>
                  <TableCell>{kurikulum.jumlahCPMK}</TableCell>
                  <TableCell>{kurikulum.jumlahMK}</TableCell>
                  <TableCell>
                    <Chip 
                      label={kurikulum.status} 
                      color={kurikulum.status === 'Aktif' ? 'success' : 'default'} 
                      size="small" 
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
    </Container>
  );
}
