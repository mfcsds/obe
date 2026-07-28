"use client";

import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

/** Sifat sebuah tahap: input manual, pemetaan, atau hasil otomatis. */
export type StepVariant = "input" | "pemetaan" | "otomatis" | "belum";

export interface StepNavItem {
  /** Nomor urut yang ditampilkan ke pengguna. */
  nomor: number;
  label: string;
  variant: StepVariant;
}

export interface StepNavGroup {
  title: string;
  items: StepNavItem[];
}

interface KurikulumStepNavProps {
  groups: StepNavGroup[];
  /** Index tab aktif pada daftar datar (flat). */
  activeIndex: number;
  onSelect: (index: number) => void;
}

/** Label singkat penanda sifat tiap tahap. */
const VARIANT_CHIP: Record<StepVariant, { label: string; color: "default" | "info" | "success" } | null> =
  {
    input: null,
    pemetaan: null,
    otomatis: { label: "Otomatis", color: "success" },
    belum: { label: "Segera", color: "default" },
  };

/**
 * Navigasi tahapan penyusunan kurikulum. Memakai `List` alih-alih `Tabs`
 * karena butuh subheader per kelompok dan divider antar tahap — hal yang
 * tidak bisa dilakukan `Tabs` tanpa mengacaukan indeks tab.
 *
 * Urutan item mengikuti alur data penyusunan kurikulum, sehingga pengguna
 * mengisi data induk lebih dulu sebelum tahap pemetaan yang bergantung padanya.
 */
export function KurikulumStepNav({ groups, activeIndex, onSelect }: KurikulumStepNavProps) {
  // Penomoran datar dipakai untuk memetakan item ke index konten.
  let flatIndex = -1;

  return (
    <Box
      sx={{
        width: 300,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.default",
        overflowY: "auto",
        maxHeight: "calc(100vh - 220px)",
      }}
    >
      {groups.map((group, groupIndex) => (
        <Box key={group.title}>
          {groupIndex > 0 && <Divider />}

          <Typography
            variant="overline"
            sx={{
              display: "block",
              px: 2,
              pt: 2,
              pb: 0.5,
              color: "text.secondary",
              fontWeight: 700,
              letterSpacing: "0.08em",
              lineHeight: 1.6,
            }}
          >
            {group.title}
          </Typography>

          <List disablePadding sx={{ pb: 1 }}>
            {group.items.map((item) => {
              flatIndex += 1;
              const index = flatIndex;
              const isActive = index === activeIndex;
              const chip = VARIANT_CHIP[item.variant];

              return (
                <ListItemButton
                  key={item.label}
                  selected={isActive}
                  onClick={() => onSelect(index)}
                  sx={{
                    py: 1,
                    pl: 2,
                    pr: 1.5,
                    borderLeft: "3px solid",
                    borderLeftColor: isActive ? "primary.main" : "transparent",
                    "&.Mui-selected": {
                      bgcolor: "action.selected",
                      "&:hover": { bgcolor: "action.selected" },
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="flex-start"
                    sx={{ width: "100%" }}
                  >
                    <Box
                      sx={{
                        mt: 0.125,
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        bgcolor: isActive ? "primary.main" : "action.hover",
                        color: isActive ? "primary.contrastText" : "text.secondary",
                      }}
                    >
                      {item.nomor}
                    </Box>

                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8125rem",
                            lineHeight: 1.45,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? "primary.main" : "text.primary",
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                      secondary={
                        chip ? (
                          <Chip
                            label={chip.label}
                            size="small"
                            color={chip.color}
                            variant="outlined"
                            sx={{ mt: 0.5, height: 18, fontSize: "0.625rem" }}
                          />
                        ) : undefined
                      }
                    />
                  </Stack>
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
}
