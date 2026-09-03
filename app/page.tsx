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
import useOrientationLock from "@/app/hooks/useOrientationLock";
import useDisableEdgeSwipeNav from "@/app/hooks/useDisableEdgeSwipeNav";
import ForcedOrientation from "@/app/components/ForcedOrientation";
import MobileTabHeader from "@/app/components/MobileTabHeader";
import MobileHeader from "@/app/components/MobileFooter";
import MobileGifStrip from "@/app/components/MobileGifStrip";
import { useLayoutMode } from "@/app/hooks/useDeviceClass";

// How long to keep the main screen hidden after starting a back: long enough for
// the strip to slide up and the project view to leave, so everything clears out
// cleanly before the header slides in and the projects follow.
const EXIT_MS = 340;

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNames, setShowNames] = useState(false);
  const [mobilePane, setMobilePane] = useState<"main" | "aside">("main");
  // Phones and portrait tablets share one layout; desktop and landscape tablets
  // share the other.
  const isPhoneLayout = useLayoutMode() === "phone";
  const [stripMounted, setStripMounted] = useState(false);
  // Gates the main screen so it stays hidden while the project view slides out,
  // then reveals it (header first, projects after) once the exit has finished.
  const [mainVisible, setMainVisible] = useState(true);

  useOrientationLock();
  useDisableEdgeSwipeNav();
  const stripTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const selectedProjectRef = useRef(selectedProject);
  const isReturning = useRef(false);
  const hasHistoryEntry = useRef(false);

  useEffect(() => { selectedProjectRef.current = selectedProject; }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      clearTimeout(closeTimer.current);
      setMainVisible(true);
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

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // Clear the "returning" flag once the back animations have settled. LeftPanel's
  // onAnimationComplete only covers desktop, so this timer covers phone/tablet too
  // (otherwise later tab switches would keep using the slower return timing).
  useEffect(() => {
    if (selectedProject || !isReturning.current) return;
    const t = setTimeout(() => { isReturning.current = false; }, 800);
    return () => clearTimeout(t);
  }, [selectedProject]);

  // Back: slide everything out cleanly first — strip up + project view leaving —
  // while the main screen stays hidden, then reveal it (header slides in, projects
  // follow after their delay). Guard against a stray popstate when already on main.
  function beginClose() {
    if (!selectedProjectRef.current) return;
    isReturning.current = true;
    hasHistoryEntry.current = false;
    setMainVisible(false);
    setStripMounted(false);
    setSelectedProject(null);
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMainVisible(true), EXIT_MS);
  }

  useEffect(() => {
    window.addEventListener("popstate", beginClose);
    return () => window.removeEventListener("popstate", beginClose);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    if (hasHistoryEntry.current) {
      window.history.back();
    } else {
      beginClose();
    }
  }

  return (
    <ForcedOrientation>
      <div className="h-full w-full overflow-hidden flex flex-col relative">
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
        {!isPhoneLayout && (
          <AnimatePresence>
            {!selectedProject && mainVisible && (
              <motion.div
                key="left-panel"
                initial={isReturning.current ? { x: "-100%" } : false}
                animate={{
                  x: 0,
                  opacity: 1,
                  transition: {
                    delay: 0,
                    type: "spring",
                    stiffness: 340,
                    damping: 32,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.3 },
                }}
                className="shrink-0 h-full w-[27.5%]"
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
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        <AnimatePresence>
          {!selectedProject && mainVisible && (
            <motion.div
              key="main-panel"
              className="flex-1 min-w-0 h-full"
              initial={false}
              animate={{ opacity: 1 }}
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
                topOverlay={isPhoneLayout ? <MobileHeader isReturning={isReturning.current} /> : undefined}
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
                ) : isPhoneLayout ? (
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

      {isPhoneLayout && !selectedProject && mainVisible && (
        <motion.div
          initial={isReturning.current ? { y: "100%", opacity: 0 } : false}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          className="shrink-0 relative"
        >
          <MobileGifStrip />
          <MobileTabHeader activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>
      )}
      </div>
    </ForcedOrientation>
  );
}
