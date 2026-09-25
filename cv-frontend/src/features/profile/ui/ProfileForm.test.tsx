import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useQuery } from "@apollo/client/react";
import { ProfileForm, type UserProfileData } from "./ProfileForm";

vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn().mockReturnValue({
    data: null,
    loading: false,
    error: null,
  }),
  useMutation: vi
    .fn()
    .mockReturnValue([vi.fn().mockResolvedValue({}), { loading: false }]),
}));

vi.mock("@/components/layout/HeaderContext", () => ({
  HeaderSync: () => null,
}));

vi.mock("@/features/auth/hooks/useCurrentUser", () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    currentUser: { id: "1" },
    currentUserId: "1",
    isOwnProfile: (id?: string) => id === "1",
    loading: false,
  }),
}));

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

  it("renders read-only inputs and hides save/cancel actions when viewing another user's profile", () => {
    render(<ProfileForm initialData={mockUser} isOwner={false} />);

    expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    expect(screen.getByLabelText(/last name/i)).toBeDisabled();
    expect(screen.getByLabelText(/department/i)).toBeDisabled();
    expect(screen.getByLabelText(/position/i)).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: /save/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("renders ProfileSkeleton while profile data is loading", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);

    const { container } = render(<ProfileForm userId="1" />);
    expect(
      container.querySelector('[data-slot="profile-skeleton"]'),
    ).toBeInTheDocument();

    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);
  });
});
