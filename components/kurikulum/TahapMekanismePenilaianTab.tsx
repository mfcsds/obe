"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Box,
  Divider,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  Stack,
} from "@mui/material";
import { Save, RestartAlt } from "@mui/icons-material";
import { toast } from "sonner";
import { CrudTabSection } from "@/components/kurikulum/CrudTabSection";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import type { DataTableColumn } from "@/components/common/DataTable";
import { LargeTooltip } from "@/components/common/LargeTooltip";
import {
  createInstrumenPenilaianAction,
  createKriteriaPenilaianAction,
  deleteInstrumenPenilaianAction,
  deleteKriteriaPenilaianAction,
  updateInstrumenPenilaianAction,
  updateKriteriaPenilaianAction,
} from "@/lib/actions/kurikulum-master.actions";
import {
  createRencanaPenilaianAction,
  deleteRencanaPenilaianAction,
  updateRencanaPenilaianAction,
} from "@/lib/actions/rencana-penilaian.actions";
import { suggestNextKode } from "@/lib/utils/kode-generator";
import {
  TAHAPAN_PENILAIAN,
  fromCompositeId,
  fromPemetaanKey,
  type Cpl,
  type Cpmk,
  type InstrumenPenilaian,
  type KriteriaPenilaian,
  type MataKuliah,
  type RencanaPenilaian,
  type TeknikPenilaian,
} from "@/types/kurikulum-detail";

interface TahapMekanismePenilaianTabProps {
  kurikulumId: string;
  mataKuliahList: MataKuliah[];
  cplList: Cpl[];
  cpmkList: Cpmk[];
  teknikPenilaianList: TeknikPenilaian[];
  instrumenPenilaianList: InstrumenPenilaian[];
  kriteriaPenilaianList: KriteriaPenilaian[];
  rencanaPenilaianList: RencanaPenilaian[];
  /** Kunci pemetaan (MataKuliah+CPMK)→Teknik Penilaian yang aktif (tab "Teknik Penilaian CPMK"). */
  cpmkTeknikPenilaianKeys: string[];
  canManage: boolean;
}

/** Satu kombinasi (Mata Kuliah, CPL, CPMK, Teknik Penilaian) yang sudah ditetapkan di tab-tab sebelumnya. */
interface KombinasiPenilaian {
  /** ID komposit `${mataKuliahId}__${cpmkId}__${teknikPenilaianId}`. */
  id: string;
  mataKuliah: MataKuliah;
  cpl: Cpl | undefined;
  cpmk: Cpmk;
  teknikPenilaian: TeknikPenilaian;
}

const KOMBINASI_SEPARATOR = "__";

function toKombinasiId(mataKuliahId: string, cpmkId: string, teknikPenilaianId: string): string {
  return [mataKuliahId, cpmkId, teknikPenilaianId].join(KOMBINASI_SEPARATOR);
}

/**
 * Tab "Tahap dan Mekanisme Penilaian".
 *
 * Terdiri dari tiga bagian:
 * 1. CRUD kategori Instrumen Penilaian (mis. Rubrik, Soal Tes, Observasi,
 *    Dokumen Proyek Akhir) — dapat ditambah sendiri oleh kaprodi.
 * 2. CRUD kategori Kriteria Penilaian (mis. Sesuai Rubrik, Ketepatan
 *    Menjawab Soal) — dapat ditambah sendiri oleh kaprodi.
 * 3. Tabel Rencana Penilaian: BARISNYA TIDAK DITAMBAH MANUAL, melainkan
 *    diturunkan otomatis dari data yang sudah ditetapkan pada tab-tab
 *    sebelumnya — Rincian CPMK (CPL & CPMK), Pemetaan CPMK dan Mata Kuliah
 *    (mata kuliah pendukung setiap CPMK), dan Teknik Penilaian CPMK (teknik
 *    yang dipakai tiap kombinasi). Kaprodi hanya perlu melengkapi Tahapan,
 *    Instrumen, Kriteria, dan Bobot untuk setiap baris, lalu menyimpannya
 *    satu per satu.
 */
