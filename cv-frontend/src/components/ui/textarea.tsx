"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | React.ReactNode;
  alwaysShowLabel?: boolean;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      alwaysShowLabel = false,
      disabled,
      placeholder,
      id,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasInternalValue, setHasInternalValue] = React.useState(
      Boolean(defaultValue || value),
    );

    const isInvalid =
      ariaInvalid === "true" || ariaInvalid === true || Boolean(error);
    const hasValue =
      value !== undefined ? Boolean(value) : hasInternalValue;
    const showTopLabel = Boolean(
      label && (alwaysShowLabel || isFocused || hasValue || disabled || isInvalid),
    );

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasInternalValue(Boolean(e.target.value));
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasInternalValue(Boolean(e.target.value));
      onChange?.(e);
    };

    const textareaElement = (
      <textarea
        ref={ref}
        id={textareaId}
        disabled={disabled}
        placeholder={showTopLabel ? placeholder : (placeholder || label)}
        aria-invalid={isInvalid ? "true" : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
        className={cn(
          "block min-h-24 w-full border bg-transparent p-3 font-roboto text-sm sm:text-base leading-5 tracking-cv transition-colors outline-none resize-y",
          "border-[#C4C4C6] dark:border-[#424242]",
          "hover:border-[#8E8E93] dark:hover:border-[#8E8E93]",
          "focus:border-[#1C1C1E] dark:focus:border-[#F5F5F7] focus:ring-0 focus-visible:ring-0",
          "text-cv-text dark:text-[#F5F5F7]",
          "placeholder:text-[#C4C4C6] dark:placeholder:text-[#626262]",
          "disabled:bg-[#D1D1D6] dark:disabled:bg-[#424242] disabled:text-[#8E8E93] dark:disabled:text-[#8E8E93] disabled:border-transparent dark:disabled:border-transparent disabled:cursor-not-allowed",
          isInvalid &&
            "border-[#C63031]! dark:border-[#C63031]! focus:border-[#C63031]! dark:focus:border-[#C63031]!",
          className,
        )}
        {...props}
      />
    );

    if (!label && !error && !containerClassName) {
      return textareaElement;
    }

    return (
      <div className={cn("w-full text-left", containerClassName)}>
        {label && showTopLabel && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-xs font-roboto mb-1 transition-colors",
              isInvalid
                ? "text-[#C63031]"
                : disabled
                  ? "text-[#8E8E93] dark:text-[#8E8E93]"
                  : "text-cv-text dark:text-[#F5F5F7]",
            )}
          >
            {label}
          </label>
        )}
        {textareaElement}
        {error && (
          <p className="mt-1 text-xs text-[#C63031] font-roboto">{error}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
