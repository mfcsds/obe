"use client";

import { useMemo } from "react";
import { Typography } from "@mui/material";
import { CrudTabSection } from "@/components/kurikulum/CrudTabSection";
import type { DataTableColumn } from "@/components/common/DataTable";
import {
  createBahanKajianAction,
  deleteBahanKajianAction,
  updateBahanKajianAction,
} from "@/lib/actions/kurikulum-master.actions";
import { suggestNextKode } from "@/lib/utils/kode-generator";
import type { BahanKajian } from "@/types/kurikulum-detail";

interface BahanKajianTabProps {
  kurikulumId: string;
  bahanKajianList: BahanKajian[];
  canManage: boolean;
}

/** Tab Bahan Kajian (BK) untuk satu kurikulum, terhubung ke database. */
export default function BahanKajianTab({
  kurikulumId,
  bahanKajianList,
  canManage,
}: BahanKajianTabProps) {
  const columns: DataTableColumn<BahanKajian>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => bahanKajianList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode BK" },
    { key: "nama", label: "Nama Bahan Kajian" },
    {
      key: "deskripsi",
      label: "Deskripsi",
      render: (row) =>
        row.deskripsi ? (
          <Typography variant="body2" color="text.secondary">
            {row.deskripsi}
          </Typography>
        ) : (
          "-"
        ),
    },
  ];

  // Saran kode berikutnya, mis. sudah ada BK01-BK05 -> saran "BK06".
  const kodeBerikutnya = useMemo(
    () => suggestNextKode(bahanKajianList.map((row) => row.kode), "BK"),
    [bahanKajianList]
  );

  return (
    <CrudTabSection
      title="Bahan Kajian"
      description="Cakupan keilmuan program studi yang menjadi dasar penetapan materi dan pembentukan mata kuliah."
      addLabel="Tambah Bahan Kajian"
      rows={bahanKajianList}
      columns={columns}
      getRowKey={(row) => row.id}
      emptyMessage="Belum ada bahan kajian. Tambahkan bahan kajian untuk memulai."
      canManage={canManage}
      entityLabel="bahan kajian"
      getRowLabel={(row) => `Bahan kajian ${row.kode}`}
      onDelete={(row) => deleteBahanKajianAction(kurikulumId, row.id)}
      badges={[`${bahanKajianList.length} bahan kajian`]}
      fields={[
        { name: "kode", label: "Kode BK", required: true, span: "half", placeholder: "BK01" },
        { name: "nama", label: "Nama Bahan Kajian", required: true, span: "half" },
        { name: "deskripsi", label: "Deskripsi", type: "multiline" },
      ]}
      emptyValues={{ kode: kodeBerikutnya, nama: "", deskripsi: "" }}
      toFormValues={(row) => ({
        kode: row.kode,
        nama: row.nama,
        deskripsi: row.deskripsi ?? "",
      })}
      onCreate={(values) => createBahanKajianAction(kurikulumId, values)}
      onUpdate={(row, values) => updateBahanKajianAction(kurikulumId, row.id, values)}
    />
  );
}
