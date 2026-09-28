export interface CvProjectItem {
  id: string;
  name: string;
  internal_name?: string;
  domain: string;
  start_date: string;
  end_date?: string | null;
  description: string;
  environment?: string[];
  roles?: string[];
  responsibilities: string[];
  project?: {
    id: string;
    name: string;
  };
}

export type ProjectSortField = "name" | "start_date" | "end_date";
export type ProjectSortOrder = "asc" | "desc";

export function formatProjectDate(dateStr?: string | null): string {
  if (!dateStr || dateStr.trim() === "") {
    return "Till now";
  }

  // Handle standard YYYY-MM-DD or ISO strings without timezone shifts
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    if (year && month && day) {
      return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`;
    }
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }

  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const yyyy = date.getUTCFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

export function filterAndSortProjects(
  projects: CvProjectItem[],
  query: string,
  sortField: ProjectSortField = "name",
  sortOrder: ProjectSortOrder = "asc",
): CvProjectItem[] {
  let result = [...projects];

  if (query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const domain = (p.domain || "").toLowerCase();
      const desc = (p.description || "").toLowerCase();
      const resp = (p.responsibilities || []).join(" ").toLowerCase();
      return (
        name.includes(q) ||
        domain.includes(q) ||
        desc.includes(q) ||
        resp.includes(q)
      );
    });
  }

  result.sort((a, b) => {
    let valA = "";
    let valB = "";

    if (sortField === "name") {
      valA = (a.name || "").toLowerCase();
      valB = (b.name || "").toLowerCase();
    } else if (sortField === "start_date") {
      valA = a.start_date || "";
      valB = b.start_date || "";
    } else if (sortField === "end_date") {
      // If ongoing (no end_date), treat as latest
      valA = a.end_date || "9999-12-31";
      valB = b.end_date || "9999-12-31";
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return result;
}
