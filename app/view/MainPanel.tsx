"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, LayoutGroup, AnimatePresence } from "motion/react";
import { projects, Project } from "@/app/config/projects";
import Plus from "@/app/components/Plus";

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
};

function getUnique(...tags: string[]) {
  const seen = new Set<string>();
  return projects.filter((p) => {
    if (!tags.every((t) => p.tags.includes(t))) return false;
    if (seen.has(p.image)) return false;
    seen.add(p.image);
    return true;
  });
}

const TAB_COUNTS: Record<Tab, number> = {
  "WORK": getUnique("work").length,
  "PLAYGROUND": getUnique("projects").length,
  "ARTIST MIND": getUnique("art").length,
};

export default function MainPanel({ activeTab, onTabChange, selectedProject: _selectedProject, onProjectSelect, isReturning = false }: Props) {
  const [viewMode, setViewMode] = useState<"draw" | "code" | null>(null);
  const isInitialMount = useRef(true);
  useEffect(() => { isInitialMount.current = false; }, []);
  const [showNames, setShowNames] = useState(false);
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
          gridAutoRows: "250px",
          gridAutoFlow: "dense",
          paddingBlockStart: "24px",
          paddingBlockEnd: "24px",
          paddingLeft: "24px",
          paddingRight: "24px",
          rowGap: "24px",
          columnGap: "24px",
        }}
      >
        <motion.div
          className="flex flex-col justify-between px-[4px]"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 28, delay: baseDelay }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.18, ease: "easeIn" } }}
        >
          <div className="flex justify-between">
            <Plus />
            <Plus />
          </div>

          <LayoutGroup>
          <div className="flex flex-col justify-between px-[5px] py-[12px]">
            {TABS.map((tab, tabIdx) => {
              const isActive = activeTab === tab;
              return (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 340, damping: 28, delay: baseDelay + tabIdx * 0.07 }}
                  className="w-full"
                >
                <button
                  onClick={() => onTabChange(tab)}
                  className="relative w-full flex items-center justify-between px-[12px] py-[12px] cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-corners"
                      className="absolute inset-0 pointer-events-none"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                      <span className="absolute top-[5px] left-0 w-[7px] h-[7px] border-t border-l border-text-primary" />
                      <span className="absolute top-[5px] right-0 w-[7px] h-[7px] border-t border-r border-text-primary" />
                      <span className="absolute bottom-[5px] left-0 w-[7px] h-[7px] border-b border-l border-text-primary" />
                      <span className="absolute bottom-[5px] right-0 w-[7px] h-[7px] border-b border-r border-text-primary" />
                    </motion.div>
                  )}
                  <span
                    className="text-[14px] uppercase tracking-[0.08em] font-urbanist font-medium py-[4px]"
                    style={{ color: isActive ? "var(--text-primary)" : "var(--text-links)" }}
                  >
                    {tab}
                  </span>
                  <span
                    className="font-inter text-[14px] leading-none"
                    style={{
                      color: isActive ? "var(--text-primary)" : "var(--text-links)",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "0.04em",
                      fontWeight: 300,
                    }}
                  >
                    {String(TAB_COUNTS[tab]).padStart(2, "0")}
                  </span>
                </button>
                </motion.div>
              );
            })}
          </div>
          </LayoutGroup>

          <div className="flex items-center justify-between px-[5px] pb-[8px]">
            <motion.div
              className="flex items-center gap-[6px]"
              animate={{ scale: isArtistMind ? 0.8 : 1, opacity: isArtistMind ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{ pointerEvents: isArtistMind ? "none" : "auto" }}
            >
              <div className="flex items-center bg-divider/15 rounded-full p-[3px] gap-[2px]">
              {(["code", "draw"] as const).map((mode) => {
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => setViewMode(viewMode === mode ? null : mode)}
                    className={`w-[34px] h-[34px] flex items-center justify-center rounded-full transition-all cursor-pointer ${
                      isActive ? "bg-background" : "text-text-links hover:text-text-primary"
                    }`}
                  >
                    <span
                      className="w-[16px] h-[16px] bg-current transition-colors"
                      style={{
                        maskImage: `url('/icons/${mode}Icon.svg')`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskImage: `url('/icons/${mode}Icon.svg')`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                      }}
                    />
                  </button>
                );
              })}
            </div>
              <AnimatePresence>
                {viewMode && (
                  <motion.button
                    onClick={() => setViewMode(null)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-[16px] h-[16px] flex items-center justify-center text-text-links hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <span
                      className="w-[10px] h-[10px] bg-current"
                      style={{
                        maskImage: "url('/icons/crossicon.svg')",
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        WebkitMaskImage: "url('/icons/crossicon.svg')",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                      }}
                    />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
            <button
              onClick={() => setShowNames((v) => !v)}
              className={`w-[38px] h-[38px] rounded-[99px] bg-divider/15 flex items-center justify-center font-urbanist font-medium text-[14px] tracking-[0.02em] transition-colors cursor-pointer ${showNames ? "text-text-primary bg-divider/15" : "text-text-links hover:text-text-primary"}`}
            >
              Aa
            </button>
          </div>


        </motion.div>

        {filtered.map((project, i) => {
          return (
          <motion.div
            key={`${project.image}-${activeTab}`}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 28, delay: baseDelay + i * 0.04 }}
            exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.15, ease: "easeIn", delay: i * 0.015 } }}
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
          );
        })}
      </div>
    </main>
  );
}
