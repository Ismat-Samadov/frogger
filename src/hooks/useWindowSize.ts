"use client";

import { useState, useEffect } from "react";
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from "../game/constants";

interface ScaledSize {
  /** CSS width in px to apply to the canvas element */
  cssWidth: number;
  /** CSS height in px to apply to the canvas element */
  cssHeight: number;
  /** Pixel ratio (for display purposes only) */
  scale: number;
}

const HUD_HEIGHT = 64;    // top HUD bar
const CONTROLS_HEIGHT = 120; // mobile D-pad area
const PADDING = 16;         // margin around canvas

/**
 * Computes the largest size the canvas can be displayed at
 * while maintaining the logical aspect ratio and fitting in the viewport.
 */
export function useWindowSize(): ScaledSize {
  const compute = (): ScaledSize => {
    if (typeof window === "undefined") {
      return { cssWidth: LOGICAL_WIDTH, cssHeight: LOGICAL_HEIGHT, scale: 1 };
    }

    const vw = window.innerWidth - PADDING * 2;
    const vh = window.innerHeight - HUD_HEIGHT - CONTROLS_HEIGHT - PADDING * 2;

    const scaleX = vw / LOGICAL_WIDTH;
    const scaleY = vh / LOGICAL_HEIGHT;
    const scale = Math.max(0.5, Math.min(scaleX, scaleY, 2));

    return {
      cssWidth: Math.floor(LOGICAL_WIDTH * scale),
      cssHeight: Math.floor(LOGICAL_HEIGHT * scale),
      scale,
    };
  };

  const [size, setSize] = useState<ScaledSize>(compute);

  useEffect(() => {
    const handler = () => setSize(compute());
    window.addEventListener("resize", handler);
    handler(); // run once on mount
    return () => window.removeEventListener("resize", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return size;
}
