"use client";

import { useCallback } from "react";
import type { Direction } from "@/game/types";

interface TouchControlsProps {
  onMove: (direction: Direction) => void;
  disabled?: boolean;
}

interface DPadButtonProps {
  direction: Direction;
  label: string;
  onMove: (direction: Direction) => void;
  disabled?: boolean;
  className?: string;
}

/** Individual D-pad button with pointer-repeat on hold */
function DPadButton({ direction, label, onMove, disabled, className }: DPadButtonProps) {
  let repeatTimer: ReturnType<typeof setTimeout> | null = null;
  let repeatInterval: ReturnType<typeof setInterval> | null = null;

  const startRepeat = useCallback(() => {
    if (disabled) return;
    onMove(direction);
    repeatTimer = setTimeout(() => {
      repeatInterval = setInterval(() => onMove(direction), 150);
    }, 300);
  }, [direction, onMove, disabled]);

  const stopRepeat = useCallback(() => {
    if (repeatTimer) clearTimeout(repeatTimer);
    if (repeatInterval) clearInterval(repeatInterval);
    repeatTimer = null;
    repeatInterval = null;
  }, []);

  return (
    <button
      className={`
        flex items-center justify-center
        w-14 h-14 rounded-xl border-2 border-[#2a2a5a]
        bg-[#111122]/90 text-[#39ff14] text-xl
        active:bg-[#39ff1415] active:border-[#39ff14]
        active:shadow-[0_0_12px_#39ff1460]
        transition-all duration-75 select-none touch-none
        disabled:opacity-30 cursor-pointer
        ${className ?? ""}
      `}
      onPointerDown={startRepeat}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled}
      aria-label={`Move ${direction}`}
    >
      {label}
    </button>
  );
}

/**
 * On-screen D-pad for mobile players.
 * Hidden on desktop (md:hidden).
 */
export default function TouchControls({ onMove, disabled }: TouchControlsProps) {
  return (
    <div className="flex items-center justify-center py-3 md:hidden">
      <div className="relative" style={{ width: 176, height: 120 }}>
        {/* Up */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0">
          <DPadButton direction="up" label="▲" onMove={onMove} disabled={disabled} />
        </div>
        {/* Left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <DPadButton direction="left" label="◀" onMove={onMove} disabled={disabled} />
        </div>
        {/* Right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <DPadButton direction="right" label="▶" onMove={onMove} disabled={disabled} />
        </div>
        {/* Down */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
          <DPadButton direction="down" label="▼" onMove={onMove} disabled={disabled} />
        </div>
        {/* Centre decorative dot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#1a1a3a] border border-[#2a2a5a]" />
      </div>
    </div>
  );
}
