"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { X, ChevronDown } from "lucide-react";

interface CVProjectEnvironmentInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

const COMMON_ENV_TAGS = [
  "HTML5",
  "CSS3",
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Zustand",
  "Redux",
  "Firebase",
  "Node.js",
  "NestJS",
  "PostgreSQL",
  "Docker",
  "AWS",
  "GraphQL",
  "TailwindCSS",
];

export function CVProjectEnvironmentInput({
  tags,
  onChange,
  disabled = false,
}: CVProjectEnvironmentInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const addTag = (newTag: string) => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    if (!tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={() => inputRef.current?.focus()}
        className="w-full min-h-11 px-3 py-1.5 rounded-[4px] bg-[#E2E2E4] dark:bg-zinc-800 flex items-center justify-between gap-2 flex-wrap cursor-text"
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full border border-zinc-400/70 dark:border-zinc-500 text-xs font-normal text-zinc-700 dark:text-zinc-200 bg-transparent select-none"
            >
              <span>{tag}</span>
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer ml-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
          {!disabled && (
            <input
              ref={inputRef}
              type="text"
              aria-label="Add environment tag"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (inputValue.trim()) addTag(inputValue);
              }}
              placeholder={tags.length === 0 ? "Add environment tag..." : ""}
              className="outline-hidden text-xs text-zinc-800 dark:text-zinc-200 bg-transparent min-w-[80px] flex-1 py-1"
            />
          )}
        </div>

        {!disabled && (
          <button
            type="button"
            aria-label="Toggle environment suggestions"
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="p-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer shrink-0"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {isDropdownOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5 px-1">
            Suggested tags
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_ENV_TAGS.map((env) => {
              const isSelected = tags.some(
                (t) => t.toLowerCase() === env.toLowerCase(),
              );
              return (
                <button
                  key={env}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      removeTag(env);
                    } else {
                      addTag(env);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs font-normal transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border-zinc-400 dark:border-zinc-500 font-medium"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {env} {isSelected ? "✓" : "+"}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
