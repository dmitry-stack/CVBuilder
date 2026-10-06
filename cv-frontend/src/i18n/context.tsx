"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  LANGUAGES,
  LANGUAGE_CODES,
  type Language,
  type TranslationKey,
} from "./types";
import { dictionaries } from "./dictionaries";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  languageCode: string;
}

const STORAGE_KEY = "app_language";

function subscribeLanguage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("languagechange", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("languagechange", callback);
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") return "english";
  const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
  if (stored && (LANGUAGES as readonly string[]).includes(stored)) {
    return stored;
  }
  return "english";
}

function getServerSnapshot(): Language {
  return "english";
}

const defaultContext: LanguageContextType = {
  language: "english",
  setLanguage: () => {},
  t: (key: TranslationKey, params?: Record<string, string | number>) => {
    let text = dictionaries.english[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return text;
  },
  languageCode: "en",
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getServerSnapshot,
  );

  const setLanguage = useCallback((newLang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
      const code = LANGUAGE_CODES[newLang] || "en";
      document.documentElement.lang = code;
      window.dispatchEvent(new Event("languagechange"));
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const dict = dictionaries[language] || dictionaries.english;
      let text = dict[key] || dictionaries.english[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        });
      }
      return text;
    },
    [language],
  );

  const languageCode = LANGUAGE_CODES[language] || "en";

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, languageCode }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

export { useTranslation as useLanguage };
