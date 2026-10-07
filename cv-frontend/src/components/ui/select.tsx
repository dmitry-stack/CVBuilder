"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  error?: string | React.ReactNode;
  disabled?: boolean;
  alwaysShowLabel?: boolean;
  className?: string;
  containerClassName?: string;
  menuClassName?: string;
  "aria-invalid"?: boolean | "true" | "false";
}

export function Select({
  id,
  name,
  label,
  placeholder = "Select an option",
  value,
  defaultValue,
  options,
  onChange,
  error,
  disabled = false,
  alwaysShowLabel = false,
  className,
  containerClassName,
  menuClassName,
  "aria-invalid": ariaInvalid,
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = React.useState(false);
  const [openUpward, setOpenUpward] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue || "");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listboxRef = React.useRef<HTMLUListElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const isInvalid = ariaInvalid === "true" || ariaInvalid === true || Boolean(error);
  const showTopLabel = Boolean(
    label && (alwaysShowLabel || isOpen || Boolean(selectedValue) || disabled || isInvalid),
  );

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < 220 && spaceAbove > spaceBelow);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && listboxRef.current) {
      const selectedEl = listboxRef.current.querySelector<HTMLElement>('[aria-selected="true"]');
      if (selectedEl && typeof selectedEl.scrollIntoView === "function") {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    if (value === undefined) setInternalValue(optionValue);
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full text-left", containerClassName)}>
      {label && showTopLabel && (
        <label
          htmlFor={selectId}
          className={cn(
            "block text-xs font-roboto mb-1 transition-colors",
            isInvalid ? "text-[#C63031]" : disabled ? "text-[#8E8E93]" : "text-cv-text dark:text-[#F5F5F7]",
          )}
        >
          {label}
        </label>
      )}

      {name && <input type="hidden" name={name} value={selectedValue} disabled={disabled} />}

      <button
        id={selectId}
        type="button"
        role="combobox"
        value={selectedValue}
        aria-label={label}
        aria-controls={`${selectId}-listbox`}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-invalid={isInvalid ? "true" : undefined}
        className={cn(
          "flex h-12 w-full items-center justify-between border bg-transparent px-3 font-roboto text-sm sm:text-base leading-5 tracking-cv transition-colors outline-none",
          "border-[#C4C4C6] dark:border-[#424242] hover:border-[#8E8E93] dark:hover:border-[#8E8E93]",
          isOpen ? "border-[#1C1C1E] dark:border-[#F5F5F7]" : "focus:border-[#1C1C1E] dark:focus:border-[#F5F5F7]",
          "text-cv-text dark:text-[#F5F5F7]",
          "disabled:bg-[#D1D1D6] dark:disabled:bg-[#424242] disabled:text-[#8E8E93] dark:disabled:text-[#8E8E93] disabled:border-transparent dark:disabled:border-transparent disabled:cursor-not-allowed",
          isInvalid && "border-[#C63031]! dark:border-[#C63031]! focus:border-[#C63031]! dark:focus:border-[#C63031]!",
          className,
        )}
      >
        <span className={cn("truncate", !selectedOption && (disabled ? "text-[#8E8E93]" : "text-[#C4C4C6] dark:text-[#626262]"))}>
          {selectedOption ? selectedOption.label : (showTopLabel ? placeholder : (placeholder || label))}
        </span>
        <span className={cn("ml-2 shrink-0 transition-colors", isInvalid ? "text-[#C63031]" : disabled ? "text-[#8E8E93]" : "text-cv-muted dark:text-[#8E8E93]")}>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          id={`${selectId}-listbox`}
          role="listbox"
          className={cn(
            "absolute left-0 z-50 max-h-48 w-full overflow-y-auto select-scrollbar border border-[#1C1C1E] bg-white shadow-lg outline-none dark:border-[#F5F5F7] dark:bg-[#1C1C1E]",
            openUpward ? "bottom-full mb-1" : "top-full mt-1",
            menuClassName,
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => !option.disabled && handleSelect(option.value)}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-2.5 font-roboto text-sm transition-colors",
                  isSelected
                    ? "bg-[#626262] text-white dark:bg-[#F5F5F7] dark:text-[#1C1C1E]"
                    : "text-cv-text hover:bg-[#BDBDBD] dark:text-[#F5F5F7] dark:hover:bg-[#555555]",
                  option.disabled && "cursor-not-allowed opacity-50",
                )}
              >
                <span>{option.label}</span>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="mt-1 text-xs text-[#C63031] font-roboto">{error}</p>}
    </div>
  );
}
