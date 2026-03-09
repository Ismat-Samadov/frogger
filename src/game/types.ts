// ─── Domain Types for the Frogger Game ─────────────────────────────────────

export type Difficulty = "easy" | "medium" | "hard";
export type GamePhase = "idle" | "playing" | "paused" | "won" | "lost";
export type Direction = "up" | "down" | "left" | "right";

/** Events dispatched this tick — used to trigger sound effects in useGame */
export type GameEvent =
  | "none"
  | "hop"
  | "squish"
  | "splash"
  | "score"
  | "levelWon"
  | "gameOver";

/** The frog entity — position tracks pixel coords, hop is animated */
export interface FrogEntity {
  /** Left-edge pixel X (continuous — drifts with logs in river) */
  x: number;
  /** Top-edge pixel Y (snapped: row * CELL) */
  y: number;
  /** Previous x for hop interpolation */
  prevX: number;
  /** Previous y for hop interpolation */
  prevY: number;
  /** 0→1 animation progress for the current hop */
  hopProgress: number;
}

/** A car obstacle on the road */
export interface CarEntity {
  id: number;
  /** Left-edge pixel X (continuous, wraps at screen edges) */
  x: number;
  /** Grid row index (7–11) */
  row: number;
  /** Pixel width */
  width: number;
  /** Speed in pixels per second (base, before difficulty multiplier) */
  speed: number;
  /** 1 = moving right, -1 = moving left */
  direction: 1 | -1;
  /** Index into COLORS.cars[] for the car's neon colour */
  colorIndex: number;
}

/** A floating log in the river */
export interface LogEntity {
  id: number;
  /** Left-edge pixel X (continuous, wraps at screen edges) */
  x: number;
  /** Grid row index (1–5) */
  row: number;
  /** Pixel width */
  width: number;
  /** Speed in pixels per second (base, before difficulty multiplier) */
  speed: number;
  /** 1 = moving right, -1 = moving left */
  direction: 1 | -1;
}

/** One of the five goal slots at the top of the board */
export interface LilyPadSlot {
  /** Column index — always one of [0, 2, 4, 6, 8] */
  col: number;
  /** Whether a frog has been safely landed here this level */
  filled: boolean;
}

/** Complete serialisable game state managed by the reducer */
export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  /** Current level — speed multiplier increases with level */
  level: number;
  lives: number;
  score: number;
  /** Countdown timer in seconds */
  timer: number;
  isMuted: boolean;
  frog: FrogEntity;
  cars: CarEntity[];
  logs: LogEntity[];
  lilyPads: LilyPadSlot[];
  /** Most recent significant event — triggers audio in useGame */
  lastEvent: GameEvent;
  /** Increments on every event so useEffect can detect repeated same-type events */
  eventCount: number;
  /** Frames remaining of death-flash effect (counts down from 30 to 0) */
  deathFlash: number;
}
