"use client";

import { useState, type ReactNode } from "react";
import { Paper, Typography, Box, Button, Chip, Stack } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import ProfilLulusanTab from "@/components/kurikulum/ProfilLulusanTab";
import CPLProdiTab from "@/components/kurikulum/CPLProdiTab";
import BahanKajianTab from "@/components/kurikulum/BahanKajianTab";
import SusunanMataKuliahTab from "@/components/kurikulum/SusunanMataKuliahTab";
import OrganisasiMataKuliahTab from "@/components/kurikulum/OrganisasiMataKuliahTab";
import PetaPemenuhanCPLTab from "@/components/kurikulum/PetaPemenuhanCPLTab";
import PemetaanCPLBKMKTab from "@/components/kurikulum/PemetaanCPLBKMKTab";
import CpmkTab from "@/components/kurikulum/CpmkTab";
import TeknikPenilaianTab from "@/components/kurikulum/TeknikPenilaianTab";
import TahapMekanismePenilaianTab from "@/components/kurikulum/TahapMekanismePenilaianTab";
import { MatrixMappingTab } from "@/components/kurikulum/MatrixMappingTab";
import { PlaceholderTab } from "@/components/kurikulum/PlaceholderTab";
import {
  KurikulumStepNav,
  type StepNavGroup,
  type StepVariant,
} from "@/components/kurikulum/KurikulumStepNav";
import { JENIS_PEMETAAN, toPemetaanKey } from "@/types/kurikulum-detail";
import type { Kurikulum } from "@/types/kurikulum";
import type {
  BahanKajian,
  Cpl,
  Cpmk,
  InstrumenPenilaian,
  KriteriaPenilaian,
  MataKuliah,
  MataKuliahKodeSetting,
  ProfilLulusan,
  RencanaPenilaian,
  TeknikPenilaian,
} from "@/types/kurikulum-detail";

/** Seluruh data pemetaan yang sudah aktif, per jenis matriks. */
export interface PemetaanData {
  profilCpl: string[];
  cplBk: string[];
  bkMk: string[];
  mkCpl: string[];
  cpmkMk: string[];
  cpmkTeknikPenilaian: string[];
}

interface KurikulumDetailViewProps {
  kurikulum: Kurikulum;
  profilLulusanList: ProfilLulusan[];
  cplList: Cpl[];
  bahanKajianList: BahanKajian[];
  mataKuliahList: MataKuliah[];
  cpmkList: Cpmk[];
  teknikPenilaianList: TeknikPenilaian[];
  instrumenPenilaianList: InstrumenPenilaian[];
  kriteriaPenilaianList: KriteriaPenilaian[];
  rencanaPenilaianList: RencanaPenilaian[];
  kodeSettingList: MataKuliahKodeSetting[];
  pemetaan: PemetaanData;
  /** Apakah user boleh mengubah isi kurikulum (hanya kaprodi). */
  canManage: boolean;
}

/** Satu tahap penyusunan kurikulum beserta kontennya. */
interface StepDefinition {
  label: string;
  variant: StepVariant;
  content: ReactNode;
}

/**
 * Tampilan detail penyusunan satu kurikulum.
 *
 * Urutan tahap disusun mengikuti ALUR DATA: seluruh data induk (profil
 * lulusan, CPL, bahan kajian, mata kuliah) diisi lebih dulu, baru tahap
 * pemetaan yang bergantung padanya, lalu rekapitulasi otomatis. Karena itu
 * Susunan Mata Kuliah berada sebelum pemetaan Bahan Kajian–Mata Kuliah.
 */
