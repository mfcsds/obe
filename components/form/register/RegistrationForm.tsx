"use client";
import React from "react";
import { Card, CardContent, TextField, Button, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signUp, confirmSignUp } from 'aws-amplify/auth';
import { toast } from "sonner";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ROUTES from "@/constant/routes";

const RegistrationForm = () => {
  const [username, setUsername] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmationCode, setConfirmationCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState<'REGISTER' | 'CONFIRM'>('REGISTER');

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: username,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      if (isSignUpComplete) {
        toast.success("Registration successful! Please login.");
        window.location.href = ROUTES.SIGN_IN;
      } else {
        if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
          toast.success("Registration successful! Please check your email for confirmation code.");
          setStep('CONFIRM');
        } else {
          toast.info("Registration incomplete. Check console.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    setLoading(true);
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: username,
        confirmationCode
      });

      if (isSignUpComplete) {
        toast.success("Account confirmed successfully! Redirecting to login...");
        window.location.href = ROUTES.SIGN_IN;
      } else {
        toast.info("Confirmation incomplete. Check console.");
      }
    } catch (error) {
      console.error("Confirmation error:", error);
      toast.error(error instanceof Error ? error.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 5 }}>
      <Card elevation={8} sx={{ p: 3, m: 2 }}>
        <Box sx={{ mt: 5, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                {step === 'REGISTER' ? 'Create Your Account' : 'Confirm Your Account'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step === 'REGISTER'
                  ? 'This Application will help you to design sophisticated Outcome Based Education Curriculum for colloge'
                  : 'Please enter the confirmation code sent to your email address.'}
              </Typography>
            </Box>
            <FiberManualRecordIcon sx={{ fontSize: 120, color: 'grey.300' }} />
          </Box>
        </Box>
        <CardContent>
          {step === 'REGISTER' ? (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }} onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
              <TextField
                label="Full Name"
                type="text"
                placeholder="John Doe"
                fullWidth
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Username"
                type="text"
                placeholder="johndoe"
                fullWidth
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
                variant="outlined"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, borderRadius: 3, py: 1.5, borderWidth: 2 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {loading ? "Registering..." : "Register"}
                </Typography>
              </Button>
            </Box>
          ) : (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }} onSubmit={(e) => { e.preventDefault(); handleConfirmSignUp(); }}>
              <TextField
                label="Confirmation Code"
                type="text"
                placeholder="123456"
                fullWidth
                variant="outlined"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, borderRadius: 3, py: 1.5 }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {loading ? "Confirming..." : "Confirm Account"}
                </Typography>
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={() => setStep('REGISTER')}
                disabled={loading}
              >
                Back to Registration
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
export default RegistrationForm;
