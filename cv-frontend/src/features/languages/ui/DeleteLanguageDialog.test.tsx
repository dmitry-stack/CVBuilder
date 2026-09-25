import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeleteLanguageDialog } from "./DeleteLanguageDialog";

describe("DeleteLanguageDialog Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <DeleteLanguageDialog
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        languageNames={["English"]}
      />,
    );

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders single language deletion confirmation correctly", () => {
    render(
      <DeleteLanguageDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        languageNames={["German"]}
      />,
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete Language" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/“German”/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Language" }),
    ).toBeInTheDocument();
  });

  it("renders multiple languages deletion confirmation correctly", () => {
    render(
      <DeleteLanguageDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        languageNames={["English", "German", "Spanish"]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Delete Languages" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 selected languages/)).toBeInTheDocument();
    expect(
      screen.getByText(/\(English, German, Spanish\)/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Languages (3)" }),
    ).toBeInTheDocument();
  });

  it("calls onClose when Cancel button is clicked", () => {
    const mockClose = vi.fn();
    render(
      <DeleteLanguageDialog
        isOpen={true}
        onClose={mockClose}
        onConfirm={vi.fn()}
        languageNames={["English"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm and onClose when confirmed", async () => {
    const mockConfirm = vi.fn().mockResolvedValue(undefined);
    const mockClose = vi.fn();
    render(
      <DeleteLanguageDialog
        isOpen={true}
        onClose={mockClose}
        onConfirm={mockConfirm}
        languageNames={["English"]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete Language" }));
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
      expect(mockClose).toHaveBeenCalledTimes(1);
    });
  });

  it("handles Escape key to close dialog", () => {
    const mockClose = vi.fn();
    render(
      <DeleteLanguageDialog
        isOpen={true}
        onClose={mockClose}
        onConfirm={vi.fn()}
        languageNames={["English"]}
      />,
    );

    fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
