"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, Project } from "@/app/config/projects";

export const TABS = ["WORK", "PLAYGROUND", "ARTIST MIND"] as const;
export type Tab = (typeof TABS)[number];

const TAB_TAG: Record<Tab, string> = {
  "WORK": "work",
  "PLAYGROUND": "projects",
  "ARTIST MIND": "art",
};

const VIEW_MODE_TAG: Record<"draw" | "code", string> = {
  draw: "design",
  code: "code",
};

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  selectedProject: Project | null;
  onProjectSelect: (project: Project | null) => void;
  isReturning?: boolean;
  showNames: boolean;
  viewMode: "draw" | "code" | null;
};

export function getUnique(...tags: string[]) {
  const seen = new Set<string>();
  return projects.filter((p) => {
    if (!tags.every((t) => p.tags.includes(t))) return false;
    if (seen.has(p.image)) return false;
    seen.add(p.image);
    return true;
  });
}

export const TAB_COUNTS: Record<Tab, number> = {
  "WORK": getUnique("work").length,
  "PLAYGROUND": getUnique("projects").length,
  "ARTIST MIND": getUnique("art").length,
};

export default function MainPanel({ activeTab, selectedProject: _selectedProject, onProjectSelect, isReturning = false, showNames, viewMode }: Props) {
  const isInitialMount = useRef(true);
  useEffect(() => { isInitialMount.current = false; }, []);
  const isArtistMind = activeTab === "ARTIST MIND";
  const filtered = isArtistMind
    ? getUnique("art")
    : viewMode
    ? getUnique(TAB_TAG[activeTab], VIEW_MODE_TAG[viewMode])
    : getUnique(TAB_TAG[activeTab]);

  const baseDelay = (!isReturning && isInitialMount.current) ? 0.62 : 0;

  return (
    <main className="flex-1 min-w-0 h-full overflow-y-auto no-scrollbar">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridAutoRows: "clamp(180px, 17vw, 300px)",
          gridAutoFlow: "dense",
          alignContent: "stretch",
          paddingBlockStart: "24px",
          paddingBlockEnd: "24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          rowGap: "24px",
          columnGap: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          minHeight: "100%",
        }}
      >
        <AnimatePresence mode="popLayout">
        {filtered.map((project, i) => (
          <motion.div
            key={`${project.image}-${activeTab}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, transition: { type: "spring", stiffness: 500, damping: 28, delay: i * 0.01 } }}
            transition={{ type: "spring", stiffness: 500, damping: 22, delay: baseDelay + i * 0.04 }}
            className="overflow-hidden rounded-2xl group relative cursor-pointer"
            style={{ gridColumn: `span ${project.span ?? 1}` }}
            onClick={() => onProjectSelect(project)}
          >
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            />
            <span
              className={`absolute bottom-[8px] left-[8px] font-inter text-[11px] py-[4px] px-[8px] rounded-[8px] font-medium uppercase tracking-[0.08em] text-white pointer-events-none bg-background-dark/75 transition-all duration-200 translate-y-0
                ${showNames ? "opacity-100" : "opacity-0 translate-y-[6px] group-hover:opacity-100 group-hover:translate-y-0"}`}
            >
              {project.name}
            </span>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
