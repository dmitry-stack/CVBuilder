"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

interface CVProjectRoleInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const COMMON_ROLES = [
  "Frontend Developer",
  "AI Developer",
  "Backend Developer",
  "Fullstack Engineer",
  "DevOps Engineer",
  "QA Engineer",
  "UI/UX Designer",
  "Mobile Developer",
  "Team Lead",
  "Project Manager",
];

export function CVProjectRoleInput({
  value,
  onChange,
  disabled = false,
}: CVProjectRoleInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const currentRoles = value
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r.length > 0);

  const toggleRole = (role: string) => {
    const exists = currentRoles.some(
      (r) => r.toLowerCase() === role.toLowerCase(),
    );
    let next: string[];
    if (exists) {
      next = currentRoles.filter((r) => r.toLowerCase() !== role.toLowerCase());
    } else {
      next = [...currentRoles, role];
    }
    onChange(next.join(", "));
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          id="p_roles"
          type="text"
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder="e.g. Frontend Developer, AI Developer"
          className="w-full h-10 px-3.5 pr-9 rounded-[4px] border border-[#AEAEAE] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-cv-accent placeholder:text-zinc-400"
        />
        {!disabled && (
          <button
            type="button"
            aria-label="Toggle role options"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {isDropdownOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 px-1">
            Suggested roles
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ROLES.map((role) => {
              const isSelected = currentRoles.some(
                (r) => r.toLowerCase() === role.toLowerCase(),
              );
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-2.5 py-1 rounded-full text-xs font-normal transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-500 font-medium"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {role} {isSelected ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
