import { Box, Typography, Chip, Stack, Divider } from "@mui/material";
import type { ReactNode } from "react";

interface TabHeaderProps {
  title: string;
  description: string;
  /** Info ringkas di kanan judul, mis. jumlah data. */
  badges?: string[];
  /** Tombol aksi di sisi kanan. */
  action?: ReactNode;
}

/**
 * Header seragam untuk setiap tab pemetaan kurikulum: judul, deskripsi,
 * badge ringkasan, dan slot aksi. Dipakai semua tab agar tipografi dan
 * spacing konsisten (steering design-system.md).
 */
export function TabHeader({ title, description, badges, action }: TabHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, maxWidth: 760 }}
          >
            {description}
          </Typography>
        </Box>
        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      {badges && badges.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
          {badges.map((badge) => (
            <Chip key={badge} label={badge} size="small" variant="outlined" />
          ))}
        </Stack>
      )}

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}
