"use client";
import React from "react";
import { Card, CardContent, TextField, Button, Typography, Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const RegistrationForm = () => {
  return (
    <Box sx={{ p: 5 }}>
      <Card elevation={8} sx={{ p: 3, m: 2 }}>
        <Box sx={{ mt: 5, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Create Your Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This Application will help you to design sophisticated Outcome Based Education Curriculum for colloge
              </Typography>
            </Box>
            <FiberManualRecordIcon sx={{ fontSize: 120, color: 'grey.300' }} />
          </Box>
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 5 }}>
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
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 3, borderRadius: 3, py: 1.5, borderWidth: 2 }}
            >
              <Typography variant="h6" fontWeight="bold">Register</Typography>
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
export default RegistrationForm;
