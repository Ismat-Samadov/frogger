/**
 * Renders cars (road) and logs (river).
 */

import { CELL, COLORS } from "../constants";
import type { CarEntity, LogEntity } from "../types";

// ─── Logs ────────────────────────────────────────────────────────────────────

export function renderLogs(ctx: CanvasRenderingContext2D, logs: LogEntity[]): void {
  logs.forEach((log) => {
    const x = log.x;
    const y = log.row * CELL;
    const w = log.width;
    const h = CELL;
    const radius = 10;

    ctx.save();

    // Rounded log body
    ctx.beginPath();
    roundRect(ctx, x, y + 4, w, h - 8, radius);
    ctx.fillStyle = COLORS.logFill;
    ctx.fill();

    // Highlight strip on top
    ctx.beginPath();
    roundRect(ctx, x + 4, y + 6, w - 8, h * 0.28, radius * 0.5);
    ctx.fillStyle = COLORS.logHighlight;
    ctx.fill();

    // Neon orange outline glow
    ctx.beginPath();
    roundRect(ctx, x, y + 4, w, h - 8, radius);
    ctx.strokeStyle = COLORS.logOutline;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = COLORS.logOutline;
    ctx.stroke();

    // Wood grain lines
    ctx.strokeStyle = "#5a3010";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.shadowBlur = 0;
    const grainStep = CELL * 0.6;
    for (let gx = x + grainStep / 2; gx < x + w; gx += grainStep) {
      ctx.beginPath();
      ctx.moveTo(gx, y + 8);
      ctx.lineTo(gx, y + h - 8);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.restore();
  });
}

// ─── Cars ────────────────────────────────────────────────────────────────────

export function renderCars(ctx: CanvasRenderingContext2D, cars: CarEntity[]): void {
  cars.forEach((car) => {
    const x = car.x;
    const y = car.row * CELL;
    const w = car.width;
    const h = CELL;
    const color = COLORS.cars[car.colorIndex];
    const radius = 8;

    ctx.save();

    // Car body
    ctx.beginPath();
    roundRect(ctx, x + 2, y + 8, w - 4, h - 16, radius);
    ctx.fillStyle = color + "22"; // semi-transparent fill
    ctx.fill();

    // Car outline with neon glow
    ctx.beginPath();
    roundRect(ctx, x + 2, y + 8, w - 4, h - 16, radius);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 12;
    ctx.shadowColor = color;
    ctx.stroke();

    // Windshield (front — depends on direction)
    const windowInset = 6;
    const windowW = Math.min(w * 0.35, 22);
    const windowX = car.direction === 1
      ? x + w - windowW - windowInset   // moving right → front on right
      : x + windowInset;                // moving left → front on left
    ctx.beginPath();
    ctx.roundRect(windowX, y + 12, windowW, h - 24, 3);
    ctx.fillStyle = color + "55";
    ctx.fill();
    ctx.strokeStyle = color + "aa";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 4;
    ctx.stroke();

    // Headlights
    const lightY = y + h / 2 - 3;
    const lightX = car.direction === 1 ? x + w - 8 : x + 4;
    ctx.beginPath();
    ctx.arc(lightX, lightY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#ffffffcc";
    ctx.fill();

    ctx.restore();
  });
}

// ─── Utility: rounded rect (polyfill) ───────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    // Fallback for older browsers
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