export function KurikulumDetailView({
  kurikulum,
  profilLulusanList,
  cplList,
  bahanKajianList,
  mataKuliahList,
  cpmkList,
  teknikPenilaianList,
  instrumenPenilaianList,
  kriteriaPenilaianList,
  rencanaPenilaianList,
  kodeSettingList,
  pemetaan,
  canManage,
}: KurikulumDetailViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  /** Mengubah daftar entitas menjadi baris/kolom matriks. */
  const asMatrixEntities = <T extends { id: string; kode: string }>(
    items: T[],
    getKeterangan: (item: T) => string
  ) => items.map((item) => ({ id: item.id, kode: item.kode, keterangan: getKeterangan(item) }));

  const cplEntities = asMatrixEntities(cplList, (cpl) => cpl.deskripsi);
  const profilEntities = asMatrixEntities(profilLulusanList, (pl) => pl.deskripsi);
  const bkEntities = asMatrixEntities(bahanKajianList, (bk) => bk.nama);
  const mkEntities = asMatrixEntities(mataKuliahList, (mk) => `${mk.nama} (${mk.sks} SKS)`);
  const cpmkEntities = asMatrixEntities(cpmkList, (cpmk) => cpmk.deskripsi);

  /**
   * Tahap dikelompokkan per fase penyusunan. Struktur bersarang ini sekaligus
   * menjadi sumber penomoran dan konten, jadi tidak ada risiko nomor navigasi
   * tidak sinkron dengan tab yang tampil.
   */
  const groupedSteps: Array<{ title: string; steps: StepDefinition[] }> = [
    {
      title: "Tahap 1 · Perumusan Capaian",
      steps: [
        {
          label: "Profil Lulusan",
          variant: "input",
          content: (
            <ProfilLulusanTab
              kurikulumId={kurikulum.id}
              profilLulusanList={profilLulusanList}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Capaian Pembelajaran Lulusan",
          variant: "input",
          content: (
            <CPLProdiTab
              kurikulumId={kurikulum.id}
              cplList={cplList}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Pemetaan Profil Lulusan dan CPL",
          variant: "pemetaan",
          content: (
            <MatrixMappingTab
              key={JENIS_PEMETAAN.profilCpl}
              kurikulumId={kurikulum.id}
              jenis={JENIS_PEMETAAN.profilCpl}
              title="Pemetaan Profil Lulusan dan Capaian Pembelajaran Lulusan"
              description="Tentukan capaian pembelajaran lulusan yang mendukung terwujudnya setiap profil lulusan."
              rows={cplEntities}
              columns={profilEntities}
              rowHeaderLabel="Kode CPL"
              columnGroupLabel="Profil Lulusan (PL)"
              prerequisiteMessage="Lengkapi data Profil Lulusan dan Capaian Pembelajaran Lulusan terlebih dahulu sebelum melakukan pemetaan."
              activeKeys={pemetaan.profilCpl}
              canManage={canManage}
            />
          ),
        },
      ],
    },
    {
      title: "Tahap 2 · Bahan Kajian dan Mata Kuliah",
      steps: [
        {
          label: "Bahan Kajian",
          variant: "input",
          content: (
            <BahanKajianTab
              kurikulumId={kurikulum.id}
              bahanKajianList={bahanKajianList}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Susunan Mata Kuliah",
          variant: "input",
          content: (
            <SusunanMataKuliahTab
              kurikulumId={kurikulum.id}
              mataKuliahList={mataKuliahList}
              kodeSettingList={kodeSettingList}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Pemetaan CPL dan Bahan Kajian",
          variant: "pemetaan",
          content: (
            <MatrixMappingTab
              key={JENIS_PEMETAAN.cplBk}
              kurikulumId={kurikulum.id}
              jenis={JENIS_PEMETAAN.cplBk}
              title="Pemetaan Capaian Pembelajaran Lulusan dan Bahan Kajian"
              description="Tentukan bahan kajian yang diperlukan untuk mencapai setiap capaian pembelajaran lulusan."
              rows={bkEntities}
              columns={cplEntities}
              rowHeaderLabel="Bahan Kajian"
              columnGroupLabel="Capaian Pembelajaran Lulusan (CPL)"
              keyOrder="columnFirst"
              rowLabelMode="teks"
              prerequisiteMessage="Lengkapi data Capaian Pembelajaran Lulusan dan Bahan Kajian terlebih dahulu sebelum melakukan pemetaan."
              activeKeys={pemetaan.cplBk}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Pemetaan Bahan Kajian dan Mata Kuliah",
          variant: "pemetaan",
          content: (
            <MatrixMappingTab
              key={JENIS_PEMETAAN.bkMk}
              kurikulumId={kurikulum.id}
              jenis={JENIS_PEMETAAN.bkMk}
              title="Pemetaan Bahan Kajian dan Mata Kuliah"
              description="Tentukan mata kuliah yang memuat setiap bahan kajian dalam struktur kurikulum."
              rows={bkEntities}
              columns={mkEntities}
              rowHeaderLabel="Bahan Kajian"
              columnGroupLabel="Mata Kuliah (MK)"
              rowLabelMode="teks"
              columnLabelMode="kodeDenganNama"
              prerequisiteMessage="Lengkapi data Bahan Kajian dan Susunan Mata Kuliah terlebih dahulu sebelum melakukan pemetaan."
              activeKeys={pemetaan.bkMk}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Pembebanan CPL pada Mata Kuliah",
          variant: "pemetaan",
          content: (
            <MatrixMappingTab
              key={JENIS_PEMETAAN.mkCpl}
              kurikulumId={kurikulum.id}
              jenis={JENIS_PEMETAAN.mkCpl}
              title="Pembebanan Capaian Pembelajaran Lulusan pada Mata Kuliah"
              description="Tentukan capaian pembelajaran lulusan yang dibebankan pada setiap mata kuliah."
              rows={mkEntities}
              columns={cplEntities}
              rowHeaderLabel="Mata Kuliah"
              columnGroupLabel="Capaian Pembelajaran Lulusan (CPL)"
              rowLabelMode="kodeDenganNama"
              prerequisiteMessage="Lengkapi data Susunan Mata Kuliah dan Capaian Pembelajaran Lulusan terlebih dahulu sebelum melakukan pemetaan."
              activeKeys={pemetaan.mkCpl}
              canManage={canManage}
            />
          ),
        },
      ],
    },
    {
      title: "Tahap 3 · Rekapitulasi Struktur",
      steps: [
        {
          label: "Keterkaitan CPL, Bahan Kajian, dan Mata Kuliah",
          variant: "otomatis",
          content: (
            <PemetaanCPLBKMKTab
              cplList={cplList}
              bahanKajianList={bahanKajianList}
              mataKuliahList={mataKuliahList}
              bkMkKeys={pemetaan.bkMk}
              mkCplKeys={pemetaan.mkCpl}
            />
          ),
        },
        {
          label: "Organisasi Mata Kuliah per Semester",
          variant: "otomatis",
          content: <OrganisasiMataKuliahTab mataKuliahList={mataKuliahList} />,
        },
        {
          label: "Peta Pemenuhan CPL",
          variant: "otomatis",
          content: (
            <PetaPemenuhanCPLTab
              cplList={cplList}
              mataKuliahList={mataKuliahList}
              mkCplKeys={pemetaan.mkCpl}
            />
          ),
        },
      ],
    },
    {
      title: "Tahap 4 · CPMK dan Penilaian",
      steps: [
        {
          label: "Rincian CPMK",
          variant: "input",
          content: (
            <CpmkTab
              kurikulumId={kurikulum.id}
              cplList={cplList}
              cpmkList={cpmkList}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Pemetaan CPMK dan Mata Kuliah",
          variant: "pemetaan",
          content: (
            <MatrixMappingTab
              key={JENIS_PEMETAAN.cpmkMk}
              kurikulumId={kurikulum.id}
              jenis={JENIS_PEMETAAN.cpmkMk}
              title="Pemetaan Capaian Pembelajaran Mata Kuliah dan Mata Kuliah"
              description="Tentukan mata kuliah yang mendukung pencapaian setiap Capaian Pembelajaran Mata Kuliah (CPMK). Karena setiap CPMK sudah diturunkan dari satu CPL tertentu (lihat tab Rincian CPMK), matriks ini sekaligus merangkai keterkaitan CPL → CPMK → Mata Kuliah secara berjenjang. Satu mata kuliah hanya dapat dicentang pada CPMK yang CPL induknya sudah dibebankan ke mata kuliah itu (lihat tab Pembebanan CPL pada Mata Kuliah), agar pemetaan tetap konsisten."
              rows={cpmkEntities}
              columns={mkEntities}
              rowHeaderLabel="CPMK"
              columnGroupLabel="Mata Kuliah (MK)"
              rowLabelMode="kodeDenganNama"
              columnLabelMode="kodeDenganNama"
              prerequisiteMessage="Lengkapi data Rincian CPMK dan Susunan Mata Kuliah terlebih dahulu sebelum melakukan pemetaan."
              activeKeys={pemetaan.cpmkMk}
              canManage={canManage}
              isCellAllowed={(cpmkEntity, mkEntity) => {
                const cpmk = cpmkList.find((item) => item.id === cpmkEntity.id);
                if (!cpmk) return false;
                return pemetaan.mkCpl.includes(toPemetaanKey(mkEntity.id, cpmk.cplId));
              }}
              disabledReason="CPL induk dari CPMK ini belum dibebankan ke mata kuliah tersebut. Lengkapi dulu di tab Pembebanan CPL pada Mata Kuliah."
            />
          ),
        },
        {
          label: "Teknik Penilaian CPMK",
          variant: "pemetaan",
          content: (
            <TeknikPenilaianTab
              kurikulumId={kurikulum.id}
              cpmkList={cpmkList}
              mataKuliahList={mataKuliahList}
              teknikPenilaianList={teknikPenilaianList}
              cpmkMkKeys={pemetaan.cpmkMk}
              cpmkTeknikPenilaianKeys={pemetaan.cpmkTeknikPenilaian}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Tahap dan Mekanisme Penilaian",
          variant: "input",
          content: (
            <TahapMekanismePenilaianTab
              kurikulumId={kurikulum.id}
              mataKuliahList={mataKuliahList}
              cplList={cplList}
              cpmkList={cpmkList}
              teknikPenilaianList={teknikPenilaianList}
              instrumenPenilaianList={instrumenPenilaianList}
              kriteriaPenilaianList={kriteriaPenilaianList}
              rencanaPenilaianList={rencanaPenilaianList}
              cpmkTeknikPenilaianKeys={pemetaan.cpmkTeknikPenilaian}
              canManage={canManage}
            />
          ),
        },
        {
          label: "Bobot Penilaian Mata Kuliah",
          variant: "belum",
          content: (
            <PlaceholderTab
              title="Bobot Penilaian Mata Kuliah"
              description="Distribusi bobot penilaian pada setiap komponen dan capaian pembelajaran mata kuliah."
              prasyarat={["Rincian CPMK perlu dilengkapi terlebih dahulu."]}
            />
          ),
        },
      ],
    },
    {
      title: "Tahap 5 · Dokumen Akhir",
      steps: [
        {
          label: "Rumusan Akhir Mata Kuliah",
          variant: "belum",
          content: (
            <PlaceholderTab
              title="Rumusan Akhir Mata Kuliah"
              description="Dokumen rumusan akhir setiap mata kuliah sebagai dasar penyusunan Rencana Pembelajaran Semester."
            />
          ),
        },
        {
          label: "Rumusan Akhir CPL",
          variant: "belum",
          content: (
            <PlaceholderTab
              title="Rumusan Akhir Capaian Pembelajaran Lulusan"
              description="Dokumen rumusan akhir capaian pembelajaran lulusan beserta bukti pemenuhannya melalui mata kuliah."
            />
          ),
        },
      ],
    },
  ];

  // Daftar datar untuk menentukan konten yang tampil, dan nomor urut global.
  const flatSteps = groupedSteps.flatMap((group) => group.steps);

  let nomorBerjalan = 0;
  const navGroups: StepNavGroup[] = groupedSteps.map((group) => ({
    title: group.title,
    items: group.steps.map((step) => {
      nomorBerjalan += 1;
      return { nomor: nomorBerjalan, label: step.label, variant: step.variant };
    }),
  }));

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              component={Link}
              href="/kurikulum"
              startIcon={<ArrowBack />}
              variant="outlined"
            >
              Kembali
            </Button>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {kurikulum.nama}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tahun Akademik {kurikulum.tahunAkademik}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`${mataKuliahList.length} Mata Kuliah`} size="small" variant="outlined" />
            <Chip label={`${kurikulum.totalSKS} SKS`} size="small" variant="outlined" />
            <Chip label={`${cplList.length} CPL`} size="small" variant="outlined" />
            <Chip
              label={kurikulum.status}
              size="small"
              color={kurikulum.status === "Aktif" ? "success" : "default"}
              variant={kurikulum.status === "Aktif" ? "filled" : "outlined"}
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          display: "flex",
          width: "100%",
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <KurikulumStepNav
          groups={navGroups}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />

        <Box sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>{flatSteps[activeIndex]?.content}</Box>
      </Paper>
    </Box>
  );
}
