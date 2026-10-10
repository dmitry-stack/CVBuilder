"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SelectOption } from "./select";

export interface MultiSelectProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  values?: string[];
  defaultValues?: string[];
  options: SelectOption[];
  onChange?: (values: string[]) => void;
  error?: string | React.ReactNode;
  disabled?: boolean;
  alwaysShowLabel?: boolean;
  className?: string;
  containerClassName?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

export function MultiSelect({
  id,
  name,
  label,
  placeholder = "Select options",
  values,
  defaultValues,
  options,
  onChange,
  error,
  disabled = false,
  alwaysShowLabel = false,
  className,
  containerClassName,
  "aria-invalid": ariaInvalid,
}: MultiSelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = React.useState(false);
  const [openUpward, setOpenUpward] = React.useState(false);
  const [internalValues, setInternalValues] = React.useState(
    defaultValues || [],
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedValues = values !== undefined ? values : internalValues;
  const isInvalid =
    ariaInvalid === "true" || ariaInvalid === true || Boolean(error);
  const showTopLabel = Boolean(
    label &&
    (alwaysShowLabel ||
      isOpen ||
      selectedValues.length > 0 ||
      disabled ||
      isInvalid),
  );

  React.useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const { bottom, top } = containerRef.current.getBoundingClientRect();
    setOpenUpward(
      window.innerHeight - bottom < 220 && top > window.innerHeight - bottom,
    );
  }, [isOpen]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const toggleOption = (val: string) => {
    if (disabled) return;
    const next = selectedValues.includes(val)
      ? selectedValues.filter((i) => i !== val)
      : [...selectedValues, val];
    if (values === undefined) setInternalValues(next);
    onChange?.(next);
  };

  const removeOption = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    const next = selectedValues.filter((i) => i !== val);
    if (values === undefined) setInternalValues(next);
    onChange?.(next);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full text-left", containerClassName)}
    >
      {label && showTopLabel && (
        <label
          htmlFor={selectId}
          className={cn(
            "block text-xs font-roboto mb-1 transition-colors",
            isInvalid
              ? "text-[#C63031]"
              : disabled
                ? "text-[#8E8E93]"
                : "text-cv-text dark:text-[#F5F5F7]",
          )}
        >
          {label}
        </label>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(selectedValues)}
          disabled={disabled}
        />
      )}

      <div
        id={selectId}
        role="combobox"
        aria-controls={`${selectId}-listbox`}
        aria-expanded={isOpen}
        aria-invalid={isInvalid ? "true" : undefined}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          "flex min-h-12 w-full cursor-pointer items-center justify-between border bg-transparent p-2 font-roboto text-sm transition-colors",
          "border-[#C4C4C6] dark:border-[#424242] hover:border-[#8E8E93] dark:hover:border-[#8E8E93]",
          isOpen
            ? "border-[#1C1C1E] dark:border-[#F5F5F7]"
            : "focus-within:border-[#1C1C1E] dark:focus-within:border-[#F5F5F7]",
          disabled &&
            "bg-[#D1D1D6] dark:bg-[#424242] border-transparent cursor-not-allowed",
          isInvalid && "border-[#C63031]! dark:border-[#C63031]!",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 pr-2">
          {selectedValues.map((val) => {
            const opt = options.find((o) => o.value === val);
            const labelText = opt ? opt.label : val;
            return (
              <span
                key={val}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border border-[#C4C4C6] px-2.5 py-0.5 text-xs text-cv-text dark:border-[#555555] dark:text-[#F5F5F7]",
                  disabled && "opacity-70 border-transparent",
                )}
              >
                <span>{labelText}</span>
                {!disabled && (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={(e) => removeOption(val, e)}
                    className="hover:text-[#C63031] transition-colors"
                    aria-label={`Remove ${labelText}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            );
          })}
          {selectedValues.length === 0 && (
            <span
              className={cn(
                disabled
                  ? "text-[#8E8E93]"
                  : "text-[#C4C4C6] dark:text-[#626262]",
              )}
            >
              {showTopLabel ? placeholder : placeholder || label}
            </span>
          )}
        </div>

        <span
          className={cn(
            "ml-2 shrink-0 transition-colors",
            isInvalid
              ? "text-[#C63031]"
              : disabled
                ? "text-[#8E8E93]"
                : "text-cv-muted dark:text-[#8E8E93]",
          )}
        >
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </span>
      </div>

      {isOpen && (
        <ul
          id={`${selectId}-listbox`}
          role="listbox"
          className={cn(
            "absolute left-0 z-50 max-h-48 w-full overflow-y-auto select-scrollbar border border-[#1C1C1E] bg-white shadow-lg outline-none dark:border-[#F5F5F7] dark:bg-[#1C1C1E]",
            openUpward ? "bottom-full mb-1" : "top-full mt-1",
          )}
        >
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => !option.disabled && toggleOption(option.value)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 px-3 py-2.5 font-roboto text-sm transition-colors",
                  isSelected
                    ? "bg-[#626262] text-white dark:bg-[#F5F5F7] dark:text-[#1C1C1E]"
                    : "text-cv-text hover:bg-[#BDBDBD] dark:text-[#F5F5F7] dark:hover:bg-[#555555]",
                  option.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border transition-colors",
                    isSelected
                      ? "border-[#1C1C1E] bg-[#1C1C1E] text-white dark:border-white dark:bg-white dark:text-[#1C1C1E]"
                      : "border-[#626262] dark:border-[#8E8E93]",
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p className="mt-1 text-xs text-[#C63031] font-roboto">{error}</p>
      )}
    </div>
  );
}
