"use client";

import { useState, useCallback } from "react";

const KEY = "frogger_highscore";

/** Read and write the all-time high score from localStorage */
export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return parseInt(localStorage.getItem(KEY) ?? "0", 10) || 0;
  });

  const saveHighScore = useCallback((score: number) => {
    setHighScore((prev) => {
      if (score > prev) {
        localStorage.setItem(KEY, String(score));
        return score;
      }
      return prev;
    });
  }, []);

  return { highScore, saveHighScore };
}
