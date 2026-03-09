import type { Difficulty } from "./types";

// ─── Grid Dimensions ────────────────────────────────────────────────────────

/** Size of one grid cell in pixels (logical resolution) */
export const CELL = 48;
/** Number of grid columns */
export const COLS = 9;
/** Number of grid rows */
export const ROWS = 13;
/** Logical canvas width in pixels */
export const LOGICAL_WIDTH = COLS * CELL; // 432
/** Logical canvas height in pixels */
export const LOGICAL_HEIGHT = ROWS * CELL; // 624

// ─── Row Layout ─────────────────────────────────────────────────────────────

export const GOAL_ROW = 0;
export const RIVER_TOP = 1;
export const RIVER_BOTTOM = 5;
export const SAFE_ROW = 6;
export const ROAD_TOP = 7;
export const ROAD_BOTTOM = 11;
export const START_ROW = 12;

/** Column indices for the five lily-pad goal slots */
export const LILY_COLS = [0, 2, 4, 6, 8] as const;

// ─── Frog ───────────────────────────────────────────────────────────────────

export const FROG_START_X = 4 * CELL; // column 4 (centre)
export const FROG_START_Y = START_ROW * CELL; // row 12
/** Hop animation speed — progress units per second (1 = full hop per second) */
export const HOP_SPEED = 10; // completes hop in ~100 ms

// ─── Difficulty Settings ────────────────────────────────────────────────────

export interface DifficultyConfig {
  /** Base car speed in px/s */
  carSpeed: number;
  /** Base log speed in px/s */
  logSpeed: number;
  /** Timer countdown in seconds */
  timer: number;
  /** Starting lives */
  lives: number;
  /** Cars per road lane */
  carsPerLane: number;
  /** Logs per river lane */
  logsPerLane: number;
}

export const DIFFICULTY: Record<Difficulty, DifficultyConfig> = {
  easy: {
    carSpeed: 70,
    logSpeed: 55,
    timer: 90,
    lives: 5,
    carsPerLane: 2,
    logsPerLane: 2,
  },
  medium: {
    carSpeed: 120,
    logSpeed: 95,
    timer: 60,
    lives: 3,
    carsPerLane: 3,
    logsPerLane: 3,
  },
  hard: {
    carSpeed: 190,
    logSpeed: 145,
    timer: 40,
    lives: 1,
    carsPerLane: 4,
    logsPerLane: 3,
  },
};

/** Speed multiplier applied per level beyond the first */
export const LEVEL_SPEED_FACTOR = 0.12; // 12% faster per level

// ─── Lane Configurations ────────────────────────────────────────────────────

export interface LaneConfig {
  row: number;
  direction: 1 | -1;
  /** Multiplied against base speed */
  speedFactor: number;
  /** For logs: segment width in cells */
  widthCells?: number;
}

export const LOG_LANES: LaneConfig[] = [
  { row: 1, direction: 1, speedFactor: 0.75, widthCells: 3 },
  { row: 2, direction: -1, speedFactor: 1.0, widthCells: 2 },
  { row: 3, direction: 1, speedFactor: 1.3, widthCells: 2 },
  { row: 4, direction: -1, speedFactor: 0.9, widthCells: 3 },
  { row: 5, direction: 1, speedFactor: 0.75, widthCells: 2 },
];

export const CAR_LANES: LaneConfig[] = [
  { row: 7, direction: -1, speedFactor: 1.0 },
  { row: 8, direction: 1, speedFactor: 1.3 },
  { row: 9, direction: -1, speedFactor: 0.7 },
  { row: 10, direction: 1, speedFactor: 1.1 },
  { row: 11, direction: -1, speedFactor: 1.5 },
];

// ─── Score Constants ─────────────────────────────────────────────────────────

export const SCORE_FORWARD_HOP = 10;
export const SCORE_LILY_PAD = 50;
export const SCORE_LEVEL_COMPLETE = 1000;

// ─── Colours ────────────────────────────────────────────────────────────────

export const COLORS = {
  // Zones
  goalZone: "#0a1f0a",
  river: "#091520",
  riverWave: "#0a2035",
  safeZone: "#0f200f",
  road: "#181828",
  roadLine: "#2a2a4a",
  startZone: "#0f200f",

  // Lily pads
  lilyPadEmpty: "#1a3a1a",
  lilyPadBorder: "#39ff14",
  lilyPadFilled: "#39ff14",
  lilyPadFilledGlow: "#39ff1480",
  lilyPadStem: "#226622",

  // Logs
  logFill: "#7B4F2A",
  logHighlight: "#A06535",
  logOutline: "#E08040",

  // Cars (neon colours by index)
  cars: ["#ff2d78", "#00f5ff", "#fff01f", "#ff7700", "#bf00ff"],

  // Frog
  frogBody: "#1c5c0a",
  frogHighlight: "#39ff14",
  frogEye: "#fff01f",

  // Effects
  deathFlash: "#ff2d7880",
  scoreFloat: "#39ff14",

  // UI
  hudBg: "#0a0a14e0",
  panelBg: "#111122",
  panelBorder: "#2a2a5a",
} as const;
