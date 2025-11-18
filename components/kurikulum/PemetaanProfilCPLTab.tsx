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
    newData[cplIndex].mapping[pl] = !newData[cplIndex].mapping[pl];
    setMappingData(newData);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ typography: 'h6' }}>Pemetaan Profil Lulusan dan CPL</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          Matriks pemetaan antara profil lulusan dengan CPL.
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%" align="center"><strong>No</strong></TableCell>
              <TableCell width="10%" align="center"><strong>Kode CPL</strong></TableCell>
              <TableCell colSpan={profilLulusanList.length} align="center"><strong>Profil Lulusan (PL)</strong></TableCell>
            </TableRow>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              {profilLulusanList.map((pl) => (
                <TableCell key={pl} align="center" width={`${80 / profilLulusanList.length}%`}><strong>{pl}</strong></TableCell>
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
                      checked={item.mapping[pl]} 
                      onChange={() => handleToggle(index, pl)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
