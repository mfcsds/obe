"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Divider,
} from '@mui/material';
import { useState } from 'react';

const steps = ['Identitas', 'Data Pribadi', 'Kontak & Alamat', 'Orang Tua/Wali', 'Riwayat Pendidikan', 'Akademik'];

interface AddMahasiswaDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddMahasiswaDialog({ open, onClose }: AddMahasiswaDialogProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = () => {
    onClose();
    setActiveStep(0);
  };

  const handleSaveDraft = () => {
    onClose();
    setActiveStep(0);
    // TODO: Implement actual draft saving logic
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Tambah Data Mahasiswa</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Identitas Akademik</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Nama Lengkap (Sesuai KTP)" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="NIM" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Angkatan" type="number" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth required>
                <InputLabel>Program Studi</InputLabel>
                <Select label="Program Studi" defaultValue="">
                  <MenuItem value="Teknik Informatika">Teknik Informatika</MenuItem>
                  <MenuItem value="Sistem Informasi">Sistem Informasi</MenuItem>
                  <MenuItem value="Manajemen Informatika">Manajemen Informatika</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth required>
                <InputLabel>Jalur Masuk</InputLabel>
                <Select label="Jalur Masuk" defaultValue="">
                  <MenuItem value="SNBP">SNBP</MenuItem>
                  <MenuItem value="SNBT">SNBT</MenuItem>
                  <MenuItem value="Mandiri">Mandiri</MenuItem>
                  <MenuItem value="KIP">KIP</MenuItem>
                  <MenuItem value="Alih Jenjang">Alih Jenjang</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth required>
                <InputLabel>Status Mahasiswa</InputLabel>
                <Select label="Status Mahasiswa" defaultValue="">
                  <MenuItem value="Aktif">Aktif</MenuItem>
                  <MenuItem value="Cuti">Cuti</MenuItem>
                  <MenuItem value="Tidak Aktif">Tidak Aktif</MenuItem>
                  <MenuItem value="Lulus">Lulus</MenuItem>
                  <MenuItem value="DO">DO</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Kelas" />
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Data Pribadi</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth required>
                <InputLabel>Jenis Kelamin</InputLabel>
                <Select label="Jenis Kelamin" defaultValue="">
                  <MenuItem value="L">Laki-laki</MenuItem>
                  <MenuItem value="P">Perempuan</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Tempat Lahir" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Tanggal Lahir" type="date" InputLabelProps={{ shrink: true }} required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth required>
                <InputLabel>Agama</InputLabel>
                <Select label="Agama" defaultValue="">
                  <MenuItem value="Islam">Islam</MenuItem>
                  <MenuItem value="Kristen">Kristen</MenuItem>
                  <MenuItem value="Katolik">Katolik</MenuItem>
                  <MenuItem value="Hindu">Hindu</MenuItem>
                  <MenuItem value="Buddha">Buddha</MenuItem>
                  <MenuItem value="Konghucu">Konghucu</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Kewarganegaraan" defaultValue="Indonesia" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Nomor KTP" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Nomor KK" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="NISN" />
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Kontak & Alamat</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Email Institusi" type="email" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Email Pribadi" type="email" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Nomor HP / WhatsApp" required />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Alamat Domisili" multiline rows={3} required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Kota / Kabupaten" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Provinsi" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Kode Pos" />
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">Data Ayah</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Nama Ayah" required />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField fullWidth label="Pendidikan Ayah" />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField fullWidth label="Pekerjaan Ayah" />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Penghasilan Ayah" />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Nomor HP Ayah" />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">Data Ibu</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Nama Ibu" required />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField fullWidth label="Pendidikan Ibu" />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField fullWidth label="Pekerjaan Ibu" />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Penghasilan Ibu" />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Nomor HP Ibu" />
                </Box>
              </Box>
            </Box>

            <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">Data Wali (Opsional)</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField fullWidth label="Nama Wali" />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField fullWidth label="Hubungan dengan Wali" />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                  <TextField fullWidth label="Pekerjaan Wali" />
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {activeStep === 4 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Riwayat Pendidikan</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Asal Sekolah (SMA/SMK/MA)" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Jurusan di SMA/SMK" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Tahun Lulus" type="number" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Nilai UTBK" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Nilai Rapor" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Prestasi Akademik / Non-Akademik" multiline rows={2} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
                Upload Ijazah & SKHUN
                <input type="file" hidden accept=".pdf" />
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 5 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Informasi Akademik Tambahan</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Dosen Pembimbing Akademik (DPA)" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel>Status Beasiswa</InputLabel>
                <Select label="Status Beasiswa" defaultValue="">
                  <MenuItem value="Tidak Ada">Tidak Ada</MenuItem>
                  <MenuItem value="KIP">KIP</MenuItem>
                  <MenuItem value="Yayasan">Yayasan</MenuItem>
                  <MenuItem value="Industri">Industri</MenuItem>
                  <MenuItem value="Internal">Internal Kampus</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Konsentrasi Peminatan" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="subtitle2" gutterBottom>Social Media</Typography>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="LinkedIn" placeholder="linkedin.com/in/username" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Instagram" placeholder="@username" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="TikTok" placeholder="@username" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="GitHub" placeholder="github.com/username" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Riwayat Penyakit" multiline rows={2} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Disabilitas (jika ada)" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
                Upload Foto Mahasiswa
                <input type="file" hidden accept="image/*" />
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">Batal</Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleSaveDraft} color="primary" sx={{ mr: 1 }}>Simpan Sebagai Draft</Button>
        {activeStep > 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Kembali</Button>}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Selanjutnya</Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>Simpan</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
