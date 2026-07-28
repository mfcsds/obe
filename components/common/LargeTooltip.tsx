"use client";

import { Tooltip, type TooltipProps } from "@mui/material";

/**
 * Tooltip dengan ukuran font yang lebih besar dari default MUI (~11px).
 * Dipakai untuk menampilkan deskripsi lengkap entitas kurikulum (CPL, Profil
 * Lulusan, Bahan Kajian, Mata Kuliah) yang teksnya cukup panjang, sehingga
 * tetap nyaman dibaca alih-alih terasa seperti label kecil biasa.
 *
 * Dibuat sebagai komponen bersama agar seluruh tab pemetaan kurikulum
 * memakai satu ukuran tooltip yang konsisten (steering clean-code: DRY).
 */
export function LargeTooltip(props: TooltipProps) {
  return (
    <Tooltip
      {...props}
      slotProps={{
        ...props.slotProps,
        tooltip: {
          ...props.slotProps?.tooltip,
          sx: {
            fontSize: "0.8125rem", // ~13px
            lineHeight: 1.5,
            maxWidth: 360,
            p: 1.25,
            ...(props.slotProps?.tooltip as { sx?: object })?.sx,
          },
        },
      }}
    />
  );
}
