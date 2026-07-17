"use client";

import { ReactNode, useState } from "react";
import { Box } from "@mui/material";
import NavBar from "@/components/navigation/navbar";
import { MuiSidebar } from "@/components/navigation/sidebar/MuiSidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Role } from "@/types/role";

interface DashboardShellProps {
  children: ReactNode;
  userName: string;
  userRole: Role | undefined;
}

/**
 * Client Component kecil yang membungkus state interaktif dashboard
 * (buka/tutup sidebar). Sengaja dipisah dari `app/(root)/layout.tsx` agar
 * layout itu bisa tetap jadi Server Component murni yang melakukan
 * validasi auth, sesuai prinsip "Server Component by default" di steering
 * clean-code.
 */
export function DashboardShell({ children, userName, userRole }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <MuiSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin 0.3s",
          marginLeft: sidebarOpen ? 0 : "-280px",
        }}
      >
        <NavBar
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          userName={userName}
          userRole={userRole ?? "-"}
        />
        {children}
        <Toaster />
      </Box>
    </Box>
  );
}
