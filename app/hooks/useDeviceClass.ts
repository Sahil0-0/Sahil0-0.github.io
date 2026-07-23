"use client";

import { useEffect, useState } from "react";

export type DeviceClass = "phone" | "tablet" | "desktop";

export function getDeviceClass(): DeviceClass {
  if (!window.matchMedia("(pointer: coarse)").matches) return "desktop";
  const shortEdge = Math.min(window.innerWidth, window.innerHeight);
  if (shortEdge <= 600) return "phone";
  if (shortEdge <= 1024) return "tablet";
  return "desktop";
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
