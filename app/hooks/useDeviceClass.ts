"use client";

import { useEffect, useState } from "react";

export type DeviceClass = "phone" | "tablet" | "desktop";

/**
 * Which of the two layouts a device is showing. Tablets have no layout of
 * their own — they borrow one based on how they're being held.
 */
export type LayoutMode = "phone" | "desktop";

export function getDeviceClass(): DeviceClass {
  if (!window.matchMedia("(pointer: coarse)").matches) return "desktop";
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  if (shortEdge <= 600) return "phone";
  if (shortEdge <= 1024) return "tablet";
  return "desktop";
}

/**
 * Resolves the device class to the layout it should render. Phones and desktops
 * map to their namesakes; a tablet follows its orientation — portrait gets the
 * phone layout, landscape gets the desktop one — so it re-lays-out as it turns.
 */
export function getLayoutMode(): LayoutMode {
  const device = getDeviceClass();
  if (device !== "tablet") return device;
  return window.innerHeight >= window.innerWidth ? "phone" : "desktop";
}

export default function useDeviceClass(): DeviceClass {
  const [deviceClass, setDeviceClass] = useState<DeviceClass>("desktop");

  useEffect(() => {
    const update = () => setDeviceClass(getDeviceClass());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return deviceClass;
}

export function useLayoutMode(): LayoutMode {
  const [layout, setLayout] = useState<LayoutMode>("desktop");

  useEffect(() => {
    const update = () => setLayout(getLayoutMode());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return layout;
}
