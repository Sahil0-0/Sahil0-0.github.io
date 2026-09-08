"use client";

import Image from "next/image";
import { useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Project } from "@/app/config/projects";
import { getUnique, packBySpan } from "@/app/config/projects";
import { Tab, TAB_TAG } from "@/app/config/constants";

let clientSeed: number | null = null;
const getClientSeed = () => (clientSeed ??= Math.floor(Math.random() * 2 ** 31));
const subscribeNever = () => () => {};

type Props = {
  activeTab: Tab;
  onProjectSelect: (project: Project | null) => void;
  isReturning?: boolean;
  showNames: boolean;
  topOverlay?: React.ReactNode;
};

export default function MainPanel({ activeTab, onProjectSelect, isReturning = false, showNames, topOverlay }: Props) {
  const isInitialMount = useRef(true);
  const scrollRef = useRef<HTMLElement>(null);
  useEffect(() => { isInitialMount.current = false; }, []);
  const packSeed = useSyncExternalStore(subscribeNever, getClientSeed, () => 0);
  const filtered = useMemo(() => packBySpan(getUnique(TAB_TAG[activeTab]), packSeed), [activeTab, packSeed]);

  const baseDelay = isReturning ? 0.4 : isInitialMount.current ? 0.62 : 0;
  const enterDuration = isReturning ? 0.55 : 0.4;
  const enterStagger = isReturning ? 0.1 : 0.1;
  const enterEase = [0.22, 1, 0.36, 1] as const;

  return (
    <main ref={scrollRef} className="main-scroll flex-1 min-w-0 h-full overflow-y-auto no-scrollbar isolate" style={{ transform: "translateZ(0)" }}>
      {topOverlay}
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scrollRef.current?.scrollTo({ top: 0 });
        }}
      >
        <motion.div
          key={activeTab}
          className="project-grid no-scrollbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, delay: baseDelay } }}
          exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project.image}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: enterDuration, ease: enterEase, delay: baseDelay + i * enterStagger },
              }}
              className="overflow-hidden rounded-2xl group relative cursor-pointer"
              style={{
                gridColumn: `span ${project.span ?? 1}`,
                "--span": project.span ?? 1,
              } as React.CSSProperties}
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
              <div
                className={`absolute bottom-[8px] right-[8px] flex flex-col items-end gap-[4px] pointer-events-none transition-all duration-200 translate-y-0
                  ${showNames ? "opacity-100" : "opacity-0 translate-y-[6px] group-hover:opacity-100 group-hover:translate-y-0"}`}
              >
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-inter text-[11px] py-[4px] px-[8px] rounded-[8px] font-medium uppercase tracking-[0.08em] text-white bg-background-dark/75"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
