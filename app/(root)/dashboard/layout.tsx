import NavBar from "@/components/navigation/navbar";
import { Toaster } from "@/components/ui/sonner";
import React, { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/sidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar></AppSidebar>
      <main className="w-full">
        <div className="flex flex-row items-center justify-between w-full border-b border-gray-200">
          <SidebarTrigger></SidebarTrigger>
          <NavBar></NavBar>
        </div>

        {children}
        <Toaster></Toaster>
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
