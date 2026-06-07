import { getUnique } from "@/app/config/projects";

export const TABS = ["WORK", "PLAYGROUND", "ARTIST MIND"] as const;
export type Tab = (typeof TABS)[number];

export const TAB_TAG: Record<Tab, string> = {
  "WORK": "work",
  "PLAYGROUND": "projects",
  "ARTIST MIND": "art",
};

export const VIEW_MODE_TAG: Record<"draw" | "code", string> = {
  draw: "design",
  code: "code",
};

export const TAB_COUNTS: Record<Tab, number> = {
  "WORK": getUnique("work").length,
  "PLAYGROUND": getUnique("projects").length,
  "ARTIST MIND": getUnique("art").length,
};
