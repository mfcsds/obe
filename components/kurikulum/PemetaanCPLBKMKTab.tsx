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
  Paper,
} from '@mui/material';
import { useState } from 'react';

const cplList = ['CPL01', 'CPL02', 'CPL03', 'CPL04', 'CPL05', 'CPL06', 'CPL07', 'CPL08', 'CPL09', 'CPL10', 'CPL11', 'CPL12', 'CPL13'];

const initialMapping = [
  {
    kode: 'BK01', nama: 'Social Issues and Professional Practice', mapping: {
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
    }
  },
  {
    kode: 'BK02', nama: 'Project Management', mapping: {
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
    }
  },
  {
    kode: 'BK03', nama: 'User Experience Design', mapping: {
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
    }
  },
  {
    kode: 'BK04', nama: 'Data and Information Management', mapping: {
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
    }
  },
  {
    kode: 'BK05', nama: 'Parallel and Distributed Computing', mapping: {
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
    }
  },
  {
    kode: 'BK06', nama: 'Computer Networks', mapping: {
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
    }
  },
  {
    kode: 'BK07', nama: 'Software Design', mapping: {
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
    }
  },
  {
    kode: 'BK08', nama: 'Operating Systems', mapping: {
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
    }
  },
  {
    kode: 'BK09', nama: 'Data Structures, Algorithms and Complexity', mapping: {
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
    }
  },
];

export default function PemetaanCPLBKMKTab() {
  const [mappingData, setMappingData] = useState(initialMapping);

  const handleChange = (bkIndex: number, cpl: string, value: string) => {
    const newData = [...mappingData];
    (newData[bkIndex].mapping as any)[cpl] = value;
    setMappingData(newData);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ typography: 'h5', fontWeight: 'bold', color: 'primary.main' }}>CPL vs BK vs Mata Kuliah</Box>
        <Box sx={{ typography: 'body1', color: 'text.secondary', mt: 1 }}>
          Pemetaan komprehensif antara CPL, Bahan Kajian, dan Mata Kuliah.
          Isi sel dengan kode mata kuliah yang relevan.
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
                    minWidth: 200,
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
                    minWidth: 80,
                    position: 'sticky',
                    left: 200,
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
                      left: 200,
                      bgcolor: 'background.paper',
                      zIndex: 2,
                      borderRight: '2px solid',
                      borderColor: 'divider',
                      boxShadow: '4px 0 8px -2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {item.kode}
                  </TableCell>
                  {cplList.map((cpl) => (
                    <TableCell
                      key={cpl}
                      align="center"
                      sx={{
                        p: 1,
                        minWidth: 80
                      }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        value={(item.mapping as any)[cpl]}
                        onChange={(e) => handleChange(index, cpl, e.target.value)}
                        placeholder="-"
                        sx={{
                          '& .MuiInputBase-root': {
                            fontSize: '0.875rem',
                            bgcolor: 'background.paper',
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'transparent'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'action.active'
                          },
                          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main'
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
      </Paper>
    </Box>
  );
}
