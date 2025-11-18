"use client";

import NavBar from "@/components/navigation/navbar";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode, useState } from "react";
import { MuiSidebar } from "@/components/navigation/sidebar/MuiSidebar";
import { Box } from '@mui/material';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <MuiSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, transition: 'margin 0.3s', marginLeft: sidebarOpen ? 0 : '-280px' }}>
        <NavBar onMenuClick={() => setSidebarOpen(true)} sidebarOpen={sidebarOpen} />
        {children}
        <Toaster />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
