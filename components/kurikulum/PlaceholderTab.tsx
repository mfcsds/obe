import { Box, Alert, AlertTitle } from "@mui/material";
import { TabHeader } from "@/components/kurikulum/TabHeader";

interface PlaceholderTabProps {
  title: string;
  description: string;
  /** Prasyarat yang perlu diisi lebih dulu, ditampilkan sebagai daftar. */
  prasyarat?: string[];
}

/**
 * Tab yang fiturnya belum tersedia. Menampilkan header yang konsisten dengan
 * tab lain plus keterangan jelas bahwa fitur belum aktif, sehingga tidak ada
 * lagi data contoh yang menyesatkan.
 */
export function PlaceholderTab({ title, description, prasyarat }: PlaceholderTabProps) {
  return (
    <Box>
      <TabHeader title={title} description={description} badges={["Belum tersedia"]} />

      <Alert severity="info">
        <AlertTitle>Fitur sedang disiapkan</AlertTitle>
        Tab ini belum dapat digunakan. Data akan tersedia setelah tahap
        pengembangan berikutnya selesai.
        {prasyarat && prasyarat.length > 0 && (
          <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2.5 }}>
            {prasyarat.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </Box>
        )}
      </Alert>
    </Box>
  );
}
