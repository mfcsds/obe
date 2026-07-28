"use client";

import { useState, useTransition } from "react";
import {
  Box,
  Alert,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { toast } from "sonner";
import { TabHeader } from "@/components/kurikulum/TabHeader";
import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { LargeTooltip } from "@/components/common/LargeTooltip";
import { GenericFormDialog } from "@/components/common/GenericFormDialog";
import {
  createCpmkAction,
  deleteCpmkAction,
  suggestNextCpmkKodeAction,
  updateCpmkAction,
} from "@/lib/actions/kurikulum-detail.actions";
import type { Cpl, Cpmk } from "@/types/kurikulum-detail";

interface CpmkTabProps {
  kurikulumId: string;
  cplList: Cpl[];
  cpmkList: Cpmk[];
  canManage: boolean;
}

/** Satu baris matriks: satu CPL beserta seluruh CPMK turunannya. */
interface BarisCpl {
  cpl: Cpl;
  cpmkList: Cpmk[];
}

/**
 * State dialog form tambah/ubah CPMK. Dipisah dari state tabel karena
 * konteksnya (CPL induk mana yang sedang diisi) tidak selalu sama dengan
 * baris yang sedang disorot di tabel.
 */
type DialogState =
  | { mode: "create"; cpl: Cpl; suggestedKode: string }
  | { mode: "edit"; cpl: Cpl; cpmk: Cpmk };

/**
 * Tab Rincian CPMK: setiap Capaian Pembelajaran Mata Kuliah (CPMK) merupakan
 * turunan langsung dari satu Capaian Pembelajaran Lulusan (CPL). Ditampilkan
 * sebagai tabel dengan baris = CPL dan kolom "CPMK" berisi seluruh CPMK yang
 * sudah diturunkan dari CPL tersebut.
 *
 * Kode CPMK mengikuti kode CPL induknya (mis. CPL01 -> CPMK011, CPMK012),
 * disarankan otomatis lewat `suggestNextCpmkKodeAction` setiap kali kaprodi
 * menambah CPMK baru untuk satu CPL, tapi tetap bisa diubah manual.
 */
export default function CpmkTab({
  kurikulumId,
  cplList,
  cpmkList,
  canManage,
}: CpmkTabProps) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Cpmk | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isPreparingDialog, startPrepareTransition] = useTransition();

  const rows: BarisCpl[] = cplList.map((cpl) => ({
    cpl,
    cpmkList: cpmkList.filter((cpmk) => cpmk.cplId === cpl.id),
  }));

  const handleOpenCreate = (cpl: Cpl) => {
    startPrepareTransition(async () => {
      const suggestedKode = await suggestNextCpmkKodeAction(kurikulumId, cpl.id, cpl.kode);
      setDialog({ mode: "create", cpl, suggestedKode });
    });
  };

  const handleOpenEdit = (cpl: Cpl, cpmk: Cpmk) => {
    setDialog({ mode: "edit", cpl, cpmk });
  };

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    const kode = pendingDelete.kode;

    startDeleteTransition(async () => {
      const result = await deleteCpmkAction(kurikulumId, pendingDelete.id);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`CPMK ${kode} berhasil dihapus.`);
      }
      setPendingDelete(null);
    });
  };

  const columns: DataTableColumn<BarisCpl>[] = [
    {
      key: "no",
      label: "No",
      align: "center",
      render: (row) => rows.indexOf(row) + 1,
    },
    {
      key: "cpl",
      label: "Capaian Pembelajaran Lulusan (CPL)",
      minWidth: 260,
      maxWidth: 260,
      render: (row) => (
        <LargeTooltip title={row.cpl.deskripsi}>
          <Box>
            <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.4 }}>
              {row.cpl.kode}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                lineHeight: 1.4,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {row.cpl.deskripsi}
            </Typography>
          </Box>
        </LargeTooltip>
      ),
    },
    {
      key: "cpmk",
      label: "CPMK Turunan",
      minWidth: 420,
      render: (row) =>
        row.cpmkList.length === 0 ? (
          <Typography variant="body2" color="text.disabled" sx={{ py: 0.75 }}>
            Belum ada CPMK untuk CPL ini.
          </Typography>
        ) : (
          <Stack spacing={1} sx={{ py: 0.75 }}>
            {row.cpmkList.map((cpmk) => (
              <Box
                key={cpmk.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  bgcolor: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              >
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontWeight: 700, fontSize: "0.75rem", lineHeight: 1.4 }}
                  >
                    {cpmk.kode}
                  </Typography>
                  <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", lineHeight: 1.4, mt: 0.25, whiteSpace: "normal" }}
                  >
                    {cpmk.deskripsi}
                  </Typography>
                </Box>
                {canManage && (
                  <Stack direction="row" spacing={0.25} flexShrink={0}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(row.cpl, cpmk)}
                      aria-label={`Ubah CPMK ${cpmk.kode}`}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => setPendingDelete(cpmk)}
                      aria-label={`Hapus CPMK ${cpmk.kode}`}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
        ),
    },
  ];

  if (canManage) {
    columns.push({
      key: "aksi",
      label: "Aksi",
      align: "center",
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          startIcon={<Add />}
          disabled={isPreparingDialog}
          onClick={() => handleOpenCreate(row.cpl)}
        >
          Tambah CPMK
        </Button>
      ),
    });
  }

  return (
    <Box>
      <TabHeader
        title="Rincian Capaian Pembelajaran Mata Kuliah (CPMK)"
        description="Rumusan CPMK yang diturunkan dari setiap Capaian Pembelajaran Lulusan. Kode CPMK mengikuti kode CPL induknya, mis. CPL01 diturunkan menjadi CPMK011, CPMK012, dan seterusnya."
        badges={[`${cplList.length} CPL`, `${cpmkList.length} CPMK`]}
      />

      {cplList.length === 0 ? (
        <Alert severity="info">
          Lengkapi data Capaian Pembelajaran Lulusan (CPL) terlebih dahulu
          sebelum menambahkan CPMK.
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.cpl.id}
          withPaper
          maxHeight="65vh"
          emptyMessage="Belum ada data CPL."
        />
      )}

      {dialog && (
        <GenericFormDialog<Cpmk>
          open
          onClose={() => setDialog(null)}
          createTitle={`Tambah CPMK untuk ${dialog.cpl.kode}`}
          editTitle={`Ubah CPMK ${dialog.mode === "edit" ? dialog.cpmk.kode : ""}`}
          fields={[
            { name: "kode", label: "Kode CPMK", required: true, span: "half", placeholder: "CPMK011" },
            { name: "deskripsi", label: "Deskripsi CPMK", type: "multiline", required: true },
          ]}
          editing={dialog.mode === "edit" ? dialog.cpmk : null}
          emptyValues={{
            kode: dialog.mode === "create" ? dialog.suggestedKode : "",
            deskripsi: "",
          }}
          toFormValues={(row) => ({ kode: row.kode, deskripsi: row.deskripsi })}
          onSubmit={(values) =>
            dialog.mode === "create"
              ? createCpmkAction(kurikulumId, dialog.cpl.id, values)
              : updateCpmkAction(kurikulumId, dialog.cpmk.id, values)
          }
          successMessage={{
            create: "CPMK berhasil ditambahkan.",
            update: "CPMK berhasil diperbarui.",
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Hapus CPMK?"
        description={
          pendingDelete
            ? `CPMK ${pendingDelete.kode} akan dihapus permanen beserta seluruh pemetaan yang terkait. Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel="Hapus"
        loading={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
