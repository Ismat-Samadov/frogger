/**
 * Main render dispatcher — called once per frame with the full game state.
 * Drawing order follows the painters algorithm (back to front).
 */

import type { GameState } from "../types";
import { renderBackground } from "./renderBackground";
import { renderLilyPads } from "./renderLilyPads";
import { renderLogs, renderCars } from "./renderObstacles";
import { renderFrog } from "./renderFrog";
import { renderDeathFlash, renderVignette, renderScanlines, renderBorder } from "./renderEffects";

/** Monotonic frame counter used for animations (passed in by the game loop) */
let _tick = 0;

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  _tick++;

  // 1. Background zones (road, river, safe zones)
  renderBackground(ctx, _tick);

  // 2. Lily-pad goal slots
  renderLilyPads(ctx, state.lilyPads, _tick);

  // 3. Logs (river platforms — drawn before frog so frog appears on top)
  renderLogs(ctx, state.logs);

  // 4. Cars (road obstacles)
  renderCars(ctx, state.cars);

  // 5. Player frog
  renderFrog(ctx, state.frog, state.deathFlash);

  // 6. Post-process effects (drawn on top of everything)
  renderDeathFlash(ctx, state.deathFlash);
  renderVignette(ctx);
  renderScanlines(ctx);
  renderBorder(ctx, _tick);
}
