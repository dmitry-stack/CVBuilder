import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeleteCVDialog } from "./DeleteCVDialog";

describe("DeleteCVDialog", () => {
  it("does not render when isOpen is false", () => {
    render(
      <DeleteCVDialog
        isOpen={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        cvName="Frontend CV"
      />,
    );
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders CV name and confirmation text when open", () => {
    render(
      <DeleteCVDialog
        isOpen={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        cvName="Full Stack CV"
      />,
    );

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /delete cv/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/full stack cv/i)).toBeInTheDocument();
    expect(
      screen.getByText(/this action cannot be undone/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete cv/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("calls onConfirm when Delete button is clicked", async () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <DeleteCVDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        cvName="Backend CV"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /delete cv/i }));

    await waitFor(() => {
      expect(handleConfirm).toHaveBeenCalledTimes(1);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  it("calls onClose when Cancel button or close icon is clicked", () => {
    const handleClose = vi.fn();

    render(
      <DeleteCVDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={vi.fn()}
        cvName="Mobile CV"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText(/close dialog/i));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
