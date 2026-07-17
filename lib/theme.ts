'use client';
import { createTheme } from '@mui/material/styles';

/**
 * Theme MUI terpusat untuk seluruh aplikasi. Ini adalah single source of
 * truth untuk warna, tipografi, radius, dan style default komponen supaya
 * tampilan konsisten di semua halaman (lihat juga steering
 * `.kiro/steering/design-system.md` untuk panduan pemakaian di level UI).
 *
 * Palet warna brand:
 * - primary (amber)  -> aksi utama, highlight, branding OBE-Teknik Informatika
 * - secondary (brown) -> aksen, teks penekanan pada elemen gelap
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#b45309',
      contrastText: '#1c1917',
    },
    secondary: {
      main: '#78350f',
      light: '#92400e',
      dark: '#451a03',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafaf9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
