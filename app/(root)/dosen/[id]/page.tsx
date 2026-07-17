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
  Article,
  School,
  EmojiEvents,
  VolunteerActivism,
} from '@mui/icons-material';
import { useState } from 'react';
import { DataTable, type DataTableColumn } from '@/components/common/DataTable';

const dosenProfile = {
  nama: 'Dr. Ahmad Fauzi, M.Kom',
  nidn: '0123456789',
  email: 'ahmad.fauzi@yarsi.ac.id',
  jabatan: 'Lektor Kepala',
  prodi: 'Teknik Informatika',
};

const statistik = [
  { label: 'Publikasi', value: 25, icon: Article, color: '#1976d2' },
  { label: 'Penelitian', value: 12, icon: School, color: '#2e7d32' },
  { label: 'Pengabdian Masyarakat', value: 8, icon: VolunteerActivism, color: '#ed6c02' },
  { label: 'Rekognisi', value: 5, icon: EmojiEvents, color: '#9c27b0' },
];

interface Publikasi {
  id: number;
  judul: string;
  tahun: number;
  jenis: string;
  penerbit: string;
  status: string;
}

interface Penelitian {
  id: number;
  judul: string;
  tahun: number;
  skema: string;
  dana: string;
  status: string;
}

interface Pkm {
  id: number;
  judul: string;
  tahun: number;
  mitra: string;
  dana: string;
  status: string;
}

interface Rekognisi {
  id: number;
  nama: string;
  penyelenggara: string;
  tahun: number;
  tingkat: string;
}

interface SeminarWebinar {
  id: number;
  judul: string;
  peran: string;
  penyelenggara: string;
  tanggal: string;
  jenis: string;
}

const publikasiData: Publikasi[] = [
  { id: 1, judul: 'Machine Learning for Healthcare', tahun: 2023, jenis: 'Jurnal Internasional', penerbit: 'IEEE', status: 'Published' },
  { id: 2, judul: 'Deep Learning Applications', tahun: 2023, jenis: 'Prosiding', penerbit: 'Springer', status: 'Published' },
];

const penelitianData: Penelitian[] = [
  { id: 1, judul: 'AI-Based Medical Diagnosis System', tahun: 2023, skema: 'Penelitian Dasar', dana: 'Rp 50.000.000', status: 'Aktif' },
  { id: 2, judul: 'Smart City IoT Platform', tahun: 2022, skema: 'Penelitian Terapan', dana: 'Rp 75.000.000', status: 'Selesai' },
];

const pkm: Pkm[] = [
  { id: 1, judul: 'Pelatihan Web Development untuk UMKM', tahun: 2023, mitra: 'Karang Taruna Jakarta', dana: 'Rp 15.000.000', status: 'Selesai' },
];

const rekognisi: Rekognisi[] = [
  { id: 1, nama: 'Best Paper Award', penyelenggara: 'IEEE Conference 2023', tahun: 2023, tingkat: 'Internasional' },
  { id: 2, nama: 'Dosen Berprestasi', penyelenggara: 'Universitas YARSI', tahun: 2022, tingkat: 'Universitas' },
];

const seminarWebinar: SeminarWebinar[] = [
  { id: 1, judul: 'AI in Education', peran: 'Narasumber', penyelenggara: 'Universitas YARSI', tanggal: '2023-11-15', jenis: 'Seminar' },
  { id: 2, judul: 'Cloud Computing Trends', peran: 'Moderator', penyelenggara: 'AWS Indonesia', tanggal: '2023-10-20', jenis: 'Webinar' },
];

const publikasiColumns: DataTableColumn<Publikasi>[] = [
  { key: 'judul', label: 'Judul' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'jenis', label: 'Jenis' },
  { key: 'penerbit', label: 'Penerbit' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Chip label={row.status} color="success" size="small" variant="outlined" />,
  },
];

const penelitianColumns: DataTableColumn<Penelitian>[] = [
  { key: 'judul', label: 'Judul Penelitian' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'skema', label: 'Skema' },
  { key: 'dana', label: 'Dana' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => (
      <Chip label={row.status} color={row.status === 'Aktif' ? 'primary' : 'default'} size="small" variant="outlined" />
    ),
  },
];

const pkmColumns: DataTableColumn<Pkm>[] = [
  { key: 'judul', label: 'Judul PKM' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'mitra', label: 'Mitra' },
  { key: 'dana', label: 'Dana' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <Chip label={row.status} color="success" size="small" variant="outlined" />,
  },
];

const rekognisiColumns: DataTableColumn<Rekognisi>[] = [
  { key: 'nama', label: 'Nama Penghargaan' },
  { key: 'penyelenggara', label: 'Penyelenggara' },
  { key: 'tahun', label: 'Tahun' },
  {
    key: 'tingkat',
    label: 'Tingkat',
    render: (row) => <Chip label={row.tingkat} color="secondary" size="small" variant="outlined" />,
  },
];

const seminarWebinarColumns: DataTableColumn<SeminarWebinar>[] = [
  { key: 'judul', label: 'Judul' },
  { key: 'peran', label: 'Peran' },
  { key: 'penyelenggara', label: 'Penyelenggara' },
  { key: 'tanggal', label: 'Tanggal' },
  {
    key: 'jenis',
    label: 'Jenis',
    render: (row) => <Chip label={row.jenis} color="info" size="small" variant="outlined" />,
  },
];

export default function ProfilDosenPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40, fontWeight: 'bold' }}>
            {dosenProfile.nama.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">{dosenProfile.nama}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>NIDN: {dosenProfile.nidn}</Typography>
            <Typography variant="body1" color="text.secondary">{dosenProfile.email}</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Chip label={dosenProfile.jabatan} color="primary" />
              <Chip label={dosenProfile.prodi} variant="outlined" color="primary" />
            </Box>
          </Box>
        </Box>

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
      </Paper>

      <Paper elevation={2} sx={{ p: 0, overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
        >
          <Tab label="Publikasi" />
          <Tab label="Hibah Penelitian" />
          <Tab label="Hibah PKM" />
          <Tab label="Rekognisi" />
          <Tab label="Seminar & Webinar" />
          <Tab label="Riwayat Mengajar" />
        </Tabs>

        <Box sx={{ p: 0 }}>
          {tabValue === 0 && (
            <DataTable columns={publikasiColumns} rows={publikasiData} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 1 && (
            <DataTable columns={penelitianColumns} rows={penelitianData} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 2 && (
            <DataTable columns={pkmColumns} rows={pkm} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 3 && (
            <DataTable columns={rekognisiColumns} rows={rekognisi} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 4 && (
            <DataTable columns={seminarWebinarColumns} rows={seminarWebinar} getRowKey={(row) => row.id} maxHeight={500} />
          )}

          {tabValue === 5 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" color="text.secondary">Data riwayat mengajar akan ditampilkan di sini</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
