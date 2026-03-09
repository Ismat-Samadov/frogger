"use client";

import { useReducer, useEffect, useRef, useCallback } from "react";
import { gameReducer } from "../game/state/gameReducer";
import { createInitialState } from "../game/state/initialState";
import type { GameAction } from "../game/state/actions";
import type { Difficulty } from "../game/types";
import { useGameLoop } from "./useGameLoop";
import { useKeyboard } from "./useKeyboard";
import { useTouch } from "./useTouch";
import { useAudio } from "./useAudio";
import { useHighScore } from "./useHighScore";
import { render } from "../game/renderer/index";
import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from "../game/constants";

/**
 * Central orchestration hook — connects reducer, game loop,
 * renderer, audio, input, and high score persistence.
 */
export function useGame() {
  // ── State ─────────────────────────────────────────────────────────────────
  const [state, dispatch] = useReducer(gameReducer, undefined, () =>
    createInitialState("medium")
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Sub-hooks ─────────────────────────────────────────────────────────────
  const { highScore, saveHighScore } = useHighScore();
  const { play, startBG, stopBG } = useAudio(state.isMuted);

  // Drive the RAF loop only while playing
  useGameLoop(dispatch, state.phase === "playing");

  // Keyboard input
  useKeyboard(dispatch, state.phase);

  // Touch/swipe on canvas
  useTouch(canvasRef, dispatch, state.phase);

  // ── Canvas rendering ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    render(ctx, state);
  }, [state]);

  // ── Audio side-effects ────────────────────────────────────────────────────
  // React to events (hop, squish, splash, score, etc.)
  useEffect(() => {
    if (state.lastEvent === "none") return;
    switch (state.lastEvent) {
      case "hop":      play("hop");      break;
      case "squish":   play("squish");   break;
      case "splash":   play("splash");   break;
      case "score":    play("score");    break;
      case "levelWon": play("win");      break;
      case "gameOver": play("gameover"); break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.eventCount]);

  // Background music: start/stop with phase
  useEffect(() => {
    if (state.phase === "playing") startBG();
    else stopBG();
  }, [state.phase, startBG, stopBG]);

  // ── High score persistence ────────────────────────────────────────────────
  useEffect(() => {
    if (state.phase === "lost" || state.phase === "won") {
      saveHighScore(state.score);
    }
  }, [state.phase, state.score, saveHighScore]);

  // ── Convenience action dispatchers ────────────────────────────────────────
  const startGame = useCallback(
    (difficulty: Difficulty) => dispatch({ type: "START_GAME", difficulty }),
    []
  );
  const pause = useCallback(() => dispatch({ type: "PAUSE" }), []);
  const resume = useCallback(() => dispatch({ type: "RESUME" }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
  const nextLevel = useCallback(() => dispatch({ type: "NEXT_LEVEL" }), []);
  const toggleMute = useCallback(() => dispatch({ type: "TOGGLE_MUTE" }), []);
  const moveUp = useCallback(() => dispatch({ type: "MOVE_FROG", direction: "up" }), []);
  const moveDown = useCallback(() => dispatch({ type: "MOVE_FROG", direction: "down" }), []);
  const moveLeft = useCallback(() => dispatch({ type: "MOVE_FROG", direction: "left" }), []);
  const moveRight = useCallback(() => dispatch({ type: "MOVE_FROG", direction: "right" }), []);

  return {
    state,
    dispatch,
    canvasRef,
    highScore,
    // Action helpers
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
    // Canvas dimensions (fixed logical resolution)
    canvasWidth: LOGICAL_WIDTH,
    canvasHeight: LOGICAL_HEIGHT,
  };
}
