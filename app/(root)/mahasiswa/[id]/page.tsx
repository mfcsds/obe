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
  School,
  Grade,
  Assignment,
  Work,
  LinkedIn,
  Instagram,
  GitHub,
} from '@mui/icons-material';
import { useState } from 'react';

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

const krsData = [
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

const kknData = [
  { id: 1, lokasi: 'Desa Sukamaju, Bogor', periode: 'Juli - Agustus 2023', status: 'Selesai', nilai: 'A' },
];

const magangData = [
  { id: 1, perusahaan: 'PT. Tech Indonesia', posisi: 'Backend Developer', periode: 'Jan - Apr 2023', status: 'Selesai', nilai: 'A' },
];

const mbkmData = [
  { id: 1, program: 'Studi Independen - Dicoding', kegiatan: 'Backend Developer Path', periode: 'Sep - Des 2022', status: 'Selesai' },
];

const prestasiAkademik = [
  { id: 1, nama: 'Juara 1 Lomba Karya Tulis Ilmiah', penyelenggara: 'Universitas YARSI', tahun: 2023, tingkat: 'Universitas' },
  { id: 2, nama: 'Best Student Award', penyelenggara: 'Fakultas Teknik', tahun: 2022, tingkat: 'Fakultas' },
];

const prestasiNonAkademik = [
  { id: 1, nama: 'Juara 2 Hackathon Nasional', penyelenggara: 'Kemenkominfo', tahun: 2023, tingkat: 'Nasional' },
  { id: 2, nama: 'Finalis Kompetisi Web Design', penyelenggara: 'HMTI', tahun: 2022, tingkat: 'Regional' },
];

export default function ProfilMahasiswaPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>
            {mahasiswaProfile.nama.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">{mahasiswaProfile.nama}</Typography>
            <Typography variant="body1" color="text.secondary">NIM: {mahasiswaProfile.nim}</Typography>
            <Typography variant="body1" color="text.secondary">{mahasiswaProfile.email}</Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
              <Chip label={mahasiswaProfile.prodi} color="primary" />
              <Chip label={`Angkatan ${mahasiswaProfile.angkatan}`} variant="outlined" />
              <Chip label={mahasiswaProfile.status} color="success" />
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              {mahasiswaProfile.socialMedia.linkedin && (
                <Chip icon={<LinkedIn />} label="LinkedIn" size="small" component="a" href={`https://${mahasiswaProfile.socialMedia.linkedin}`} target="_blank" clickable />
              )}
              {mahasiswaProfile.socialMedia.instagram && (
                <Chip icon={<Instagram />} label="Instagram" size="small" component="a" href={`https://instagram.com/${mahasiswaProfile.socialMedia.instagram.replace('@', '')}`} target="_blank" clickable />
              )}
              {mahasiswaProfile.socialMedia.github && (
                <Chip icon={<GitHub />} label="GitHub" size="small" component="a" href={`https://${mahasiswaProfile.socialMedia.github}`} target="_blank" clickable />
              )}
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
          <Tab label="KRS & Transkrip" />
          <Tab label="Skripsi" />
          <Tab label="KKN" />
          <Tab label="Magang" />
          <Tab label="MBKM" />
          <Tab label="Prestasi Akademik" />
          <Tab label="Prestasi Non-Akademik" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Semester</strong></TableCell>
                    <TableCell><strong>Kode</strong></TableCell>
                    <TableCell><strong>Mata Kuliah</strong></TableCell>
                    <TableCell><strong>SKS</strong></TableCell>
                    <TableCell><strong>Nilai</strong></TableCell>
                    <TableCell><strong>Mutu</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {krsData.map((krs) => (
                    <TableRow key={krs.id} hover>
                      <TableCell>{krs.semester}</TableCell>
                      <TableCell>{krs.kode}</TableCell>
                      <TableCell>{krs.matakuliah}</TableCell>
                      <TableCell>{krs.sks}</TableCell>
                      <TableCell><Chip label={krs.nilai} color="success" size="small" /></TableCell>
                      <TableCell>{krs.mutu}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Informasi Skripsi</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1"><strong>Judul:</strong> {skripsiData.judul}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Pembimbing 1:</strong> {skripsiData.pembimbing1}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Pembimbing 2:</strong> {skripsiData.pembimbing2}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Tanggal Mulai:</strong> {skripsiData.tanggalMulai}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1"><strong>Status:</strong> <Chip label={skripsiData.status} color="primary" size="small" /></Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Lokasi</strong></TableCell>
                    <TableCell><strong>Periode</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Nilai</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kknData.map((kkn) => (
                    <TableRow key={kkn.id} hover>
                      <TableCell>{kkn.lokasi}</TableCell>
                      <TableCell>{kkn.periode}</TableCell>
                      <TableCell><Chip label={kkn.status} color="success" size="small" /></TableCell>
                      <TableCell><Chip label={kkn.nilai} color="success" size="small" /></TableCell>
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
                    <TableCell><strong>Perusahaan</strong></TableCell>
                    <TableCell><strong>Posisi</strong></TableCell>
                    <TableCell><strong>Periode</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Nilai</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {magangData.map((magang) => (
                    <TableRow key={magang.id} hover>
                      <TableCell>{magang.perusahaan}</TableCell>
                      <TableCell>{magang.posisi}</TableCell>
                      <TableCell>{magang.periode}</TableCell>
                      <TableCell><Chip label={magang.status} color="success" size="small" /></TableCell>
                      <TableCell><Chip label={magang.nilai} color="success" size="small" /></TableCell>
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
                    <TableCell><strong>Program</strong></TableCell>
                    <TableCell><strong>Kegiatan</strong></TableCell>
                    <TableCell><strong>Periode</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mbkmData.map((mbkm) => (
                    <TableRow key={mbkm.id} hover>
                      <TableCell>{mbkm.program}</TableCell>
                      <TableCell>{mbkm.kegiatan}</TableCell>
                      <TableCell>{mbkm.periode}</TableCell>
                      <TableCell><Chip label={mbkm.status} color="success" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 5 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nama Prestasi</strong></TableCell>
                    <TableCell><strong>Penyelenggara</strong></TableCell>
                    <TableCell><strong>Tahun</strong></TableCell>
                    <TableCell><strong>Tingkat</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prestasiAkademik.map((prestasi) => (
                    <TableRow key={prestasi.id} hover>
                      <TableCell>{prestasi.nama}</TableCell>
                      <TableCell>{prestasi.penyelenggara}</TableCell>
                      <TableCell>{prestasi.tahun}</TableCell>
                      <TableCell><Chip label={prestasi.tingkat} color="primary" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 6 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nama Prestasi</strong></TableCell>
                    <TableCell><strong>Penyelenggara</strong></TableCell>
                    <TableCell><strong>Tahun</strong></TableCell>
                    <TableCell><strong>Tingkat</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prestasiNonAkademik.map((prestasi) => (
                    <TableRow key={prestasi.id} hover>
                      <TableCell>{prestasi.nama}</TableCell>
                      <TableCell>{prestasi.penyelenggara}</TableCell>
                      <TableCell>{prestasi.tahun}</TableCell>
                      <TableCell><Chip label={prestasi.tingkat} color="secondary" size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
