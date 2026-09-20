"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  MoreVertical,
  User as UserIcon,
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { UsersDocument } from "@/graphql/__generated__/graphql";
import { cn } from "@/lib/utils";

export interface UserItem {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  department?: string | null;
  position?: string | null;
  avatar?: string | null;
}

const FIGMA_MOCK_USERS: UserItem[] = [
  {
    id: "1",
    first_name: "Rostislav",
    last_name: "Harlanov",
    email: "thorn_pear@icloud.com",
    department: "React",
    position: "Software Engineer",
    avatar: null,
  },
  {
    id: "2",
    first_name: "Vanf",
    last_name: "Darkholme",
    email: "tomgar9@outlook.com",
    department: ".NET",
    position: "Network Engineer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    first_name: "Christopher",
    last_name: "Nolan",
    email: "christophernolan@gmail.com",
    department: "Blockchain",
    position: "DevOps Engineer",
    avatar: null,
  },
  {
    id: "4",
    first_name: "Марина",
    last_name: "",
    email: "persempre1+1@yandex.ru",
    department: "DevOps",
    position: "Data Analyst",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    first_name: "Maksim",
    last_name: "Hancharou",
    email: "maxim.goncharov@gmail.com",
    department: "Global",
    position: "Data Analyst",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    first_name: "Artem",
    last_name: "Lopatin",
    email: "artsem.lapatsin@innowise.com",
    department: "Global",
    position: "Project Manager",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
];

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

  const rawUsers: UserItem[] = useMemo(() => {
    if (data?.users?.items && data.users.items.length > 0) {
      return data.users.items.map((u) => ({
        id: u.id,
        first_name: u.profile?.first_name || null,
        last_name: u.profile?.last_name || null,
        email: u.email,
        department: u.department?.name || null,
        position: u.position?.name || null,
        avatar: u.profile?.avatar || null,
      }));
    }
    return FIGMA_MOCK_USERS;
  }, [data]);

  const filteredUsers = useMemo(() => {
    let result = [...rawUsers];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((user) => {
        const fn = (user.first_name || "").toLowerCase();
        const ln = (user.last_name || "").toLowerCase();
        const em = user.email.toLowerCase();
        const dep = (user.department || "").toLowerCase();
        const pos = (user.position || "").toLowerCase();
        return (
          fn.includes(q) ||
          ln.includes(q) ||
          em.includes(q) ||
          dep.includes(q) ||
          pos.includes(q)
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
    <div className="w-full max-w-[1238px] mx-auto space-y-6">
      {/* Top Header / Breadcrumb matching Figma: height 56px, background #F5F5F7 */}
      <div className="h-14 bg-[#F5F5F7] dark:bg-zinc-900 rounded-md px-6 flex items-center">
        <span className="font-roboto text-[16px] leading-[24px] tracking-[0.15px] capitalize text-[#626262] dark:text-zinc-400">
          Employees
        </span>
      </div>

      {/* Search Input matching Figma: height 40px, rounded 40px, border #AEAEAE, placeholder #C4C4C6 */}
      <div className="px-1">
        <div className="relative w-full max-w-[388px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#626262] dark:text-zinc-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-[40px] border border-[#AEAEAE] dark:border-zinc-700 bg-transparent text-[16px] leading-[23px] text-[#2E2E2E] dark:text-zinc-100 placeholder:text-[#C4C4C6] focus:outline-hidden focus:border-[#2E2E2E] dark:focus:border-zinc-400 transition-colors"
            aria-label="Search employees"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-x-auto">
        <table className="w-full border-collapse text-left">
          {/* Header Row: height 58px, font 500 14px #2E2E2E */}
          <thead>
            <tr className="h-[58px] border-b border-zinc-200 dark:border-zinc-800 bg-transparent">
              {/* Avatar column */}
              <th className="w-[72px] px-4" aria-label="Avatar" />

              {/* First Name */}
              <th className="px-4 text-[14px] font-medium leading-[24px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("first_name")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>First Name</span>
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </th>

              {/* Last Name */}
              <th className="px-4 text-[14px] font-medium leading-[24px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("last_name")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Last Name</span>
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </th>

              {/* Email */}
              <th className="px-4 text-[14px] font-medium leading-[24px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("email")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Email</span>
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </th>

              {/* Department */}
              <th className="px-4 text-[14px] font-medium leading-[24px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("department")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Department</span>
                  <ChevronDown className="h-4 w-4 text-[#626262]" />
                </button>
              </th>

              {/* Position */}
              <th className="px-4 text-[14px] font-medium leading-[24px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSort("position")}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors focus:outline-hidden"
                >
                  <span>Position</span>
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </th>

              {/* Action column */}
              <th className="w-[72px] px-4" aria-label="Actions" />
            </tr>
          </thead>

          {/* Body Rows: height 73px, text 14px 400 #2E2E2E */}
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading && filteredUsers.length === 0 ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="h-[73px] animate-pulse">
                  <td className="px-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4">
                    <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </td>
                  <td className="px-4 text-right">
                    <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 ml-auto" />
                  </td>
                </tr>
              ))
            ) : filteredUsers.length === 0 ? (
              // Empty search state
              <tr>
                <td
                  colSpan={7}
                  className="h-48 text-center text-[#626262] dark:text-zinc-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UserIcon className="h-8 w-8 text-zinc-400" />
                    <p className="font-roboto text-[16px]">
                      No employees found matching &quot;{search}&quot;
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="h-[73px] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  {/* Avatar: 40px circle, background #AEAEAE or image, letter 20px #F5F5F7 */}
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
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#AEAEAE] text-[#F5F5F7]"
                        aria-hidden="true"
                      >
                        <span className="font-roboto text-[20px] font-normal leading-[20px] uppercase">
                          {getInitial(user)}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* First Name */}
                  <td className="px-4 font-roboto text-[14px] leading-[20px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                    {user.first_name || "—"}
                  </td>

                  {/* Last Name */}
                  <td className="px-4 font-roboto text-[14px] leading-[20px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                    {user.last_name || "—"}
                  </td>

                  {/* Email */}
                  <td className="px-4 font-roboto text-[14px] leading-[20px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100 truncate max-w-[280px]">
                    {user.email}
                  </td>

                  {/* Department */}
                  <td className="px-4 font-roboto text-[14px] leading-[20px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                    {user.department || "—"}
                  </td>

                  {/* Position */}
                  <td className="px-4 font-roboto text-[14px] leading-[20px] tracking-[0.15px] text-[#2E2E2E] dark:text-zinc-100">
                    {user.position || "—"}
                  </td>

                  {/* Action button matching Figma: 40px circle */}
                  <td className="px-4 text-right">
                    <Link
                      href={`/users/${user.id}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#626262] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="View employee profile"
                      aria-label={`View profile of ${user.first_name || user.email}`}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Link>
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
