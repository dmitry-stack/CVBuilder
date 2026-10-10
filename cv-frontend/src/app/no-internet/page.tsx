import type { Metadata } from "next";
import { NoInternetView } from "@/shared/providers/system/ui/NoInternetView";

export const metadata: Metadata = {
  title: "No Internet Connection | CV Builder",
  description: "Network connectivity is currently unavailable.",
};

export default function NoInternetPage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-[#2E2E2E]">
      <NoInternetView />
    </main>
  );
}
