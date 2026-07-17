"use client";

import { Box, Typography, Stack } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";

const HIGHLIGHTS = [
  {
    icon: AutoAwesomeOutlinedIcon,
    title: "AI-Assisted Curriculum Design",
    description: "Susun CPL, CPMK, dan pemetaan kurikulum OBE lebih cepat.",
  },
  {
    icon: SchoolOutlinedIcon,
    title: "Kelola Civitas Akademik",
    description: "Data dosen, mahasiswa, dan alumni dalam satu platform.",
  },
  {
    icon: AssessmentOutlinedIcon,
    title: "Siap Akreditasi",
    description: "Laporan dan pemetaan yang sejalan standar LAM INFOKOM.",
  },
];

/**
 * Panel branding yang ditampilkan di sisi kiri halaman sign-in/sign-up.
 * Diekstrak jadi komponen bersama agar kedua halaman auth selalu punya
 * tampilan dan pesan yang konsisten (lihat steering design-system.md).
 */
export function AuthBrandPanel() {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 6,
        width: "100%",
        height: "100%",
        px: { xs: 4, md: 8 },
        py: { xs: 6, md: 0 },
        color: "secondary.contrastText",
        background:
          "linear-gradient(135deg, #78350f 0%, #92400e 45%, #f59e0b 100%)",
        overflow: "hidden",
      }}
    >
      {/* Aksen dekoratif lingkaran, murni visual */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 260,
          height: 260,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.08)",
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: -100,
          left: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.06)",
        }}
      />

      <Stack direction="row" spacing={1.5} alignItems="center">
        <FiberManualRecordIcon sx={{ fontSize: 40, color: "#fde68a" }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            OBE Teknik Informatika
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            Universitas YARSI
          </Typography>
        </Box>
      </Stack>

      <Box>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mb: 2, fontSize: { xs: "1.75rem", md: "2.5rem" } }}
        >
          Rancang Kurikulum Berbasis Capaian Pembelajaran
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 480 }}>
          Platform terpadu untuk kaprodi, dosen, dan mahasiswa mengelola
          kurikulum Outcome Based Education secara kolaboratif.
        </Typography>
      </Box>

      <Stack spacing={2.5}>
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <Stack key={title} direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {description}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
