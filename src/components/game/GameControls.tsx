"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import type { Difficulty } from "@/game/types";

interface GameControlsProps {
  onStart: (difficulty: Difficulty) => void;
  highScore: number;
}

const DIFFICULTIES: { key: Difficulty; label: string; desc: string; color: string }[] = [
  {
    key: "easy",
    label: "EASY",
    desc: "5 lives · 90s · Slow traffic",
    color: "text-[#39ff14]",
  },
  {
    key: "medium",
    label: "MEDIUM",
    desc: "3 lives · 60s · Normal traffic",
    color: "text-[#00f5ff]",
  },
  {
    key: "hard",
    label: "HARD",
    desc: "1 life · 40s · Fast traffic",
    color: "text-[#ff2d78]",
  },
];

/** Idle-screen difficulty selector and start button */
export default function GameControls({ onStart, highScore }: GameControlsProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-6 p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-widest neon-green animate-glow-pulse"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          FROGGER
        </h1>
        <p className="text-[#6060a0] text-xs mt-2 tracking-widest font-mono">
          CROSS THE ROAD · SURVIVE THE RIVER
        </p>
      </motion.div>

      {/* High score */}
      {highScore > 0 && (
        <motion.p
          className="text-[#fff01f] text-xs font-mono tracking-widest drop-shadow-[0_0_6px_#fff01f]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🏆 BEST: {highScore.toLocaleString()}
        </motion.p>
      )}

      {/* Difficulty cards */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        {DIFFICULTIES.map((d, i) => (
          <motion.button
            key={d.key}
            onClick={() => onStart(d.key)}
            className="flex-1 flex flex-col items-center gap-1.5 py-4 px-3 rounded-lg border-2 border-[#2a2a5a] bg-[#111122] hover:border-current cursor-pointer transition-all duration-200 group"
            style={{ color: d.color.replace("text-[", "").replace("]", "") }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span
              className={`font-bold tracking-widest text-sm ${d.color} drop-shadow-[0_0_8px_currentColor]`}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "10px" }}
            >
              {d.label}
            </span>
            <span className="text-[#8080a0] text-[10px] font-mono">{d.desc}</span>
          </motion.button>
        ))}
      </div>

      {/* Controls hint */}
      <motion.div
        className="text-[#4040608080] text-[10px] font-mono space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-[#404060]">⌨ Arrow keys / WASD to move · Space to pause</p>
        <p className="text-[#404060]">📱 Swipe on canvas or use D-pad on mobile</p>
      </motion.div>
    </motion.div>
  );
}
