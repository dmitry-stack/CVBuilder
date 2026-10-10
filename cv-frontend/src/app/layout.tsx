import type { Metadata } from "next";

import "./globals.css";
import { roboto } from "./fonts";
import { ReactNode } from "react";
import { ApolloProviderWrapper } from "@/shared/lib/apollo-provider";
import { AppToastContainer } from "@/shared/components/ui/toast";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/i18n";
import { OfflineGuard } from "@/shared/providers/system/ui/OfflineGuard";
import { DeviceGuard } from "@/shared/providers/system/ui/DeviceGuard";

export const metadata: Metadata = {
  title: "CV Builder",
  description:
    "CV Builder is a web application that allows users to create and manage their CVs online. It provides a user-friendly interface and various templates to help users build professional resumes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`min-h-full flex flex-col ${roboto.variable} ${roboto.className} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <DeviceGuard>
              <OfflineGuard>
                <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
              </OfflineGuard>
            </DeviceGuard>
            <AppToastContainer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
