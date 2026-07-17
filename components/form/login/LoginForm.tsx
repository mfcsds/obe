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
import { signInWithEmail } from "@/lib/appwrite/auth-actions";

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Login berhasil");
      router.push(ROUTES.HOME);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 420 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Selamat Datang Kembali
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Masuk untuk mengakses dashboard kurikulum OBE Anda.
        </Typography>
      </Box>

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
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
          autoComplete="current-password"
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
        >
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: "center" }}>
        Belum punya akun?{" "}
        <MuiLink component={Link} href={ROUTES.SIGN_UP} underline="hover" fontWeight={600}>
          Daftar sekarang
        </MuiLink>
      </Typography>
    </Box>
  );
};
export default LoginForm;
