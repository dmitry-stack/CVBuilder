"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import errorSvg from "@/assets/error.svg";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/users");
    }
  };

  return (
    <div className="flex flex-1 min-h-[70vh] flex-col items-center justify-center p-6 text-center font-roboto">
      <Image
        src={errorSvg}
        alt="Page not found"
        width={162}
        height={122}
        priority
        unoptimized
        className="mb-6 max-w-full h-auto dark:invert dark:brightness-200"
      />

      <h1 className="text-3xl font-medium text-[#2E2E2E] dark:text-zinc-100 mb-3">
        Hmm...
      </h1>

      <p className="max-w-md text-sm text-[#2E2E2E] dark:text-zinc-300 leading-relaxed mb-6">
        This doesn&apos;t seem to be the page you were looking for.
        <br />
        Let&apos;s get you back on track.
      </p>

      <Button
        type="button"
        size="lg"
        onClick={handleGoBack}
        className="min-w-40 shadow-md"
      >
        GO BACK
      </Button>
    </div>
  );
}
