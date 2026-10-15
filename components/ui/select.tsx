"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (val: string) => void;
  label?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  className,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const selected = options.find((o) => o.value === value) || options[0];

  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-2xl border border-[#2B2D42]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2D42] shadow-2xs hover:border-[#FB6F92]/40 focus:outline-none focus:border-[#FB6F92] transition select-none"
      >
        <span className="truncate">{selected ? selected.label : "Pilih opsi"}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-[#7D7F9A] transition-transform duration-200",
            open && "rotate-180 text-[#FB6F92]"
          )}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-[#FB6F92]/20 bg-white/95 p-1.5 shadow-xl shadow-[#FB6F92]/10 backdrop-blur-md animate-in fade-in-50 zoom-in-95">
          <div className="max-h-56 overflow-auto space-y-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition select-none",
                  opt.value === value
                    ? "bg-[#FFE5EC] text-[#FB6F92] font-bold"
                    : "text-[#2B2D42] hover:bg-[#FFF9FB] hover:text-[#FB6F92]"
                )}
              >
                <span>{opt.label}</span>
                {opt.description && (
                  <span className="text-[10px] text-[#7D7F9A] font-normal">
                    {opt.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
