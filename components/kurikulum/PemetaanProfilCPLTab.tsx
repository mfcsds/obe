"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from '@mui/material';
import { useState } from 'react';

const profilLulusanList = ['PL01', 'PL02', 'PL03', 'PL04'];

const initialMapping = [
  { kode: 'CPL01', mapping: { PL01: true, PL02: false, PL03: false, PL04: false } },
  { kode: 'CPL02', mapping: { PL01: true, PL02: false, PL03: false, PL04: false } },
  { kode: 'CPL03', mapping: { PL01: true, PL02: false, PL03: false, PL04: false } },
  { kode: 'CPL04', mapping: { PL01: false, PL02: true, PL03: false, PL04: false } },
  { kode: 'CPL05', mapping: { PL01: false, PL02: true, PL03: false, PL04: false } },
  { kode: 'CPL06', mapping: { PL01: false, PL02: true, PL03: false, PL04: false } },
  { kode: 'CPL07', mapping: { PL01: true, PL02: false, PL03: true, PL04: false } },
  { kode: 'CPL08', mapping: { PL01: true, PL02: false, PL03: true, PL04: false } },
  { kode: 'CPL09', mapping: { PL01: true, PL02: false, PL03: true, PL04: false } },
  { kode: 'CPL10', mapping: { PL01: true, PL02: false, PL03: true, PL04: false } },
  { kode: 'CPL11', mapping: { PL01: true, PL02: false, PL03: false, PL04: true } },
  { kode: 'CPL12', mapping: { PL01: true, PL02: false, PL03: false, PL04: true } },
  { kode: 'CPL13', mapping: { PL01: true, PL02: false, PL03: false, PL04: true } },
];

export default function PemetaanProfilCPLTab() {
  const [mappingData, setMappingData] = useState(initialMapping);

  const handleToggle = (cplIndex: number, pl: string) => {
    const newData = [...mappingData];
    (newData[cplIndex].mapping as any)[pl] = !(newData[cplIndex].mapping as any)[pl];
    setMappingData(newData);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ typography: 'h5', fontWeight: 'bold', color: 'primary.main' }}>Pemetaan Profil Lulusan dan CPL</Box>
        <Box sx={{ typography: 'body1', color: 'text.secondary', mt: 1 }}>
          Matriks pemetaan antara profil lulusan dengan CPL.
        </Box>
      </Box>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell width="5%" align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>No</TableCell>
                <TableCell width="10%" align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Kode CPL</TableCell>
                <TableCell colSpan={profilLulusanList.length} align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Profil Lulusan (PL)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.light' }}></TableCell>
                <TableCell sx={{ bgcolor: 'primary.light' }}></TableCell>
                {profilLulusanList.map((pl) => (
                  <TableCell key={pl} align="center" width={`${80 / profilLulusanList.length}%`} sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 'bold' }}>{pl}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mappingData.map((item, index) => (
                <TableRow key={item.kode} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{item.kode}</TableCell>
                  {profilLulusanList.map((pl) => (
                    <TableCell key={pl} align="center">
                      <Checkbox
                        checked={(item.mapping as any)[pl]}
                        onChange={() => handleToggle(index, pl)}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
