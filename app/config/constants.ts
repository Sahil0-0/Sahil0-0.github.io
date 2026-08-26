import { getUnique } from "@/app/config/projects";

export const TABS = ["WORK", "ARTIST MIND", "PLAYGROUND"] as const;
export type Tab = (typeof TABS)[number];

export const TAB_LABELS: Record<Tab, string> = {
  "WORK": "WORK",
  "ARTIST MIND": "ART",
  "PLAYGROUND": "PLAYGROUND",
};

export const TAB_TAG: Record<Tab, string> = {
  "WORK": "work",
  "PLAYGROUND": "projects",
  "ARTIST MIND": "art",
};

export const TAB_COUNTS: Record<Tab, number> = {
  "WORK": getUnique("work").length,
  "PLAYGROUND": getUnique("projects").length,
  "ARTIST MIND": getUnique("art").length,
};

export const EMAIL = "codedbysahil@gmail.com";

export const PROFILE = {
  image: "/images/profileImage.png",
  name: "Sahil Singh",
  roles: ["Design Engineer"],
};

export const PART_TIME_ROLES = ["Artist", "Gamer", "Lyricist", "Designer", "Dreamer"];

export const LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/codedbysahil", external: true },
  { label: "GitHub", href: "https://github.com/Sahil0-0", external: true },
  { label: "Resume", href: "/resume.pdf", external: false },
];

export const WORK_ICONS = [
  "/icons/work/Frame.svg",
  "/icons/work/Frame-1.svg",
  "/icons/work/Frame-2.svg",
  "/icons/work/Frame-3.svg",
  "/icons/work/Frame-4.svg",
  "/icons/work/Frame-5.svg",
  "/icons/work/Frame-6.svg",
  "/icons/work/Frame-7.svg",
  "/icons/work/Frame-8.svg",
  "/icons/work/Frame-9.svg",
  "/icons/work/Frame-10.svg",
  "/icons/work/Frame-11.svg",
];
