"use client";

import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatTime, formatScore } from "@/lib/utils";
import type { GamePhase, Difficulty } from "@/game/types";

interface GameHUDProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  timer: number;
  difficulty: Difficulty;
  phase: GamePhase;
  isMuted: boolean;
  onPause: () => void;
  onToggleMute: () => void;
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "EASY",
  medium: "MED",
  hard: "HARD",
};

const DIFFICULTY_COLORS: Record<Difficulty, "green" | "cyan" | "pink"> = {
  easy: "green",
  medium: "cyan",
  hard: "pink",
};

/** Top HUD bar — score, lives, timer, level, mute, and pause controls */
export default function GameHUD({
  score,
  highScore,
  lives,
  level,
  timer,
  difficulty,
  phase,
  isMuted,
  onPause,
  onToggleMute,
}: GameHUDProps) {
  const isPlaying = phase === "playing";
  const timerColor = timer <= 10 ? "pink" : timer <= 20 ? "yellow" : "cyan";

  return (
    <div
      className="flex items-center justify-between w-full px-2 py-1.5 gap-1.5"
      style={{
        background: "linear-gradient(180deg, #0d0d1f 0%, #0a0a14 100%)",
        borderBottom: "1px solid #1a1a3a",
      }}
    >
      {/* Left: Score + High Score */}
      <div className="flex gap-1.5">
        <Badge label="Score" value={formatScore(score)} color="yellow" />
        <Badge label="Best" value={formatScore(highScore)} color="green" />
      </div>

      {/* Centre: Lives + Level */}
      <div className="flex items-center gap-1.5">
        {/* Lives as frog icons */}
        <div className="flex flex-col items-center px-2 py-1 border border-[#2a2a5a] rounded bg-[#111122]/80">
          <span className="text-[9px] text-[#6060a0] tracking-widest uppercase font-mono">Lives</span>
          <div className="flex gap-0.5 mt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-sm transition-all ${i < lives ? "neon-green" : "text-[#2a2a4a]"}`}
                aria-hidden="true"
              >
                🐸
              </span>
            ))}
          </div>
        </div>
        <Badge label="Level" value={level} color="cyan" />
        <Badge
          label="Mode"
          value={DIFFICULTY_LABELS[difficulty]}
          color={DIFFICULTY_COLORS[difficulty]}
        />
      </div>

      {/* Right: Timer + Controls */}
      <div className="flex items-center gap-1.5">
        <Badge label="Time" value={formatTime(timer)} color={timerColor} />

        {/* Mute toggle */}
        <button
          onClick={onToggleMute}
          className="flex flex-col items-center px-2 py-1 border border-[#2a2a5a] rounded bg-[#111122]/80 hover:border-[#39ff14] transition-colors cursor-pointer"
          title={isMuted ? "Unmute (M)" : "Mute (M)"}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <span className="text-[9px] text-[#6060a0] tracking-widest uppercase font-mono">Sound</span>
          <span className="text-sm mt-0.5">{isMuted ? "🔇" : "🔊"}</span>
        </button>

        {/* Pause button */}
        {isPlaying && (
          <button
            onClick={onPause}
            className="flex flex-col items-center px-2 py-1 border border-[#2a2a5a] rounded bg-[#111122]/80 hover:border-[#00f5ff] transition-colors cursor-pointer"
            title="Pause (Space)"
            aria-label="Pause"
          >
            <span className="text-[9px] text-[#6060a0] tracking-widest uppercase font-mono">Pause</span>
            <span className="text-sm mt-0.5">⏸</span>
          </button>
        )}
      </div>
    </div>
  );
}
