# 🐸 FROGGER — Neon Retro Arcade

A full-stack browser game built with **Next.js 16**, **TypeScript** (strict), and **Tailwind CSS 4**. Features a cohesive neon retro aesthetic, smooth animations, procedural audio, and full mobile support.

---

## ✨ Features

- **HTML5 Canvas rendering** — pixel-perfect neon graphics at a fixed 432×624 logical resolution, scaled to any screen
- **Three difficulty levels** — Easy (5 lives, 90s), Medium (3 lives, 60s), Hard (1 life, 40s)
- **Speed progression** — each successive level is 12% faster than the last
- **Procedural audio** — all sound effects and background music generated live via the Web Audio API (no audio files required)
- **High-score persistence** — best score saved to `localStorage` across sessions
- **Pause / resume** — press Space or the pause button at any time
- **Animated end screens** — particle-confetti win screen; dramatic game-over screen
- **Full touch support** — swipe gestures on the canvas + on-screen D-pad for mobile
- **Neon CRT aesthetic** — scanlines, glow effects, animated water ripples, frog hop arc

---

## 🎮 Controls

| Platform | Move | Pause |
|----------|------|-------|
| **Keyboard** | Arrow keys or WASD | Space / Escape |
| **Mobile** | Swipe on canvas | — |
| **Mobile D-pad** | ▲ ▼ ◀ ▶ buttons | — |
| **Any** | M key | Toggle mute |

---

## 🕹 Gameplay

1. **Start** — choose a difficulty on the main screen
2. **Cross the road** (rows 7–11) — avoid cars moving in alternating directions
3. **Cross the river** (rows 1–5) — jump onto logs; don't fall in the water
4. **Fill lily pads** (row 0) — land on one of the 5 neon pads at columns 0, 2, 4, 6, 8
5. **Win a level** — fill all 5 lily pads before the timer runs out
6. **Lives** — you lose a life when hit by a car, falling in the river, landing on a gap/filled pad, or when the timer expires
7. **Score** — +10 per forward hop, +50 per lily pad filled, +1000 per level complete

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| Animations | Framer Motion 12 |
| Rendering | HTML5 Canvas API |
| Audio | Web Audio API (procedural synthesis) |
| State | React `useReducer` (pure reducer) |
| Persistence | `localStorage` |

---

## 📁 Project Structure

```
src/
├── app/               # Next.js App Router
│   ├── layout.tsx     # Root layout + metadata
│   ├── page.tsx       # Route → renders <GamePage>
│   └── globals.css    # Tailwind + neon theme + keyframes
│
├── components/
│   ├── GamePage.tsx   # Root client component (assembles all UI)
│   ├── ui/            # Button, Badge (reusable UI primitives)
│   └── game/          # GameCanvas, GameHUD, TouchControls, PauseOverlay, EndScreen, GameControls
│
├── game/
│   ├── types.ts       # All TypeScript domain types
│   ├── constants.ts   # Grid dims, difficulty configs, colours
│   ├── state/         # gameReducer, actions, initialState (pure)
│   ├── engine/        # entities (factories), physics (collisions)
│   ├── renderer/      # Canvas draw calls (background, frog, obstacles, effects)
│   └── audio/         # AudioManager (Web Audio API singleton)
│
├── hooks/
│   ├── useGame.ts     # Central orchestration: wires everything together
│   ├── useGameLoop.ts # requestAnimationFrame driver
│   ├── useKeyboard.ts # Keyboard input → dispatch
│   ├── useTouch.ts    # Touch/swipe → dispatch
│   ├── useAudio.ts    # AudioManager wrapper
│   ├── useHighScore.ts # localStorage persistence
│   └── useWindowSize.ts # Responsive canvas scaling
│
└── lib/
    └── utils.ts       # cn(), lerp(), clamp(), formatTime(), formatScore()
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

Requirements: **Node.js ≥ 18**

---

## ☁️ Deploying to Vercel

The project is deploy-ready with zero configuration needed.

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — Vercel Dashboard
1. Push the repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — no environment variables required

---

## 📱 Mobile Notes

- The canvas automatically scales to fit the viewport while maintaining the 432×624 aspect ratio
- Touch swipe gestures work on the canvas for quick play
- The D-pad overlay appears below the canvas on screens smaller than `md` (768px)
- Viewport is locked to prevent zoom/scroll during gameplay (`maximum-scale=1`)

---

## 🎵 Audio

All sounds are synthesised in real-time using the Web Audio API:

| Event | Sound |
|-------|-------|
| Hop | Short square-wave click |
| Splash | White-noise burst + bloop |
| Squish | Sawtooth descending buzz |
| Lily pad scored | C-E-G arpeggio chime |
| Level complete | Ascending 4-note melody |
| Game over | Descending sweep |
| Background | 8-bit style repeating melody |

Audio is initialised on the first user interaction to comply with browser autoplay policies. Toggle with the **🔊/🔇** button in the HUD or press **M**.
