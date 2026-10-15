import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  doubleBezel?: boolean;
}

export function Card({
  className,
  doubleBezel = false,
  children,
  ...props
}: CardProps) {
  if (doubleBezel) {
    return (
      <div
        className={cn(
          "rounded-3xl p-2 bg-[#FFE5EC]/70 border border-[#FB6F92]/20 shadow-md shadow-[#FB6F92]/5 backdrop-blur-xs",
          className
        )}
        {...props}
      >
        <div className="rounded-[calc(1.5rem-0.375rem)] bg-white p-5 border border-white/60 shadow-inner">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl bg-white p-6 border border-[#2B2D42]/10 shadow-sm shadow-[#2B2D42]/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
