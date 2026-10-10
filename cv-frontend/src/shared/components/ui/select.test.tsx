import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Select } from "./select";

const testOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular", disabled: true },
];

describe("Select component", () => {
  it("renders with placeholder and opens options list on click", async () => {
    const user = userEvent.setup();
    render(<Select placeholder="Choose framework" options={testOptions} />);

    expect(screen.getByText("Choose framework")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Vue")).toBeInTheDocument();
  });

  it("selects an option and invokes onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        placeholder="Choose framework"
        options={testOptions}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("React"));

    expect(handleChange).toHaveBeenCalledWith("react");
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("does not select disabled options", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <Select
        placeholder="Choose framework"
        options={testOptions}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Angular"));

    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("renders floating label and error message in invalid state", () => {
    render(
      <Select
        label="Position"
        placeholder="Select position"
        options={testOptions}
        error="Position is required"
      />,
    );

    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Position is required")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies disabled attributes and prevents opening", async () => {
    const user = userEvent.setup();
    render(
      <Select
        placeholder="Disabled select"
        options={testOptions}
        disabled
      />,
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDisabled();

    await user.click(combobox);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
