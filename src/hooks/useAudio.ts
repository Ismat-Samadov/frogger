"use client";

import { useEffect, useRef, useCallback } from "react";
import AudioManager from "../game/audio/AudioManager";
import type { SoundKey } from "../game/audio/AudioManager";

/**
 * Wraps the AudioManager singleton.
 * The AudioContext is initialised on the first user interaction (required by browsers).
 */
export function useAudio(isMuted: boolean) {
  const initialised = useRef(false);

  // Initialise AudioContext on first interaction
  const ensureInit = useCallback(() => {
    if (initialised.current) return;
    initialised.current = true;
    AudioManager.getInstance().init();
  }, []);

  useEffect(() => {
    // Listen for the first interaction to initialise audio
    const handler = () => ensureInit();
    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [ensureInit]);

  // Sync mute state
  useEffect(() => {
    AudioManager.getInstance().setMuted(isMuted);
  }, [isMuted]);

  const play = useCallback((key: SoundKey) => {
    AudioManager.getInstance().play(key);
  }, []);

  const startBG = useCallback(() => {
    AudioManager.getInstance().startBGMusic();
  }, []);

  const stopBG = useCallback(() => {
    AudioManager.getInstance().stopBGMusic();
  }, []);

  return { play, startBG, stopBG };
}
