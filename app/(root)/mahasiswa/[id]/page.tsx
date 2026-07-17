"use client";

import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  School,
  Grade,
  Assignment,
  Work,
  LinkedIn,
  Instagram,
  GitHub,
} from '@mui/icons-material';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';

const mahasiswaProfile = {
  nim: '2021001',
  nama: 'Budi Santoso',
  email: 'budi.santoso@students.yarsi.ac.id',
  prodi: 'Teknik Informatika',
  angkatan: 2021,
  status: 'Aktif',
  socialMedia: {
    linkedin: 'linkedin.com/in/budisantoso',
    instagram: '@budi.santoso',
    tiktok: '@budisantoso',
    github: 'github.com/budisantoso',
  },
};

const statistik = [
  { label: 'Semester', value: 6, icon: School, color: '#1976d2' },
  { label: 'IPK', value: '3.75', icon: Grade, color: '#2e7d32' },
  { label: 'SKS Lulus', value: 120, icon: Assignment, color: '#ed6c02' },
  { label: 'Status', value: 'Aktif', icon: Work, color: '#9c27b0' },
];

interface Krs {
  id: number;
  semester: number;
  kode: string;
  matakuliah: string;
  sks: number;
  nilai: string;
  mutu: number;
}

interface Kkn {
  id: number;
  lokasi: string;
  periode: string;
  status: string;
  nilai: string;
}

interface Magang {
  id: number;
  perusahaan: string;
  posisi: string;
  periode: string;
  status: string;
  nilai: string;
}

interface Mbkm {
  id: number;
  program: string;
  kegiatan: string;
  periode: string;
  status: string;
}

interface Prestasi {
  id: number;
  nama: string;
  penyelenggara: string;
  tahun: number;
  tingkat: string;
}

const krsData: Krs[] = [
  { id: 1, semester: 6, kode: 'TIF601', matakuliah: 'Skripsi', sks: 6, nilai: 'A', mutu: 4.0 },
  { id: 2, semester: 6, kode: 'TIF602', matakuliah: 'Keamanan Sistem', sks: 3, nilai: 'A-', mutu: 3.7 },
  { id: 3, semester: 5, kode: 'TIF501', matakuliah: 'Machine Learning', sks: 3, nilai: 'A', mutu: 4.0 },
];

const skripsiData = {
  judul: 'Implementasi Machine Learning untuk Deteksi Penyakit Diabetes',
  pembimbing1: 'Dr. Ahmad Fauzi, M.Kom',
  pembimbing2: 'Siti Nurhaliza, S.Kom., M.T',
  status: 'Sedang Berjalan',
  tanggalMulai: '2023-09-01',
};

const kknData: Kkn[] = [
  { id: 1, lokasi: 'Desa Sukamaju, Bogor', periode: 'Juli - Agustus 2023', status: 'Selesai', nilai: 'A' },
];

const magangData: Magang[] = [
  { id: 1, perusahaan: 'PT. Tech Indonesia', posisi: 'Backend Developer', periode: 'Jan - Apr 2023', status: 'Selesai', nilai: 'A' },
];

const mbkmData: Mbkm[] = [
  { id: 1, program: 'Studi Independen - Dicoding', kegiatan: 'Backend Developer Path', periode: 'Sep - Des 2022', status: 'Selesai' },
];

const prestasiAkademik: Prestasi[] = [
  { id: 1, nama: 'Juara 1 Lomba Karya Tulis Ilmiah', penyelenggara: 'Universitas YARSI', tahun: 2023, tingkat: 'Universitas' },
  { id: 2, nama: 'Best Student Award', penyelenggara: 'Fakultas Teknik', tahun: 2022, tingkat: 'Fakultas' },
];

const prestasiNonAkademik: Prestasi[] = [
  { id: 1, nama: 'Juara 2 Hackathon Nasional', penyelenggara: 'Kemenkominfo', tahun: 2023, tingkat: 'Nasional' },
  { id: 2, nama: 'Finalis Kompetisi Web Design', penyelenggara: 'HMTI', tahun: 2022, tingkat: 'Regional' },
];

const krsColumns: DataTableColumn<Krs>[] = [
  { key: 'semester', label: 'Semester', align: 'center' },
  { key: 'kode', label: 'Kode' },
  { key: 'matakuliah', label: 'Mata Kuliah' },
  { key: 'sks', label: 'SKS', align: 'center' },
  {
    key: 'nilai',
    label: 'Nilai',
    render: (row) => <Chip label={row.nilai} color="success" size="small" variant="outlined" />,
  },
  { key: 'mutu', label: 'Mutu', align: 'center' },
];

const kknColumns: DataTableColumn<Kkn>[] = [
  { key: 'lokasi', label: 'Lokasi' },
  { key: 'periode', label: 'Periode' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Chip label={row.status} color="success" size="small" variant="outlined" />,
  },
  {
    key: 'nilai',
    label: 'Nilai',
    render: (row) => <Chip label={row.nilai} color="success" size="small" variant="outlined" />,
  },
];

