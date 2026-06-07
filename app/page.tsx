"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LeftPanel from "@/app/view/LeftPanel";
import MainPanel from "@/app/view/MainPanel";
import { Tab, TABS } from "@/app/config/constants";
import ProjectStrip from "@/app/view/projects/ProjectStrip";
import ProjectMain from "@/app/view/projects/ProjectMain";
import ProjectAside from "@/app/view/projects/ProjectAside";
import { Project } from "@/app/config/projects";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [viewMode, setViewMode] = useState<"draw" | "code" | null>(null);
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
              <LeftPanel
                isReturning={isReturning.current}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showNames={showNames}
                onShowNamesChange={setShowNames}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
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
                onProjectSelect={setSelectedProject}
                showNames={showNames}
                viewMode={viewMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              key="project-panels"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="w-full h-full overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {selectedProject.tags.includes("art") ? (
                  <motion.div
                    key="art-view"
                    className="w-full h-full"
                    initial={{ x: "100%" }}
                    animate={{ x: 0, transition: { type: "spring", stiffness: 340, damping: 32, delay: 0.6 } }}
                    exit={{ x: "-100%", transition: { duration: 0.28, ease: "easeIn" } }}
                  >
                    <ProjectMain project={selectedProject} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="code-view"
                    className="w-full h-full flex overflow-hidden"
                    initial="enter"
                    animate="show"
                    exit="exit"
                    variants={{ enter: {}, show: {}, exit: { transition: { duration: 0.28 } } }}
                  >
                    <motion.div
                      className="flex-[3] min-w-0 h-full"
                      variants={{
                        enter: { x: "-100%", y: 0 },
                        show: { x: 0, y: 0, transition: { type: "spring", stiffness: 340, damping: 32, delay: 0.6 } },
                        exit: { x: "-100%", y: 0, transition: { duration: 0.28, ease: "easeIn" } },
                      }}
                    >
                      <ProjectMain project={selectedProject} />
                    </motion.div>
                    <motion.div
                      className="flex-[2] min-w-0 h-full"
                      variants={{
                        enter: { x: "100%", y: 0 },
                        show: { x: 0, y: 0, transition: { type: "spring", stiffness: 340, damping: 32, delay: 0.6 } },
                        exit: { x: "100%", y: 0, transition: { duration: 0.28, ease: "easeIn" } },
                      }}
                    >
                      <ProjectAside project={selectedProject} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
