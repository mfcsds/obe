"use client";

import React from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Link as MuiLink,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ROUTES from "@/constant/routes";
import { signUpWithEmail } from "@/lib/appwrite/auth-actions";

const RegistrationForm = () => {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Registrasi mandiri selalu jadi role "mahasiswa" (default di server
      // action). Akun kaprodi/dosen dinaikkan rolenya lewat Appwrite Console.
      const result = await signUpWithEmail(name, email, password);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Registrasi berhasil! Selamat datang.");
      router.push(ROUTES.HOME);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 440 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Buat Akun Baru
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Daftar untuk mulai mengelola kurikulum OBE program studi Anda.
        </Typography>
      </Box>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <TextField
          label="Nama Lengkap"
          type="text"
          placeholder="John Doe"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <TextField
          label="Email"
          type="email"
          placeholder="nama@kampus.ac.id"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          helperText="Minimal 8 karakter"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          sx={{ mt: 1 }}
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        Sudah punya akun?{" "}
        <MuiLink component={Link} href={ROUTES.SIGN_IN} underline="hover" fontWeight={600}>
          Masuk di sini
        </MuiLink>
      </Typography>
    </Box>
  );
};
export default RegistrationForm;
