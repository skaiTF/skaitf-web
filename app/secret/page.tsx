"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Press_Start_2P } from "next/font/google";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] });

const CANVAS_W = 400;
const CANVAS_H = 500;
const PLAYER_W = 60;
const PLAYER_H = 12;
const PLAYER_Y = CANVAS_H - 40;
const PLAYER_SPEED = 5;
const HEARTS_TO_WIN = 10;

// 8×6 pixel heart shape
const HEART_PIXELS = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
];
const PIXEL_SIZE = 4;
const HEART_W = 8 * PIXEL_SIZE;
const HEART_H = 6 * PIXEL_SIZE;

const PASSWORD = (process.env.NEXT_PUBLIC_SECRET_PASSWORD ?? "").toLowerCase();

type Heart = { x: number; y: number; speed: number };
type GameState = "locked" | "idle" | "playing" | "won";

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  for (let row = 0; row < HEART_PIXELS.length; row++) {
    for (let col = 0; col < HEART_PIXELS[row].length; col++) {
      if (HEART_PIXELS[row][col]) {
        ctx.fillRect(x + col * PIXEL_SIZE, y + row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }
}

// Deterministic float hearts — avoids SSR/hydration mismatch
const FLOAT_HEARTS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: (i * 7.3) % 100,
  delay: (i * 0.43) % 3,
  duration: 3 + (i * 0.37) % 3,
  size: 16 + (i * 11) % 24,
}));

