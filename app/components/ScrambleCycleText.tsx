"use client";

import { useEffect, useState } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TOTAL_STEPS = 20;

type Props = {
  words: string[];
  prefix?: string;
  holdMs?: number;
  scrambleMs?: number;
  className?: string;
};

export default function ScrambleCycleText({
  words,
  prefix = "",
  holdMs = 3000,
  scrambleMs = 500,
  className,
}: Props) {
  const [display, setDisplay] = useState(words[0] ?? "");

  useEffect(() => {
    if (words.length === 0) return;
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let wordIndex = 0;

    function scrambleTo(target: string, onDone: () => void) {
      // Each letter locks onto its final value at its own random tick, so
      // letters resolve out of order instead of a mechanical left-to-right sweep.
      const lockStep = target
        .split("")
        .map(() => Math.round(TOTAL_STEPS * 0.4 + Math.random() * TOTAL_STEPS * 0.6));
      let tick = 0;
      intervalId = setInterval(() => {
        tick++;
        let out = "";
        let allLocked = true;
        for (let i = 0; i < target.length; i++) {
          if (target[i] === " ") {
            out += " ";
            continue;
          }
          if (tick >= lockStep[i]) {
            out += target[i];
          } else {
            out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            allLocked = false;
          }
        }
        setDisplay(out);
        if (allLocked || tick >= TOTAL_STEPS) {
          if (intervalId) clearInterval(intervalId);
          setDisplay(target);
          onDone();
        }
      }, scrambleMs / TOTAL_STEPS);
    }

    function cycle() {
      if (cancelled) return;
      scrambleTo(words[wordIndex], () => {
        timeoutId = setTimeout(() => {
          if (cancelled) return;
          wordIndex = (wordIndex + 1) % words.length;
          cycle();
        }, holdMs);
      });
    }

    cycle();

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [words, holdMs, scrambleMs]);

  return (
    <span className={className}>
      {prefix}
      {display}
    </span>
  );
}
