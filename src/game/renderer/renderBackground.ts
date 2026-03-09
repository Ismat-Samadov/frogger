/**
 * Renders the static background: zones, road markings, water ripples.
 */

import {
  CELL,
  COLS,
  LOGICAL_WIDTH,
  LOGICAL_HEIGHT,
  GOAL_ROW,
  RIVER_TOP,
  RIVER_BOTTOM,
  SAFE_ROW,
  ROAD_TOP,
  ROAD_BOTTOM,
  START_ROW,
  COLORS,
} from "../constants";

export function renderBackground(ctx: CanvasRenderingContext2D, tick: number): void {
  // ── Fill entire canvas ────────────────────────────────────────────────────
  ctx.fillStyle = "#050510";
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

  // ── Goal zone (row 0) ─────────────────────────────────────────────────────
  ctx.fillStyle = COLORS.goalZone;
  ctx.fillRect(0, GOAL_ROW * CELL, LOGICAL_WIDTH, CELL);
  // Decorative border strip at top
  ctx.fillStyle = "#39ff1420";
  ctx.fillRect(0, 0, LOGICAL_WIDTH, 4);

  // ── River (rows 1–5) ──────────────────────────────────────────────────────
  for (let row = RIVER_TOP; row <= RIVER_BOTTOM; row++) {
    ctx.fillStyle = COLORS.river;
    ctx.fillRect(0, row * CELL, LOGICAL_WIDTH, CELL);

    // Animated water ripple lines
    const rippleOffset = ((tick * 0.3 + row * 17) % LOGICAL_WIDTH);
    ctx.strokeStyle = COLORS.riverWave;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    for (let x = -LOGICAL_WIDTH; x < LOGICAL_WIDTH * 2; x += 48) {
      const wx = (x + rippleOffset) % LOGICAL_WIDTH;
      ctx.moveTo(wx, row * CELL + CELL * 0.35);
      ctx.lineTo(wx + 20, row * CELL + CELL * 0.45);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Row dividers
    ctx.strokeStyle = "#0a2040";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, row * CELL);
    ctx.lineTo(LOGICAL_WIDTH, row * CELL);
    ctx.stroke();
  }

  // ── Safe median (row 6) ───────────────────────────────────────────────────
  ctx.fillStyle = COLORS.safeZone;
  ctx.fillRect(0, SAFE_ROW * CELL, LOGICAL_WIDTH, CELL);
  // Grass tufts (tiny decorative dots)
  ctx.fillStyle = "#2a5a2a";
  for (let i = 0; i < COLS; i++) {
    ctx.fillRect(i * CELL + 10, SAFE_ROW * CELL + 12, 4, 8);
    ctx.fillRect(i * CELL + 26, SAFE_ROW * CELL + 18, 4, 8);
    ctx.fillRect(i * CELL + 38, SAFE_ROW * CELL + 10, 4, 8);
  }

  // ── Road (rows 7–11) ─────────────────────────────────────────────────────
  for (let row = ROAD_TOP; row <= ROAD_BOTTOM; row++) {
    ctx.fillStyle = COLORS.road;
    ctx.fillRect(0, row * CELL, LOGICAL_WIDTH, CELL);

    // Dashed centre line between lanes
    if (row < ROAD_BOTTOM) {
      ctx.strokeStyle = COLORS.roadLine;
      ctx.lineWidth = 1;
      ctx.setLineDash([12, 12]);
      ctx.beginPath();
      ctx.moveTo(0, (row + 1) * CELL);
      ctx.lineTo(LOGICAL_WIDTH, (row + 1) * CELL);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  // Solid edge lines at road top and bottom
  ctx.strokeStyle = "#39ff1430";
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(0, ROAD_TOP * CELL); ctx.lineTo(LOGICAL_WIDTH, ROAD_TOP * CELL);
  ctx.moveTo(0, (ROAD_BOTTOM + 1) * CELL); ctx.lineTo(LOGICAL_WIDTH, (ROAD_BOTTOM + 1) * CELL);
  ctx.stroke();

  // ── Start zone (row 12) ───────────────────────────────────────────────────
  ctx.fillStyle = COLORS.startZone;
  ctx.fillRect(0, START_ROW * CELL, LOGICAL_WIDTH, CELL);
  // Grass tufts
  ctx.fillStyle = "#2a5a2a";
  for (let i = 0; i < COLS; i++) {
    ctx.fillRect(i * CELL + 8, START_ROW * CELL + 14, 4, 8);
    ctx.fillRect(i * CELL + 24, START_ROW * CELL + 8, 4, 8);
    ctx.fillRect(i * CELL + 40, START_ROW * CELL + 16, 4, 8);
  }

  // ── Column dividers (subtle) ─────────────────────────────────────────────
  ctx.strokeStyle = "#ffffff08";
  ctx.lineWidth = 1;
  for (let col = 1; col < COLS; col++) {
    ctx.beginPath();
    ctx.moveTo(col * CELL, 0);
    ctx.lineTo(col * CELL, LOGICAL_HEIGHT);
    ctx.stroke();
  }
}
