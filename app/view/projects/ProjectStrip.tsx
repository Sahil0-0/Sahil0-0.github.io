"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, Project } from "@/app/config/projects";
import CornerBrackets from "@/app/components/CornerBrackets";

type Props = {
  selected: Project;
  onSelect: (project: Project) => void;
  onClose: () => void;
};

const VIEW_MODE_TAG: Record<"draw" | "code", string> = {
  draw: "design",
  code: "code",
};

export default function ProjectStrip({ selected, onSelect, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"draw" | "code" | null>(null);

  const filtered = viewMode
    ? projects.filter((p) => p.tags.includes(VIEW_MODE_TAG[viewMode]))
    : projects;

  const byYear = filtered.reduce<Record<number, Project[]>>((acc, p) => {
    (acc[p.year] ??= []).push(p);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  }

  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{
        y: 0,
        transition: {
          delay: 0,
          type: "spring",
          stiffness: 340,
          damping: 32,
        },
      }}
      exit={{ y: "-100%", transition: { duration: 0.18, ease: "easeIn", delay: 0.13 } }}
      className="w-[60vw] bg-background flex items-stretch shrink-0 relative"
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-divider"
        style={{ animation: "drawLineLeft 1.5s ease 0.6s both" }}
        exit={{ clipPath: "inset(0 100% 0 0)", transition: { duration: 0.12, ease: "easeIn" } }}
      />

      <div className="flex items-center gap-[8px] p-[32px] shrink-0 relative bg-background-dark">
        <motion.button
          initial="rest"
          whileHover="hover"
          onClick={onClose}
          variants={{
            rest: { color: "var(--divider)" },
            hover: { color: "var(--background)" },
          }}
          transition={{ duration: 0.15 }}
          className="relative w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
        >
          <motion.span
            variants={{ rest: { rotate: 0 }, hover: { rotate: 45 } }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="absolute w-[40px] h-[4px] bg-background"
          />
          <motion.span
            variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="absolute w-[40px] h-[4px] bg-background"
          />
        </motion.button>
        <motion.div
          className="absolute top-0 right-0 w-px h-screen bg-divider"
          style={{ animation: "drawLineDown 3s ease 2s both" }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.12, ease: "easeIn" } }}
        />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-[32px] px-[24px] pt-[12px] pb-[18px]"
      >
        <AnimatePresence mode="popLayout">
        {years.map((year) => (
          <motion.div
            key={year}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 24 } }}
            exit={{ scale: 0.85, opacity: 0, transition: { type: "spring", stiffness: 420, damping: 24 } }}
            className="flex flex-col shrink-0 gap-[6px]"
          >
            <span className="font-inter text-[12px] uppercase tracking-[0.1em] text-text-subtitle">
              {year}
            </span>
            <div className="flex gap-[6px]">
              <AnimatePresence mode="popLayout">
              {byYear[year].map((project, i) => {
                const isSelected = selected.image === project.image;
                return (
                  <motion.div
                    key={project.image}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 22, delay: i * 0.04 } }}
                    exit={{ scale: 0, opacity: 0, transition: { type: "spring", stiffness: 420, damping: 22 } }}
                    className="relative shrink-0 w-[70px] h-[70px] flex items-center justify-center"
                  >
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 z-10"
                        >
                          <CornerBrackets />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => onSelect(project)}
                      className={`relative w-[60px] h-[60px] rounded-[8px] overflow-hidden transition-all duration-200 cursor-pointer ${
                        isSelected ? "opacity-100" : "opacity-50 hover:opacity-75"
                      }`}
                    >
                      <Image
                        src={project.image}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      <div className="absolute right-[24px] bottom-[14px] flex items-center gap-[10px] z-10">
        <div className="flex items-center bg-divider/15 rounded-full p-[3px] gap-[2px]">
          {(["draw", "code"] as const).map((mode) => {
            const isActive = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(viewMode === mode ? null : mode)}
                className={`w-[30px] h-[30px] flex items-center justify-center rounded-[99px] transition-all cursor-pointer ${
                  isActive ? "bg-background text-text-primary" : "text-text-links hover:text-text-primary"
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
      </div>
    </motion.div>
  );
}
