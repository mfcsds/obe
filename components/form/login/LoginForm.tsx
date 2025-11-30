"use client";

import React from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import ROUTES from "@/constant/routes";

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleCredentialsLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful");
        window.location.href = ROUTES.HOME;
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME, redirect: true });
    } catch (error) {
      console.error(error);
      toast.error("Error sign in with google");
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Card elevation={8} sx={{ p: 3, m: 2 }}>
        <Box sx={{ mt: 5, mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Outcome Based Application
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This Application will help you to design sophisticated Outcome Based Education Curriculum for colloge
          </Typography>
        </Box>
        <CardContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={(e) => { e.preventDefault(); handleCredentialsLogin(); }}>
            <TextField
              label="Email"
              type="email"
              placeholder="youremail@company.com"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 3, borderRadius: 3, py: 1.5 }}
            >
              <Typography variant="h6" fontWeight="bold">
                {loading ? "Logging in..." : "Login"}
              </Typography>
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              startIcon={<GoogleIcon />}
              onClick={() => handleSignIn("google")}
              sx={{ mt: 2, mb: 5, borderRadius: 3, py: 1.5 }}
            >
              Login with Google Account
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default LoginForm;
