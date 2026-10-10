"use client";

import { Select } from "@/shared/components/ui/select";
import { ChangePasswordForm } from "@/features/settings";
import { useTheme } from "next-themes";
import { useTranslation, LANGUAGES, type Language } from "@/i18n";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const currentTheme = theme === "system" ? "device" : theme;

  const handleThemeChange = (val: string) => {
    setTheme(val === "device" ? "system" : val);
  };

  const handleLanguageChange = (val: string) => {
    setLanguage(val as Language);
  };

  const themeOptions = [
    { value: "light", label: t("settings.themeLight") },
    { value: "dark", label: t("settings.themeDark") },
    { value: "device", label: t("settings.themeDevice") },
  ];

  const languageOptions = LANGUAGES.map((lang) => ({
    value: lang,
    label: t(`languages.${lang}`),
  }));

  return (
    <div className="flex flex-col px-20 gap-4">
      <Select
        id="theme_select"
        label={t("settings.theme")}
        alwaysShowLabel
        value={currentTheme}
        onChange={handleThemeChange}
        options={themeOptions}
      />

      <Select
        id="language_select"
        label={t("settings.language")}
        alwaysShowLabel
        value={language}
        onChange={handleLanguageChange}
        options={languageOptions}
      />

      <div className="pt-5">
        <h2 className="font-roboto text-base font-normal pb-9 text-[#2E2E2E] dark:text-[#F5F5F7]">
          {t("settings.changePassword")}
        </h2>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
