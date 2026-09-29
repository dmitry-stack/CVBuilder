import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CVProjectDialog } from "./CVProjectDialog";
import type { CvProjectItem } from "../../lib/cv-projects.utils";

describe("CVProjectDialog Component", () => {
  const mockInitialData: CvProjectItem = {
    id: "cp-2",
    name: "Business Process Automation",
    internal_name: "bpa",
    domain: "Automation",
    start_date: "2023-01-20",
    end_date: "2023-06-19",
    description:
      "A system for setting up business process automation. Includes work with webhooks...",
    environment: [
      "HTML5",
      "CSS3",
      "TypeScript",
      "React",
      "Zustand",
      "Firebase",
    ],
    roles: ["Frontend Developer", "AI Developer"],
    responsibilities: ["Did something great", "Did not break production"],
    project: {
      id: "3",
      name: "Business Process Automation",
    },
  };

  const mockAvailableProjects = [
    {
      id: "3",
      name: "Business Process Automation",
      domain: "Automation",
      description: "A system for setting up business process automation...",
      environment: [
        "HTML5",
        "CSS3",
        "TypeScript",
        "React",
        "Zustand",
        "Firebase",
      ],
      start_date: "2023-01-20",
      end_date: "2023-06-19",
    },
    {
      id: "5",
      name: "SaaS Media Platform",
      domain: "IoT (Internet of Things)",
      description: "A digital music, podcast, and video service...",
      environment: ["React", "Node.js"],
      start_date: "2023-08-21",
      end_date: null,
    },
  ];

  it("renders Update project dialog matching projectCreateDialog.png reference", () => {
    render(
      <CVProjectDialog
        isOpen={true}
        initialData={mockInitialData}
        availableProjects={mockAvailableProjects}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText("Update project")).toBeInTheDocument();
    expect(screen.getByText("Business Process Automation")).toBeInTheDocument();
    expect(screen.getByText("Automation")).toBeInTheDocument();

    // Check dates
    const startDateInput = screen.getByLabelText(
      "Start Date",
    ) as HTMLInputElement;
    expect(startDateInput.value).toBe("2023-01-20");

    const endDateInput = screen.getByLabelText("End Date") as HTMLInputElement;
    expect(endDateInput.value).toBe("2023-06-19");

    // Check description
    const descTextarea = screen.getByLabelText(
      "Description",
    ) as HTMLTextAreaElement;
    expect(descTextarea.value).toContain(
      "A system for setting up business process automation",
    );

    // Check environment tags
    expect(screen.getByText("HTML5")).toBeInTheDocument();
    expect(screen.getByText("CSS3")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Zustand")).toBeInTheDocument();
    expect(screen.getByText("Firebase")).toBeInTheDocument();

    // Check roles
    const rolesInput = screen.getByLabelText("Roles") as HTMLInputElement;
    expect(rolesInput.value).toBe("Frontend Developer, AI Developer");

    // Check responsibilities
    const respInput = screen.getByLabelText(
      "Responsibilities",
    ) as HTMLInputElement;
    expect(respInput.value).toBe(
      "Did something great, Did not break production",
    );

    // Buttons
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("allows removing environment tag and adding a new tag", () => {
    render(
      <CVProjectDialog
        isOpen={true}
        initialData={mockInitialData}
        availableProjects={mockAvailableProjects}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    // Remove Firebase tag
    const removeFirebaseBtn = screen.getByRole("button", {
      name: "Remove Firebase",
    });
    fireEvent.click(removeFirebaseBtn);
    expect(screen.queryByText("Firebase")).not.toBeInTheDocument();

    // Add TailwindCSS tag
    const envInput = screen.getByLabelText("Add environment tag");
    fireEvent.change(envInput, { target: { value: "TailwindCSS" } });
    fireEvent.keyDown(envInput, { key: "Enter" });
    expect(screen.getByText("TailwindCSS")).toBeInTheDocument();
  });

  it("submits updated project form data on Update click", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    render(
      <CVProjectDialog
        isOpen={true}
        initialData={mockInitialData}
        availableProjects={mockAvailableProjects}
        onClose={vi.fn()}
        onSave={handleSave}
      />,
    );

    const updateBtn = screen.getByRole("button", { name: "Update" });
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: "3",
          start_date: "2023-01-20",
          end_date: "2023-06-19",
          description: expect.stringContaining(
            "A system for setting up business process automation",
          ),
          environment: expect.arrayContaining([
            "HTML5",
            "CSS3",
            "TypeScript",
            "React",
            "Zustand",
            "Firebase",
          ]),
          roles: ["Frontend Developer", "AI Developer"],
          responsibilities: ["Did something great", "Did not break production"],
        }),
      );
    });
  });

  it("switches project details when changing selected project in Add mode", () => {
    render(
      <CVProjectDialog
        isOpen={true}
        initialData={null}
        availableProjects={mockAvailableProjects}
        onClose={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText("Add Project to CV")).toBeInTheDocument();

    // Change project selection to SaaS Media Platform
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "5" } });

    // Domain and description should update
    expect(screen.getByText("IoT (Internet of Things)")).toBeInTheDocument();
    const descTextarea = screen.getByLabelText(
      "Description",
    ) as HTMLTextAreaElement;
    expect(descTextarea.value).toContain(
      "A digital music, podcast, and video service",
    );
  });

  it("calls onClose when Cancel or Close X button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <CVProjectDialog
        isOpen={true}
        initialData={mockInitialData}
        availableProjects={mockAvailableProjects}
        onClose={handleClose}
        onSave={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
