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
});
