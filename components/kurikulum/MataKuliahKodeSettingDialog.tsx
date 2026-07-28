"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import { toast } from "sonner";
import { saveMkKodeSettingAction } from "@/lib/actions/mk-kode-setting.actions";
import { buildNextJenisMataKuliahKode } from "@/lib/utils/kode-generator";
import type { MataKuliah, MataKuliahKodeSetting } from "@/types/kurikulum-detail";

interface MataKuliahKodeSettingDialogProps {
  open: boolean;
  onClose: () => void;
  kurikulumId: string;
  settingList: MataKuliahKodeSetting[];
  mataKuliahList: MataKuliah[];
}

/**
 * Dialog untuk mengatur format kode otomatis (awalan, akhiran, lebar digit
 * urutan) per jenis mata kuliah pada satu kurikulum.
 *
 * Perubahan di sini hanya memengaruhi SARAN kode untuk mata kuliah yang
 * ditambahkan setelahnya; kode mata kuliah yang sudah tersimpan tidak
 * berubah, sehingga aman diubah kapan saja tanpa merusak data lama.
 */
export function MataKuliahKodeSettingDialog({
  open,
  onClose,
  kurikulumId,
  settingList,
  mataKuliahList,
}: MataKuliahKodeSettingDialogProps) {
  const [drafts, setDrafts] = useState<MataKuliahKodeSetting[]>(settingList);
  const [isSubmitting, startTransition] = useTransition();

  useEffect(() => {
    if (open) setDrafts(settingList);
  }, [open, settingList]);

  const handleFieldChange = (
    jenis: string,
    field: "prefix" | "suffix" | "sequenceWidth",
    value: string
  ) => {
    setDrafts((prev) =>
      prev.map((item) =>
        item.jenis === jenis
          ? {
              ...item,
              [field]: field === "sequenceWidth" ? Number(value) || 1 : value,
            }
          : item
      )
    );
  };

  const handleSubmit = () => {
    startTransition(async () => {
      for (const draft of drafts) {
        const result = await saveMkKodeSettingAction(kurikulumId, {
          jenis: draft.jenis,
          prefix: draft.prefix,
          suffix: draft.suffix,
          sequenceWidth: draft.sequenceWidth,
        });

        if (result.error) {
          toast.error(`${draft.jenis}: ${result.error}`);
          return;
        }
      }

      toast.success("Setting kode mata kuliah berhasil disimpan.");
      onClose();
    });
  };

  const contohKode = (setting: MataKuliahKodeSetting) => {
    const jumlahSejenis = mataKuliahList.filter((mk) => mk.jenis === setting.jenis).length;
    const kodeDummy = Array.from({ length: jumlahSejenis }, (_, i) => String(i));
    return buildNextJenisMataKuliahKode(kodeDummy, setting);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">Setting Kode Mata Kuliah</DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>
          Format ini hanya menjadi saran kode untuk mata kuliah baru. Kode
          mata kuliah yang sudah tersimpan tidak akan berubah.
        </Alert>

        {drafts.map((setting, index) => (
          <Box key={setting.jenis} sx={{ mb: index < drafts.length - 1 ? 3 : 0 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
              {setting.jenis}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 1.5,
              }}
            >
              <TextField
                label="Awalan"
                size="small"
                value={setting.prefix}
                placeholder="KK140"
                onChange={(e) => handleFieldChange(setting.jenis, "prefix", e.target.value)}
              />
              <TextField
                label="Lebar digit urutan"
                size="small"
                type="number"
                value={setting.sequenceWidth}
                slotProps={{ htmlInput: { min: 1, max: 6 } }}
                onChange={(e) =>
                  handleFieldChange(setting.jenis, "sequenceWidth", e.target.value)
                }
              />
              <TextField
                label="Akhiran"
                size="small"
                value={setting.suffix}
                placeholder="26"
                onChange={(e) => handleFieldChange(setting.jenis, "suffix", e.target.value)}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block" }}>
              Contoh kode berikutnya: <strong>{contohKode(setting)}</strong>
            </Typography>
            {index < drafts.length - 1 && <Divider sx={{ mt: 2.5 }} />}
          </Box>
        ))}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Batal
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Setting"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
