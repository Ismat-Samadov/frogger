"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

/**
 * Neon-styled button component.
 * Uses CSS-only glow — no framer-motion to keep it lightweight.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base
          "relative inline-flex items-center justify-center font-bold uppercase tracking-widest",
          "border-2 transition-all duration-150 cursor-pointer select-none",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "active:scale-95",

          // Sizes
          size === "sm" && "px-3 py-1.5 text-[10px] rounded",
          size === "md" && "px-5 py-2.5 text-xs rounded-md",
          size === "lg" && "px-8 py-4 text-sm rounded-lg",

          // Variants
          variant === "primary" && [
            "bg-transparent border-[#39ff14] text-[#39ff14]",
            "hover:bg-[#39ff1415] hover:shadow-[0_0_12px_#39ff14,0_0_24px_#39ff1440]",
            "focus-visible:ring-[#39ff14]",
          ],
          variant === "secondary" && [
            "bg-transparent border-[#00f5ff] text-[#00f5ff]",
            "hover:bg-[#00f5ff15] hover:shadow-[0_0_12px_#00f5ff,0_0_24px_#00f5ff40]",
            "focus-visible:ring-[#00f5ff]",
          ],
          variant === "danger" && [
            "bg-transparent border-[#ff2d78] text-[#ff2d78]",
            "hover:bg-[#ff2d7815] hover:shadow-[0_0_12px_#ff2d78,0_0_24px_#ff2d7840]",
            "focus-visible:ring-[#ff2d78]",
          ],
          variant === "ghost" && [
            "bg-transparent border-[#2a2a5a] text-[#8080c0]",
            "hover:border-[#4a4a8a] hover:text-[#c0c0e0]",
            "focus-visible:ring-[#4a4a8a]",
          ],

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
