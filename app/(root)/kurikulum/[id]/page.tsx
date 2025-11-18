"use client";

import {
  Container,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useState } from 'react';
import Link from 'next/link';
import ProfilLulusanTab from '@/components/kurikulum/ProfilLulusanTab';
import CPLProdiTab from '@/components/kurikulum/CPLProdiTab';
import PemetaanProfilCPLTab from '@/components/kurikulum/PemetaanProfilCPLTab';
import BahanKajianTab from '@/components/kurikulum/BahanKajianTab';
import PemetaanCPLBKTab from '@/components/kurikulum/PemetaanCPLBKTab';
import PemetaanBKMKTab from '@/components/kurikulum/PemetaanBKMKTab';
import PemetaanMKCPLTab from '@/components/kurikulum/PemetaanMKCPLTab';
import PemetaanCPLBKMKTab from '@/components/kurikulum/PemetaanCPLBKMKTab';

const menuItems = [
  '1. Profil Lulusan',
  '2. CPL Prodi',
  '3. Pemetaan Profil & CPL',
  '4. Bahan Kajian',
  '5. Pemetaan CPL vs BK',
  '6. BK vs Mata Kuliah',
  '7. MK vs CPL',
  '8. CPL vs BK vs MK',
  '9. Susunan Mata Kuliah',
  '10. Organisasi Mata Kuliah',
  '11. Peta Pemenuhan CPL',
  '12. CPL vs CPMK vs MK',
  '13. MK vs CPMK vs Sub-CPMK',
  '14. Teknik Penilaian CPMK',
  '15. Tahap & Mekanisme Penilaian',
  '16. Bobot Penilaian MK',
  '17. Rumusan Akhir MK',
  '18. Rumusan Akhir CPL',
];

export default function EditKurikulumPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button component={Link} href="/kurikulum" startIcon={<ArrowBack />} variant="outlined">
              Kembali
            </Button>
            <Box>
              <Typography variant="h4" fontWeight="bold">Kurikulum OBE 2024</Typography>
              <Typography variant="body2" color="text.secondary">Tahun Akademik 2024/2025</Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<Save />}>
            Simpan Perubahan
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ display: 'flex' }}>
        <Tabs 
          value={tabValue} 
          onChange={(_, v) => setTabValue(v)} 
          orientation="vertical"
          variant="scrollable"
          sx={{ borderRight: 1, borderColor: 'divider', minWidth: 250 }}
        >
          {menuItems.map((item, index) => (
            <Tab key={index} label={item} sx={{ alignItems: 'flex-start', textAlign: 'left' }} />
          ))}
        </Tabs>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {tabValue === 0 && <ProfilLulusanTab />}

          {tabValue === 1 && <CPLProdiTab />}

          {tabValue === 2 && <PemetaanProfilCPLTab />}

          {tabValue === 3 && <BahanKajianTab />}

          {tabValue === 4 && <PemetaanCPLBKTab />}

          {tabValue === 5 && <PemetaanBKMKTab />}

          {tabValue === 6 && <PemetaanMKCPLTab />}

          {tabValue === 7 && <PemetaanCPLBKMKTab />}

          {tabValue === 8 && (
            <Box>
              <Typography variant="h6" gutterBottom>Susunan Mata Kuliah</Typography>
              <Typography variant="body2" color="text.secondary">
                Daftar mata kuliah per semester dengan detail SKS dan prasyarat.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Susunan Mata Kuliah akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 9 && (
            <Box>
              <Typography variant="h6" gutterBottom>Organisasi Mata Kuliah</Typography>
              <Typography variant="body2" color="text.secondary">
                Struktur organisasi mata kuliah dalam kurikulum.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Organisasi Mata Kuliah akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 10 && (
            <Box>
              <Typography variant="h6" gutterBottom>Peta Pemenuhan CPL</Typography>
              <Typography variant="body2" color="text.secondary">
                Visualisasi pemenuhan CPL melalui mata kuliah.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Peta Pemenuhan CPL akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 11 && (
            <Box>
              <Typography variant="h6" gutterBottom>Pemetaan CPL vs CPMK vs MK</Typography>
              <Typography variant="body2" color="text.secondary">
                Matriks pemetaan CPL dengan CPMK pada setiap mata kuliah.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk CPL vs CPMK vs MK akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 12 && (
            <Box>
              <Typography variant="h6" gutterBottom>Pemetaan MK vs CPMK vs Sub-CPMK</Typography>
              <Typography variant="body2" color="text.secondary">
                Detail pemetaan CPMK dan Sub-CPMK untuk setiap mata kuliah.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk MK vs CPMK vs Sub-CPMK akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 13 && (
            <Box>
              <Typography variant="h6" gutterBottom>Teknik Penilaian CPMK</Typography>
              <Typography variant="body2" color="text.secondary">
                Metode dan teknik penilaian untuk setiap CPMK.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Teknik Penilaian CPMK akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 14 && (
            <Box>
              <Typography variant="h6" gutterBottom>Tahap dan Mekanisme Penilaian</Typography>
              <Typography variant="body2" color="text.secondary">
                Tahapan dan mekanisme penilaian dalam pembelajaran.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Tahap & Mekanisme Penilaian akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 15 && (
            <Box>
              <Typography variant="h6" gutterBottom>Bobot Penilaian Mata Kuliah</Typography>
              <Typography variant="body2" color="text.secondary">
                Distribusi bobot penilaian untuk setiap komponen mata kuliah.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Bobot Penilaian MK akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 16 && (
            <Box>
              <Typography variant="h6" gutterBottom>Rumusan Akhir Mata Kuliah</Typography>
              <Typography variant="body2" color="text.secondary">
                Rumusan lengkap untuk setiap mata kuliah dalam kurikulum.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Rumusan Akhir MK akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}

          {tabValue === 17 && (
            <Box>
              <Typography variant="h6" gutterBottom>Rumusan Akhir CPL</Typography>
              <Typography variant="body2" color="text.secondary">
                Rumusan akhir CPL dengan detail pemenuhan melalui mata kuliah.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body1">Konten untuk Rumusan Akhir CPL akan ditampilkan di sini</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
