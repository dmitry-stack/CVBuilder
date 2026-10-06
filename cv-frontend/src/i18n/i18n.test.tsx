import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import {
  LanguageProvider,
  useTranslation,
  LANGUAGES,
  LANGUAGE_CODES,
} from "./index";

function wrapper({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

describe("i18n translation system", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  it("provides English translations by default", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(result.current.language).toBe("english");
    expect(result.current.languageCode).toBe("en");
    expect(result.current.t("nav.employees")).toBe("Employees");
    expect(result.current.t("settings.changePassword")).toBe("Change Password");
  });

  it("switches language and translates keys accurately", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLanguage("russian");
    });

    expect(result.current.language).toBe("russian");
    expect(result.current.languageCode).toBe("ru");
    expect(result.current.t("nav.employees")).toBe("Сотрудники");
    expect(result.current.t("settings.changePassword")).toBe("Сменить пароль");
    expect(result.current.t("auth.signIn")).toBe("ВОЙТИ");
    expect(localStorage.getItem("app_language")).toBe("russian");
    expect(document.documentElement.lang).toBe("ru");
  });

  it("supports Spanish, German, French, etc.", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper });

    act(() => {
      result.current.setLanguage("spanish");
    });
    expect(result.current.t("nav.employees")).toBe("Empleados");
    expect(result.current.t("auth.signIn")).toBe("INICIAR SESIÓN");

    act(() => {
      result.current.setLanguage("german");
    });
    expect(result.current.t("nav.employees")).toBe("Mitarbeiter");
    expect(result.current.t("auth.signIn")).toBe("ANMELDEN");

    act(() => {
      result.current.setLanguage("french");
    });
    expect(result.current.t("nav.employees")).toBe("Employés");
    expect(result.current.t("auth.signIn")).toBe("SE CONNECTER");
  });

  it("has valid language codes for all defined languages", () => {
    for (const lang of LANGUAGES) {
      expect(LANGUAGE_CODES[lang]).toBeDefined();
      expect(typeof LANGUAGE_CODES[lang]).toBe("string");
      expect(LANGUAGE_CODES[lang].length).toBe(2);
    }
  });
});
