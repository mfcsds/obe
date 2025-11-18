"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useState } from 'react';

const cplList = ['CPL01', 'CPL02', 'CPL03', 'CPL04', 'CPL05', 'CPL06', 'CPL07', 'CPL08', 'CPL09', 'CPL10', 'CPL11', 'CPL12', 'CPL13'];

const initialMapping = [
  { kode: 'BK01', nama: 'Social Issues and Professional Practice', mapping: { 
    CPL01: 'MK07, MK08, MK38, MK39, MK40, MK41, MK42, MK43, MK44, MK45', 
    CPL02: 'MK07, MK08, MK38, MK39, MK40, MK41, MK42, MK43, MK44, MK45', 
    CPL03: 'MK07, MK08, MK38, MK39, MK40, MK41, MK42, MK43, MK44, MK45', 
    CPL04: '', 
    CPL05: '', 
    CPL06: '', 
    CPL07: 'v', 
    CPL08: 'v', 
    CPL09: '', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: 'MK40, MK41, MK42, MK43, MK44, MK45' 
  }},
  { kode: 'BK02', nama: 'Project Management', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: '', 
    CPL05: 'v', 
    CPL06: '', 
    CPL07: 'v', 
    CPL08: 'v', 
    CPL09: '', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: 'MK40, MK41, MK42, MK43, MK44, MK45' 
  }},
  { kode: 'BK03', nama: 'User Experience Design', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: '', 
    CPL05: 'v', 
    CPL06: '', 
    CPL07: '', 
    CPL08: 'v', 
    CPL09: '', 
    CPL10: 'v', 
    CPL11: '', 
    CPL12: '', 
    CPL13: '' 
  }},
  { kode: 'BK04', nama: 'Data and Information Management', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: '', 
    CPL05: '', 
    CPL06: '', 
    CPL07: 'v', 
    CPL08: 'v', 
    CPL09: '', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: '' 
  }},
  { kode: 'BK05', nama: 'Parallel and Distributed Computing', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: '', 
    CPL05: '', 
    CPL06: '', 
    CPL07: '', 
    CPL08: 'v', 
    CPL09: '', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: '' 
  }},
  { kode: 'BK06', nama: 'Computer Networks', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: 'MK05', 
    CPL05: '', 
    CPL06: '', 
    CPL07: '', 
    CPL08: 'MK05', 
    CPL09: '', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: '' 
  }},
  { kode: 'BK07', nama: 'Software Design', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: '', 
    CPL05: '', 
    CPL06: '', 
    CPL07: '', 
    CPL08: 'v', 
    CPL09: '', 
    CPL10: '', 
    CPL11: 'v', 
    CPL12: '', 
    CPL13: '' 
  }},
  { kode: 'BK08', nama: 'Operating Systems', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: 'MK10, MK14', 
    CPL05: '', 
    CPL06: 'MK10, MK14', 
    CPL07: '', 
    CPL08: 'MK10, MK14', 
    CPL09: 'MK10, MK14', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: '' 
  }},
  { kode: 'BK09', nama: 'Data Structures, Algorithms and Complexity', mapping: { 
    CPL01: '', 
    CPL02: '', 
    CPL03: '', 
    CPL04: 'MK01, MK02', 
    CPL05: '', 
    CPL06: '', 
    CPL07: '', 
    CPL08: 'MK01, MK02', 
    CPL09: 'MK01, MK02', 
    CPL10: '', 
    CPL11: '', 
    CPL12: '', 
    CPL13: '' 
  }},
];

export default function PemetaanCPLBKMKTab() {
  const [mappingData, setMappingData] = useState(initialMapping);

  const handleChange = (bkIndex: number, cpl: string, value: string) => {
    const newData = [...mappingData];
    newData[bkIndex].mapping[cpl] = value;
    setMappingData(newData);
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ typography: 'h6' }}>CPL vs BK vs Mata Kuliah</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          Pemetaan komprehensif antara CPL, Bahan Kajian, dan Mata Kuliah.
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: '70vh', maxWidth: '100%', overflow: 'auto' }}>
        <Table stickyHeader size="small" sx={{ minWidth: 'max-content' }}>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ minWidth: 250, position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 3 }}><strong>Bahan Kajian</strong></TableCell>
              <TableCell rowSpan={2} sx={{ minWidth: 80, position: 'sticky', left: 250, bgcolor: 'background.paper', zIndex: 3 }}><strong>BK</strong></TableCell>
              <TableCell colSpan={cplList.length} align="center"><strong>Capaian Pembelajaran Lulusan (CPL)</strong></TableCell>
            </TableRow>
            <TableRow>
              {cplList.map((cpl) => (
                <TableCell key={cpl} align="center" sx={{ minWidth: 150, fontSize: '0.75rem' }}><strong>{cpl}</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {mappingData.map((item, index) => (
              <TableRow key={item.kode} hover>
                <TableCell sx={{ position: 'sticky', left: 0, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }}>{item.nama}</TableCell>
                <TableCell sx={{ position: 'sticky', left: 250, bgcolor: 'background.paper', zIndex: 1, fontSize: '0.875rem' }}>{item.kode}</TableCell>
                {cplList.map((cpl) => (
                  <TableCell key={cpl} align="center">
                    <TextField
                      size="small"
                      value={item.mapping[cpl]}
                      onChange={(e) => handleChange(index, cpl, e.target.value)}
                      placeholder="MK01, MK02"
                      sx={{ 
                        '& .MuiInputBase-input': { 
                          fontSize: '0.75rem',
                          padding: '4px 8px'
                        }
                      }}
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
