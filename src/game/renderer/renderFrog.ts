/**
 * Renders the player frog with hop animation and death flash.
 */

import { CELL, COLORS } from "../constants";
import type { FrogEntity } from "../types";
import { lerp } from "../../lib/utils";

export function renderFrog(
  ctx: CanvasRenderingContext2D,
  frog: FrogEntity,
  deathFlash: number
): void {
  // ── Death flash: blink every 5 frames ──────────────────────────────────────
  if (deathFlash > 0 && Math.floor(deathFlash / 4) % 2 === 0) return;

  // ── Interpolated render position ───────────────────────────────────────────
  const t = frog.hopProgress;
  const renderX = lerp(frog.prevX, frog.x, t);
  const renderY = lerp(frog.prevY, frog.y, t);

  // Parabolic hop arc: lifts up in the middle of the hop
  const arcHeight = CELL * 0.45;
  const arc = Math.sin(t * Math.PI) * arcHeight;

  const cx = renderX + CELL / 2;
  const cy = renderY + CELL / 2 - arc;

  ctx.save();
  ctx.translate(cx, cy);

  // Slight squeeze/stretch during hop
  const squishX = 1 + Math.sin(t * Math.PI) * 0.15;
  const squishY = 1 - Math.sin(t * Math.PI) * 0.12;
  ctx.scale(squishX, squishY);

  const bodyR = CELL * 0.36;

  // ── Shadow ─────────────────────────────────────────────────────────────────
  // Shadow projected below (arc grows as frog lifts)
  const shadowScale = 0.4 + 0.6 * (1 - Math.sin(t * Math.PI) * 0.7);
  ctx.save();
  ctx.scale(shadowScale, shadowScale * 0.3);
  ctx.beginPath();
  ctx.arc(0, bodyR * 3.5, bodyR * 1.1, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fill();
  ctx.restore();

  // ── Neon glow ──────────────────────────────────────────────────────────────
  ctx.shadowBlur = 16;
  ctx.shadowColor = COLORS.frogHighlight;

  // ── Body ───────────────────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.frogBody;
  ctx.fill();

  // Body highlight (top-left sheen)
  ctx.beginPath();
  ctx.arc(-bodyR * 0.25, -bodyR * 0.25, bodyR * 0.6, 0, Math.PI * 2);
  ctx.fillStyle = "#246614";
  ctx.fill();

  // Neon outline
  ctx.beginPath();
  ctx.arc(0, 0, bodyR, 0, Math.PI * 2);
  ctx.strokeStyle = COLORS.frogHighlight;
  ctx.lineWidth = 2;
  ctx.stroke();

  // ── Hind legs ─────────────────────────────────────────────────────────────
  const legOpenness = 0.3 + 0.7 * Math.sin(t * Math.PI);
  ctx.strokeStyle = COLORS.frogBody;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.shadowBlur = 4;
  // Left hind leg
  ctx.beginPath();
  ctx.moveTo(-bodyR * 0.6, bodyR * 0.5);
  ctx.quadraticCurveTo(-bodyR * (1.0 + legOpenness * 0.3), bodyR * 0.9, -bodyR * (0.8 + legOpenness * 0.4), bodyR * 1.2);
  ctx.stroke();
  // Right hind leg
  ctx.beginPath();
  ctx.moveTo(bodyR * 0.6, bodyR * 0.5);
  ctx.quadraticCurveTo(bodyR * (1.0 + legOpenness * 0.3), bodyR * 0.9, bodyR * (0.8 + legOpenness * 0.4), bodyR * 1.2);
  ctx.stroke();

  // ── Front legs ────────────────────────────────────────────────────────────
  ctx.lineWidth = 3;
  // Left front
  ctx.beginPath();
  ctx.moveTo(-bodyR * 0.7, -bodyR * 0.1);
  ctx.lineTo(-bodyR * 1.3, -bodyR * 0.4);
  ctx.stroke();
  // Right front
  ctx.beginPath();
  ctx.moveTo(bodyR * 0.7, -bodyR * 0.1);
  ctx.lineTo(bodyR * 1.3, -bodyR * 0.4);
  ctx.stroke();

  // ── Eyes ──────────────────────────────────────────────────────────────────
  ctx.shadowBlur = 8;
  ctx.shadowColor = COLORS.frogEye;
  ctx.fillStyle = COLORS.frogEye;
  const eyeR = CELL * 0.08;
  const eyeOffX = bodyR * 0.38;
  const eyeOffY = -bodyR * 0.45;
  ctx.beginPath();
  ctx.arc(-eyeOffX, eyeOffY, eyeR + 2, 0, Math.PI * 2);
  ctx.arc(eyeOffX, eyeOffY, eyeR + 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(-eyeOffX, eyeOffY, eyeR, 0, Math.PI * 2);
  ctx.arc(eyeOffX, eyeOffY, eyeR, 0, Math.PI * 2);
  ctx.fill();

  // ── Mouth ─────────────────────────────────────────────────────────────────
  ctx.strokeStyle = COLORS.frogHighlight + "88";
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(0, bodyR * 0.1, bodyR * 0.35, 0.1, Math.PI - 0.1);
  ctx.stroke();

  ctx.restore();
}
