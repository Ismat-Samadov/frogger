"use client";

import { useEffect, useRef, useCallback } from "react";
import type { GamePhase } from "../game/types";
import type { GameAction } from "../game/state/actions";

const SWIPE_THRESHOLD = 25; // px — minimum distance to register a swipe

/**
 * Detects touch swipes on the game canvas for mobile navigation.
 * Also supports pointer-down on directional D-pad buttons (handled in TouchControls).
 */
export function useTouch(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  dispatch: (action: GameAction) => void,
  phase: GamePhase
) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!touchStart.current || phase !== "playing") return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;

      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) {
        // Tap — treat as move up (common on mobile)
        dispatch({ type: "MOVE_FROG", direction: "up" });
        touchStart.current = null;
        return;
      }

      if (absDx > absDy) {
        // Horizontal swipe
        dispatch({ type: "MOVE_FROG", direction: dx > 0 ? "right" : "left" });
      } else {
        // Vertical swipe
        dispatch({ type: "MOVE_FROG", direction: dy > 0 ? "down" : "up" });
      }

      touchStart.current = null;
    },
    [dispatch, phase]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [canvasRef, handleTouchStart, handleTouchEnd]);
}
