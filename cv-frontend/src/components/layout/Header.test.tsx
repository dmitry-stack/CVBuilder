import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "./Header";
import { HeaderProvider, HeaderSync } from "./HeaderContext";

let mockPathname = "/users";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

describe("Header Component (Common Layout Header)", () => {
  beforeEach(() => {
    mockPathname = "/users";
  });

  it("renders 'Employees' header when on /users route", () => {
    mockPathname = "/users";
    render(
      <HeaderProvider>
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("Employees")).toBeInTheDocument();
  });

  it("renders breadcrumbs when on /users/:id route", () => {
    mockPathname = "/users/1";
    render(
      <HeaderProvider>
        <HeaderSync userName="Rostislav Harlanov" />
        <Header />
      </HeaderProvider>,
    );

    const employeesLink = screen.getByRole("link", { name: "Employees" });
    expect(employeesLink).toBeInTheDocument();
    expect(employeesLink).toHaveAttribute("href", "/users");
    expect(screen.getByText("Rostislav Harlanov")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders sub-route title in breadcrumbs when on /users/:id/skills route", () => {
    mockPathname = "/users/1/skills";
    render(
      <HeaderProvider>
        <HeaderSync userName="Rostislav Harlanov" />
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("Skills")).toBeInTheDocument();
  });

  it("renders 'Skills' title on /skills route", () => {
    mockPathname = "/skills";
    render(
      <HeaderProvider>
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("Skills")).toBeInTheDocument();
  });

  it("renders 'Languages' title on /languages route", () => {
    mockPathname = "/languages";
    render(
      <HeaderProvider>
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("Languages")).toBeInTheDocument();
  });

  it("renders 'CVs' title on /cvs route", () => {
    mockPathname = "/cvs";
    render(
      <HeaderProvider>
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("CVs")).toBeInTheDocument();
  });
});
