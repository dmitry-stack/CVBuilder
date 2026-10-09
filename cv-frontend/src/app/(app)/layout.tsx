import { ReactNode } from "react";
import { HeaderProvider } from "@/shared/components/layout/HeaderContext";
import { SidebarProvider } from "@/shared/components/layout/SidebarContext";
import { AppShell } from "@/shared/components/layout/AppShell";

export const metadata = {
  title: "CV Builder",
  description: "Enterprise CV and Employee management platform",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <HeaderProvider>
      <SidebarProvider>
        <AppShell>{children}</AppShell>
      </SidebarProvider>
    </HeaderProvider>
  );
}
