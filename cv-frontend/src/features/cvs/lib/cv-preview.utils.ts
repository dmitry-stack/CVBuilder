export interface PreviewProjectItem {
  start_date: string;
  end_date?: string | null;
  environment?: string[] | null;
  domain?: string | null;
  responsibilities?: string[] | null;
}

export interface SkillMetrics {
  experienceYears: number | string;
  lastUsedYear: number | string;
}

export function formatMonthYear(dateStr?: string | null): string {
  if (!dateStr || dateStr.trim() === "") return "";
  if (dateStr.toLowerCase() === "till now") return "Till now";

  const clean = dateStr.split("T")[0];
  const parts = clean.split("-");
  if (parts.length >= 2) {
    const [year, month] = parts;
    if (year && month) {
      return `${month.padStart(2, "0")}.${year}`;
    }
  }

  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    return `${mm}.${yyyy}`;
  }

  return dateStr;
}

export function formatPreviewPeriod(
  startDate?: string | null,
  endDate?: string | null,
): string {
  const start = formatMonthYear(startDate) || "—";
  const end =
    endDate && endDate.trim() !== "" ? formatMonthYear(endDate) : "Till now";
  return `${start} – ${end}`;
}

export function extractUniqueDomains(
  projects: Array<{ domain?: string | null }>,
): string[] {
  const seen = new Set<string>();
  const domains: string[] = [];

  for (const project of projects) {
    const d = project.domain?.trim();
    if (d && !seen.has(d.toLowerCase())) {
      seen.add(d.toLowerCase());
      domains.push(d);
    }
  }

  return domains;
}

export function calculateSkillMetrics(
  skillName: string,
  projects: PreviewProjectItem[],
): SkillMetrics {
  const target = skillName.trim().toLowerCase();
  if (!target) {
    return { experienceYears: "—", lastUsedYear: "—" };
  }

  const matching = projects.filter((p) =>
    p.environment?.some((env) => env.trim().toLowerCase() === target),
  );

  if (matching.length === 0) {
    return { experienceYears: "—", lastUsedYear: "—" };
  }

  let totalMonths = 0;
  let maxYear = 0;
  const currentYear = new Date().getFullYear();

  for (const p of matching) {
    const start = p.start_date ? new Date(p.start_date) : null;
    const isOngoing =
      !p.end_date ||
      p.end_date.trim() === "" ||
      p.end_date.toLowerCase() === "till now";
    const end = isOngoing ? new Date() : new Date(p.end_date!);

    if (start && !isNaN(start.getTime())) {
      const validEnd = isNaN(end.getTime()) ? new Date() : end;
      const months = Math.max(
        1,
        (validEnd.getFullYear() - start.getFullYear()) * 12 +
          (validEnd.getMonth() - start.getMonth()),
      );
      totalMonths += months;

      const projectEndYear = isOngoing ? currentYear : validEnd.getFullYear();
      if (projectEndYear > maxYear) {
        maxYear = projectEndYear;
      }
    }
  }

  const years = Math.max(1, Math.round(totalMonths / 12));
  return {
    experienceYears: years,
    lastUsedYear: maxYear > 0 ? maxYear : currentYear,
  };
}

export function formatResponsibilities(
  responsibilities?: string[] | string | null,
): string[] {
  if (!responsibilities) return [];

  const rawList = Array.isArray(responsibilities)
    ? responsibilities
    : responsibilities.split(/\r?\n|;/g);

  return rawList
    .map((item) => item.replace(/^[•\s*-]+/, "").trim())
    .filter((item) => item.length > 0);
}

export function base64ToBlob(
  base64: string,
  mimeType = "application/pdf",
): Blob {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
