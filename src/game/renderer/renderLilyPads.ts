/**
 * Renders the five lily-pad goal slots at the top of the board.
 */

import { CELL, GOAL_ROW, LILY_COLS, COLORS } from "../constants";
import type { LilyPadSlot } from "../types";

export function renderLilyPads(
  ctx: CanvasRenderingContext2D,
  lilyPads: LilyPadSlot[],
  tick: number
): void {
  lilyPads.forEach((pad) => {
    const x = pad.col * CELL;
    const y = GOAL_ROW * CELL;
    const cx = x + CELL / 2;
    const cy = y + CELL / 2;
    const r = CELL * 0.38;

    if (pad.filled) {
      // ── Filled pad: glowing neon green ──────────────────────────────────
      const pulse = 0.6 + 0.4 * Math.sin(tick * 0.08);

      ctx.save();
      ctx.shadowBlur = 20 * pulse;
      ctx.shadowColor = COLORS.lilyPadFilled;

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(57,255,20,${0.2 * pulse})`;
      ctx.fill();

      // Main pad
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.lilyPadFilled;
      ctx.fill();

      // Stem notch (V-shape cut)
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - CELL * 0.15, cy + r);
      ctx.lineTo(cx + CELL * 0.15, cy + r);
      ctx.fillStyle = COLORS.goalZone;
      ctx.fill();

      // Frog silhouette on filled pad
      ctx.fillStyle = "#1c5c0a";
      ctx.beginPath();
      ctx.arc(cx, cy - 2, CELL * 0.18, 0, Math.PI * 2);
      ctx.fill();
      // eyes
      ctx.fillStyle = COLORS.frogEye;
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 6, 3, 0, Math.PI * 2);
      ctx.arc(cx + 5, cy - 6, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    } else {
      // ── Empty pad: dark outline ──────────────────────────────────────────
      ctx.save();

      // Lily pad base (dark green circle)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.lilyPadEmpty;
      ctx.fill();

      // Neon green border
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS.lilyPadBorder;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 6;
      ctx.shadowColor = COLORS.lilyPadBorder;
      ctx.stroke();

      // Stem notch
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - CELL * 0.12, cy + r);
      ctx.lineTo(cx + CELL * 0.12, cy + r);
      ctx.fillStyle = COLORS.goalZone;
      ctx.fill();

      // Radial lines on pad (leaf veins)
      ctx.strokeStyle = COLORS.lilyPadStem;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * r * 0.85, cy + Math.sin(angle) * r * 0.85);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      ctx.restore();
    }
  });

  // Render the dangerous "gap" segments between lily pads (cols 1,3,5,7)
  const gapCols = [1, 3, 5, 7];
  gapCols.forEach((col) => {
    const x = col * CELL;
    const y = GOAL_ROW * CELL;
    // Dark water ripple in gap
    ctx.fillStyle = "#091520";
    ctx.fillRect(x, y, CELL, CELL);
    ctx.strokeStyle = "#0a2040";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, CELL, CELL);
  });
}
