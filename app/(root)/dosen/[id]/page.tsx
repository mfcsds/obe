"use client";

import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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

const publikasiData = [
  { id: 1, judul: 'Machine Learning for Healthcare', tahun: 2023, jenis: 'Jurnal Internasional', penerbit: 'IEEE', status: 'Published' },
  { id: 2, judul: 'Deep Learning Applications', tahun: 2023, jenis: 'Prosiding', penerbit: 'Springer', status: 'Published' },
];

const penelitianData = [
  { id: 1, judul: 'AI-Based Medical Diagnosis System', tahun: 2023, skema: 'Penelitian Dasar', dana: 'Rp 50.000.000', status: 'Aktif' },
  { id: 2, judul: 'Smart City IoT Platform', tahun: 2022, skema: 'Penelitian Terapan', dana: 'Rp 75.000.000', status: 'Selesai' },
];

const pkm = [
  { id: 1, judul: 'Pelatihan Web Development untuk UMKM', tahun: 2023, mitra: 'Karang Taruna Jakarta', dana: 'Rp 15.000.000', status: 'Selesai' },
];

const rekognisi = [
  { id: 1, nama: 'Best Paper Award', penyelenggara: 'IEEE Conference 2023', tahun: 2023, tingkat: 'Internasional' },
  { id: 2, nama: 'Dosen Berprestasi', penyelenggara: 'Universitas YARSI', tahun: 2022, tingkat: 'Universitas' },
];

const seminarWebinar = [
  { id: 1, judul: 'AI in Education', peran: 'Narasumber', penyelenggara: 'Universitas YARSI', tanggal: '2023-11-15', jenis: 'Seminar' },
  { id: 2, judul: 'Cloud Computing Trends', peran: 'Moderator', penyelenggara: 'AWS Indonesia', tanggal: '2023-10-20', jenis: 'Webinar' },
];

export default function ProfilDosenPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>
            {dosenProfile.nama.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">{dosenProfile.nama}</Typography>
            <Typography variant="body1" color="text.secondary">NIDN: {dosenProfile.nidn}</Typography>
            <Typography variant="body1" color="text.secondary">{dosenProfile.email}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip label={dosenProfile.jabatan} color="primary" />
              <Chip label={dosenProfile.prodi} variant="outlined" />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          {statistik.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card elevation={2} sx={{ bgcolor: stat.color, color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h3" fontWeight="bold">{stat.value}</Typography>
                      <Typography variant="body2">{stat.label}</Typography>
                    </Box>
                    <stat.icon sx={{ fontSize: 50, opacity: 0.7 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable">
          <Tab label="Publikasi" />
          <Tab label="Hibah Penelitian" />
          <Tab label="Hibah PKM" />
          <Tab label="Rekognisi" />
          <Tab label="Seminar & Webinar" />
          <Tab label="Riwayat Mengajar" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Judul</strong></TableCell>
                    <TableCell><strong>Tahun</strong></TableCell>
                    <TableCell><strong>Jenis</strong></TableCell>
                    <TableCell><strong>Penerbit</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {publikasiData.map((pub) => (
                    <TableRow key={pub.id} hover>
                      <TableCell>{pub.judul}</TableCell>
                      <TableCell>{pub.tahun}</TableCell>
                      <TableCell>{pub.jenis}</TableCell>
                      <TableCell>{pub.penerbit}</TableCell>
                      <TableCell><Chip label={pub.status} color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Judul Penelitian</strong></TableCell>
                    <TableCell><strong>Tahun</strong></TableCell>
                    <TableCell><strong>Skema</strong></TableCell>
                    <TableCell><strong>Dana</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {penelitianData.map((pen) => (
                    <TableRow key={pen.id} hover>
                      <TableCell>{pen.judul}</TableCell>
                      <TableCell>{pen.tahun}</TableCell>
                      <TableCell>{pen.skema}</TableCell>
                      <TableCell>{pen.dana}</TableCell>
                      <TableCell><Chip label={pen.status} color={pen.status === 'Aktif' ? 'primary' : 'default'} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Judul PKM</strong></TableCell>
                    <TableCell><strong>Tahun</strong></TableCell>
                    <TableCell><strong>Mitra</strong></TableCell>
                    <TableCell><strong>Dana</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pkm.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>{p.judul}</TableCell>
                      <TableCell>{p.tahun}</TableCell>
                      <TableCell>{p.mitra}</TableCell>
                      <TableCell>{p.dana}</TableCell>
                      <TableCell><Chip label={p.status} color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 3 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nama Penghargaan</strong></TableCell>
                    <TableCell><strong>Penyelenggara</strong></TableCell>
                    <TableCell><strong>Tahun</strong></TableCell>
                    <TableCell><strong>Tingkat</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rekognisi.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.nama}</TableCell>
                      <TableCell>{r.penyelenggara}</TableCell>
                      <TableCell>{r.tahun}</TableCell>
                      <TableCell><Chip label={r.tingkat} color="secondary" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 4 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Judul</strong></TableCell>
                    <TableCell><strong>Peran</strong></TableCell>
                    <TableCell><strong>Penyelenggara</strong></TableCell>
                    <TableCell><strong>Tanggal</strong></TableCell>
                    <TableCell><strong>Jenis</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seminarWebinar.map((sw) => (
                    <TableRow key={sw.id} hover>
                      <TableCell>{sw.judul}</TableCell>
                      <TableCell>{sw.peran}</TableCell>
                      <TableCell>{sw.penyelenggara}</TableCell>
                      <TableCell>{sw.tanggal}</TableCell>
                      <TableCell><Chip label={sw.jenis} color="info" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 5 && (
            <Typography variant="body1" color="text.secondary">Data riwayat mengajar akan ditampilkan di sini</Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
