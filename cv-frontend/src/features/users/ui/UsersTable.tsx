"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

import { Search, ChevronDown, User as UserIcon } from "lucide-react";
import { useQuery } from "@apollo/client/react";
import {
  UsersDocument,
  type UsersQuery,
} from "@/graphql/__generated__/graphql";
import { UsersTableRowSkeleton } from "./UsersTableRowSkeleton";
import { DropdownMenuButton } from "../../../components/ui/DropDownButton";

export interface UserItem {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  department?: string | null;
  position?: string | null;
  avatar?: string | null;
}

type SortField =
  "first_name" | "last_name" | "email" | "department" | "position";
type SortOrder = "asc" | "desc";

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("first_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const { data, loading } = useQuery(UsersDocument, {
    variables: {
      params: {
        search: search || undefined,
        sort_by: sortField,
        sort_order: sortOrder,
        page: 1,
        limit: 50,
      },
    },
    errorPolicy: "ignore",
  });

  const rawUsers: UserItem[] | undefined = useMemo(() => {
    if (data?.users?.items && data.users.items.length > 0) {
      return data.users.items.map(
        (u: UsersQuery["users"]["items"][number]) => ({
          id: u.id,
          first_name: u.profile?.first_name || null,
          last_name: u.profile?.last_name || null,
          email: u.email,
          department: u.department?.name || null,
          position: u.position?.name || null,
          avatar: u.profile?.avatar || null,
        }),
      );
    }
  }, [data]);

  const filteredUsers = useMemo(() => {
    if (!rawUsers) return [];
    let result = [...rawUsers];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((user) => {
        const fn = (user.first_name || "").toLowerCase();
        const ln = (user.last_name || "").toLowerCase();

        const dep = (user.department || "").toLowerCase();
        const pos = (user.position || "").toLowerCase();
        return (
          fn.includes(q) || ln.includes(q) || dep.includes(q) || pos.includes(q)
        );
      });
    }

    result.sort((a, b) => {
      const valA = (a[sortField] || "").toLowerCase();
      const valB = (b[sortField] || "").toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [rawUsers, search, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getInitial = (user: UserItem) => {
    if (user.first_name) return user.first_name.charAt(0).toUpperCase();
    if (user.last_name) return user.last_name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="w-full max-w-content mx-auto space-y-6">
      <div className="px-1">
        <div className="relative w-full max-w-search">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-cv-muted dark:text-zinc-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-cv-border dark:border-zinc-700 bg-transparent text-base leading-cv-input text-cv-text dark:text-zinc-100 placeholder:text-cv-placeholder focus:outline-hidden focus:border-cv-text dark:focus:border-zinc-400 transition-colors"
            aria-label="Search employees"
          />
        </div>
      </div>

      <div className=" overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="h-table-header border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
              <th className="w-18 px-4" aria-label="Avatar" />

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("first_name")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>First Name</span>
                  <ChevronDown className="h-4 w-4 text-cv-muted" />
                </button>
              </th>

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("last_name")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Last Name</span>
                  <ChevronDown className="h-4 w-4 text-cv-muted" />
                </button>
              </th>

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"

                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Email</span>
                </button>
              </th>

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("department")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Department</span>
                  <ChevronDown className="h-4 w-4 text-cv-muted" />
                </button>
              </th>

              <th className="px-4 text-sm font-medium leading-6 tracking-cv text-cv-text dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("position")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Position</span>
                  <ChevronDown className="h-4 w-4 text-cv-muted" />
                </button>
              </th>

              <th className="w-18 px-4" aria-label="Actions" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <UsersTableRowSkeleton key={`skeleton-${idx}`} />
              ))
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-48 text-center text-cv-muted dark:text-zinc-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserIcon className="h-8 w-8 text-zinc-400" />
                    <p className="font-roboto text-base">
                      No employees found matching &quot;{search}&quot;
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="h-table-row hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4">
                    {user.avatar ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={user.avatar}
                          alt={`${user.first_name || ""} ${user.last_name || ""}`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cv-border text-cv-on-accent"
                        aria-hidden="true"
                      >
                        <span className="font-roboto text-xl font-normal leading-5 uppercase">
                          {getInitial(user)}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
                    {user.first_name || ""}
                  </td>

                  <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
                    {user.last_name || ""}
                  </td>

                  <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100 truncate max-w-email">
                    {user.email}
                  </td>

                  <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
                    {user.department || ""}
                  </td>

                  <td className="px-4 font-roboto text-sm leading-5 tracking-cv text-cv-text dark:text-zinc-100">
                    {user.position || ""}
                  </td>

                  <td className="px-4 text-right">
                    <DropdownMenuButton id={user.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
