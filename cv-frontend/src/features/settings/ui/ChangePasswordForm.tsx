"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Design only, no functionality yet
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-9">
      <div>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors rounded-none"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden cursor-pointer"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={
              showCurrentPassword
                ? "Hide current password"
                : "Show current password"
            }
          >
            {showCurrentPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors rounded-none"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden cursor-pointer"
            onClick={() => setShowNewPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={
              showNewPassword ? "Hide new password" : "Show new password"
            }
          >
            {showNewPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-12 w-full border border-cv-border bg-transparent px-3 pr-13 font-roboto text-base leading-5 tracking-cv text-cv-text placeholder:text-cv-placeholder focus-visible:border-cv-text dark:border-[#AEAEAE] dark:text-[#F5F5F7] dark:placeholder:text-[#626262] dark:focus-visible:border-white focus-visible:ring-0 focus:outline-hidden transition-colors rounded-none"
          />
          <button
            type="button"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-cv-muted hover:text-cv-text dark:text-[#AEAEAE] dark:hover:text-[#F5F5F7] transition-colors focus:outline-hidden cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-6 w-6" />
            ) : (
              <Eye className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center gap-4">
        <Button
          type="submit"
          className="h-12 w-55 rounded-full bg-cv-accent font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-on-accent shadow-cv-button hover:bg-cv-accent-hover transition-all cursor-pointer"
        >
          CHANGE PASSWORD
        </Button>

        <button
          type="button"
          onClick={handleReset}
          className="flex h-12 w-55 items-center justify-center rounded-full font-roboto text-sm font-medium leading-6 tracking-cv-wide uppercase text-cv-muted hover:text-cv-text dark:text-[#C4C4C6] dark:hover:text-[#F5F5F7] transition-colors cursor-pointer"
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
