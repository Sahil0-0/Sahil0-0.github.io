"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects, Project } from "@/app/config/projects";
import CornerBrackets from "@/app/components/CornerBrackets";
import ViewModeToggle from "@/app/components/ViewModeToggle";
import { VIEW_MODE_TAG } from "@/app/config/constants";

type Props = {
  selected: Project;
  onSelect: (project: Project) => void;
  onClose: () => void;
};

export default function ProjectStrip({ selected, onSelect, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"draw" | "code" | null>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
  }, []);

  const filtered = viewMode
    ? projects.filter((p) => p.tags.includes(VIEW_MODE_TAG[viewMode]))
    : projects;

  const byYear = filtered.reduce<Record<number, Project[]>>((acc, p) => {
    (acc[p.year] ??= []).push(p);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

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
      className="w-full bg-background flex items-stretch shrink-0 relative"
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-divider"
        style={{ animation: "drawLineLeft 1.5s ease 0.6s both" }}
        exit={{ clipPath: "inset(0 100% 0 0)", transition: { duration: 0.12, ease: "easeIn" } }}
      />

      <div className="strip-close flex items-center gap-[8px] p-[32px] max-lg:p-[16px] shrink-0 relative bg-subtitle border-bottom border-divider">
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
            className="absolute w-[40px] h-[4px] bg-background-dark"
          />
          <motion.span
            variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="absolute w-[40px] h-[4px] bg-background-dark"
          />
        </motion.button>
        <motion.div
          className="absolute top-0 right-0 w-px h-full bg-divider"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.12, ease: "easeIn" } }}
        />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto no-scrollbar flex items-center px-[24px] pt-[12px] pb-[18px] pr-[120px] max-lg:px-[14px] max-lg:pr-[64px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode ?? "all"}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1, transition: { type: "spring", stiffness: 420, damping: 26 } }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.12, ease: "easeIn" } }}
            className="flex items-center gap-[32px] max-lg:gap-[18px]"
          >
            {years.map((year) => (
              <div key={year} className="flex flex-col shrink-0 gap-[6px]">
                <span className="font-inter text-[12px] uppercase tracking-[0.1em] text-text-subtitle">
                  {year}
                </span>
                <div className="flex gap-[6px]">
                  {byYear[year].map((project, i) => {
                    const isSelected = selected.image === project.image;
                    return (
                      <motion.div
                        ref={isSelected ? selectedRef : undefined}
                        key={project.image}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: isSelected ? 1 : 0.5, transition: { type: "spring", stiffness: 600, damping: 24, delay: i * 0.03 } }}
                        onClick={() => onSelect(project)}
                        className="relative shrink-0 w-[70px] h-[70px] cursor-pointer group"
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
                        <div className="absolute inset-[5px] rounded-[8px] overflow-hidden">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            priority
                            className={`object-cover transition-[filter] duration-300 ${isSelected ? "" : "grayscale group-hover:grayscale-0"}`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div className="absolute right-[24px] bottom-[14px] max-lg:right-[10px] z-10">
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} variant="strip" />
      </div>
      </div>

      
    </motion.div>
  );
}
