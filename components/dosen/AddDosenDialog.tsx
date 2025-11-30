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

  const handleSaveDraft = () => {
    onClose();
    setActiveStep(0);
    // TODO: Implement actual draft saving logic
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Tambah Data Dosen</DialogTitle>
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
              <Typography variant="h6" gutterBottom color="primary">Identitas Diri</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Nama Lengkap (Sesuai KTP)" required />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Nomor KTP" required type="number" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="NIDN / NIDK" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="NIP" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Gelar Depan" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Gelar Belakang" />
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
            <Box sx={{ gridColumn: 'span 12' }}>
              <FormControl fullWidth required>
                <InputLabel>Status Kepegawaian</InputLabel>
                <Select label="Status Kepegawaian" defaultValue="">
                  <MenuItem value="Tetap PT">Tetap PT</MenuItem>
                  <MenuItem value="DLB">DLB</MenuItem>
                  <MenuItem value="Industri">Industri</MenuItem>
                  <MenuItem value="Asdos">Asdos</MenuItem>
                  <MenuItem value="Honorer">Honorer</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
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
              <TextField fullWidth label="Kota" required />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Kode Pos" />
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Data Kepegawaian</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel>Jabatan Fungsional</InputLabel>
                <Select label="Jabatan Fungsional" defaultValue="">
                  <MenuItem value="Asisten Ahli">Asisten Ahli</MenuItem>
                  <MenuItem value="Lektor">Lektor</MenuItem>
                  <MenuItem value="Lektor Kepala">Lektor Kepala</MenuItem>
                  <MenuItem value="Guru Besar">Guru Besar</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Pangkat & Golongan" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <FormControl fullWidth>
                <InputLabel>Status Sertifikasi Dosen</InputLabel>
                <Select label="Status Sertifikasi Dosen" defaultValue="">
                  <MenuItem value="Sudah">Sudah</MenuItem>
                  <MenuItem value="Belum">Belum</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Tahun Sertifikasi" type="number" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Bidang Serdos" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <FormControl fullWidth required>
                <InputLabel>Homebase Program Studi</InputLabel>
                <Select label="Homebase Program Studi" defaultValue="">
                  <MenuItem value="Teknik Informatika">Teknik Informatika</MenuItem>
                  <MenuItem value="Sistem Informasi">Sistem Informasi</MenuItem>
                  <MenuItem value="Manajemen Informatika">Manajemen Informatika</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Nomor SK Pengangkatan" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Tanggal SK Pengangkatan" type="date" InputLabelProps={{ shrink: true }} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="SK Tugas Belajar" />
            </Box>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            {['S1', 'S2', 'S3'].map((jenjang) => (
              <Box key={jenjang} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">{jenjang}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
                  <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <TextField fullWidth label="Bidang Studi" />
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <TextField fullWidth label="Nama Universitas" />
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <TextField fullWidth label="Negara" />
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <TextField fullWidth label="Tahun Lulus" type="number" />
                  </Box>
                  <Box sx={{ gridColumn: 'span 12' }}>
                    <TextField fullWidth label="Judul Tesis / Disertasi" />
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <TextField fullWidth label="NIM / NPM" />
                  </Box>
                  <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
                    <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
                      Upload Ijazah & Transkrip
                      <input type="file" hidden accept=".pdf" />
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {activeStep === 4 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="h6" gutterBottom color="primary">Keahlian & Riset</Typography>
              <Divider sx={{ mb: 2 }} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Bidang Kompetensi Utama" placeholder="Machine Learning, Software Engineering" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Bidang Riset" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Minat Penelitian" multiline rows={2} />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField fullWidth label="Kode Mata Kuliah yang Diampu" placeholder="TIF101, TIF202" />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <Typography variant="subtitle2" gutterBottom>Skill Teknis</Typography>
              <FormGroup row>
                <FormControlLabel control={<Checkbox />} label="Pemrograman" />
                <FormControlLabel control={<Checkbox />} label="Database" />
                <FormControlLabel control={<Checkbox />} label="Cloud" />
                <FormControlLabel control={<Checkbox />} label="AI/ML" />
                <FormControlLabel control={<Checkbox />} label="Cyber Security" />
              </FormGroup>
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Google Scholar ID" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="SINTA ID" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="ORCID" />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 12', md: 'span 6' } }}>
              <TextField fullWidth label="Scopus ID" />
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
