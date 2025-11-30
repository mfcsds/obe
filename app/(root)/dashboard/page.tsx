"use client";

import { Container, Typography, Box, Paper } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          This is Dashboard
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;
