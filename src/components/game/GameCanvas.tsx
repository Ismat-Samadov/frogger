"use client";

import { type RefObject } from "react";
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from "@/game/constants";

interface GameCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cssWidth: number;
  cssHeight: number;
}

/**
 * The HTML5 canvas element.
 * Logical resolution is fixed at 432×624; CSS size scales to the viewport.
 */
export default function GameCanvas({ canvasRef, cssWidth, cssHeight }: GameCanvasProps) {
  return (
    <div
      className="relative scanlines"
      style={{ width: cssWidth, height: cssHeight }}
    >
      <canvas
        ref={canvasRef}
        width={LOGICAL_WIDTH}
        height={LOGICAL_HEIGHT}
        style={{ width: cssWidth, height: cssHeight }}
        className="rounded-sm"
        aria-label="Frogger game board"
      />
    </div>
  );
}
