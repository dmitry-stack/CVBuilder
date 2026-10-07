import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea component", () => {
  it("renders correctly with placeholder", () => {
    render(<Textarea placeholder="Enter description" />);
    const textarea = screen.getByPlaceholderText("Enter description");
    expect(textarea).toBeInTheDocument();
  });

  it("handles user typing and change events", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Textarea placeholder="Type here" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText("Type here");
    await user.type(textarea, "Hello world description");

    expect(textarea).toHaveValue("Hello world description");
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies disabled attributes and styling classes", () => {
    render(<Textarea placeholder="Disabled area" disabled />);
    const textarea = screen.getByPlaceholderText("Disabled area");
    expect(textarea).toBeDisabled();
  });

  it("forwards ref to the underlying textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("renders floating label and error message in invalid state", () => {
    render(
      <Textarea
        label="Description"
        placeholder="Enter description"
        error="Description is required"
      />,
    );
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Description is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows label when focused or with value", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Project Details" placeholder="Type details" />);

    expect(screen.queryByText("Project Details")).not.toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("Type details");
    await user.click(textarea);

    expect(screen.getByText("Project Details")).toBeInTheDocument();
  });
});
