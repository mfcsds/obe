'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f59e0b',
    },
    secondary: {
      main: '#78350f',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
});
