import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeleteSkillDialog } from "./DeleteSkillDialog";

describe("DeleteSkillDialog Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <DeleteSkillDialog
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        skillNames={["React"]}
      />,
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders single skill deletion confirmation correctly", () => {
    render(
      <DeleteSkillDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        skillNames={["TypeScript"]}
      />,
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete Skill" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/“TypeScript”/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Skill" }),
    ).toBeInTheDocument();
  });

  it("renders multiple skills deletion confirmation correctly", () => {
    render(
      <DeleteSkillDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        skillNames={["React", "TypeScript", "Node.js"]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Delete Skills" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 selected skills/)).toBeInTheDocument();
    expect(
      screen.getByText(/\(React, TypeScript, Node.js\)/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Skills (3)" }),
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    const mockClose = vi.fn();
    render(
      <DeleteSkillDialog
        isOpen={true}
        onClose={mockClose}
        onConfirm={vi.fn()}
        skillNames={["React"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm and onClose when confirmed", async () => {
    const mockConfirm = vi.fn().mockResolvedValue(undefined);
    const mockClose = vi.fn();
    render(
      <DeleteSkillDialog
        isOpen={true}
        onClose={mockClose}
        onConfirm={mockConfirm}
        skillNames={["React"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete Skill" }));
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  it("handles Escape key to close dialog", () => {
    const mockClose = vi.fn();
    render(
      <DeleteSkillDialog
        isOpen={true}
        onClose={mockClose}
        onConfirm={vi.fn()}
        skillNames={["React"]}
      />,
    );

    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
