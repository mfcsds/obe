"use client";

import { useState, type ReactNode } from "react";
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Divider,
  Button,
} from "@mui/material";
import {
  Article,
  School,
  EmojiEvents,
  VolunteerActivism,
  ArrowBack,
} from "@mui/icons-material";
import Link from "next/link";
import { RekamJejakTab } from "@/components/dosen/RekamJejakTab";
import type { DataTableColumn } from "@/components/common/DataTable";
import type {
  Dosen,
  DosenMengajar,
  DosenPenelitian,
  DosenPkm,
  DosenPublikasi,
  DosenRekamJejak,
  DosenRekognisi,
  DosenSeminar,
} from "@/types/dosen";

interface DosenProfilViewProps {
  dosen: Dosen;
  rekamJejak: DosenRekamJejak;
  canManage: boolean;
}

/** Pilihan dropdown yang dipakai berulang pada form rekam jejak. */
const OPSI = {
  jenisPublikasi: [
    "Jurnal Internasional",
    "Jurnal Nasional",
    "Prosiding",
    "Buku",
    "HKI/Paten",
  ],
  statusPublikasi: ["Published", "Accepted", "Submitted", "Draft"],
  skemaPenelitian: [
    "Penelitian Dasar",
    "Penelitian Terapan",
    "Penelitian Internal",
    "Hibah Kemdikbud",
  ],
  statusKegiatan: ["Aktif", "Selesai", "Dibatalkan"],
  tingkat: ["Internasional", "Nasional", "Regional", "Universitas", "Fakultas"],
  peranSeminar: ["Narasumber", "Moderator", "Peserta", "Panitia"],
  jenisSeminar: ["Seminar", "Webinar", "Workshop", "Konferensi"],
  semester: ["Ganjil", "Genap", "Antara"],
} as const;

/** Menampilkan nilai opsional dengan fallback tanda hubung. */
const orDash = (value: string | number | null) =>
  value === null || value === "" ? "-" : value;

/**
 * Halaman profil dosen: identitas, statistik rekam jejak, dan enam tab
 * rekam jejak yang seluruhnya terhubung ke database.
 */