const magangColumns: DataTableColumn<Magang>[] = [
  { key: 'perusahaan', label: 'Perusahaan' },
  { key: 'posisi', label: 'Posisi' },
  { key: 'periode', label: 'Periode' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Chip label={row.status} color="success" size="small" variant="outlined" />,
  },
  {
    key: 'nilai',
    label: 'Nilai',
    render: (row) => <Chip label={row.nilai} color="success" size="small" variant="outlined" />,
  },
];

const mbkmColumns: DataTableColumn<Mbkm>[] = [
  { key: 'program', label: 'Program' },
  { key: 'kegiatan', label: 'Kegiatan' },
  { key: 'periode', label: 'Periode' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Chip label={row.status} color="success" size="small" variant="outlined" />,
  },
];

const prestasiAkademikColumns: DataTableColumn<Prestasi>[] = [
  { key: 'nama', label: 'Nama Prestasi' },
  { key: 'penyelenggara', label: 'Penyelenggara' },
  { key: 'tahun', label: 'Tahun' },
  {
    key: 'tingkat',
    label: 'Tingkat',
    render: (row) => <Chip label={row.tingkat} color="primary" size="small" variant="outlined" />,
  },
];

const prestasiNonAkademikColumns: DataTableColumn<Prestasi>[] = [
  { key: 'nama', label: 'Nama Prestasi' },
  { key: 'penyelenggara', label: 'Penyelenggara' },
  { key: 'tahun', label: 'Tahun' },
  {
    key: 'tingkat',
    label: 'Tingkat',
    render: (row) => <Chip label={row.tingkat} color="secondary" size="small" variant="outlined" />,
  },
];

export default function ProfilMahasiswaPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40, fontWeight: 'bold' }}>
            {mahasiswaProfile.nama.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">{mahasiswaProfile.nama}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>NIM: {mahasiswaProfile.nim}</Typography>
            <Typography variant="body1" color="text.secondary">{mahasiswaProfile.email}</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Chip label={mahasiswaProfile.prodi} color="primary" />
              <Chip label={`Angkatan ${mahasiswaProfile.angkatan} `} variant="outlined" color="primary" />
              <Chip label={mahasiswaProfile.status} color="success" />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {mahasiswaProfile.socialMedia.linkedin && (
                <Chip icon={<LinkedIn />} label="LinkedIn" size="small" component="a" href={`https://${mahasiswaProfile.socialMedia.linkedin}`} target="_blank" clickable variant="outlined" />
              )}
              {
                mahasiswaProfile.socialMedia.instagram && (
                  <Chip icon={<Instagram />} label="Instagram" size="small" component="a" href={`https://instagram.com/${mahasiswaProfile.socialMedia.instagram.replace('@', '')}`} target="_blank" clickable variant="outlined" />
                )
              }
              {
                mahasiswaProfile.socialMedia.github && (
                  <Chip icon={<GitHub />} label="GitHub" size="small" component="a" href={`https://${mahasiswaProfile.socialMedia.github}`} target="_blank" clickable variant="outlined" />
                )
              }
            </Box >
          </Box >
        </Box >

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          {statistik.map((stat) => (
            <Card key={stat.label} elevation={0} sx={{ bgcolor: stat.color, color: 'white', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">{stat.value}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>{stat.label}</Typography>
                  </Box>
                  <stat.icon sx={{ fontSize: 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper >

      <Paper elevation={2} sx={{ p: 0, overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Tab label="KRS & Transkrip" />
          <Tab label="Skripsi" />
          <Tab label="KKN" />
          <Tab label="Magang" />
          <Tab label="MBKM" />
          <Tab label="Prestasi Akademik" />
          <Tab label="Prestasi Non-Akademik" />
        </Tabs>

        <Box sx={{ p: 0 }}>
          {tabValue === 0 && (
            <DataTable columns={krsColumns} rows={krsData} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom color="primary.main" fontWeight="bold">Informasi Skripsi</Typography>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Judul Skripsi</Typography>
                    <Typography variant="body1" fontWeight="medium">{skripsiData.judul}</Typography>
                  </Paper>
                </Box>
                <Box>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Pembimbing 1</Typography>
                    <Typography variant="body1">{skripsiData.pembimbing1}</Typography>
                  </Paper>
                </Box>
                <Box>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Pembimbing 2</Typography>
                    <Typography variant="body1">{skripsiData.pembimbing2}</Typography>
                  </Paper>
                </Box>
                <Box>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Tanggal Mulai</Typography>
                    <Typography variant="body1">{skripsiData.tanggalMulai}</Typography>
                  </Paper>
                </Box>
                <Box>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={skripsiData.status} color="primary" size="small" />
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          )}

          {tabValue === 2 && (
            <DataTable columns={kknColumns} rows={kknData} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 3 && (
            <DataTable columns={magangColumns} rows={magangData} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 4 && (
            <DataTable columns={mbkmColumns} rows={mbkmData} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 5 && (
            <DataTable columns={prestasiAkademikColumns} rows={prestasiAkademik} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 6 && (
            <DataTable columns={prestasiNonAkademikColumns} rows={prestasiNonAkademik} getRowKey={(row) => row.id} maxHeight={500} />
          )}
        </Box>
      </Paper>
    </Box >
  );
}
