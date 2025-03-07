import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      {children}
      <Toaster></Toaster>
    </main>
  );
};

export default AuthLayout;
