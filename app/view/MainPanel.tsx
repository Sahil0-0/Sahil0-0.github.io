"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "@/app/config/projects";
import { getUnique } from "@/app/config/projects";
import { Tab, TAB_TAG, VIEW_MODE_TAG } from "@/app/config/constants";

type Props = {
  activeTab: Tab;
  onProjectSelect: (project: Project | null) => void;
  isReturning?: boolean;
  showNames: boolean;
  viewMode: "draw" | "code" | null;
};

export default function MainPanel({ activeTab, onProjectSelect, isReturning = false, showNames, viewMode }: Props) {
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
      <div className="project-grid">
        <AnimatePresence mode="popLayout">
        {filtered.map((project, i) => (
          <motion.div
            key={`${project.image}-${activeTab}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15, ease: "easeIn", delay: i * 0.01 } }}
            transition={{ duration: 0.22, ease: "easeOut", delay: baseDelay + i * 0.02 }}
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
