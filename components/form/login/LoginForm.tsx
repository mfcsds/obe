"use client";

import React from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import ROUTES from "@/constant/routes";

const LoginForm = () => {
  const handleSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl: ROUTES.HOME, redirect: true });
    } catch (error) {
      console.error(error);
      toast("Error sign in with google");
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              placeholder="youremail@company.com"
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
            />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              sx={{ mt: 3, borderRadius: 3, py: 1.5 }}
            >
              <Typography variant="h6" fontWeight="bold">Login</Typography>
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
