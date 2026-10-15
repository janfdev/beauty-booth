import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-2xl border border-[#2B2D42]/15 bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2D42] placeholder:text-[#7D7F9A]/60 shadow-2xs transition-colors focus-visible:outline-none focus-visible:border-[#FB6F92] focus-visible:ring-2 focus-visible:ring-[#FB6F92]/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
