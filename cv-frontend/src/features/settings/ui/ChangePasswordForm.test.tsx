import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChangePasswordForm } from "./ChangePasswordForm";

describe("ChangePasswordForm Component", () => {
  it("renders all three password input fields with placeholders", () => {
    render(<ChangePasswordForm />);

    expect(screen.getByPlaceholderText("Current Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("renders CHANGE PASSWORD and CANCEL buttons", () => {
    render(<ChangePasswordForm />);

    expect(
      screen.getByRole("button", { name: /change password/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("toggles password visibility between password and text types", () => {
    render(<ChangePasswordForm />);

    const currentPasswordInput =
      screen.getByPlaceholderText("Current Password");
    expect(currentPasswordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", {
      name: /show current password/i,
    });
    fireEvent.click(toggleBtn);

    expect(currentPasswordInput).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", { name: /hide current password/i }),
    );
    expect(currentPasswordInput).toHaveAttribute("type", "password");
  });

  it("resets input values when clicking CANCEL", () => {
    render(<ChangePasswordForm />);

    const currentInput = screen.getByPlaceholderText("Current Password");
    const newInput = screen.getByPlaceholderText("New Password");
    const confirmInput = screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(currentInput, { target: { value: "oldsecret123" } });
    fireEvent.change(newInput, { target: { value: "newsecret456" } });
    fireEvent.change(confirmInput, { target: { value: "newsecret456" } });

    expect(currentInput).toHaveValue("oldsecret123");
    expect(newInput).toHaveValue("newsecret456");
    expect(confirmInput).toHaveValue("newsecret456");

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(currentInput).toHaveValue("");
    expect(newInput).toHaveValue("");
    expect(confirmInput).toHaveValue("");
  });
});
