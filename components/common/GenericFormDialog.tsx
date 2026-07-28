"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import { toast } from "sonner";

/** Nilai yang bisa dipegang satu field form. */
export type FieldValue = string | number;

/** Satu opsi dropdown dengan nilai tersimpan (ID) berbeda dari label tampilan. */
export interface FormFieldOption {
  value: string;
  label: string;
}

/** Definisi satu field pada form generik. */
export interface FormFieldConfig {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "multiline";
  /**
   * Bila diisi, field dirender sebagai dropdown dengan nilai tersimpan sama
   * dengan label tampilan (cocok untuk enum sederhana, mis. jenis mata
   * kuliah). Untuk dropdown yang perlu menyimpan ID tapi menampilkan nama
   * (mis. memilih Mata Kuliah), gunakan `optionItems` sebagai gantinya.
   */
  options?: readonly string[];
  /**
   * Bila diisi, field dirender sebagai dropdown dengan nilai tersimpan
   * (`value`, biasanya ID) berbeda dari label yang ditampilkan ke pengguna
   * (`label`, biasanya nama/kode entitas). Diperiksa lebih dulu daripada
   * `options` bila keduanya diisi.
   */
  optionItems?: FormFieldOption[];
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  /** Lebar kolom pada grid 2 kolom; default "half". */
  span?: "half" | "full";
}

interface FieldChangeContext {
  /** `true` bila dialog sedang dalam mode ubah data, bukan tambah baru. */
  isEditMode: boolean;
}

interface GenericFormDialogProps<T> {
  open: boolean;
  onClose: () => void;
  /** Judul saat menambah data baru. */
  createTitle: string;
  /** Judul saat mengubah data. */
  editTitle: string;
  fields: FormFieldConfig[];
  /** Data yang sedang diedit; `null` berarti mode tambah. */
  editing: T | null;
  /** Nilai awal untuk mode tambah. */
  emptyValues: Record<string, FieldValue>;
  /** Mengubah data yang diedit menjadi nilai form. */
  toFormValues: (item: T) => Record<string, FieldValue>;
  onSubmit: (values: Record<string, FieldValue>) => Promise<{ error: string | null }>;
  successMessage: { create: string; update: string };
  /**
   * Dipanggil setiap kali satu field berubah. Bisa mengembalikan sebagian
   * nilai lain untuk ikut diperbarui (mis. menyarankan kode mata kuliah
   * berikutnya saat field "jenis" dipilih). Kembalikan `undefined`/`void`
   * bila tidak ada penyesuaian.
   */
  onFieldChange?: (
    name: string,
    value: FieldValue,
    values: Record<string, FieldValue>,
    context: FieldChangeContext
  ) => Promise<Record<string, FieldValue> | void> | Record<string, FieldValue> | void;
}

/**
 * Dialog form generik berbasis konfigurasi field. Dipakai untuk entitas
 * sederhana yang formnya hanya berisi input teks/angka/dropdown, sehingga
 * tidak perlu membuat komponen dialog terpisah untuk setiap entitas
 * (steering clean-code: DRY).
 *
 * Validasi tetap dilakukan di server action; dialog ini hanya menampilkan
 * pesan errornya.
 */
export function GenericFormDialog<T>({
  open,
  onClose,
  createTitle,
  editTitle,
  fields,
  editing,
  emptyValues,
  toFormValues,
  onSubmit,
  successMessage,
  onFieldChange,
}: GenericFormDialogProps<T>) {
  const [values, setValues] = useState<Record<string, FieldValue>>(emptyValues);
  const [isSubmitting, startTransition] = useTransition();
  const isEditMode = Boolean(editing);

  useEffect(() => {
    if (!open) return;
    setValues(editing ? toFormValues(editing) : emptyValues);
    // `toFormValues`/`emptyValues` stabil per pemanggil, tidak perlu jadi dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const handleChange = async (name: string, value: FieldValue) => {
    const updated = { ...values, [name]: value };
    setValues(updated);

    const extra = await onFieldChange?.(name, value, updated, { isEditMode });
    if (extra) {
      setValues((prev) => ({ ...prev, ...extra }));
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await onSubmit(values);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditMode ? successMessage.update : successMessage.create);
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle fontWeight="bold">{isEditMode ? editTitle : createTitle}</DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2.5,
            pt: 1,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {fields.map((field, index) => {
            const isFullWidth = field.span !== "half";
            const isDropdown = Boolean(field.optionItems ?? field.options);

            return (
              <Box
                key={field.name}
                sx={{ gridColumn: isFullWidth ? "1 / -1" : undefined }}
              >
                <TextField
                  select={isDropdown}
                  label={field.label}
                  fullWidth
                  required={field.required}
                  autoFocus={index === 0}
                  type={
                    field.type === "number"
                      ? "number"
                      : field.type === "date"
                        ? "date"
                        : "text"
                  }
                  multiline={field.type === "multiline"}
                  rows={field.type === "multiline" ? 4 : undefined}
                  placeholder={field.placeholder}
                  helperText={field.helperText}
                  value={values[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  slotProps={
                    field.type === "date"
                      ? { inputLabel: { shrink: true } }
                      : undefined
                  }
                >
                  {isDropdown && (
                    <MenuItem value="">
                      <em>Belum diisi</em>
                    </MenuItem>
                  )}
                  {field.optionItems
                    ? field.optionItems.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))
                    : field.options?.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                </TextField>
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Batal
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
