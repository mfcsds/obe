"use client";

import {
  Box,
  Paper,
  Typography,
  Chip,
  Stack,
  Alert,
  Divider,
} from "@mui/material";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import type { MataKuliah } from "@/types/kurikulum-detail";

interface OrganisasiMataKuliahTabProps {
  mataKuliahList: MataKuliah[];
}

/**
 * Tab Organisasi Mata Kuliah: menampilkan mata kuliah yang dikelompokkan per
 * semester. Data turunan (read-only) dari Susunan Mata Kuliah, jadi tidak ada
 * aksi CRUD di sini — pengelolaan dilakukan di tab Susunan Mata Kuliah.
 */
export default function OrganisasiMataKuliahTab({
  mataKuliahList,
}: OrganisasiMataKuliahTabProps) {
  // Kelompokkan per semester agar struktur kurikulum terlihat jelas.
  const perSemester = mataKuliahList.reduce<Map<number, MataKuliah[]>>((map, mk) => {
    const existing = map.get(mk.semester) ?? [];
    map.set(mk.semester, [...existing, mk]);
    return map;
  }, new Map());

  const semesterUrut = [...perSemester.keys()].sort((a, b) => a - b);
  const totalSks = mataKuliahList.reduce((total, mk) => total + mk.sks, 0);

  return (
    <Box>
      <TabHeader
        title="Organisasi Mata Kuliah per Semester"
        description="Sebaran mata kuliah pada setiap semester, disusun otomatis berdasarkan Susunan Mata Kuliah."
        badges={[`${semesterUrut.length} semester`, `${totalSks} SKS`]}
      />

      {mataKuliahList.length === 0 ? (
        <Alert severity="info">
          Belum ada mata kuliah. Lengkapi tahap Susunan Mata Kuliah terlebih dahulu.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {semesterUrut.map((semester) => {
            const daftar = perSemester.get(semester) ?? [];
            const sksSemester = daftar.reduce((total, mk) => total + mk.sks, 0);

            return (
              <Paper
                key={semester}
                elevation={0}
                sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    Semester {semester}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label={`${daftar.length} MK`} size="small" variant="outlined" />
                    <Chip label={`${sksSemester} SKS`} size="small" color="primary" />
                  </Stack>
                </Stack>
                <Divider sx={{ mb: 1.5 }} />
                <Stack spacing={1}>
                  {daftar.map((mk) => (
                    <Stack
                      key={mk.id}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {mk.kode} &middot; {mk.nama}
                        </Typography>
                        {mk.jenis && (
                          <Typography variant="caption" color="text.secondary">
                            {mk.jenis}
                          </Typography>
                        )}
                      </Box>
                      <Chip label={`${mk.sks} SKS`} size="small" variant="outlined" />
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
