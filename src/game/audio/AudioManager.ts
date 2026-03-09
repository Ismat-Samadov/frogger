/**
 * AudioManager — singleton that generates all sounds procedurally via Web Audio API.
 * No audio files are required. Sounds are synthesized on-the-fly.
 *
 * Must be initialised inside a user-gesture handler to satisfy browser autoplay policy.
 */

export type SoundKey =
  | "hop"
  | "splash"
  | "squish"
  | "score"
  | "win"
  | "gameover";

class AudioManager {
  private static instance: AudioManager | null = null;

  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgOscillator: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private bgRunning = false;
  private muted = false;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  /** Must be called inside a user-gesture handler */
  init(): void {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 1;
    this.masterGain.connect(this.ctx.destination);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx!.currentTime, 0.05);
    }
  }

  play(key: SoundKey): void {
    if (!this.ctx || !this.masterGain || this.muted) return;
    if (this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
    switch (key) {
      case "hop":      this.playHop(); break;
      case "splash":   this.playSplash(); break;
      case "squish":   this.playSquish(); break;
      case "score":    this.playScore(); break;
      case "win":      this.playWin(); break;
      case "gameover": this.playGameOver(); break;
    }
  }

  // ─── Background music ─────────────────────────────────────────────────────

  startBGMusic(): void {
    if (!this.ctx || !this.masterGain || this.bgRunning) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    this.bgRunning = true;
    this.scheduleBGMusic();
  }

  stopBGMusic(): void {
    this.bgRunning = false;
    if (this.bgGain && this.ctx) {
      this.bgGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
    setTimeout(() => {
      try { this.bgOscillator?.stop(); } catch { /* already stopped */ }
      this.bgOscillator = null;
      this.bgGain = null;
    }, 300);
  }

  private scheduleBGMusic(): void {
    if (!this.ctx || !this.masterGain || !this.bgRunning) return;

    // 8-bit style melody — C major pentatonic arpeggio
    const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
    const tempo = 130; // BPM
    const beatDuration = 60 / tempo / 2; // 8th notes
    const patternLength = notes.length;

    this.bgOscillator = this.ctx.createOscillator();
    this.bgGain = this.ctx.createGain();
    this.bgOscillator.type = "square";
    this.bgGain.gain.value = 0.04;
    this.bgOscillator.connect(this.bgGain);
    this.bgGain.connect(this.masterGain);

    let t = this.ctx.currentTime + 0.05;
    this.bgOscillator.start(t);

    const scheduleChunk = () => {
      if (!this.bgRunning || !this.ctx || !this.bgOscillator || !this.bgGain) return;

      // Schedule 2 full pattern iterations ahead
      for (let rep = 0; rep < 2; rep++) {
        for (let i = 0; i < patternLength; i++) {
          this.bgOscillator.frequency.setValueAtTime(notes[i], t);
          this.bgGain.gain.setValueAtTime(0.04, t);
          this.bgGain.gain.setValueAtTime(0.0, t + beatDuration * 0.85);
          t += beatDuration;
        }
      }

      const delay = Math.max(0, (t - this.ctx.currentTime - 0.3) * 1000);
      setTimeout(() => {
        if (this.bgRunning) scheduleChunk();
      }, delay);
    };

    scheduleChunk();
  }

  // ─── Individual sound generators ─────────────────────────────────────────

  private playHop(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.06);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  private playSplash(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime;

    // White noise burst
    const bufLen = ctx.sampleRate * 0.25;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    src.buffer = buf;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    src.start(t);

    // Low "bloop" tone
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.25);
  }

  private playSquish(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  private playScore(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime;
    const chord = [523.25, 659.25, 783.99]; // C5, E5, G5

    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = t + i * 0.05;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + 0.45);
    });
  }

  private playWin(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime;
    const melody = [261.63, 329.63, 392.0, 523.25]; // C, E, G, C2
    const dur = 0.15;

    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      const start = t + i * dur;
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.9);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + dur);
    });

    // Final chord
    const chordStart = t + melody.length * dur;
    [261.63, 392.0, 523.25].forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, chordStart);
      gain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.8);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(chordStart);
      osc.stop(chordStart + 0.9);
    });
  }

  private playGameOver(): void {
    const { ctx, masterGain } = this;
    if (!ctx || !masterGain) return;
    const t = ctx.currentTime;
    const melody = [392.0, 329.63, 261.63]; // G, E, C (descending)
    const dur = 0.2;

    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      const start = t + i * dur;
      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.8);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(start);
      osc.stop(start + dur);
    });

    // Low descending sweep
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepOsc.type = "sine";
    sweepOsc.frequency.setValueAtTime(200, t + melody.length * dur);
    sweepOsc.frequency.exponentialRampToValueAtTime(40, t + melody.length * dur + 0.6);
    sweepGain.gain.setValueAtTime(0.25, t + melody.length * dur);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, t + melody.length * dur + 0.7);
    sweepOsc.connect(sweepGain);
    sweepGain.connect(masterGain);
    sweepOsc.start(t + melody.length * dur);
    sweepOsc.stop(t + melody.length * dur + 0.8);
  }
}

export default AudioManager;
