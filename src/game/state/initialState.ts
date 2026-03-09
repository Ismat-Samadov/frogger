import type { Difficulty, GameState } from "../types";
import { DIFFICULTY } from "../constants";
import { createFrog, createCars, createLogs, createLilyPads } from "../engine/entities";

/** Create the full initial game state for a given difficulty */
export function createInitialState(difficulty: Difficulty = "medium"): GameState {
  const cfg = DIFFICULTY[difficulty];
  return {
    phase: "idle",
    difficulty,
    level: 1,
    lives: cfg.lives,
    score: 0,
    timer: cfg.timer,
    isMuted: false,
    frog: createFrog(),
    cars: createCars(difficulty),
    logs: createLogs(difficulty),
    lilyPads: createLilyPads(),
    lastEvent: "none",
    eventCount: 0,
    deathFlash: 0,
  };
}

/** Create a fresh in-game state (phase = 'playing') */
export function createPlayingState(difficulty: Difficulty, level = 1, score = 0, isMuted = false): GameState {
  const cfg = DIFFICULTY[difficulty];
  return {
    phase: "playing",
    difficulty,
    level,
    lives: cfg.lives,
    score,
    timer: cfg.timer,
    isMuted,
    frog: createFrog(),
    cars: createCars(difficulty),
    logs: createLogs(difficulty),
    lilyPads: createLilyPads(),
    lastEvent: "none",
    eventCount: 0,
    deathFlash: 0,
  };
}
