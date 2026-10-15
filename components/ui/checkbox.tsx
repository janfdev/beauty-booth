"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      disabled = false,
      label,
      description,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="inline-flex items-center gap-2.5 select-none">
        <label
          htmlFor={checkboxId}
          className={cn(
            "relative flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-lg border transition-all",
            checked
              ? "bg-[#FB6F92] border-[#FB6F92] text-white shadow-xs"
              : "border-[#2B2D42]/20 bg-white hover:border-[#FB6F92]/50",
            disabled && "cursor-not-allowed opacity-50 bg-[#F3EAF0]",
            className
          )}
        >
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="sr-only"
            {...props}
          />
          {checked && <Check className="size-3.5 stroke-[3]" />}
        </label>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  "cursor-pointer text-xs font-semibold text-[#2B2D42]",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-[10px] text-[#7D7F9A] font-normal">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
