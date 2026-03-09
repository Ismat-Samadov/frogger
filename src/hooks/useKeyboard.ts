"use client";

import { useEffect, useCallback } from "react";
import type { GamePhase } from "../game/types";
import type { GameAction } from "../game/state/actions";

const KEY_MAP: Record<string, GameAction["type"] | { type: "MOVE_FROG"; direction: "up" | "down" | "left" | "right" }["direction"]> = {};

/**
 * Maps keyboard events to game actions and dispatches them.
 *
 * Controls:
 *   Arrow keys / WASD — move frog
 *   Space / Enter — pause/resume
 *   Escape — pause
 */
export function useKeyboard(
  dispatch: (action: GameAction) => void,
  phase: GamePhase
) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (phase === "playing") dispatch({ type: "MOVE_FROG", direction: "up" });
          break;

        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (phase === "playing") dispatch({ type: "MOVE_FROG", direction: "down" });
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (phase === "playing") dispatch({ type: "MOVE_FROG", direction: "left" });
          break;

        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (phase === "playing") dispatch({ type: "MOVE_FROG", direction: "right" });
          break;

        case " ":
        case "Escape":
          e.preventDefault();
          if (phase === "playing") dispatch({ type: "PAUSE" });
          else if (phase === "paused") dispatch({ type: "RESUME" });
          break;

        case "Enter":
          e.preventDefault();
          if (phase === "paused") dispatch({ type: "RESUME" });
          break;

        case "m":
        case "M":
          dispatch({ type: "TOGGLE_MUTE" });
          break;
      }
    },
    [dispatch, phase]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
