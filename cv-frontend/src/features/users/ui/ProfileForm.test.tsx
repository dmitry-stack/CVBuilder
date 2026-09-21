import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfileForm, type UserProfileData } from "./ProfileForm";

const mockUser: UserProfileData = {
  id: "1",
  first_name: "Rostislav",
  last_name: "Harlanov",
  email: "thorn_pear@icloud.com",
  department: "React",
  position: "Software Engineer",
  role: "Employee",
  avatar: null,
  created_at: "2024-01-14T12:00:00.000Z",
};

describe("ProfileForm Component", () => {
  it("renders user information and form fields with initial data", () => {
    render(<ProfileForm initialData={mockUser} />);

    expect(screen.getByText("Rostislav Harlanov")).toBeInTheDocument();
    expect(screen.getByText("thorn_pear@icloud.com")).toBeInTheDocument();
    expect(screen.getByText(/a member since/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/first name/i)).toHaveValue("Rostislav");
    expect(screen.getByLabelText(/last name/i)).toHaveValue("Harlanov");
    expect(screen.getByLabelText(/department/i)).toHaveValue("React");
    expect(screen.getByLabelText(/position/i)).toHaveValue("Software Engineer");
  });

  it("renders Save and Cancel buttons, disabled initially when form is clean", () => {
    render(<ProfileForm initialData={mockUser} />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("enables buttons when form is edited", () => {
    render(<ProfileForm initialData={mockUser} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "UpdatedName" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    expect(saveButton).toBeEnabled();
    expect(cancelButton).toBeEnabled();
  });

  it("resets form when Cancel is clicked", () => {
    render(<ProfileForm initialData={mockUser} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "ChangedName" } });
    expect(firstNameInput).toHaveValue("ChangedName");

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(firstNameInput).toHaveValue("Rostislav");
    expect(cancelButton).toBeDisabled();
  });

  it("calls onSave when form is submitted with valid data", async () => {
    const handleSave = vi.fn();
    render(<ProfileForm initialData={mockUser} onSave={handleSave} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "NewName" } });

    const saveButton = screen.getByRole("button", { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "NewName",
          last_name: "Harlanov",
        }),
      );
    });
  });
});
