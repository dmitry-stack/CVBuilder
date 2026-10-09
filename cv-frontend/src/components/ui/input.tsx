"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | React.ReactNode;
  showPasswordToggle?: boolean;
  alwaysShowLabel?: boolean;
  containerClassName?: string;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type = "text",
      label,
      error,
      showPasswordToggle,
      alwaysShowLabel = false,
      disabled,
      placeholder,
      id,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      rightIcon,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [hasInternalValue, setHasInternalValue] = React.useState(
      Boolean(defaultValue || value),
    );

    const isPasswordType =
      showPasswordToggle !== undefined
        ? showPasswordToggle
        : type === "password";
    const effectiveType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    const isInvalid =
      ariaInvalid === "true" || ariaInvalid === true || Boolean(error);
    const hasValue =
      value !== undefined ? Boolean(value) : hasInternalValue;
    const showTopLabel = Boolean(
      label && (alwaysShowLabel || isFocused || hasValue || disabled || isInvalid),
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasInternalValue(Boolean(e.target.value));
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasInternalValue(Boolean(e.target.value));
      onChange?.(e);
    };

    const togglePassword = () => {
      setShowPassword((prev) => !prev);
    };

    const inputElement = (
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          placeholder={showTopLabel ? placeholder : (placeholder || label)}
          aria-invalid={isInvalid ? "true" : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          defaultValue={defaultValue}
          className={cn(
            "block h-12 w-full border bg-transparent px-3 font-roboto text-sm sm:text-base leading-5 tracking-cv transition-colors outline-none",
            "border-[#C4C4C6] dark:border-[#424242]",
            "hover:border-[#8E8E93] dark:hover:border-[#8E8E93]",
            "focus:border-[#1C1C1E] dark:focus:border-[#F5F5F7] focus:ring-0 focus-visible:ring-0",
            "text-cv-text dark:text-[#F5F5F7]",
            "placeholder:text-[#C4C4C6] dark:placeholder:text-[#626262]",
            "disabled:bg-[#D1D1D6] dark:disabled:bg-[#424242] disabled:text-[#8E8E93] dark:disabled:text-[#8E8E93] disabled:border-transparent dark:disabled:border-transparent disabled:cursor-not-allowed",
            isInvalid &&
              "border-[#C63031]! dark:border-[#C63031]! focus:border-[#C63031]! dark:focus:border-[#C63031]!",
            (isPasswordType || rightIcon) && "pr-11",
            className,
          )}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2 p-1 transition-colors focus:outline-none",
              isInvalid
                ? "text-[#C63031]"
                : disabled
                  ? "text-[#8E8E93] dark:text-[#8E8E93] cursor-not-allowed"
                  : "text-[#8E8E93] hover:text-cv-text dark:text-[#8E8E93] dark:hover:text-[#F5F5F7]",
            )}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}

        {!isPasswordType && rightIcon && (
          <div
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
              isInvalid
                ? "text-[#C63031]"
                : disabled
                  ? "text-[#8E8E93]"
                  : "text-cv-muted dark:text-[#8E8E93]",
            )}
          >
            {rightIcon}
          </div>
        )}
      </div>
    );

    if (!label && !error && !containerClassName) {
      return inputElement;
    }

    return (
      <div className={cn("w-full text-left", containerClassName)}>
        {label && showTopLabel && (
          <label
            htmlFor={inputId}
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
        {inputElement}
        {error && (
          <p className="mt-1 text-xs text-[#C63031] font-roboto">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
