"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  value: string | number;
  color?: "green" | "cyan" | "pink" | "yellow";
  className?: string;
}

/** HUD badge — label + value with neon glow */
export default function Badge({ label, value, color = "cyan", className }: BadgeProps) {
  const colorMap = {
    green:  { text: "text-[#39ff14]", glow: "drop-shadow-[0_0_6px_#39ff14]" },
    cyan:   { text: "text-[#00f5ff]", glow: "drop-shadow-[0_0_6px_#00f5ff]" },
    pink:   { text: "text-[#ff2d78]", glow: "drop-shadow-[0_0_6px_#ff2d78]" },
    yellow: { text: "text-[#fff01f]", glow: "drop-shadow-[0_0_6px_#fff01f]" },
  };

  const { text, glow } = colorMap[color];

  return (
    <div
      className={cn(
        "flex flex-col items-center px-3 py-1.5",
        "border border-[#2a2a5a] rounded bg-[#111122]/80",
        className
      )}
    >
      <span className="text-[9px] text-[#6060a0] tracking-widest uppercase font-mono">{label}</span>
      <span
        className={cn(
          "text-sm font-bold font-mono tracking-wider mt-0.5",
          text,
          glow
        )}
      >
        {value}
      </span>
    </div>
  );
}
