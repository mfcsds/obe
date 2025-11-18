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
  Grid,
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tambah Data Mahasiswa</DialogTitle>
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Nama Lengkap (Sesuai KTP)" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="NIM" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Angkatan" type="number" required />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Program Studi</InputLabel>
                <Select label="Program Studi">
                  <MenuItem value="Teknik Informatika">Teknik Informatika</MenuItem>
                  <MenuItem value="Sistem Informasi">Sistem Informasi</MenuItem>
                  <MenuItem value="Manajemen Informatika">Manajemen Informatika</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Jalur Masuk</InputLabel>
                <Select label="Jalur Masuk">
                  <MenuItem value="SNBP">SNBP</MenuItem>
                  <MenuItem value="SNBT">SNBT</MenuItem>
                  <MenuItem value="Mandiri">Mandiri</MenuItem>
                  <MenuItem value="KIP">KIP</MenuItem>
                  <MenuItem value="Alih Jenjang">Alih Jenjang</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Status Mahasiswa</InputLabel>
                <Select label="Status Mahasiswa">
                  <MenuItem value="Aktif">Aktif</MenuItem>
                  <MenuItem value="Cuti">Cuti</MenuItem>
                  <MenuItem value="Tidak Aktif">Tidak Aktif</MenuItem>
                  <MenuItem value="Lulus">Lulus</MenuItem>
                  <MenuItem value="DO">DO</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Kelas" />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Jenis Kelamin</InputLabel>
                <Select label="Jenis Kelamin">
                  <MenuItem value="L">Laki-laki</MenuItem>
                  <MenuItem value="P">Perempuan</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Tempat Lahir" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Tanggal Lahir" type="date" InputLabelProps={{ shrink: true }} required />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Agama</InputLabel>
                <Select label="Agama">
                  <MenuItem value="Islam">Islam</MenuItem>
                  <MenuItem value="Kristen">Kristen</MenuItem>
                  <MenuItem value="Katolik">Katolik</MenuItem>
                  <MenuItem value="Hindu">Hindu</MenuItem>
                  <MenuItem value="Buddha">Buddha</MenuItem>
                  <MenuItem value="Konghucu">Konghucu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Kewarganegaraan" defaultValue="Indonesia" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Nomor KTP" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Nomor KK" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="NISN" />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField fullWidth label="Email Institusi" type="email" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email Pribadi" type="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Nomor HP / WhatsApp" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Alamat Domisili" multiline rows={3} required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Kota / Kabupaten" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Provinsi" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Kode Pos" />
            </Grid>
          </Grid>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Data Ayah</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nama Ayah" required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Pendidikan Ayah" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Pekerjaan Ayah" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Penghasilan Ayah" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Data Ibu</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nama Ibu" required />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Pendidikan Ibu" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Pekerjaan Ibu" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Penghasilan Ibu" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Data Wali (Opsional)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Nama Wali" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Hubungan dengan Wali" />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Pekerjaan Wali" />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 4 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Asal Sekolah (SMA/SMK/MA)" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Jurusan di SMA/SMK" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Tahun Lulus" type="number" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Nilai UTBK" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Nilai Rapor" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Prestasi Akademik / Non-Akademik" multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Ijazah & SKHUN
                <input type="file" hidden accept=".pdf" />
              </Button>
            </Grid>
          </Grid>
        )}

        {activeStep === 5 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Dosen Pembimbing Akademik (DPA)" />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status Beasiswa</InputLabel>
                <Select label="Status Beasiswa">
                  <MenuItem value="Tidak Ada">Tidak Ada</MenuItem>
                  <MenuItem value="KIP">KIP</MenuItem>
                  <MenuItem value="Yayasan">Yayasan</MenuItem>
                  <MenuItem value="Industri">Industri</MenuItem>
                  <MenuItem value="Internal">Internal Kampus</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Konsentrasi Peminatan" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Social Media</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="LinkedIn" placeholder="linkedin.com/in/username" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Instagram" placeholder="@username" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="TikTok" placeholder="@username" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="GitHub" placeholder="github.com/username" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Riwayat Penyakit" multiline rows={2} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Disabilitas (jika ada)" />
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Foto Mahasiswa
                <input type="file" hidden accept="image/*" />
              </Button>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        {activeStep > 0 && <Button onClick={handleBack}>Kembali</Button>}
        {activeStep < steps.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>Selanjutnya</Button>
        ) : (
          <Button variant="contained" onClick={handleSubmit}>Simpan</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
