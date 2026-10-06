import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UnsupportedDeviceView } from "./UnsupportedDeviceView";

describe("UnsupportedDeviceView Component", () => {
  it("renders Oops title and description without any buttons", () => {
    render(<UnsupportedDeviceView />);

    expect(
      screen.getByRole("region", { name: /unsupported device/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Oops")).toBeInTheDocument();
    expect(
      screen.getByText(/Device is not supported/i),
    ).toBeInTheDocument();

    // Verify it contains no buttons per design specification
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
