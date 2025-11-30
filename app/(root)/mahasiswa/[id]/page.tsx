"use client";

import {
  Container,
  Paper,
  Typography,
  Box,
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
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Semester</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Kode</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Mata Kuliah</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>SKS</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nilai</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Mutu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {krsData.map((krs) => (
                    <TableRow key={krs.id} hover>
                      <TableCell align="center">{krs.semester}</TableCell>
                      <TableCell>{krs.kode}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{krs.matakuliah}</TableCell>
                      <TableCell align="center">{krs.sks}</TableCell>
                      <TableCell><Chip label={krs.nilai} color="success" size="small" variant="outlined" /></TableCell>
                      <TableCell align="center">{krs.mutu}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Lokasi</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Periode</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nilai</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kknData.map((kkn) => (
                    <TableRow key={kkn.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{kkn.lokasi}</TableCell>
                      <TableCell>{kkn.periode}</TableCell>
                      <TableCell><Chip label={kkn.status} color="success" size="small" variant="outlined" /></TableCell>
                      <TableCell><Chip label={kkn.nilai} color="success" size="small" variant="outlined" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 3 && (
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Perusahaan</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Posisi</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Periode</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nilai</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {magangData.map((magang) => (
                    <TableRow key={magang.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{magang.perusahaan}</TableCell>
                      <TableCell>{magang.posisi}</TableCell>
                      <TableCell>{magang.periode}</TableCell>
                      <TableCell><Chip label={magang.status} color="success" size="small" variant="outlined" /></TableCell>
                      <TableCell><Chip label={magang.nilai} color="success" size="small" variant="outlined" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 4 && (
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Program</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Kegiatan</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Periode</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mbkmData.map((mbkm) => (
                    <TableRow key={mbkm.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{mbkm.program}</TableCell>
                      <TableCell>{mbkm.kegiatan}</TableCell>
                      <TableCell>{mbkm.periode}</TableCell>
                      <TableCell><Chip label={mbkm.status} color="success" size="small" variant="outlined" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 5 && (
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nama Prestasi</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Penyelenggara</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Tahun</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Tingkat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prestasiAkademik.map((prestasi) => (
                    <TableRow key={prestasi.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{prestasi.nama}</TableCell>
                      <TableCell>{prestasi.penyelenggara}</TableCell>
                      <TableCell>{prestasi.tahun}</TableCell>
                      <TableCell><Chip label={prestasi.tingkat} color="primary" size="small" variant="outlined" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 6 && (
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Nama Prestasi</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Penyelenggara</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Tahun</TableCell>
                    <TableCell sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Tingkat</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prestasiNonAkademik.map((prestasi) => (
                    <TableRow key={prestasi.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>{prestasi.nama}</TableCell>
                      <TableCell>{prestasi.penyelenggara}</TableCell>
                      <TableCell>{prestasi.tahun}</TableCell>
                      <TableCell><Chip label={prestasi.tingkat} color="secondary" size="small" variant="outlined" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box >
  );
}
