"use client";

import { motion, LayoutGroup, AnimatePresence } from "motion/react";
import { TABS, Tab, TAB_COUNTS } from "@/app/view/MainPanel";
import ViewModeToggle from "@/app/components/ViewModeToggle";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showNames: boolean;
  onShowNamesChange: (v: boolean) => void;
  viewMode: "draw" | "code" | null;
  onViewModeChange: (mode: "draw" | "code" | null) => void;
};

export default function NavTabs({ activeTab, onTabChange, showNames, onShowNamesChange, viewMode, onViewModeChange }: Props) {
  const isArtistMind = activeTab === "ARTIST MIND";

  return (
    <>
      <LayoutGroup>
        <div className="flex flex-col px-[5px] py-[12px]">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
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
            );
          })}
        </div>
      </LayoutGroup>

      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center gap-[6px]"
          animate={{ scale: isArtistMind ? 0.8 : 1, opacity: isArtistMind ? 0 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ pointerEvents: isArtistMind ? "none" : "auto" }}
        >
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          <AnimatePresence>
            {viewMode && (
              <motion.button
                onClick={() => onViewModeChange(null)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className=" flex items-center justify-center text-text-links hover:text-text-primary transition-colors cursor-pointer"
              >
                <span
                  className="bg-current"
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
          onClick={() => onShowNamesChange(!showNames)}
          className={`py-[8px] px-[10px] rounded-full bg-divider/15 flex items-center justify-center font-urbanist font-medium text-[14px] tracking-[0.02em] transition-colors cursor-pointer ${showNames ? "text-text-primary" : "text-text-links hover:text-text-primary"}`}
        >
          Aa
        </button>
      </div>
    </>
  );
}
