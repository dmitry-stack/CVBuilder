"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatePickerCalendar } from "./date-picker-calendar";

export interface DatePickerProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string | React.ReactNode;
  disabled?: boolean;
  alwaysShowLabel?: boolean;
  className?: string;
  containerClassName?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

function parseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length >= 3 && !parts.some(isNaN)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DatePicker({
  id,
  name,
  label,
  placeholder = "Select date",
  value,
  defaultValue,
  onChange,
  error,
  disabled = false,
  alwaysShowLabel = false,
  className,
  containerClassName,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const generatedId = React.useId();
  const datePickerId = id || generatedId;
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedStr = value !== undefined ? value : internalValue;
  const selectedDate = parseDate(selectedStr);
  const isInvalid =
    ariaInvalid === "true" || ariaInvalid === true || Boolean(error);
  const hasValue = Boolean(selectedStr);
  const showTopLabel = Boolean(
    label && (alwaysShowLabel || isOpen || hasValue || disabled || isInvalid),
  );

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectDate = (date: Date) => {
    const formatted = formatDate(date);
    if (value === undefined) {
      setInternalValue(formatted);
    }
    onChange?.(formatted);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full text-left", containerClassName)}
    >
      {label && showTopLabel && (
        <label
          htmlFor={datePickerId}
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
          value={selectedStr}
          disabled={disabled}
        />
      )}

      <button
        id={datePickerId}
        type="button"
        role="combobox"
        value={selectedStr}
        aria-controls={`${datePickerId}-dialog`}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={selectedStr || placeholder || label}
        aria-invalid={isInvalid ? "true" : undefined}
        className={cn(
          "flex h-12 w-full items-center justify-between border bg-transparent px-3 font-roboto text-sm sm:text-base leading-5 tracking-cv transition-colors outline-none",
          "border-[#C4C4C6] dark:border-[#424242]",
          "hover:border-[#8E8E93] dark:hover:border-[#8E8E93]",
          isOpen
            ? "border-[#1C1C1E] dark:border-[#F5F5F7]"
            : "focus:border-[#1C1C1E] dark:focus:border-[#F5F5F7]",
          "text-cv-text dark:text-[#F5F5F7]",
          "disabled:bg-[#D1D1D6] dark:disabled:bg-[#424242] disabled:text-[#8E8E93] dark:disabled:text-[#8E8E93] disabled:border-transparent dark:disabled:border-transparent disabled:cursor-not-allowed",
          isInvalid &&
            "border-[#C63031]! dark:border-[#C63031]! focus:border-[#C63031]!",
          className,
        )}
      >
        <span
          className={cn(
            "truncate",
            !selectedStr &&
              (disabled
                ? "text-[#8E8E93]"
                : "text-[#C4C4C6] dark:text-[#626262]"),
          )}
        >
          {selectedStr || (showTopLabel ? placeholder : (placeholder || label))}
        </span>

        <CalendarIcon
          className={cn(
            "ml-2 h-5 w-5 shrink-0 transition-colors",
            isInvalid
              ? "text-[#C63031]"
              : disabled
                ? "text-[#8E8E93]"
                : "text-cv-muted dark:text-[#8E8E93]",
          )}
        />
      </button>

      {isOpen && (
        <div id={`${datePickerId}-dialog`} className="absolute left-0 top-full z-50 mt-1">
          <DatePickerCalendar
            selectedDate={selectedDate}
            onSelect={handleSelectDate}
          />
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-[#C63031] font-roboto">{error}</p>
      )}
    </div>
  );
}
