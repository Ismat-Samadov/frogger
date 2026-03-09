/**
 * Physics: collision detection and log-riding logic.
 * All functions are pure — they receive state slices and return results.
 */

import { CELL, RIVER_TOP, RIVER_BOTTOM, ROAD_TOP, ROAD_BOTTOM } from "../constants";
import type { FrogEntity, CarEntity, LogEntity } from "../types";

// ─── AABB helpers ────────────────────────────────────────────────────────────

interface AABB {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function overlaps(a: AABB, b: AABB): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/** The frog's collision hitbox — 60% of cell, centred */
function frogAABB(frog: FrogEntity): AABB {
  const inset = CELL * 0.22;
  return {
    left: frog.x + inset,
    right: frog.x + CELL - inset,
    top: frog.y + inset,
    bottom: frog.y + CELL - inset,
  };
}

/** A car's collision hitbox — slightly inset for fairness */
function carAABB(car: CarEntity): AABB {
  const insetX = car.width * 0.05;
  const insetY = CELL * 0.1;
  return {
    left: car.x + insetX,
    right: car.x + car.width - insetX,
    top: car.row * CELL + insetY,
    bottom: car.row * CELL + CELL - insetY,
  };
}

// ─── Row helpers ─────────────────────────────────────────────────────────────

export function frogRow(frog: FrogEntity): number {
  return Math.floor(frog.y / CELL);
}

// ─── Collision checks ────────────────────────────────────────────────────────

/**
 * Returns true if the frog is overlapping any car.
 * Only relevant when the frog is in the road zone (rows 7–11).
 */
export function isHitByCar(frog: FrogEntity, cars: CarEntity[]): boolean {
  const row = frogRow(frog);
  if (row < ROAD_TOP || row > ROAD_BOTTOM) return false;
  const fb = frogAABB(frog);
  return cars.some((car) => car.row === row && overlaps(fb, carAABB(car)));
}

// ─── Log riding ──────────────────────────────────────────────────────────────

/**
 * Returns the log the frog is currently riding, or null if none.
 * The frog centre must fall within the "safe" middle 80% of the log.
 */
export function findRidingLog(frog: FrogEntity, logs: LogEntity[]): LogEntity | null {
  const row = frogRow(frog);
  if (row < RIVER_TOP || row > RIVER_BOTTOM) return null;
  const frogCenterX = frog.x + CELL / 2;
  const inset = CELL * 0.25;
  return (
    logs.find(
      (log) =>
        log.row === row &&
        frogCenterX >= log.x + inset &&
        frogCenterX <= log.x + log.width - inset
    ) ?? null
  );
}

/**
 * Returns true if the frog is in the river AND not on any log.
 * Triggers a splash death.
 */
export function isInRiverWithNoLog(frog: FrogEntity, logs: LogEntity[]): boolean {
  const row = frogRow(frog);
  if (row < RIVER_TOP || row > RIVER_BOTTOM) return false;
  return findRidingLog(frog, logs) === null;
}

/** Returns true if the frog has drifted off the left or right edge of the screen */
export function isDriftedOffScreen(frog: FrogEntity): boolean {
  // Allow half-cell grace beyond each edge
  return frog.x < -CELL * 0.5 || frog.x > (9 * CELL) - CELL * 0.5;
}