export default function SecretPage() {
  const [gameState, setGameState] = useState<GameState>("locked");
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.toLowerCase() === PASSWORD) {
      setGameState("idle");
    } else {
      setPasswordError(true);
      setPasswordInput("");
      setTimeout(() => setPasswordError(false), 820);
    }
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerXRef = useRef(CANVAS_W / 2 - PLAYER_W / 2);
  const heartsRef = useRef<Heart[]>([]);
  const scoreRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });
  const rafRef = useRef<number>(0);
  const lastSpawnRef = useRef<number>(0);

  const spawnHeart = useCallback(() => {
    heartsRef.current.push({
      x: Math.random() * (CANVAS_W - HEART_W),
      y: -HEART_H,
      speed: 2 + Math.min(scoreRef.current * 0.15, 4),
    });
  }, []);

  const gameLoop = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!ctx || !canvas) {
        // Canvas not yet mounted (AnimatePresence delay) — retry next frame
        rafRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Spawn
      if (timestamp - lastSpawnRef.current > 1200) {
        spawnHeart();
        lastSpawnRef.current = timestamp;
      }

      // Move player
      if (keysRef.current.left) playerXRef.current = Math.max(0, playerXRef.current - PLAYER_SPEED);
      if (keysRef.current.right) playerXRef.current = Math.min(CANVAS_W - PLAYER_W, playerXRef.current + PLAYER_SPEED);

      const px = playerXRef.current;

      // Update hearts + collision
      heartsRef.current = heartsRef.current.filter((h) => {
        h.y += h.speed;
        const hit =
          h.x < px + PLAYER_W &&
          h.x + HEART_W > px &&
          h.y + HEART_H > PLAYER_Y &&
          h.y < PLAYER_Y + PLAYER_H;
        if (hit) {
          scoreRef.current += 1;
          if (scoreRef.current >= HEARTS_TO_WIN) {
            setGameState("won");
            cancelAnimationFrame(rafRef.current);
          }
          return false;
        }
        return h.y < CANVAS_H + HEART_H;
      });

      // --- Draw ---
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Border
      ctx.strokeStyle = "#FF6B8A";
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, CANVAS_W - 4, CANVAS_H - 4);

      // Score
      ctx.fillStyle = "#FF6B8A";
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.fillText(`♥ ${scoreRef.current} / ${HEARTS_TO_WIN}`, 16, 28);

      // Hearts
      heartsRef.current.forEach((h) => drawHeart(ctx, h.x, h.y, "#FF0054"));

      // Player paddle
      ctx.fillStyle = "#FF6B8A";
      ctx.fillRect(px, PLAYER_Y, PLAYER_W, PLAYER_H);
      // highlight strip
      ctx.fillStyle = "#FFB3C6";
      ctx.fillRect(px, PLAYER_Y, PLAYER_W, 3);

      // Scanline overlay
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      for (let y = 0; y < CANVAS_H; y += 4) {
        ctx.fillRect(0, y, CANVAS_W, 1);
      }

      rafRef.current = requestAnimationFrame(gameLoop);
    },
    [spawnHeart]
  );

  const startGame = useCallback(() => {
    scoreRef.current = 0;
    playerXRef.current = CANVAS_W / 2 - PLAYER_W / 2;
    heartsRef.current = [];
    lastSpawnRef.current = 0;
    keysRef.current = { left: false, right: false };
    setGameState("playing");
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, gameLoop]);

  return (
    <div
      className={`${pixelFont.className} min-h-screen bg-black flex flex-col items-center justify-center px-4`}
    >
      <AnimatePresence>
        {gameState === "locked" && (
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <p className="text-pink-400 text-xs tracking-widest">★ ENTER PASSWORD ★</p>
            <p className="text-zinc-600 text-[8px]"> Tip: the cute name you call me :3 </p>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center gap-4">
              <motion.input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                maxLength={20}
                autoFocus
                placeholder="_ _ _ _"
                animate={passwordError ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className={[
                  "bg-black text-center text-pink-400 text-sm",
                  "border-2 px-4 py-3 w-48 outline-none",
                  "placeholder:text-zinc-700 tracking-widest",
                  passwordError
                    ? "border-red-500 text-red-400"
                    : "border-pink-400 focus:border-pink-300",
                ].join(" ")}
                style={{ fontFamily: "inherit", imageRendering: "pixelated" }}
              />

              {passwordError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs"
                >
                  WRONG PASSWORD
                </motion.p>
              )}

              <motion.button
                type="submit"
                className="text-pink-400 text-xs border border-pink-400 px-6 py-3 hover:bg-pink-400 hover:text-black transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ENTER
              </motion.button>
            </form>
          </motion.div>
        )}

        {gameState === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <motion.p
              className="text-pink-400 text-4xl"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              ♥
            </motion.p>
            <p className="text-white text-xs leading-loose">
              catch 10 hearts<br />to unlock a secret message
            </p>
            <p className="text-zinc-600 text-xs">
              ← → &nbsp;or&nbsp; A D to move
            </p>
            <motion.button
              onClick={startGame}
              className="text-pink-400 text-sm border border-pink-400 px-6 py-3 hover:bg-pink-400 hover:text-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              PRESS START
            </motion.button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              className="border border-pink-900"
              style={{ imageRendering: "pixelated", maxWidth: "100%", maxHeight: "70vh" }}
            />
            {/* Mobile controls */}
            <div className="flex gap-8 sm:hidden">
              <button
                className="text-white text-2xl border border-zinc-700 px-8 py-4 select-none active:bg-zinc-800"
                onPointerDown={() => (keysRef.current.left = true)}
                onPointerUp={() => (keysRef.current.left = false)}
                onPointerLeave={() => (keysRef.current.left = false)}
              >
                ←
              </button>
              <button
                className="text-white text-2xl border border-zinc-700 px-8 py-4 select-none active:bg-zinc-800"
                onPointerDown={() => (keysRef.current.right = true)}
                onPointerUp={() => (keysRef.current.right = false)}
                onPointerLeave={() => (keysRef.current.right = false)}
              >
                →
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "won" && (
          <motion.div
            key="won"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex flex-col items-center gap-6 text-center"
          >
            {/* Floating background hearts */}
            {FLOAT_HEARTS.map((fh) => (
              <motion.span
                key={fh.id}
                className="fixed pointer-events-none select-none text-pink-400"
                style={{ left: `${fh.left}%`, bottom: 0 }}
                animate={{ y: [0, -1400] }}
                transition={{
                  duration: fh.duration,
                  delay: fh.delay,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span style={{ fontSize: fh.size, opacity: 0.55 }}>♥</span>
              </motion.span>
            ))}

            {/* Main message */}
            <motion.p
              className="text-pink-400 text-2xl relative z-10"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              I LOVE YOU ♥
            </motion.p>

            <motion.p
              className="text-zinc-300 text-xs leading-loose relative z-10 max-w-xs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              you make everything better
            </motion.p>

            <motion.button
              className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors relative z-10 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={startGame}
            >
              play again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
