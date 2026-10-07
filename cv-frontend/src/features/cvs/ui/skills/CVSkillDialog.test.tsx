import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CVSkillDialog } from "./CVSkillDialog";

describe("CVSkillDialog Component", () => {
  const availableSkills = [
    { name: "TypeScript", categoryId: "1", mastery: "Expert" },
    { name: "React", categoryId: "2", mastery: "Proficient" },
    { name: "Python", categoryId: "1", mastery: "Competent" },
  ];

  it("renders Add skill dialog when initialData is null", () => {
    render(
      <CVSkillDialog
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={null}
        availableSkills={availableSkills}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Add skill" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Skill")).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeDisabled();
  });

  it("renders Update skill dialog with initial skill selected", () => {
    render(
      <CVSkillDialog
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={{ name: "React" }}
        availableSkills={availableSkills}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Update skill" }),
    ).toBeInTheDocument();
    const select = screen.getByLabelText("Skill");
    expect(select).toHaveValue("React");
    const saveBtn = screen.getByRole("button", { name: "Save" });
    expect(saveBtn).not.toBeDisabled();
  });

  it("calls onSave and onClose when selecting a skill and submitting", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <CVSkillDialog
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        initialData={null}
        availableSkills={availableSkills}
      />,
    );

    fireEvent.click(screen.getByRole("combobox", { name: "Skill" }));
    fireEvent.click(await screen.findByRole("option", { name: "Python" }));

    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).not.toBeDisabled();
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith("Python");
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when Cancel button or Escape key is pressed", () => {
    const handleClose = vi.fn();

    render(
      <CVSkillDialog
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        initialData={null}
        availableSkills={availableSkills}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
