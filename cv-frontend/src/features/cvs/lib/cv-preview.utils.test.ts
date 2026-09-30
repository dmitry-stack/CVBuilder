import { describe, it, expect, vi } from "vitest";
import {
  formatMonthYear,
  formatPreviewPeriod,
  extractUniqueDomains,
  calculateSkillMetrics,
  formatResponsibilities,
  base64ToBlob,
  downloadBlob,
} from "./cv-preview.utils";

describe("cv-preview.utils", () => {
  describe("formatMonthYear", () => {
    it("formats standard YYYY-MM-DD date to MM.YYYY", () => {
      expect(formatMonthYear("2023-08-20")).toBe("08.2023");
    });

    it("handles Till now input", () => {
      expect(formatMonthYear("Till now")).toBe("Till now");
    });

    it("returns empty string for null/undefined/empty input", () => {
      expect(formatMonthYear("")).toBe("");
      expect(formatMonthYear(null)).toBe("");
    });
  });

  describe("formatPreviewPeriod", () => {
    it("formats period with start and end dates", () => {
      expect(formatPreviewPeriod("2023-08-01", "2025-06-30")).toBe(
        "08.2023 – 06.2025",
      );
    });

    it("formats ongoing period as Till now", () => {
      expect(formatPreviewPeriod("2023-08-01", null)).toBe(
        "08.2023 – Till now",
      );
      expect(formatPreviewPeriod("2023-08-01", "")).toBe("08.2023 – Till now");
    });
  });

  describe("extractUniqueDomains", () => {
    it("extracts unique domains ignoring case", () => {
      const projects = [
        { domain: "Fintech" },
        { domain: "Healthcare" },
        { domain: "fintech" },
        { domain: null },
      ];
      expect(extractUniqueDomains(projects)).toEqual(["Fintech", "Healthcare"]);
    });
  });

  describe("calculateSkillMetrics", () => {
    it("returns dashes when skill is not present in any project", () => {
      const result = calculateSkillMetrics("Docker", [
        { start_date: "2023-01-01", environment: ["React", "TypeScript"] },
      ]);
      expect(result).toEqual({ experienceYears: "—", lastUsedYear: "—" });
    });

    it("calculates experience years and last used year for matching project", () => {
      const result = calculateSkillMetrics("React", [
        {
          start_date: "2023-01-01",
          end_date: "2025-01-01",
          environment: ["React", "TypeScript"],
        },
      ]);
      expect(result.experienceYears).toBe(2);
      expect(result.lastUsedYear).toBe(2025);
    });
  });

  describe("formatResponsibilities", () => {
    it("cleans and formats responsibilities array", () => {
      const input = [
        "• Built responsive UI;",
        "- Optimized queries",
        "* Deployed app",
      ];
      expect(formatResponsibilities(input)).toEqual([
        "Built responsive UI;",
        "Optimized queries",
        "Deployed app",
      ]);
    });

    it("handles string with newlines or semicolons", () => {
      const input = "Did task 1; Did task 2";
      expect(formatResponsibilities(input)).toEqual([
        "Did task 1",
        "Did task 2",
      ]);
    });
  });

  describe("base64ToBlob and downloadBlob", () => {
    it("converts base64 to Blob", () => {
      const base64 = btoa("mock pdf content");
      const blob = base64ToBlob(base64);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/pdf");
    });

    it("triggers file download without errors", () => {
      const blob = new Blob(["mock"], { type: "application/pdf" });
      const createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      expect(() => downloadBlob(blob, "test.pdf")).not.toThrow();
      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
    });
  });
});
