"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const COLS = 7;
const ROWS = 7;
const CELL = 7;
const GAP = 2;
const PADDLE_CELLS = 3;
const TICK_MS = 145;
const LIT_PADDLE = 1;
const LIT_BALL = 0.7;
const UNLIT = 0.1;

type Frame = {
  x: number; y: number;   // ball cell
  dx: number; dy: number; // travel direction, one cell per tick
  left: number; right: number; // top row of each paddle
};

const INITIAL: Frame = { x: 1, y: 5, dx: 1, dy: -1, left: 4, right: 1 };

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);
const PADDLE_MAX = ROWS - PADDLE_CELLS;
const PADDLE_MID = Math.round(PADDLE_MAX / 2);

function advance(f: Frame): Frame {
  const dy = f.y + f.dy < 0 || f.y + f.dy > ROWS - 1 ? -f.dy : f.dy;
  const dx = f.x + f.dx < 1 || f.x + f.dx > COLS - 2 ? -f.dx : f.dx;
  const x = f.x + dx;
  const y = f.y + dy;
  const chase = (top: number, incoming: boolean) =>
    top + Math.sign((incoming ? clamp(y - 1, 0, PADDLE_MAX) : PADDLE_MID) - top);
  return {
    x, y, dx, dy,
    left: chase(f.left, dx < 0),
    right: chase(f.right, dx > 0),
  };
}

export default function PongLoader() {
  const [f, setFrame] = useState(INITIAL);

  useEffect(() => {
    const id = setInterval(() => setFrame(advance), TICK_MS);
    return () => clearInterval(id);
  }, []);

  const cells = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const onPaddle =
        (col === 0 && row >= f.left && row < f.left + PADDLE_CELLS) ||
        (col === COLS - 1 && row >= f.right && row < f.right + PADDLE_CELLS);
      const opacity = onPaddle ? LIT_PADDLE : col === f.x && row === f.y ? LIT_BALL : UNLIT;
      cells.push(
        <div
          key={`${row}-${col}`}
          style={{
            width: CELL,
            height: CELL,
            borderRadius: 2,
            background: "var(--text-primary)",
            opacity,
          }}
        />,
      );
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
    >
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, gap: GAP }}
      >
        {cells}
      </div>
    </motion.div>
  );
}
