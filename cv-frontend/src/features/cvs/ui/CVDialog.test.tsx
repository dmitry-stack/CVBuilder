import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CVDialog } from "./CVDialog";

describe("CVDialog", () => {
  it("does not render when isOpen is false", () => {
    render(<CVDialog isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders Create CV dialog when initialData is null", () => {
    render(<CVDialog isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /create cv/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/cv name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/education/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create cv/i }),
    ).toBeInTheDocument();
  }, 15000);

  it("shows validation errors when submitting with empty required fields", async () => {
    const handleSave = vi.fn();
    render(<CVDialog isOpen={true} onClose={vi.fn()} onSave={handleSave} />);

    fireEvent.click(screen.getByRole("button", { name: /create cv/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });

    expect(handleSave).not.toHaveBeenCalled();
  });

  it("submits valid form data on Create", async () => {
    const handleSave = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <CVDialog isOpen={true} onClose={handleClose} onSave={handleSave} />,
    );

    fireEvent.change(screen.getByLabelText(/cv name/i), {
      target: { value: "Full Stack Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/education/i), {
      target: { value: "BS Computer Science" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: {
        value: "Experienced engineer with React and Node.js expertise.",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /create cv/i }));

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith({
        name: "Full Stack Engineer",
        education: "BS Computer Science",
        description: "Experienced engineer with React and Node.js expertise.",
        id: undefined,
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("renders Update CV dialog and pre-populates fields with initialData", () => {
    const initialData = {
      id: "cv-456",
      name: "Lead Frontend Engineer",
      education: "MS Software Engineering",
      description: "Proven leader in Next.js development.",
    };

    render(
      <CVDialog
        isOpen={true}
        onClose={vi.fn()}
        onSave={vi.fn()}
        initialData={initialData}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /update cv/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Lead Frontend Engineer"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("MS Software Engineering"),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Proven leader in Next.js development."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked in edit mode", async () => {
    const handleDelete = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <CVDialog
        isOpen={true}
        onClose={handleClose}
        onSave={vi.fn()}
        onDelete={handleDelete}
        initialData={{
          id: "cv-789",
          name: "DevOps Engineer",
          description: "Kubernetes expert",
        }}
      />,
    );

    const deleteBtn = screen.getByRole("button", { name: /delete cv/i });
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledWith("cv-789", "DevOps Engineer");
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel or close button is clicked", () => {
    const handleClose = vi.fn();
    render(<CVDialog isOpen={true} onClose={handleClose} onSave={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText(/close dialog/i));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
