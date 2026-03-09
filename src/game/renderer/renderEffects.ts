/**
 * Renders overlay effects: death flash, screen vignette, neon scanlines.
 */

import { LOGICAL_WIDTH, LOGICAL_HEIGHT, COLORS } from "../constants";

/** Red/pink flash overlay when the frog dies */
export function renderDeathFlash(ctx: CanvasRenderingContext2D, deathFlash: number): void {
  if (deathFlash <= 0) return;
  const alpha = (deathFlash / 30) * 0.45;
  ctx.fillStyle = `rgba(255,45,120,${alpha})`;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
}

/** Subtle vignette around the edges */
export function renderVignette(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createRadialGradient(
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2,
    LOGICAL_HEIGHT * 0.3,
    LOGICAL_WIDTH / 2,
    LOGICAL_HEIGHT / 2,
    LOGICAL_HEIGHT * 0.75
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
}

/** Subtle CRT scanline pattern */
export function renderScanlines(ctx: CanvasRenderingContext2D): void {
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#000000";
  for (let y = 0; y < LOGICAL_HEIGHT; y += 4) {
    ctx.fillRect(0, y, LOGICAL_WIDTH, 2);
  }
  ctx.globalAlpha = 1;
}

/** Neon border glow around the canvas */
export function renderBorder(ctx: CanvasRenderingContext2D, tick: number): void {
  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.04);
  ctx.save();
  ctx.strokeStyle = `rgba(57,255,20,${0.3 * pulse})`;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#39ff14";
  ctx.strokeRect(1.5, 1.5, LOGICAL_WIDTH - 3, LOGICAL_HEIGHT - 3);
  ctx.restore();
}
