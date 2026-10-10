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
  useApolloClient: vi.fn().mockReturnValue({
    readQuery: vi.fn(),
    writeQuery: vi.fn(),
  }),
}));

vi.mock("@/shared/components/layout/HeaderContext", () => ({
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

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/features/auth/actions/send-verification.action", () => ({
  sendVerificationAction: vi.fn().mockResolvedValue({ success: true }),
}));

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

  it("formats epoch millisecond timestamp string properly in member since date", () => {
    const userWithEpoch = {
      ...mockUser,
      created_at: "1705309639797",
    };
    render(<ProfileForm initialData={userWithEpoch} />);
    expect(screen.getByText(/Mon Jan 15 2024/i)).toBeInTheDocument();
  });

  it("displays email instead of name when first_name and last_name are empty", () => {
    const userWithoutName = {
      ...mockUser,
      first_name: "",
      last_name: "",
    };
    render(<ProfileForm initialData={userWithoutName} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "thorn_pear@icloud.com",
    );
  });

  it("renders Update button (disabled initially) and Verify Email button", () => {
    render(<ProfileForm initialData={mockUser} />);

    const updateButton = screen.getByRole("button", { name: /update/i });
    const verifyButton = screen.getByRole("button", { name: /verify email/i });

    expect(updateButton).toBeDisabled();
    expect(verifyButton).toBeEnabled();
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("enables Update button when form is edited", () => {
    render(<ProfileForm initialData={mockUser} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "UpdatedName" } });

    const updateButton = screen.getByRole("button", { name: /update/i });
    expect(updateButton).toBeEnabled();
  });

  it("triggers onVerifyEmail when Verify Email button is clicked", () => {
    const handleVerify = vi.fn();
    render(<ProfileForm initialData={mockUser} onVerifyEmail={handleVerify} />);

    const verifyButton = screen.getByRole("button", { name: /verify email/i });
    fireEvent.click(verifyButton);

    expect(handleVerify).toHaveBeenCalled();
  });

  it("calls onSave when form is submitted with valid data", async () => {
    const handleSave = vi.fn();
    render(<ProfileForm initialData={mockUser} onSave={handleSave} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    fireEvent.change(firstNameInput, { target: { value: "NewName" } });

    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(handleSave).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "NewName",
          last_name: "Harlanov",
        }),
      );
    });
  });

  it("renders read-only inputs and hides update/verify actions when viewing another user's profile", () => {
    render(<ProfileForm initialData={mockUser} isOwner={false} />);

    expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    expect(screen.getByLabelText(/last name/i)).toBeDisabled();
    expect(screen.getByLabelText(/department/i)).toBeDisabled();
    expect(screen.getByLabelText(/position/i)).toBeDisabled();

    expect(
      screen.queryByRole("button", { name: /update/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /verify email/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });

  it("renders ProfileSkeleton while profile data is loading", async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);

    const { container } = render(<ProfileForm userId="1" />);
    await waitFor(() => {
      expect(
        container.querySelector('[data-slot="profile-skeleton"]'),
      ).toBeInTheDocument();
    });

    vi.mocked(useQuery).mockReturnValue({
      data: null,
      loading: false,
      error: null,
    } as unknown as ReturnType<typeof useQuery>);
  });
});
