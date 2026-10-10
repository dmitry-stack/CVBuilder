"use client";

import {
  useState,
  useRef,
  useTransition,
  useEffect,
  type KeyboardEvent,
  type ClipboardEvent,
  type ChangeEvent,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { verifyEmailAction } from "../actions/verify-email.action";
import { sendVerificationAction } from "../actions/send-verification.action";
import { useTranslation } from "@/i18n";

export default function EmailVerificationForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const email = searchParams.get("email") || undefined;
  const callbackUrl = searchParams.get("callbackUrl");
  const redirectTarget = callbackUrl || "/users";

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanDigit = rawVal.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    setDigits(newDigits);
    setServerError(null);

    if (cleanDigit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i];
    }
    setDigits(newDigits);
    setServerError(null);

    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputsRef.current[nextFocusIndex]?.focus();
  };

  const otpValue = digits.join("");
  const isComplete = otpValue.length === 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setServerError("Please enter all 6 digits of the verification code.");
      return;
    }

    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await verifyEmailAction({
        otp: otpValue,
        token,
      });

      if (result.serverError) {
        setServerError(result.serverError);
      } else if (result.success) {
        setSuccessMessage("Email successfully verified! Redirecting...");
        setTimeout(() => {
          router.push(redirectTarget);
          router.refresh();
        }, 1500);
      }
    });
  };

  const handleResend = async () => {
    if (!email || isResending) return;
    setIsResending(true);
    setServerError(null);

    const res = await sendVerificationAction(email);
    setIsResending(false);

    if (res.serverError) {
      setServerError(res.serverError);
    } else {
      setSuccessMessage("A new verification code has been sent to your email.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {serverError && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="mb-6 flex items-center gap-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600 dark:text-emerald-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-3 py-4">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            disabled={isPending}
            aria-label={`Digit ${idx + 1}`}
            className="h-12 w-11 sm:w-12 border border-[#AEAEAE] bg-transparent text-center font-roboto text-xl font-normal text-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] focus:border-cv-text dark:focus:border-white focus:outline-hidden transition-colors"
          />
        ))}
      </div>

      <div className="mx-auto mt-10 sm:mt-12 flex w-55 flex-col items-center gap-2">
        <Button
          type="submit"
          size="xl"
          className="w-55 shadow-cv-button"
          disabled={isPending || !isComplete}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            t("auth.confirm")
          )}
        </Button>

        <Link
          href={redirectTarget}
          className="flex h-12 w-55 items-center justify-center rounded-full font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-muted hover:text-cv-text dark:text-[#C4C4C6] dark:hover:text-[#F5F5F7] transition-colors"
        >
          {t("auth.later")}
        </Link>
      </div>

      {email && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isPending}
            className="font-roboto text-xs font-normal text-cv-muted hover:text-cv-accent dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] underline transition-colors cursor-pointer disabled:opacity-50"
          >
            {isResending ? "Sending..." : "Didn't receive a code? Resend"}
          </button>
        </div>
      )}
    </form>
  );
}
