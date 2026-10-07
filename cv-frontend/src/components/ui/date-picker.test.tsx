import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { DatePicker } from "./date-picker";

describe("DatePicker component", () => {
  it("renders trigger with placeholder", () => {
    render(<DatePicker placeholder="Select end date" />);
    expect(screen.getByText("Select end date")).toBeInTheDocument();
  });

  it("opens popover calendar on trigger click and switches views", async () => {
    const user = userEvent.setup();
    render(<DatePicker value="2025-04-15" />);

    const trigger = screen.getByRole("combobox", { name: /2025-04-15/i });
    await user.click(trigger);

    // Month and Year header buttons should be present
    const monthBtn = screen.getByRole("button", { name: "April" });
    const yearBtn = screen.getByRole("button", { name: "2025" });
    expect(monthBtn).toBeInTheDocument();
    expect(yearBtn).toBeInTheDocument();

    // Click Month button to switch to Months view
    await user.click(monthBtn);
    expect(screen.getByRole("button", { name: "September" })).toBeInTheDocument();

    // Click a month (e.g. September) to switch back to Days view
    await user.click(screen.getByRole("button", { name: "September" }));
    expect(screen.getByRole("button", { name: "September" })).toBeInTheDocument();

    // Click Year button to switch to Years view
    await user.click(screen.getByRole("button", { name: "2025" }));
    expect(screen.getByRole("button", { name: "2028" })).toBeInTheDocument();
  });

  it("selects a day and triggers onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<DatePicker value="2025-04-15" onChange={handleChange} />);

    const trigger = screen.getByRole("combobox", { name: /2025-04-15/i });
    await user.click(trigger);

    // Click day 20 in the current month
    const day20 = screen.getAllByRole("button", { name: "20" })[0];
    await user.click(day20);

    expect(handleChange).toHaveBeenCalledWith("2025-04-20");
  });

  it("renders floating label and error in invalid state", () => {
    render(
      <DatePicker
        label="End Date"
        placeholder="Select date"
        error="Date is required"
      />,
    );

    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("Date is required")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies disabled attributes and prevents interaction", async () => {
    const user = userEvent.setup();
    render(<DatePicker placeholder="Disabled date" disabled />);

    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDisabled();

    await user.click(combobox);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
