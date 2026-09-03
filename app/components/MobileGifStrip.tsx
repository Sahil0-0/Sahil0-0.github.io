"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type GifType = "static" | "run" | "walk";
type GifEntry = { src: string; type: GifType };

// Phone only gets the gifs that travel across the screen — the static ones are
// framed against the sidebar's whitespace on desktop, which this strip has none of.
const MOVING_TYPES: GifType[] = ["run", "walk"];

// Matches LeftPanel's pacing so the two read as the same system.
const TRAVEL_SECONDS: Record<"run" | "walk", number> = { run: 10, walk: 15 };
const REPEAT_DELAY = 3;
// How far off each edge the sprite starts/ends, so it enters and leaves cleanly.
const OFFSCREEN_PX = 250;

export default function MobileGifStrip() {
  const [movingGifs, setMovingGifs] = useState<GifEntry[]>([]);
  const [gif, setGif] = useState<GifEntry | null>(null);
  const [width, setWidth] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/gifs/config.json")
      .then((r) => r.json())
      .then((gifs: GifEntry[]) => {
        const moving = gifs.filter((g) => MOVING_TYPES.includes(g.type));
        setMovingGifs(moving);
        setGif(moving[Math.floor(Math.random() * moving.length)] ?? null);
      })
      .catch(() => {
        /* Cosmetic only — if the manifest can't load, just show nothing. */
      });
  }, []);

  // Travel distance depends on the strip's width, so re-measure on resize
  // (a tablet rotating into the phone layout changes it).
  useEffect(() => {
    const measure = () => setWidth(stripRef.current?.offsetWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  // Swap in a different sprite once the current one has finished its run,
  // so the same character isn't looping forever.
  useEffect(() => {
    if (!gif || movingGifs.length === 0) return;
    const seconds = TRAVEL_SECONDS[gif.type as "run" | "walk"] + REPEAT_DELAY;
    const timer = setTimeout(() => {
      setGif(movingGifs[Math.floor(Math.random() * movingGifs.length)]);
    }, seconds * 1000);
    return () => clearTimeout(timer);
  }, [gif, movingGifs]);

  return (
    // `bottom-full` parks the strip directly on top of the nav bar's border,
    // and it's absolute so it overlays the grid rather than resizing it —
    // the grid's rows are `1fr`, so anything that takes footer height would
    // resize every tile.
    <div
      ref={stripRef}
      aria-hidden="true"
      className="absolute bottom-full left-0 right-0 h-[64px] z-20 overflow-hidden flex items-end pointer-events-none"
    >
      {gif && (
        <motion.div
          key={gif.src}
          className="inline-block h-full"
          initial={{ x: -OFFSCREEN_PX }}
          animate={{ x: [-OFFSCREEN_PX, width + OFFSCREEN_PX] }}
          transition={{
            duration: TRAVEL_SECONDS[gif.type as "run" | "walk"],
            repeat: Infinity,
            ease: "linear",
            repeatDelay: REPEAT_DELAY,
          }}
        >
          <img src={gif.src} alt="" className="max-h-full w-auto object-contain" />
        </motion.div>
      )}
    </div>
  );
}
