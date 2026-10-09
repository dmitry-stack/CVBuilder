"use client";

import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Header } from "./Header";
import { useSidebarContext } from "./SidebarContext";
import { cn } from "@/shared/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <Navbar />
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out",
          isCollapsed ? "md:pl-16" : "md:pl-50",
        )}
      >
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
