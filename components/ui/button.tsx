import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 select-none";

    const variants = {
      primary:
        "bg-[#FB6F92] hover:bg-[#F9527D] text-white shadow-md shadow-[#FB6F92]/25",
      secondary:
        "bg-[#FFE5EC] hover:bg-[#FFD1DC] text-[#2B2D42] border border-[#FB6F92]/20",
      outline:
        "border border-[#2B2D42]/15 bg-white/70 hover:bg-white text-[#2B2D42] hover:border-[#FB6F92]/40 shadow-sm",
      ghost: "hover:bg-[#FFE5EC]/60 text-[#2B2D42]",
      danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-md",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-xl gap-1.5",
      md: "h-10 px-4 text-sm rounded-2xl gap-2",
      lg: "h-12 px-6 text-base rounded-2xl gap-2.5 font-semibold",
      icon: "size-10 rounded-2xl",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
