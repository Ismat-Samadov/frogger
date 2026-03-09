"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import type { GamePhase, Difficulty } from "@/game/types";

interface EndScreenProps {
  phase: GamePhase;
  score: number;
  highScore: number;
  level: number;
  difficulty: Difficulty;
  onRestart: () => void;
  onNextLevel: () => void;
}

/** Win / Game-over overlay with animated entry */
export default function EndScreen({
  phase,
  score,
  highScore,
  level,
  difficulty,
  onRestart,
  onNextLevel,
}: EndScreenProps) {
  const isWon = phase === "won";
  const isLost = phase === "lost";
  const visible = isWon || isLost;

  const isNewBest = score > 0 && score >= highScore;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            background: isWon
              ? "rgba(0,20,5,0.88)"
              : "rgba(20,0,5,0.88)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Confetti-style background dots for win */}
          {isWon && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: ["#39ff14", "#00f5ff", "#fff01f", "#ff2d78", "#bf00ff"][i % 5],
                  }}
                  initial={{ opacity: 0, scale: 0, y: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1, 1, 0],
                    y: [0, -60 - Math.random() * 80],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: Math.random() * 0.8,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}

          {/* Main panel */}
          <motion.div
            className="relative flex flex-col items-center gap-5 p-8 rounded-2xl border z-10"
            style={{
              background: "#0d0d1f",
              borderColor: isWon ? "#39ff14" : "#ff2d78",
              minWidth: 260,
              maxWidth: 320,
              boxShadow: isWon
                ? "0 0 40px #39ff1440, 0 0 80px #39ff1420"
                : "0 0 40px #ff2d7840, 0 0 80px #ff2d7820",
            }}
            initial={{ scale: 0.6, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.6, y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
          >
            {/* Title */}
            <motion.h2
              className={isWon ? "neon-green" : "neon-pink"}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "13px", letterSpacing: "0.1em" }}
              animate={isWon ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isWon ? "🐸 LEVEL CLEAR!" : "💀 GAME OVER"}
            </motion.h2>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="flex items-center justify-between w-full px-2 py-2 rounded border border-[#2a2a5a] bg-[#0a0a1a]">
                <span className="text-[#6060a0] text-[10px] font-mono tracking-widest">SCORE</span>
                <span className="text-[#fff01f] text-sm font-bold font-mono drop-shadow-[0_0_6px_#fff01f]">
                  {score.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between w-full px-2 py-2 rounded border border-[#2a2a5a] bg-[#0a0a1a]">
                <span className="text-[#6060a0] text-[10px] font-mono tracking-widest">BEST</span>
                <span className="text-[#39ff14] text-sm font-bold font-mono drop-shadow-[0_0_6px_#39ff14]">
                  {highScore.toLocaleString()}
                </span>
              </div>

              {isWon && (
                <div className="flex items-center justify-between w-full px-2 py-2 rounded border border-[#2a2a5a] bg-[#0a0a1a]">
                  <span className="text-[#6060a0] text-[10px] font-mono tracking-widest">LEVEL</span>
                  <span className="text-[#00f5ff] text-sm font-bold font-mono drop-shadow-[0_0_6px_#00f5ff]">
                    {level}
                  </span>
                </div>
              )}

              {isNewBest && (
                <motion.p
                  className="text-[#fff01f] text-[9px] font-mono tracking-widest animate-neon-blink"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  ★ NEW HIGH SCORE! ★
                </motion.p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              {isWon && (
                <Button variant="primary" size="md" className="w-full" onClick={onNextLevel}>
                  ▶ Next Level
                </Button>
              )}
              <Button
                variant={isWon ? "secondary" : "primary"}
                size="md"
                className="w-full"
                onClick={onRestart}
              >
                ↩ {isWon ? "Main Menu" : "Try Again"}
              </Button>
            </div>

            {/* Difficulty badge */}
            <p className="text-[#40406080] text-[9px] font-mono tracking-wider">
              {difficulty.toUpperCase()} MODE
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
