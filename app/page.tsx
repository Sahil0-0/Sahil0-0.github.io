"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LeftPanel from "@/app/view/LeftPanel";
import MainPanel, { Tab, TABS } from "@/app/view/MainPanel";
import ProjectStrip from "@/app/view/projects/ProjectStrip";
import ProjectMain from "@/app/view/projects/ProjectMain";
import ProjectAside from "@/app/view/projects/ProjectAside";
import { Project } from "@/app/config/projects";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stripMounted, setStripMounted] = useState(false);
  const stripTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isReturning = useRef(false);

  useEffect(() => {
    if (selectedProject) {
      stripTimer.current = setTimeout(() => setStripMounted(true), 490);
    } else {
      clearTimeout(stripTimer.current);
      setStripMounted(false);
    }
    return () => clearTimeout(stripTimer.current);
  }, [selectedProject]);

  function handleClose() {
    isReturning.current = true;
    setSelectedProject(null);
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col relative">
      <AnimatePresence>
        {(stripMounted && selectedProject) && (
          <ProjectStrip
            selected={selectedProject}
            onSelect={setSelectedProject}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            key="project-vline"
            className="absolute top-0 left-[60vw] w-px h-full bg-divider z-10 pointer-events-none"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)", transition: { delay: 0.75, duration: 1.5, ease: "easeOut" } }}
            exit={{ clipPath: "inset(100% 0 0 0)", transition: { duration: 0.12, ease: "easeIn" } }}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 min-h-0 flex relative">
        <AnimatePresence>
          {!selectedProject && (
            <motion.div
              key="left-panel"
              initial={isReturning.current ? { x: "-100%" } : false}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  delay: isReturning.current ? 0.25 : 0,
                  type: "spring",
                  stiffness: 340,
                  damping: 32,
                },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.3 },
              }}
              className="shrink-0 h-full w-1/4"
              onAnimationComplete={() => {
                isReturning.current = false;
              }}
            >
              <LeftPanel isReturning={isReturning.current} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!selectedProject && (
            <motion.div
              key="main-panel"
              className="flex-1 min-w-0 h-full"
              initial={isReturning.current ? { y: "100%" } : false}
              animate={{
                y: 0,
                opacity: 1,
                transition: {
                  delay: isReturning.current ? 0.25 : 0,
                  type: "spring",
                  stiffness: 340,
                  damping: 32,
                },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.3 },
              }}
            >
              <MainPanel
                isReturning={isReturning.current}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                selectedProject={selectedProject}
                onProjectSelect={setSelectedProject}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              key="project-panels"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.5, duration: 0.25 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="w-full h-full flex"
            >
              <div className="flex-[3] min-w-0 h-full">
                <ProjectMain project={selectedProject} />
              </div>
              <div className="flex-[2] min-w-0 h-full relative">
                <ProjectAside project={selectedProject} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
