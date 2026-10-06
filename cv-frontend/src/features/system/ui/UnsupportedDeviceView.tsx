import Image from "next/image";
import errorSvg from "@/assets/error.svg";

export function UnsupportedDeviceView() {
  return (
    <div
      role="region"
      aria-label="Unsupported device"
      data-slot="unsupported-device-view"
      className="flex flex-1 min-h-[70vh] flex-col items-center justify-center p-6 text-center font-roboto"
    >
      <Image
        src={errorSvg}
        alt="Device not supported"
        width={162}
        height={122}
        priority
        className="mb-6 max-w-full h-auto dark:invert dark:brightness-200"
      />

      <h1 className="text-3xl font-medium text-[#2E2E2E] dark:text-zinc-100 mb-3">
        Oops
      </h1>

      <p className="max-w-md text-sm text-[#2E2E2E] dark:text-zinc-300 leading-relaxed">
        Device is not supported. CV Builder is optimized for tablet and desktop.
        <br />
        Please open on a larger screen.
      </p>
    </div>
  );
}
