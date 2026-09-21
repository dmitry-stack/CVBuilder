import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DropdownMenuButton } from "./DropDownButton";

describe("DropdownMenuButton", () => {
  it("renders trigger button and opens menu with valid view link", async () => {
    render(<DropdownMenuButton userId="user-123" />);

    const trigger = screen.getByRole("button", {
      name: /actions for user user-123/i,
    });
    expect(trigger).toBeInTheDocument();

    fireEvent.click(trigger);

    const viewLink = await screen.findByRole("menuitem", { name: /view/i });
    expect(viewLink).toBeInTheDocument();
    expect(viewLink).toHaveAttribute("href", "/users/user-123");
  });
});
