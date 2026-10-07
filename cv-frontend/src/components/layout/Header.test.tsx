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

  it("renders breadcrumb user skeleton when user name is loading", () => {
    mockPathname = "/users/2";
    const { container } = render(
      <HeaderProvider>
        <Header />
      </HeaderProvider>,
    );

    expect(
      container.querySelector('[data-slot="header-user-skeleton"]'),
    ).toBeInTheDocument();
  });

  it("renders breadcrumbs when on /cvs/:id/details route", () => {
    mockPathname = "/cvs/123/details";
    render(
      <HeaderProvider>
        <HeaderSync userName="Software Engineer With 5+ Years Of Experience" />
        <Header />
      </HeaderProvider>,
    );

    const cvsLink = screen.getByRole("link", { name: "CVs" });
    expect(cvsLink).toBeInTheDocument();
    expect(cvsLink).toHaveAttribute("href", "/cvs");
    expect(
      screen.getByText("Software Engineer With 5+ Years Of Experience"),
    ).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
  });

  it("renders breadcrumbs when on /cvs/:id/skills route", () => {
    mockPathname = "/cvs/123/skills";
    render(
      <HeaderProvider>
        <HeaderSync userName="Software Engineer With 5+ Years Of Experience" />
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("Skills")).toBeInTheDocument();
  });

  it("renders breadcrumb CV skeleton when CV name is loading", () => {
    mockPathname = "/cvs/123/details";
    const { container } = render(
      <HeaderProvider>
        <Header />
      </HeaderProvider>,
    );

    expect(
      container.querySelector('[data-slot="header-cv-skeleton"]'),
    ).toBeInTheDocument();
  });

  it("renders fallback when user name is empty", () => {
    mockPathname = "/users/2";
    render(
      <HeaderProvider>
        <HeaderSync userName="" />
        <Header />
      </HeaderProvider>,
    );

    expect(screen.getByText("Unknown Employee")).toBeInTheDocument();
  });
});
