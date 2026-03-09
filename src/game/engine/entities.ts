/**
 * Factory functions for game entities.
 * All positions are in logical pixels (CELL = 48px units).
 */

import {
  CELL,
  LOGICAL_WIDTH,
  CAR_LANES,
  LOG_LANES,
  LILY_COLS,
  DIFFICULTY,
  FROG_START_X,
  FROG_START_Y,
} from "../constants";
import type {
  Difficulty,
  FrogEntity,
  CarEntity,
  LogEntity,
  LilyPadSlot,
} from "../types";

let _nextId = 1;
function nextId() {
  return _nextId++;
}

/** Create the starting frog entity */
export function createFrog(): FrogEntity {
  return {
    x: FROG_START_X,
    y: FROG_START_Y,
    prevX: FROG_START_X,
    prevY: FROG_START_Y,
    hopProgress: 1, // start fully at rest (no animation)
  };
}

/** Generate all cars for all road lanes at the given difficulty */
export function createCars(difficulty: Difficulty): CarEntity[] {
  const cfg = DIFFICULTY[difficulty];
  const cars: CarEntity[] = [];

  CAR_LANES.forEach((lane, laneIdx) => {
    const count = cfg.carsPerLane;
    const speed = cfg.carSpeed * lane.speedFactor;
    // Car width: 1–2 cells, alternate between widths per lane
    const carWidthCells = laneIdx % 2 === 0 ? 1 : 2;
    const carWidth = carWidthCells * CELL;
    const spacing = LOGICAL_WIDTH / count;

    for (let i = 0; i < count; i++) {
      // Spread cars evenly with a small random jitter
      const jitter = (Math.random() - 0.5) * spacing * 0.3;
      const startX = i * spacing + jitter;

      cars.push({
        id: nextId(),
        x: startX,
        row: lane.row,
        width: carWidth,
        speed,
        direction: lane.direction,
        colorIndex: (laneIdx + i) % 5,
      });
    }
  });

  return cars;
}

/** Generate all logs for all river lanes at the given difficulty */
export function createLogs(difficulty: Difficulty): LogEntity[] {
  const cfg = DIFFICULTY[difficulty];
  const logs: LogEntity[] = [];

  LOG_LANES.forEach((lane) => {
    const count = cfg.logsPerLane;
    const speed = cfg.logSpeed * lane.speedFactor;
    const logWidth = (lane.widthCells ?? 2) * CELL;
    const spacing = LOGICAL_WIDTH / count;

    for (let i = 0; i < count; i++) {
      const jitter = (Math.random() - 0.5) * spacing * 0.2;
      const startX = i * spacing + jitter;

      logs.push({
        id: nextId(),
        x: startX,
        row: lane.row,
        width: logWidth,
        speed,
        direction: lane.direction,
      });
    }
  });

  return logs;
}

/** Generate the five empty lily-pad slots for a new level */
export function createLilyPads(): LilyPadSlot[] {
  return LILY_COLS.map((col) => ({ col, filled: false }));
}
