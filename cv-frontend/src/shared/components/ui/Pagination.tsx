"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export interface PaginationProps {
  totalPages: number;
  currentPage?: number;
  currentLimit: number;
  changePageLimit: (limit: number) => void;
}

export function Pagination({
  totalPages,
  currentPage: controlledPage,
  currentLimit,
  changePageLimit,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryPage = Number(searchParams?.get("page")) || 1;
  const safeTotalPages = Math.max(1, totalPages);
  const rawCurrentPage = controlledPage ?? queryPage;
  const currentPage = Math.min(Math.max(1, rawCurrentPage), safeTotalPages);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(
      searchParams ? searchParams.toString() : "",
    );
    params.delete("search");
    params.set("page", pageNumber.toString());
    return `${pathname || ""}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 2) {
      return [1, 2, "...", safeTotalPages];
    }
    if (currentPage >= safeTotalPages - 1) {
      return [1, "...", safeTotalPages - 1, safeTotalPages];
    }
    return [1, "...", currentPage, "...", safeTotalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-4">
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className="flex size-9 items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="size-5" />
          </Link>
        ) : (
          <span
            className="flex size-9 items-center justify-center text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
            aria-disabled="true"
            aria-label="Previous page disabled"
          >
            <ChevronLeft className="size-5" />
          </span>
        )}

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex size-9 items-center justify-center text-sm text-zinc-500 dark:text-zinc-400 select-none"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = currentPage === pageNum;

          return (
            <Link
              key={pageNum}
              href={createPageURL(pageNum)}
              className={cn(
                "flex size-9 items-center justify-center rounded-full border text-sm transition-colors",
                isActive
                  ? "border-zinc-400 dark:border-zinc-500 text-zinc-900 dark:text-zinc-100 font-medium"
                  : "border-zinc-300 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-300",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </Link>
          );
        })}

        {currentPage < safeTotalPages ? (
          <Link
            href={createPageURL(currentPage + 1)}
            className="flex size-9 items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="size-5" />
          </Link>
        ) : (
          <span
            className="flex size-9 items-center justify-center text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
            aria-disabled="true"
            aria-label="Next page disabled"
          >
            <ChevronRight className="size-5" />
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-9 min-w-16 items-center justify-between gap-3 rounded-[2px] border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 text-sm text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 cursor-pointer transition-colors"
          aria-label={`Rows per page: ${currentLimit}`}
        >
          <span>{currentLimit}</span>
          <ChevronDown className="size-4 text-zinc-600 dark:text-zinc-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {[10, 25, 50].map((limit) => (
            <DropdownMenuItem
              key={limit}
              onClick={() => changePageLimit(limit)}
              className={cn(currentLimit === limit && "font-bold text-primary")}
            >
              {limit}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Pagination;
