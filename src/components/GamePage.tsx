"use client";

import { AnimatePresence } from "framer-motion";
import { useGame } from "@/hooks/useGame";
import { useWindowSize } from "@/hooks/useWindowSize";
import GameCanvas from "./game/GameCanvas";
import GameHUD from "./game/GameHUD";
import GameControls from "./game/GameControls";
import TouchControls from "./game/TouchControls";
import PauseOverlay from "./game/PauseOverlay";
import EndScreen from "./game/EndScreen";

/**
 * Root client component — assembles all game UI pieces.
 * Receives the fully orchestrated game state from useGame().
 */
export default function GamePage() {
  const {
    state,
    canvasRef,
    highScore,
    startGame,
    pause,
    resume,
    restart,
    nextLevel,
    toggleMute,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    canvasWidth,
    canvasHeight,
  } = useGame();

  const { cssWidth, cssHeight } = useWindowSize();

  const isInGame =
    state.phase === "playing" ||
    state.phase === "paused" ||
    state.phase === "won" ||
    state.phase === "lost";

  return (
    <div
      className="flex flex-col items-center min-h-screen bg-[#0a0a14]"
      style={{ userSelect: "none" }}
    >
      {/* ── HUD (always visible when not idle) ── */}
      {isInGame && (
        <GameHUD
          score={state.score}
          highScore={highScore}
          lives={state.lives}
          level={state.level}
          timer={state.timer}
          difficulty={state.difficulty}
          phase={state.phase}
          isMuted={state.isMuted}
          onPause={pause}
          onToggleMute={toggleMute}
        />
      )}

      {/* ── Main content area ── */}
      <div className="flex flex-1 items-center justify-center w-full py-2 px-2">
        {state.phase === "idle" ? (
          /* ── Idle: show the start screen on top of a frozen canvas ── */
          <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            {/* Decorative canvas preview (non-interactive) */}
            <div className="relative">
              <GameCanvas
                canvasRef={canvasRef}
                cssWidth={cssWidth}
                cssHeight={cssHeight}
              />
              {/* Dark overlay so the start screen stands out */}
              <div className="absolute inset-0 bg-[#0a0a14]/80 rounded-sm flex items-center justify-center">
                <GameControls onStart={startGame} highScore={highScore} />
              </div>
            </div>
          </div>
        ) : (
          /* ── Active game ── */
          <div className="relative flex flex-col items-center">
            {/* Canvas */}
            <div className="relative">
              <GameCanvas
                canvasRef={canvasRef}
                cssWidth={cssWidth}
                cssHeight={cssHeight}
              />

              {/* Pause overlay */}
              <PauseOverlay
                visible={state.phase === "paused"}
                isMuted={state.isMuted}
                onResume={resume}
                onRestart={restart}
                onToggleMute={toggleMute}
              />

              {/* End screen (won / lost) */}
              <EndScreen
                phase={state.phase}
                score={state.score}
                highScore={highScore}
                level={state.level}
                difficulty={state.difficulty}
                onRestart={restart}
                onNextLevel={nextLevel}
              />
            </div>

            {/* Mobile D-pad */}
            <TouchControls
              onMove={(dir) => {
                if (state.phase !== "playing") return;
                switch (dir) {
                  case "up":    moveUp();    break;
                  case "down":  moveDown();  break;
                  case "left":  moveLeft();  break;
                  case "right": moveRight(); break;
                }
              }}
              disabled={state.phase !== "playing"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
