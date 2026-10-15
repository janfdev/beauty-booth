"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToggleOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ToggleGroup({
  options,
  value,
  onChange,
  className,
  disabled = false,
}: ToggleGroupProps) {
  return (
    <div
      className={cn(
        "inline-flex w-full items-center gap-1.5 rounded-2xl bg-[#FFF9FB] p-1 border border-[#2B2D42]/10",
        className
      )}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition select-none",
              isActive
                ? "bg-[#FB6F92] text-white shadow-xs"
                : "text-[#2B2D42] hover:bg-white/60 hover:text-[#FB6F92]"
            )}
          >
            {opt.icon}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
