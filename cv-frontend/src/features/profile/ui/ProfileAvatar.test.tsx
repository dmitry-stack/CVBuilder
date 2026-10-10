import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileAvatar } from "./ProfileAvatar";

const mockUploadAvatar = vi.fn();
const mockDeleteAvatar = vi.fn();

vi.mock("../hooks/useAvatarUpload", () => ({
  useAvatarUpload: vi.fn(() => ({
    uploadAvatar: mockUploadAvatar,
    deleteAvatar: mockDeleteAvatar,
    isUploading: false,
    isDeleting: false,
  })),
}));

vi.mock("@/shared/components/ui/toast", () => ({
  notify: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ProfileAvatar Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user initial when no initialAvatar is provided", () => {
    render(<ProfileAvatar userName="Alice Bob" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders avatar image when initialAvatar is provided", () => {
    render(
      <ProfileAvatar
        initialAvatar="https://example.com/avatar.png"
        userName="Alice Bob"
      />,
    );
    const img = screen.getByRole("img", { name: "Alice Bob's avatar" });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("triggers file input when clicking 'Upload avatar image' button", () => {
    render(<ProfileAvatar userName="Alice" />);

    const uploadTextBtn = screen.getByRole("button", {
      name: /upload avatar image/i,
    });
    const fileInput = screen.getByLabelText(
      /upload profile photo/i,
    ) as HTMLInputElement;

    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.click(uploadTextBtn);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("triggers file input when clicking the circular avatar button", () => {
    render(<ProfileAvatar userName="Alice" />);

    const avatarBtn = screen.getByRole("button", {
      name: /change profile photo/i,
    });
    const fileInput = screen.getByLabelText(
      /upload profile photo/i,
    ) as HTMLInputElement;

    const clickSpy = vi.spyOn(fileInput, "click");
    fireEvent.click(avatarBtn);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("calls uploadAvatar and updates preview when a file is selected", async () => {
    mockUploadAvatar.mockResolvedValue("https://example.com/new-avatar.png");
    const onAvatarChange = vi.fn();

    render(
      <ProfileAvatar
        userId="user-1"
        userName="Alice"
        onAvatarChange={onAvatarChange}
      />,
    );

    const fileInput = screen.getByLabelText(
      /upload profile photo/i,
    ) as HTMLInputElement;
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });

    // Mock createObjectURL
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = vi.fn().mockReturnValue("blob:preview-url");

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadAvatar).toHaveBeenCalledWith(file);
      expect(onAvatarChange).toHaveBeenCalledWith(file);
    });

    URL.createObjectURL = originalCreateObjectURL;
  });

  it("calls deleteAvatar and clears preview when remove button is clicked", async () => {
    mockDeleteAvatar.mockResolvedValue(true);
    const onAvatarChange = vi.fn();

    render(
      <ProfileAvatar
        userId="user-1"
        initialAvatar="https://example.com/avatar.png"
        userName="Alice"
        onAvatarChange={onAvatarChange}
      />,
    );

    const removeBtn = screen.getByRole("button", { name: /remove photo/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(mockDeleteAvatar).toHaveBeenCalledTimes(1);
      expect(onAvatarChange).toHaveBeenCalledWith(null);
    });
  });

  it("renders non-editable mode without upload controls", () => {
    render(
      <ProfileAvatar
        initialAvatar="https://example.com/avatar.png"
        userName="Alice"
        editable={false}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /upload avatar image/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /change profile photo/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /remove photo/i }),
    ).not.toBeInTheDocument();
  });
});
