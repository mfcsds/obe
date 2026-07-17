"use client";

import RegistrationForm from "@/components/form/register/RegistrationForm";
import { AuthBrandPanel } from "@/components/form/AuthBrandPanel";
import { Box } from "@mui/material";

const SignUpPage = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: "45%",
        }}
      >
        <AuthBrandPanel />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "100%", md: "55%" },
          p: { xs: 3, sm: 6 },
        }}
      >
        <RegistrationForm />
      </Box>
    </Box>
  );
};

export default SignUpPage;
