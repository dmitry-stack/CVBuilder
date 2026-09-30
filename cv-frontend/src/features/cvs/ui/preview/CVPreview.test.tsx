import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CVPreview } from "./CVPreview";
import { HeaderProvider } from "@/components/layout/HeaderContext";
import { useCvPreview } from "../../hooks/useCvPreview";

vi.mock("../../hooks/useCvPreview", () => ({
  useCvPreview: vi.fn(),
}));

describe("CVPreview Component", () => {
  const mockExportPdf = vi.fn();

  const mockCvData = {
    cv: {
      id: "cv-1",
      name: "Software Engineer with 5+ years of experience",
      education: "Computer Systems Design",
      description: "Highly motivated and experienced Software Engineer.",
    },
    projects: [
      {
        id: "proj-1",
        name: "SAAS MEDIA PLATFORM",
        description: "A digital music service.",
        domain: "Media",
        start_date: "2023-08-01",
        end_date: null,
        environment: ["TypeScript", "React"],
        roles: ["Frontend Developer", "AI Developer"],
        responsibilities: ["Integrated Keycloak OAuth SSO login"],
      },
    ],
    domains: ["IoT (Internet of Things)"],
    languages: [{ name: "English", proficiency: "Proficient" }],
    employeeName: "Rostislav Harlanov",
    employeePosition: "SOFTWARE ENGINEER",
    skillsGrouped: [
      {
        categoryName: "Programming languages",
        items: [
          { name: "TypeScript", categoryId: "cat-1", mastery: "Expert" },
          { name: "JavaScript", categoryId: "cat-1", mastery: "Expert" },
        ],
      },
    ],
    loading: false,
    error: null,
    isExporting: false,
    handleExportPdf: mockExportPdf,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (cvId = "cv-1") =>
    render(
      <HeaderProvider>
        <CVPreview cvId={cvId} />
      </HeaderProvider>,
    );

  type CvPreviewResult = ReturnType<typeof useCvPreview>;

  it("renders loading skeleton when loading and no cv", () => {
    vi.mocked(useCvPreview).mockReturnValue({
      ...mockCvData,
      cv: null,
      loading: true,
    } as unknown as CvPreviewResult);

    renderComponent();
    expect(screen.getByLabelText(/loading cv preview/i)).toBeInTheDocument();
  });

  it("renders error state when error and no cv", () => {
    vi.mocked(useCvPreview).mockReturnValue({
      ...mockCvData,
      cv: null,
      error: new Error("Network error occurred"),
      loading: false,
    } as unknown as CvPreviewResult);

    renderComponent();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/failed to load cv preview/i)).toBeInTheDocument();
    expect(screen.getByText(/network error occurred/i)).toBeInTheDocument();
  });

  it("renders not found state when no cv and not loading", () => {
    vi.mocked(useCvPreview).mockReturnValue({
      ...mockCvData,
      cv: null,
      error: null,
      loading: false,
    } as unknown as CvPreviewResult);

    renderComponent();
    expect(screen.getByText(/cv not found/i)).toBeInTheDocument();
  });

  it("renders full preview with header, summary, projects, and skills", () => {
    vi.mocked(useCvPreview).mockReturnValue(
      mockCvData as unknown as CvPreviewResult,
    );

    renderComponent();

    // Header
    expect(screen.getByText("Rostislav Harlanov")).toBeInTheDocument();
    expect(screen.getByText("SOFTWARE ENGINEER")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export pdf/i }),
    ).toBeInTheDocument();

    // Summary - Left column
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Computer Systems Design")).toBeInTheDocument();
    expect(screen.getByText("Language proficiency")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Domains")).toBeInTheDocument();
    expect(screen.getByText("IoT (Internet of Things)")).toBeInTheDocument();

    // Summary - Right column
    expect(
      screen.getByText("Software Engineer with 5+ years of experience"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Highly motivated and experienced Software Engineer."),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Programming languages").length).toBeGreaterThan(
      0,
    );

    // Projects
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("SAAS MEDIA PLATFORM")).toBeInTheDocument();
    expect(screen.getByText("A digital music service.")).toBeInTheDocument();
    expect(
      screen.getByText("Frontend Developer, AI Developer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Integrated Keycloak OAuth SSO login"),
    ).toBeInTheDocument();

    // Skills table
    expect(screen.getByText("Professional skills")).toBeInTheDocument();
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Last used")).toBeInTheDocument();
  });

  it("calls handleExportPdf when Export PDF button is clicked", () => {
    vi.mocked(useCvPreview).mockReturnValue(
      mockCvData as unknown as CvPreviewResult,
    );

    renderComponent();

    const exportBtn = screen.getByRole("button", { name: /export pdf/i });
    fireEvent.click(exportBtn);

    expect(mockExportPdf).toHaveBeenCalledTimes(1);
  });

  it("disables Export PDF button and shows spinner when exporting", () => {
    vi.mocked(useCvPreview).mockReturnValue({
      ...mockCvData,
      isExporting: true,
    } as unknown as CvPreviewResult);

    renderComponent();

    const exportBtn = screen.getByRole("button", { name: /export pdf/i });
    expect(exportBtn).toBeDisabled();
    expect(screen.getByText(/exporting\.\.\./i)).toBeInTheDocument();
  });

  it("renders preview cleanly without skills table when all skills are removed", () => {
    vi.mocked(useCvPreview).mockReturnValue({
      ...mockCvData,
      skillsGrouped: [],
    } as unknown as CvPreviewResult);

    renderComponent();

    expect(screen.queryByText("Professional skills")).not.toBeInTheDocument();
    expect(screen.queryByText("Programming languages")).not.toBeInTheDocument();
  });
});
