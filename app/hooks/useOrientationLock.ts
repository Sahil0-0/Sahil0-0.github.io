"use client";

import { useEffect } from "react";

type DeviceClass = "phone" | "tablet" | "desktop";

/** Classify by the device's shorter screen edge (orientation-independent). */
function getDeviceClass(): DeviceClass {
  const shortEdge = Math.min(window.screen.width, window.screen.height);
  if (shortEdge <= 600) return "phone";
  if (shortEdge <= 1024) return "tablet";
  return "desktop";
}

/**
 * Best-effort native orientation lock: phones → portrait, tablets → landscape.
 * Uses the Screen Orientation API, which only takes effect on browsers that
 * support it in the current context (mainly Android/Chrome, and typically only
 * in fullscreen/installed contexts). It silently no-ops elsewhere — notably on
 * iOS Safari, which does not implement orientation locking at all.
 */
export default function useOrientationLock() {
  useEffect(() => {
    const orientation = window.screen?.orientation as
      | (ScreenOrientation & { lock?: (o: string) => Promise<void> })
      | undefined;
    if (!orientation || typeof orientation.lock !== "function") return;

    const target =
      getDeviceClass() === "phone"
        ? "portrait"
        : getDeviceClass() === "tablet"
        ? "landscape"
        : null;
    if (!target) return;

    orientation.lock(target).catch(() => {
      /* Unsupported or not permitted (e.g. iOS, or not fullscreen) — ignore. */
    });
  }, []);
}
