import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MultiSelect } from "./multi-select";

const testOptions = [
  { value: "se1", label: "Software Engineer 1" },
  { value: "se2", label: "Software Engineer 2" },
  { value: "se3", label: "Software Engineer 3" },
];

describe("MultiSelect component", () => {
  it("renders with placeholder and opens options list on click", async () => {
    const user = userEvent.setup();
    render(<MultiSelect placeholder="Position" options={testOptions} />);

    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer 1")).toBeInTheDocument();
  });

  it("selects multiple items and renders pills with remove buttons", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        placeholder="Position"
        options={testOptions}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Software Engineer 1"));

    expect(handleChange).toHaveBeenCalledWith(["se1"]);
  });

  it("removes selected pill on x click", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <MultiSelect
        placeholder="Position"
        values={["se1", "se2"]}
        options={testOptions}
        onChange={handleChange}
      />,
    );

    expect(screen.getByText("Software Engineer 1")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer 2")).toBeInTheDocument();

    const removeBtn = screen.getByRole("button", {
      name: /remove software engineer 1/i,
    });
    await user.click(removeBtn);

    expect(handleChange).toHaveBeenCalledWith(["se2"]);
  });

  it("renders floating label and error message when invalid", () => {
    render(
      <MultiSelect
        label="Position"
        placeholder="Select positions"
        options={testOptions}
        error="Position is required"
      />,
    );

    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Position is required")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });
});
