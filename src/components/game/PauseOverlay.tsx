"use client";

import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";

interface PauseOverlayProps {
  visible: boolean;
  isMuted: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleMute: () => void;
}

/** Fullscreen pause overlay with framer-motion animations */
export default function PauseOverlay({
  visible,
  isMuted,
  onResume,
  onRestart,
  onToggleMute,
}: PauseOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            background: "rgba(5,5,20,0.82)",
            backdropFilter: "blur(4px)",
          }}
        >
          {/* Panel */}
          <motion.div
            className="flex flex-col items-center gap-5 p-8 rounded-2xl border border-[#2a2a5a]"
            style={{ background: "#111122", minWidth: 240 }}
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2
              className="text-[#00f5ff] text-lg tracking-widest drop-shadow-[0_0_10px_#00f5ff]"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px" }}
            >
              PAUSED
            </h2>

            <div className="flex flex-col gap-3 w-full">
              <Button variant="primary" size="md" className="w-full" onClick={onResume}>
                ▶ Resume
              </Button>
              <Button variant="secondary" size="md" className="w-full" onClick={onToggleMute}>
                {isMuted ? "🔇 Unmute" : "🔊 Mute"}
              </Button>
              <Button variant="danger" size="md" className="w-full" onClick={onRestart}>
                ↩ Quit
              </Button>
            </div>

            <p className="text-[#40406080] text-[10px] font-mono tracking-wider">
              Press Space or Esc to resume
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
