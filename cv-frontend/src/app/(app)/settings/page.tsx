"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { ChangePasswordForm } from "@/features/settings";
import { useTheme } from "next-themes";

const LANGUAGES: string[] = [
  "English",
  "French",
  "German",
  "Italian",
  "Polish",
  "Portuguese",
  "Russian",
  "Spanish",
  "Ukrainian",
];

function subscribeLanguage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("languagechange", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("languagechange", callback);
  };
}

function getLanguageSnapshot() {
  return localStorage.getItem("app_language") || "English";
}

function getServerSnapshot() {
  return "English";
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerSnapshot,
  );
  const currentTheme = theme === "system" ? "device" : theme;

  const handleThemeChange = (val: string) => {
    setTheme(val === "device" ? "system" : val);
  };

  const handleLanguageChange = (val: string) => {
    localStorage.setItem("app_language", val);
    window.dispatchEvent(new Event("languagechange"));
  };

  return (
    <div className="flex flex-col px-20 gap-4">
      <div>
        <label
          htmlFor="theme_select"
          className="block text-xs font-normal text-[#626262] dark:text-[#AEAEAE] mb-1 tracking-[0.15px]"
        >
          Theme
        </label>

        <div className="relative">
          <select
            id="theme_select"
            value={currentTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
            className="w-full h-12 px-3.5 pr-9 border border-[#AEAEAE] dark:border-[#AEAEAE] bg-white dark:bg-[#2E2E2E] text-sm text-[#2E2E2E] dark:text-[#F5F5F7] focus:outline-hidden focus:border-cv-accent appearance-none cursor-pointer"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="device">Device Settings</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#626262] dark:text-[#AEAEAE] pointer-events-none" />
        </div>
      </div>

      <div>
        <label
          htmlFor="language_select"
          className="block text-xs font-normal text-[#626262] dark:text-[#AEAEAE] mb-1 tracking-[0.15px]"
        >
          Language
        </label>

        <div className="relative">
          <select
            id="language_select"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full h-12 px-3.5 pr-9 border border-[#AEAEAE] dark:border-[#AEAEAE] bg-white dark:bg-[#2E2E2E] text-sm text-[#2E2E2E] dark:text-[#F5F5F7] focus:outline-hidden focus:border-cv-accent appearance-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#626262] dark:text-[#AEAEAE] pointer-events-none" />
        </div>
      </div>

      <div className="pt-5">
        <h2 className="font-roboto text-base font-normal pb-9 text-[#2E2E2E] dark:text-[#F5F5F7]">
          Change Password
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
