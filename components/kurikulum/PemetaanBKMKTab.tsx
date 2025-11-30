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

const bkList = ['BK01', 'BK02', 'BK03', 'BK04', 'BK05', 'BK06', 'BK07', 'BK08', 'BK09', 'BK10', 'BK11', 'BK12', 'BK13', 'BK14', 'BK15', 'BK16', 'BK17', 'BK18', 'BK19', 'BK20', 'BK21', 'BK22', 'BK23', 'BK24', 'BK25', 'BK26', 'BK27'];

const initialMapping = [
  { no: 1, kode: 'MK01', nama: 'Struktur Data dan Desain Pola', sks: 4, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: true, BK10: true, BK11: true, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: false } },
  { no: 2, kode: 'MK02', nama: 'Pemrograman Berorientasi Objek', sks: 5, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: true, BK10: true, BK11: true, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: false } },
  { no: 3, kode: 'MK03', nama: 'Dasar dasar Pemrograman', sks: 4, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: true, BK11: true, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: true, BK27: false } },
  { no: 4, kode: 'MK04', nama: 'Kecerdasan Buatan', sks: 3, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: true, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: false } },
  { no: 5, kode: 'MK05', nama: 'Dasar dasar Jaringan', sks: 4, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: true, BK06: true, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: false } },
  { no: 6, kode: 'MK06', nama: 'Agama 1', sks: 2, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: true, BK27: false } },
  { no: 7, kode: 'MK07', nama: 'Pancasila', sks: 2, jenis: 'W', mapping: { BK01: true, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: true, BK27: false } },
  { no: 8, kode: 'MK08', nama: 'Kewarganegaraan', sks: 2, jenis: 'W', mapping: { BK01: true, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: true, BK27: false } },
  { no: 9, kode: 'MK09', nama: 'Bahasa Indonesia', sks: 2, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: true, BK27: false } },
  { no: 10, kode: 'MK10', nama: 'Organisasi dan Arsitektur Komputer', sks: 4, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: true, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: false } },
  { no: 19, kode: 'MK19', nama: 'Tugas Akhir', sks: 6, jenis: 'W', mapping: { BK01: true, BK02: true, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: true, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: true } },
  { no: 25, kode: 'MK25', nama: 'Riset Mandiri', sks: 20, jenis: 'P', mapping: { BK01: true, BK02: false, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: true, BK20: false, BK21: false, BK22: true, BK23: false, BK24: true, BK25: true, BK26: true, BK27: true } },
  { no: 30, kode: 'MK30', nama: 'Studi Independen Kampus Merdeka', sks: '13-20', jenis: 'P', mapping: { BK01: true, BK02: true, BK03: false, BK04: false, BK05: false, BK06: true, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: true, BK27: true } },
  { no: 33, kode: 'MK33', nama: 'Magang', sks: 2, jenis: 'W', mapping: { BK01: true, BK02: true, BK03: false, BK04: false, BK05: false, BK06: false, BK07: false, BK08: false, BK09: false, BK10: false, BK11: false, BK12: false, BK13: false, BK14: false, BK15: false, BK16: false, BK17: false, BK18: false, BK19: false, BK20: false, BK21: false, BK22: false, BK23: false, BK24: false, BK25: false, BK26: false, BK27: true } },
  { no: 38, kode: 'MK38', nama: 'Pengembangan Permainan Digital (16 + 3 + 1 = 20 sks)', sks: 20, jenis: 'W', mapping: { BK01: false, BK02: false, BK03: true, BK04: true, BK05: true, BK06: false, BK07: false, BK08: false, BK09: true, BK10: false, BK11: false, BK12: false, BK13: false, BK14: true, BK15: true, BK16: true, BK17: true, BK18: false, BK19: false, BK20: false, BK21: true, BK22: true, BK23: true, BK24: true, BK25: true, BK26: true, BK27: true } },
];

export default function PemetaanBKMKTab() {
  const [mappingData, setMappingData] = useState(initialMapping);

  const handleToggle = (mkIndex: number, bk: string) => {
    const newData = [...mappingData];
    (newData[mkIndex].mapping as any)[bk] = !(newData[mkIndex].mapping as any)[bk];
    setMappingData(newData);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ typography: 'h5', fontWeight: 'bold', color: 'primary.main' }}>Bahan Kajian vs Mata Kuliah</Box>
        <Box sx={{ typography: 'body1', color: 'text.secondary', mt: 1 }}>
          Pemetaan bahan kajian ke dalam mata kuliah.
        </Box>
      </Box>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader size="small" sx={{ minWidth: 'max-content' }}>
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2} sx={{ width: 40, position: 'sticky', left: 0, bgcolor: 'primary.main', color: 'primary.contrastText', zIndex: 3, fontWeight: 'bold' }}>No</TableCell>
                <TableCell rowSpan={2} sx={{ width: 70, position: 'sticky', left: 40, bgcolor: 'primary.main', color: 'primary.contrastText', zIndex: 3, fontWeight: 'bold' }}>Kode</TableCell>
                <TableCell rowSpan={2} sx={{ minWidth: 200, maxWidth: 250, position: 'sticky', left: 110, bgcolor: 'primary.main', color: 'primary.contrastText', zIndex: 3, fontWeight: 'bold' }}>Nama MK</TableCell>
                <TableCell rowSpan={2} sx={{ width: 50, position: 'sticky', left: 310, bgcolor: 'primary.main', color: 'primary.contrastText', zIndex: 3, fontWeight: 'bold' }}>SKS</TableCell>
                <TableCell rowSpan={2} sx={{ width: 40, position: 'sticky', left: 360, bgcolor: 'primary.main', color: 'primary.contrastText', zIndex: 3, fontWeight: 'bold' }}>W/P</TableCell>
                <TableCell colSpan={bkList.length} align="center" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 'bold' }}>Bahan Kajian (BK)</TableCell>
              </TableRow>
              <TableRow>
                {bkList.map((bk) => (
                  <TableCell key={bk} align="center" sx={{ width: 50, fontSize: '0.75rem', bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 'bold' }}>{bk}</TableCell>
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
                  <TableCell sx={{ position: 'sticky', left: 360, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }} align="center">{item.jenis}</TableCell>
                  {bkList.map((bk) => (
                    <TableCell key={bk} align="center">
                      <Checkbox
                        size="small"
                        checked={(item.mapping as any)[bk]}
                        onChange={() => handleToggle(index, bk)}
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
