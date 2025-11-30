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

const cplList = ['CPL01', 'CPL02', 'CPL03', 'CPL04', 'CPL05', 'CPL06', 'CPL07', 'CPL08', 'CPL09', 'CPL10', 'CPL11', 'CPL12', 'CPL13', 'CPL13-AI', 'CPL13-RPL', 'CPL13-SisTer'];

const initialMapping = [
  { kode: 'BK01', nama: 'Social Issues and Professional Practice', mapping: { CPL01: true, CPL02: true, CPL03: true, CPL04: false, CPL05: false, CPL06: false, CPL07: true, CPL08: false, CPL09: true, CPL10: true, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK02', nama: 'Project Management', mapping: { CPL01: true, CPL02: true, CPL03: true, CPL04: false, CPL05: true, CPL06: false, CPL07: true, CPL08: true, CPL09: true, CPL10: true, CPL11: false, CPL12: true, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK03', nama: 'User Experience Design', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL07: false, CPL08: true, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK04', nama: 'Data and Information Management', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: true, CPL06: false, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK05', nama: 'Parallel and Distributed Computing', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: true, CPL06: false, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK06', nama: 'Computer Networks', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK07', nama: 'Software Design', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: true, CPL06: false, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK08', nama: 'Operating Systems', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK09', nama: 'Data Structures, Algorithms and Complexity', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK10', nama: 'Programming Languages', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: true, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK11', nama: 'Programming Fundamentals', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: true, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK12', nama: 'Computing Systems Fundamentals', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK13', nama: 'Architecture and Organization', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK14', nama: 'Graphics and Visualization', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true, } },
  { kode: 'BK15', nama: 'Intelligent Systems', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: false, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: true, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK16', nama: 'Platform-based Development', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: true, CPL11: false, CPL12: true, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK17', nama: 'Cyber Security', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: true, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK18', nama: 'Computational Science', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK19', nama: 'Discrete Structures', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: true, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK20', nama: 'Human-Computer Interaction', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: false, CPL06: true, CPL07: false, CPL08: false, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK21', nama: 'Software Development Fundamentals', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL07: true, CPL08: true, CPL09: true, CPL10: false, CPL11: false, CPL12: true, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK22', nama: 'Software Engineering', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL07: true, CPL08: true, CPL09: false, CPL10: false, CPL11: true, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK23', nama: 'Systems Analysis & Design', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: true, CPL07: false, CPL08: true, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK24', nama: 'Software Quality, Verification and Validation', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL07: false, CPL08: true, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK25', nama: 'Software Modeling and Analysis', mapping: { CPL01: false, CPL02: false, CPL03: false, CPL04: false, CPL05: true, CPL06: false, CPL07: false, CPL08: true, CPL09: false, CPL10: false, CPL11: false, CPL12: false, CPL13: true, 'CPL13-AI': true, 'CPL13-RPL': true, 'CPL13-SisTer': true } },
  { kode: 'BK26', nama: 'Pengembangan Diri', mapping: { CPL01: true, CPL02: true, CPL03: true, CPL04: false, CPL05: false, CPL06: false, CPL07: false, CPL08: true, CPL09: true, CPL10: false, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
  { kode: 'BK27', nama: 'Metodologi Penelitian', mapping: { CPL01: true, CPL02: true, CPL03: true, CPL04: false, CPL05: false, CPL06: false, CPL07: true, CPL08: false, CPL09: true, CPL10: true, CPL11: false, CPL12: false, CPL13: false, 'CPL13-AI': false, 'CPL13-RPL': false, 'CPL13-SisTer': false } },
];

export default function PemetaanCPLBKTab() {
  const [mappingData, setMappingData] = useState(initialMapping);

  const handleToggle = (bkIndex: number, cpl: string) => {
    const newData = [...mappingData];
    (newData[bkIndex].mapping as any)[cpl] = !(newData[bkIndex].mapping as any)[cpl];
    setMappingData(newData);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ typography: 'h5', fontWeight: 'bold', color: 'primary.main' }}>Pemetaan CPL vs Bahan Kajian</Box>
        <Box sx={{ typography: 'body1', color: 'text.secondary', mt: 1 }}>
          Matriks ini memetakan hubungan antara Capaian Pembelajaran Lulusan (CPL) dengan Bahan Kajian (BK).
          Klik pada sel untuk menandai keterkaitan.
        </Box>
      </Box>

      <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <TableContainer sx={{ maxHeight: '70vh' }}>
          <Table stickyHeader size="small" sx={{ '& .MuiTableCell-root': { borderRight: '1px solid', borderColor: 'divider' } }}>
            <TableHead>
              <TableRow>
                <TableCell
                  rowSpan={2}
                  sx={{
                    minWidth: 300,
                    position: 'sticky',
                    left: 0,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    zIndex: 4,
                    fontWeight: 'bold',
                    borderRight: '2px solid',
                    borderColor: 'primary.dark'
                  }}
                >
                  Bahan Kajian
                </TableCell>
                <TableCell
                  rowSpan={2}
                  align="center"
                  sx={{
                    minWidth: 100,
                    position: 'sticky',
                    left: 300,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    zIndex: 4,
                    fontWeight: 'bold',
                    borderRight: '2px solid',
                    borderColor: 'primary.dark',
                    boxShadow: '4px 0 8px -2px rgba(0,0,0,0.1)'
                  }}
                >
                  Kode BK
                </TableCell>
                <TableCell
                  colSpan={cplList.length}
                  align="center"
                  sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontWeight: 'bold',
                    borderBottom: '1px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  Capaian Pembelajaran Lulusan (CPL)
                </TableCell>
              </TableRow>
              <TableRow>
                {cplList.map((cpl) => (
                  <TableCell
                    key={cpl}
                    align="center"
                    sx={{
                      minWidth: 80,
                      bgcolor: 'background.paper',
                      fontWeight: 'bold',
                      color: 'text.primary',
                      borderBottom: '2px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {cpl}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {mappingData.map((item, index) => (
                <TableRow
                  key={item.kode}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <TableCell
                    sx={{
                      position: 'sticky',
                      left: 0,
                      bgcolor: 'background.paper',
                      zIndex: 2,
                      fontWeight: 500,
                      borderRight: '2px solid',
                      borderColor: 'divider'
                    }}
                  >
                    {item.nama}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      position: 'sticky',
                      left: 300,
                      bgcolor: 'background.paper',
                      zIndex: 2,
                      borderRight: '2px solid',
                      borderColor: 'divider',
                      boxShadow: '4px 0 8px -2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {item.kode}
                  </TableCell>
                  {cplList.map((cpl) => {
                    const isChecked = item.mapping[cpl as keyof typeof item.mapping];
                    return (
                      <TableCell
                        key={cpl}
                        align="center"
                        onClick={() => handleToggle(index, cpl)}
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: isChecked ? 'action.selected' : 'inherit',
                          '&:hover': {
                            bgcolor: isChecked ? 'action.hover' : 'action.hover',
                            transform: 'scale(1.05)',
                            zIndex: 1,
                            position: 'relative',
                            boxShadow: 1
                          }
                        }}
                      >
                        <Checkbox
                          size="small"
                          checked={isChecked}
                          onChange={() => handleToggle(index, cpl)}
                          sx={{
                            p: 0,
                            '&.Mui-checked': {
                              color: 'primary.main',
                            }
                          }}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
