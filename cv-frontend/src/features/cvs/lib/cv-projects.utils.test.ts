import { describe, it, expect } from "vitest";
import {
  formatProjectDate,
  filterAndSortProjects,
  type CvProjectItem,
} from "./cv-projects.utils";

describe("cv-projects.utils", () => {
  it("formats date strings into MM/DD/YYYY format", () => {
    expect(formatProjectDate("2023-08-21")).toBe("08/21/2023");
    expect(formatProjectDate("2023-01-20T00:00:00Z")).toBe("01/20/2023");
  });

  it("returns 'Till now' when date is null, undefined, or empty", () => {
    expect(formatProjectDate(null)).toBe("Till now");
    expect(formatProjectDate(undefined)).toBe("Till now");
    expect(formatProjectDate("")).toBe("Till now");
  });

  const mockProjects: CvProjectItem[] = [
    {
      id: "1",
      name: "SaaS Media Platform",
      domain: "IoT (Internet of Things)",
      start_date: "2023-08-21",
      end_date: null,
      description: "Music and video streaming.",
      responsibilities: ["Managed to write code in time"],
    },
    {
      id: "2",
      name: "Business Process Automation",
      domain: "Automation",
      start_date: "2023-01-20",
      end_date: "2023-06-19",
      description: "Workflow webhooks and queues.",
      responsibilities: ["Did something great", "Did not break production"],
    },
  ];

  it("filters projects by search term in name, domain, description, or responsibilities", () => {
    expect(filterAndSortProjects(mockProjects, "Media")).toHaveLength(1);
    expect(filterAndSortProjects(mockProjects, "Automation")).toHaveLength(1);
    expect(filterAndSortProjects(mockProjects, "production")).toHaveLength(1);
    expect(filterAndSortProjects(mockProjects, "nonexistent")).toHaveLength(0);
  });

  it("sorts projects by name ascending and descending", () => {
    const asc = filterAndSortProjects(mockProjects, "", "name", "asc");
    expect(asc[0]?.name).toBe("Business Process Automation");

    const desc = filterAndSortProjects(mockProjects, "", "name", "desc");
    expect(desc[0]?.name).toBe("SaaS Media Platform");
  });

  it("sorts projects by start_date", () => {
    const asc = filterAndSortProjects(mockProjects, "", "start_date", "asc");
    expect(asc[0]?.start_date).toBe("2023-01-20");

    const desc = filterAndSortProjects(mockProjects, "", "start_date", "desc");
    expect(desc[0]?.start_date).toBe("2023-08-21");
  });
});
