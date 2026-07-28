"use client";

import { useMemo } from "react";
import { Chip } from "@mui/material";
import { CrudTabSection } from "@/components/kurikulum/CrudTabSection";
import type { DataTableColumn } from "@/components/common/DataTable";
import {
  createCplAction,
  deleteCplAction,
  updateCplAction,
} from "@/lib/actions/kurikulum-detail.actions";
import { suggestNextKode } from "@/lib/utils/kode-generator";
import { KATEGORI_CAPAIAN, type Cpl } from "@/types/kurikulum-detail";

interface CPLProdiTabProps {
  kurikulumId: string;
  cplList: Cpl[];
  canManage: boolean;
}

/** Tab CPL Prodi untuk satu kurikulum, terhubung ke database. */
export default function CPLProdiTab({
  kurikulumId,
  cplList,
  canManage,
}: CPLProdiTabProps) {
  const columns: DataTableColumn<Cpl>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => cplList.indexOf(row) + 1,
    },
    { key: "kode", label: "Kode CPL" },
    { key: "deskripsi", label: "Deskripsi CPL" },
    {
      key: "kategori",
      label: "Kategori",
      align: "center",
      render: (row) => <Chip label={row.kategori} size="small" variant="outlined" />,
    },
  ];

  // Saran kode berikutnya, mis. sudah ada CPL01-CPL10 -> saran "CPL11".
  const kodeBerikutnya = useMemo(
    () => suggestNextKode(cplList.map((row) => row.kode), "CPL"),
    [cplList]
  );

  return (
    <CrudTabSection
      title="Capaian Pembelajaran Lulusan"
      description="Rumusan kemampuan yang wajib dicapai lulusan, mencakup aspek sikap, pengetahuan, keterampilan umum, dan keterampilan khusus."
      addLabel="Tambah CPL"
      rows={cplList}
      columns={columns}
      getRowKey={(row) => row.id}
      emptyMessage="Belum ada CPL. Tambahkan CPL untuk memulai."
      canManage={canManage}
      entityLabel="CPL"
      getRowLabel={(row) => `CPL ${row.kode}`}
      badges={[`${cplList.length} CPL`]}
      onDelete={(row) => deleteCplAction(kurikulumId, row.id)}
      fields={[
        { name: "kode", label: "Kode CPL", required: true, span: "half", placeholder: "CPL01" },
        {
          name: "kategori",
          label: "Kategori",
          options: KATEGORI_CAPAIAN,
          required: true,
          span: "half",
        },
        { name: "deskripsi", label: "Deskripsi CPL", type: "multiline", required: true },
      ]}
      emptyValues={{ kode: kodeBerikutnya, kategori: "S", deskripsi: "" }}
      toFormValues={(row) => ({
        kode: row.kode,
        kategori: row.kategori,
        deskripsi: row.deskripsi,
      })}
      onCreate={(values) => createCplAction(kurikulumId, values)}
      onUpdate={(row, values) => updateCplAction(kurikulumId, row.id, values)}
    />
  );
}
