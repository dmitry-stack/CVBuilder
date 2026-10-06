import type { Metadata } from "next";
import { UnsupportedDeviceView } from "@/features/system/ui/UnsupportedDeviceView";

export const metadata: Metadata = {
  title: "Device Not Supported | CV Builder",
  description: "CV Builder is optimized for tablet and desktop screens.",
};

export default function UnsupportedDevicePage() {
  return (
    <main className="flex-1 flex items-center justify-center p-6">
      <UnsupportedDeviceView />
    </main>
  );
}
