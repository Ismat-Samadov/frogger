/**
 * Pure game reducer — all state transitions live here, no side effects.
 * Side effects (audio, localStorage) are handled in useGame.ts.
 */

import type { GameState, FrogEntity } from "../types";
import type { GameAction } from "./actions";
import {
  CELL,
  COLS,
  ROWS,
  LOGICAL_WIDTH,
  DIFFICULTY,
  FROG_START_X,
  FROG_START_Y,
  HOP_SPEED,
  LILY_COLS,
  RIVER_TOP,
  RIVER_BOTTOM,
  ROAD_TOP,
  ROAD_BOTTOM,
  GOAL_ROW,
  START_ROW,
  LEVEL_SPEED_FACTOR,
  SCORE_FORWARD_HOP,
  SCORE_LILY_PAD,
  SCORE_LEVEL_COMPLETE,
} from "../constants";
import { createInitialState, createPlayingState } from "./initialState";
import { createFrog, createCars, createLogs, createLilyPads } from "../engine/entities";
import {
  frogRow,
  isHitByCar,
  findRidingLog,
  isInRiverWithNoLog,
  isDriftedOffScreen,
} from "../engine/physics";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Spawn frog back at the starting position */
function spawnFrog(): FrogEntity {
  return createFrog();
}

/** Wrap a car/log x position around the canvas */
function wrapX(x: number, width: number, direction: 1 | -1): number {
  if (direction === 1 && x > LOGICAL_WIDTH + width) return -width;
  if (direction === -1 && x < -width) return LOGICAL_WIDTH;
  return x;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ── Start a new game ───────────────────────────────────────────────────
    case "START_GAME":
      return createPlayingState(action.difficulty, 1, 0, state.isMuted);

    // ── Pause / Resume ─────────────────────────────────────────────────────
    case "PAUSE":
      if (state.phase !== "playing") return state;
      return { ...state, phase: "paused" };

    case "RESUME":
      if (state.phase !== "paused") return state;
      return { ...state, phase: "playing" };

    // ── Toggle mute ────────────────────────────────────────────────────────
    case "TOGGLE_MUTE":
      return { ...state, isMuted: !state.isMuted };

    // ── Restart — back to idle with same difficulty ────────────────────────
    case "RESTART":
      return createInitialState(state.difficulty);

    // ── Next level — reset board, keep score, increase level ──────────────
    case "NEXT_LEVEL": {
      const nextLevel = state.level + 1;
      const cfg = DIFFICULTY[state.difficulty];
      return {
        phase: "playing",
        difficulty: state.difficulty,
        level: nextLevel,
        lives: cfg.lives,          // lives reset each level
        score: state.score,
        timer: cfg.timer,
        isMuted: state.isMuted,
        frog: createFrog(),
        cars: createCars(state.difficulty),
        logs: createLogs(state.difficulty),
        lilyPads: createLilyPads(),
        lastEvent: "none",
        eventCount: state.eventCount,
        deathFlash: 0,
      };
    }

    // ── Player moves the frog ──────────────────────────────────────────────
    case "MOVE_FROG": {
      if (state.phase !== "playing") return state;
      // Cannot move while a previous hop is still animating
      if (state.frog.hopProgress < 0.85) return state;

      const { direction } = action;
      const currentRow = frogRow(state.frog);

      // Compute new pixel position
      let newX = state.frog.x;
      let newY = state.frog.y;

      switch (direction) {
        case "up":    newY -= CELL; break;
        case "down":  newY += CELL; break;
        case "left":  newX -= CELL; break;
        case "right": newX += CELL; break;
      }

      // Clamp to board boundaries
      newX = Math.max(0, Math.min(newX, (COLS - 1) * CELL));
      newY = Math.max(0, Math.min(newY, (ROWS - 1) * CELL));

      const newRow = Math.floor(newY / CELL);
      const newCol = Math.round(newX / CELL);

      // ── Frog reaches the goal row ──────────────────────────────────────
      if (newRow === GOAL_ROW) {
        const padIndex = LILY_COLS.indexOf(newCol as (typeof LILY_COLS)[number]);

        if (padIndex >= 0 && !state.lilyPads[padIndex].filled) {
          // Successfully land on an empty lily pad
          const newLilyPads = state.lilyPads.map((p, i) =>
            i === padIndex ? { ...p, filled: true } : p
          );
          const allFilled = newLilyPads.every((p) => p.filled);
          const padScore = SCORE_LILY_PAD + state.level * 10;
          const newScore = state.score + padScore + (allFilled ? SCORE_LEVEL_COMPLETE : 0);

          if (allFilled) {
            return {
              ...state,
              frog: { ...spawnFrog(), prevX: newX, prevY: newY, hopProgress: 0 },
              lilyPads: newLilyPads,
              score: newScore,
              phase: "won",
              lastEvent: "levelWon",
              eventCount: state.eventCount + 1,
              deathFlash: 0,
            };
          }

          // More lily pads to fill — respawn frog
          return {
            ...state,
            frog: { ...spawnFrog(), prevX: newX, prevY: newY, hopProgress: 0 },
            lilyPads: newLilyPads,
            score: newScore,
            lastEvent: "score",
            eventCount: state.eventCount + 1,
            deathFlash: 0,
          };
        }

        // Landed on a gap or already-filled pad → splash death
        const newLives = state.lives - 1;
        if (newLives <= 0) {
          return {
            ...state,
            frog: { ...state.frog, prevX: newX, prevY: newY, x: newX, y: newY },
            lives: 0,
            phase: "lost",
            lastEvent: "gameOver",
            eventCount: state.eventCount + 1,
            deathFlash: 30,
          };
        }
        return {
          ...state,
          frog: { ...spawnFrog(), prevX: newX, prevY: newY, hopProgress: 0 },
          lives: newLives,
          timer: DIFFICULTY[state.difficulty].timer,
          lastEvent: "splash",
          eventCount: state.eventCount + 1,
          deathFlash: 30,
        };
      }

      // ── Score forward hops (moving toward goal) ────────────────────────
      const scoreGain = newRow < currentRow ? SCORE_FORWARD_HOP : 0;

      return {
        ...state,
        frog: {
          x: newX,
          y: newY,
          prevX: state.frog.x,
          prevY: state.frog.y,
          hopProgress: 0,
        },
        score: state.score + scoreGain,
        lastEvent: "hop",
        eventCount: state.eventCount + 1,
        deathFlash: Math.max(0, state.deathFlash - 5),
      };
    }

    // ── Game-loop tick: move entities, check collisions, update timer ─────
    case "TICK": {
      if (state.phase !== "playing") return state;

      const dt = action.deltaMs / 1000; // seconds
      const speedMult = 1 + (state.level - 1) * LEVEL_SPEED_FACTOR;

      // ── Move cars ──────────────────────────────────────────────────────
      const newCars = state.cars.map((car) => {
        const newX = wrapX(
          car.x + car.speed * speedMult * car.direction * dt,
          car.width,
          car.direction
        );
        return { ...car, x: newX };
      });

      // ── Move logs ──────────────────────────────────────────────────────
      const newLogs = state.logs.map((log) => {
        const newX = wrapX(
          log.x + log.speed * speedMult * log.direction * dt,
          log.width,
          log.direction
        );
        return { ...log, x: newX };
      });

      // ── Hop animation progress ─────────────────────────────────────────
      const newHopProgress = Math.min(state.frog.hopProgress + HOP_SPEED * dt, 1);

      // ── Log riding: drift frog's x with the log it's on ───────────────
      const currentRow = frogRow(state.frog);
      let newFrogX = state.frog.x;

      if (currentRow >= RIVER_TOP && currentRow <= RIVER_BOTTOM) {
        const ridingLog = findRidingLog(state.frog, newLogs);
        if (ridingLog) {
          newFrogX = state.frog.x + ridingLog.speed * speedMult * ridingLog.direction * dt;
        }
      }

      // Updated frog (used for collision checks below)
      const updatedFrog: FrogEntity = {
        ...state.frog,
        x: newFrogX,
        hopProgress: newHopProgress,
      };

      // ── Timer countdown ────────────────────────────────────────────────
      const newTimer = state.timer - dt;

      // ── Death-flash decay ──────────────────────────────────────────────
      const newDeathFlash = Math.max(0, state.deathFlash - 1);

      // ── Collision & death checks (only when hop ≥ 90% complete) ────────
      if (newHopProgress >= 0.9) {
        const timerExpired = newTimer <= 0;
        const hitByCar = isHitByCar(updatedFrog, newCars);
        const drivenOff = isDriftedOffScreen(updatedFrog);
        const inRiverNoLog =
          !drivenOff && isInRiverWithNoLog(updatedFrog, newLogs);

        const isDead = timerExpired || hitByCar || drivenOff || inRiverNoLog;

        if (isDead) {
          const isSplash = !hitByCar;
          const newLives = state.lives - 1;

          if (newLives <= 0) {
            return {
              ...state,
              frog: updatedFrog,
              cars: newCars,
              logs: newLogs,
              timer: 0,
              lives: 0,
              phase: "lost",
              lastEvent: "gameOver",
              eventCount: state.eventCount + 1,
              deathFlash: 30,
            };
          }

          return {
            ...state,
            frog: { ...spawnFrog(), prevX: updatedFrog.x, prevY: updatedFrog.y, hopProgress: 0 },
            cars: newCars,
            logs: newLogs,
            timer: DIFFICULTY[state.difficulty].timer,
            lives: newLives,
            lastEvent: isSplash ? "splash" : "squish",
            eventCount: state.eventCount + 1,
            deathFlash: 30,
          };
        }
      }

      return {
        ...state,
        frog: updatedFrog,
        cars: newCars,
        logs: newLogs,
        timer: Math.max(0, newTimer),
        deathFlash: newDeathFlash,
        // Clear ephemeral event so it doesn't re-trigger effects
        lastEvent: state.lastEvent === "none" ? "none" : "none",
      };
    }

    default:
      return state;
  }
}
