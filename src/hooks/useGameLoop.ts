"use client";

import { useEffect, useRef } from "react";
import type { GameAction } from "../game/state/actions";

/**
 * Drives the game loop using requestAnimationFrame.
 * Dispatches a TICK action each frame with the elapsed time in ms.
 *
 * @param dispatch - reducer dispatch function
 * @param active   - whether the loop should be running (false = paused/idle/ended)
 */
export function useGameLoop(
  dispatch: (action: GameAction) => void,
  active: boolean
) {
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const tick = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaMs = Math.min(time - lastTimeRef.current, 100); // cap at 100 ms
        dispatch({ type: "TICK", deltaMs });
      }
      lastTimeRef.current = time;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [active, dispatch]);
}
