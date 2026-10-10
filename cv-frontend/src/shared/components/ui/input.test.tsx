import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./input";

describe("Input component", () => {
  it("renders correctly with placeholder and type", () => {
    render(<Input type="email" placeholder="Enter your email" />);
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  it("handles user typing and change events", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input placeholder="Type here" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "hello");

    expect(input).toHaveValue("hello");
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies disabled attributes and styling classes", () => {
    render(<Input placeholder="Disabled input" disabled />);
    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
  });

  it("forwards ref to the underlying input element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("accepts custom className and combines them", () => {
    render(<Input placeholder="Custom class" className="custom-test-class" />);
    const input = screen.getByPlaceholderText("Custom class");
    expect(input).toHaveClass("custom-test-class");
  });

  it("supports aria-invalid attribute", () => {
    render(<Input placeholder="Invalid field" aria-invalid="true" />);
    const input = screen.getByPlaceholderText("Invalid field");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("renders floating label and error message in invalid state", () => {
    render(
      <Input
        label="Full Name"
        placeholder="Enter name"
        error="Name is required"
      />,
    );
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("toggles password visibility when password button is clicked", async () => {
    const user = userEvent.setup();
    render(<Input type="password" placeholder="Password" label="Password" />);

    const toggleButton = screen.getByRole("button", {
      name: /show password/i,
    });
    expect(toggleButton).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide password/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("shows label when input has value or is focused", async () => {
    const user = userEvent.setup();
    render(<Input label="Username" placeholder="Enter username" />);

    // Initially when empty & unfocused, label is hidden above
    expect(screen.queryByText("Username")).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText("Enter username");
    await user.click(input);

    // Now focused, label appears
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("does not render password toggle button when showPasswordToggle is false", () => {
    render(
      <Input
        type="password"
        placeholder="Password"
        showPasswordToggle={false}
      />,
    );
    expect(
      screen.queryByRole("button", { name: /show password|hide password/i }),
    ).not.toBeInTheDocument();
  });
});
