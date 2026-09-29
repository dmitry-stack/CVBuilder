import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CVRemoveSkillsDialog } from "./CVRemoveSkillsDialog";

describe("CVRemoveSkillsDialog Component", () => {
  it("renders Remove skills modal with count and confirmation message", () => {
    render(
      <CVRemoveSkillsDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        skillNames={["TypeScript", "React"]}
      />,
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Remove skills")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to remove 2 skills?"),
    ).toBeInTheDocument();
    expect(screen.getByText("(TypeScript, React)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument();
  });

  it("calls onConfirm and onClose when Confirm is clicked", async () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <CVRemoveSkillsDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        skillNames={["TypeScript"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when Cancel is clicked", () => {
    const handleClose = vi.fn();

    render(
      <CVRemoveSkillsDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={vi.fn()}
        skillNames={["TypeScript"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(handleClose).toHaveBeenCalled();
  });
});
