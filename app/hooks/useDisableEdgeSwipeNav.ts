"use client";

import { useEffect } from "react";

// How close to the screen edge a touch has to start before we treat it as a
// swipe-navigation attempt rather than normal content interaction.
const EDGE_PX = 24;

/**
 * Blocks the browser's edge-swipe back/forward navigation gesture, which
 * plays its own native page transition independent of the app's JS and
 * fights our project-open/close animations. Works by intercepting the touch
 * before the browser's gesture recognizer claims it, so it applies uniformly
 * across browsers/engines rather than relying on any single one's CSS
 * support (e.g. WebKit's overscroll-behavior-x, which only some versions
 * honor for this gesture).
 */
export default function useDisableEdgeSwipeNav() {
  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      const x = e.touches[0]?.clientX;
      if (x === undefined) return;
      if (x <= EDGE_PX || x >= window.innerWidth - EDGE_PX) {
        e.preventDefault();
      }
    }

    document.addEventListener("touchstart", onTouchStart, { passive: false });
    return () => document.removeEventListener("touchstart", onTouchStart);
  }, []);
}