export default function TahapMekanismePenilaianTab({
  kurikulumId,
  mataKuliahList,
  cplList,
  cpmkList,
  teknikPenilaianList,
  instrumenPenilaianList,
  kriteriaPenilaianList,
  rencanaPenilaianList,
  cpmkTeknikPenilaianKeys,
  canManage,
}: TahapMekanismePenilaianTabProps) {
  /**
   * Daftar kombinasi (Mata Kuliah, CPL, CPMK, Teknik Penilaian) yang sudah
   * ditetapkan pada tab-tab sebelumnya. Setiap kombinasi menjadi SATU baris
   * tetap pada tabel Rencana Penilaian — tidak ada baris yang ditambah
   * manual, karena datanya sudah lengkap dari CPMK + Pemetaan CPMK-Mata
   * Kuliah + Teknik Penilaian CPMK.
   */
  const kombinasiList = useMemo<KombinasiPenilaian[]>(() => {
    const result: KombinasiPenilaian[] = [];

    for (const key of cpmkTeknikPenilaianKeys) {
      const [compositeId, teknikPenilaianId] = fromPemetaanKey(key);
      const [mataKuliahId, cpmkId] = fromCompositeId(compositeId);

      const mataKuliah = mataKuliahList.find((mk) => mk.id === mataKuliahId);
      const cpmk = cpmkList.find((item) => item.id === cpmkId);
      const teknikPenilaian = teknikPenilaianList.find((item) => item.id === teknikPenilaianId);
      if (!mataKuliah || !cpmk || !teknikPenilaian) continue;

      const cpl = cplList.find((item) => item.id === cpmk.cplId);

      result.push({
        id: toKombinasiId(mataKuliahId, cpmkId, teknikPenilaianId),
        mataKuliah,
        cpl,
        cpmk,
        teknikPenilaian,
      });
    }

    return result;
  }, [cpmkTeknikPenilaianKeys, mataKuliahList, cpmkList, teknikPenilaianList, cplList]);

  /** Rencana penilaian yang sudah tersimpan, dikunci oleh ID kombinasinya. */
  const rencanaByKombinasiId = useMemo(() => {
    const map = new Map<string, RencanaPenilaian>();
    for (const rencana of rencanaPenilaianList) {
      map.set(
        toKombinasiId(rencana.mataKuliahId, rencana.cpmkId, rencana.teknikPenilaianId),
        rencana
      );
    }
    return map;
  }, [rencanaPenilaianList]);

  // ---------------------------------------------------------------------
  // Bagian 1: Kategori Instrumen Penilaian
  // ---------------------------------------------------------------------
  const instrumenColumns: DataTableColumn<InstrumenPenilaian>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => instrumenPenilaianList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Nama Instrumen" },
  ];

  const kodeInstrumenBerikutnya = useMemo(
    () => suggestNextKode(instrumenPenilaianList.map((row) => row.kode), "IP"),
    [instrumenPenilaianList]
  );

  // ---------------------------------------------------------------------
  // Bagian 2: Kategori Kriteria Penilaian
  // ---------------------------------------------------------------------
  const kriteriaColumns: DataTableColumn<KriteriaPenilaian>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => kriteriaPenilaianList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode" },
    { key: "nama", label: "Nama Kriteria" },
  ];

  const kodeKriteriaBerikutnya = useMemo(
    () => suggestNextKode(kriteriaPenilaianList.map((row) => row.kode), "KP"),
    [kriteriaPenilaianList]
  );

  // ---------------------------------------------------------------------
  // Bagian 3: Rencana Penilaian
  // ---------------------------------------------------------------------
  const totalBobotPerMataKuliah = useMemo(() => {
    const map = new Map<string, number>();
    for (const rencana of rencanaPenilaianList) {
      map.set(rencana.mataKuliahId, (map.get(rencana.mataKuliahId) ?? 0) + rencana.bobot);
    }
    return map;
  }, [rencanaPenilaianList]);

  const mataKuliahBermasalah = mataKuliahList.filter((mk) => {
    const total = totalBobotPerMataKuliah.get(mk.id);
    return total !== undefined && total !== 100;
  });

  return (
    <Box>
      {/* Dua kategori referensi ditampilkan berdampingan (bukan bertumpuk)
          agar lebih hemat ruang vertikal — keduanya sama-sama daftar
          singkat, jadi wajar disandingkan seperti kolom kembar. */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        <CrudTabSection
          title="Kategori Instrumen Penilaian"
          description="Mis. Rubrik, Soal Tes, Observasi, Tugas, atau Dokumen Proyek Akhir."
          addLabel="Tambah Instrumen"
          rows={instrumenPenilaianList}
          columns={instrumenColumns}
          getRowKey={(row) => row.id}
          emptyMessage="Belum ada instrumen penilaian. Tambahkan untuk memulai."
          canManage={canManage}
          entityLabel="instrumen penilaian"
          getRowLabel={(row) => `Instrumen ${row.nama}`}
          badges={[`${instrumenPenilaianList.length} instrumen`]}
          onDelete={(row) => deleteInstrumenPenilaianAction(kurikulumId, row.id)}
          fields={[
            { name: "kode", label: "Kode", required: true, span: "half", placeholder: "IP01" },
            { name: "nama", label: "Nama Instrumen", required: true, span: "half" },
          ]}
          emptyValues={{ kode: kodeInstrumenBerikutnya, nama: "" }}
          toFormValues={(row) => ({ kode: row.kode, nama: row.nama })}
          onCreate={(values) => createInstrumenPenilaianAction(kurikulumId, values)}
          onUpdate={(row, values) => updateInstrumenPenilaianAction(kurikulumId, row.id, values)}
          dense
          maxHeight={220}
        />

        <CrudTabSection
          title="Kategori Kriteria Penilaian"
          description="Mis. Sesuai Rubrik, Ketepatan Menjawab Soal, atau Kedisiplinan."
          addLabel="Tambah Kriteria"
          rows={kriteriaPenilaianList}
          columns={kriteriaColumns}
          getRowKey={(row) => row.id}
          emptyMessage="Belum ada kriteria penilaian. Tambahkan untuk memulai."
          canManage={canManage}
          entityLabel="kriteria penilaian"
          getRowLabel={(row) => `Kriteria ${row.nama}`}
          badges={[`${kriteriaPenilaianList.length} kriteria`]}
          onDelete={(row) => deleteKriteriaPenilaianAction(kurikulumId, row.id)}
          fields={[
            { name: "kode", label: "Kode", required: true, span: "half", placeholder: "KP01" },
            { name: "nama", label: "Nama Kriteria", required: true, span: "half" },
          ]}
          emptyValues={{ kode: kodeKriteriaBerikutnya, nama: "" }}
          toFormValues={(row) => ({ kode: row.kode, nama: row.nama })}
          onCreate={(values) => createKriteriaPenilaianAction(kurikulumId, values)}
          onUpdate={(row, values) => updateKriteriaPenilaianAction(kurikulumId, row.id, values)}
          dense
          maxHeight={220}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <TabHeader
        title="Tahap dan Mekanisme Penilaian"
        description="Baris di bawah ini diturunkan otomatis dari Rincian CPMK, Pemetaan CPMK dan Mata Kuliah, serta Teknik Penilaian CPMK yang sudah ditetapkan. Lengkapi Tahapan, Instrumen, Kriteria, dan Bobot untuk setiap baris, lalu simpan."
        badges={
          mataKuliahBermasalah.length > 0
            ? [`${mataKuliahBermasalah.length} mata kuliah bobotnya belum 100%`]
            : [`${kombinasiList.length} baris rencana penilaian`]
        }
      />

      {kombinasiList.length === 0 ? (
        <Alert severity="info">
          Belum ada kombinasi Mata Kuliah, CPMK, dan Teknik Penilaian. Lengkapi
          dulu tab Rincian CPMK, Pemetaan CPMK dan Mata Kuliah, serta Teknik
          Penilaian CPMK sebelum mengisi tahap dan mekanisme penilaian.
        </Alert>
      ) : (
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <TableContainer sx={{ maxHeight: "65vh" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {[
                    "No",
                    "Mata Kuliah",
                    "CPL",
                    "CPMK",
                    "Teknik Penilaian",
                    "Tahapan Penilaian",
                    "Instrumen Penilaian",
                    "Kriteria",
                    "Bobot (%)",
                    "Aksi",
                  ].map((label) => (
                    <TableCell
                      key={label}
                      align={label === "No" || label === "Bobot (%)" || label === "Aksi" ? "center" : "left"}
                      sx={{ bgcolor: "primary.main", color: "primary.contrastText", fontWeight: "bold" }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {kombinasiList.map((kombinasi, index) => (
                  <RencanaPenilaianRow
                    key={kombinasi.id}
                    index={index}
                    kombinasi={kombinasi}
                    kurikulumId={kurikulumId}
                    savedRencana={rencanaByKombinasiId.get(kombinasi.id)}
                    instrumenPenilaianList={instrumenPenilaianList}
                    kriteriaPenilaianList={kriteriaPenilaianList}
                    canManage={canManage}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {mataKuliahBermasalah.length > 0 && canManage && (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1.5, display: "block" }}>
          Total bobot penilaian pada mata kuliah berikut belum 100%:{" "}
          {mataKuliahBermasalah.map((mk) => mk.kode).join(", ")}.
        </Typography>
      )}
    </Box>
  );
}

interface RencanaPenilaianRowProps {
  index: number;
  kombinasi: KombinasiPenilaian;
  kurikulumId: string;
  savedRencana: RencanaPenilaian | undefined;
  instrumenPenilaianList: InstrumenPenilaian[];
  kriteriaPenilaianList: KriteriaPenilaian[];
  canManage: boolean;
}

/**
 * Satu baris tabel Rencana Penilaian, mewakili satu kombinasi
 * (Mata Kuliah, CPL, CPMK, Teknik Penilaian) yang sudah tetap (tidak bisa
 * ditambah/dihapus dari sini). Field Tahapan/Instrumen/Kriteria/Bobot bisa
 * diedit inline lalu disimpan lewat tombol "Simpan" pada baris itu sendiri,
 * tanpa dialog terpisah — mengurangi jumlah klik untuk mengisi banyak baris.
 *
 * State lokal disinkronkan ulang dari `savedRencana` (data server) setiap
 * kali data itu berubah, bukan dari seluruh daftar sekaligus, sehingga
 * menyimpan satu baris tidak menghapus perubahan yang belum disimpan pada
 * baris lain.
 */
function RencanaPenilaianRow({
  index,
  kombinasi,
  kurikulumId,
  savedRencana,
  instrumenPenilaianList,
  kriteriaPenilaianList,
  canManage,
}: RencanaPenilaianRowProps) {
  const [tahapan, setTahapan] = useState(savedRencana?.tahapan ?? "");
  const [instrumenPenilaianId, setInstrumenPenilaianId] = useState(
    savedRencana?.instrumenPenilaianId ?? ""
  );
  const [kriteriaPenilaianId, setKriteriaPenilaianId] = useState(
    savedRencana?.kriteriaPenilaianId ?? ""
  );
  const [bobot, setBobot] = useState(savedRencana ? String(savedRencana.bobot) : "");
  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  // Resinkronisasi hanya bila DATA baris ini sendiri berubah (bukan
  // referensi array/objek), agar penyimpanan baris lain tidak menimpa
  // input yang belum disimpan pada baris ini.
  useEffect(() => {
    setTahapan(savedRencana?.tahapan ?? "");
    setInstrumenPenilaianId(savedRencana?.instrumenPenilaianId ?? "");
    setKriteriaPenilaianId(savedRencana?.kriteriaPenilaianId ?? "");
    setBobot(savedRencana ? String(savedRencana.bobot) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    savedRencana?.id,
    savedRencana?.tahapan,
    savedRencana?.instrumenPenilaianId,
    savedRencana?.kriteriaPenilaianId,
    savedRencana?.bobot,
  ]);

  const handleSave = () => {
    if (!tahapan || !instrumenPenilaianId || !kriteriaPenilaianId || bobot === "") {
      toast.error("Lengkapi Tahapan, Instrumen, Kriteria, dan Bobot sebelum menyimpan.");
      return;
    }

    const values = {
      mataKuliahId: kombinasi.mataKuliah.id,
      cpmkId: kombinasi.cpmk.id,
      teknikPenilaianId: kombinasi.teknikPenilaian.id,
      tahapan,
      instrumenPenilaianId,
      kriteriaPenilaianId,
      bobot: Number(bobot),
    };

    startSaveTransition(async () => {
      const result = savedRencana
        ? await updateRencanaPenilaianAction(kurikulumId, savedRencana.id, values)
        : await createRencanaPenilaianAction(kurikulumId, values);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Rencana penilaian disimpan.");
      }
    });
  };

  const handleReset = () => {
    if (!savedRencana) return;

    startDeleteTransition(async () => {
      const result = await deleteRencanaPenilaianAction(kurikulumId, savedRencana.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Rencana penilaian dikosongkan kembali.");
      }
    });
  };

  const isBusy = isSaving || isDeleting;

  return (
    <TableRow hover>
      <TableCell align="center">{index + 1}</TableCell>
      <TableCell sx={{ minWidth: 180 }}>
        <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
          {kombinasi.mataKuliah.kode}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
          {kombinasi.mataKuliah.nama}
        </Typography>
      </TableCell>
      <TableCell align="center">
        {kombinasi.cpl ? (
          <LargeTooltip title={kombinasi.cpl.deskripsi}>
            <Chip label={kombinasi.cpl.kode} size="small" variant="outlined" />
          </LargeTooltip>
        ) : (
          "-"
        )}
      </TableCell>
      <TableCell sx={{ minWidth: 200 }}>
        <LargeTooltip title={kombinasi.cpmk.deskripsi}>
          <Box>
            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.3 }}>
              {kombinasi.cpmk.kode}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                lineHeight: 1.3,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {kombinasi.cpmk.deskripsi}
            </Typography>
          </Box>
        </LargeTooltip>
      </TableCell>
      <TableCell sx={{ minWidth: 140 }}>{kombinasi.teknikPenilaian.nama}</TableCell>
      <TableCell sx={{ minWidth: 170 }}>
        <TextField
          select
          size="small"
          fullWidth
          value={tahapan}
          disabled={!canManage || isBusy}
          onChange={(e) => setTahapan(e.target.value)}
        >
          {TAHAPAN_PENILAIAN.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      <TableCell sx={{ minWidth: 170 }}>
        <TextField
          select
          size="small"
          fullWidth
          value={instrumenPenilaianId}
          disabled={!canManage || isBusy}
          onChange={(e) => setInstrumenPenilaianId(e.target.value)}
        >
          <MenuItem value="">
            <em>Belum dipilih</em>
          </MenuItem>
          {instrumenPenilaianList.map((instrumen) => (
            <MenuItem key={instrumen.id} value={instrumen.id}>
              {instrumen.nama}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      <TableCell sx={{ minWidth: 170 }}>
        <TextField
          select
          size="small"
          fullWidth
          value={kriteriaPenilaianId}
          disabled={!canManage || isBusy}
          onChange={(e) => setKriteriaPenilaianId(e.target.value)}
        >
          <MenuItem value="">
            <em>Belum dipilih</em>
          </MenuItem>
          {kriteriaPenilaianList.map((kriteria) => (
            <MenuItem key={kriteria.id} value={kriteria.id}>
              {kriteria.nama}
            </MenuItem>
          ))}
        </TextField>
      </TableCell>
      <TableCell sx={{ minWidth: 100 }}>
        <TextField
          type="number"
          size="small"
          fullWidth
          value={bobot}
          disabled={!canManage || isBusy}
          onChange={(e) => setBobot(e.target.value)}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
        />
      </TableCell>
      <TableCell align="center">
        {canManage && (
          <Stack direction="row" spacing={0.25} justifyContent="center">
            <LargeTooltip title="Simpan baris ini">
              <IconButton size="small" color="primary" onClick={handleSave} disabled={isBusy}>
                <Save fontSize="small" />
              </IconButton>
            </LargeTooltip>
            {savedRencana && (
              <LargeTooltip title="Kosongkan kembali baris ini">
                <IconButton size="small" color="error" onClick={handleReset} disabled={isBusy}>
                  <RestartAlt fontSize="small" />
                </IconButton>
              </LargeTooltip>
            )}
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
