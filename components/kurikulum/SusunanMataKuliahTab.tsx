"use client";

import { useMemo, useState } from "react";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { CrudTabSection } from "@/components/kurikulum/CrudTabSection";
import { MataKuliahKodeSettingDialog } from "@/components/kurikulum/MataKuliahKodeSettingDialog";
import type { DataTableColumn } from "@/components/common/DataTable";
import {
  createMataKuliahAction,
  deleteMataKuliahAction,
  updateMataKuliahAction,
} from "@/lib/actions/kurikulum-master.actions";
import { suggestMataKuliahKodeAction } from "@/lib/actions/mk-kode-setting.actions";
import { suggestNextKode } from "@/lib/utils/kode-generator";
import {
  JENIS_MATA_KULIAH,
  type MataKuliah,
  type MataKuliahKodeSetting,
} from "@/types/kurikulum-detail";

interface SusunanMataKuliahTabProps {
  kurikulumId: string;
  mataKuliahList: MataKuliah[];
  kodeSettingList: MataKuliahKodeSetting[];
  canManage: boolean;
}

/**
 * Tab Susunan Mata Kuliah untuk satu kurikulum, terhubung ke database.
 *
 * Kode mata kuliah disarankan otomatis berdasarkan setting format per jenis
 * (lihat `MataKuliahKodeSettingDialog`): begitu jenis dipilih di form tambah,
 * kode disusun sebagai `${awalan}${urutan}${akhiran}`. Bila belum ada jenis
 * yang dipilih, saran kode jatuh ke pola generik (lihat `suggestNextKode`).
 */
export default function SusunanMataKuliahTab({
  kurikulumId,
  mataKuliahList,
  kodeSettingList,
  canManage,
}: SusunanMataKuliahTabProps) {
  const [settingOpen, setSettingOpen] = useState(false);
  const totalSks = mataKuliahList.reduce((total, mk) => total + mk.sks, 0);

  const columns: DataTableColumn<MataKuliah>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => mataKuliahList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode MK" },
    { key: "nama", label: "Nama Mata Kuliah" },
    { key: "sks", label: "SKS", align: "center" },
    {
      key: "semester",
      label: "Semester",
      align: "center",
      render: (row) => <Chip label={row.semester} size="small" variant="outlined" />,
    },
    {
      key: "jenis",
      label: "Jenis",
      render: (row) => row.jenis ?? "-",
    },
  ];

  // Saran awal saat dialog dibuka tanpa jenis terpilih (mode tambah baru).
  const kodeBerikutnyaGenerik = useMemo(
    () => suggestNextKode(mataKuliahList.map((row) => row.kode), "MK"),
    [mataKuliahList]
  );

  return (
    <>
      <CrudTabSection
        title="Susunan Mata Kuliah"
        description="Daftar mata kuliah pembentuk kurikulum beserta bobot satuan kredit semester dan semester penyelenggaraannya."
        addLabel="Tambah Mata Kuliah"
        rows={mataKuliahList}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyMessage="Belum ada mata kuliah. Tambahkan mata kuliah untuk memulai."
        canManage={canManage}
        entityLabel="mata kuliah"
        getRowLabel={(row) => `Mata kuliah ${row.kode}`}
        badges={[`${mataKuliahList.length} mata kuliah`, `${totalSks} SKS`]}
        onDelete={(row) => deleteMataKuliahAction(kurikulumId, row.id)}
        headerExtra={
          canManage ? (
            <Tooltip title="Atur format kode otomatis per jenis mata kuliah">
              <IconButton onClick={() => setSettingOpen(true)} aria-label="Setting kode mata kuliah">
                <Settings fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : undefined
        }
        fields={[
          { name: "kode", label: "Kode MK", required: true, span: "half", placeholder: "TIF101" },
          { name: "sks", label: "SKS", type: "number", required: true, span: "half" },
          { name: "nama", label: "Nama Mata Kuliah", required: true },
          { name: "semester", label: "Semester", type: "number", required: true, span: "half" },
          { name: "jenis", label: "Jenis", options: JENIS_MATA_KULIAH, span: "half" },
        ]}
        emptyValues={{
          kode: kodeBerikutnyaGenerik,
          sks: 3,
          nama: "",
          semester: 1,
          jenis: "",
        }}
        toFormValues={(row) => ({
          kode: row.kode,
          sks: row.sks,
          nama: row.nama,
          semester: row.semester,
          jenis: row.jenis ?? "",
        })}
        onCreate={(values) => createMataKuliahAction(kurikulumId, values)}
        onUpdate={(row, values) => updateMataKuliahAction(kurikulumId, row.id, values)}
        onFieldChange={async (name, value, _values, { isEditMode }) => {
          // Saran kode otomatis hanya berlaku saat menambah data baru, agar
          // kode mata kuliah yang sedang diedit tidak berubah tanpa disadari.
          if (name !== "jenis" || isEditMode) return;

          const result = await suggestMataKuliahKodeAction(kurikulumId, String(value));
          if ("kode" in result) {
            return { kode: result.kode };
          }
        }}
      />

      <MataKuliahKodeSettingDialog
        open={settingOpen}
        onClose={() => setSettingOpen(false)}
        kurikulumId={kurikulumId}
        settingList={kodeSettingList}
        mataKuliahList={mataKuliahList}
      />
    </>
  );
}
