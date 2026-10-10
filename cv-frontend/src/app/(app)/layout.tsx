import { ReactNode } from "react";
import { cookies } from "next/headers";
import { HeaderProvider } from "@/shared/components/layout/HeaderContext";
import { SidebarProvider } from "@/shared/components/layout/SidebarContext";
import { SIDEBAR_COOKIE_KEY } from "@/shared/components/layout/sidebar.constants";
import { AppShell } from "@/shared/components/layout/AppShell";

export const metadata = {
  title: "CV Builder",
  description: "Enterprise CV and Employee management platform",
};

export default async function AppLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultCollapsed =
    cookieStore.get(SIDEBAR_COOKIE_KEY)?.value === "true";

  return (
    <HeaderProvider>
      <SidebarProvider defaultCollapsed={defaultCollapsed}>
        <AppShell>{children}</AppShell>
      </SidebarProvider>
    </HeaderProvider>
  );
}
