import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToastContent, ToastCloseButton, notify } from "./toast";
import { toast as reactToast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("Toast Component & Notify Helpers", () => {
  it("renders ToastContent with title and description", () => {
    render(
      <ToastContent
        title="Profile Updated"
        description="Your profile was saved successfully"
      />,
    );

    expect(screen.getByText("Profile Updated")).toBeInTheDocument();
    expect(
      screen.getByText("Your profile was saved successfully"),
    ).toBeInTheDocument();
  });

  it("calls closeToast when ToastCloseButton is clicked", () => {
    const handleClose = vi.fn();
    render(<ToastCloseButton closeToast={handleClose} />);

    const closeBtn = screen.getByRole("button", {
      name: /close notification/i,
    });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("calls reactToast.success on notify.success", () => {
    notify.success("All changes saved", "Success");
    expect(reactToast.success).toHaveBeenCalled();
  });

  it("calls reactToast.error on notify.error", () => {
    notify.error("Failed to save", "Error");
    expect(reactToast.error).toHaveBeenCalled();
  });

  it("calls reactToast.warning on notify.warning", () => {
    notify.warning("Check inputs", "Warning");
    expect(reactToast.warning).toHaveBeenCalled();
  });

  it("calls reactToast.info on notify.info", () => {
    notify.info("Update available", "Info");
    expect(reactToast.info).toHaveBeenCalled();
  });
});
