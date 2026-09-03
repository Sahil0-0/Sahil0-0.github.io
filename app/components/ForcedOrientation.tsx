"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { getDeviceClass, getLayoutMode, type DeviceClass } from "@/app/hooks/useDeviceClass";

type Orientation = "portrait" | "landscape";

const REQUIRED_ORIENTATION: Record<DeviceClass, Orientation | null> = {
  phone: "portrait",
  tablet: null, // free to rotate — each orientation has its own layout
  desktop: null, // unrestricted
};

/**
 * Forces the app into a fixed orientation by rotating the whole UI 90° when the
 * device is held the "wrong" way — phones stay portrait, while tablets and
 * desktop are untouched. Because a transformed ancestor becomes the containing
 * block for `position: fixed` descendants, any fixed overlay rotates with it.
 */
export default function ForcedOrientation({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<CSSProperties | null>(null);

  useEffect(() => {
    const update = () => {
      const deviceClass = getDeviceClass();
      // Published so CSS can target a device class without guessing from viewport
      // width, which is unreliable once the UI is force-rotated. `device` is the
      // physical class (for touch affordances); `layout` is which of the two
      // layouts is showing, which is what a tablet flips between as it rotates.
      document.documentElement.dataset.device = deviceClass;
      document.documentElement.dataset.layout = getLayoutMode();

      const need = REQUIRED_ORIENTATION[deviceClass];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const current: Orientation = vh >= vw ? "portrait" : "landscape";

      if (!need || need === current) {
        setStyle(null);
        return;
      }

      const base: CSSProperties = {
        position: "fixed",
        left: 0,
        width: `${vh}px`,
        height: `${vw}px`,
        overflow: "hidden",
      };

      if (need === "portrait") {
        // Device is landscape → rotate content to display as portrait.
        setStyle({
          ...base,
          top: `${vh}px`,
          transform: "rotate(-90deg)",
          transformOrigin: "left top",
        });
      } else {
        // Device is portrait → rotate content to display as landscape.
        setStyle({
          ...base,
          top: `${-vw}px`,
          transform: "rotate(90deg)",
          transformOrigin: "bottom left",
        });
      }
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  if (!style) return <>{children}</>;
  return <div style={style}>{children}</div>;
}