export function DosenProfilView({ dosen, rekamJejak, canManage }: DosenProfilViewProps) {
  const [tabValue, setTabValue] = useState(0);

  const statistik = [
    { label: "Publikasi", value: rekamJejak.publikasi.length, icon: Article, color: "#1976d2" },
    { label: "Penelitian", value: rekamJejak.penelitian.length, icon: School, color: "#2e7d32" },
    {
      label: "Pengabdian Masyarakat",
      value: rekamJejak.pkm.length,
      icon: VolunteerActivism,
      color: "#ed6c02",
    },
    {
      label: "Rekognisi",
      value: rekamJejak.rekognisi.length,
      icon: EmojiEvents,
      color: "#9c27b0",
    },
  ];

  const publikasiColumns: DataTableColumn<DosenPublikasi>[] = [
    { key: "judul", label: "Judul" },
    { key: "tahun", label: "Tahun", align: "center", render: (r) => orDash(r.tahun) },
    { key: "jenis", label: "Jenis", render: (r) => orDash(r.jenis) },
    { key: "penerbit", label: "Penerbit", render: (r) => orDash(r.penerbit) },
    {
      key: "status",
      label: "Status",
      render: (r) =>
        r.status ? <Chip label={r.status} color="success" size="small" variant="outlined" /> : "-",
    },
  ];

  const penelitianColumns: DataTableColumn<DosenPenelitian>[] = [
    { key: "judul", label: "Judul Penelitian" },
    { key: "tahun", label: "Tahun", align: "center", render: (r) => orDash(r.tahun) },
    { key: "skema", label: "Skema", render: (r) => orDash(r.skema) },
    { key: "dana", label: "Dana", render: (r) => orDash(r.dana) },
    {
      key: "status",
      label: "Status",
      render: (r) =>
        r.status ? (
          <Chip
            label={r.status}
            color={r.status === "Aktif" ? "primary" : "default"}
            size="small"
            variant="outlined"
          />
        ) : (
          "-"
        ),
    },
  ];

  const pkmColumns: DataTableColumn<DosenPkm>[] = [
    { key: "judul", label: "Judul PKM" },
    { key: "tahun", label: "Tahun", align: "center", render: (r) => orDash(r.tahun) },
    { key: "mitra", label: "Mitra", render: (r) => orDash(r.mitra) },
    { key: "dana", label: "Dana", render: (r) => orDash(r.dana) },
    {
      key: "status",
      label: "Status",
      render: (r) =>
        r.status ? <Chip label={r.status} color="success" size="small" variant="outlined" /> : "-",
    },
  ];

  const rekognisiColumns: DataTableColumn<DosenRekognisi>[] = [
    { key: "nama", label: "Nama Penghargaan" },
    { key: "penyelenggara", label: "Penyelenggara", render: (r) => orDash(r.penyelenggara) },
    { key: "tahun", label: "Tahun", align: "center", render: (r) => orDash(r.tahun) },
    {
      key: "tingkat",
      label: "Tingkat",
      render: (r) =>
        r.tingkat ? (
          <Chip label={r.tingkat} color="secondary" size="small" variant="outlined" />
        ) : (
          "-"
        ),
    },
  ];

  const seminarColumns: DataTableColumn<DosenSeminar>[] = [
    { key: "judul", label: "Judul" },
    { key: "peran", label: "Peran", render: (r) => orDash(r.peran) },
    { key: "penyelenggara", label: "Penyelenggara", render: (r) => orDash(r.penyelenggara) },
    { key: "tanggal", label: "Tanggal", render: (r) => orDash(r.tanggal) },
    {
      key: "jenis",
      label: "Jenis",
      render: (r) =>
        r.jenis ? <Chip label={r.jenis} color="info" size="small" variant="outlined" /> : "-",
    },
  ];

  const mengajarColumns: DataTableColumn<DosenMengajar>[] = [
    { key: "kodeMk", label: "Kode MK" },
    { key: "namaMk", label: "Mata Kuliah" },
    { key: "sks", label: "SKS", align: "center", render: (r) => orDash(r.sks) },
    { key: "tahunAkademik", label: "Tahun Akademik", render: (r) => orDash(r.tahunAkademik) },
    { key: "semester", label: "Semester", render: (r) => orDash(r.semester) },
  ];

  const tabItems: Array<{ label: string; content: ReactNode }> = [
    {
      label: "Publikasi",
      content: (
        <RekamJejakTab<DosenPublikasi>
          jenis="publikasi"
          dosenId={dosen.id}
          canManage={canManage}
          rows={rekamJejak.publikasi}
          columns={publikasiColumns}
          entityLabel="Publikasi"
          emptyMessage="Belum ada publikasi yang tercatat."
          getRowLabel={(row) => `Publikasi "${row.judul}"`}
          emptyValues={{ judul: "", tahun: "", jenis: "", penerbit: "", status: "" }}
          toFormValues={(row) => ({
            judul: row.judul,
            tahun: row.tahun ?? "",
            jenis: row.jenis ?? "",
            penerbit: row.penerbit ?? "",
            status: row.status ?? "",
          })}
          fields={[
            { name: "judul", label: "Judul Publikasi", required: true, type: "multiline" },
            { name: "tahun", label: "Tahun", type: "number", span: "half" },
            { name: "jenis", label: "Jenis", options: OPSI.jenisPublikasi, span: "half" },
            { name: "penerbit", label: "Penerbit", span: "half" },
            { name: "status", label: "Status", options: OPSI.statusPublikasi, span: "half" },
          ]}
        />
      ),
    },
    {
      label: "Hibah Penelitian",
      content: (
        <RekamJejakTab<DosenPenelitian>
          jenis="penelitian"
          dosenId={dosen.id}
          canManage={canManage}
          rows={rekamJejak.penelitian}
          columns={penelitianColumns}
          entityLabel="Penelitian"
          emptyMessage="Belum ada penelitian yang tercatat."
          getRowLabel={(row) => `Penelitian "${row.judul}"`}
          emptyValues={{ judul: "", tahun: "", skema: "", dana: "", status: "" }}
          toFormValues={(row) => ({
            judul: row.judul,
            tahun: row.tahun ?? "",
            skema: row.skema ?? "",
            dana: row.dana ?? "",
            status: row.status ?? "",
          })}
          fields={[
            { name: "judul", label: "Judul Penelitian", required: true, type: "multiline" },
            { name: "tahun", label: "Tahun", type: "number", span: "half" },
            { name: "skema", label: "Skema", options: OPSI.skemaPenelitian, span: "half" },
            {
              name: "dana",
              label: "Dana",
              span: "half",
              placeholder: "Rp 50.000.000",
            },
            { name: "status", label: "Status", options: OPSI.statusKegiatan, span: "half" },
          ]}
        />
      ),
    },
    {
      label: "Hibah PKM",
      content: (
        <RekamJejakTab<DosenPkm>
          jenis="pkm"
          dosenId={dosen.id}
          canManage={canManage}
          rows={rekamJejak.pkm}
          columns={pkmColumns}
          entityLabel="PKM"
          emptyMessage="Belum ada pengabdian masyarakat yang tercatat."
          getRowLabel={(row) => `PKM "${row.judul}"`}
          emptyValues={{ judul: "", tahun: "", mitra: "", dana: "", status: "" }}
          toFormValues={(row) => ({
            judul: row.judul,
            tahun: row.tahun ?? "",
            mitra: row.mitra ?? "",
            dana: row.dana ?? "",
            status: row.status ?? "",
          })}
          fields={[
            { name: "judul", label: "Judul PKM", required: true, type: "multiline" },
            { name: "tahun", label: "Tahun", type: "number", span: "half" },
            { name: "mitra", label: "Mitra", span: "half" },
            { name: "dana", label: "Dana", span: "half", placeholder: "Rp 15.000.000" },
            { name: "status", label: "Status", options: OPSI.statusKegiatan, span: "half" },
          ]}
        />
      ),
    },
    {
      label: "Rekognisi",
      content: (
        <RekamJejakTab<DosenRekognisi>
          jenis="rekognisi"
          dosenId={dosen.id}
          canManage={canManage}
          rows={rekamJejak.rekognisi}
          columns={rekognisiColumns}
          entityLabel="Rekognisi"
          emptyMessage="Belum ada rekognisi yang tercatat."
          getRowLabel={(row) => `Rekognisi "${row.nama}"`}
          emptyValues={{ nama: "", penyelenggara: "", tahun: "", tingkat: "" }}
          toFormValues={(row) => ({
            nama: row.nama,
            penyelenggara: row.penyelenggara ?? "",
            tahun: row.tahun ?? "",
            tingkat: row.tingkat ?? "",
          })}
          fields={[
            { name: "nama", label: "Nama Penghargaan", required: true },
            { name: "penyelenggara", label: "Penyelenggara", span: "half" },
            { name: "tahun", label: "Tahun", type: "number", span: "half" },
            { name: "tingkat", label: "Tingkat", options: OPSI.tingkat, span: "half" },
          ]}
        />
      ),
    },
    {
      label: "Seminar & Webinar",
      content: (
        <RekamJejakTab<DosenSeminar>
          jenis="seminar"
          dosenId={dosen.id}
          canManage={canManage}
          rows={rekamJejak.seminar}
          columns={seminarColumns}
          entityLabel="Seminar/Webinar"
          emptyMessage="Belum ada seminar atau webinar yang tercatat."
          getRowLabel={(row) => `Kegiatan "${row.judul}"`}
          emptyValues={{ judul: "", peran: "", penyelenggara: "", tanggal: "", jenis: "" }}
          toFormValues={(row) => ({
            judul: row.judul,
            peran: row.peran ?? "",
            penyelenggara: row.penyelenggara ?? "",
            tanggal: row.tanggal ?? "",
            jenis: row.jenis ?? "",
          })}
          fields={[
            { name: "judul", label: "Judul Kegiatan", required: true },
            { name: "peran", label: "Peran", options: OPSI.peranSeminar, span: "half" },
            { name: "jenis", label: "Jenis", options: OPSI.jenisSeminar, span: "half" },
            { name: "penyelenggara", label: "Penyelenggara", span: "half" },
            { name: "tanggal", label: "Tanggal", type: "date", span: "half" },
          ]}
        />
      ),
    },
    {
      label: "Riwayat Mengajar",
      content: (
        <RekamJejakTab<DosenMengajar>
          jenis="mengajar"
          dosenId={dosen.id}
          canManage={canManage}
          rows={rekamJejak.mengajar}
          columns={mengajarColumns}
          entityLabel="Riwayat Mengajar"
          emptyMessage="Belum ada riwayat mengajar yang tercatat."
          getRowLabel={(row) => `Mata kuliah ${row.kodeMk}`}
          emptyValues={{ kodeMk: "", namaMk: "", sks: "", tahunAkademik: "", semester: "" }}
          toFormValues={(row) => ({
            kodeMk: row.kodeMk,
            namaMk: row.namaMk,
            sks: row.sks ?? "",
            tahunAkademik: row.tahunAkademik ?? "",
            semester: row.semester ?? "",
          })}
          fields={[
            { name: "kodeMk", label: "Kode Mata Kuliah", required: true, span: "half" },
            { name: "sks", label: "SKS", type: "number", span: "half" },
            { name: "namaMk", label: "Nama Mata Kuliah", required: true },
            {
              name: "tahunAkademik",
              label: "Tahun Akademik",
              span: "half",
              placeholder: "2024/2025",
            },
            { name: "semester", label: "Semester", options: OPSI.semester, span: "half" },
          ]}
        />
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper
        elevation={2}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
      >
        <Button
          component={Link}
          href="/dosen"
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ mb: 3 }}
        >
          Kembali
        </Button>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              fontSize: 40,
              fontWeight: "bold",
            }}
          >
            {dosen.nama.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {dosen.nama}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              NIDN: {dosen.nidn}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {dosen.email}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {dosen.jabatan && <Chip label={dosen.jabatan} color="primary" />}
              {dosen.prodi && <Chip label={dosen.prodi} variant="outlined" color="primary" />}
              {dosen.status && <Chip label={dosen.status} variant="outlined" />}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" },
            gap: 3,
          }}
        >
          {statistik.map((stat) => (
            <Card
              key={stat.label}
              elevation={0}
              sx={{ bgcolor: stat.color, color: "white", borderRadius: 2 }}
            >
              <CardContent>
                <Box
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <stat.icon sx={{ fontSize: 50, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{ overflow: "hidden", borderRadius: 2, border: "1px solid", borderColor: "divider" }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, value) => setTabValue(value)}
          variant="scrollable"
          sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}
        >
          {tabItems.map((item) => (
            <Tab key={item.label} label={item.label} />
          ))}
        </Tabs>

        {tabItems[tabValue]?.content}
      </Paper>
    </Box>
  );
}
