import type { Difficulty, Direction } from "../types";

// ─── Discriminated-union of all game actions ─────────────────────────────────

export type GameAction =
  | { type: "START_GAME"; difficulty: Difficulty }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "MOVE_FROG"; direction: Direction }
  | { type: "TICK"; deltaMs: number }
  | { type: "NEXT_LEVEL" }
  | { type: "RESTART" }
  | { type: "TOGGLE_MUTE" };
