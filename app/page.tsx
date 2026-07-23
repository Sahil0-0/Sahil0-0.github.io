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
import useIsMobile from "@/app/hooks/useIsMobile";
import useOrientationLock from "@/app/hooks/useOrientationLock";
import ForcedOrientation from "@/app/components/ForcedOrientation";

const SHOW_DEV_BANNER = true;

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [viewMode, setViewMode] = useState<"draw" | "code" | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<"main" | "aside">("main");
  const isMobile = useIsMobile();
  const [stripMounted, setStripMounted] = useState(false);

  useOrientationLock();
  const stripTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isReturning = useRef(false);
  const hasHistoryEntry = useRef(false);

  useEffect(() => {
    if (selectedProject) {
      setDrawerOpen(false);
      setMobilePane("main");
      stripTimer.current = setTimeout(() => setStripMounted(true), 490);
      if (!hasHistoryEntry.current) {
        window.history.pushState({ projectOpen: true }, "");
        hasHistoryEntry.current = true;
      }
    } else {
      clearTimeout(stripTimer.current);
      setStripMounted(false);
      hasHistoryEntry.current = false;
    }
    return () => clearTimeout(stripTimer.current);
  }, [selectedProject]);

  useEffect(() => {
    function onPopState() {
      isReturning.current = true;
      setSelectedProject(null);
      hasHistoryEntry.current = false;
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function handleClose() {
    if (hasHistoryEntry.current) {
      window.history.back();
    } else {
      isReturning.current = true;  
      setSelectedProject(null);
    }
  }

  return (
    <ForcedOrientation>
      <div className="h-full w-full overflow-hidden flex flex-col relative">
      {SHOW_DEV_BANNER && (
        <div className="shrink-0 bg-divider/15 text-text-su text-center text-xs font-semibold tracking-widest uppercase py-1.5 px-4 border-b border-divider">
          Development under progress
        </div>
      )}
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
        {!isMobile && (
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
        )}

        {isMobile && !selectedProject && (
          <>
            <button
              aria-label="Open menu"
              onClick={() => setDrawerOpen(true)}
              className="absolute top-[12px] left-[12px] z-30 lg:hidden flex flex-col items-center justify-center gap-[5px] w-[42px] h-[42px] rounded-full bg-background/80 backdrop-blur border border-divider/40"
            >
              <span className="block w-[18px] h-[2px] bg-text-primary" />
              <span className="block w-[18px] h-[2px] bg-text-primary" />
              <span className="block w-[18px] h-[2px] bg-text-primary" />
            </button>

            <AnimatePresence>
              {drawerOpen && (
                <>
                  <motion.div
                    key="drawer-backdrop"
                    className="fixed inset-0 z-40 bg-background-dark/40 lg:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setDrawerOpen(false)}
                  />
                  <motion.div
                    key="drawer-panel"
                    className="fixed inset-y-0 left-0 z-40 w-[300px] max-w-[85%] bg-background overflow-y-auto no-scrollbar lg:hidden"
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 340, damping: 34 }}
                  >
                    <LeftPanel
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      showNames={showNames}
                      onShowNamesChange={setShowNames}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}

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
                ) : isMobile ? (
                  <motion.div
                    key="code-view-mobile"
                    className="w-full h-full flex flex-col overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.5, duration: 0.25 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <div className="shrink-0 flex items-center justify-center gap-[6px] py-[10px] lg:hidden">
                      <button
                        onClick={() => setMobilePane("main")}
                        className={`uppercase text-[12px] font-inter font-medium tracking-[0.08em] px-[16px] py-[8px] rounded-full transition-colors ${mobilePane === "main" ? "bg-divider/15 text-text-primary" : "text-text-links"}`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setMobilePane("aside")}
                        className={`uppercase text-[12px] font-inter font-medium tracking-[0.08em] px-[16px] py-[8px] rounded-full transition-colors ${mobilePane === "aside" ? "bg-divider/15 text-text-primary" : "text-text-links"}`}
                      >
                        Details
                      </button>
                    </div>
                    <div className="flex-1 min-h-0">
                      {mobilePane === "main" ? (
                        <ProjectMain project={selectedProject} />
                      ) : (
                        <ProjectAside project={selectedProject} />
                      )}
                    </div>
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
    </ForcedOrientation>
  );
}
