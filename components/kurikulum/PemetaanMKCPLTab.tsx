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

const cplList = ['CPL01', 'CPL02', 'CPL03', 'CPL04', 'CPL05', 'CPL06', 'CPL09', 'CPL10', 'CPL11'];

const initialMapping = [
  { no: 1, kode: 'MK01', nama: 'Etika dan Profesi', sks: '', mapping: { CPL01: true, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 2, kode: 'MK02', nama: 'Manajemen Proyek Teknologi Informasi', sks: '', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL09: false, CPL10: true, CPL11: false } },
  { no: 3, kode: 'MK03', nama: 'Proyek Perangkat Lunak', sks: '', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: true } },
  { no: 4, kode: 'MK04', nama: 'Struktur Data dan Desain Pola', sks: 4, mapping: { CPL01: false, CPL02: true, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 5, kode: 'MK05', nama: 'Pemrograman Berorientasi Objek', sks: 5, mapping: { CPL01: false, CPL02: true, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 6, kode: 'MK06', nama: 'Keamanan Informasi', sks: '', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: true, CPL10: false, CPL11: false } },
  { no: 7, kode: 'MK07', nama: 'Dasar dasar Pemrograman', sks: 4, mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: true, CPL11: false } },
  { no: 8, kode: 'MK08', nama: 'Pembelajaran Mesin', sks: '', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: false, CPL09: false, CPL10: true, CPL11: false } },
  { no: 9, kode: 'MK09', nama: 'Kecerdasan Buatan', sks: 3, mapping: { CPL01: false, CPL02: false, CPL03: true, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: true, CPL11: false } },
  { no: 10, kode: 'MK10', nama: 'Dasar dasar Jaringan', sks: 4, mapping: { CPL01: false, CPL02: true, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 11, kode: 'MK11', nama: 'Keamanan Jaringan', sks: '', mapping: { CPL01: false, CPL02: false, CPL03: true, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 12, kode: 'MK12', nama: 'Agama 1', sks: 2, mapping: { CPL01: true, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 13, kode: 'MK13', nama: 'Pancasila', sks: 2, mapping: { CPL01: true, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 14, kode: 'MK14', nama: 'Kewarganegaraan', sks: 2, mapping: { CPL01: true, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 15, kode: 'MK15', nama: 'Bahasa Indonesia', sks: 2, mapping: { CPL01: true, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 16, kode: 'MK16', nama: 'Organisasi dan Arsitektur Komputer', sks: 4, mapping: { CPL01: false, CPL02: true, CPL03: false, CPL04: true, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 17, kode: 'MK17', nama: 'Matematika Diskrit', sks: 4, mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 18, kode: 'MK18', nama: 'Matematika Komputer', sks: 4, mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 19, kode: 'MK19', nama: 'Interaksi Manusia Komputer', sks: 3, mapping: { CPL01: true, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: false, CPL09: false, CPL10: true, CPL11: false } },
  { no: 20, kode: 'MK20', nama: 'Sistem Operasi', sks: 3, mapping: { CPL01: false, CPL02: true, CPL03: false, CPL04: true, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
  { no: 21, kode: 'MK21', nama: 'Basis Data', sks: 4, mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: false, CPL09: false, CPL10: false, CPL11: false } },
];

export default function PemetaanMKCPLTab() {
  const [mappingData, setMappingData] = useState(initialMapping);

  const handleToggle = (mkIndex: number, cpl: string) => {
    const newData = [...mappingData];
    newData[mkIndex].mapping[cpl] = !newData[mkIndex].mapping[cpl];
    setMappingData(newData);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ typography: 'h6' }}>Mata Kuliah vs CPL</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          Matriks pemetaan mata kuliah dengan CPL yang dicapai.
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: '70vh', maxWidth: '100%', overflow: 'auto' }}>
        <Table stickyHeader size="small" sx={{ minWidth: 'max-content' }}>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ width: 40, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 3 }}><strong>No</strong></TableCell>
              <TableCell rowSpan={2} sx={{ width: 70, position: 'sticky', left: 40, bgcolor: 'background.paper', zIndex: 3 }}><strong>Kode</strong></TableCell>
              <TableCell rowSpan={2} sx={{ minWidth: 200, maxWidth: 250, position: 'sticky', left: 110, bgcolor: 'background.paper', zIndex: 3 }}><strong>Nama MK</strong></TableCell>
              <TableCell rowSpan={2} sx={{ width: 50, position: 'sticky', left: 310, bgcolor: 'background.paper', zIndex: 3 }}><strong>SKS</strong></TableCell>
              <TableCell colSpan={cplList.length} align="center"><strong>Capaian Pembelajaran Lulusan (CPL)</strong></TableCell>
            </TableRow>
            <TableRow>
              {cplList.map((cpl) => (
                <TableCell key={cpl} align="center" sx={{ width: 60, fontSize: '0.75rem' }}><strong>{cpl}</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingData.map((item, index) => (
              <TableRow key={item.kode} hover>
                <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }}>{item.no}</TableCell>
                <TableCell sx={{ position: 'sticky', left: 40, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }}>{item.kode}</TableCell>
                <TableCell sx={{ position: 'sticky', left: 110, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }}>{item.nama}</TableCell>
                <TableCell sx={{ position: 'sticky', left: 310, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }} align="center">{item.sks}</TableCell>
                {cplList.map((cpl) => (
                  <TableCell key={cpl} align="center">
                    <Checkbox 
                      size="small"
                      checked={item.mapping[cpl]} 
                      onChange={() => handleToggle(index, cpl)}
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
