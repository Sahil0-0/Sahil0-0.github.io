"use client";

import { useEffect } from "react";
import { PROFILE, TABS, TAB_TAG, WORK_ICONS } from "@/app/config/constants";
import { getUnique } from "@/app/config/projects";

const ARROW_ICON = "/icons/arrowLink.svg";
const GIF_CONFIG = "/gifs/config.json";

const tileImages = (tab: (typeof TABS)[number]) =>
  getUnique(TAB_TAG[tab]).map((p) => p.image);
function homeAssets() {
  const [firstTab, ...otherTabs] = TABS;
  const critical = [PROFILE.image, ARROW_ICON, ...WORK_ICONS, ...tileImages(firstTab)];
  const rest = otherTabs.flatMap(tileImages).filter((src) => !critical.includes(src));
  return { critical, rest: [...new Set(rest)] };
}
const warm = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

export default function useHomeAssetPreload() {
  useEffect(() => {
    let cancelled = false;
    const { critical, rest } = homeAssets();

    Promise.all(critical.map(warm)).then(() => {
      if (!cancelled) rest.forEach(warm);
    });
    fetch(GIF_CONFIG).catch(() => {});

    return () => { cancelled = true; };
  }, []);
}
