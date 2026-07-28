"use client";

import { useMemo } from "react";
import { Typography } from "@mui/material";
import { CrudTabSection } from "@/components/kurikulum/CrudTabSection";
import type { DataTableColumn } from "@/components/common/DataTable";
import {
  createProfilLulusanAction,
  deleteProfilLulusanAction,
  updateProfilLulusanAction,
} from "@/lib/actions/kurikulum-detail.actions";
import { suggestNextKode } from "@/lib/utils/kode-generator";
import type { ProfilLulusan } from "@/types/kurikulum-detail";

interface ProfilLulusanTabProps {
  kurikulumId: string;
  profilLulusanList: ProfilLulusan[];
  canManage: boolean;
}

/**
 * Tab Profil Lulusan (PL) untuk satu kurikulum, terhubung ke database.
 *
 * Tidak ada kolom kategori di sini: ranah S/P/KU/KK adalah pembagian untuk
 * CPL, bukan untuk profil lulusan.
 */
export default function ProfilLulusanTab({
  kurikulumId,
  profilLulusanList,
  canManage,
}: ProfilLulusanTabProps) {
  const columns: DataTableColumn<ProfilLulusan>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => profilLulusanList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode PL" },
    { key: "deskripsi", label: "Profil Lulusan (PL)" },
    {
      key: "profesi",
      label: "Profesi",
      render: (row) =>
        row.profesi ? (
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {row.profesi}
          </Typography>
        ) : (
          "-"
        ),
    },
  ];

  // Saran kode berikutnya, mis. sudah ada PL01-PL03 -> saran "PL04". Nilai
  // ini hanya nilai awal; pengguna tetap bisa mengubahnya secara manual.
  const kodeBerikutnya = useMemo(
    () => suggestNextKode(profilLulusanList.map((row) => row.kode), "PL"),
    [profilLulusanList]
  );

  return (
    <CrudTabSection
      title="Profil Lulusan"
      description="Rumusan peran dan kualifikasi yang dapat diemban lulusan setelah menyelesaikan program studi."
      addLabel="Tambah Profil Lulusan"
      rows={profilLulusanList}
      columns={columns}
      getRowKey={(row) => row.id}
      emptyMessage="Belum ada profil lulusan. Tambahkan profil untuk memulai."
      canManage={canManage}
      entityLabel="profil lulusan"
      getRowLabel={(row) => `Profil lulusan ${row.kode}`}
      badges={[`${profilLulusanList.length} profil`]}
      onDelete={(row) => deleteProfilLulusanAction(kurikulumId, row.id)}
      fields={[
        { name: "kode", label: "Kode PL", required: true, span: "half", placeholder: "PL01" },
        {
          name: "deskripsi",
          label: "Deskripsi Profil Lulusan",
          type: "multiline",
          required: true,
        },
        {
          name: "profesi",
          label: "Profesi",
          type: "multiline",
          helperText: "Opsional. Tulis satu profesi per baris.",
        },
      ]}
      emptyValues={{ kode: kodeBerikutnya, deskripsi: "", profesi: "" }}
      toFormValues={(row) => ({
        kode: row.kode,
        deskripsi: row.deskripsi,
        profesi: row.profesi ?? "",
      })}
      onCreate={(values) => createProfilLulusanAction(kurikulumId, values)}
      onUpdate={(row, values) => updateProfilLulusanAction(kurikulumId, row.id, values)}
    />
  );
}
