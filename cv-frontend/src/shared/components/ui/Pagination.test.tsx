import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Pagination from "./Pagination";

vi.mock("next/navigation", () => ({
  usePathname: () => "/users",
  useSearchParams: () => new URLSearchParams("page=1&limit=10"),
}));

describe("Pagination Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders rows per page dropdown and page numbers", () => {
    const handleChangeLimit = vi.fn();
    render(
      <Pagination
        totalPages={5}
        currentPage={1}
        currentLimit={10}
        changePageLimit={handleChangeLimit}
      />,
    );

    expect(
      screen.getByRole("button", { name: /rows per page: 10/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "5" })).toBeInTheDocument();
  });

  it("marks current page with aria-current='page'", () => {
    render(
      <Pagination
        totalPages={4}
        currentPage={2}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    const activePage = screen.getByRole("link", { name: "2" });
    expect(activePage).toHaveAttribute("aria-current", "page");

    const inactivePage = screen.getByRole("link", { name: "1" });
    expect(inactivePage).not.toHaveAttribute("aria-current");
  });

  it("disables Previous button on first page and enables Next button", () => {
    render(
      <Pagination
        totalPages={3}
        currentPage={1}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    expect(
      screen.getByLabelText(/previous page disabled/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /next page/i })).toHaveAttribute(
      "href",
      "/users?page=2&limit=10",
    );
  });

  it("enables Previous button and disables Next button on last page", () => {
    render(
      <Pagination
        totalPages={3}
        currentPage={3}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("link", { name: /previous page/i }),
    ).toHaveAttribute("href", "/users?page=2&limit=10");
    expect(screen.getByLabelText(/next page disabled/i)).toBeInTheDocument();
  });

  it("renders ellipsis when totalPages > 7", () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={1}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "10" })).toBeInTheDocument();
  });

  it("calls changePageLimit when dropdown option is clicked", () => {
    const handleChangeLimit = vi.fn();
    render(
      <Pagination
        totalPages={3}
        currentPage={1}
        currentLimit={10}
        changePageLimit={handleChangeLimit}
      />,
    );

    const trigger = screen.getByRole("button", { name: /rows per page: 10/i });
    fireEvent.click(trigger);

    const option25 = screen.getByText("25");
    fireEvent.click(option25);

    expect(handleChangeLimit).toHaveBeenCalledWith(25);
  });

  it("clamps currentPage to totalPages when currentPage exceeds totalPages", () => {
    render(
      <Pagination
        totalPages={2}
        currentPage={5}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    const activePage = screen.getByRole("link", { name: "2" });
    expect(activePage).toHaveAttribute("aria-current", "page");
  });

  it("handles totalPages of 0 gracefully by defaulting to page 1", () => {
    render(
      <Pagination
        totalPages={0}
        currentPage={1}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    const activePage = screen.getByRole("link", { name: "1" });
    expect(activePage).toHaveAttribute("aria-current", "page");
  });

  it("removes search parameter from generated page URLs", () => {
    render(
      <Pagination
        totalPages={3}
        currentPage={1}
        currentLimit={10}
        changePageLimit={vi.fn()}
      />,
    );

    const nextLink = screen.getByRole("link", { name: /next page/i });
    expect(nextLink.getAttribute("href")).not.toContain("search=");
  });
});
