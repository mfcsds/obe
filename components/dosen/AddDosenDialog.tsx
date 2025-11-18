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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useState } from 'react';

const steps = ['Informasi Pribadi', 'Kontak & Alamat', 'Kepegawaian', 'Pendidikan', 'Keahlian & Riset'];

interface AddDosenDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddDosenDialog({ open, onClose }: AddDosenDialogProps) {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = () => {
    onClose();
    setActiveStep(0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Tambah Data Dosen</DialogTitle>
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
              <TextField fullWidth label="NIDN / NIDK" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="NIP" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Gelar Depan" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Gelar Belakang" />
            </Grid>
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
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Status Kepegawaian</InputLabel>
                <Select label="Status Kepegawaian">
                  <MenuItem value="Tetap PT">Tetap PT</MenuItem>
                  <MenuItem value="DLB">DLB</MenuItem>
                  <MenuItem value="Industri">Industri</MenuItem>
                  <MenuItem value="Asdos">Asdos</MenuItem>
                  <MenuItem value="Honorer">Honorer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
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
              <TextField fullWidth label="Kota" required />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Kode Pos" />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Jabatan Fungsional</InputLabel>
                <Select label="Jabatan Fungsional">
                  <MenuItem value="Asisten Ahli">Asisten Ahli</MenuItem>
                  <MenuItem value="Lektor">Lektor</MenuItem>
                  <MenuItem value="Lektor Kepala">Lektor Kepala</MenuItem>
                  <MenuItem value="Guru Besar">Guru Besar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Pangkat & Golongan" />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Status Sertifikasi Dosen</InputLabel>
                <Select label="Status Sertifikasi Dosen">
                  <MenuItem value="Sudah">Sudah</MenuItem>
                  <MenuItem value="Belum">Belum</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Tahun Sertifikasi" type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Bidang Serdos" />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Homebase Program Studi</InputLabel>
                <Select label="Homebase Program Studi">
                  <MenuItem value="Teknik Informatika">Teknik Informatika</MenuItem>
                  <MenuItem value="Sistem Informasi">Sistem Informasi</MenuItem>
                  <MenuItem value="Manajemen Informatika">Manajemen Informatika</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Nomor SK Pengangkatan" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Tanggal SK Pengangkatan" type="date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="SK Tugas Belajar" />
            </Grid>
          </Grid>
        )}

        {activeStep === 3 && (
          <Box>
            {['S1', 'S2', 'S3'].map((jenjang) => (
              <Box key={jenjang} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>{jenjang}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Bidang Studi" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Nama Universitas" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Negara" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="Tahun Lulus" type="number" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Judul Tesis / Disertasi" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="NIM / NPM" />
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="outlined" component="label" fullWidth>
                      Upload Ijazah & Transkrip
                      <input type="file" hidden accept=".pdf" />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {activeStep === 4 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Bidang Kompetensi Utama" placeholder="Machine Learning, Software Engineering" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Bidang Riset" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Minat Penelitian" multiline rows={2} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Kode Mata Kuliah yang Diampu" placeholder="TIF101, TIF202" />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Skill Teknis</Typography>
              <FormGroup row>
                <FormControlLabel control={<Checkbox />} label="Pemrograman" />
                <FormControlLabel control={<Checkbox />} label="Database" />
                <FormControlLabel control={<Checkbox />} label="Cloud" />
                <FormControlLabel control={<Checkbox />} label="AI/ML" />
                <FormControlLabel control={<Checkbox />} label="Cyber Security" />
              </FormGroup>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Google Scholar ID" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="SINTA ID" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="ORCID" />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Scopus ID" />
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
