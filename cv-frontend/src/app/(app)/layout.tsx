import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "CV Builder",
  description: "Enterprise CV and Employee management platform",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      <Navbar />
      <div className="flex-1 md:pl-50 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
